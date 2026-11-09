import type { LetterEntry } from '@/content/types';
import { useTalkingMouth } from '@/shared/mouth/useTalkingMouth';
import { LetterCard } from '@/shared/ui/LetterCard';
import { LetterGlyph } from '@/shared/ui/LetterGlyph';

/** Tarjeta de vocal con su propia boquita: al tocarla, la boca se abre y suena. */
export function VowelCard({ vowel }: { vowel: LetterEntry }) {
  const { shape, playing, say } = useTalkingMouth(vowel.viseme);

  const handleClick = () => {
    // Parte de reposo para que se vea el movimiento y mantiene la pose final.
    void say(vowel.lower, { visemes: ['rest', vowel.viseme], endAtRest: false });
  };

  return (
    <LetterCard
      shape={shape}
      tone={vowel.tone}
      active={playing}
      label={`Vocal ${vowel.lower}. ${vowel.tip}`}
      glyph={<LetterGlyph letter={vowel} />}
      onClick={handleClick}
      size="lg"
    />
  );
}
