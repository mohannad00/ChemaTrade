import { Link } from 'react-router-dom';
import { DEMO_DISCLAIMER } from '@/config/app.config';
import { Badge } from '@/components/ui/Badge';
import { ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { formatDate } from '@/lib/format';
import { services } from '@/services';
import styles from '../components/Admin.module.css';

export function AdminOverviewPage() {
  useDocumentTitle('Demo dashboard');
  const q = useQuery(() => services.dashboard.getStats(), []);
  if (q.status === 'loading') return <LoadingState label="Loading statistics…" />;
  if (q.status === 'error') return <ErrorState message={q.error.message} onRetry={q.retry} />;
  const s = q.data;
  const max = Math.max(1, ...s.activity.flatMap((a) => [a.quotations, a.maintenance]));
  const cards: [string, number, string][] = [
    ['Equipment items', s.equipmentTotal, '/admin/equipment'],
    ['Open quotations', s.quotationsOpen, '/admin/quotations'],
    ['Open maintenance', s.maintenanceOpen, '/admin/maintenance'],
    ['Published articles', s.articlesPublished, '/admin/content'],
    ['Draft articles', s.articlesDraft, '/admin/content'],
    ['Submitted this session', s.submittedThisSession, '/admin/quotations'],
  ];
  return (
    <>
      <div className={styles.head}><h1>Dashboard overview</h1><Badge tone="demo">Sample statistics</Badge></div>
      <Notice tone="demo" title="Demo statistics">All figures are computed from sample data held in this browser. They are not real business statistics. {DEMO_DISCLAIMER}</Notice>
      <div className={styles.statGrid}>
        {cards.map(([label, n, to]) => (
          <Link key={label} to={to} className={styles.stat} style={{ color: 'inherit', textDecoration: 'none' }}>
            <span className="eyebrow">{label}</span><strong>{n}</strong>
          </Link>
        ))}
      </div>
      <div className={styles.two}>
        <section className={styles.panel} aria-labelledby="act-h">
          <h2 id="act-h">Monthly activity (illustrative sample)</h2>
          <div className={styles.chart} role="img" aria-label={`Bar chart of sample monthly quotations and maintenance requests. ${s.activity.map((a) => `${a.month}: ${a.quotations} quotations, ${a.maintenance} maintenance`).join('; ')}.`}>
            {s.activity.map((a) => (
              <div key={a.month} className={styles.barGroup}>
                <div className={styles.bars}>
                  <div className={styles.bar} style={{ height: `${(a.quotations / max) * 100}%` }} title={`${a.quotations} quotations`} />
                  <div className={`${styles.bar} ${styles.alt}`} style={{ height: `${(a.maintenance / max) * 100}%` }} title={`${a.maintenance} maintenance`} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.months} aria-hidden="true">{s.activity.map((a) => <span key={a.month}>{a.month}</span>)}</div>
          <p className={styles.legend}><span><i />Quotations</span><span><i className={styles.alt} />Maintenance</span></p>
        </section>
        <section className={styles.panel} aria-labelledby="st-h">
          <h2 id="st-h">Equipment by status</h2>
          <ul className={styles.statusList}>
            {Object.entries(s.equipmentByStatus).map(([k, v]) => <li key={k}><span>{k}</span><strong>{v}</strong></li>)}
          </ul>
        </section>
      </div>
      <section className={styles.panel} aria-labelledby="rc-h">
        <h2 id="rc-h">Recent requests</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Type</th><th>Reference</th><th>Organisation</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {s.recent.map((r) => (
                <tr key={r.id}>
                  <td>{r.kind}</td>
                  <td><Link to={r.kind === 'Quotation' ? '/admin/quotations' : '/admin/maintenance'} className="mono">{r.reference}</Link></td>
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
