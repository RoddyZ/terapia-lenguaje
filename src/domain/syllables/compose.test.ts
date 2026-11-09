import { composeSyllable } from './compose';

describe('composeSyllable', () => {
  it('compone sílabas directas simples', () => {
    expect(composeSyllable('m', 'a')).toEqual({ text: 'ma', valid: true });
    expect(composeSyllable('ch', 'o').text).toBe('cho');
    expect(composeSyllable('LL', 'u').text).toBe('llu');
  });

  it('aplica la regla de la q', () => {
    expect(composeSyllable('q', 'e')).toMatchObject({ text: 'que', valid: true });
    expect(composeSyllable('q', 'a')).toMatchObject({ valid: false });
  });

  it('avisa cambios de sonido en c/g + e/i', () => {
    expect(composeSyllable('c', 'i').hint).toMatch(/suave/);
    expect(composeSyllable('g', 'e').hint).toMatch(/gue/);
  });

  it('compone sílabas inversas y rechaza codas imposibles', () => {
    expect(composeSyllable('l', 'a', 'VC')).toEqual({ text: 'al', valid: true });
    expect(composeSyllable('ñ', 'a', 'VC').valid).toBe(false);
  });
});
