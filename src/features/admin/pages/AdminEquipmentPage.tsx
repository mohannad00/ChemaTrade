import { useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog, Dialog } from '@/components/ui/Dialog';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { invalidateData } from '@/lib/dataVersion';
import { formatDate } from '@/lib/format';
import { required } from '@/lib/validation';
import { services } from '@/services';
import { EQUIPMENT_STATUSES, type Equipment, type EquipmentInput, type EquipmentStatus } from '@/features/equipment/equipment.types';
import { useFlash } from '../components/useFlash';
import styles from '../components/Admin.module.css';

interface Draft {
  name: string;
  categoryId: string;
  status: EquipmentStatus;
  summary: string;
  description: string;
  illustrativePrice: string;
  featured: boolean;
  specs: { label: string; value: string }[];
}

const blank = (categoryId: string): Draft => ({ name: '', categoryId, status: 'Request a Quote', summary: '', description: '', illustrativePrice: '', featured: false, specs: [{ label: '', value: '' }] });

const fromItem = (e: Equipment): Draft => ({ name: e.name, categoryId: e.categoryId, status: e.status, summary: e.summary, description: e.description, illustrativePrice: e.illustrativePrice ?? '', featured: e.featured, specs: e.specs.length ? e.specs.map((s) => ({ ...s })) : [{ label: '', value: '' }] });

function toInput(d: Draft): EquipmentInput {
  return {
    name: d.name.trim(),
    categoryId: d.categoryId,
    status: d.status,
    summary: d.summary.trim(),
    description: d.description.trim(),
    illustrativePrice: d.illustrativePrice.trim() || undefined,
    featured: d.featured,
    specs: d.specs.map((s) => ({ label: s.label.trim(), value: s.value.trim() })).filter((s) => s.label && s.value),
  };
}

type Errs = Partial<Record<'name' | 'summary' | 'description' | 'categoryId', string>>;

export function AdminEquipmentPage() {
  useDocumentTitle('Equipment management (demo)');
  const [term, setTerm] = useState('');
  const search = useDebouncedValue(term, 200);
  const [status, setStatus] = useState<EquipmentStatus | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const categories = useQuery(() => services.categories.list(), []);
  const items = useQuery(() => services.equipment.list({ search, status: status || undefined }), [search, status]);
  const [flash, setFlash] = useFlash();

  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null);
  const [errs, setErrs] = useState<Errs>({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const cats = categories.data ?? [];
  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? '—';
  const rows = (items.data ?? []).filter((e) => !categoryId || e.categoryId === categoryId);

  const openNew = () => { setErrs({}); setEditing({ id: null, draft: blank(cats[0]?.id ?? '') }); };
  const openEdit = (e: Equipment) => { setErrs({}); setEditing({ id: e.id, draft: fromItem(e) }); };
  const patch = (p: Partial<Draft>) => setEditing((s) => (s ? { ...s, draft: { ...s.draft, ...p } } : s));

  const save = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    const d = editing.draft;
    const found: Errs = { name: required(d.name, 'Name'), summary: required(d.summary, 'Summary'), description: required(d.description, 'Description'), categoryId: required(d.categoryId, 'Category') };
    setErrs(found);
    if (Object.values(found).some(Boolean)) return;
    setSaving(true);
    try {
      if (editing.id) await services.equipment.update(editing.id, toInput(d));
      else await services.equipment.create(toInput(d));
      invalidateData();
      setFlash(editing.id ? 'Equipment updated.' : 'Equipment added.');
      setEditing(null);
    } catch (e) {
      setFlash(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await services.equipment.remove(toDelete.id);
      invalidateData();
      setFlash(`Deleted “${toDelete.name}”.`);
    } catch (e) {
      setFlash(e instanceof Error ? e.message : 'Delete failed.');
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <>
      <div className={styles.head}>
        <h1>Equipment</h1>
        <div className={styles.tools}>
          <div className={styles.tool}><label className="eyebrow" htmlFor="eq-q">Search</label><input id="eq-q" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Name or specification" /></div>
          <div className={styles.tool}><label className="eyebrow" htmlFor="eq-c">Category</label>
            <select id="eq-c" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="">All</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className={styles.tool}><label className="eyebrow" htmlFor="eq-s">Status</label>
            <select id="eq-s" value={status} onChange={(e) => setStatus(e.target.value as EquipmentStatus | '')}><option value="">All</option>{EQUIPMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
          <Button icon={<Plus aria-hidden="true" />} onClick={openNew} disabled={cats.length === 0}>Add equipment</Button>
        </div>
      </div>
      {flash && <div role="status" className={styles.flash}>{flash}</div>}
      {items.status === 'loading' && <LoadingState />}
      {items.status === 'error' && <ErrorState message={items.error.message} onRetry={items.retry} />}
      {items.status === 'success' && rows.length === 0 && <EmptyState title="No equipment found" action={<Button onClick={openNew}>Add equipment</Button>}>Adjust the filters, or add a new demo item.</EmptyState>}
      {items.status === 'success' && rows.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Name</th><th>Category</th><th>Status</th><th>Updated</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td><div className={styles.name}>{e.name}</div><div className={styles.sub}>/{e.slug}{e.featured ? ' · featured' : ''}</div></td>
                  <td>{catName(e.categoryId)}</td>
                  <td><Badge>{e.status}</Badge></td>
                  <td>{formatDate(e.updatedAt)}</td>
                  <td><div className={styles.rowActions}>
                    <button type="button" className={styles.iconBtn} aria-label={`Edit ${e.name}`} onClick={() => openEdit(e)}><Pencil aria-hidden="true" /></button>
                    <button type="button" className={`${styles.iconBtn} ${styles.del}`} aria-label={`Delete ${e.name}`} onClick={() => setToDelete(e)}><Trash2 aria-hidden="true" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editing} title={editing?.id ? 'Edit equipment' : 'Add equipment'} onClose={() => !saving && setEditing(null)} wide
        footer={<><Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button><Button type="submit" form="equipment-form" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button></>}>
        {editing && (
          <form id="equipment-form" className={styles.formGrid} onSubmit={save} noValidate>
            <div className={styles.full}><TextField label="Name" name="name" required value={editing.draft.name} error={errs.name} onChange={(e) => patch({ name: e.target.value })} /></div>
            <SelectField label="Category" name="categoryId" required value={editing.draft.categoryId} error={errs.categoryId} onChange={(e) => patch({ categoryId: e.target.value })} options={cats.map((c) => ({ value: c.id, label: c.name }))} />
            <SelectField label="Status" name="status" value={editing.draft.status} onChange={(e) => patch({ status: e.target.value as EquipmentStatus })} options={EQUIPMENT_STATUSES.map((s) => ({ value: s, label: s }))} />
            <div className={styles.full}><TextField label="Summary" name="summary" required value={editing.draft.summary} error={errs.summary} onChange={(e) => patch({ summary: e.target.value })} /></div>
            <div className={styles.full}><TextAreaField label="Description" name="description" required value={editing.draft.description} error={errs.description} onChange={(e) => patch({ description: e.target.value })} /></div>
            <div className={styles.full}><TextField label="Illustrative price (optional)" name="illustrativePrice" value={editing.draft.illustrativePrice} hint="Must read as illustrative, e.g. “Illustrative: from EUR 900 (not a quotation)”." onChange={(e) => patch({ illustrativePrice: e.target.value })} /></div>
            <fieldset className={`${styles.full} ${styles.specs}`} style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="eyebrow">Sample specifications</legend>
              {editing.draft.specs.map((s, i) => (
                <div key={i} className={styles.specRow}>
                  <TextField label={`Label ${i + 1}`} value={s.label} onChange={(e) => patch({ specs: editing.draft.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
                  <TextField label={`Value ${i + 1}`} value={s.value} onChange={(e) => patch({ specs: editing.draft.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
                  <button type="button" className={styles.iconBtn} aria-label={`Remove specification ${i + 1}`} onClick={() => patch({ specs: editing.draft.specs.filter((_, j) => j !== i) })}><X aria-hidden="true" /></button>
                </div>
              ))}
              <div><Button variant="secondary" size="sm" icon={<Plus aria-hidden="true" />} onClick={() => patch({ specs: [...editing.draft.specs, { label: '', value: '' }] })}>Add specification</Button></div>
            </fieldset>
            <label className={styles.full} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" checked={editing.draft.featured} onChange={(e) => patch({ featured: e.target.checked })} /> <span className="mono">Featured sample</span></label>
          </form>
        )}
      </Dialog>

      <ConfirmDialog open={!!toDelete} title="Delete equipment?" busy={deleting} confirmLabel="Delete" onCancel={() => setToDelete(null)} onConfirm={confirmDelete}
        message={<p>“{toDelete?.name}” will be removed from the demo catalog. You can restore it with “Reset demo data”.</p>} />
    </>
  );
}
