import { createHashRouter, type RouteObject } from 'react-router';
import { AppShell } from './layout/AppShell';
import { RouteError } from './layout/RouteError';

/**
 * Hash router: funciona en GitHub Pages sin configuración de servidor.
 * Cada feature se carga de forma diferida (code splitting).
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, lazy: () => import('@/features/home/route') },
      { path: 'vocales', lazy: () => import('@/features/vowels/route') },
      { path: 'abecedario', lazy: () => import('@/features/alphabet/route') },
      { path: 'abecedario/:letterId', lazy: () => import('@/features/alphabet/letterRoute') },
      { path: 'silabas', lazy: () => import('@/features/syllables/route') },
      { path: 'palabras', lazy: () => import('@/features/words/route') },
      { path: 'ajustes', lazy: () => import('@/features/settings/route') },
    ],
  },
];

export const createAppRouter = () => createHashRouter(routes);
