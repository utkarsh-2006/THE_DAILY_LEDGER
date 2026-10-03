import { describe, it, expect, beforeEach } from 'vitest';
import { 
    RulesEngine, 
    DeterministicTestRandomSource, 
    createInitialGameState, 
    GameState, 
    INITIAL_CASH 
} from '../src/index.js';
import { getPropertyById, getPropertyBySpaceIndex } from 'game-data';

describe('RulesEngine Phase 1 - Authoritative Kernel Audit & Verification', () => {
    let engine: RulesEngine;
    let randomSource: DeterministicTestRandomSource;
    let state: GameState;

    beforeEach(() => {
        randomSource = new DeterministicTestRandomSource();
        engine = new RulesEngine(randomSource);
        state = createInitialGameState([
            { id: "p1", name: "Player 1" },
            { id: "p2", name: "Player 2" }
        ], new DeterministicTestRandomSource());
    });

    describe('1. Game Initialization', () => {
        it('should correctly initialize standard 2-player configuration', () => {
            expect(state.public.gameStatus).toBe("IN_PROGRESS");
            expect(state.public.currentRound).toBe(1);
            expect(state.public.turnPhase).toBe("MOVE");
            expect(state.public.activePlayerIndex).toBe(0);
            expect(state.public.players.length).toBe(2);

            expect(state.public.players[0].cash).toBe(INITIAL_CASH); // $1,800
            expect(state.public.players[0].position).toBe(0);
            expect(state.public.players[0].ownedProperties).toEqual([]);
            expect(state.public.players[0].status).toBe("ACTIVE");
            expect(state.public.players[0].isLocked).toBe(false);

            expect(state.public.players[1].cash).toBe(INITIAL_CASH); // $1,800
            expect(state.public.players[1].position).toBe(0);

            // All 24 properties must be unowned
            const propertyKeys = Object.keys(state.public.properties);
            expect(propertyKeys.length).toBe(24);
            for (const key of propertyKeys) {
                expect(state.public.properties[key].ownerId).toBeNull();
            }
        });

        it('should support up to 4 players and enforce 2-4 player boundary', () => {
            const state4 = createInitialGameState([
                { id: "p1", name: "P1" },
                { id: "p2", name: "P2" },
                { id: "p3", name: "P3" },
                { id: "p4", name: "P4" }
            ], new DeterministicTestRandomSource());
            expect(state4.public.players.length).toBe(4);

            expect(() => createInitialGameState([{ id: "p1", name: "P1" }], new DeterministicTestRandomSource())).toThrow();
            expect(() => createInitialGameState([
                { id: "p1", name: "P1" },
                { id: "p2", name: "P2" },
                { id: "p3", name: "P3" },
                { id: "p4", name: "P4" },
                { id: "p5", name: "P5" }
            ], new DeterministicTestRandomSource())).toThrow();
        });
    });

    describe('2. Deterministic Movement & Velora Central Dividend', () => {
        it('should move player deterministically on normal movement', () => {
            randomSource.setNextRolls([[1, 2]]); // Move 3 spaces (0 -> 3: [P03] The Royal Arcade)
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            expect(result.state.public.players[0].position).toBe(3);
            expect(result.state.public.players[0].cash).toBe(1800);
            expect(result.events.some(e => e.type === "DICE_ROLLED")).toBe(true);
            expect(result.events.some(e => e.type === "PLAYER_MOVED")).toBe(true);
            expect(result.events.some(e => e.type === "DIVIDEND_PAID")).toBe(false);
        });

        it('should award $225 dividend when passing position 00', () => {
            state.public.players[0].position = 38;
            randomSource.setNextRolls([[2, 3]]); // Moves 5 spaces: 38 + 5 = 43 -> space 3

            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            expect(result.state.public.players[0].position).toBe(3);
            expect(result.state.public.players[0].cash).toBe(1800 + 225); // $2025
            expect(result.events.some(e => e.type === "DIVIDEND_PAID")).toBe(true);
        });

        it('should award $225 dividend on exact landing on position 00', () => {
            state.public.players[0].position = 35;
            randomSource.setNextRolls([[2, 3]]); // Moves 5 spaces: 35 + 5 = 40 -> space 0

            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            expect(result.state.public.players[0].position).toBe(0);
            expect(result.state.public.players[0].cash).toBe(1800 + 225); // $2025
            expect(result.events.some(e => e.type === "DIVIDEND_PAID")).toBe(true);
        });
    });

    describe('3. Turn Authority & Validation', () => {
        it('should reject roll from a non-active player without mutating state', () => {
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p2" });
            expect(result.state).toEqual(state);
            expect(result.events[0].type).toBe("ERROR");
            expect((result.events[0] as any).code).toBe("NOT_YOUR_TURN");
        });

        it('should reject duplicate roll in the same turn', () => {
            randomSource.setNextRolls([[1, 2]]);
            const afterRoll = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            // Player is now at position 3 in RESOLVE_PROPERTY_OR_SPECIAL_SPACE phase
            const duplicateRoll = engine.process(afterRoll.state, { type: "ROLL_DICE", playerId: "p1" });
            expect(duplicateRoll.events[0].type).toBe("ERROR");
            expect((duplicateRoll.events[0] as any).code).toBe("INVALID_TURN_PHASE");
        });

        it('should reject actions not permitted in the current turn phase', () => {
            // Trying to buy property in MOVE phase
            const buyResult = engine.process(state, { type: "BUY_PROPERTY", playerId: "p1" });
            expect(buyResult.events[0].type).toBe("ERROR");
            expect((buyResult.events[0] as any).code).toBe("INVALID_BUY_ACTION");
        });
    });

    describe('4. Property Acquisition (Buy & Pass)', () => {
        it('should detect unowned property and allow purchase with correct Asking Price', () => {
            // Space 1 is [P01] Weaver's Market (Asking Price: $240)
            randomSource.setNextRolls([[0, 1]]);
            const rolled = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            expect(rolled.state.public.turnPhase).toBe("RESOLVE_PROPERTY_OR_SPECIAL_SPACE");

            const prop01 = getPropertyById("P01")!;
            expect(prop01.basePrice).toBe(240);

            const bought = engine.process(rolled.state, { type: "BUY_PROPERTY", playerId: "p1" });

            expect(bought.state.public.players[0].cash).toBe(1800 - 240); // 1560
            expect(bought.state.public.players[0].ownedProperties).toContain("P01");
            expect(bought.state.public.properties["P01"].ownerId).toBe("p1");
            expect(bought.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            expect(bought.events.some(e => e.type === "PROPERTY_PURCHASED")).toBe(true);
        });

        it('should map board spaces across districts accurately (e.g. Space 26 -> P21 Assembly Hangar)', () => {
            // Space 26 is P21 Assembly Hangar (Asking Price: $270)
            state.public.players[0].position = 20;
            randomSource.setNextRolls([[3, 3]]); // Move to 26
            const rolled = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            expect(rolled.state.public.players[0].position).toBe(26);
            expect(rolled.state.public.turnPhase).toBe("RESOLVE_PROPERTY_OR_SPECIAL_SPACE");

            const bought = engine.process(rolled.state, { type: "BUY_PROPERTY", playerId: "p1" });
            expect(bought.state.public.properties["P21"].ownerId).toBe("p1");
            expect(bought.state.public.players[0].ownedProperties).toContain("P21");
            expect(bought.state.public.players[0].cash).toBe(1800 - 270); // 1530
        });

        it('should reject purchase with insufficient cash', () => {
            state.public.players[0].cash = 100; // Less than $240
            randomSource.setNextRolls([[0, 1]]); // Move to space 1 (P01)
            const rolled = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            const bought = engine.process(rolled.state, { type: "BUY_PROPERTY", playerId: "p1" });
            expect(bought.state.public.properties["P01"].ownerId).toBeNull();
            expect(bought.events[0].type).toBe("ERROR");
            expect(bought.events[0].message).toBe("Insufficient cash");
        });

        it('should reject purchase of an already owned property', () => {
            state.public.properties["P01"].ownerId = "p2";
            state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
            state.public.players[0].position = 1;

            const bought = engine.process(state, { type: "BUY_PROPERTY", playerId: "p1" });
            expect(bought.events[0].type).toBe("ERROR");
            expect(bought.events[0].message).toBe("Property already owned");
        });

        it('should handle PASS_PROPERTY by leaving unowned and triggering AUCTION_TRIGGERED event', () => {
            randomSource.setNextRolls([[0, 1]]); // Space 1 (P01, Asking Price $240)
            const rolled = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            const passed = engine.process(rolled.state, { type: "PASS_PROPERTY", playerId: "p1" });

            expect(passed.state.public.properties["P01"].ownerId).toBeNull();
            expect(passed.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            expect(passed.events.some(e => e.type === "PROPERTY_PASSED")).toBe(true);

            const auctionEvent = passed.events.find(e => e.type === "AUCTION_TRIGGERED");
            expect(auctionEvent).toBeDefined();
            expect(auctionEvent?.payload.propertyId).toBe("P01");
            expect(auctionEvent?.payload.minimumBid).toBe(120); // 50% of $240
        });
    });

    describe('5. Rent Obligation & Settlement', () => {
        it('should identify rent obligation on landing on property owned by another player and transfer cash', () => {
            // P01 (Space 1) is owned by p2. Base yield is $43
            state.public.properties["P01"].ownerId = "p2";
            state.public.players[1].ownedProperties.push("P01");

            randomSource.setNextRolls([[0, 1]]); // p1 lands on space 1
            const rolled = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            // p1 should pay $43 rent to p2
            expect(rolled.state.public.players[0].cash).toBe(1800 - 43); // 1757
            expect(rolled.state.public.players[1].cash).toBe(1800 + 43); // 1843
            expect(rolled.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");

            const rentEvent = rolled.events.find(e => e.type === "RENT_PAID");
            expect(rentEvent).toBeDefined();
            expect(rentEvent?.payload.payerId).toBe("p1");
            expect(rentEvent?.payload.recipientId).toBe("p2");
            expect(rentEvent?.payload.propertyId).toBe("P01");
            expect(rentEvent?.payload.amount).toBe(43);
        });

        it('should NOT trigger rent obligation when active player lands on their own property', () => {
            state.public.properties["P01"].ownerId = "p1";
            state.public.players[0].ownedProperties.push("P01");

            randomSource.setNextRolls([[0, 1]]); // p1 lands on their own space 1
            const rolled = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });

            expect(rolled.state.public.players[0].cash).toBe(1800);
            expect(rolled.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            expect(rolled.events.some(e => e.type === "RENT_PAID")).toBe(false);
        });
    });

    describe('6. Turn Progression & Round Advancing', () => {
        it('should progress turn from OPTIONAL_ACTIONS to next player upon END_TURN', () => {
            randomSource.setNextRolls([[0, 1]]);
            const rolled = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            const passed = engine.process(rolled.state, { type: "PASS_PROPERTY", playerId: "p1" });

            expect(passed.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");

            const ended = engine.process(passed.state, { type: "END_TURN", playerId: "p1" });

            expect(ended.state.public.activePlayerIndex).toBe(1); // Player 2 is active
            expect(ended.state.public.turnPhase).toBe("MOVE");
            expect(ended.state.public.currentRound).toBe(1);
            expect(ended.events.some(e => e.type === "TURN_ADVANCED")).toBe(true);

            // Now p2 can act
            randomSource.setNextRolls([[1, 1]]);
            const p2Rolled = engine.process(ended.state, { type: "ROLL_DICE", playerId: "p2" });
            expect(p2Rolled.state.public.players[1].position).toBe(2);

            // When p2 ends turn, round advances to 2
            const p2Passed = engine.process(p2Rolled.state, { type: "PASS_PROPERTY", playerId: "p2" });
            const p2Ended = engine.process(p2Passed.state, { type: "END_TURN", playerId: "p2" });

            expect(p2Ended.state.public.activePlayerIndex).toBe(0); // Player 1 active again
            expect(p2Ended.state.public.currentRound).toBe(2);
        });

        it('should reject END_TURN if not in OPTIONAL_ACTIONS phase', () => {
            const result = engine.process(state, { type: "END_TURN", playerId: "p1" });
            expect(result.events[0].type).toBe("ERROR");
            expect((result.events[0] as any).code).toBe("CANNOT_END_TURN");
        });
    });
});
