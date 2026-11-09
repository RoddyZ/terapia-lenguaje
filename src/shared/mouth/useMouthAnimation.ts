import { useCallback, useEffect, useRef, useState } from 'react';
import {
  buildTimeline,
  sampleTimeline,
  timelineDuration,
  VISEMES,
  type MouthShape,
  type VisemeId,
} from '@/domain/phonetics';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export interface PlayOptions {
  stepMs?: number;
  endAtRest?: boolean;
}

/**
 * Anima la boca a lo largo de una secuencia de visemas con requestAnimationFrame.
 * Una nueva llamada a `play` cancela la anterior.
 */
export function useMouthAnimation(initial: VisemeId = 'rest') {
  const [shape, setShape] = useState<MouthShape>(VISEMES[initial]);
  const [playing, setPlaying] = useState(false);
  const shapeRef = useRef(shape);
  const frameRef = useRef<number | null>(null);
  const resolveRef = useRef<(() => void) | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    resolveRef.current?.();
    resolveRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const play = useCallback(
    (sequence: readonly VisemeId[], { stepMs = 420, endAtRest = true }: PlayOptions = {}) => {
      stop();
      const frames = buildTimeline(shapeRef.current, sequence, {
        stepMs,
        endAtRest,
        // Con movimiento reducido no interpolamos: saltos directos entre poses.
        transition: reducedMotion ? 0.001 : 0.4,
      });
      const total = timelineDuration(frames);
      setPlaying(true);

      return new Promise<void>((resolve) => {
        resolveRef.current = () => {
          setPlaying(false);
          resolve();
        };
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const next = sampleTimeline(frames, elapsed);
          shapeRef.current = next;
          setShape(next);
          if (elapsed < total) {
            frameRef.current = requestAnimationFrame(tick);
          } else {
            frameRef.current = null;
            resolveRef.current?.();
            resolveRef.current = null;
          }
        };
        frameRef.current = requestAnimationFrame(tick);
      });
    },
    [reducedMotion, stop],
  );

  /** Lleva la boca a una pose y la mantiene (útil para mostrar una vocal fija). */
  const pose = useCallback(
    (viseme: VisemeId) => play([viseme], { stepMs: 300, endAtRest: false }),
    [play],
  );

  return { shape, playing, play, pose, stop };
}
