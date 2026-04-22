import type { Score } from '../entities/Score';

export interface ScoreRepository {
  getScores(): Promise<Score[]>;
  saveScores(scores: Score[]): Promise<void>;
  clearScores(): Promise<void>;
}
