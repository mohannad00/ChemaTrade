import { Fragment, useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { invalidateData } from '@/lib/dataVersion';
import { formatDate } from '@/lib/format';
import { services } from '@/services';
import { QUOTATION_STATUSES, type QuotationRequest, type QuotationStatus } from '@/features/quotations/quotations.types';
import { MAINTENANCE_STATUSES, type MaintenanceRequest, type MaintenanceStatus } from '@/features/maintenance/maintenance.types';
import { useFlash } from '../components/useFlash';
import styles from '../components/Admin.module.css';

interface Row {
  id: string;
  reference: string;
  createdAt: string;
  status: string;
  organisation: string;
  fullName: string;
  email: string;
  isSample: boolean;
  subject: string;
  extra: string;
}

interface BoardProps {
  title: string;
  kind: 'quotation' | 'maintenance';
  statuses: readonly string[];
  rows: Row[] | undefined;
  loading: boolean;
  error?: Error;
  retry: () => void;
  onStatus: (id: string, status: string) => Promise<void>;
  detail: (id: string) => [string, string][] | null;
}

function RequestBoard({ title, kind, statuses, rows, loading, error, retry, onStatus, detail }: BoardProps) {
  useDocumentTitle(`${title} (demo)`);
  const [filter, setFilter] = useState('');
  const [term, setTerm] = useState('');
  const search = useDebouncedValue(term, 200).trim().toLowerCase();
  const [viewing, setViewing] = useState<string | null>(null);
  const [flash, setFlash] = useFlash();
  const [pending, setPending] = useState<string | null>(null);

  const shown = useMemo(
    () => (rows ?? []).filter((r) => (!filter || r.status === filter) && (!search || `${r.reference} ${r.organisation} ${r.fullName} ${r.subject}`.toLowerCase().includes(search))),
    [rows, filter, search],
  );

  const change = async (id: string, status: string) => {
    setPending(id);
    try {
      await onStatus(id, status);
      setFlash(`Status updated to “${status}”.`);
    } catch (e) {
      setFlash(e instanceof Error ? e.message : 'Update failed.');
    } finally {
      setPending(null);
    }
  };

  const fields = viewing ? detail(viewing) : null;

  return (
    <>
      <div className={styles.head}>
        <h1>{title}</h1>
        <div className={styles.tools}>
          <div className={styles.tool}><label className="eyebrow" htmlFor={`${kind}-q`}>Search</label><input id={`${kind}-q`} type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Reference, name, organisation" /></div>
          <div className={styles.tool}><label className="eyebrow" htmlFor={`${kind}-f`}>Status</label>
            <select id={`${kind}-f`} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
      {flash && <div role="status" className={styles.flash}>{flash}</div>}
      {loading && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={retry} />}
      {!loading && !error && shown.length === 0 && <EmptyState title="No requests match">Adjust the search or status filter. Requests submitted through the public forms appear here during this session.</EmptyState>}
      {!loading && !error && shown.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Reference</th><th>Contact</th><th>{kind === 'quotation' ? 'Equipment' : 'Service'}</th><th>Received</th><th>Status</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td><span className="mono">{r.reference}</span><br />{r.isSample ? <span className={styles.sub}>sample</span> : <Badge>New</Badge>}</td>
                  <td><div className={styles.name}>{r.organisation}</div><div className={styles.sub}>{r.fullName}</div></td>
                  <td>{r.subject}<div className={styles.sub}>{r.extra}</div></td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>
                    <select className={styles.statusSelect} aria-label={`Status for ${r.reference}`} value={r.status} disabled={pending === r.id} onChange={(e) => void change(r.id, e.target.value)}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><div className={styles.rowActions}><button type="button" className={styles.iconBtn} aria-label={`View details of ${r.reference}`} onClick={() => setViewing(r.id)}><Eye aria-hidden="true" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={!!fields} title="Request details" onClose={() => setViewing(null)} wide footer={<Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>}>
        {fields && <dl className={styles.dl}>{fields.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>}
      </Dialog>
    </>
  );
}

export function AdminQuotationsPage() {
  const q = useQuery(() => services.quotations.list(), []);
  const list: QuotationRequest[] | undefined = q.data;
  const rows: Row[] | undefined = list?.map((x) => ({ id: x.id, reference: x.reference, createdAt: x.createdAt, status: x.status, organisation: x.organisation, fullName: x.fullName, email: x.email, isSample: x.isSample, subject: x.equipmentName, extra: `Qty ${x.quantity}` }));
  return (
    <RequestBoard
      title="Quotation requests" kind="quotation" statuses={QUOTATION_STATUSES}
      rows={rows} loading={q.status === 'loading'} error={q.error} retry={q.retry}
      onStatus={async (id, s) => { await services.quotations.updateStatus(id, s as QuotationStatus); invalidateData(); }}
      detail={(id) => {
        const x = list?.find((r) => r.id === id);
        return x ? [['Reference', x.reference], ['Received', formatDate(x.createdAt)], ['Status', x.status], ['Name', x.fullName], ['Organisation', x.organisation], ['Email', x.email], ['Phone', x.phone ?? '—'], ['Equipment', x.equipmentName], ['Quantity', String(x.quantity)], ['Requirements', x.details], ['Origin', x.isSample ? 'Pre-loaded sample' : 'Submitted in this browser (simulated)']] : null;
      }}
    />
  );
}

export function AdminMaintenancePage() {
  const q = useQuery(() => services.maintenance.list(), []);
  const list: MaintenanceRequest[] | undefined = q.data;
  const rows: Row[] | undefined = list?.map((x) => ({ id: x.id, reference: x.reference, createdAt: x.createdAt, status: x.status, organisation: x.organisation, fullName: x.fullName, email: x.email, isSample: x.isSample, subject: x.serviceType, extra: `${x.urgency} · ${x.equipmentDescription}` }));
  return (
    <RequestBoard
      title="Maintenance requests" kind="maintenance" statuses={MAINTENANCE_STATUSES}
      rows={rows} loading={q.status === 'loading'} error={q.error} retry={q.retry}
      onStatus={async (id, s) => { await services.maintenance.updateStatus(id, s as MaintenanceStatus); invalidateData(); }}
      detail={(id) => {
        const x = list?.find((r) => r.id === id);
        return x ? [['Reference', x.reference], ['Received', formatDate(x.createdAt)], ['Status', x.status], ['Name', x.fullName], ['Organisation', x.organisation], ['Email', x.email], ['Phone', x.phone ?? '—'], ['Equipment', x.equipmentDescription], ['Service type', x.serviceType], ['Urgency', x.urgency], ['Problem', x.details], ['Origin', x.isSample ? 'Pre-loaded sample' : 'Submitted in this browser (simulated)']] : null;
      }}
    />
  );
}

