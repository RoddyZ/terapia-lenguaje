import { lerpShape, MOUTH_KEYS, NEUTRAL_SHAPE } from './mouthShape';
import { VISEME_IDS, VISEMES } from './visemes';

describe('visemas', () => {
  it('todos los valores están normalizados', () => {
    for (const id of VISEME_IDS) {
      for (const key of MOUTH_KEYS) {
        expect(VISEMES[id][key]).toBeGreaterThanOrEqual(0);
        expect(VISEMES[id][key]).toBeLessThanOrEqual(1);
      }
    }
  });

  it('respeta los rasgos articulatorios clave', () => {
    expect(VISEMES.a.open).toBeGreaterThan(VISEMES.e.open);
    expect(VISEMES.i.width).toBeGreaterThan(VISEMES.e.width);
    expect(VISEMES.u.round).toBe(1);
    expect(VISEMES.u.open).toBeLessThan(VISEMES.o.open);
    expect(VISEMES.bilabial.lipsPressed).toBe(1);
    expect(VISEMES.interdental.tongueOut).toBe(1);
  });

  it('interpola entre formas', () => {
    const mid = lerpShape(NEUTRAL_SHAPE, VISEMES.a, 0.5);
    expect(mid.open).toBeCloseTo((NEUTRAL_SHAPE.open + VISEMES.a.open) / 2);
  });
});
