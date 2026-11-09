import { useId } from 'react';
import type { MouthShape } from '@/domain/phonetics';
import { computeMouth, VIEWBOX, type Ellipse, type Rect } from './geometry';
import styles from './Mouth.module.css';

export interface MouthProps {
  shape: MouthShape;
  /** Texto accesible que describe la boca. Vacío = decorativa (aria-hidden). */
  label: string;
  className?: string;
  /** Estilo del marco: lámina (con fondo de piel) o limpio. */
  framed?: boolean;
}

/**
 * Boquita ilustrada en SVG. Es un componente "tonto": dibuja la forma recibida.
 * La animación la gestiona useMouthAnimation.
 */
export function Mouth({ shape, label, className, framed = true }: MouthProps) {
  const id = useId().replace(/:/g, '');
  const g = computeMouth(shape);
  const clip = `cavity-${id}`;
  const skin = `skin-${id}`;
  const lip = `lip-${id}`;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={[styles.mouth, framed && styles.framed, className].filter(Boolean).join(' ')}
    >
      <defs>
        <radialGradient id={skin} cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="var(--mouth-skin-light)" />
          <stop offset="100%" stopColor="var(--mouth-skin)" />
        </radialGradient>
        <linearGradient id={lip} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--mouth-lip-dark)" />
          <stop offset="100%" stopColor="var(--mouth-lip)" />
        </linearGradient>
        <clipPath id={clip}>
          <path d={g.cavity} />
        </clipPath>
      </defs>

      {framed && (
        <rect width={VIEWBOX.width} height={VIEWBOX.height} rx="22" fill={`url(#${skin})`} />
      )}

      <path d={g.cavity} fill="var(--mouth-cavity)" />
      <g clipPath={`url(#${clip})`}>
        <ellipse {...ellipse(g.tongue)} fill="var(--mouth-tongue)" />
        <Teeth row={g.upperTeeth} seams={g.toothSeams} />
        <ellipse {...ellipse(g.tongueTip)} fill="var(--mouth-tongue-light)" />
        <Teeth row={g.lowerTeeth} seams={g.toothSeams} />
      </g>

      <path d={g.upperLip} fill={`url(#${lip})`} />
      <path d={g.lowerLip} fill="var(--mouth-lip)" />
      <path
        d={g.lipLine}
        fill="none"
        stroke="var(--mouth-lip-line)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <ellipse {...ellipse(g.highlight)} fill="#fff" />
      <ellipse {...ellipse(g.tongueOut)} fill="var(--mouth-tongue)" />
    </svg>
  );
}

/** Fila de dientes con separaciones limitadas a su propia altura. */
function Teeth({ row, seams }: { row: Rect; seams: readonly number[] }) {
  if (row.opacity <= 0) return null;
  return (
    <g opacity={row.opacity}>
      <rect
        x={row.x}
        y={row.y}
        width={row.width}
        height={row.height}
        rx="4"
        fill="var(--mouth-teeth)"
      />
      <g stroke="var(--mouth-teeth-seam)" strokeWidth="1.2">
        {seams.map((x) => (
          <line key={x} x1={x} x2={x} y1={row.y} y2={row.y + row.height} />
        ))}
      </g>
    </g>
  );
}

const ellipse = ({ cx, cy, rx, ry, opacity }: Ellipse) => ({
  cx,
  cy,
  rx,
  ry: Math.max(0, ry),
  opacity,
});
