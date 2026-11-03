import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/common';
import styles from './Wordmark.module.css';

const WORD = 'Chema';
const SUB = 'Trade';

/** Animated wordmark: letters rise in sequence on load; the rule draws beneath. */
export function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  const reduced = useReducedMotion();
  const letters = [...WORD.split(''), ' ', ...SUB.split('')];
  return (
    <Link to="/" className={styles.mark} aria-label="Chema Trade — home" onClick={onNavigate}>
      <span className={styles.letters} aria-hidden="true">
        {letters.map((ch, i) =>
          ch === ' ' ? (
            <span key={i} className={styles.space} />
          ) : (
            <span key={i} className={styles.clip}>
              <motion.span
                className={i > WORD.length ? styles.sub : undefined}
                style={{ display: 'inline-block' }}
                initial={reduced ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.045, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            </span>
          ),
        )}
      </span>
      <motion.span
        className={styles.rule}
        aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      />
    </Link>
  );
}
