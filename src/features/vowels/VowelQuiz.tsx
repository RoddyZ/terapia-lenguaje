import { VOWELS } from '@/content/es';
import type { LetterEntry } from '@/content/types';
import { VISEMES } from '@/domain/phonetics';
import { useProgress } from '@/shared/di/hooks';
import { Mouth } from '@/shared/mouth/Mouth';
import { useTalkingMouth } from '@/shared/mouth/useTalkingMouth';
import { Button } from '@/shared/ui/Button';
import { ChoiceQuiz } from '@/shared/ui/ChoiceQuiz';
import styles from './VowelsPage.module.css';

export type VowelQuizMode = 'mouth-to-letter' | 'letter-to-mouth';

export function VowelQuiz({ mode }: { mode: VowelQuizMode }) {
  const { shape, say } = useTalkingMouth('rest');
  const [, progress] = useProgress();

  const present = (v: LetterEntry) =>
    say(v.lower, { visemes: ['rest', v.viseme], endAtRest: false });

  const common = {
    pool: VOWELS,
    getKey: (v: LetterEntry) => v.id,
    onRoundStart: (v: LetterEntry) => void present(v),
    onAnswer: (v: LetterEntry, ok: boolean) => progress.record('vowels', v.id, ok),
  };

  if (mode === 'mouth-to-letter') {
    return (
      <ChoiceQuiz
        key={mode}
        {...common}
        instruction="¿Qué vocal dice la boquita?"
        renderPrompt={(answer) => (
          <div className={styles.prompt}>
            <Mouth shape={shape} label="Boquita diciendo una vocal" />
            <Button variant="secondary" icon="🔊" onClick={() => void present(answer)}>
              Otra vez
            </Button>
          </div>
        )}
        renderOption={(v) => v.lower}
        optionLabel={(v) => `Vocal ${v.lower}`}
      />
    );
  }

  return (
    <ChoiceQuiz
      key={mode}
      {...common}
      instruction="¿Qué boquita dice esta vocal?"
      renderPrompt={(answer) => (
        <div className={styles.prompt}>
          <button type="button" className={styles.bigLetter} onClick={() => void present(answer)}>
            {answer.lower}
          </button>
        </div>
      )}
      renderOption={(v) => <Mouth shape={VISEMES[v.viseme]} label="" />}
      optionLabel={(v) => `Boca de la vocal ${v.lower}`}
    />
  );
}
