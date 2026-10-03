import { DeterministicTestRandomSource } from '../src/randomness/index.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { RulesEngine } from '../src/engine/index.js';
import { createInitialGameState, GameState } from '../src/state/index.js';

class MockRandom {
    constructor(private d1: number, private d2: number) {}
    rollDice(): [number, number] {
        return [this.d1, this.d2];
    }
}

describe('Special Spaces System', () => {
    let state: GameState;

    beforeEach(() => {
        state = createInitialGameState([
            { id: "p1", name: "Player 1" },
            { id: "p2", name: "Player 2" }
        ], new DeterministicTestRandomSource());
    });

    describe('Civic Hold (Space 10) & Regulatory Court (Space 38)', () => {
        it('should allow normal visit to Space 10 without penalties', () => {
            const engine = new RulesEngine(new MockRandom(5, 5));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(10);
            expect(result.state.public.players[0].isLocked).toBe(false);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
        });

        it('should remand player to Civic Hold from Regulatory Court (Space 38)', () => {
            // p1 starts at 30, rolls 8 -> lands on 38
            state.public.players[0].position = 30;
            const engine = new RulesEngine(new MockRandom(4, 4));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(10);
            expect(result.state.public.players[0].isLocked).toBe(true);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            
            const remandedEvent = result.events.find(e => e.type === "PLAYER_REMANDED");
            expect(remandedEvent).toBeDefined();
        });

        it('should skip turn when Locked and release after', () => {
            state.public.players[0].isLocked = true;
            state.public.turnPhase = "MOVE";
            
            const engine = new RulesEngine(new MockRandom(1, 1));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            // Should not have rolled (position is still 0)
            expect(result.state.public.players[0].position).toBe(0);
            expect(result.state.public.players[0].isLocked).toBe(false);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            
            const releaseEvent = result.events.find(e => e.type === "CIVIC_HOLD_RELEASED");
            expect(releaseEvent).toBeDefined();
        });
    });

    describe('Transport Network', () => {
        it('should prompt for transport when landing on Transport node', () => {
            // Roll 15 from start
            const engine = new RulesEngine(new MockRandom(10, 5));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(15);
            expect(result.state.public.turnPhase).toBe("RESOLVE_PROPERTY_OR_SPECIAL_SPACE");
            expect(result.state.public.pendingActionRequired).toBe("USE_TRANSPORT");
        });

        it('should allow using transport to another valid node', () => {
            state.public.players[0].position = 15;
            state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
            state.public.pendingActionRequired = "USE_TRANSPORT";

            const engine = new RulesEngine(new MockRandom(1, 1));
            const result = engine.process(state, { 
                type: "USE_TRANSPORT", 
                playerId: "p1", 
                payload: { destinationId: 35 } 
            });

            expect(result.state.public.players[0].position).toBe(35);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            
            const transportEvent = result.events.find(e => e.type === "TRANSPORT_USED");
            expect(transportEvent).toBeDefined();
        });

        it('should reject invalid transport destination', () => {
            state.public.players[0].position = 15;
            state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
            state.public.pendingActionRequired = "USE_TRANSPORT";

            const engine = new RulesEngine(new MockRandom(1, 1));
            const result = engine.process(state, { 
                type: "USE_TRANSPORT", 
                playerId: "p1", 
                payload: { destinationId: 10 } // Not a transport node
            });

            expect(result.state.public.players[0].position).toBe(15); // Unchanged
            expect(result.events.find(e => e.type === "ERROR")).toBeDefined();
        });

        it('should allow skipping transport', () => {
            state.public.players[0].position = 15;
            state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
            state.public.pendingActionRequired = "USE_TRANSPORT";

            const engine = new RulesEngine(new MockRandom(1, 1));
            const result = engine.process(state, { 
                type: "SKIP_TRANSPORT", 
                playerId: "p1" 
            });

            expect(result.state.public.players[0].position).toBe(15); // Stayed
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
        });
    });

    describe('City Hall / Civic Reserve', () => {
        it('should activate Civic Reserve when landing on City Hall (20)', () => {
            const engine = new RulesEngine(new MockRandom(10, 10));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(20);
            expect(result.state.public.civicReserveActive).toBe(true);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            
            expect(result.events.find(e => e.type === "CIVIC_RESERVE_ACTIVATED")).toBeDefined();
        });

        it('should claim Civic Reserve when active and landing on 39', () => {
            state.public.civicReserveActive = true;
            state.public.players[0].position = 30;
            
            const engine = new RulesEngine(new MockRandom(5, 4));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(39);
            expect(result.state.public.civicReserveActive).toBe(false);
            expect(result.state.public.players[0].cash).toBe(1800 + 150);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            
            expect(result.events.find(e => e.type === "CIVIC_RESERVE_CLAIMED")).toBeDefined();
        });
        
        it('should do nothing when landing on 39 and inactive', () => {
            state.public.civicReserveActive = false;
            state.public.players[0].position = 30;
            
            const engine = new RulesEngine(new MockRandom(5, 4));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(39);
            expect(result.state.public.civicReserveActive).toBe(false);
            expect(result.state.public.players[0].cash).toBe(1800); // Unchanged
        });
    });

    describe('Treasury Window (33)', () => {
        it('should not be eligible if cash >= 300', () => {
            state.public.players[0].position = 30;
            state.public.players[0].cash = 300;
            const engine = new RulesEngine(new MockRandom(2, 1));
            
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(33);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS"); // Skipped phase
        });

        it('should prompt if eligible (cash < 300)', () => {
            state.public.players[0].position = 30;
            state.public.players[0].cash = 299;
            const engine = new RulesEngine(new MockRandom(2, 1));
            
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(33);
            expect(result.state.public.turnPhase).toBe("RESOLVE_PROPERTY_OR_SPECIAL_SPACE");
            expect(result.state.public.pendingActionRequired).toBe("CLAIM_TREASURY");
        });

        it('should award $150 on claim', () => {
            state.public.players[0].position = 33;
            state.public.players[0].cash = 100;
            state.public.turnPhase = "RESOLVE_PROPERTY_OR_SPECIAL_SPACE";
            state.public.pendingActionRequired = "CLAIM_TREASURY";

            const engine = new RulesEngine(new MockRandom(1, 1));
            const result = engine.process(state, { type: "CLAIM_TREASURY", playerId: "p1" });
            
            expect(result.state.public.players[0].cash).toBe(250);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            expect(result.events.find(e => e.type === "TREASURY_GRANT_CLAIMED")).toBeDefined();
        });
    });

    describe('Municipal Levy (25)', () => {
        it('should charge 8% of cash (within min/max)', () => {
            state.public.players[0].position = 20;
            state.public.players[0].cash = 1000;
            // 8% of 1000 = 80 (between 40 and 180)
            
            const engine = new RulesEngine(new MockRandom(3, 2));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(25);
            expect(result.state.public.players[0].cash).toBe(1000 - 80);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
            expect(result.events.find(e => e.type === "MUNICIPAL_LEVY_PAID")).toBeDefined();
        });

        it('should charge min $40', () => {
            state.public.players[0].position = 20;
            state.public.players[0].cash = 100; // 8% is 8, so rounds to 40
            
            const engine = new RulesEngine(new MockRandom(3, 2));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].cash).toBe(100 - 40);
        });

        it('should charge max $180', () => {
            state.public.players[0].position = 20;
            state.public.players[0].cash = 5000; // 8% is 400, so caps at 180
            
            const engine = new RulesEngine(new MockRandom(3, 2));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].cash).toBe(5000 - 180);
        });

        it('should enter mandatory payment if insufficient cash', () => {
            state.public.players[0].position = 20;
            state.public.players[0].cash = 20; // 8% is 1.6, min is 40. Player only has 20.
            
            const engine = new RulesEngine(new MockRandom(3, 2));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].cash).toBe(20); // No deduction yet
            expect(result.state.public.turnPhase).toBe("RESOLVE_MANDATORY_PAYMENT");
        });
    });

    describe('Information Spaces', () => {
        it('should transition to OPTIONAL_ACTIONS on City Desk (5)', () => {
            const engine = new RulesEngine(new MockRandom(3, 2));
            const result = engine.process(state, { type: "ROLL_DICE", playerId: "p1" });
            
            expect(result.state.public.players[0].position).toBe(5);
            expect(result.state.public.turnPhase).toBe("OPTIONAL_ACTIONS");
        });
    });
});
