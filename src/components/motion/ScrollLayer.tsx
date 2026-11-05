import { motion, useTransform } from 'motion/react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/common';
import { useSectionProgress } from './useSectionProgress';

type Range = readonly [number, number];

interface Props {
  children: ReactNode;
  className?: string;
  /** Vertical travel in px from the start to the end of the scroll range. */
  y?: Range;
  scale?: Range;
  opacity?: Range;
}

const HERO_RANGE = ['start start', 'end start'] as const;

function Layer({ children, className, y = [0, 0], scale = [1, 1], opacity = [1, 1] }: Props) {
  const { ref, progress } = useSectionProgress<HTMLDivElement>([...HERO_RANGE]);
  const ty = useTransform(progress, [0, 1], [...y]);
  const s = useTransform(progress, [0, 1], [...scale]);
  const o = useTransform(progress, [0, 0.85], [...opacity]);
  return <motion.div ref={ref} className={className} style={{ y: ty, scale: s, opacity: o }}>{children}</motion.div>;
}

/** Moves, scales and fades its content as the page scrolls away from the top (used for the hero layers). */
export function ScrollLayer(props: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={props.className}>{props.children}</div>;
  return <Layer {...props} />;
}