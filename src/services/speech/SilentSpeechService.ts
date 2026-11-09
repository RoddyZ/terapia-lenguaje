import type { SpeechService } from './SpeechService';

export class SilentSpeechService implements SpeechService {
  readonly supported = false;
  readonly spoken: string[] = [];

  speak(text: string) {
    this.spoken.push(text);
    return Promise.resolve();
  }

  cancel() {}
}
