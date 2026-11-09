import type { MouthShape } from '@/domain/phonetics';

/**
 * Convierte un MouthShape en geometría SVG (viewBox 240×160).
 * Función pura: se puede testear y reutilizar (canvas, exportar láminas, etc.).
 */
export const VIEWBOX = { width: 240, height: 160 } as const;

export interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

export interface MouthGeometry {
  upperLip: string;
  lowerLip: string;
  cavity: string;
  lipLine: string;
  upperTeeth: Rect;
  lowerTeeth: Rect;
  toothSeams: number[];
  tongue: Ellipse;
  tongueTip: Ellipse;
  tongueOut: Ellipse;
  highlight: Ellipse;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const r = (n: number) => Math.round(n * 100) / 100;

/** Punto de control para que una cúbica simétrica pase por `midY` en t=0.5. */
const ctrlFor = (midY: number, endY: number) => (midY * 8 - 2 * endY) / 6;

export function computeMouth(s: MouthShape): MouthGeometry {
  const cx = VIEWBOX.width / 2;
  const cy = 80;

  const open = s.open * (1 - s.lipsPressed);
  const iw = lerp(16, 60, s.width); // semiancho interior
  const ow = iw + lerp(12, 17, s.round); // semiancho exterior
  const smile = Math.max(0, s.width - 0.55) * 24;
  const cornerY = cy - smile;

  const ht = open * 18; // apertura hacia arriba
  const hb = open * 28; // apertura hacia abajo (baja la mandíbula)
  const tu = lerp(8, 13, s.round) + s.lipsPressed * 2; // grosor labio superior
  const tl = lerp(11, 16, s.round) + s.lipsPressed * 2; // grosor labio inferior

  const cf = lerp(0.42, 1, s.round); // redondez de las comisuras interiores
  const cfo = lerp(0.62, 1, s.round);

  const cT = ctrlFor(cy - ht, cornerY);
  const cB = ctrlFor(cy + hb, cornerY);

  const L = cx - iw;
  const R = cx + iw;
  const OL = cx - ow;
  const OR = cx + ow;

  const innerTop = `M ${r(L)} ${r(cornerY)} C ${r(cx - iw * cf)} ${r(cT)} ${r(cx + iw * cf)} ${r(cT)} ${r(R)} ${r(cornerY)}`;
  const innerTopReversed = `C ${r(cx + iw * cf)} ${r(cT)} ${r(cx - iw * cf)} ${r(cT)} ${r(L)} ${r(cornerY)}`;
  const innerBottomReversed = `C ${r(cx + iw * cf)} ${r(cB)} ${r(cx - iw * cf)} ${r(cB)} ${r(L)} ${r(cornerY)}`;

  // Labio superior con arco de Cupido.
  const topY = cy - ht - tu;
  const bow = lerp(3.5, 1, s.round);
  const peakY = topY - bow;
  const shoulderY = cornerY + (peakY - cornerY) * 0.6;
  const upperLip = [
    `M ${r(OL)} ${r(cornerY)}`,
    `C ${r(cx - ow * cfo * 0.75)} ${r(shoulderY)} ${r(cx - ow * 0.42)} ${r(peakY)} ${r(cx - ow * 0.22)} ${r(peakY)}`,
    `Q ${r(cx - ow * 0.08)} ${r(peakY)} ${r(cx)} ${r(topY + bow * 0.6)}`,
    `Q ${r(cx + ow * 0.08)} ${r(peakY)} ${r(cx + ow * 0.22)} ${r(peakY)}`,
    `C ${r(cx + ow * 0.42)} ${r(peakY)} ${r(cx + ow * cfo * 0.75)} ${r(shoulderY)} ${r(OR)} ${r(cornerY)}`,
    `L ${r(R)} ${r(cornerY)}`,
    innerTopReversed,
    'Z',
  ].join(' ');

  const bottomY = cy + hb + tl;
  const cOB = ctrlFor(bottomY, cornerY);
  const lowerLip = [
    `M ${r(OL)} ${r(cornerY)}`,
    `C ${r(cx - ow * cfo)} ${r(cOB)} ${r(cx + ow * cfo)} ${r(cOB)} ${r(OR)} ${r(cornerY)}`,
    `L ${r(R)} ${r(cornerY)}`,
    innerBottomReversed,
    'Z',
  ].join(' ');

  const cavity = `${innerTop} ${innerBottomReversed} Z`;

  const upperTeethH = s.upperTeeth * 12;
  const lowerTeethH = s.lowerTeeth * 11;
  const seamStep = Math.max(8, iw * 0.24);
  const toothSeams: number[] = [];
  for (let x = seamStep / 2; x < iw; x += seamStep) toothSeams.push(r(cx - x), r(cx + x));

  return {
    upperLip,
    lowerLip,
    cavity,
    lipLine: innerTop,
    upperTeeth: {
      x: r(L),
      y: r(cy - ht - 24),
      width: r(iw * 2),
      height: r(24 + upperTeethH),
      opacity: clamp01(s.upperTeeth * 3),
    },
    lowerTeeth: {
      x: r(L),
      y: r(cy + hb - lowerTeethH),
      width: r(iw * 2),
      height: r(lowerTeethH + 24),
      opacity: clamp01(s.lowerTeeth * 3),
    },
    toothSeams,
    tongue: {
      cx,
      cy: r(cy + hb + 2),
      rx: r(iw * 0.72),
      ry: r(lerp(2, hb * 0.85 + 4, s.tongue)),
      opacity: clamp01(s.tongue * 3),
    },
    // Punta de la lengua apoyada justo detrás de los dientes superiores.
    tongueTip: {
      cx,
      cy: r(cy - ht + upperTeethH * 0.6 + (ht + hb) * 0.42 * s.tongueTip),
      rx: r(Math.max(7, iw * 0.32)),
      ry: r((ht + hb) * 0.42 * s.tongueTip),
      opacity: clamp01(s.tongueTip * 3),
    },
    tongueOut: {
      cx,
      cy: r(cy + 2 + hb * 0.4),
      rx: r(lerp(8, 16, s.tongueOut)),
      ry: r(9 * s.tongueOut),
      opacity: clamp01(s.tongueOut * 2),
    },
    highlight: {
      cx: r(cx - ow * 0.12),
      cy: r(cy + hb + tl * 0.45),
      rx: r(ow * 0.32),
      ry: 2.6,
      opacity: 0.35,
    },
  };
}
