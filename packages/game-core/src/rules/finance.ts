import { GameState, Player, Obligation } from "../state/index.js";
import { PublicEvent } from "../events/index.js";
import { getPropertyById, BOARD_SPACES } from "game-data";

export function checkAndPayObligation(state: GameState, player: Player): PublicEvent[] {
    const events: PublicEvent[] = [];
    if (!state.public.activeObligation) return events;

    if (player.cash >= state.public.activeObligation.amount) {
        player.cash -= state.public.activeObligation.amount;
        
        if (state.public.activeObligation.recipientId) {
            const recipient = state.public.players.find(p => p.id === state.public.activeObligation!.recipientId);
            if (recipient) {
                recipient.cash += state.public.activeObligation.amount;
            }
        }

        events.push({
            type: state.public.activeObligation.reason === "RENT" ? "RENT_PAID" : "MUNICIPAL_LEVY_PAID",
            payload: {
                payerId: player.id,
                recipientId: state.public.activeObligation.recipientId,
                amount: state.public.activeObligation.amount,
                propertyId: state.public.activeObligation.propertyId
            },
            timestamp: Date.now()
        });

        state.public.activeObligation = null;
        player.status = "ACTIVE";
        state.public.turnPhase = "OPTIONAL_ACTIONS";
    }

    return events;
}

export function resolveLiquidateProperty(
    state: GameState,
    player: Player,
    propertyId: string
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_MANDATORY_PAYMENT" || player.status !== "IN_LIQUIDITY_RESOLUTION") {
        return { success: false, error: "Not in liquidity resolution phase", events: [] };
    }

    const propState = state.public.properties[propertyId];
    if (!propState || propState.ownerId !== player.id) {
        return { success: false, error: "You do not own this property", events: [] };
    }

    const propData = getPropertyById(propertyId);
    if (!propData) {
        return { success: false, error: "Invalid property", events: [] };
    }

    // Asset Base = Asking Price + Capitalized Development Value
    let capitalizedValue = 0;
    if (propState.isFlagship) {
        const flagshipCost = Math.floor(propData.basePrice * 1.0);
        capitalizedValue += Math.floor(flagshipCost * 0.75);
    } else {
        if (propState.slot1) {
            const slot1Cost = Math.floor(propData.basePrice * 0.35);
            capitalizedValue += Math.floor(slot1Cost * 0.75);
        }
        if (propState.slot2) {
            const slot2Cost = Math.floor(propData.basePrice * 0.50);
            capitalizedValue += Math.floor(slot2Cost * 0.75);
        }
    }

    const assetBase = propData.basePrice + capitalizedValue;
    const recoveryValue = Math.floor(assetBase * 0.5);
    
    player.cash += recoveryValue;
    
    // Unown and destroy developments and Flagships
    propState.ownerId = null;
    propState.slot1 = null;
    propState.slot2 = null;
    propState.isFlagship = false;

    // Remove from player portfolio
    player.ownedProperties = player.ownedProperties.filter(id => id !== propertyId);

    const timestamp = Date.now();
    const events: PublicEvent[] = [{
        type: "PROPERTY_LIQUIDATED",
        payload: {
            playerId: player.id,
            propertyId: propertyId,
            recoveryValue
        },
        timestamp
    }];

    // Check if obligation can now be paid
    const autoPayEvents = checkAndPayObligation(state, player);
    events.push(...autoPayEvents);

    return { success: true, events };
}

export function resolveLiquidateDevelopment(
    state: GameState,
    player: Player,
    propertyId: string,
    slot: 1 | 2
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_MANDATORY_PAYMENT" || player.status !== "IN_LIQUIDITY_RESOLUTION") {
        return { success: false, error: "Not in liquidity resolution phase", events: [] };
    }

    const propState = state.public.properties[propertyId];
    if (!propState || propState.ownerId !== player.id) {
        return { success: false, error: "You do not own this property", events: [] };
    }

    if (propState.isFlagship) {
        return { success: false, error: "Cannot partially liquidate a Flagship; liquidate the property", events: [] };
    }

    const devValue = slot === 1 ? propState.slot1 : propState.slot2;
    if (!devValue) {
        return { success: false, error: "No development in this slot", events: [] };
    }

    const propData = getPropertyById(propertyId);
    if (!propData) {
        return { success: false, error: "Invalid property", events: [] };
    }

    // Cost: Slot 1 is 35%, Slot 2 is 50%
    const costMultiplier = slot === 1 ? 0.35 : 0.50;
    const originalCost = Math.floor(propData.basePrice * costMultiplier);
    const recoveryValue = Math.floor(originalCost * 0.5);
    
    player.cash += recoveryValue;
    
    if (slot === 1) propState.slot1 = null;
    if (slot === 2) propState.slot2 = null;

    const timestamp = Date.now();
    const events: PublicEvent[] = [{
        type: "DEVELOPMENT_LIQUIDATED",
        payload: {
            playerId: player.id,
            propertyId: propertyId,
            slot,
            recoveryValue
        },
        timestamp
    }];

    // Check if obligation can now be paid
    const autoPayEvents = checkAndPayObligation(state, player);
    events.push(...autoPayEvents);

    return { success: true, events };
}

export function resolveDeclareBankruptcy(
    state: GameState,
    player: Player
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_MANDATORY_PAYMENT" || player.status !== "IN_LIQUIDITY_RESOLUTION") {
        return { success: false, error: "Not in liquidity resolution phase", events: [] };
    }

    const obligation = state.public.activeObligation;
    if (!obligation) {
        return { success: false, error: "No active obligation", events: [] };
    }

    // Process elimination
    player.status = "BANKRUPT";
    
    // Remaining cash handled (give to creditor, or bank)
    if (obligation.recipientId && player.cash > 0) {
        const recipient = state.public.players.find(p => p.id === obligation.recipientId);
        if (recipient) recipient.cash += player.cash;
    }
    player.cash = 0;

    // Properties handled (return to bank as unowned, destroy developments)
    for (const propId of player.ownedProperties) {
        const propState = state.public.properties[propId];
        if (propState) {
            propState.ownerId = null;
            propState.slot1 = null;
            propState.slot2 = null;
            propState.isFlagship = false;
        }
    }
    player.ownedProperties = [];
    
    // Remove piece (just put position to -1 to hide it)
    player.position = -1;
    
    // Invalidate pending trades if trade state exists (stubbed as per rules)
    // Actually, no trade state exists yet, but when it does it goes here.

    
    state.public.activeObligation = null;
    
    const events: PublicEvent[] = [{
        type: "PLAYER_BANKRUPT",
        payload: {
            playerId: player.id
        },
        timestamp: Date.now()
    }];

    // Auto-advance turn
    let nextIndex = (state.public.activePlayerIndex + 1) % state.public.players.length;
    let loops = 0;
    while (state.public.players[nextIndex].status === "BANKRUPT" && loops < state.public.players.length) {
        nextIndex = (nextIndex + 1) % state.public.players.length;
        if (nextIndex === 0) state.public.currentRound += 1;
        loops++;
    }

    if (nextIndex < state.public.activePlayerIndex || loops >= state.public.players.length) {
        if (loops === 0) state.public.currentRound += 1;
    }

    state.public.activePlayerIndex = nextIndex;
    state.public.turnPhase = "MOVE";

    events.push({
        type: "TURN_ADVANCED",
        payload: {
            newActivePlayerId: state.public.players[nextIndex].id,
            currentRound: state.public.currentRound
        },
        timestamp: Date.now()
    });

    return { success: true, events };
}
