import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { CONSONANTS, VOWELS } from '@/content/es';
import {
  BASE_VOWELS,
  composeSyllable,
  type BaseVowel,
  type SyllablePattern,
} from '@/domain/syllables';
import { useProgress } from '@/shared/di/hooks';
import { Mouth } from '@/shared/mouth/Mouth';
import { useTalkingMouth } from '@/shared/mouth/useTalkingMouth';
import { Button } from '@/shared/ui/Button';
import { PageHeader } from '@/shared/ui/PageHeader';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import { toneStyle } from '@/shared/ui/tone';
import styles from './SyllablesPage.module.css';

const PATTERNS = [
  { value: 'CV', label: 'ma · pe · si' },
  { value: 'VC', label: 'am · el · is' },
] as const;

const ONSETS = CONSONANTS.filter((c) => c.syllableOnset);

export function SyllablesPage() {
  const [consonantId, setConsonantId] = useState('m');
  const [vowel, setVowel] = useState<BaseVowel>('a');
  const [pattern, setPattern] = useState<SyllablePattern>('CV');
  const { shape, say, playing } = useTalkingMouth();
  const [, progress] = useProgress();

  const consonant = ONSETS.find((c) => c.id === consonantId) ?? ONSETS[0]!;
  const syllable = composeSyllable(consonant.lower, vowel, pattern);

  const speak = (text: string, valid: boolean) => {
    if (!valid) return;
    void say(text);
    progress.record('syllables', text, true);
  };

  const family = BASE_VOWELS.map((v) => composeSyllable(consonant.lower, v, pattern));

  return (
    <div>
      <PageHeader
        title="Sílabas"
        subtitle="Elige una consonante y una vocal para formar la sílaba."
        actions={
          <SegmentedControl
            label="Tipo de sílaba"
            options={PATTERNS}
            value={pattern}
            onChange={setPattern}
          />
        }
      />

      <div className={styles.layout}>
        <section className={styles.builder} aria-label="Constructor de sílabas">
          <fieldset className={styles.picker}>
            <legend>Consonante</legend>
            <div className={styles.chips}>
              {ONSETS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={styles.chip}
                  style={toneStyle(c.tone)}
                  aria-pressed={c.id === consonant.id}
                  onClick={() => setConsonantId(c.id)}
                >
                  {c.lower}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.picker}>
            <legend>Vocal</legend>
            <div className={styles.chips}>
              {VOWELS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={[styles.chip, styles.vowelChip].join(' ')}
                  style={toneStyle(v.tone)}
                  aria-pressed={v.lower === vowel}
                  onClick={() => setVowel(v.lower as BaseVowel)}
                >
                  {v.lower}
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        <section className={styles.stage} aria-live="polite">
          <div className={styles.mouth} data-playing={playing}>
            <Mouth shape={shape} label={`Boca diciendo ${syllable.text}`} />
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={syllable.text}
              className={styles.syllable}
              data-valid={syllable.valid}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            >
              {pattern === 'CV' ? (
                <>
                  <span className={styles.consonantPart}>{syllable.text.slice(0, -1)}</span>
                  <span className={styles.vowelPart}>{syllable.text.slice(-1)}</span>
                </>
              ) : (
                <>
                  <span className={styles.vowelPart}>{syllable.text.slice(0, 1)}</span>
                  <span className={styles.consonantPart}>{syllable.text.slice(1)}</span>
                </>
              )}
            </motion.p>
          </AnimatePresence>

          {syllable.hint && <p className={styles.hint}>{syllable.hint}</p>}

          <Button
            size="lg"
            icon="🔊"
            disabled={!syllable.valid}
            onClick={() => speak(syllable.text, syllable.valid)}
          >
            Escuchar
          </Button>
        </section>
      </div>

      <section className={styles.familySection}>
        <h2>Familia de la {consonant.lower}</h2>
        <ul className={styles.family}>
          {family.map((s) => (
            <li key={s.text}>
              <button
                type="button"
                className={styles.familyItem}
                disabled={!s.valid}
                onClick={() => speak(s.text, s.valid)}
              >
                {s.text}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
