/**
 * Puerto de almacenamiento clave-valor. Hoy: localStorage.
 * Al escalar (cuentas de terapeuta, varios niños por terapeuta) se puede
 * sustituir por un adaptador remoto sin tocar las features.
 */
export interface KeyValueStore {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

export class LocalStorageStore implements KeyValueStore {
  constructor(private readonly namespace = 'boquitas') {}

  private k(key: string) {
    return `${this.namespace}:${key}`;
  }

  get<T>(key: string): T | undefined {
    try {
      const raw = window.localStorage.getItem(this.k(key));
      return raw === null ? undefined : (JSON.parse(raw) as T);
    } catch {
      return undefined;
    }
  }

  set<T>(key: string, value: T) {
    try {
      window.localStorage.setItem(this.k(key), JSON.stringify(value));
    } catch {
      // Modo privado o cuota llena: la app sigue funcionando sin persistir.
    }
  }

  remove(key: string) {
    try {
      window.localStorage.removeItem(this.k(key));
    } catch {
      /* noop */
    }
  }
}

export class MemoryStore implements KeyValueStore {
  private readonly data = new Map<string, unknown>();
  get<T>(key: string) {
    return this.data.get(key) as T | undefined;
  }
  set<T>(key: string, value: T) {
    this.data.set(key, value);
  }
  remove(key: string) {
    this.data.delete(key);
  }
}
