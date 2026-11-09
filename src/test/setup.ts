import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { MotionGlobalConfig } from 'motion/react';

afterEach(() => cleanup());

// happy-dom puede no implementar matchMedia (usado para prefers-reduced-motion).
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Las animaciones de UI (motion) no aportan nada en tests y happy-dom
// rechaza las cancelaciones de Web Animations.
MotionGlobalConfig.skipAnimations = true;
