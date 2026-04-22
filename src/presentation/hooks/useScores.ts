import { useCallback, useState } from 'react';
import type { Score } from '../../domain/entities/Score';
import { clearScoresUseCase, getScoresUseCase } from '../../application/usecases/Reexport';

export function useScores() {
  const [scores, setScores] = useState<Score[]>([]);

  const loadScores = useCallback(async () => {
    const values = await getScoresUseCase.execute();
    setScores(values);
  }, []);

  const clearScores = useCallback(async () => {
    await clearScoresUseCase.execute();
    setScores([]);
  }, []);

  return {
    scores,
    loadScores,
    clearScores,
  };
}
