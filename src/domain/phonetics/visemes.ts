import { createShape, NEUTRAL_SHAPE, type MouthShape } from './mouthShape';

/**
 * Un visema es la posición visible de la boca para un grupo de sonidos.
 * Varias letras comparten visema (m/b/p, s/x, etc.).
 *
 * Los valores están calibrados con las láminas de referencia de terapia; cualquier
 * ajuste pedagógico debe hacerse AQUÍ y queda cubierto por los tests.
 */
export const VISEME_IDS = [
  'rest',
  'a',
  'e',
  'i',
  'o',
  'u',
  'bilabial', // m, b, p, v
  'labiodental', // f
  'velar', // c(a/o/u), k, q, g, j
  'alveolar', // d, t, n
  'lateral', // l
  'palatal', // ll, y, ñ
  'vibrant', // r, rr
  'sibilant', // s, x, c(e/i), z (seseo)
  'interdental', // z, c(e/i) peninsular
  'affricate', // ch
] as const;

export type VisemeId = (typeof VISEME_IDS)[number];

export const VISEMES: Record<VisemeId, MouthShape> = {
  rest: NEUTRAL_SHAPE,
  a: createShape({
    open: 1,
    width: 0.62,
    round: 0.35,
    upperTeeth: 0.6,
    lowerTeeth: 0.12,
    tongue: 0.7,
  }),
  e: createShape({
    open: 0.38,
    width: 0.82,
    round: 0.1,
    upperTeeth: 1,
    lowerTeeth: 0.5,
    tongue: 0.35,
  }),
  i: createShape({ open: 0.22, width: 1, round: 0, upperTeeth: 1, lowerTeeth: 1 }),
  o: createShape({ open: 0.62, width: 0.32, round: 1, tongue: 0.35 }),
  u: createShape({ open: 0.12, width: 0.12, round: 1 }),
  bilabial: createShape({ open: 0, width: 0.55, round: 0.15, lipsPressed: 1 }),
  labiodental: createShape({ open: 0.14, width: 0.62, round: 0.1, upperTeeth: 1 }),
  velar: createShape({
    open: 0.55,
    width: 0.6,
    round: 0.3,
    upperTeeth: 0.8,
    lowerTeeth: 0.6,
    tongue: 0.5,
  }),
  alveolar: createShape({
    open: 0.32,
    width: 0.66,
    round: 0.15,
    upperTeeth: 0.9,
    lowerTeeth: 0.5,
    tongueTip: 1,
  }),
  lateral: createShape({
    open: 0.45,
    width: 0.66,
    round: 0.2,
    upperTeeth: 0.9,
    lowerTeeth: 0.6,
    tongue: 0.8,
    tongueTip: 1,
  }),
  palatal: createShape({
    open: 0.28,
    width: 0.85,
    round: 0.05,
    upperTeeth: 1,
    lowerTeeth: 1,
    tongue: 0.4,
  }),
  vibrant: createShape({
    open: 0.4,
    width: 0.62,
    round: 0.2,
    upperTeeth: 0.9,
    lowerTeeth: 0.6,
    tongue: 0.5,
    tongueTip: 0.85,
  }),
  sibilant: createShape({ open: 0.1, width: 0.78, round: 0.05, upperTeeth: 1, lowerTeeth: 1 }),
  interdental: createShape({
    open: 0.2,
    width: 0.7,
    round: 0.1,
    upperTeeth: 1,
    lowerTeeth: 0.8,
    tongueOut: 1,
  }),
  affricate: createShape({ open: 0.16, width: 0.36, round: 0.7, upperTeeth: 1, lowerTeeth: 1 }),
};

export function getViseme(id: VisemeId): MouthShape {
  return VISEMES[id];
}
