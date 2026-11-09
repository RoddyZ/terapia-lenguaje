import { useContext, useSyncExternalStore } from 'react';
import { ServicesContext, type AppServices } from './services';

export function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('useServices debe usarse dentro de <ServicesProvider>.');
  return services;
}

export function useSettings() {
  const { settings } = useServices();
  const value = useSyncExternalStore(settings.subscribe, settings.getSnapshot);
  return [value, settings] as const;
}

export function useProgress() {
  const { progress } = useServices();
  const value = useSyncExternalStore(progress.subscribe, progress.getSnapshot);
  return [value, progress] as const;
}
