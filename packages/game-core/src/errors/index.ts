export type GameErrorCode =
    | "NOT_YOUR_TURN"
    | "INVALID_TURN_PHASE"
    | "INSUFFICIENT_CASH"
    | "PROPERTY_ALREADY_OWNED"
    | "NOT_A_PURCHASABLE_PROPERTY"
    | "INVALID_INTENT"
    | "INVALID_PLAYER_COUNT"
    | "CANNOT_END_TURN";

export class GameError extends Error {
    constructor(
        public readonly code: GameErrorCode,
        message: string
    ) {
        super(message);
        this.name = "GameError";
    }
}
