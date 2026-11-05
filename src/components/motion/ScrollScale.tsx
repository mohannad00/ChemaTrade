import { motion, useTransform } from 'motion/react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/common';
import { useSectionProgress } from './useSectionProgress';

interface Props {
  children: ReactNode;
  className?: string;
}

function Scaling({ children, className }: Props) {
  const { ref, progress } = useSectionProgress<HTMLDivElement>(['start end', 'start 35%']);
  const scale = useTransform(progress, [0, 1], [0.92, 1]);
  const opacity = useTransform(progress, [0, 0.6], [0.75, 1]);
  return <motion.div ref={ref} className={className} style={{ scale, opacity }}>{children}</motion.div>;
}

/** Grows slightly and fades up as it scrolls into view. */
export function ScrollScale(props: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={props.className}>{props.children}</div>;
  return <Scaling {...props} />;
}