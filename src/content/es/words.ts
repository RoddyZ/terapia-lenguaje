import type { WordEntry } from '../types';

/**
 * Banco de palabras por niveles:
 *  1 → dos sílabas directas (CV-CV)
 *  2 → tres sílabas directas
 *  3 → dígrafos, sílabas trabadas o inversas
 *
 * Para añadir palabras basta con agregar entradas aquí; los tests validan
 * que las sílabas reconstruyan la palabra.
 */
export const WORDS: readonly WordEntry[] = [
  // Nivel 1
  { id: 'casa', text: 'casa', syllables: ['ca', 'sa'], emoji: '🏠', level: 1 },
  { id: 'luna', text: 'luna', syllables: ['lu', 'na'], emoji: '🌙', level: 1 },
  { id: 'sopa', text: 'sopa', syllables: ['so', 'pa'], emoji: '🍲', level: 1 },
  { id: 'pato', text: 'pato', syllables: ['pa', 'to'], emoji: '🦆', level: 1 },
  { id: 'gato', text: 'gato', syllables: ['ga', 'to'], emoji: '🐱', level: 1 },
  { id: 'foca', text: 'foca', syllables: ['fo', 'ca'], emoji: '🦭', level: 1 },
  { id: 'vaca', text: 'vaca', syllables: ['va', 'ca'], emoji: '🐮', level: 1 },
  { id: 'dedo', text: 'dedo', syllables: ['de', 'do'], emoji: '☝️', level: 1 },
  { id: 'nube', text: 'nube', syllables: ['nu', 'be'], emoji: '☁️', level: 1 },
  { id: 'mano', text: 'mano', syllables: ['ma', 'no'], emoji: '✋', level: 1 },
  { id: 'mono', text: 'mono', syllables: ['mo', 'no'], emoji: '🐒', level: 1 },
  { id: 'uva', text: 'uva', syllables: ['u', 'va'], emoji: '🍇', level: 1 },
  { id: 'oso', text: 'oso', syllables: ['o', 'so'], emoji: '🐻', level: 1 },
  { id: 'ojo', text: 'ojo', syllables: ['o', 'jo'], emoji: '👁️', level: 1 },
  { id: 'pera', text: 'pera', syllables: ['pe', 'ra'], emoji: '🍐', level: 1 },
  { id: 'sapo', text: 'sapo', syllables: ['sa', 'po'], emoji: '🐸', level: 1 },
  { id: 'coco', text: 'coco', syllables: ['co', 'co'], emoji: '🥥', level: 1 },
  { id: 'bebe', text: 'bebé', syllables: ['be', 'bé'], emoji: '👶', level: 1 },
  { id: 'lobo', text: 'lobo', syllables: ['lo', 'bo'], emoji: '🐺', level: 1 },
  { id: 'taza', text: 'taza', syllables: ['ta', 'za'], emoji: '☕', level: 1 },
  { id: 'pina', text: 'piña', syllables: ['pi', 'ña'], emoji: '🍍', level: 1 },
  // Nivel 2
  { id: 'pelota', text: 'pelota', syllables: ['pe', 'lo', 'ta'], emoji: '⚽', level: 2 },
  { id: 'zapato', text: 'zapato', syllables: ['za', 'pa', 'to'], emoji: '👞', level: 2 },
  { id: 'paloma', text: 'paloma', syllables: ['pa', 'lo', 'ma'], emoji: '🕊️', level: 2 },
  { id: 'tomate', text: 'tomate', syllables: ['to', 'ma', 'te'], emoji: '🍅', level: 2 },
  { id: 'conejo', text: 'conejo', syllables: ['co', 'ne', 'jo'], emoji: '🐰', level: 2 },
  { id: 'muneca', text: 'muñeca', syllables: ['mu', 'ñe', 'ca'], emoji: '🪆', level: 2 },
  { id: 'gusano', text: 'gusano', syllables: ['gu', 'sa', 'no'], emoji: '🐛', level: 2 },
  { id: 'camisa', text: 'camisa', syllables: ['ca', 'mi', 'sa'], emoji: '👕', level: 2 },
  { id: 'banana', text: 'banana', syllables: ['ba', 'na', 'na'], emoji: '🍌', level: 2 },
  { id: 'jirafa', text: 'jirafa', syllables: ['ji', 'ra', 'fa'], emoji: '🦒', level: 2 },
  { id: 'abeja', text: 'abeja', syllables: ['a', 'be', 'ja'], emoji: '🐝', level: 2 },
  { id: 'helado', text: 'helado', syllables: ['he', 'la', 'do'], emoji: '🍦', level: 2 },
  // Nivel 3
  { id: 'perro', text: 'perro', syllables: ['pe', 'rro'], emoji: '🐶', level: 3 },
  { id: 'llave', text: 'llave', syllables: ['lla', 've'], emoji: '🔑', level: 3 },
  { id: 'queso', text: 'queso', syllables: ['que', 'so'], emoji: '🧀', level: 3 },
  {
    id: 'chocolate',
    text: 'chocolate',
    syllables: ['cho', 'co', 'la', 'te'],
    emoji: '🍫',
    level: 3,
  },
  { id: 'guitarra', text: 'guitarra', syllables: ['gui', 'ta', 'rra'], emoji: '🎸', level: 3 },
  { id: 'ballena', text: 'ballena', syllables: ['ba', 'lle', 'na'], emoji: '🐋', level: 3 },
  { id: 'caballo', text: 'caballo', syllables: ['ca', 'ba', 'llo'], emoji: '🐴', level: 3 },
  { id: 'pollito', text: 'pollito', syllables: ['po', 'lli', 'to'], emoji: '🐥', level: 3 },
  { id: 'tortuga', text: 'tortuga', syllables: ['tor', 'tu', 'ga'], emoji: '🐢', level: 3 },
  { id: 'arbol', text: 'árbol', syllables: ['ár', 'bol'], emoji: '🌳', level: 3 },
  { id: 'estrella', text: 'estrella', syllables: ['es', 'tre', 'lla'], emoji: '⭐', level: 3 },
];

export function wordsByLevel(level: number): WordEntry[] {
  return WORDS.filter((w) => w.level === level);
}
