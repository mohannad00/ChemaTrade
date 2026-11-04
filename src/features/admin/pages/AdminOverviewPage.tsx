import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import type { MessageKey } from '@/i18n/messages.en';
import { services } from '@/services';
import styles from '../components/Admin.module.css';

export function AdminOverviewPage() {
  const { t, te, formatDate, formatMonth } = useI18n();
  useDocumentTitle(t('ov.title'));
  const q = useQuery(() => services.dashboard.getStats(), []);
  if (q.status === 'loading') return <LoadingState label={t('ov.loading')} />;
  if (q.status === 'error') return <ErrorState message={q.error.message} onRetry={q.retry} />;
  const s = q.data;
  const max = Math.max(1, ...s.activity.flatMap((a) => [a.quotations, a.maintenance]));
  const cards: [MessageKey, number, string][] = [
    ['ov.equipment', s.equipmentTotal, '/admin/equipment'],
    ['ov.openQuotations', s.quotationsOpen, '/admin/quotations'],
    ['ov.openMaintenance', s.maintenanceOpen, '/admin/maintenance'],
    ['ov.published', s.articlesPublished, '/admin/content'],
    ['ov.drafts', s.articlesDraft, '/admin/content'],
    ['ov.submitted', s.submittedThisSession, '/admin/quotations'],
  ];
  const chartLabel = `${t('ov.chartAria')} ${s.activity.map((a) => t('ov.chartRow', { month: formatMonth(a.month), q: a.quotations, m: a.maintenance })).join('; ')}.`;
  return (
    <>
      <div className={styles.head}><h1>{t('ov.title')}</h1><Badge tone="demo">{t('ov.badge')}</Badge></div>
      <Notice tone="demo" title={t('ov.noticeTitle')}>{t('ov.notice')} {t('demo.disclaimer')}</Notice>
      <div className={`${styles.statGrid} stagger`}>
        {cards.map(([label, n, to]) => (
          <Link key={label} to={to} className={styles.stat} data-glow>
            <span className="eyebrow">{t(label)}</span><strong>{n}</strong>
          </Link>
        ))}
      </div>
      <div className={styles.two}>
        <section className={styles.panel} aria-labelledby="act-h">
          <h2 id="act-h">{t('ov.activity')}</h2>
          <div className={styles.chart} role="img" aria-label={chartLabel}>
            {s.activity.map((a) => (
              <div key={a.month} className={styles.barGroup}>
                <div className={styles.bars}>
                  <div className={styles.bar} style={{ height: `${(a.quotations / max) * 100}%` }} title={`${t('ov.quotations')}: ${a.quotations}`} />
                  <div className={`${styles.bar} ${styles.alt}`} style={{ height: `${(a.maintenance / max) * 100}%` }} title={`${t('ov.maintenance')}: ${a.maintenance}`} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.months} aria-hidden="true">{s.activity.map((a) => <span key={a.month}>{formatMonth(a.month)}</span>)}</div>
          <p className={styles.legend}><span><i />{t('ov.quotations')}</span><span><i className={styles.alt} />{t('ov.maintenance')}</span></p>
        </section>
        <section className={styles.panel} aria-labelledby="st-h">
          <h2 id="st-h">{t('ov.byStatus')}</h2>
          <ul className={styles.statusList}>
            {Object.entries(s.equipmentByStatus).map(([k, v]) => <li key={k}><span>{te('status', k)}</span><strong>{v}</strong></li>)}
          </ul>
        </section>
      </div>
      <section className={styles.panel} aria-labelledby="rc-h">
        <h2 id="rc-h">{t('ov.recent')}</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>{t('col.type')}</th><th>{t('col.reference')}</th><th>{t('col.organisation')}</th><th>{t('col.date')}</th><th>{t('col.status')}</th></tr></thead>
            <tbody>
              {s.recent.map((r) => (
                <tr key={r.id}>
                  <td>{te('kind', r.kind)}</td>
                  <td><Link to={r.kind === 'Quotation' ? '/admin/quotations' : '/admin/maintenance'} className={`mono ${styles.ltr}`}>{r.reference}</Link></td>
                  <td>{r.who}</td><td>{formatDate(r.createdAt)}</td><td><Badge>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
