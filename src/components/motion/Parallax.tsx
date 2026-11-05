import { motion, useTransform } from 'motion/react';
import type { ReactNode } from 'react';
import { useMediaQuery, useReducedMotion } from '@/hooks/common';
import { useSectionProgress } from './useSectionProgress';

interface Props {
  children: ReactNode;
  /** Pixels travelled in each direction while the element crosses the viewport. */
  distance?: number;
  className?: string;
  /** Stretch to the parent's height (for grid items). */
  fill?: boolean;
}

function ParallaxInner({ children, distance = 40, className, fill }: Props) {
  const narrow = useMediaQuery('(max-width: 767px)');
  const { ref, progress } = useSectionProgress<HTMLDivElement>();
  const d = narrow ? distance * 0.5 : distance;
  const y = useTransform(progress, [0, 1], [d, -d]);
  return (
    <motion.div ref={ref} className={className} style={{ y, height: fill ? '100%' : undefined }}>
      {children}
    </motion.div>
  );
}

/** Moves its content vertically against the scroll, so layers travel at different speeds. */
export function Parallax(props: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={props.className} style={{ height: props.fill ? '100%' : undefined }}>{props.children}</div>;
  return <ParallaxInner {...props} />;
}