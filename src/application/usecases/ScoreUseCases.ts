import type { Score } from '../../domain/entities/Score';
import type { ScoreRepository } from '../../domain/repositories/ScoreRepository';

export class GetScoresUseCase {
  constructor(private readonly repository: ScoreRepository) {}

  execute(): Promise<Score[]> {
    return this.repository.getScores();
  }
}

export class SaveScoresUseCase {
  constructor(private readonly repository: ScoreRepository) {}

  execute(scores: Score[]): Promise<void> {
    return this.repository.saveScores(scores);
  }
}

export class ClearScoresUseCase {
  constructor(private readonly repository: ScoreRepository) {}

  execute(): Promise<void> {
    return this.repository.clearScores();
  }
}
