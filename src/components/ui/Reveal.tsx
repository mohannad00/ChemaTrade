import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/common';

/** Fades and lifts content into view once. Renders instantly when motion is reduced. */
export function Reveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <div>{children}</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12% 0px' }} transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
