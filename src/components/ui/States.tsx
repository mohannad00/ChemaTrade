import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from './Button';
import styles from './States.module.css';

export function LoadingState({ label }: { label?: string }) {
  const { t } = useI18n();
  return (
    <div className={styles.state} role="status" aria-live="polite">
      <Loader2 className={styles.spin} aria-hidden="true" />
      <p>{label ?? t('common.loading')}</p>
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
  const { t } = useI18n();
  return (
    <div className={styles.state} role="alert">
      <AlertTriangle aria-hidden="true" />
      <h3>{t('common.errorTitle')}</h3>
      <p className={styles.text}>{message ?? t('common.errorDefault')}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>{t('common.tryAgain')}</Button>}
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
