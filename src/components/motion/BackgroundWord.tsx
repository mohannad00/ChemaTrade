import { motion, useTransform } from 'motion/react';
import { useI18n } from '@/i18n/I18nProvider';
import { useReducedMotion } from '@/hooks/common';
import { useSectionProgress } from './useSectionProgress';
import styles from './BackgroundWord.module.css';

interface Props {
  text: string;
  /** Which edge the word hugs, and which way it drifts while scrolling. */
  align?: 'start' | 'end';
  place?: 'top' | 'bottom';
}

function Drifting({ text, align = 'start', place = 'top' }: Props) {
  const { dir } = useI18n();
  const { ref, progress } = useSectionProgress<HTMLDivElement>();
  const sign = (dir === 'rtl' ? -1 : 1) * (align === 'start' ? 1 : -1);
  const x = useTransform(progress, [0, 1], [`${12 * sign}%`, `${-12 * sign}%`]);
  return (
    <div ref={ref} className={`${styles.word} ${styles[align]} ${styles[place]}`} aria-hidden="true">
      <motion.span style={{ x }}>{text}</motion.span>
    </div>
  );
}

/** Oversized decorative type behind a section that drifts sideways as you scroll. */
export function BackgroundWord(props: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={`${styles.word} ${styles[props.align ?? 'start']} ${styles[props.place ?? 'top']}`} aria-hidden="true"><span>{props.text}</span></div>;
  return <Drifting {...props} />;
}