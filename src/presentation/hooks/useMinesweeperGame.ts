import { useCallback, useMemo, useRef, useState } from 'react';
import type { Cell, GameResult, Level } from '../../domain/entities/Game';
import { LEVELS } from '../../domain/entities/Game';
import {
  cloneGrid,
  countSafeUnrevealed,
  createEmptyGrid,
  placeMinesAndCounts,
  revealAllMines,
  revealArea,
} from '../../domain/services/gameEngine';
import { ValidateCustomConfigUseCase } from '../../application/usecases/ValidateCustomConfigUseCase';
import { BuildScoreUseCase } from '../../application/usecases/BuildScoreUseCase';
import { getScoresUseCase, saveScoresUseCase } from '../../application/usecases/Reexport';

const validateCustomConfigUseCase = new ValidateCustomConfigUseCase();
const buildScoreUseCase = new BuildScoreUseCase();

type UseMinesweeperGameOptions = {
  initialLevel?: Level;
  initialRows?: number;
  initialCols?: number;
  initialMines?: number;
};

export function useMinesweeperGame(options?: UseMinesweeperGameOptions) {
  const initialLevel = options?.initialLevel ?? 'easy';
  const initialRows = options?.initialRows ?? LEVELS.easy.rows;
  const initialCols = options?.initialCols ?? LEVELS.easy.cols;
  const initialMines = options?.initialMines ?? LEVELS.easy.mines;

  const [selectedLevel, setSelectedLevel] = useState<Level>(initialLevel);
  const [rows, setRows] = useState<number>(initialRows);
  const [cols, setCols] = useState<number>(initialCols);
  const [minesCount, setMinesCount] = useState<number>(initialMines);

  const [customRows, setCustomRows] = useState<string>('10');
  const [customCols, setCustomCols] = useState<string>('10');
  const [customMines, setCustomMines] = useState<string>('15');

  const [grid, setGrid] = useState<Cell[][]>(() => createEmptyGrid(initialRows, initialCols));
  const [result, setResult] = useState<GameResult>('idle');
  const [firstClick, setFirstClick] = useState<boolean>(true);
  const [seconds, setSeconds] = useState<number>(0);
  const [flagsPlaced, setFlagsPlaced] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const minesLeft = useMemo(() => minesCount - flagsPlaced, [minesCount, flagsPlaced]);
  const gameOver = result !== 'idle';

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      return;
    }

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  const resetGame = useCallback(
    (nextRows: number, nextCols: number, nextMines: number) => {
      stopTimer();
      setRows(nextRows);
      setCols(nextCols);
      setMinesCount(nextMines);
      setGrid(createEmptyGrid(nextRows, nextCols));
      setResult('idle');
      setFirstClick(true);
      setSeconds(0);
      setFlagsPlaced(0);
    },
    [stopTimer],
  );

  const persistNewScore = useCallback(async () => {
    const currentScores = await getScoresUseCase.execute();
    const nextScores = buildScoreUseCase.execute({
      currentScores,
      level: selectedLevel,
      rows,
      cols,
      mines: minesCount,
      time: seconds,
    });

    await saveScoresUseCase.execute(nextScores);
  }, [selectedLevel, rows, cols, minesCount, seconds]);

  const finishGame = useCallback(
    async (nextResult: Exclude<GameResult, 'idle'>, currentGrid: Cell[][]) => {
      stopTimer();

      if (nextResult === 'loss') {
        setGrid(revealAllMines(currentGrid));
      } else {
        setGrid(currentGrid);
        await persistNewScore();
      }

      setResult(nextResult);
    },
    [persistNewScore, stopTimer],
  );

  const onPressCell = useCallback(
    async (r: number, c: number) => {
      if (gameOver) {
        return;
      }

      const cell = grid[r][c];
      if (cell.revealed || cell.flagged) {
        return;
      }

      let workingGrid = grid;
      let started = !firstClick;

      if (firstClick) {
        workingGrid = placeMinesAndCounts(grid, rows, cols, minesCount, r, c);
        setFirstClick(false);
        started = true;
        startTimer();
      }

      if (workingGrid[r][c].mine) {
        const exploded = cloneGrid(workingGrid);
        exploded[r][c].revealed = true;
        await finishGame('loss', exploded);
        return;
      }

      const revealed = revealArea(workingGrid, r, c, rows, cols);
      setGrid(revealed);

      if (started && countSafeUnrevealed(revealed) === 0) {
        await finishGame('win', revealed);
      }
    },
    [finishGame, firstClick, gameOver, grid, minesCount, rows, cols, startTimer],
  );

  const onLongPressCell = useCallback(
    (r: number, c: number) => {
      if (gameOver) {
        return;
      }

      if (grid[r][c].revealed) {
        return;
      }

      const nextGrid = cloneGrid(grid);
      nextGrid[r][c].flagged = !nextGrid[r][c].flagged;

      setFlagsPlaced((prev) => prev + (nextGrid[r][c].flagged ? 1 : -1));
      setGrid(nextGrid);
    },
    [gameOver, grid],
  );

  const applyPreset = useCallback(
    (level: Exclude<Level, 'custom'>) => {
      const cfg = LEVELS[level];
      setSelectedLevel(level);
      resetGame(cfg.rows, cfg.cols, cfg.mines);
    },
    [resetGame],
  );

  const applyCustom = useCallback(() => {
    const cfg = validateCustomConfigUseCase.execute(customRows, customCols, customMines);
    setSelectedLevel('custom');
    resetGame(cfg.rows, cfg.cols, cfg.mines);
  }, [customRows, customCols, customMines, resetGame]);

  const dispose = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  return {
    selectedLevel,
    setSelectedLevel,
    rows,
    cols,
    minesCount,
    customRows,
    setCustomRows,
    customCols,
    setCustomCols,
    customMines,
    setCustomMines,
    grid,
    result,
    gameOver,
    seconds,
    minesLeft,
    applyPreset,
    applyCustom,
    onPressCell,
    onLongPressCell,
    resetGame,
    dispose,
  };
}
