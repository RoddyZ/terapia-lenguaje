import { useState } from 'react';
import { RouterProvider } from 'react-router';
import type { AppServices } from '@/shared/di/services';
import { createServices } from './composition';
import { createAppRouter } from './router';
import { ServicesProvider } from './ServicesProvider';

export function App({ services }: { services?: AppServices }) {
  const [deps] = useState(() => services ?? createServices());
  const [router] = useState(createAppRouter);

  return (
    <ServicesProvider services={deps}>
      <RouterProvider router={router} />
    </ServicesProvider>
  );
}
