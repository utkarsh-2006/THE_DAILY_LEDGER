export interface RandomSource {
    rollDice(): [number, number];
    shuffle<T>(array: T[]): T[];
}

export class ProductionRandomSource implements RandomSource {
    rollDice(): [number, number] {
        return [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];
    }

    shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}

export class DeterministicTestRandomSource implements RandomSource {
    private nextRolls: [number, number][] = [];
    private deterministicMode: boolean = false;

    setNextRolls(rolls: [number, number][]) {
        this.nextRolls = rolls;
    }

    setDeterministicShuffleMode(mode: boolean) {
        this.deterministicMode = mode;
    }

    rollDice(): [number, number] {
        if (this.nextRolls.length > 0) {
            return this.nextRolls.shift()!;
        }
        return [1, 1]; // Fallback
    }

    shuffle<T>(array: T[]): T[] {
        const result = [...array];
        if (this.deterministicMode) {
            // Simple deterministic reverse for testing
            return result.reverse();
        }
        return result; // Default no-op for tests unless explicitly tested
    }
}
