import { describe, it, expect, beforeEach } from 'vitest';
import { RulesEngine, DeterministicTestRandomSource, createInitialGameState, GameState } from '../src/index.js';

describe('Player Interaction & Trading System', () => {
    let engine: RulesEngine;
    let state: GameState;

    beforeEach(() => {
        engine = new RulesEngine(new DeterministicTestRandomSource());
        state = createInitialGameState([
            { id: 'p1', name: 'Player 1' },
            { id: 'p2', name: 'Player 2' },
            { id: 'p3', name: 'Player 3' }
        ], new DeterministicTestRandomSource());
        
        // Give properties for testing
        state.public.properties['P01'].ownerId = 'p1';
        state.public.players[0].ownedProperties.push('P01');
        
        state.public.properties['P02'].ownerId = 'p2';
        state.public.players[1].ownedProperties.push('P02');

        state.public.turnPhase = "OPTIONAL_ACTIONS";
    });

    it('Case 1, 4: cash-for-property trade and successful acceptance', () => {
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p2',
            payload: {
                receiverId: 'p1',
                offeredProperties: [],
                offeredCash: 200,
                requestedProperties: ['P01'],
                requestedCash: 0
            }
        });
        state = res.state; if(res.events[0]?.type === 'ERROR') console.error(res.events[0]);
        
        expect(state.public.tradeOffers.length).toBe(1);
        const offerId = state.public.tradeOffers[0].id;
        
        res = engine.process(state, {
            type: 'ACCEPT_TRADE_OFFER',
            playerId: 'p1',
            payload: { offerId }
        });
        state = res.state;
        
        expect(state.public.players[0].cash).toBe(1800 + 200);
        expect(state.public.players[1].cash).toBe(1800 - 200);
        expect(state.public.players[1].ownedProperties).toContain('P01');
        expect(state.public.properties['P01'].ownerId).toBe('p2');
        expect(state.public.tradeOffers[0].status).toBe('ACCEPTED');
    });

    it('Case 2: property-for-property trade', () => {
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: {
                receiverId: 'p2',
                offeredProperties: ['P01'],
                offeredCash: 0,
                requestedProperties: ['P02'],
                requestedCash: 0
            }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;
        
        res = engine.process(state, {
            type: 'ACCEPT_TRADE_OFFER',
            playerId: 'p2',
            payload: { offerId }
        });
        state = res.state;
        
        expect(state.public.players[0].ownedProperties).toContain('P02');
        expect(state.public.players[1].ownedProperties).toContain('P01');
    });

    it('Case 3: property + cash trade', () => {
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: {
                receiverId: 'p2',
                offeredProperties: ['P01'],
                offeredCash: 100,
                requestedProperties: ['P02'],
                requestedCash: 50
            }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;
        
        res = engine.process(state, {
            type: 'ACCEPT_TRADE_OFFER',
            playerId: 'p2',
            payload: { offerId }
        });
        state = res.state;
        
        expect(state.public.players[0].cash).toBe(1800 - 100 + 50);
        expect(state.public.players[1].cash).toBe(1800 - 50 + 100);
        expect(state.public.players[0].ownedProperties).toContain('P02');
        expect(state.public.players[1].ownedProperties).toContain('P01');
    });

    it('Case 5: rejection', () => {
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: {
                receiverId: 'p2',
                offeredProperties: [], offeredCash: 100, requestedProperties: ['P02'], requestedCash: 0
            }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;
        
        res = engine.process(state, {
            type: 'REJECT_TRADE_OFFER',
            playerId: 'p2',
            payload: { offerId }
        });
        state = res.state;
        
        expect(state.public.tradeOffers[0].status).toBe('REJECTED');
    });

    it('Case 6, 7, 8: counteroffers up to maximum', () => {
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: { receiverId: 'p2', offeredProperties: [], offeredCash: 100, requestedProperties: ['P02'], requestedCash: 0 }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;
        
        // Counter 1
        res = engine.process(state, {
            type: 'COUNTER_TRADE_OFFER',
            playerId: 'p2',
            payload: { offerId, offeredProperties: ['P02'], offeredCash: 0, requestedProperties: ['P01'], requestedCash: 50 }
        });
        state = res.state;
        expect(state.public.tradeOffers[0].counterOfferCount).toBe(1);
        expect(state.public.tradeOffers[0].senderId).toBe('p2');

        // Counter 2
        res = engine.process(state, {
            type: 'COUNTER_TRADE_OFFER',
            playerId: 'p1',
            payload: { offerId, offeredProperties: ['P01'], offeredCash: 100, requestedProperties: ['P02'], requestedCash: 0 }
        });
        state = res.state;
        expect(state.public.tradeOffers[0].counterOfferCount).toBe(2);

        // Counter 3 (Should fail)
        res = engine.process(state, {
            type: 'COUNTER_TRADE_OFFER',
            playerId: 'p2',
            payload: { offerId, offeredProperties: ['P02'], offeredCash: 0, requestedProperties: ['P01'], requestedCash: 100 }
        });
        expect(res.events[0].type).toBe("ERROR");
        expect(state.public.tradeOffers[0].counterOfferCount).toBe(2); // no change
    });

    it('Case 9: expiration', () => {
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: { receiverId: 'p2', offeredProperties: [], offeredCash: 100, requestedProperties: ['P02'], requestedCash: 0 }
        });
        state = res.state;

        // Player 1 ends turn. Player 2 is next (p2's turn begins).
        res = engine.process(state, { type: 'END_TURN', playerId: 'p1' });
        state = res.state;
        
        expect(state.public.tradeOffers[0].status).toBe('EXPIRED');
    });

    it('Case 10: insufficient cash during creation and acceptance', () => {
        // Creation fails if offering cash they don't have
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: { receiverId: 'p2', offeredProperties: [], offeredCash: 5000, requestedProperties: ['P02'], requestedCash: 0 }
        });
        expect(res.events[0].type).toBe("ERROR");
        
        // But if they have it now, then lose it before acceptance, it should fail atomically
        res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: { receiverId: 'p2', offeredProperties: [], offeredCash: 1800, requestedProperties: ['P02'], requestedCash: 0 }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;
        
        state.public.players[0].cash = 0; // Simulate losing cash
        
        res = engine.process(state, { type: 'ACCEPT_TRADE_OFFER', playerId: 'p2', payload: { offerId } });
        expect(res.events[0].type).toBe("ERROR");
    });

    it('Case 11, 12, 13: property no longer owned / conflicting offers', () => {
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: { receiverId: 'p2', offeredProperties: ['P01'], offeredCash: 0, requestedProperties: ['P02'], requestedCash: 0 }
        });
        state = res.state;
        const offerId1 = state.public.tradeOffers[0].id;
        
        res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: { receiverId: 'p3', offeredProperties: ['P01'], offeredCash: 0, requestedProperties: [], requestedCash: 0 }
        });
        state = res.state;
        const offerId2 = state.public.tradeOffers[1].id;

        // Player 2 accepts first
        res = engine.process(state, { type: 'ACCEPT_TRADE_OFFER', playerId: 'p2', payload: { offerId: offerId1 } });
        state = res.state;
        
        // Player 3 tries to accept, but P01 is transferred
        res = engine.process(state, { type: 'ACCEPT_TRADE_OFFER', playerId: 'p3', payload: { offerId: offerId2 } });
        expect(res.events[0].type).toBe("ERROR");
        expect(state.public.players[2].ownedProperties).not.toContain('P01');
    });

    it('Case 15, 16: development and Flagship transfers with property', () => {
        state.public.properties['P01'].slot1 = 'D_OFFICE';
        state.public.properties['P01'].isFlagship = true;
        
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: { receiverId: 'p2', offeredProperties: ['P01'], offeredCash: 0, requestedProperties: [], requestedCash: 0 }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;
        
        res = engine.process(state, { type: 'ACCEPT_TRADE_OFFER', playerId: 'p2', payload: { offerId } });
        state = res.state;
        
        expect(state.public.players[1].ownedProperties).toContain('P01');
        expect(state.public.properties['P01'].slot1).toBe('D_OFFICE');
        expect(state.public.properties['P01'].isFlagship).toBe(true);
    });

    it('Case 17, 18, 19: District Control recalculation', () => {
        // Exchange District has P05, P06, P07, P08
        state.public.properties['P05'].ownerId = 'p1';
        state.public.properties['P06'].ownerId = 'p1';
        state.public.properties['P07'].ownerId = 'p1';
        state.public.players[0].ownedProperties.push('P05', 'P06', 'P07');
        
        state.public.properties['P08'].ownerId = 'p2';
        state.public.players[1].ownedProperties.push('P08');

        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p1',
            payload: { receiverId: 'p2', offeredProperties: [], offeredCash: 500, requestedProperties: ['P08'], requestedCash: 0 }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;
        
        res = engine.process(state, { type: 'ACCEPT_TRADE_OFFER', playerId: 'p2', payload: { offerId } });
        state = res.state;
        
        // Ensure District Control changed event was fired
        const districtEvent = res.events.find(e => e.type === 'DISTRICT_CONTROL_CHANGED');
        expect(districtEvent).toBeDefined();
        expect((districtEvent!.payload as any).districtId).toBe('D02'); // Exchange District
        expect((districtEvent!.payload as any).ownership['p1']).toBe(4);
    });

    it('Case 21: trade blocked during mandatory resolution', () => {
        state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
        
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p2',
            payload: { receiverId: 'p1', offeredProperties: [], offeredCash: 200, requestedProperties: ['P01'], requestedCash: 0 }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;

        res = engine.process(state, { type: 'ACCEPT_TRADE_OFFER', playerId: 'p1', payload: { offerId } });
        expect(res.events[0].type).toBe("ERROR");
        expect((res.events[0] as any).message).toContain("mandatory resolution phase");
    });

    it('Case 22, 23: existing trade accepted during Finance Liquidity Resolution', () => {
        // 1. Create a valid trade BEFORE crisis
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p2',
            payload: { receiverId: 'p1', offeredProperties: [], offeredCash: 500, requestedProperties: ['P01'], requestedCash: 0 }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;

        // 2. Player 1 hits liquidity crisis (e.g. owes 400 to bank)
        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.players[0].cash = 0; // no cash
        state.public.activeObligation = { amount: 400, recipientId: null, reason: "TAX" };

        // 3. Player 1 accepts trade to get cash
        res = engine.process(state, { type: 'ACCEPT_TRADE_OFFER', playerId: 'p1', payload: { offerId } });
        state = res.state;
        
        // 4. Verification: Trade executes AND obligation rechecks successfully
        expect(state.public.properties['P01'].ownerId).toBe('p2'); // Trade happened
        expect(state.public.players[0].cash).toBe(100); // Got 500 from trade, paid 400 obligation!
        expect(state.public.players[0].status).toBe("ACTIVE");
        expect(state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
        expect(state.public.activeObligation).toBeNull();
    });

    it('Case 24: invalid existing trade during liquidity resolution', () => {
        let res = engine.process(state, {
            type: 'CREATE_TRADE_OFFER',
            playerId: 'p2',
            payload: { receiverId: 'p1', offeredProperties: [], offeredCash: 500, requestedProperties: ['P01'], requestedCash: 0 }
        });
        state = res.state;
        const offerId = state.public.tradeOffers[0].id;

        // Before crisis, p2 spends their cash!
        state.public.players[1].cash = 0; 

        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.players[0].cash = 0;
        state.public.activeObligation = { amount: 400, recipientId: null, reason: "TAX" };

        res = engine.process(state, { type: 'ACCEPT_TRADE_OFFER', playerId: 'p1', payload: { offerId } });
        expect(res.events[0].type).toBe("ERROR"); // Sender has insufficient cash
        expect(state.public.players[0].status).toBe("IN_LIQUIDITY_RESOLUTION"); // Still stuck
    });
});
