import type { LetterEntry } from '@/content/types';
import { useSettings } from '../di/hooks';

/** Muestra la letra respetando el ajuste mayúsculas/minúsculas de la terapeuta. */
export function LetterGlyph({ letter }: { letter: LetterEntry }) {
  const [{ letterCase }] = useSettings();
  if (letterCase === 'upper') return <>{letter.upper}</>;
  if (letterCase === 'lower') return <>{letter.lower}</>;
  // En dígrafos se separa para que no se lea "Chch".
  const separator = letter.kind === 'digraph' ? ' ' : '';
  return (
    <>
      {letter.upper}
      {separator}
      {letter.lower}
    </>
  );
}
