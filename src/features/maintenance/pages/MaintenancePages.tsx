import { Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { services } from '@/services';
import styles from './MaintenancePages.module.css';

export function MaintenancePage() {
  useDocumentTitle('Maintenance services');
  const q = useQuery(() => services.maintenance.listServices(), []);
  return (
    <>
      <PageHeader eyebrow="Maintenance services" title="Keep instruments working" lede="Service descriptions below are sample copy that illustrates the layout. The actual scope, coverage area, response times and pricing must be confirmed with Chema Trade." demoTag actions={<Button to="/request-maintenance">Request maintenance</Button>} />
      <div className={`container ${styles.wrap}`}>
        {q.status === 'loading' && <LoadingState />}
        {q.status === 'error' && <ErrorState message={q.error.message} onRetry={q.retry} />}
        {q.status === 'success' && (
          <ol className={styles.list}>
            {q.data.map((s, i) => (
              <li key={s.id} className={styles.row}>
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
        <Notice tone="demo" title="No commitments implied">This page does not promise response times, certifications or warranties. It demonstrates how maintenance information will be presented.</Notice>
      </div>
    </>
  );
}

export function SparePartsPage() {
  useDocumentTitle('Spare parts');
  const q = useQuery(() => services.maintenance.listSparePartGroups(), []);
  return (
    <>
      <PageHeader eyebrow="Spare parts" title="Parts for laboratory instruments" lede="Spare parts are handled by request. Describe the instrument and part, and Chema Trade confirms whether and how it can be sourced." demoTag actions={<Button to="/request-quote">Request a part quotation</Button>} />
      <div className={`container ${styles.wrap}`}>
        {q.status === 'loading' && <LoadingState />}
        {q.status === 'error' && <ErrorState message={q.error.message} onRetry={q.retry} />}
        {q.status === 'success' && (
          <ul className={styles.parts}>
            {q.data.map((g) => (
              <li key={g.id} className={styles.part}>
                <div className={styles.partTop}><h2>{g.name}</h2><Badge>{g.status}</Badge></div>
                <p className={styles.sum}>{g.description}</p>
                <ul className={styles.examples}>{g.examples.map((x) => <li key={x} className="mono">{x}</li>)}</ul>
              </li>
            ))}
          </ul>
        )}
        <Notice tone="demo" title="Sample categories">These are example part groups. No stock is implied and no supplier relationship is claimed.</Notice>
      </div>
    </>
  );
}
