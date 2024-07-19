import { DifficultySet } from "../types/types";

export function generateSudokuBoard(diff: DifficultySet["data"]): string[][] {
  const startTime = performance.now();

  const board: string[][] = Array.from({ length: 9 }, () => Array(9).fill(""));
  fillDiagonalSubgrids(board);
  solveSudoku(board, 0, 0);
  createPuzzle(board, diff);

  const endTime = performance.now();
  const elapsed = endTime - startTime;

  console.log(`generated in ${elapsed / 1000} seconds.`);
  return board;
}

function createPuzzle(board: string[][], diff: DifficultySet["data"]) {
  const map = new Map<typeof diff, number>([
    ["easy", 65],
    ["medium", 70],
    ["hard", 75],
  ]);
  const emptyCellsN = map.get(diff) ?? 65;

  for (let i = 0; i < emptyCellsN; i++) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    board[r][c] = "";
  }
}

function canInsertNumber(
  board: string[][],
  row: number,
  col: number,
  num: string,
): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) {
      return false;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) {
      return false;
    }
  }

  const gridRow = Math.floor(row / 3) * 3;
  const gridCol = Math.floor(col / 3) * 3;

  for (let i = gridRow; i < gridRow + 3; i++) {
    for (let k = gridCol; k < gridCol + 3; k++) {
      if (board[i][k] === num) {
        return false;
      }
    }
  }

  return true;
}

function solveSudoku(board: string[][], row: number, col: number): boolean {
  if (row === 9) {
    return true;
  }
  if (col === 9) {
    return solveSudoku(board, row + 1, 0);
  }
  if (board[row][col] !== "") {
    return solveSudoku(board, row, col + 1);
  }

  for (let i = 1; i <= 9; i++) {
    const stringInt = String(i);
    if (canInsertNumber(board, row, col, stringInt)) {
      board[row][col] = stringInt;
      if (solveSudoku(board, row, col + 1)) {
        return true;
      }
      board[row][col] = "";
    }
  }

  return false;
}

function fillDiagonalSubgrids(board: string[][]) {
  for (let i = 0; i < board.length; i += 3) {
    fillSubgrid(board, i);
  }
}

function fillSubgrid(board: string[][], gridStart: number) {
  const array = Array.from({ length: 9 }, (_, y) => String(y + 1));
  const shuffled = shuffle(array);
  let index = 0;

  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      board[gridStart + i][gridStart + k] = String(shuffled[index]);
      index++;
    }
  }
}

function shuffle(arr: string[]): string[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const c = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[c]] = [arr[c], arr[i]];
  }
  return arr;
}

// export function generateSudokuBoard(
//   difficulty: DifficultySet["data"],
// ): string[][] {
//   const sudokuGrid: string[][] = Array.from({ length: 9 }, () =>
//     Array(9).fill(""),
//   );
//   fillDiagonalSubgrids(sudokuGrid);
//   solveSudoku(sudokuGrid);
//   createPuzzle(sudokuGrid, difficulty);
//   console.log(sudokuGrid);
//   return sudokuGrid;
// }

// function fillDiagonalSubgrids(grid: string[][]) {
//   for (let i = 0; i < 9; i += 3) {
//     fillSubgrid(grid, i, i);
//   }
// }

// function fillSubgrid(grid: string[][], row: number, col: number) {
//   const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).map(String);
//   let index = 0;
//   for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) {
//       grid[row + i][col + j] = numbers[index];
//       index++;
//     }
//   }
// }

// function shuffle(array: number[]): number[] {
//   /* Fisher-Yates shuffle */
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// function solveSudoku(grid: string[][]) {
//   function findEmptyCell(): [number, number] | null {
//     for (let i = 0; i < 9; i++) {
//       for (let j = 0; j < 9; j++) {
//         if (grid[i][j] === "") {
//           return [i, j];
//         }
//       }
//     }
//     return null;
//   }

//   function canPlaceNumber(row: number, col: number, num: string): boolean {
//     return (
//       !grid[row].includes(num) &&
//       !grid.map((r) => r[col]).includes(num) &&
//       !checkSubgrid(row - (row % 3), col - (col % 3), num)
//     );
//   }

//   function checkSubgrid(
//     subgridRow: number,
//     subgridCol: number,
//     num: string,
//   ): boolean {
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         if (grid[subgridRow + i][subgridCol + j] === num) {
//           return true;
//         }
//       }
//     }
//     return false;
//   }

//   function solve(): boolean {
//     const emptyCell = findEmptyCell();
//     if (!emptyCell) {
//       return true;
//     }
//     const [row, col] = emptyCell;

//     for (let num = 1; num <= 9; num++) {
//       const numString = num.toString();
//       if (canPlaceNumber(row, col, numString)) {
//         grid[row][col] = numString;
//         if (solve()) {
//           return true;
//         }
//         grid[row][col] = "";
//       }
//     }

//     return false;
//   }

//   solve();
// }

// function createPuzzle(grid: string[][], difficulty: DifficultySet["data"]) {
//   function removeNumbers(difficultyLevel: DifficultySet["data"]) {
//     const data = {
//       easy: 50,
//       medium: 60,
//       hard: 70,
//     };

//     const removalCount = data[difficultyLevel];

//     for (let i = 0; i < removalCount; i++) {
//       const row = Math.floor(Math.random() * 9);
//       const col = Math.floor(Math.random() * 9);
//       grid[row][col] = "";
//     }
//   }

//   removeNumbers(difficulty);
// }
