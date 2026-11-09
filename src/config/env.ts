declare const __APP_VERSION__: string;

export type AppEnv = 'development' | 'staging' | 'production';

const raw = import.meta.env.VITE_APP_ENV as string | undefined;

export const env = {
  appEnv: (raw === 'staging' || raw === 'production' ? raw : 'development') as AppEnv,
  version: typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0',
  appName: 'Boquitas',
} as const;
