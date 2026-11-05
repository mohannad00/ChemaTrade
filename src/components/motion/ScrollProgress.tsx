import { motion, useScroll, useSpring } from 'motion/react';
import { useReducedMotion } from '@/hooks/common';
import styles from './ScrollProgress.module.css';

function Bar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });
  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden="true" />;
}

/** Thin page-scroll indicator at the very top of the viewport. */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  return reduced ? null : <Bar />;
}