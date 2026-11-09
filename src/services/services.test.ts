import { masteredCount, ProgressRepository } from './progress/progress';
import { DEFAULT_SETTINGS, SettingsRepository } from './settings/settings';
import { MemoryStore } from './storage/KeyValueStore';

describe('ProgressRepository', () => {
  it('registra intentos y aciertos y notifica a suscriptores', () => {
    const repo = new ProgressRepository(new MemoryStore(), () => new Date('2026-01-01'));
    const listener = vi.fn();
    repo.subscribe(listener);

    repo.record('vowels', 'a', true);
    repo.record('vowels', 'a', false);
    repo.record('vowels', 'e', false);

    expect(repo.getSnapshot().activities.vowels?.a).toEqual({
      attempts: 2,
      successes: 1,
      lastPracticedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(masteredCount(repo.getSnapshot(), 'vowels')).toBe(1);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('persiste entre instancias y descarta versiones desconocidas', () => {
    const store = new MemoryStore();
    new ProgressRepository(store).record('words', 'casa', true);
    expect(masteredCount(new ProgressRepository(store).getSnapshot(), 'words')).toBe(1);

    store.set('progress', { version: 99 });
    expect(new ProgressRepository(store).getSnapshot().activities).toEqual({});
  });
});

describe('SettingsRepository', () => {
  it('fusiona ajustes guardados con los valores por defecto', () => {
    const store = new MemoryStore();
    store.set('settings', { speechRate: 1 });
    const repo = new SettingsRepository(store);
    expect(repo.getSnapshot()).toEqual({ ...DEFAULT_SETTINGS, speechRate: 1 });
    repo.set('letterCase', 'upper');
    expect(store.get('settings')).toMatchObject({ letterCase: 'upper' });
  });
});
