import { motion } from 'motion/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createQuiz, type QuizRound } from '@/domain/games';
import { Button } from './Button';
import { Celebration } from './Celebration';
import styles from './ChoiceQuiz.module.css';

export interface ChoiceQuizProps<T> {
  pool: readonly T[];
  rounds?: number;
  options?: number;
  getKey: (item: T) => string;
  /** Estímulo de la ronda (boca animada, letra grande…). */
  renderPrompt: (answer: T, round: number) => ReactNode;
  renderOption: (item: T) => ReactNode;
  optionLabel: (item: T) => string;
  instruction: string;
  onAnswer?: (item: T, correct: boolean) => void;
  onRoundStart?: (answer: T) => void;
}

type Feedback = { key: string; correct: boolean } | null;

/**
 * Motor genérico de "elige la respuesta correcta". Lo reutilizan vocales,
 * abecedario o cualquier actividad futura de discriminación.
 */
export function ChoiceQuiz<T>({
  pool,
  rounds = 5,
  options = 3,
  getKey,
  renderPrompt,
  renderOption,
  optionLabel,
  instruction,
  onAnswer,
  onRoundStart,
}: ChoiceQuizProps<T>) {
  const [seed, setSeed] = useState(0);
  const quiz: QuizRound<T>[] = useMemo(
    () => createQuiz(pool, rounds, options),
    // `seed` fuerza una partida nueva.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, rounds, options, seed],
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const round = quiz[index];

  useEffect(() => {
    if (round) onRoundStart?.(round.answer);
    // Solo al cambiar de ronda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, seed]);

  const restart = () => {
    setSeed((s) => s + 1);
    setIndex(0);
    setScore(0);
    setFeedback(null);
  };

  if (!round) {
    return (
      <div className={styles.summary}>
        <p className={styles.bigEmoji} aria-hidden="true">
          {score === rounds ? '🏆' : score >= rounds / 2 ? '🌟' : '💪'}
        </p>
        <h2>
          {score} de {rounds} correctas
        </h2>
        <Button size="lg" onClick={restart}>
          Jugar otra vez
        </Button>
      </div>
    );
  }

  const choose = (item: T) => {
    if (feedback?.correct) return;
    const correct = getKey(item) === getKey(round.answer);
    setFeedback({ key: getKey(item), correct });
    onAnswer?.(round.answer, correct);
    if (correct) {
      if (!feedback) setScore((s) => s + 1); // solo cuenta al primer intento
      window.setTimeout(() => {
        setFeedback(null);
        setIndex((i) => i + 1);
      }, 1400);
    }
  };

  return (
    <div className={styles.quiz}>
      <div className={styles.progress} aria-label={`Ronda ${index + 1} de ${rounds}`}>
        {quiz.map((_, i) => (
          <span
            key={i}
            className={styles.dot}
            data-state={i < index ? 'done' : i === index ? 'current' : 'todo'}
          />
        ))}
      </div>

      <p className={styles.instruction}>{instruction}</p>
      <div className={styles.prompt}>{renderPrompt(round.answer, index)}</div>

      <div className={styles.options}>
        {round.options.map((item) => {
          const key = getKey(item);
          const state =
            feedback?.key === key ? (feedback.correct ? 'correct' : 'wrong') : undefined;
          return (
            <motion.button
              key={`${index}-${key}`}
              type="button"
              className={styles.option}
              data-state={state}
              aria-label={optionLabel(item)}
              onClick={() => choose(item)}
              animate={state === 'wrong' ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {renderOption(item)}
            </motion.button>
          );
        })}
      </div>

      <Celebration show={Boolean(feedback?.correct)} />
    </div>
  );
}
