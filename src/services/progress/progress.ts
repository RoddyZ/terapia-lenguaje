import type { KeyValueStore } from '../storage/KeyValueStore';
import { ObservableRepository } from '../storage/ObservableRepository';

export type ActivityId = 'vowels' | 'alphabet' | 'syllables' | 'words';

export interface ItemProgress {
  attempts: number;
  successes: number;
  lastPracticedAt: string;
}

export interface ProgressState {
  version: 1;
  activities: Partial<Record<ActivityId, Record<string, ItemProgress>>>;
}

const EMPTY: ProgressState = { version: 1, activities: {} };

export class ProgressRepository extends ObservableRepository<ProgressState> {
  constructor(
    store: KeyValueStore,
    private readonly now: () => Date = () => new Date(),
  ) {
    super(store, 'progress', EMPTY, (stored) =>
      (stored as ProgressState | undefined)?.version === 1 ? (stored as ProgressState) : undefined,
    );
  }

  record(activity: ActivityId, itemId: string, success: boolean) {
    this.update((state) => {
      const items = state.activities[activity] ?? {};
      const prev = items[itemId] ?? { attempts: 0, successes: 0, lastPracticedAt: '' };
      return {
        ...state,
        activities: {
          ...state.activities,
          [activity]: {
            ...items,
            [itemId]: {
              attempts: prev.attempts + 1,
              successes: prev.successes + (success ? 1 : 0),
              lastPracticedAt: this.now().toISOString(),
            },
          },
        },
      };
    });
  }
}

/** Número de elementos distintos superados al menos una vez. */
export function masteredCount(state: ProgressState, activity: ActivityId): number {
  return Object.values(state.activities[activity] ?? {}).filter((p) => p.successes > 0).length;
}
