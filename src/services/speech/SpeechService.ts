export interface SpeakOptions {
  /** 0.5 (muy lento) .. 1.2 (rápido). Para niños se recomienda ~0.8. */
  rate?: number;
}

/**
 * Puerto de voz. Implementaciones actuales:
 *  - WebSpeechService: síntesis del navegador (sin coste, offline en la mayoría de equipos).
 *  - SilentSpeechService: tests / navegadores sin soporte.
 *
 * Futuro: RecordedAudioService con audios grabados por la terapeuta, que
 * delegue en la síntesis cuando falte un audio.
 */
export interface SpeechService {
  readonly supported: boolean;
  speak(text: string, options?: SpeakOptions): Promise<void>;
  cancel(): void;
}
