import styles from './StageRings.module.css';

/** Decorative thin rings with node markers drifting slowly behind the hero figure. */
export function StageRings() {
  return (
    <svg className={styles.rings} viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <g className={styles.slow}>
        <circle cx="300" cy="300" r="285" />
        <circle cx="300" cy="300" r="225" strokeDasharray="3 7" />
        <circle cx="300" cy="15" r="4.5" className={styles.node} />
        <circle cx="498" cy="138" r="3" className={styles.node} />
      </g>
      <g className={styles.fast}>
        <circle cx="300" cy="300" r="170" strokeDasharray="1 5" />
        <circle cx="300" cy="300" r="115" />
        <circle cx="152" cy="385" r="3" className={styles.node} />
        <circle cx="395" cy="415" r="4" className={styles.node} />
      </g>
      <circle cx="300" cy="300" r="3" className={styles.node} />
    </svg>
  );
}
