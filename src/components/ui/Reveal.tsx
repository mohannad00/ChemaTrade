import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useMediaQuery, useReducedMotion } from '@/hooks/common';
import { useI18n } from '@/i18n/I18nProvider';

type Variant = 'up' | 'start' | 'end' | 'scale';

interface Props {
  children: ReactNode;
  /** `start` / `end` slide in from the inline start/end side, so they mirror in RTL. */
  variant?: Variant;
  delay?: number;
  className?: string;
  /** Stretch to the parent's height (for grid items). */
  fill?: boolean;
  /** Play on mount instead of when scrolled into view. */
  onMount?: boolean;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fades content in from a direction. Renders instantly when motion is reduced. */
export function Reveal({ children, variant = 'up', delay = 0, className, fill, onMount }: Props) {
  const reduced = useReducedMotion();
  const { dir } = useI18n();
  const narrow = useMediaQuery('(max-width: 767px)');
  const style = fill ? { height: '100%' } : undefined;
  if (reduced) return <div className={className} style={style}>{children}</div>;

  const reach = narrow ? 24 : 56;
  const side = dir === 'rtl' ? 1 : -1;
  const from =
    variant === 'start' ? { x: reach * side, y: 12 }
    : variant === 'end' ? { x: -reach * side, y: 12 }
    : variant === 'scale' ? { scale: 0.9, y: 28 }
    : { y: 30 };
  const to = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, ...from }}
      {...(onMount ? { animate: to } : { whileInView: to, viewport: { once: true, margin: '-10% 0px' } })}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}