import { lerpShape, type MouthShape } from './mouthShape';
import { VISEMES, type VisemeId } from './visemes';

export interface Keyframe {
  /** Milisegundos desde el inicio. */
  at: number;
  shape: MouthShape;
}

export interface TimelineOptions {
  /** Duración total de cada sonido. */
  stepMs: number;
  /** Fracción del paso dedicada a la transición (el resto se mantiene la pose). */
  transition?: number;
  /** Volver a reposo al terminar. */
  endAtRest?: boolean;
}

/**
 * Construye la línea de tiempo de una secuencia de visemas:
 * transición → pose mantenida → siguiente sonido…
 * Mantener la pose es clave en terapia: el niño necesita ver la posición.
 */
export function buildTimeline(
  from: MouthShape,
  sequence: readonly VisemeId[],
  { stepMs, transition = 0.4, endAtRest = true }: TimelineOptions,
): Keyframe[] {
  const frames: Keyframe[] = [{ at: 0, shape: from }];
  const steps = endAtRest ? [...sequence, 'rest' as const] : [...sequence];
  steps.forEach((viseme, i) => {
    const start = i * stepMs;
    frames.push({ at: start + stepMs * transition, shape: VISEMES[viseme] });
    frames.push({ at: start + stepMs, shape: VISEMES[viseme] });
  });
  return frames;
}

export const timelineDuration = (frames: readonly Keyframe[]) => frames.at(-1)?.at ?? 0;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Forma de la boca en el instante `t` (ms). */
export function sampleTimeline(frames: readonly Keyframe[], t: number): MouthShape {
  const first = frames[0];
  if (!first) throw new Error('Timeline vacía');
  if (t <= first.at) return first.shape;
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1]!;
    const b = frames[i]!;
    if (t <= b.at) {
      const span = b.at - a.at;
      return span <= 0 ? b.shape : lerpShape(a.shape, b.shape, easeInOut((t - a.at) / span));
    }
  }
  return frames.at(-1)!.shape;
}
