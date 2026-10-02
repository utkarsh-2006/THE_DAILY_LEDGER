import { GameState, Player } from "../state/index.js";
import { PublicEvent } from "../events/index.js";

export function resolveUseTransport(
    state: GameState,
    player: Player,
    destinationId: number
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_PROPERTY_OR_SPECIAL_SPACE" || state.public.pendingActionRequired !== "USE_TRANSPORT") {
        return { success: false, error: "Not in transport resolution phase", events: [] };
    }

    const transportNodes = [15, 32, 35, 37];
    if (!transportNodes.includes(player.position)) {
        return { success: false, error: "Player is not on a transport node", events: [] };
    }

    if (!transportNodes.includes(destinationId)) {
        return { success: false, error: "Destination is not a transport node", events: [] };
    }

    if (player.position === destinationId) {
        return { success: false, error: "Cannot transport to the same node", events: [] };
    }

    player.position = destinationId;
    state.public.turnPhase = "OPTIONAL_ACTIONS";
    state.public.pendingActionRequired = null;

    const events: PublicEvent[] = [{
        type: "TRANSPORT_USED",
        payload: {
            playerId: player.id,
            destination: destinationId
        },
        timestamp: Date.now()
    }];

    return { success: true, events };
}

export function resolveSkipTransport(
    state: GameState,
    player: Player
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_PROPERTY_OR_SPECIAL_SPACE" || state.public.pendingActionRequired !== "USE_TRANSPORT") {
        return { success: false, error: "Not in transport resolution phase", events: [] };
    }

    state.public.turnPhase = "OPTIONAL_ACTIONS";
    state.public.pendingActionRequired = null;

    return { success: true, events: [] };
}

export function resolveClaimTreasury(
    state: GameState,
    player: Player
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_PROPERTY_OR_SPECIAL_SPACE" || state.public.pendingActionRequired !== "CLAIM_TREASURY") {
        return { success: false, error: "Not in treasury resolution phase", events: [] };
    }

    if (player.position !== 33) {
        return { success: false, error: "Player is not on treasury window", events: [] };
    }

    if (player.cash >= 300) {
        return { success: false, error: "Not eligible for treasury grant", events: [] };
    }

    player.cash += 150;
    state.public.turnPhase = "OPTIONAL_ACTIONS";
    state.public.pendingActionRequired = null;

    const events: PublicEvent[] = [{
        type: "TREASURY_GRANT_CLAIMED",
        payload: {
            playerId: player.id,
            amount: 150
        },
        timestamp: Date.now()
    }];

    return { success: true, events };
}

export function resolveSkipTreasury(
    state: GameState,
    player: Player
): { success: boolean; error?: string; events: PublicEvent[] } {
    if (state.public.turnPhase !== "RESOLVE_PROPERTY_OR_SPECIAL_SPACE" || state.public.pendingActionRequired !== "CLAIM_TREASURY") {
        return { success: false, error: "Not in treasury resolution phase", events: [] };
    }

    state.public.turnPhase = "OPTIONAL_ACTIONS";
    state.public.pendingActionRequired = null;

    return { success: true, events: [] };
}
