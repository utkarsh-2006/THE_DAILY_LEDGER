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
    | "DEVELOPMENT_CONSTRUCTED"
    | "PLAYER_BANKRUPT"
    | "TRADE_OFFER_CREATED"
    | "TRADE_OFFER_ACCEPTED"
    | "TRADE_OFFER_REJECTED"
    | "TRADE_OFFER_CANCELLED"
    | "TRADE_OFFER_EXPIRED"
    | "TRADE_EXECUTED"
    | "DISTRICT_CONTROL_CHANGED";

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
