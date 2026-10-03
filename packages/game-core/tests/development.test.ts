import { expect, test, describe } from 'vitest';
import { 
    createInitialGameState, 
    RulesEngine, 
    DeterministicTestRandomSource 
} from '../src/index.js';
import { DEVELOPMENT_PROJECTS } from 'game-data';

describe('Development Exchange Lifecycle Integration', () => {
    test('Initialization, construction, and supply accounting', () => {
        const randomSource = new DeterministicTestRandomSource();
        // Turn on deterministic mode so shuffle reverses the array reliably
        randomSource.setDeterministicShuffleMode(true);
        
        let state = createInitialGameState([{ id: 'p1', name: 'P1' }, { id: 'p2', name: 'P2' }], randomSource);
        const engine = new RulesEngine(randomSource);

        // 32 total projects originally
        expect(DEVELOPMENT_PROJECTS.length).toBe(32);
        
        // 4 projects initially in Exchange
        expect(state.public.developmentExchange.length).toBe(4);
        
        // 28 projects in Supply
        expect(state.public.developmentSupply.length).toBe(28);

        // Verify no overlap
        const combined = [...state.public.developmentExchange, ...state.public.developmentSupply];
        const unique = new Set(combined);
        expect(unique.size).toBe(32); // exactly 32 unique projects
        expect(combined.length).toBe(32); // no duplicates

        // Setup property for construction
        state.public.properties['P01'].ownerId = 'p1'; state.public.properties['P02'].ownerId = 'p1';
        
        // Give player 1 plenty of cash
        state.public.players[0].cash = 5000;

        // Force a specific compatible project into the exchange to guarantee validity
        // P01 Primary: Retail, Civic
        // Let's find a Retail project in the supply/exchange and put it at exchange[0]
        const validProjectId = 'DEV_RETAIL_1';
        // Remove it from wherever it is
        state.public.developmentExchange = state.public.developmentExchange.filter(p => p !== validProjectId);
        state.public.developmentSupply = state.public.developmentSupply.filter(p => p !== validProjectId);
        // Put it in exchange
        state.public.developmentExchange.unshift(validProjectId);
        // Balance counts
        while (state.public.developmentExchange.length < 4) {
             const fill = state.public.developmentSupply.shift()!;
             state.public.developmentExchange.push(fill);
        }
        while (state.public.developmentExchange.length > 4) {
             const excess = state.public.developmentExchange.pop()!;
             state.public.developmentSupply.unshift(excess);
        }

        const projectToConstruct = state.public.developmentExchange[0];
        const supplyBefore = [...state.public.developmentSupply];
        const firstInSupply = supplyBefore[0];

        const res = engine.process(state, {
            type: 'CONSTRUCT_DEVELOPMENT',
            playerId: 'p1',
            payload: {
                propertyId: 'P01',
                projectId: projectToConstruct,
                slot: 1
            }
        });

        expect(res.events.some(e => e.type === 'ERROR')).toBe(false);
        state = res.state;

        // selected project leaves Exchange
        expect(state.public.developmentExchange).not.toContain(projectToConstruct);

        // a replacement is drawn from Supply
        expect(state.public.developmentExchange).toContain(firstInSupply);
        
        // Exchange returns to exactly 4 projects
        expect(state.public.developmentExchange.length).toBe(4);
        
        // Supply returns to exactly 27 projects (28 - 1 drawn)
        expect(state.public.developmentSupply.length).toBe(27);

        // total unique projects across Exchange + Supply remains exactly 31
        const combinedAfter = [...state.public.developmentExchange, ...state.public.developmentSupply];
        const uniqueAfter = new Set(combinedAfter);
        expect(uniqueAfter.size).toBe(31);
        expect(combinedAfter.length).toBe(31);
    });

    test('Redevelopment / Supply Accounting', () => {
        const randomSource = new DeterministicTestRandomSource();
        randomSource.setDeterministicShuffleMode(true);
        
        let state = createInitialGameState([{ id: 'p1', name: 'P1' }, { id: 'p2', name: 'P2' }], randomSource);
        const engine = new RulesEngine(randomSource);

        state.public.properties['P01'].ownerId = 'p1'; state.public.properties['P02'].ownerId = 'p1';
        state.public.players[0].cash = 5000;

        // Force a valid project into slot 1
        state.public.properties['P01'].slot1 = 'DEV_RETAIL_1';
        
        // Ensure supply doesn't have it
        state.public.developmentExchange = state.public.developmentExchange.filter(p => p !== 'DEV_RETAIL_1');
        state.public.developmentSupply = state.public.developmentSupply.filter(p => p !== 'DEV_RETAIL_1');

        // Put a valid replacement in exchange (e.g. Civic)
        const validReplacement = 'DEV_CIVIC_1';
        state.public.developmentExchange = state.public.developmentExchange.filter(p => p !== validReplacement);
        state.public.developmentSupply = state.public.developmentSupply.filter(p => p !== validReplacement);
        state.public.developmentExchange.unshift(validReplacement);

        // Make counts exact
        while(state.public.developmentExchange.length < 4) state.public.developmentExchange.push(state.public.developmentSupply.shift()!);

        const initialCash = state.public.players[0].cash;
        const supplyCountBefore = state.public.developmentSupply.length;

        // Redevelop
        const res = engine.process(state, {
            type: 'CONSTRUCT_DEVELOPMENT',
            playerId: 'p1',
            payload: {
                propertyId: 'P01',
                projectId: validReplacement,
                slot: 1
            }
        });

        expect(res.events.some(e => e.type === 'ERROR')).toBe(false);
        state = res.state;

        // original project removed and returns to supply
        expect(state.public.properties['P01'].slot1).toBe(validReplacement);
        expect(state.public.developmentSupply).toContain('DEV_RETAIL_1');
        
        // Exchange/Supply accounting remains valid
        expect(state.public.developmentExchange.length).toBe(4);
        // Supply count should be same as before: +1 (old) -1 (drawn) = same
        expect(state.public.developmentSupply.length).toBe(supplyCountBefore);

        const combinedAfter = [...state.public.developmentExchange, ...state.public.developmentSupply];
        expect(new Set(combinedAfter).size).toBe(combinedAfter.length); // no duplicates
        expect(combinedAfter).not.toContain(validReplacement); // installed project is not in supply

        // Check credit (base price P01 is 240. Slot 1 is 35% -> 84. Redevelop is 50% credit -> 42. Final cost -> 42.)
        expect(state.public.players[0].cash).toBe(initialCash - 42);
    });
});
