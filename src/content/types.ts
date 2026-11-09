import type { VisemeId } from '@/domain/phonetics';

export type Tone = 'pink' | 'blue' | 'green' | 'yellow' | 'purple';

export type LetterKind = 'vowel' | 'consonant' | 'digraph';

export interface Example {
  word: string;
  emoji: string;
}

export interface LetterEntry {
  /** Identificador estable para URLs y progreso (ascii). */
  id: string;
  upper: string;
  lower: string;
  /** Nombre de la letra tal como se pronuncia ("eme", "che"). */
  name: string;
  kind: LetterKind;
  viseme: VisemeId;
  /** Indicación articulatoria corta, pensada para leerla en voz alta al niño. */
  tip: string;
  examples: Example[];
  tone: Tone;
  /** Se puede usar como inicio de sílaba en el constructor. */
  syllableOnset: boolean;
}

export type WordLevel = 1 | 2 | 3;

export interface WordEntry {
  id: string;
  text: string;
  syllables: string[];
  emoji: string;
  level: WordLevel;
}
