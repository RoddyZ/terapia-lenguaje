import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { createTestServices } from '@/app/composition';
import { routes } from '@/app/router';
import { ServicesProvider } from '@/app/ServicesProvider';

/** Renderiza un componente con servicios en memoria (sin voz ni localStorage). */
export function renderWithServices(ui: ReactElement) {
  const services = createTestServices();
  const result = render(<ServicesProvider services={services}>{ui}</ServicesProvider>);
  return { ...result, services };
}

/** Renderiza la app completa en una ruta concreta. */
export function renderRoute(path: string) {
  const services = createTestServices();
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const result = render(
    <ServicesProvider services={services}>
      <RouterProvider router={router} />
    </ServicesProvider>,
  );
  return { ...result, services, router };
}
