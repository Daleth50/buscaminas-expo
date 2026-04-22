import { MAX_SCORES } from '../../shared/constants';
import { LEVEL_LABELS } from '../../domain/entities/Game';
import type { Level } from '../../domain/entities/Game';
import type { Score } from '../../domain/entities/Score';

export class BuildScoreUseCase {
  execute(params: {
    currentScores: Score[];
    level: Level;
    rows: number;
    cols: number;
    mines: number;
    time: number;
  }): Score[] {
    const { currentScores, level, rows, cols, mines, time } = params;
    const label = level === 'custom' ? `${rows}x${cols} (${mines} minas)` : LEVEL_LABELS[level];
    const date = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

    return [...currentScores, { time, label, date }]
      .sort((a, b) => a.time - b.time)
      .slice(0, MAX_SCORES);
  }
}
