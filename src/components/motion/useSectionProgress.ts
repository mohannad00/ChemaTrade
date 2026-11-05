import { useRef } from 'react';
import { useScroll, useSpring, type UseScrollOptions } from 'motion/react';

type Offset = NonNullable<UseScrollOptions['offset']>;
const THROUGH_VIEWPORT: Offset = ['start end', 'end start'];

/** Scroll progress (0 to 1) of an element crossing the viewport, eased by a spring so movement glides. */
export function useSectionProgress<T extends HTMLElement>(offset: Offset = THROUGH_VIEWPORT) {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });
  return { ref, progress };
}