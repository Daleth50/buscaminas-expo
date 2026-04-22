import type { LevelConfig } from '../../domain/entities/Game';

export class ValidateCustomConfigUseCase {
  execute(rowsText: string, colsText: string, minesText: string): LevelConfig {
    const r = Number.parseInt(rowsText, 10) || 10;
    const c = Number.parseInt(colsText, 10) || 10;
    const m = Number.parseInt(minesText, 10) || 15;

    const safeRows = Math.min(Math.max(r, 2), 10);
    const safeCols = Math.min(Math.max(c, 2), 10);
    const safeMines = Math.min(Math.max(m, 1), safeRows * safeCols - 1);

    return {
      rows: safeRows,
      cols: safeCols,
      mines: safeMines,
    };
  }
}
