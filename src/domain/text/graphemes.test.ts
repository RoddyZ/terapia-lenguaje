import { tokenize, toVisemeSequence } from './graphemes';

const texts = (s: string) => tokenize(s).map((g) => g.text);

describe('tokenize', () => {
  it('reconoce dígrafos ch, ll, rr', () => {
    expect(texts('chocolate')).toEqual(['ch', 'o', 'c', 'o', 'l', 'a', 't', 'e']);
    expect(texts('llave')).toEqual(['ll', 'a', 'v', 'e']);
    expect(texts('perro')).toEqual(['p', 'e', 'rr', 'o']);
  });

  it('trata qu/gu + e/i como un solo sonido velar', () => {
    expect(texts('queso')).toEqual(['qu', 'e', 's', 'o']);
    expect(texts('guitarra')).toEqual(['gu', 'i', 't', 'a', 'rr', 'a']);
    expect(texts('agua')).toEqual(['a', 'g', 'u', 'a']);
  });

  it('marca la h como muda', () => {
    const [h] = tokenize('hola');
    expect(h).toMatchObject({ text: 'h', silent: true });
    expect(toVisemeSequence('hola')).toEqual(['o', 'lateral', 'a']);
  });

  it('aplica c + e/i según la pronunciación elegida', () => {
    expect(toVisemeSequence('cielo')[0]).toBe('interdental');
    expect(toVisemeSequence('cielo', { z: 'seseo' })[0]).toBe('sibilant');
    expect(toVisemeSequence('casa')[0]).toBe('velar');
  });

  it('distingue y vocal de y consonante', () => {
    expect(toVisemeSequence('rey')).toEqual(['vibrant', 'e', 'i']);
    expect(toVisemeSequence('yoyo')).toEqual(['palatal', 'o', 'palatal', 'o']);
  });

  it('respeta tildes y mayúsculas en el texto pero normaliza el visema', () => {
    const tokens = tokenize('Mamá');
    expect(tokens.map((t) => t.text)).toEqual(['M', 'a', 'm', 'á']);
    expect(tokens.map((t) => t.viseme)).toEqual(['bilabial', 'a', 'bilabial', 'a']);
  });

  it('ignora espacios y signos', () => {
    expect(texts('¡sol!')).toEqual(['s', 'o', 'l']);
  });
});
