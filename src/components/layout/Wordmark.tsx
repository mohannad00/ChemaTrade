import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { useReducedMotion } from '@/hooks/common';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './Wordmark.module.css';

const WORDS: Record<'en' | 'ar', [string, string]> = { en: ['Chema', 'Trade'], ar: ['كيما', 'تريد'] };

/** Logo mark + animated wordmark. Latin letters rise in sequence; Arabic words rise as units so letters stay joined. */
export function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  const reduced = useReducedMotion();
  const { lang, t } = useI18n();
  const [first, second] = WORDS[lang];
  const parts: { text: string; sub: boolean }[] =
    lang === 'en'
      ? [...first.split('').map((c) => ({ text: c, sub: false })), { text: ' ', sub: false }, ...second.split('').map((c) => ({ text: c, sub: true }))]
      : [{ text: first, sub: false }, { text: ' ', sub: false }, { text: second, sub: true }];

  return (
    <Link to="/" className={styles.mark} aria-label={t('header.homeLabel')} onClick={onNavigate}>
      <motion.span className={styles.logoWrap} aria-hidden="true" initial={reduced ? false : { scale: 0.5, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <Logo size={44} animated={!reduced} />
      </motion.span>
      <span className={styles.text} aria-hidden="true">
        <span className={styles.letters} key={lang}>
          {parts.map((p, i) =>
            p.text === ' ' ? (
              <span key={i} className={styles.space} />
            ) : (
              <span key={i} className={styles.clip}>
                <motion.span
                  className={p.sub ? styles.sub : undefined}
                  style={{ display: 'inline-block' }}
                  initial={reduced ? false : { y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.7, delay: 0.15 + i * (lang === 'en' ? 0.045 : 0.2), ease: [0.22, 1, 0.36, 1] }}
                >
                  {p.text}
                </motion.span>
              </span>
            ),
          )}
        </span>
        <motion.span className={styles.rule} initial={reduced ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />
      </span>
    </Link>
  );
}
