import type { Cell } from '../entities/Game';

export const createEmptyGrid = (rows: number, cols: number): Cell[][] => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      count: 0,
    })),
  );
};

export const cloneGrid = (grid: Cell[][]): Cell[][] => {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
};

export const getNeighbors = (r: number, c: number, rows: number, cols: number): Array<[number, number]> => {
  const neighbors: Array<[number, number]> = [];

  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) {
        continue;
      }

      const nr = r + dr;
      const nc = c + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push([nr, nc]);
      }
    }
  }

  return neighbors;
};

export const placeMinesAndCounts = (
  baseGrid: Cell[][],
  rows: number,
  cols: number,
  minesCount: number,
  excludeR: number,
  excludeC: number,
): Cell[][] => {
  const grid = cloneGrid(baseGrid);
  let placed = 0;

  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if (Math.abs(r - excludeR) <= 1 && Math.abs(c - excludeC) <= 1) {
      continue;
    }

    if (grid[r][c].mine) {
      continue;
    }

    grid[r][c].mine = true;
    placed += 1;
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c].mine) {
        grid[r][c].count = -1;
        continue;
      }

      grid[r][c].count = getNeighbors(r, c, rows, cols).filter(([nr, nc]) => grid[nr][nc].mine).length;
    }
  }

  return grid;
};

export const revealArea = (
  baseGrid: Cell[][],
  startR: number,
  startC: number,
  rows: number,
  cols: number,
): Cell[][] => {
  const grid = cloneGrid(baseGrid);
  const stack: Array<[number, number]> = [[startR, startC]];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) {
      continue;
    }

    const [r, c] = current;
    const cell = grid[r][c];

    if (cell.revealed || cell.flagged || cell.mine) {
      continue;
    }

    cell.revealed = true;

    if (cell.count === 0) {
      getNeighbors(r, c, rows, cols).forEach(([nr, nc]) => {
        if (!grid[nr][nc].revealed) {
          stack.push([nr, nc]);
        }
      });
    }
  }

  return grid;
};

export const revealAllMines = (baseGrid: Cell[][]): Cell[][] => {
  const grid = cloneGrid(baseGrid);

  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid[r].length; c += 1) {
      if (grid[r][c].mine && !grid[r][c].flagged) {
        grid[r][c].revealed = true;
      }
    }
  }

  return grid;
};

export const countSafeUnrevealed = (grid: Cell[][]): number => {
  let total = 0;

  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid[r].length; c += 1) {
      if (!grid[r][c].revealed && !grid[r][c].mine) {
        total += 1;
      }
    }
  }

  return total;
};
