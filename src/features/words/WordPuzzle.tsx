import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useReducer } from 'react';
import type { WordEntry } from '@/content/types';
import { createWordPuzzle, placedText, shuffle, wordPuzzleReducer } from '@/domain/games';
import { useProgress } from '@/shared/di/hooks';
import { Mouth } from '@/shared/mouth/Mouth';
import { useTalkingMouth } from '@/shared/mouth/useTalkingMouth';
import { Button } from '@/shared/ui/Button';
import { Celebration } from '@/shared/ui/Celebration';
import styles from './WordsPage.module.css';

export interface WordPuzzleProps {
  word: WordEntry;
  /** Sílabas de otras palabras para usar como distractores. */
  distractorPool: readonly string[];
  distractors: number;
  onNext: () => void;
}

export function WordPuzzle({ word, distractorPool, distractors, onNext }: WordPuzzleProps) {
  const initial = useMemo(() => {
    const extra = shuffle(distractorPool.filter((s) => !word.syllables.includes(s))).slice(
      0,
      distractors,
    );
    return createWordPuzzle(word.syllables, extra);
  }, [word, distractorPool, distractors]);

  const [state, dispatch] = useReducer(wordPuzzleReducer, initial);
  const { shape, say } = useTalkingMouth();
  const [, progress] = useProgress();

  // Al resolver: la boquita dice la palabra completa.
  useEffect(() => {
    if (state.status === 'solved') {
      void say(word.text);
      progress.record('words', word.id, state.mistakes === 0);
    }
    if (state.status === 'wrong') {
      const t = window.setTimeout(() => dispatch({ type: 'retry' }), 900);
      return () => window.clearTimeout(t);
    }
  }, [state.status, state.mistakes, say, word, progress]);

  const place = (id: string, text: string) => {
    void say(text);
    dispatch({ type: 'place', tileId: id });
  };

  const used = new Set(state.slots.filter(Boolean));

  return (
    <div className={styles.puzzle}>
      <div className={styles.top}>
        <button
          type="button"
          className={styles.picture}
          onClick={() => void say(word.text)}
          aria-label={`Escuchar la palabra ${word.text}`}
        >
          <span aria-hidden="true">{word.emoji}</span>
        </button>
        <div className={styles.mouth}>
          <Mouth shape={shape} label="Boquita" />
        </div>
      </div>

      <motion.ol
        className={styles.slots}
        data-status={state.status}
        animate={state.status === 'wrong' ? { x: [0, -12, 12, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        aria-label="Huecos de la palabra"
      >
        {state.slots.map((id, i) => {
          const tile = state.tiles.find((t) => t.id === id);
          return (
            <li key={i}>
              <button
                type="button"
                className={styles.slot}
                data-filled={Boolean(tile)}
                onClick={() => tile && dispatch({ type: 'remove', slot: i })}
                aria-label={tile ? `Quitar ${tile.text}` : `Hueco ${i + 1} vacío`}
              >
                <AnimatePresence mode="popLayout">
                  {tile && (
                    <motion.span
                      key={tile.id}
                      initial={{ scale: 0.4, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    >
                      {tile.text}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </motion.ol>

      {state.status === 'solved' ? (
        <div className={styles.solved}>
          <p className={styles.solvedWord}>{placedText(state)}</p>
          <Button size="lg" onClick={onNext}>
            Siguiente palabra →
          </Button>
        </div>
      ) : (
        <ul className={styles.tiles} aria-label="Sílabas disponibles">
          {state.tiles.map((tile) => (
            <li key={tile.id}>
              <button
                type="button"
                className={styles.tile}
                disabled={used.has(tile.id)}
                onClick={() => place(tile.id, tile.text)}
              >
                {tile.text}
              </button>
            </li>
          ))}
        </ul>
      )}

      <Celebration show={state.status === 'solved'} message={`¡${word.text}!`} />
    </div>
  );
}
