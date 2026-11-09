import { NEUTRAL_SHAPE } from './mouthShape';
import { buildTimeline, sampleTimeline, timelineDuration } from './timeline';
import { VISEMES } from './visemes';

describe('timeline', () => {
  const frames = buildTimeline(NEUTRAL_SHAPE, ['bilabial', 'a'], { stepMs: 100 });

  it('dura un paso por sonido más el regreso a reposo', () => {
    expect(timelineDuration(frames)).toBe(300);
  });

  it('mantiene cada pose tras la transición', () => {
    expect(sampleTimeline(frames, 50)).toEqual(VISEMES.bilabial);
    expect(sampleTimeline(frames, 150)).toEqual(VISEMES.a);
    expect(sampleTimeline(frames, 199)).toEqual(VISEMES.a);
  });

  it('interpola durante la transición', () => {
    const mid = sampleTimeline(frames, 120);
    expect(mid.open).toBeGreaterThan(VISEMES.bilabial.open);
    expect(mid.open).toBeLessThan(VISEMES.a.open);
  });

  it('termina en reposo', () => {
    expect(sampleTimeline(frames, 10_000)).toEqual(VISEMES.rest);
  });
});
