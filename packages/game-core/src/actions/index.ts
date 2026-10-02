export type IntentType = 
    | "ROLL_DICE" 
    | "BUY_PROPERTY" 
    | "PASS_PROPERTY" 
    | "PAY_RENT" 
    | "END_TURN"
    | "USE_TRANSPORT"
    | "SKIP_TRANSPORT"
    | "CLAIM_TREASURY"
    | "SKIP_TREASURY"
    | "PAY_MUNICIPAL_LEVY"
    | "LIQUIDATE_PROPERTY"
    | "LIQUIDATE_DEVELOPMENT"
    | "DECLARE_BANKRUPTCY";

export interface Intent<T = any> {
    type: IntentType;
    playerId: string;
    payload?: T;
}
