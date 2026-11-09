import { VISEME_IDS } from '@/domain/phonetics';
import { ALPHABET, VOWELS, WORDS } from './es';

/**
 * Tests de integridad del contenido: protegen a quien edite el catálogo
 * (incluida la terapeuta) de errores silenciosos.
 */
describe('contenido: abecedario', () => {
  it('tiene ids únicos', () => {
    const ids = ALPHABET.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('las vocales son exactamente a, e, i, o, u', () => {
    expect(VOWELS.map((v) => v.lower)).toEqual(['a', 'e', 'i', 'o', 'u']);
  });

  it('cada letra usa un visema existente y tiene ejemplos', () => {
    for (const letter of ALPHABET) {
      expect(VISEME_IDS).toContain(letter.viseme);
      expect(letter.examples.length).toBeGreaterThan(0);
    }
  });
});

describe('contenido: palabras', () => {
  it('las sílabas reconstruyen la palabra', () => {
    for (const w of WORDS) expect(w.syllables.join('')).toBe(w.text);
  });

  it('tiene ids únicos', () => {
    const ids = WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada nivel tiene suficientes palabras para una sesión', () => {
    for (const level of [1, 2, 3]) {
      expect(WORDS.filter((w) => w.level === level).length).toBeGreaterThanOrEqual(5);
    }
  });
});
