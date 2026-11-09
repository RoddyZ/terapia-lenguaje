import { createQuiz } from './quiz';
import { seededRng, shuffle } from './random';
import {
  createWordPuzzle,
  placedText,
  wordPuzzleReducer,
  type WordPuzzleState,
} from './wordPuzzle';

describe('shuffle', () => {
  it('no muta y conserva elementos', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seededRng(1));
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual(input);
  });
});

describe('createQuiz', () => {
  it('incluye siempre la respuesta y no repite respuestas seguidas', () => {
    const quiz = createQuiz(['a', 'e', 'i', 'o', 'u'], 20, 3, seededRng(7));
    quiz.forEach((round, i) => {
      expect(round.options).toContain(round.answer);
      expect(new Set(round.options).size).toBe(3);
      if (i > 0) expect(round.answer).not.toBe(quiz[i - 1]!.answer);
    });
  });
});

describe('wordPuzzle', () => {
  const idOf = (state: WordPuzzleState, text: string) =>
    state.tiles.find((t) => t.text === text)!.id;

  it('se resuelve colocando las sílabas en orden', () => {
    let s = createWordPuzzle(['pe', 'rro'], ['ma'], seededRng(3));
    s = wordPuzzleReducer(s, { type: 'place', tileId: idOf(s, 'pe') });
    expect(s.status).toBe('playing');
    s = wordPuzzleReducer(s, { type: 'place', tileId: idOf(s, 'rro') });
    expect(s.status).toBe('solved');
    expect(placedText(s)).toBe('perro');
  });

  it('cuenta errores y permite reintentar', () => {
    let s = createWordPuzzle(['ca', 'sa'], [], seededRng(3));
    s = wordPuzzleReducer(s, { type: 'place', tileId: idOf(s, 'sa') });
    s = wordPuzzleReducer(s, { type: 'place', tileId: idOf(s, 'ca') });
    expect(s).toMatchObject({ status: 'wrong', mistakes: 1 });
    s = wordPuzzleReducer(s, { type: 'retry' });
    expect(s.slots).toEqual([null, null]);
  });

  it('acepta sílabas repetidas en cualquier orden (ma-ma)', () => {
    let s = createWordPuzzle(['ma', 'ma'], [], seededRng(1));
    s = wordPuzzleReducer(s, { type: 'place', tileId: s.tiles[0]!.id });
    s = wordPuzzleReducer(s, { type: 'place', tileId: s.tiles[1]!.id });
    expect(s.status).toBe('solved');
  });

  it('ignora fichas ya colocadas', () => {
    let s = createWordPuzzle(['so', 'l'], [], seededRng(1));
    const id = s.tiles[0]!.id;
    s = wordPuzzleReducer(s, { type: 'place', tileId: id });
    const again = wordPuzzleReducer(s, { type: 'place', tileId: id });
    expect(again).toBe(s);
  });
});
