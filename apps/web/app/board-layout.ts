export function getGridPosition(index: number): { row: number; col: number } {
    if (index >= 0 && index <= 10) {
        // Bottom row, right to left
        return { row: 11, col: 11 - index };
    } else if (index >= 11 && index <= 19) {
        // Left column, bottom to top
        return { row: 11 - (index - 10), col: 1 };
    } else if (index >= 20 && index <= 30) {
        // Top row, left to right
        return { row: 1, col: 1 + (index - 20) };
    } else if (index >= 31 && index <= 39) {
        // Right column, top to bottom
        return { row: 1 + (index - 30), col: 11 };
    }
    return { row: 1, col: 1 };
}
