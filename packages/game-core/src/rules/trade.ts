import { GameState, Player, TradeOffer } from "../state/index.js";
import { PublicEvent } from "../events/index.js";
import { getPropertyById } from "game-data";

// Helper to generate IDs
const generateId = (state: GameState) => 'trade_' + (state.public.tradeOffers.length + Date.now()).toString(36);

export function resolveCreateTradeOffer(
    state: GameState,
    player: Player,
    payload: any
): { success: boolean; error?: string; events: PublicEvent[] } {
    const { receiverId, offeredProperties, offeredCash, requestedProperties, requestedCash } = payload;

    // Validate receiver
    if (receiverId === player.id) return { success: false, error: "Cannot trade with yourself", events: [] };
    const receiver = state.public.players.find(p => p.id === receiverId);
    if (!receiver) return { success: false, error: "Receiver not found", events: [] };
    if (receiver.status === "BANKRUPT") return { success: false, error: "Cannot trade with bankrupt player", events: [] };

    // Validate liquidity resolution constraint: "do NOT allow creation of a brand-new trade solicitation during financial crisis"
    if (player.status === "IN_LIQUIDITY_RESOLUTION" || receiver.status === "IN_LIQUIDITY_RESOLUTION") {
        return { success: false, error: "Cannot create a new trade offer while in liquidity resolution", events: [] };
    }

    // Validate ownership (cash & properties)
    if (player.cash < offeredCash) return { success: false, error: "Insufficient cash offered", events: [] };
    for (const propId of offeredProperties) {
        if (!player.ownedProperties.includes(propId)) return { success: false, error: "You do not own offered property", events: [] };
        if (state.public.properties[propId]?.ownerId !== player.id) return { success: false, error: "You do not own offered property", events: [] };
    }
    
    // Validate receiver ownership conceptually (though they might accept later, it's good to check now)
    for (const propId of requestedProperties) {
        if (!receiver.ownedProperties.includes(propId)) return { success: false, error: "Receiver does not own requested property", events: [] };
    }

    const offer: TradeOffer = {
        id: generateId(state),
        senderId: player.id,
        receiverId,
        offeredProperties,
        offeredCash,
        requestedProperties,
        requestedCash,
        status: "PENDING",
        counterOfferCount: 0,
        createdAt: Date.now()
    };

    state.public.tradeOffers.push(offer);

    return {
        success: true,
        events: [{
            type: "TRADE_OFFER_CREATED",
            payload: { offerId: offer.id, senderId: player.id, receiverId },
            timestamp: Date.now()
        }]
    };
}

export function resolveCounterTradeOffer(
    state: GameState,
    player: Player,
    payload: any
): { success: boolean; error?: string; events: PublicEvent[] } {
    const { offerId, offeredProperties, offeredCash, requestedProperties, requestedCash } = payload;
    const offer = state.public.tradeOffers.find(o => o.id === offerId);
    if (!offer) return { success: false, error: "Offer not found", events: [] };

    if (offer.status !== "PENDING") return { success: false, error: "Offer is no longer pending", events: [] };

    // Player making counter must be the current receiver
    if (player.id !== offer.receiverId) return { success: false, error: "You can only counter offers sent to you", events: [] };

    // Liquidity check: no new solicitations (counters count as new negotiation)
    const sender = state.public.players.find(p => p.id === offer.senderId);
    if (!sender) return { success: false, error: "Original sender not found", events: [] };
    if (player.status === "IN_LIQUIDITY_RESOLUTION" || sender.status === "IN_LIQUIDITY_RESOLUTION") {
        return { success: false, error: "Cannot counter offer while in liquidity resolution", events: [] };
    }

    if (offer.counterOfferCount >= 2) return { success: false, error: "Maximum counteroffers reached", events: [] };

    // Validate ownership
    if (player.cash < offeredCash) return { success: false, error: "Insufficient cash offered", events: [] };
    for (const propId of offeredProperties) {
        if (!player.ownedProperties.includes(propId)) return { success: false, error: "You do not own offered property", events: [] };
    }
    
    // We update the offer in place to swap sender/receiver
    offer.senderId = player.id;
    offer.receiverId = sender.id; // original sender becomes the receiver
    offer.offeredProperties = offeredProperties;
    offer.offeredCash = offeredCash;
    offer.requestedProperties = requestedProperties;
    offer.requestedCash = requestedCash;
    offer.counterOfferCount += 1;
    offer.createdAt = Date.now();

    return {
        success: true,
        events: [{
            type: "TRADE_OFFER_CREATED",
            payload: { offerId: offer.id, senderId: offer.senderId, receiverId: offer.receiverId },
            timestamp: Date.now()
        }]
    };
}

export function resolveAcceptTradeOffer(
    state: GameState,
    player: Player,
    payload: any
): { success: boolean; error?: string; events: PublicEvent[] } {
    const { offerId } = payload;
    const offer = state.public.tradeOffers.find(o => o.id === offerId);
    if (!offer) return { success: false, error: "Offer not found", events: [] };

    if (offer.status !== "PENDING") return { success: false, error: "Offer is no longer pending", events: [] };
    if (offer.receiverId !== player.id) return { success: false, error: "Not your offer to accept", events: [] };

    const sender = state.public.players.find(p => p.id === offer.senderId);
    if (!sender || sender.status === "BANKRUPT") return { success: false, error: "Sender invalid or bankrupt", events: [] };

    // A trade cannot execute during a mandatory board action (unless it's liquidity resolution)
    if (state.public.turnPhase !== "OPTIONAL_ACTIONS" && state.public.turnPhase !== "MOVE") {
        if (state.public.turnPhase === "RESOLVE_MANDATORY_PAYMENT" && player.status === "IN_LIQUIDITY_RESOLUTION") {
            // "Finance may use an EXISTING valid trade offer as a liquidity source"
            // This is allowed.
        } else {
            return { success: false, error: "Cannot execute trade during a mandatory resolution phase", events: [] };
        }
    }

    // Atomic Validation
    // 1. Check cash
    if (sender.cash < offer.offeredCash) return { success: false, error: "Sender has insufficient cash", events: [] };
    if (player.cash < offer.requestedCash) return { success: false, error: "You have insufficient cash", events: [] };

    // 2. Check properties
    for (const p of offer.offeredProperties) {
        if (state.public.properties[p]?.ownerId !== sender.id) return { success: false, error: "Sender no longer owns offered property", events: [] };
        if (state.public.activeObligation?.propertyId === p) return { success: false, error: "Property is locked by active obligation", events: [] };
    }
    for (const p of offer.requestedProperties) {
        if (state.public.properties[p]?.ownerId !== player.id) return { success: false, error: "You no longer own requested property", events: [] };
        if (state.public.activeObligation?.propertyId === p) return { success: false, error: "Property is locked by active obligation", events: [] };
    }

    // Execute transfer
    sender.cash -= offer.offeredCash;
    sender.cash += offer.requestedCash;
    player.cash -= offer.requestedCash;
    player.cash += offer.offeredCash;

    // Track districts that need recalculation

    const transferProperty = (propId: string, from: Player, to: Player) => {
        from.ownedProperties = from.ownedProperties.filter(p => p !== propId);
        to.ownedProperties.push(propId);
        state.public.properties[propId].ownerId = to.id;

    };

    // Since we use getPropertyById, let's just make sure it's available. 
    // I'll import it properly at the top in the real file.

    for (const p of offer.offeredProperties) {
        transferProperty(p, sender, player);
    }
    for (const p of offer.requestedProperties) {
        transferProperty(p, player, sender);
    }

    offer.status = "ACCEPTED";

    const events: PublicEvent[] = [{
        type: "TRADE_OFFER_ACCEPTED",
        payload: { offerId: offer.id },
        timestamp: Date.now()
    }, {
        type: "TRADE_EXECUTED",
        payload: {
            offerId: offer.id,
            senderId: sender.id,
            receiverId: player.id,
            offeredProperties: offer.offeredProperties,
            offeredCash: offer.offeredCash,
            requestedProperties: offer.requestedProperties,
            requestedCash: offer.requestedCash
        },
        timestamp: Date.now()
    }];



    return { success: true, events };
}

export function resolveRejectTradeOffer(
    state: GameState,
    player: Player,
    payload: any
): { success: boolean; error?: string; events: PublicEvent[] } {
    const { offerId } = payload;
    const offer = state.public.tradeOffers.find(o => o.id === offerId);
    if (!offer) return { success: false, error: "Offer not found", events: [] };

    if (offer.status !== "PENDING") return { success: false, error: "Offer is no longer pending", events: [] };
    if (offer.receiverId !== player.id) return { success: false, error: "Not your offer to reject", events: [] };

    offer.status = "REJECTED";

    return {
        success: true,
        events: [{
            type: "TRADE_OFFER_REJECTED",
            payload: { offerId: offer.id },
            timestamp: Date.now()
        }]
    };
}

export function resolveCancelTradeOffer(
    state: GameState,
    player: Player,
    payload: any
): { success: boolean; error?: string; events: PublicEvent[] } {
    const { offerId } = payload;
    const offer = state.public.tradeOffers.find(o => o.id === offerId);
    if (!offer) return { success: false, error: "Offer not found", events: [] };

    if (offer.status !== "PENDING") return { success: false, error: "Offer is no longer pending", events: [] };
    if (offer.senderId !== player.id) return { success: false, error: "Not your offer to cancel", events: [] };

    offer.status = "CANCELLED";

    return {
        success: true,
        events: [{
            type: "TRADE_OFFER_CANCELLED",
            payload: { offerId: offer.id },
            timestamp: Date.now()
        }]
    };
}

export function expirePendingTradesForPlayer(
    state: GameState,
    playerId: string
): { events: PublicEvent[] } {
    const events: PublicEvent[] = [];
    const timestamp = Date.now();

    for (const offer of state.public.tradeOffers) {
        if (offer.status === "PENDING" && offer.receiverId === playerId) {
            offer.status = "EXPIRED";
            events.push({
                type: "TRADE_OFFER_EXPIRED",
                payload: { offerId: offer.id },
                timestamp
            });
        }
    }
    return { events };
}
