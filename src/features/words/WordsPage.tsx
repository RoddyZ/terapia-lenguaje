import { useMemo, useState } from 'react';
import { WORDS, wordsByLevel } from '@/content/es';
import type { WordLevel } from '@/content/types';
import { shuffle } from '@/domain/games';
import { PageHeader } from '@/shared/ui/PageHeader';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import { WordPuzzle } from './WordPuzzle';
import styles from './WordsPage.module.css';

const LEVELS = [
  { value: '1', label: 'Nivel 1' },
  { value: '2', label: 'Nivel 2' },
  { value: '3', label: 'Nivel 3' },
] as const;

/** Distractores por nivel: más sílabas sobrantes = más difícil. */
const DISTRACTORS: Record<WordLevel, number> = { 1: 0, 2: 1, 3: 2 };

const ALL_SYLLABLES = [...new Set(WORDS.flatMap((w) => w.syllables))];

export function WordsPage() {
  const [level, setLevel] = useState<WordLevel>(1);
  const [round, setRound] = useState(0);
  const deck = useMemo(() => shuffle(wordsByLevel(level)), [level]);
  const word = deck[round % deck.length]!;

  return (
    <div>
      <PageHeader
        title="Palabras"
        subtitle="Toca las sílabas en orden para formar la palabra."
        actions={
          <SegmentedControl
            label="Nivel"
            options={LEVELS}
            value={String(level) as '1' | '2' | '3'}
            onChange={(v) => {
              setLevel(Number(v) as WordLevel);
              setRound(0);
            }}
          />
        }
      />
      <div className={styles.container}>
        <WordPuzzle
          key={`${level}-${round}`}
          word={word}
          distractorPool={ALL_SYLLABLES}
          distractors={DISTRACTORS[level]}
          onNext={() => setRound((r) => r + 1)}
        />
      </div>
    </div>
  );
}
