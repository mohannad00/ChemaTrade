import { Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { useLocalizedList } from '@/i18n/useLocalized';
import { services } from '@/services';
import styles from './MaintenancePages.module.css';

export function MaintenancePage() {
  const { t } = useI18n();
  useDocumentTitle(t('maint.eyebrow'));
  const q = useQuery(() => services.maintenance.listServices(), []);
  const list = useLocalizedList(q.data);
  return (
    <>
      <PageHeader eyebrow={t('maint.eyebrow')} title={t('maint.title')} lede={t('maint.lede')} demoTag actions={<Button to="/request-maintenance">{t('nav.requestMaintenance')}</Button>} />
      <div className={`container ${styles.wrap}`}>
        {q.status === 'loading' && <LoadingState />}
        {q.status === 'error' && <ErrorState message={q.error.message} onRetry={q.retry} />}
        {list && (
          <ol className={`${styles.list} stagger`}>
            {list.map((s, i) => (
              <li key={s.id} className={styles.row} data-glow>
                <span className={`mono ${styles.num}`}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{s.title}</h2>
                  <p className={styles.sum}>{s.summary}</p>
                </div>
                <ul className={styles.points}>
                  {s.points.map((p) => <li key={p}><Check aria-hidden="true" />{p}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        )}
        <Notice tone="demo" title={t('maint.noticeTitle')}>{t('maint.notice')}</Notice>
      </div>
    </>
  );
}

export function SparePartsPage() {
  const { t } = useI18n();
  useDocumentTitle(t('parts.eyebrow'));
  const q = useQuery(() => services.maintenance.listSparePartGroups(), []);
  const list = useLocalizedList(q.data);
  return (
    <>
      <PageHeader eyebrow={t('parts.eyebrow')} title={t('parts.title')} lede={t('parts.lede')} demoTag actions={<Button to="/request-quote">{t('parts.action')}</Button>} />
      <div className={`container ${styles.wrap}`}>
        {q.status === 'loading' && <LoadingState />}
        {q.status === 'error' && <ErrorState message={q.error.message} onRetry={q.retry} />}
        {list && (
          <ul className={`${styles.parts} stagger`}>
            {list.map((g) => (
              <li key={g.id} className={styles.part} data-glow>
                <div className={styles.partTop}><h2>{g.name}</h2><Badge>{g.status}</Badge></div>
                <p className={styles.sum}>{g.description}</p>
                <ul className={styles.examples}>{g.examples.map((x) => <li key={x}>{x}</li>)}</ul>
              </li>
            ))}
          </ul>
        )}
        <Notice tone="demo" title={t('parts.noticeTitle')}>{t('parts.notice')}</Notice>
      </div>
    </>
  );
}
