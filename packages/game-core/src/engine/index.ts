import { GameState } from "../state/index.js";
import { Intent } from "../actions/index.js";
import { PublicEvent, PrivateEvent } from "../events/index.js";
import { RandomSource } from "../randomness/index.js";
import { resolveMovement } from "../rules/movement.js";
import { 
    resolveSpaceLanding, 
    resolveBuyProperty, 
    resolvePassProperty, 
    resolveEndTurn 
} from "../rules/property.js";
import {
    resolveUseTransport,
    resolveSkipTransport,
    resolveClaimTreasury,
    resolveSkipTreasury
} from "../rules/special.js";
import {
    resolveLiquidateProperty,
    resolveLiquidateDevelopment,
    resolveDeclareBankruptcy
} from "../rules/finance.js";
import {
    resolveCreateTradeOffer,
    resolveCounterTradeOffer,
    resolveAcceptTradeOffer,
    resolveRejectTradeOffer,
    resolveCancelTradeOffer
} from "../rules/trade.js";

export interface EngineResult {
    state: GameState;
    events: (PublicEvent | PrivateEvent)[];
}

import { generateDistrictEvents } from '../rules/district.js';
import { resolveConstructDevelopment } from '../rules/development.js';

export class RulesEngine {
    constructor(private randomSource: RandomSource) {}

    process(state: GameState, intent: Intent): EngineResult {
        const activePlayer = state.public.players[state.public.activePlayerIndex];
        const timestamp = Date.now();

        const isTradeAction = ["CREATE_TRADE_OFFER","COUNTER_TRADE_OFFER","ACCEPT_TRADE_OFFER","REJECT_TRADE_OFFER","CANCEL_TRADE_OFFER"].includes(intent.type);
        if (intent.playerId !== activePlayer.id && !isTradeAction) {
            return {
                state,
                events: [{
                    playerId: intent.playerId,
                    type: "ERROR",
                    code: "NOT_YOUR_TURN",
                    message: "Not your turn",
                    timestamp
                }]
            };
        }

        const newState = JSON.parse(JSON.stringify(state)) as GameState;
        const currentActivePlayer = newState.public.players.find(p => p.id === intent.playerId) || newState.public.players[newState.public.activePlayerIndex];

        switch (intent.type) {
            case "ROLL_DICE": {
                if (newState.public.turnPhase !== "MOVE") {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId,
                            type: "ERROR",
                            code: "INVALID_TURN_PHASE",
                            message: "Cannot roll dice in current turn phase",
                            timestamp
                        }]
                    };
                }

                const moveResult = resolveMovement(newState, currentActivePlayer, this.randomSource);
                const spaceResult = resolveSpaceLanding(moveResult.newState, currentActivePlayer);

                return {
                    state: spaceResult.newState,
                    events: [...moveResult.events, ...spaceResult.events]
                };
            }

            case "BUY_PROPERTY": {
                const result = resolveBuyProperty(newState, currentActivePlayer);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId,
                            type: "ERROR",
                            code: "INVALID_BUY_ACTION",
                            message: result.error || "Cannot buy property",
                            timestamp
                        }]
                    };
                }

                return {
                    state: newState,
                    events: result.events
                };
            }

            case "PASS_PROPERTY": {
                const result = resolvePassProperty(newState, currentActivePlayer);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId,
                            type: "ERROR",
                            code: "INVALID_PASS_ACTION",
                            message: result.error || "Cannot pass property",
                            timestamp
                        }]
                    };
                }

                return {
                    state: newState,
                    events: result.events
                };
            }

            case "USE_TRANSPORT": {
                const payload = (intent.payload as any);
                const destId = payload ? payload.destinationId : -1;
                const result = resolveUseTransport(newState, currentActivePlayer, destId);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId,
                            type: "ERROR",
                            code: "INVALID_TRANSPORT_ACTION",
                            message: result.error || "Cannot use transport",
                            timestamp
                        }]
                    };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "SKIP_TRANSPORT": {
                const result = resolveSkipTransport(newState, currentActivePlayer);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId,
                            type: "ERROR",
                            code: "INVALID_TRANSPORT_ACTION",
                            message: result.error || "Cannot skip transport",
                            timestamp
                        }]
                    };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "CLAIM_TREASURY": {
                const result = resolveClaimTreasury(newState, currentActivePlayer);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId,
                            type: "ERROR",
                            code: "INVALID_TREASURY_ACTION",
                            message: result.error || "Cannot claim treasury",
                            timestamp
                        }]
                    };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "SKIP_TREASURY": {
                const result = resolveSkipTreasury(newState, currentActivePlayer);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId,
                            type: "ERROR",
                            code: "INVALID_TREASURY_ACTION",
                            message: result.error || "Cannot skip treasury",
                            timestamp
                        }]
                    };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "LIQUIDATE_PROPERTY": {
                const payload = (intent.payload as any);
                const result = resolveLiquidateProperty(newState, currentActivePlayer, payload.propertyId);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId, type: "ERROR", code: "INVALID_LIQUIDATION",
                            message: result.error || "Cannot liquidate", timestamp
                        }]
                    };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "LIQUIDATE_DEVELOPMENT": {
                const payload = (intent.payload as any);
                const result = resolveLiquidateDevelopment(newState, currentActivePlayer, payload.propertyId, payload.slot);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId, type: "ERROR", code: "INVALID_LIQUIDATION",
                            message: result.error || "Cannot liquidate development", timestamp
                        }]
                    };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }
            case "CONSTRUCT_DEVELOPMENT": {
                const payload = (intent.payload as any);
                const result = resolveConstructDevelopment(newState, currentActivePlayer, payload.propertyId, payload.projectId, payload.slot);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId, type: "ERROR", code: "INVALID_CONSTRUCTION",
                            message: result.error || "Cannot construct", timestamp
                        }]
                    };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }


            case "DECLARE_BANKRUPTCY": {
                const result = resolveDeclareBankruptcy(newState, currentActivePlayer);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId, type: "ERROR", code: "INVALID_BANKRUPTCY",
                            message: result.error || "Cannot declare bankruptcy", timestamp
                        }]
                    };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "END_TURN": {
                const result = resolveEndTurn(newState, currentActivePlayer);
                if (!result.success) {
                    return {
                        state,
                        events: [{
                            playerId: intent.playerId,
                            type: "ERROR",
                            code: "CANNOT_END_TURN",
                            message: result.error || "Cannot end turn",
                            timestamp
                        }]
                    };
                }

                return {
                    state: newState,
                    events: result.events
                };
            }

            case "CREATE_TRADE_OFFER": {
                const result = resolveCreateTradeOffer(newState, currentActivePlayer, intent.payload);
                if (!result.success) {
                    return { state, events: [{ playerId: intent.playerId, type: "ERROR", code: "INVALID_TRADE", message: result.error || "Cannot create offer", timestamp }] };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "COUNTER_TRADE_OFFER": {
                const result = resolveCounterTradeOffer(newState, currentActivePlayer, intent.payload);
                if (!result.success) {
                    return { state, events: [{ playerId: intent.playerId, type: "ERROR", code: "INVALID_TRADE", message: result.error || "Cannot counter offer", timestamp }] };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "ACCEPT_TRADE_OFFER": {
                const result = resolveAcceptTradeOffer(newState, currentActivePlayer, intent.payload);
                if (!result.success) {
                    return { state, events: [{ playerId: intent.playerId, type: "ERROR", code: "INVALID_TRADE", message: result.error || "Cannot accept offer", timestamp }] };
                }
                
                // Finance Integration: Recheck Liquidity
                // "after the accepted trade executes, Finance must immediately recheck the obligation. if sufficient cash now exists, payment proceeds."
                if (currentActivePlayer.status === "IN_LIQUIDITY_RESOLUTION") {
                    const ob = newState.public.activeObligation;
                    if (ob && currentActivePlayer.cash >= ob.amount) {
                        currentActivePlayer.cash -= ob.amount;
                        if (ob.recipientId) {
                            const rec = newState.public.players.find(p => p.id === ob.recipientId);
                            if (rec) rec.cash += ob.amount;
                        }
                        currentActivePlayer.status = "ACTIVE";
                        newState.public.activeObligation = null;
                        newState.public.turnPhase = "OPTIONAL_ACTIONS";
                        result.events.push({
                            type: "INFORMATION_REVEALED",
                            payload: { message: "Liquidity resolved via trade!" },
                            timestamp
                        });
                    }
                }
                // Same for sender if they were somehow in liquidity resolution, but we prevented that in CREATE_TRADE_OFFER and COUNTER_TRADE_OFFER.

                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "REJECT_TRADE_OFFER": {
                const result = resolveRejectTradeOffer(newState, currentActivePlayer, intent.payload);
                if (!result.success) {
                    return { state, events: [{ playerId: intent.playerId, type: "ERROR", code: "INVALID_TRADE", message: result.error || "Cannot reject offer", timestamp }] };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            case "CANCEL_TRADE_OFFER": {
                const result = resolveCancelTradeOffer(newState, currentActivePlayer, intent.payload);
                if (!result.success) {
                    return { state, events: [{ playerId: intent.playerId, type: "ERROR", code: "INVALID_TRADE", message: result.error || "Cannot cancel offer", timestamp }] };
                }
                return { state: newState, events: [...result.events, ...generateDistrictEvents(state, newState)] };
            }

            default:
                return {
                    state,
                    events: [{
                        playerId: intent.playerId,
                        type: "ERROR",
                        code: "INVALID_INTENT",
                        message: `Unknown intent: ${(intent as any).type}`,
                        timestamp
                    }]
                };
        }
    }
}
