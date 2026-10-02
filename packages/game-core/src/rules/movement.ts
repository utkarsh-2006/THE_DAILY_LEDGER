import { GameState, Player } from "../state/index.js";
import { PublicEvent } from "../events/index.js";
import { RandomSource } from "../randomness/index.js";

export interface MovementResult {
    newState: GameState;
    events: PublicEvent[];
    passedVeloraCentral: boolean;
}

export function resolveMovement(
    state: GameState,
    player: Player,
    randomSource: RandomSource
): MovementResult {
    const events: PublicEvent[] = [];
    const timestamp = Date.now();

    if (player.isLocked) {
        player.isLocked = false;
        state.public.turnPhase = "OPTIONAL_ACTIONS";
        events.push({
            type: "CIVIC_HOLD_RELEASED",
            payload: { playerId: player.id },
            timestamp
        });
        return {
            newState: state,
            events,
            passedVeloraCentral: false
        };
    }

    const [d1, d2] = randomSource.rollDice();
    const totalMove = d1 + d2;

    events.push({
        type: "DICE_ROLLED",
        payload: { playerId: player.id, d1, d2, total: totalMove },
        timestamp
    });

    const oldPosition = player.position;
    const rawNewPosition = oldPosition + totalMove;
    let passedVeloraCentral = false;
    let newPosition = rawNewPosition;

    // Board has 40 spaces: 0 to 39
    if (rawNewPosition >= 40) {
        newPosition = rawNewPosition % 40;
        passedVeloraCentral = true;
        player.cash += 225; // Velora Central dividend
        events.push({
            type: "DIVIDEND_PAID",
            payload: { playerId: player.id, amount: 225, reason: "Passed or landed on Velora Central" },
            timestamp
        });
    }

    player.position = newPosition;

    events.push({
        type: "PLAYER_MOVED",
        payload: { playerId: player.id, from: oldPosition, to: newPosition },
        timestamp
    });

    state.public.turnPhase = "IDENTIFY_SPACE";

    return {
        newState: state,
        events,
        passedVeloraCentral
    };
}
