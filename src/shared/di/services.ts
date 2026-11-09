import { createContext } from 'react';
import type { ProgressRepository } from '@/services/progress/progress';
import type { SettingsRepository } from '@/services/settings/settings';
import type { SpeechService } from '@/services/speech/SpeechService';

/**
 * Contenedor de dependencias de la app. Las features solo conocen estas
 * interfaces; la composición concreta se hace en src/app/composition.ts.
 */
export interface AppServices {
  speech: SpeechService;
  progress: ProgressRepository;
  settings: SettingsRepository;
}

export const ServicesContext = createContext<AppServices | null>(null);
