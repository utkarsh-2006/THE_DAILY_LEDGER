export interface RandomSource {
    rollDice(): [number, number];
}

export class ProductionRandomSource implements RandomSource {
    rollDice(): [number, number] {
        return [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];
    }
}

export class DeterministicTestRandomSource implements RandomSource {
    private nextRolls: [number, number][] = [];

    setNextRolls(rolls: [number, number][]) {
        this.nextRolls = rolls;
    }

    rollDice(): [number, number] {
        if (this.nextRolls.length > 0) {
            return this.nextRolls.shift()!;
        }
        return [1, 1]; // Fallback
    }
}
