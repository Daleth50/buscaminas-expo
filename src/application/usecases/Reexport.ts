import { AsyncStorageScoreRepository } from '../../infrastructure/repositories/AsyncStorageScoreRepository';
import { ClearScoresUseCase, GetScoresUseCase, SaveScoresUseCase } from './ScoreUseCases';

const repository = new AsyncStorageScoreRepository();

export const getScoresUseCase = new GetScoresUseCase(repository);
export const saveScoresUseCase = new SaveScoresUseCase(repository);
export const clearScoresUseCase = new ClearScoresUseCase(repository);
