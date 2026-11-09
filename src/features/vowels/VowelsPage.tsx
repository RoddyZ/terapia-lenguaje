import { useState } from 'react';
import { VOWELS } from '@/content/es';
import { PageHeader } from '@/shared/ui/PageHeader';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import { VowelCard } from './VowelCard';
import { VowelQuiz, type VowelQuizMode } from './VowelQuiz';
import styles from './VowelsPage.module.css';

type Tab = 'explore' | VowelQuizMode;

const TABS = [
  { value: 'explore', label: 'Aprender' },
  { value: 'mouth-to-letter', label: 'Mira la boca' },
  { value: 'letter-to-mouth', label: 'Busca la boca' },
] as const;

export function VowelsPage() {
  const [tab, setTab] = useState<Tab>('explore');

  return (
    <div>
      <PageHeader
        title="Vocales"
        subtitle={
          tab === 'explore' ? 'Toca cada boquita y repite el sonido.' : 'Juega y gana estrellas.'
        }
        actions={<SegmentedControl label="Modo" options={TABS} value={tab} onChange={setTab} />}
      />

      {tab === 'explore' ? (
        <ul className={styles.grid}>
          {VOWELS.map((v) => (
            <li key={v.id}>
              <VowelCard vowel={v} />
              <p className={styles.tip}>{v.tip}</p>
            </li>
          ))}
        </ul>
      ) : (
        <VowelQuiz mode={tab} />
      )}
    </div>
  );
}
