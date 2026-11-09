import { shuffle, type Rng, defaultRng } from './random';

export interface QuizRound<T> {
  answer: T;
  options: T[];
}

/**
 * Genera rondas de "elige la correcta": cada ronda tiene una respuesta y
 * `optionCount` opciones barajadas, sin repetir la misma respuesta dos veces seguidas.
 */
export function createQuiz<T>(
  pool: readonly T[],
  rounds: number,
  optionCount: number,
  rng: Rng = defaultRng,
): QuizRound<T>[] {
  if (pool.length < 2) throw new Error('El quiz necesita al menos 2 elementos.');
  const count = Math.min(optionCount, pool.length);
  const result: QuizRound<T>[] = [];
  let previous: T | undefined;

  for (let r = 0; r < rounds; r++) {
    const candidates = pool.filter((p) => p !== previous);
    const answer = shuffle(candidates, rng)[0]!;
    const distractors = shuffle(
      pool.filter((p) => p !== answer),
      rng,
    ).slice(0, count - 1);
    result.push({ answer, options: shuffle([answer, ...distractors], rng) });
    previous = answer;
  }
  return result;
}
