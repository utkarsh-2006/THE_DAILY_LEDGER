import { DeterministicTestRandomSource } from '../src/randomness/index.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { RulesEngine } from '../src/engine/index.js';
import { createInitialGameState, GameState } from '../src/state/index.js';
import { getPropertyById } from 'game-data';

class MockRandom {
    constructor(private d1: number, private d2: number) {}
    rollDice(): [number, number] {
        return [this.d1, this.d2];
    }
}

describe('Finance System / Liquidity Resolution', () => {
    let state: GameState;
    let engine: RulesEngine;

    beforeEach(() => {
        state = createInitialGameState([
            { id: "p1", name: "Player 1" },
            { id: "p2", name: "Player 2" },
            { id: "p3", name: "Player 3" }
        ], new DeterministicTestRandomSource());
        engine = new RulesEngine(new MockRandom(1, 1));
    });

    it('1. Undeveloped property liquidation', () => {
        // P01 asking price is 240. Undeveloped. Asset Base = 240. Recovery = 120.
        state.public.players[0].cash = 0;
        state.public.properties["P01"].ownerId = "p1";
        state.public.players[0].ownedProperties.push("P01");
        
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.activeObligation = { amount: 150, recipientId: "p2", reason: "RENT" };

        const result = engine.process(state, { type: "LIQUIDATE_PROPERTY", playerId: "p1", payload: { propertyId: "P01" } });
        
        expect(result.state.public.players[0].cash).toBe(120);
        expect(result.state.public.properties["P01"].ownerId).toBeNull();
        expect(result.state.public.turnPhase).toBe("RESOLVE_MANDATORY_PAYMENT");
    });

    it('2. Property with one development liquidation', () => {
        // P01 price 240. Slot 1 cost = 84 (35%). Cap val = 63 (75% of 84).
        // Asset Base = 240 + 63 = 303. Recovery = Math.floor(151.5) = 151.
        state.public.players[0].cash = 0;
        state.public.properties["P01"].ownerId = "p1";
        state.public.properties["P01"].slot1 = "DEV_A";
        state.public.players[0].ownedProperties.push("P01");
        
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.activeObligation = { amount: 200, recipientId: "p2", reason: "RENT" };

        const result = engine.process(state, { type: "LIQUIDATE_PROPERTY", playerId: "p1", payload: { propertyId: "P01" } });
        
        expect(result.state.public.players[0].cash).toBe(151);
        expect(result.state.public.properties["P01"].ownerId).toBeNull();
        expect(result.state.public.properties["P01"].slot1).toBeNull();
    });

    it('3. Property with two developments liquidation', () => {
        // P01 price 240. Slot 1 cap val = 63. Slot 2 cost = 120 (50%). Cap val = 90 (75% of 120).
        // Asset Base = 240 + 63 + 90 = 393. Recovery = Math.floor(196.5) = 196.
        state.public.players[0].cash = 0;
        state.public.properties["P01"].ownerId = "p1";
        state.public.properties["P01"].slot1 = "DEV_A";
        state.public.properties["P01"].slot2 = "DEV_B";
        state.public.players[0].ownedProperties.push("P01");
        
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.activeObligation = { amount: 300, recipientId: "p2", reason: "RENT" };

        const result = engine.process(state, { type: "LIQUIDATE_PROPERTY", playerId: "p1", payload: { propertyId: "P01" } });
        
        expect(result.state.public.players[0].cash).toBe(196);
        expect(result.state.public.properties["P01"].ownerId).toBeNull();
        expect(result.state.public.properties["P01"].slot1).toBeNull();
        expect(result.state.public.properties["P01"].slot2).toBeNull();
    });

    it('4. Flagship liquidation', () => {
        // P01 price 240. Flagship cost = 240 (100%). Cap val = 180 (75% of 240).
        // Asset Base = 240 + 180 = 420. Recovery = 210.
        state.public.players[0].cash = 0;
        state.public.properties["P01"].ownerId = "p1";
        state.public.properties["P01"].isFlagship = true;
        state.public.players[0].ownedProperties.push("P01");
        
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.activeObligation = { amount: 300, recipientId: "p2", reason: "RENT" };

        const result = engine.process(state, { type: "LIQUIDATE_PROPERTY", playerId: "p1", payload: { propertyId: "P01" } });
        
        expect(result.state.public.players[0].cash).toBe(210);
        expect(result.state.public.properties["P01"].ownerId).toBeNull();
        expect(result.state.public.properties["P01"].isFlagship).toBe(false);
    });

    it('5. Bankruptcy caused by player rent', () => {
        // Owed to p2. p1 has 40 cash. Rent is 100.
        state.public.players[0].cash = 40;
        state.public.properties["P01"].ownerId = "p1";
        state.public.properties["P01"].slot1 = "DEV_A";
        state.public.properties["P01"].isFlagship = true; // just to verify cleanup
        state.public.players[0].ownedProperties.push("P01");
        
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.activeObligation = { amount: 100, recipientId: "p2", reason: "RENT" };

        const p2InitialCash = state.public.players[1].cash;
        const result = engine.process(state, { type: "DECLARE_BANKRUPTCY", playerId: "p1" });
        
        expect(result.state.public.players[0].status).toBe("BANKRUPT");
        expect(result.state.public.players[0].cash).toBe(0);
        // p2 receives all 40
        expect(result.state.public.players[1].cash).toBe(p2InitialCash + 40);
        
        // Property cleaned up completely
        const p01 = result.state.public.properties["P01"];
        expect(p01.ownerId).toBeNull();
        expect(p01.slot1).toBeNull();
        expect(p01.isFlagship).toBe(false);
        expect(result.state.public.players[0].ownedProperties.length).toBe(0);
    });

    it('6. Bankruptcy caused by municipal levy', () => {
        // Owed to City (recipientId null). p1 has 40 cash.
        state.public.players[0].cash = 40;
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.activeObligation = { amount: 100, recipientId: null, reason: "MUNICIPAL_LEVY" };

        const result = engine.process(state, { type: "DECLARE_BANKRUPTCY", playerId: "p1" });
        
        expect(result.state.public.players[0].status).toBe("BANKRUPT");
        expect(result.state.public.players[0].cash).toBe(0); // Surrendered to city (vanishes)
        
        // No other players get the money
        expect(result.state.public.players[1].cash).toBe(1800);
        expect(result.state.public.players[2].cash).toBe(1800);
        
        // Turn correctly skips p1 now
        expect(result.state.public.activePlayerIndex).toBe(1);
    });

    it('7. Bankruptcy caused by city auction obligation', () => {
        // Same logic, just different reason
        state.public.players[0].cash = 10;
        state.public.players[0].status = "IN_LIQUIDITY_RESOLUTION";
        state.public.turnPhase = "RESOLVE_MANDATORY_PAYMENT";
        state.public.activeObligation = { amount: 150, recipientId: null, reason: "AUCTION_BID" };

        const result = engine.process(state, { type: "DECLARE_BANKRUPTCY", playerId: "p1" });
        
        expect(result.state.public.players[0].status).toBe("BANKRUPT");
        expect(result.state.public.players[0].cash).toBe(0); 
    });
});
