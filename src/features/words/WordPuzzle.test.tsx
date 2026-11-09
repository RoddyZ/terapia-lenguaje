import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithServices } from '@/test/renderWithServices';
import { WordPuzzle } from './WordPuzzle';

const word = { id: 'casa', text: 'casa', syllables: ['ca', 'sa'], emoji: '🏠', level: 1 as const };

describe('WordPuzzle', () => {
  it('resuelve la palabra y registra progreso', async () => {
    const onNext = vi.fn();
    const { services } = renderWithServices(
      <WordPuzzle word={word} distractorPool={[]} distractors={0} onNext={onNext} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'ca' }));
    await userEvent.click(screen.getByRole('button', { name: 'sa' }));

    expect(await screen.findByRole('button', { name: /Siguiente/ })).toBeInTheDocument();
    expect(services.progress.getSnapshot().activities.words?.casa?.successes).toBe(1);
    expect(services.speech.spoken.at(-1)).toBe('casa');

    await userEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
    expect(onNext).toHaveBeenCalled();
  });
});
