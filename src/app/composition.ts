import type { AppServices } from '@/shared/di/services';
import { ProgressRepository } from '@/services/progress/progress';
import { SettingsRepository } from '@/services/settings/settings';
import { SilentSpeechService } from '@/services/speech/SilentSpeechService';
import { WebSpeechService } from '@/services/speech/WebSpeechService';
import {
  LocalStorageStore,
  MemoryStore,
  type KeyValueStore,
} from '@/services/storage/KeyValueStore';

/**
 * Composition root: el único sitio que decide QUÉ implementación concreta se usa.
 * Para escalar (backend, cuentas, audios grabados) se cambia aquí.
 */
export function createServices(overrides: Partial<{ store: KeyValueStore }> = {}): AppServices {
  const store = overrides.store ?? new LocalStorageStore('boquitas');
  const speech =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? new WebSpeechService()
      : new SilentSpeechService();

  return {
    speech,
    progress: new ProgressRepository(store),
    settings: new SettingsRepository(store),
  };
}

export function createTestServices(): AppServices & { speech: SilentSpeechService } {
  const store = new MemoryStore();
  return {
    speech: new SilentSpeechService(),
    progress: new ProgressRepository(store),
    settings: new SettingsRepository(store),
  };
}
