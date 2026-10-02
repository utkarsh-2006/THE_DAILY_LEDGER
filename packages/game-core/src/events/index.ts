export type PublicEventType = 
    | "DICE_ROLLED" 
    | "PLAYER_MOVED" 
    | "DIVIDEND_PAID" 
    | "PROPERTY_PURCHASED" 
    | "PROPERTY_PASSED" 
    | "AUCTION_TRIGGERED" 
    | "RENT_PAID" 
    | "TURN_ADVANCED"
    | "CIVIC_RESERVE_ACTIVATED"
    | "CIVIC_RESERVE_CLAIMED"
    | "PLAYER_REMANDED"
    | "CIVIC_HOLD_LOCKED"
    | "CIVIC_HOLD_RELEASED"
    | "TRANSPORT_USED"
    | "TREASURY_GRANT_CLAIMED"
    | "MUNICIPAL_LEVY_PAID"
    | "INFORMATION_REVEALED"
    | "PROPERTY_LIQUIDATED"
    | "DEVELOPMENT_LIQUIDATED"
    | "PLAYER_BANKRUPT";

export interface PublicEvent {
    type: PublicEventType;
    payload: any;
    timestamp: number;
}

export interface PrivateEvent {
    playerId: string;
    type: "ERROR" | "INFO";
    code?: string;
    message: string;
    timestamp: number;
}

export interface ServerEvent {
    type: string;
    data: any;
    timestamp: number;
}

export type GameEvent = PublicEvent | PrivateEvent | ServerEvent;
