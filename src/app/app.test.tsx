import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderRoute } from '@/test/renderWithServices';

describe('navegación', () => {
  it('muestra las cuatro actividades en el inicio', async () => {
    renderRoute('/');
    for (const name of ['Vocales', 'Abecedario', 'Sílabas', 'Palabras']) {
      expect(await screen.findByRole('link', { name: new RegExp(name) })).toBeInTheDocument();
    }
  });

  it('las vocales hablan al tocarlas', async () => {
    const { services } = renderRoute('/vocales');
    await userEvent.click(await screen.findByRole('button', { name: /Vocal a\./ }));
    expect(services.speech.spoken).toContain('a');
  });

  it('abre la ficha de una letra desde el abecedario', async () => {
    renderRoute('/abecedario');
    await userEvent.click(await screen.findByRole('button', { name: 'Letra eme' }));
    expect(await screen.findByRole('heading', { name: 'Letra M' })).toBeInTheDocument();
  });

  it('el constructor de sílabas compone y pronuncia', async () => {
    const { services } = renderRoute('/silabas');
    await userEvent.click(await screen.findByRole('button', { name: 'p' }));
    await userEvent.click(screen.getByRole('button', { name: 'o' }));
    await userEvent.click(screen.getByRole('button', { name: /Escuchar/ }));
    expect(services.speech.spoken).toContain('po');
  });
});
