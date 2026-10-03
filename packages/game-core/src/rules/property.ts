import { GameState, Player } from "../state/index.js";
import { PublicEvent } from "../events/index.js";
import { BOARD_SPACES, getPropertyById } from "game-data";
import { calculateCurrentYield } from "./yield.js";
import { expirePendingTradesForPlayer } from "./trade.js";

export interface SpaceResolutionResult {
    newState: GameState;
    events: PublicEvent[];
}

export function resolveSpaceLanding(
    state: GameState,
    player: Player
): SpaceResolutionResult {
    const events: PublicEvent[] = [];
    const timestamp = Date.now();
    const space = BOARD_SPACES[player.position];

    // Authoritative Turn Sequence:
    // MOVE -> IDENTIFY_SPACE -> CHECK_FOR_FORCED_STATE -> RESOLVE_PROPERTY_OR_SPECIAL_SPACE -> RESOLVE_MANDATORY_PAYMENT -> OPTIONAL_ACTIONS
    state.public.turnPhase = "CHECK_FOR_FORCED_STATE";

    if (space && space.propertyId) {
        state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
        const propData = getPropertyById(space.propertyId)!;
        const propState = state.public.properties[propData.id];

        if (propState.ownerId === null) {
            // Unowned: Player enters Property Decision Window
            state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
        } else if (propState.ownerId === player.id) {
            // Owned by active player: No rent obligation
            state.public.turnPhase = "OPTIONAL_ACTIONS";
        } else {
            // Owned by another player: Mandatory rent obligation
            state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
            const owner = state.public.players.find(p => p.id === propState.ownerId)!;
            const rent = calculateCurrentYield(state, propData.id);

            if (player.cash >= rent) {
                player.cash -= rent;
                owner.cash += rent;
                events.push({
                    type: "RENT_PAID",
                    payload: {
                        payerId: player.id,
                        recipientId: owner.id,
                        propertyId: propData.id,
                        amount: rent
                    },
                    timestamp
                });
                state.public.turnPhase = "OPTIONAL_ACTIONS";
            } else {
                state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
                player.status = "IN_LIQUIDITY_RESOLUTION";
                state.public.activeObligation = {
                    amount: rent,
                    recipientId: owner.id,
                    reason: "RENT",
                    propertyId: propData.id
                };
            }
        }
    } else {
        // Special space or Start space
        if (player.position === 38) { // Regulatory Court
            player.position = 10;
            player.isLocked = true;
            state.public.turnPhase = "OPTIONAL_ACTIONS";
            events.push({
                type: "PLAYER_REMANDED",
                payload: { playerId: player.id },
                timestamp
            });
            events.push({
                type: "CIVIC_HOLD_LOCKED",
                payload: { playerId: player.id },
                timestamp
            });
        } else if ([15, 32, 35, 37].includes(player.position)) { // Transport
            state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
            state.public.pendingActionRequired = "USE_TRANSPORT";
        } else if (player.position === 20) { // City Hall
            if (!state.public.civicReserveActive) {
                state.public.civicReserveActive = true;
                events.push({
                    type: "CIVIC_RESERVE_ACTIVATED",
                    payload: { playerId: player.id },
                    timestamp
                });
            }
            state.public.turnPhase = "OPTIONAL_ACTIONS";
        } else if (player.position === 39) { // Civic Reserve
            if (state.public.civicReserveActive) {
                player.cash += 150;
                state.public.civicReserveActive = false;
                events.push({
                    type: "CIVIC_RESERVE_CLAIMED",
                    payload: { playerId: player.id, amount: 150 },
                    timestamp
                });
            }
            state.public.turnPhase = "OPTIONAL_ACTIONS";
        } else if (player.position === 33) { // Treasury Window
            if (player.cash < 300) {
                state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
                state.public.pendingActionRequired = "CLAIM_TREASURY";
            } else {
                state.public.turnPhase = "OPTIONAL_ACTIONS";
            }
        } else if (player.position === 25) { // Municipal Levy
            let levy = Math.floor(player.cash * 0.08);
            if (levy < 40) levy = 40;
            if (levy > 180) levy = 180;
            
            if (player.cash >= levy) {
                player.cash -= levy;
                events.push({
                    type: "MUNICIPAL_LEVY_PAID",
                    payload: { playerId: player.id, amount: levy },
                    timestamp
                });
                state.public.turnPhase = "OPTIONAL_ACTIONS";
            } else {
                state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
                player.status = "IN_LIQUIDITY_RESOLUTION";
                state.public.activeObligation = {
                    amount: levy,
                    recipientId: null, // bank
                    reason: "MUNICIPAL_LEVY"
                };
            }
        } else {
            // Information spaces (5, 30, 31, 34, 36) or Start (0) or Civic Hold Visit (10)
            state.public.turnPhase = "OPTIONAL_ACTIONS";
        }
    }

    return { newState: state, events };
}

export function resolveBuyProperty(
    state: GameState,
    player: Player
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_PROPERTY_OR_SPECIAL_SPACE") {
        return { success: false, error: "Not in property resolution phase", events: [] };
    }

    const space = BOARD_SPACES[player.position];
    if (!space || !space.propertyId) {
        return { success: false, error: "Not a purchasable property", events: [] };
    }

    const propData = getPropertyById(space.propertyId)!;
    const propState = state.public.properties[propData.id];

    if (propState.ownerId !== null) {
        return { success: false, error: "Property already owned", events: [] };
    }

    if (player.cash < propData.basePrice) {
        return { success: false, error: "Insufficient cash", events: [] };
    }

    player.cash -= propData.basePrice;
    propState.ownerId = player.id;
    player.ownedProperties.push(propData.id);

    state.public.turnPhase = "OPTIONAL_ACTIONS";

    const event: PublicEvent = {
        type: "PROPERTY_PURCHASED",
        payload: {
            playerId: player.id,
            propertyId: propData.id,
            price: propData.basePrice
        },
        timestamp: Date.now()
    };

    return { success: true, events: [event] };
}

export function resolvePassProperty(
    state: GameState,
    player: Player
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_PROPERTY_OR_SPECIAL_SPACE") {
        return { success: false, error: "Not in property resolution phase", events: [] };
    }

    const space = BOARD_SPACES[player.position];
    if (!space || !space.propertyId) {
        return { success: false, error: "Not a purchasable property", events: [] };
    }

    const propData = getPropertyById(space.propertyId)!;
    const propState = state.public.properties[propData.id];

    if (propState.ownerId !== null) {
        return { success: false, error: "Property already owned", events: [] };
    }

    state.public.turnPhase = "OPTIONAL_ACTIONS";

    const timestamp = Date.now();
    const events: PublicEvent[] = [
        {
            type: "PROPERTY_PASSED",
            payload: {
                playerId: player.id,
                propertyId: propData.id
            },
            timestamp
        },
        {
            type: "AUCTION_TRIGGERED",
            payload: {
                propertyId: propData.id,
                askingPrice: propData.basePrice,
                minimumBid: Math.ceil(propData.basePrice * 0.5)
            },
            timestamp
        }
    ];

    return { success: true, events };
}

export function resolveEndTurn(
    state: GameState,
    player: Player
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "OPTIONAL_ACTIONS") {
        return { success: false, error: "Cannot end turn before optional actions phase", events: [] };
    }

    let nextIndex = (state.public.activePlayerIndex + 1) % state.public.players.length;
    
    // Skip bankrupt players
    let loops = 0;
    while (state.public.players[nextIndex].status === "BANKRUPT" && loops < state.public.players.length) {
        nextIndex = (nextIndex + 1) % state.public.players.length;
        if (nextIndex === 0) state.public.currentRound += 1; // if we looped around during skipping
        loops++;
    }

    if (nextIndex < state.public.activePlayerIndex || loops >= state.public.players.length) {
        // If it naturally wrapped around, we increment round (unless already incremented in while loop)
        if (loops === 0) {
            state.public.currentRound += 1;
        }
    }

    state.public.activePlayerIndex = nextIndex;
    state.public.turnPhase = "MOVE";

    const nextPlayerId = state.public.players[nextIndex].id;
    const expirationResult = expirePendingTradesForPlayer(state, nextPlayerId);

    const event: PublicEvent = {
        type: "TURN_ADVANCED",
        payload: {
            newActivePlayerId: nextPlayerId,
            currentRound: state.public.currentRound
        },
        timestamp: Date.now()
    };

    return { success: true, events: [event, ...expirationResult.events] };
}
