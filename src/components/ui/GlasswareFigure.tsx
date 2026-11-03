import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/common';
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
  { d: 'M40 112 Q60 106 80 112 T120 112' },
  { d: 'M199 30 H241 M205 30 V70 L165 160 H275 L235 70 V30' },
  { d: 'M178 132 Q220 122 262 132' },
  { d: 'M306 52 H334 M310 52 V140 A10 10 0 0 0 330 140 V52' },
  { d: 'M340 52 H368 M344 52 V140 A10 10 0 0 0 364 140 V52' },
  { d: 'M374 52 H402 M378 52 V140 A10 10 0 0 0 398 140 V52' },
  { d: 'M434 52 H466 M440 52 V96 M460 52 V96 M440 96 A32 32 0 1 0 460 96' },
  { d: 'M220 20 V170', dashed: true },
  { d: 'M40 24 H270 M40 18 V30 M270 18 V30' },
];

/** A schematic glassware drawing that draws itself on load (static when motion is reduced). */
export function GlasswareFigure() {
  const reduced = useReducedMotion();
  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 520 190" role="img" aria-label="Line drawing of laboratory glassware: a beaker, a conical flask, three test tubes and a round-bottom flask">
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
        <motion.text x="155" y="16" className={styles.label} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 0.6 }}>
          schematic · not to scale
        </motion.text>
      </svg>
      <figcaption className="mono">Fig. 01 — Glassware, schematic line drawing</figcaption>
    </figure>
  );
}
