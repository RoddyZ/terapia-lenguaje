import type { CSSProperties } from 'react';
import type { Tone } from '@/content/types';

/** Variables CSS --tone / --tone-soft para un color de la paleta. */
export function toneStyle(tone: Tone): CSSProperties {
  return {
    '--tone': `var(--tone-${tone})`,
    '--tone-soft': `var(--tone-${tone}-soft)`,
  } as CSSProperties;
}
