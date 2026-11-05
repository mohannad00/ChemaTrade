import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/common';
import { Reveal } from '@/components/ui/Reveal';
import styles from './SectionHead.module.css';

interface Props {
  eyebrow: string;
  title: string;
  lede: ReactNode;
  titleId: string;
  eyebrowClassName?: string;
  ledeClassName?: string;
}

const WORDS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const WORD = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/** Eyebrow, heading and lede that enter in sequence; the heading rises word by word. */
export function SectionHead({ eyebrow, title, lede, titleId, eyebrowClassName, ledeClassName }: Props) {
  const reduced = useReducedMotion();
  const words = title.split(' ');
  return (
    <div>
      <Reveal><p className={`eyebrow bar ${eyebrowClassName ?? ''}`}>{eyebrow}</p></Reveal>
      {reduced ? (
        <h2 id={titleId}>{title}</h2>
      ) : (
        <motion.h2 id={titleId} variants={WORDS} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-12% 0px' }}>
          {words.map((w, i) => (
            <span key={i}>
              <span className={styles.clip}><motion.span className={styles.word} variants={WORD}>{w}</motion.span></span>
              {i < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </motion.h2>
      )}
      <Reveal delay={0.2}><p className={`lede ${ledeClassName ?? ''}`}>{lede}</p></Reveal>
    </div>
  );
}