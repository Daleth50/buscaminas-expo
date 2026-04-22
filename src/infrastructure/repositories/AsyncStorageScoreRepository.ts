import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Score } from '../../domain/entities/Score';
import type { ScoreRepository } from '../../domain/repositories/ScoreRepository';
import { SCORES_KEY } from '../../shared/constants';

export class AsyncStorageScoreRepository implements ScoreRepository {
  async getScores(): Promise<Score[]> {
    try {
      const raw = await AsyncStorage.getItem(SCORES_KEY);
      return raw ? (JSON.parse(raw) as Score[]) : [];
    } catch {
      return [];
    }
  }

  async saveScores(scores: Score[]): Promise<void> {
    await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  }

  async clearScores(): Promise<void> {
    await AsyncStorage.removeItem(SCORES_KEY);
  }
}
