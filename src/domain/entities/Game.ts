export type Level = 'easy' | 'medium' | 'hard' | 'custom';

export type LevelConfig = {
  rows: number;
  cols: number;
  mines: number;
};

export type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number;
};

export type GameResult = 'idle' | 'win' | 'loss';

export const LEVELS: Record<Exclude<Level, 'custom'>, LevelConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 10, cols: 10, mines: 20 },
  hard: { rows: 10, cols: 10, mines: 30 },
};

export const LEVEL_LABELS: Record<Exclude<Level, 'custom'>, string> = {
  easy: 'Facil',
  medium: 'Medio',
  hard: 'Dificil',
};
