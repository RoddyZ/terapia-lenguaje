/**
 * Forma de la boca como vector numérico normalizado (0..1).
 *
 * Todo es numérico a propósito: permite interpolar entre dos formas cualquiera
 * y así animar transiciones suaves (m → a, sílabas, palabras completas).
 */
export interface MouthShape {
  /** Apertura vertical de la mandíbula/labios. */
  open: number;
  /** Ancho horizontal (sonrisa = 1, beso = 0). */
  width: number;
  /** Redondez de los labios (o/u = 1). */
  round: number;
  /** Visibilidad de los dientes superiores. */
  upperTeeth: number;
  /** Visibilidad de los dientes inferiores. */
  lowerTeeth: number;
  /** Visibilidad del cuerpo de la lengua. */
  tongue: number;
  /** Punta de la lengua elevada hacia los alvéolos (l, n, d, t, r). */
  tongueTip: number;
  /** Lengua asomando entre los dientes (z peninsular). */
  tongueOut: number;
  /** Labios apretados (m, b, p). */
  lipsPressed: number;
}

export const MOUTH_KEYS = [
  'open',
  'width',
  'round',
  'upperTeeth',
  'lowerTeeth',
  'tongue',
  'tongueTip',
  'tongueOut',
  'lipsPressed',
] as const satisfies readonly (keyof MouthShape)[];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const NEUTRAL_SHAPE: MouthShape = {
  open: 0.04,
  width: 0.5,
  round: 0.2,
  upperTeeth: 0,
  lowerTeeth: 0,
  tongue: 0,
  tongueTip: 0,
  tongueOut: 0,
  lipsPressed: 0,
};

export function createShape(partial: Partial<MouthShape>): MouthShape {
  const shape = { ...NEUTRAL_SHAPE, ...partial };
  for (const key of MOUTH_KEYS) shape[key] = clamp01(shape[key]);
  return shape;
}

/** Interpolación lineal entre dos formas. `t` en 0..1. */
export function lerpShape(from: MouthShape, to: MouthShape, t: number): MouthShape {
  const k = clamp01(t);
  const out = { ...from };
  for (const key of MOUTH_KEYS) out[key] = from[key] + (to[key] - from[key]) * k;
  return out;
}
