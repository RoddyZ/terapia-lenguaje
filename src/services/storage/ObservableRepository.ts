import type { KeyValueStore } from './KeyValueStore';

/**
 * Repositorio versionado y observable sobre un KeyValueStore.
 * Compatible con React.useSyncExternalStore (subscribe + getSnapshot estable).
 */
export class ObservableRepository<T> {
  private snapshot: T;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly store: KeyValueStore,
    private readonly key: string,
    private readonly defaults: T,
    private readonly migrate: (stored: unknown) => T | undefined = (s) => s as T,
  ) {
    const stored = store.get<unknown>(key);
    this.snapshot = (stored !== undefined && this.migrate(stored)) || defaults;
  }

  getSnapshot = (): T => this.snapshot;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  update(updater: (current: T) => T) {
    this.snapshot = updater(this.snapshot);
    this.store.set(this.key, this.snapshot);
    this.listeners.forEach((l) => l());
  }

  reset() {
    this.snapshot = this.defaults;
    this.store.remove(this.key);
    this.listeners.forEach((l) => l());
  }
}
