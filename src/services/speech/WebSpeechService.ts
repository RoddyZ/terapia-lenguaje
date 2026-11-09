import type { SpeakOptions, SpeechService } from './SpeechService';

/** Orden de preferencia de variantes de español. */
const PREFERRED_LANGS = ['es-MX', 'es-US', 'es-419', 'es-CO', 'es-AR', 'es-ES', 'es'];

export class WebSpeechService implements SpeechService {
  readonly supported: boolean;
  private voice: SpeechSynthesisVoice | undefined;
  private readonly synth: SpeechSynthesis | undefined;

  constructor(private readonly preferredLangs: readonly string[] = PREFERRED_LANGS) {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    this.supported = Boolean(this.synth);
    if (this.synth) {
      this.pickVoice();
      // Las voces se cargan de forma asíncrona en Chrome.
      this.synth.addEventListener?.('voiceschanged', () => this.pickVoice());
    }
  }

  private pickVoice() {
    const voices = this.synth?.getVoices() ?? [];
    for (const lang of this.preferredLangs) {
      const match = voices.find((v) => v.lang.replace('_', '-').startsWith(lang));
      if (match) {
        this.voice = match;
        return;
      }
    }
  }

  speak(text: string, options: SpeakOptions = {}): Promise<void> {
    const synth = this.synth;
    if (!synth) return Promise.resolve();
    synth.cancel();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.voice?.lang ?? 'es-MX';
      if (this.voice) utterance.voice = this.voice;
      utterance.rate = options.rate ?? 0.8;
      utterance.pitch = 1.1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      synth.speak(utterance);
    });
  }

  cancel() {
    this.synth?.cancel();
  }
}
