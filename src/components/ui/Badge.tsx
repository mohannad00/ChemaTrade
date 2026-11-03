import { cx } from '@/lib/cx';
import styles from './Badge.module.css';

const TONES: Record<string, string> = {
  Available: styles.ok,
  'Request a Quote': styles.accent,
  'Sourcing on Request': styles.neutral,
  New: styles.accent,
  'In Review': styles.neutral,
  Quoted: styles.ok,
  Scheduled: styles.ok,
  Completed: styles.ok,
  Closed: styles.muted,
  Cancelled: styles.muted,
  Draft: styles.neutral,
  Published: styles.ok,
  Urgent: styles.danger,
  Soon: styles.neutral,
  Routine: styles.muted,
};

export function Badge({ children, tone }: { children: string; tone?: 'demo' }) {
  return <span className={cx(styles.badge, tone === 'demo' ? styles.demo : TONES[children] ?? styles.neutral)}>{children}</span>;
}

export function DemoTag({ children = 'Demo content' }: { children?: string }) {
  return <Badge tone="demo">{children}</Badge>;
}
