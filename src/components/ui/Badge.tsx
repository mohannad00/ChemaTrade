import { cx } from '@/lib/cx';
import { useI18n } from '@/i18n/I18nProvider';
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

/** Shows a status. Pass a raw status value (translated here) or free text via `raw`. */
export function Badge({ children, tone, raw }: { children: string; tone?: 'demo'; raw?: boolean }) {
  const { te } = useI18n();
  const text = tone === 'demo' || raw ? children : te('status', children);
  return <span className={cx(styles.badge, tone === 'demo' ? styles.demo : TONES[children] ?? styles.neutral)}>{text}</span>;
}

export function DemoTag({ children }: { children?: string }) {
  const { t } = useI18n();
  return <Badge tone="demo">{children ?? t('common.demoContent')}</Badge>;
}
