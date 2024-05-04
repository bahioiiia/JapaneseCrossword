function solveJapaneseCrossword(rowHints, colHints) {
    const numRows = rowHints.length;
    const numCols = colHints.length;
    
    // Функція для генерації всіх можливих комбінацій блоків для заданих вказівок
    function generateCandidates(hints, length) {
        const candidates = [];
        const totalBlocks = hints.reduce((a, b) => a + b, 0) + hints.length - 1;
        const emptySlots = length - totalBlocks;
        
        // Рекурсивна функція для генерації комбінацій
        function generate(currIndex, currBlocks, currCombination) {
            if (currBlocks > hints.length) return;
            if (currIndex === length) {
                if (currBlocks === hints.length) {
                    candidates.push(currCombination.slice());
                }
                return;
            }
            
            // Варіант з блоком
            if (currBlocks < hints.length) {
                for (let blockSize of hints[currBlocks]) {
                    if (currIndex + blockSize <= length) {
                        for (let i = 0; i < blockSize; i++) {
                            currCombination[currIndex + i] = 1;
                        }
                        if (currIndex + blockSize + 1 <= length) {
                            currCombination[currIndex + blockSize] = 0;
                        }
                        generate(currIndex + blockSize + 1, currBlocks + 1, currCombination);
                        for (let i = 0; i < blockSize + 1; i++) {
                            currCombination[currIndex + i] = 0;
                        }
                    }
                }
            }
            
            // Варіант без блоку
            if (emptySlots > 0) {
                currCombination[currIndex] = 0;
                generate(currIndex + 1, currBlocks, currCombination);
            }
        }
        
        generate(0, 0, Array(length).fill(0));
        return candidates;
    }
    
    // Генерація кандидатів для кожного рядка і стовпця
    const rowCandidates = [];
    const colCandidates = [];
    
    for (let i = 0; i < numRows; i++) {
        rowCandidates.push(generateCandidates(rowHints[i], numCols));
    }
    
    for (let j = 0; j < numCols; j++) {
        colCandidates.push(generateCandidates(colHints[j], numRows));
    }
    
    // Пошук і заповнення сітки знайденими комбінаціями
    const grid = Array(numRows).fill().map(() => Array(numCols).fill(0));
    
    function isCompatible(row, col) {
        for (let i = 0; i < numRows; i++) {
            if (grid[i][col] === 1 && !rowCandidates[i][row].includes(1)) return false;
        }
        for (let j = 0; j < numCols; j++) {
            if (grid[row][j] === 1 && !colCandidates[j][col].includes(1)) return false;
        }
        return true;
    }
    
    function solve(row, col) {
        if (row === numRows) return true;
        
        const nextRow = (col === numCols - 1) ? row + 1 : row;
        const nextCol = (col + 1) % numCols;
        
        for (let candidate of rowCandidates[row][col]) {
            grid[row][col] = candidate;
            if (isCompatible(row, col) && solve(nextRow, nextCol)) {
                return true;
            }
        }
        
        grid[row][col] = 0;
        return false;
    }
    
    solve(0, 0);
    return grid;
}

// Приклад використання:
const rowHints = [[2], [1, 1], [3], [2]];
const colHints = [[2], [1, 1], [3], [2]];

const solution = solveJapaneseCrossword(rowHints, colHints);
console.log(solution);
