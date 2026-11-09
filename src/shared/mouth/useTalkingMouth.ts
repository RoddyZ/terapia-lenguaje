import { useCallback } from 'react';
import type { VisemeId } from '@/domain/phonetics';
import { toVisemeSequence } from '@/domain/text';
import { useServices, useSettings } from '../di/hooks';
import { useMouthAnimation } from './useMouthAnimation';

export interface SayOptions {
  /** Secuencia explícita (si no, se deriva del texto). */
  visemes?: readonly VisemeId[];
  /** Texto que pronuncia la voz si difiere del animado (p. ej. nombre de la letra). */
  spoken?: string;
  /** Volver a reposo al terminar (por defecto sí). */
  endAtRest?: boolean;
}

/**
 * Une voz + animación: la boca "dice" el texto respetando los ajustes
 * de velocidad y pronunciación configurados por la terapeuta.
 */
export function useTalkingMouth(initial?: VisemeId) {
  const mouth = useMouthAnimation(initial);
  const { speech } = useServices();
  const [settings] = useSettings();
  const { play } = mouth;

  const say = useCallback(
    (text: string, { visemes, spoken, endAtRest = true }: SayOptions = {}) => {
      const sequence = visemes ?? toVisemeSequence(text, { z: settings.zPronunciation });
      if (settings.speechEnabled) void speech.speak(spoken ?? text, { rate: settings.speechRate });
      return play(sequence, { stepMs: settings.mouthStepMs, endAtRest });
    },
    [play, speech, settings],
  );

  return { ...mouth, say };
}
