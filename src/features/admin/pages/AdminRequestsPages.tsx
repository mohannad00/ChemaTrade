import { Fragment, useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { invalidateData } from '@/lib/dataVersion';
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
  const { t, te, formatDate } = useI18n();
  useDocumentTitle(title);
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
      setFlash(t('board.statusUpdated', { status: te('status', status) }));
    } catch (e) {
      setFlash(e instanceof Error ? e.message : t('board.updateFailed'));
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
          <div className={styles.tool}>
            <label className="eyebrow" htmlFor={`${kind}-q`}>{t('common.search')}</label>
            <input id={`${kind}-q`} type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t('board.searchPlaceholder')} />
          </div>
          <div className={styles.tool}>
            <label className="eyebrow" htmlFor={`${kind}-f`}>{t('col.status')}</label>
            <select id={`${kind}-f`} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">{t('board.allStatuses')}</option>
              {statuses.map((s) => <option key={s} value={s}>{te('status', s)}</option>)}
            </select>
          </div>
        </div>
      </div>
      {flash && <div role="status" className={styles.flash}>{flash}</div>}
      {loading && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={retry} />}
      {!loading && !error && shown.length === 0 && <EmptyState title={t('board.emptyTitle')}>{t('board.emptyText')}</EmptyState>}
      {!loading && !error && shown.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('col.reference')}</th><th>{t('col.contact')}</th>
                <th>{kind === 'quotation' ? t('col.equipment') : t('col.service')}</th>
                <th>{t('col.received')}</th><th>{t('col.status')}</th>
                <th><span className="visually-hidden">{t('common.actions')}</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span className={`mono ${styles.ltr}`}>{r.reference}</span>
                    <br />
                    {r.isSample ? <span className={styles.sub}>{t('common.sample')}</span> : <Badge tone="demo">{t('board.submitted')}</Badge>}
                  </td>
                  <td><div className={styles.name}>{r.organisation}</div><div className={styles.sub}>{r.fullName}</div></td>
                  <td>{r.subject}<div className={styles.sub}>{r.extra}</div></td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>
                    <select className={styles.statusSelect} aria-label={t('board.statusFor', { ref: r.reference })} value={r.status} disabled={pending === r.id} onChange={(e) => void change(r.id, e.target.value)}>
                      {statuses.map((s) => <option key={s} value={s}>{te('status', s)}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button type="button" className={styles.iconBtn} aria-label={t('board.view', { ref: r.reference })} onClick={() => setViewing(r.id)}><Eye aria-hidden="true" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={!!fields} title={t('board.detailsTitle')} onClose={() => setViewing(null)} wide footer={<Button variant="secondary" onClick={() => setViewing(null)}>{t('common.close')}</Button>}>
        {fields && <dl className={styles.dl}>{fields.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>}
      </Dialog>
    </>
  );
}

export function AdminQuotationsPage() {
  const { t, te, formatDate } = useI18n();
  const q = useQuery(() => services.quotations.list(), []);
  const list: QuotationRequest[] | undefined = q.data;
  const subject = (x: QuotationRequest) => te('misc', x.equipmentName);
  const rows: Row[] | undefined = list?.map((x) => ({ id: x.id, reference: x.reference, createdAt: x.createdAt, status: x.status, organisation: x.organisation, fullName: x.fullName, isSample: x.isSample, subject: subject(x), extra: t('board.qty', { n: x.quantity }) }));
  return (
    <RequestBoard
      title={t('board.quotationsTitle')} kind="quotation" statuses={QUOTATION_STATUSES}
      rows={rows} loading={q.status === 'loading'} error={q.error} retry={q.retry}
      onStatus={async (id, s) => { await services.quotations.updateStatus(id, s as QuotationStatus); invalidateData(); }}
      detail={(id) => {
        const x = list?.find((r) => r.id === id);
        return x ? [
          [t('col.reference'), x.reference], [t('board.received'), formatDate(x.createdAt)], [t('col.status'), te('status', x.status)],
          [t('field.fullName'), x.fullName], [t('field.organisation'), x.organisation], [t('field.email'), x.email], [t('field.phone'), x.phone ?? '—'],
          [t('col.equipment'), subject(x)], [t('field.quantity'), String(x.quantity)], [t('field.requirements'), x.details],
          [t('board.origin'), x.isSample ? t('board.originSample') : t('board.originLocal')],
        ] : null;
      }}
    />
  );
}

export function AdminMaintenancePage() {
  const { t, te, formatDate } = useI18n();
  const q = useQuery(() => services.maintenance.list(), []);
  const list: MaintenanceRequest[] | undefined = q.data;
  const rows: Row[] | undefined = list?.map((x) => ({ id: x.id, reference: x.reference, createdAt: x.createdAt, status: x.status, organisation: x.organisation, fullName: x.fullName, isSample: x.isSample, subject: te('service', x.serviceType), extra: `${te('status', x.urgency)} · ${x.equipmentDescription}` }));
  return (
    <RequestBoard
      title={t('board.maintenanceTitle')} kind="maintenance" statuses={MAINTENANCE_STATUSES}
      rows={rows} loading={q.status === 'loading'} error={q.error} retry={q.retry}
      onStatus={async (id, s) => { await services.maintenance.updateStatus(id, s as MaintenanceStatus); invalidateData(); }}
      detail={(id) => {
        const x = list?.find((r) => r.id === id);
        return x ? [
          [t('col.reference'), x.reference], [t('board.received'), formatDate(x.createdAt)], [t('col.status'), te('status', x.status)],
          [t('field.fullName'), x.fullName], [t('field.organisation'), x.organisation], [t('field.email'), x.email], [t('field.phone'), x.phone ?? '—'],
          [t('col.equipment'), x.equipmentDescription], [t('field.serviceType'), te('service', x.serviceType)], [t('field.urgency'), te('status', x.urgency)],
          [t('field.problem'), x.details], [t('board.origin'), x.isSample ? t('board.originSample') : t('board.originLocal')],
        ] : null;
      }}
    />
  );
}
