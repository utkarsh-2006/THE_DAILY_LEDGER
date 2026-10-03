import { BoardSpace, PropertyData, PROPERTIES, DEVELOPMENT_PROJECTS } from "game-data";

export type GameStatus = "INIT" | "IN_PROGRESS" | "ENDED" | "FINAL_ROUND_FREEZE";
export type TurnPhase = 
    | "MOVE" 
    | "IDENTIFY_SPACE" 
    | "CHECK_FOR_FORCED_STATE" 
    | "RESOLVE_PROPERTY_OR_SPECIAL_SPACE" 
    | "RESOLVE_MANDATORY_PAYMENT" 
    | "OPTIONAL_ACTIONS" 
    | "END_TURN";

export type PlayerStatus = "ACTIVE" | "BANKRUPT" | "IN_LIQUIDITY_RESOLUTION";

export interface Player {
    id: string;
    name: string;
    cash: number;
    position: number;
    status: PlayerStatus;
    isLocked: boolean;
    ownedProperties: string[];
}

export interface PropertyState {
    id: string; // Property ID (e.g. "P01")
    ownerId: string | null;
    slot1: string | null;
    slot2: string | null;
    isFlagship: boolean;
}

export interface Obligation {
    amount: number;
    recipientId: string | null;
    reason: string;
    propertyId?: string; // Optional context
}

export interface TradeOffer {
    id: string;
    senderId: string;
    receiverId: string;
    offeredProperties: string[];
    offeredCash: number;
    requestedProperties: string[];
    requestedCash: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
    counterOfferCount: number;
    createdAt: number;
}

export interface PublicState {
    gameStatus: GameStatus;
    currentRound: number;
    turnPhase: TurnPhase;
    activePlayerIndex: number;
    players: Player[];
    properties: Record<string, PropertyState>;
    tradeOffers: TradeOffer[];
    pendingActionRequired: string | null;
    civicReserveActive: boolean;
    activeObligation: Obligation | null;
    developmentExchange: string[];
    developmentSupply: string[];
}

export interface PrivatePlayerState {
    playerId: string;
    privateInformation?: Record<string, any>;
}

export interface ServerOnlyState {
    internalAudit?: string[];
}

import { RandomSource, ProductionRandomSource } from "../randomness/index.js";

export interface GameState {
    public: PublicState;
    private: Record<string, PrivatePlayerState>;
    server: ServerOnlyState;
}

export const INITIAL_CASH = 1800;

export function createInitialGameState(playerConfigs: { id: string; name: string }[], randomSource: RandomSource = new ProductionRandomSource()): GameState {
    if (playerConfigs.length < 2 || playerConfigs.length > 4) {
        throw new Error("Invalid player count. The game requires 2 to 4 players.");
    }

    const players: Player[] = playerConfigs.map(cfg => ({
        id: cfg.id,
        name: cfg.name,
        cash: INITIAL_CASH,
        position: 0,
        status: "ACTIVE",
        isLocked: false,
        ownedProperties: []
    }));

    const properties: Record<string, PropertyState> = {};
    for (const prop of PROPERTIES) {
        properties[prop.id] = {
            id: prop.id,
            ownerId: null,
            slot1: null,
            slot2: null,
            isFlagship: false
        };
    }

    const privateState: Record<string, PrivatePlayerState> = {};
    for (const cfg of playerConfigs) {
        privateState[cfg.id] = {
            playerId: cfg.id
        };
    }

    
    let allDevIds = DEVELOPMENT_PROJECTS.map(p => p.id);
    allDevIds = randomSource.shuffle(allDevIds);
    const developmentExchange = allDevIds.splice(0, 4);
    const developmentSupply = allDevIds;
    
    return {
        public: {
            gameStatus: "IN_PROGRESS",
            currentRound: 1,
            turnPhase: "MOVE",
            activePlayerIndex: 0,
            players,
            properties,
            tradeOffers: [],
            pendingActionRequired: null,
            civicReserveActive: false,
            activeObligation: null,
            developmentExchange,
            developmentSupply
        },
        private: privateState,
        server: {
            internalAudit: []
        }
    };
}
