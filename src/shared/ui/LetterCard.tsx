import type { ReactNode } from 'react';
import type { MouthShape } from '@/domain/phonetics';
import type { Tone } from '@/content/types';
import { Mouth } from '../mouth/Mouth';
import styles from './LetterCard.module.css';
import { toneStyle } from './tone';

export interface LetterCardProps {
  shape: MouthShape;
  glyph: ReactNode;
  label: string;
  tone: Tone;
  active?: boolean;
  onClick?: () => void;
  size?: 'md' | 'lg';
}

/**
 * Tarjeta tipo "lámina": boquita + letra, con borde ondulado de color.
 * Es presentacional: quien la usa decide la forma de la boca y la acción.
 */
export function LetterCard({
  shape,
  glyph,
  label,
  tone,
  active,
  onClick,
  size = 'md',
}: LetterCardProps) {
  return (
    <button
      type="button"
      className={[styles.card, styles[size], active && styles.active].filter(Boolean).join(' ')}
      style={toneStyle(tone)}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
    >
      <span className={styles.frame}>
        <Mouth shape={shape} label="" />
      </span>
      <span className={styles.glyph}>{glyph}</span>
    </button>
  );
}
