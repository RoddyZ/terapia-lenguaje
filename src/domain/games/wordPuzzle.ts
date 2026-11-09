import { shuffle, type Rng, defaultRng } from './random';

export interface Tile {
  id: string;
  text: string;
}

export type PuzzleStatus = 'playing' | 'solved' | 'wrong';

export interface WordPuzzleState {
  target: readonly string[];
  tiles: readonly Tile[];
  /** Ids de fichas colocadas en cada hueco (null = vacío). */
  slots: readonly (string | null)[];
  status: PuzzleStatus;
  mistakes: number;
}

export type WordPuzzleAction =
  { type: 'place'; tileId: string } | { type: 'remove'; slot: number } | { type: 'retry' };

/**
 * Crea el puzzle "ordena las sílabas". Se pueden añadir sílabas distractoras
 * para subir la dificultad.
 */
export function createWordPuzzle(
  syllables: readonly string[],
  distractors: readonly string[] = [],
  rng: Rng = defaultRng,
): WordPuzzleState {
  const tiles = shuffle(
    [...syllables, ...distractors].map((text, i) => ({ id: `t${i}`, text })),
    rng,
  );
  return {
    target: syllables,
    tiles,
    slots: syllables.map(() => null),
    status: 'playing',
    mistakes: 0,
  };
}

const tileText = (state: WordPuzzleState, id: string | null) =>
  id ? state.tiles.find((t) => t.id === id)?.text : undefined;

function evaluate(state: WordPuzzleState): WordPuzzleState {
  if (state.slots.some((s) => s === null)) return { ...state, status: 'playing' };
  // Se compara por texto: dos sílabas iguales ("ma-ma") son intercambiables.
  const ok = state.slots.every(
    (id, i) => tileText(state, id)?.toLowerCase() === state.target[i]?.toLowerCase(),
  );
  return ok
    ? { ...state, status: 'solved' }
    : { ...state, status: 'wrong', mistakes: state.mistakes + 1 };
}

export function wordPuzzleReducer(
  state: WordPuzzleState,
  action: WordPuzzleAction,
): WordPuzzleState {
  switch (action.type) {
    case 'place': {
      if (state.status !== 'playing' || state.slots.includes(action.tileId)) return state;
      const index = state.slots.indexOf(null);
      if (index === -1) return state;
      const slots = [...state.slots];
      slots[index] = action.tileId;
      return evaluate({ ...state, slots });
    }
    case 'remove': {
      if (state.status === 'solved') return state;
      const slots = [...state.slots];
      slots[action.slot] = null;
      return { ...state, slots, status: 'playing' };
    }
    case 'retry':
      return { ...state, slots: state.target.map(() => null), status: 'playing' };
  }
}

export function placedText(state: WordPuzzleState): string {
  return state.slots.map((id) => tileText(state, id) ?? '').join('');
}
