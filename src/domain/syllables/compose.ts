export type SyllablePattern = 'CV' | 'VC';

export type BaseVowel = 'a' | 'e' | 'i' | 'o' | 'u';

export const BASE_VOWELS: readonly BaseVowel[] = ['a', 'e', 'i', 'o', 'u'];

export interface ComposedSyllable {
  text: string;
  valid: boolean;
  /** Explicación breve para el niño o la terapeuta (cambios de sonido, ortografía). */
  hint?: string;
}

const FRONT: ReadonlySet<BaseVowel> = new Set(['e', 'i']);

/** Consonantes que no pueden cerrar una sílaba inversa en español. */
const INVALID_CODA = new Set(['ch', 'll', 'ñ', 'rr', 'q', 'h', 'v', 'w']);

/**
 * Compone una sílaba a partir de una consonante (o dígrafo) y una vocal,
 * aplicando las reglas ortográficas del español.
 */
export function composeSyllable(
  consonant: string,
  vowel: BaseVowel,
  pattern: SyllablePattern = 'CV',
): ComposedSyllable {
  const c = consonant.toLowerCase();

  if (pattern === 'VC') {
    if (INVALID_CODA.has(c)) {
      return {
        text: vowel + c,
        valid: false,
        hint: `En español ninguna sílaba termina en "${c}".`,
      };
    }
    return { text: vowel + c, valid: true };
  }

  if (c === 'q') {
    if (FRONT.has(vowel))
      return { text: `qu${vowel}`, valid: true, hint: 'La u no suena: que, qui.' };
    return { text: `q${vowel}`, valid: false, hint: `Con ${vowel} usamos la c: c${vowel}.` };
  }
  if (c === 'c' && FRONT.has(vowel)) {
    return { text: `c${vowel}`, valid: true, hint: 'Con e, i la c suena suave: ce, ci.' };
  }
  if (c === 'g' && FRONT.has(vowel)) {
    return { text: `g${vowel}`, valid: true, hint: `Suena como j. Para sonar fuerte: gu${vowel}.` };
  }
  if (c === 'z' && FRONT.has(vowel)) {
    return { text: `z${vowel}`, valid: true, hint: `Casi siempre se escribe c${vowel}.` };
  }
  if (c === 'h') {
    return { text: `h${vowel}`, valid: true, hint: 'La h no suena.' };
  }
  return { text: c + vowel, valid: true };
}
