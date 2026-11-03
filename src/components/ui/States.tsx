import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import styles from './States.module.css';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className={styles.state} role="status" aria-live="polite">
      <Loader2 className={styles.spin} aria-hidden="true" />
      <p className="mono">{label}</p>
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className={styles.state}>
      <Inbox aria-hidden="true" />
      <h3>{title}</h3>
      {children && <p className={styles.text}>{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className={styles.state} role="alert">
      <AlertTriangle aria-hidden="true" />
      <h3>Something went wrong</h3>
      <p className={styles.text}>{message ?? 'The data could not be loaded.'}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function Notice({ children, title, tone = 'info' }: { children: ReactNode; title?: string; tone?: 'info' | 'demo' }) {
  return (
    <aside className={`${styles.notice} ${tone === 'demo' ? styles.noticeDemo : ''}`} role="note">
      {title && <strong className="eyebrow">{title}</strong>}
      <p>{children}</p>
    </aside>
  );
}
