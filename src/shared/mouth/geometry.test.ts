import { VISEMES } from '@/domain/phonetics';
import { computeMouth, VIEWBOX } from './geometry';

const numbers = (path: string) => (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe('computeMouth', () => {
  it('genera paths válidos dentro del viewBox para todos los visemas', () => {
    for (const shape of Object.values(VISEMES)) {
      const g = computeMouth(shape);
      for (const path of [g.upperLip, g.lowerLip, g.cavity]) {
        const nums = numbers(path);
        expect(nums.length).toBeGreaterThan(0);
        nums.forEach((n) => {
          expect(Number.isFinite(n)).toBe(true);
          expect(n).toBeGreaterThanOrEqual(-10);
          expect(n).toBeLessThanOrEqual(VIEWBOX.width + 10);
        });
      }
    }
  });

  it('la a abre más que la e y la u es la más estrecha', () => {
    const height = (id: keyof typeof VISEMES) => computeMouth(VISEMES[id]).tongue.cy;
    expect(height('a')).toBeGreaterThan(height('e'));
    const width = (id: keyof typeof VISEMES) => computeMouth(VISEMES[id]).upperTeeth.width;
    expect(width('u')).toBeLessThan(width('o'));
    expect(width('i')).toBeGreaterThan(width('a'));
  });

  it('los labios apretados ocultan dientes y lengua', () => {
    const g = computeMouth(VISEMES.bilabial);
    expect(g.upperTeeth.opacity).toBe(0);
    expect(g.tongue.opacity).toBe(0);
  });
});
