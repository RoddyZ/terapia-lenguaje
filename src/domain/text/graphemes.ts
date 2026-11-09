import type { VisemeId } from '../phonetics/visemes';

/**
 * Pronunciación de z / c(e,i):
 *  - `distincion`: interdental (lengua entre los dientes), como en las láminas de referencia.
 *  - `seseo`: igual que la s (mayoría de Latinoamérica).
 */
export type ZPronunciation = 'distincion' | 'seseo';

export interface PhoneticOptions {
  z: ZPronunciation;
}

export const DEFAULT_PHONETIC_OPTIONS: PhoneticOptions = { z: 'distincion' };

export interface Grapheme {
  /** Texto original (respeta tildes y mayúsculas). */
  text: string;
  /** Visema asociado. */
  viseme: VisemeId;
  /** La h es muda: se muestra pero no mueve la boca. */
  silent: boolean;
}

const VOWEL_VISEME: Record<string, VisemeId> = {
  a: 'a',
  á: 'a',
  e: 'e',
  é: 'e',
  i: 'i',
  í: 'i',
  o: 'o',
  ó: 'o',
  u: 'u',
  ú: 'u',
  ü: 'u',
};

const CONSONANT_VISEME: Record<string, VisemeId> = {
  b: 'bilabial',
  m: 'bilabial',
  p: 'bilabial',
  v: 'bilabial',
  f: 'labiodental',
  k: 'velar',
  g: 'velar',
  j: 'velar',
  q: 'velar',
  d: 'alveolar',
  t: 'alveolar',
  n: 'alveolar',
  l: 'lateral',
  ñ: 'palatal',
  r: 'vibrant',
  s: 'sibilant',
  x: 'sibilant',
  w: 'u',
};

const FRONT_VOWELS = new Set(['e', 'i', 'é', 'í']);

export const isVowel = (ch: string): boolean => ch.toLowerCase() in VOWEL_VISEME;

const isLetter = (ch: string): boolean => /\p{L}/u.test(ch);

/**
 * Divide un texto en español en grafemas con su visema.
 * Reconoce dígrafos (ch, ll, rr, qu, gu) y reglas contextuales (c/g + e/i, y final, h muda).
 */
export function tokenize(
  input: string,
  options: PhoneticOptions = DEFAULT_PHONETIC_OPTIONS,
): Grapheme[] {
  const text = input.normalize('NFC');
  const lower = text.toLowerCase();
  const out: Grapheme[] = [];
  const zViseme: VisemeId = options.z === 'seseo' ? 'sibilant' : 'interdental';

  let i = 0;
  while (i < lower.length) {
    const ch = lower[i]!;
    const next = lower[i + 1] ?? '';
    const afterNext = lower[i + 2] ?? '';
    const push = (len: number, viseme: VisemeId, silent = false) => {
      out.push({ text: text.slice(i, i + len), viseme, silent });
      i += len;
    };

    if (!isLetter(ch)) {
      i += 1;
      continue;
    }

    const pair = ch + next;
    if (pair === 'ch') {
      push(2, 'affricate');
      continue;
    }
    if (pair === 'll') {
      push(2, 'palatal');
      continue;
    }
    if (pair === 'rr') {
      push(2, 'vibrant');
      continue;
    }
    if ((pair === 'qu' || pair === 'gu') && FRONT_VOWELS.has(afterNext)) {
      push(2, 'velar');
      continue;
    }

    if (ch in VOWEL_VISEME) {
      push(1, VOWEL_VISEME[ch]!);
      continue;
    }
    if (ch === 'h') {
      push(1, 'rest', true);
      continue;
    }
    if (ch === 'c') {
      push(1, FRONT_VOWELS.has(next) ? zViseme : 'velar');
      continue;
    }
    if (ch === 'z') {
      push(1, zViseme);
      continue;
    }
    if (ch === 'y') {
      // "y" sola o al final de palabra suena como vocal i: "y", "hoy", "rey".
      const endOfWord = !next || !isLetter(next);
      push(1, endOfWord ? 'i' : 'palatal');
      continue;
    }
    push(1, CONSONANT_VISEME[ch] ?? 'rest');
  }
  return out;
}

/** Secuencia de visemas audibles (sin h muda) para animar la boca. */
export function toVisemeSequence(input: string, options?: PhoneticOptions): VisemeId[] {
  return tokenize(input, options)
    .filter((g) => !g.silent)
    .map((g) => g.viseme);
}
