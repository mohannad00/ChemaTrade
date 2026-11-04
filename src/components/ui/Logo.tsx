import { useId } from 'react';
import styles from './Logo.module.css';

interface Props {
  size?: number;
  /** Plays the liquid + bubble animation. Off for static uses (favicon, reduced motion). */
  animated?: boolean;
  className?: string;
}

/**
 * Chema Trade mark: a laboratory conical flask (chemistry) whose liquid surface rises as a trade-growth
 * arrow (trade), on a rounded coral tile. Drawn with plain SVG so it scales and follows the theme.
 */
export function Logo({ size = 44, animated = true, className }: Props) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      className={`${styles.logo} ${animated ? styles.animated : ''} ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-tile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF7A57" />
          <stop offset="1" stopColor="#E8421F" />
        </linearGradient>
        <clipPath id={`${uid}-glass`}>
          <path d="M26 14h12v13.5L47.5 47a4.2 4.2 0 0 1-3.8 6H20.3a4.2 4.2 0 0 1-3.8-6L26 27.5z" />
        </clipPath>
      </defs>

      <rect className={styles.tile} x="2" y="2" width="60" height="60" rx="17" fill={`url(#${uid}-tile)`} />
      <rect x="2.75" y="2.75" width="58.5" height="58.5" rx="16.3" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.5" />

      <g clipPath={`url(#${uid}-glass)`}>
        <g className={styles.liquid}>
          <path className={styles.waveBack} d="M-8 40q6-3.2 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0V70H-8z" fill="#fff" fillOpacity="0.35" />
          <path className={styles.waveFront} d="M-8 42q6-3.2 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0V70H-8z" fill="#fff" fillOpacity="0.9" />
        </g>
        <circle className={`${styles.bubble} ${styles.b1}`} cx="28" cy="48" r="1.7" fill="#fff" />
        <circle className={`${styles.bubble} ${styles.b2}`} cx="35.5" cy="49" r="1.2" fill="#fff" />
      </g>

      <path d="M26 14h12v13.5L47.5 47a4.2 4.2 0 0 1-3.8 6H20.3a4.2 4.2 0 0 1-3.8-6L26 27.5z" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <path d="M23.5 14h17" stroke="#fff" strokeWidth="3" strokeLinecap="round" />

      <g className={styles.arrow}>
        <path d="M30 37.5l5.2-5.2 3.4 3.4 6.3-6.6" fill="none" stroke="#0E3A3D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40.6 29.1h4.3v4.3" fill="none" stroke="#0E3A3D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
