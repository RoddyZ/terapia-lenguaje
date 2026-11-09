import type { ZPronunciation } from '@/domain/text';
import type { KeyValueStore } from '../storage/KeyValueStore';
import { ObservableRepository } from '../storage/ObservableRepository';

export type LetterCase = 'upper' | 'lower' | 'both';

export interface Settings {
  speechEnabled: boolean;
  speechRate: number;
  /** Velocidad de la animación de la boca: milisegundos por sonido. */
  mouthStepMs: number;
  letterCase: LetterCase;
  zPronunciation: ZPronunciation;
}

export const DEFAULT_SETTINGS: Settings = {
  speechEnabled: true,
  speechRate: 0.8,
  mouthStepMs: 420,
  letterCase: 'both',
  zPronunciation: 'distincion',
};

export class SettingsRepository extends ObservableRepository<Settings> {
  constructor(store: KeyValueStore) {
    // Fusiona con los valores por defecto: ajustes nuevos no rompen datos antiguos.
    super(store, 'settings', DEFAULT_SETTINGS, (stored) => ({
      ...DEFAULT_SETTINGS,
      ...(stored as Partial<Settings>),
    }));
  }

  set<K extends keyof Settings>(key: K, value: Settings[K]) {
    this.update((s) => ({ ...s, [key]: value }));
  }
}
