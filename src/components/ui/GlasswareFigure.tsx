import { motion } from 'motion/react';
import { useId, useRef } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { useReducedMotion } from '@/hooks/common';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './GlasswareFigure.module.css';

interface Stroke {
  d: string;
  dashed?: boolean;
}

const OUTLINES: Stroke[] = [
  { d: 'M10 160 H510' },
  { d: 'M34 60 H126' },
  { d: 'M40 60 V160 H120 V60' },
  { d: 'M40 82 H54 M40 104 H54 M40 126 H54 M40 148 H54' },
  { d: 'M199 30 H241 M205 30 V70 L165 160 H275 L235 70 V30' },
  { d: 'M306 52 H334 M310 52 V140 A10 10 0 0 0 330 140 V52' },
  { d: 'M340 52 H368 M344 52 V140 A10 10 0 0 0 364 140 V52' },
  { d: 'M374 52 H402 M378 52 V140 A10 10 0 0 0 398 140 V52' },
  { d: 'M434 52 H466 M440 52 V96 M460 52 V96 M440 96 A32 32 0 1 0 460 96' },
  { d: 'M220 20 V170', dashed: true },
  { d: 'M40 24 H270 M40 18 V30 M270 18 V30' },
];

interface Vessel {
  /** Closed shape of the inside of the glass; the liquid is clipped to it. */
  clip: string;
  left: number;
  width: number;
  /** Resting liquid surface (y). */
  level: number;
  /** Where bubbles start (y). */
  floor: number;
  bubbles: number[];
}

const VESSELS: Vessel[] = [
  { clip: 'M40 60 V160 H120 V60 Z', left: 40, width: 80, level: 112, floor: 156, bubbles: [56, 76, 96, 109] },
  { clip: 'M205 70 L165 160 H275 L235 70 Z', left: 165, width: 110, level: 132, floor: 156, bubbles: [196, 220, 244] },
  { clip: 'M310 52 V140 A10 10 0 0 0 330 140 V52 Z', left: 310, width: 20, level: 100, floor: 146, bubbles: [320] },
  { clip: 'M344 52 V140 A10 10 0 0 0 364 140 V52 Z', left: 344, width: 20, level: 92, floor: 146, bubbles: [354] },
  { clip: 'M378 52 V140 A10 10 0 0 0 398 140 V52 Z', left: 378, width: 20, level: 106, floor: 146, bubbles: [388] },
  { clip: 'M440 52 V96 A32 32 0 1 0 460 96 V52 Z', left: 418, width: 64, level: 130, floor: 150, bubbles: [440, 452, 462] },
];

const SLOW = 40;
const FAST = 20;

/** Repeating wave of horizontal period `period`; shifting it by exactly one period loops seamlessly. */
function wavePath(width: number, period: number, amp: number): string {
  const count = Math.ceil((width + period * 2) / period);
  let d = 'M0 0';
  for (let i = 0; i < count; i += 1) d += ` q${period / 4} ${-amp} ${period / 2} 0 t${period / 2} 0`;
  return `${d} V70 H0 Z`;
}

function bubbleStyle(i: number, rise: number, extra: number): CSSProperties {
  const dur = 2.6 + ((i * 7 + extra) % 5) * 0.55;
  const delay = -(((i * 13 + extra * 3) % 9) * 0.45);
  const drift = ((i + extra) % 2 === 0 ? 1 : -1) * (1.5 + (i % 3));
  return { '--dur': `${dur}s`, '--delay': `${delay}s`, '--rise': `${-rise}px`, '--drift': `${drift}px` } as CSSProperties;
}

/**
 * Schematic glassware that draws itself, then keeps moving: liquid waves, rising bubbles and a scan line.
 * Hovering adds sloshing that follows the pointer, extra bubbles, thicker lines and a faster scan.
 * All motion is disabled under `prefers-reduced-motion`.
 */
export function GlasswareFigure() {
  const reduced = useReducedMotion();
  const { t } = useI18n();
  const uid = useId().replace(/:/g, '');
  const ref = useRef<HTMLElement>(null);

  const track = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    const px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    el.style.setProperty('--px', px.toFixed(3));
  };
  const release = () => ref.current?.style.setProperty('--px', '0');

  return (
    <figure ref={ref} className={styles.figure} onPointerMove={track} onPointerLeave={release}>
      <svg viewBox="0 0 520 190" role="img" aria-label={t('fig.aria')} className={styles.svg}>
        <defs>
          {VESSELS.map((v, i) => (
            <clipPath id={`${uid}-c${i}`} key={i}>
              <path d={v.clip} />
            </clipPath>
          ))}
        </defs>

        <g className={styles.liquid} aria-hidden="true">
          {VESSELS.map((v, i) => {
            const cx = v.left + v.width / 2;
            const rise = v.floor - v.level - 4;
            return (
              <g key={i} clipPath={`url(#${uid}-c${i})`}>
                <g transform={`translate(${cx} ${v.level})`}>
                  <g className={styles.slosh} style={{ '--sway': `${4 + (i % 3)}s` } as CSSProperties}>
                    <g transform={`translate(${-cx} 0)`}>
                      <g transform={`translate(${v.left - SLOW} 0)`}>
                        <path className={styles.waveBack} d={wavePath(v.width, SLOW, 4)} />
                        <path className={styles.waveFront} d={wavePath(v.width, SLOW, 3)} />
                      </g>
                      <g transform={`translate(${v.left - FAST} 0)`}>
                        <path className={styles.waveFast} d={wavePath(v.width, FAST, 4.5)} />
                      </g>
                      <g>
                        {v.bubbles.map((bx, b) => (
                          <circle key={`a${b}`} className={styles.bubble} cx={bx} cy={v.floor - v.level} r={1.3 + ((b + i) % 3) * 0.5} style={bubbleStyle(b + i, rise, 0)} />
                        ))}
                      </g>
                      <g className={styles.bubblesHover}>
                        {v.bubbles.map((bx, b) => (
                          <circle key={`h${b}`} className={styles.bubble} cx={bx + 5 * (b % 2 ? 1 : -1)} cy={v.floor - v.level} r={1.1 + ((b + i) % 2) * 0.6} style={bubbleStyle(b + i, rise, 3)} />
                        ))}
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            );
          })}
        </g>

        <g className={styles.lines}>
          {OUTLINES.map((s, i) => (
            <motion.path
              key={s.d}
              d={s.d}
              strokeDasharray={s.dashed ? '4 5' : undefined}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.3, delay: 0.5 + i * 0.12, ease: [0.45, 0, 0.2, 1] }}
            />
          ))}
        </g>

        <g className={styles.scans} aria-hidden="true">
          <line className={styles.scan} x1="0" x2="0" y1="18" y2="172" />
          <line className={styles.scanFast} x1="0" x2="0" y1="18" y2="172" />
        </g>

        <motion.text x="260" y="14" textAnchor="middle" className={styles.label} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 0.6 }}>
          {t('fig.label')}
        </motion.text>
      </svg>
      <figcaption>{t('fig.caption')}</figcaption>
    </figure>
  );
}
