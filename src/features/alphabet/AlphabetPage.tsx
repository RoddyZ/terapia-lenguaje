import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ALPHABET } from '@/content/es';
import type { LetterKind } from '@/content/types';
import { VISEMES } from '@/domain/phonetics';
import { LetterCard } from '@/shared/ui/LetterCard';
import { LetterGlyph } from '@/shared/ui/LetterGlyph';
import { PageHeader } from '@/shared/ui/PageHeader';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import styles from './AlphabetPage.module.css';

type Filter = 'all' | LetterKind;

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'vowel', label: 'Vocales' },
  { value: 'consonant', label: 'Consonantes' },
  { value: 'digraph', label: 'Ch · Ll · Rr' },
] as const;

export function AlphabetPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const navigate = useNavigate();
  const letters = filter === 'all' ? ALPHABET : ALPHABET.filter((l) => l.kind === filter);

  return (
    <div>
      <PageHeader
        title="Abecedario"
        subtitle="Elige una letra para ver cómo se mueve la boca."
        actions={
          <SegmentedControl
            label="Filtrar letras"
            options={FILTERS}
            value={filter}
            onChange={setFilter}
          />
        }
      />
      <ul className={styles.grid}>
        {letters.map((letter) => (
          <li key={letter.id}>
            <LetterCard
              shape={VISEMES[letter.viseme]}
              tone={letter.tone}
              label={`Letra ${letter.name}`}
              glyph={<LetterGlyph letter={letter} />}
              onClick={() => void navigate(`/abecedario/${letter.id}`)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
