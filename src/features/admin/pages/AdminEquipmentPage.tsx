import { useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog, Dialog } from '@/components/ui/Dialog';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { EquipmentImage } from '@/components/ui/EquipmentImage';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { translatedSearchText } from '@/i18n/localize';
import { useLocalizedList } from '@/i18n/useLocalized';
import { invalidateData } from '@/lib/dataVersion';
import { hasErrors, required, type FieldErrors } from '@/lib/validation';
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
  image: string;
  featured: boolean;
  specs: { label: string; value: string }[];
}

const blank = (categoryId: string): Draft => ({ name: '', categoryId, status: 'Request a Quote', summary: '', description: '', illustrativePrice: '', image: '', featured: false, specs: [{ label: '', value: '' }] });

const fromItem = (e: Equipment): Draft => ({ name: e.name, categoryId: e.categoryId, status: e.status, summary: e.summary, description: e.description, illustrativePrice: e.illustrativePrice ?? '', image: e.image ?? '', featured: e.featured, specs: e.specs.length ? e.specs.map((s) => ({ ...s })) : [{ label: '', value: '' }] });

function toInput(d: Draft): EquipmentInput {
  return {
    name: d.name.trim(),
    categoryId: d.categoryId,
    status: d.status,
    summary: d.summary.trim(),
    description: d.description.trim(),
    illustrativePrice: d.illustrativePrice.trim() || undefined,
    image: d.image.trim(),
    featured: d.featured,
    specs: d.specs.map((s) => ({ label: s.label.trim(), value: s.value.trim() })).filter((s) => s.label && s.value),
  };
}

type Field = 'name' | 'summary' | 'description' | 'categoryId';

export function AdminEquipmentPage() {
  const { t, te, formatDate } = useI18n();
  useDocumentTitle(t('ae.title'));
  const [term, setTerm] = useState('');
  const search = useDebouncedValue(term, 200);
  const [status, setStatus] = useState<EquipmentStatus | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const categories = useQuery(() => services.categories.list(), []);
  const items = useQuery(() => services.equipment.list({ status: status || undefined }), [status]);
  const cats = useLocalizedList(categories.data) ?? [];
  const localized = useLocalizedList(items.data);
  const [flash, setFlash] = useFlash();

  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null);
  const [errs, setErrs] = useState<FieldErrors<Field>>({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? '—';
  const needle = search.trim().toLowerCase();
  const rows = (localized ?? []).filter((e) => (!categoryId || e.categoryId === categoryId) && (!needle || `${e.name} ${e.summary} ${e.specs.map((s) => s.value).join(' ')} ${translatedSearchText(e)}`.toLowerCase().includes(needle)));

  const rawOf = (id: string) => items.data?.find((e) => e.id === id);
  const openNew = () => { setErrs({}); setEditing({ id: null, draft: blank(cats[0]?.id ?? '') }); };
  const openEdit = (e: Equipment) => { const raw = rawOf(e.id); if (!raw) return; setErrs({}); setEditing({ id: e.id, draft: fromItem(raw) }); };
  const patch = (p: Partial<Draft>) => setEditing((s) => (s ? { ...s, draft: { ...s.draft, ...p } } : s));

  const save = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    const d = editing.draft;
    const found: FieldErrors<Field> = { name: required(d.name, 'field.name'), summary: required(d.summary, 'field.summary'), description: required(d.description, 'field.description'), categoryId: required(d.categoryId, 'field.category') };
    setErrs(found);
    if (hasErrors(found)) return;
    setSaving(true);
    try {
      if (editing.id) await services.equipment.update(editing.id, toInput(d));
      else await services.equipment.create(toInput(d));
      invalidateData();
      setFlash(editing.id ? t('ae.updated') : t('ae.added'));
      setEditing(null);
    } catch (e) {
      setFlash(e instanceof Error ? e.message : t('ae.saveFailed'));
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
      setFlash(t('ae.deleted', { name: toDelete.name }));
    } catch (e) {
      setFlash(e instanceof Error ? e.message : t('ae.deleteFailed'));
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <>
      <div className={styles.head}>
        <h1>{t('ae.title')}</h1>
        <div className={styles.tools}>
          <div className={styles.tool}><label className="eyebrow" htmlFor="eq-q">{t('common.search')}</label><input id="eq-q" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t('catalog.searchPlaceholder')} /></div>
          <div className={styles.tool}><label className="eyebrow" htmlFor="eq-c">{t('catalog.category')}</label>
            <select id="eq-c" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="">{t('common.all')}</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className={styles.tool}><label className="eyebrow" htmlFor="eq-s">{t('col.status')}</label>
            <select id="eq-s" value={status} onChange={(e) => setStatus(e.target.value as EquipmentStatus | '')}><option value="">{t('common.all')}</option>{EQUIPMENT_STATUSES.map((s) => <option key={s} value={s}>{te('status', s)}</option>)}</select></div>
          <Button icon={<Plus aria-hidden="true" />} onClick={openNew} disabled={cats.length === 0}>{t('ae.add')}</Button>
        </div>
      </div>
      {flash && <div role="status" className={styles.flash}>{flash}</div>}
      {items.status === 'loading' && <LoadingState />}
      {items.status === 'error' && <ErrorState message={items.error.message} onRetry={items.retry} />}
      {items.status === 'success' && rows.length === 0 && <EmptyState title={t('ae.emptyTitle')} action={<Button onClick={openNew}>{t('ae.add')}</Button>}>{t('ae.emptyText')}</EmptyState>}
      {items.status === 'success' && rows.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>{t('col.name')}</th><th>{t('col.category')}</th><th>{t('col.status')}</th><th>{t('col.updated')}</th><th><span className="visually-hidden">{t('common.actions')}</span></th></tr></thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td><div className={styles.nameCell}><EquipmentImage src={e.image} name={e.name} className={styles.thumb} /><div><div className={styles.name}>{e.name}</div><div className={styles.sub}>/{e.slug}{e.featured ? ` · ${t('ae.featured')}` : ''}</div></div></div></td>
                  <td>{catName(e.categoryId)}</td>
                  <td><Badge>{e.status}</Badge></td>
                  <td>{formatDate(e.updatedAt)}</td>
                  <td><div className={styles.rowActions}>
                    <button type="button" className={styles.iconBtn} aria-label={t('ae.editAria', { name: e.name })} onClick={() => openEdit(e)}><Pencil aria-hidden="true" /></button>
                    <button type="button" className={`${styles.iconBtn} ${styles.del}`} aria-label={t('ae.deleteAria', { name: e.name })} onClick={() => setToDelete(e)}><Trash2 aria-hidden="true" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editing} title={editing?.id ? t('ae.editTitle') : t('ae.add')} onClose={() => !saving && setEditing(null)} wide
        footer={<><Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>{t('common.cancel')}</Button><Button type="submit" form="equipment-form" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</Button></>}>
        {editing && (
          <form id="equipment-form" className={styles.formGrid} onSubmit={save} noValidate>
            <div className={styles.full}><TextField label={t('field.name')} name="name" required value={editing.draft.name} error={errs.name} onChange={(e) => patch({ name: e.target.value })} /></div>
            <SelectField label={t('field.category')} name="categoryId" required value={editing.draft.categoryId} error={errs.categoryId} onChange={(e) => patch({ categoryId: e.target.value })} options={cats.map((c) => ({ value: c.id, label: c.name }))} />
            <SelectField label={t('field.status')} name="status" value={editing.draft.status} onChange={(e) => patch({ status: e.target.value as EquipmentStatus })} options={EQUIPMENT_STATUSES.map((s) => ({ value: s, label: te('status', s) }))} />
            <div className={styles.full}><TextField label={t('field.summary')} name="summary" required value={editing.draft.summary} error={errs.summary} onChange={(e) => patch({ summary: e.target.value })} /></div>
            <div className={styles.full}><TextAreaField label={t('field.description')} name="description" required value={editing.draft.description} error={errs.description} onChange={(e) => patch({ description: e.target.value })} /></div>
            <div className={styles.full}><TextField label={t('field.price')} name="illustrativePrice" value={editing.draft.illustrativePrice} hint={t('ae.priceHint')} onChange={(e) => patch({ illustrativePrice: e.target.value })} /></div>
            <div className={styles.full}><TextField label={t('field.image')} name="image" value={editing.draft.image} hint={t('ae.imageHint')} onChange={(e) => patch({ image: e.target.value })} /></div>
            <fieldset className={`${styles.full} ${styles.specs}`} style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="eyebrow">{t('ae.specs')}</legend>
              {editing.draft.specs.map((s, i) => (
                <div key={i} className={styles.specRow}>
                  <TextField label={t('ae.specLabel', { n: i + 1 })} value={s.label} onChange={(e) => patch({ specs: editing.draft.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
                  <TextField label={t('ae.specValue', { n: i + 1 })} value={s.value} onChange={(e) => patch({ specs: editing.draft.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
                  <button type="button" className={styles.iconBtn} aria-label={t('ae.removeSpec', { n: i + 1 })} onClick={() => patch({ specs: editing.draft.specs.filter((_, j) => j !== i) })}><X aria-hidden="true" /></button>
                </div>
              ))}
              <div><Button variant="secondary" size="sm" icon={<Plus aria-hidden="true" />} onClick={() => patch({ specs: [...editing.draft.specs, { label: '', value: '' }] })}>{t('ae.addSpec')}</Button></div>
            </fieldset>
            <label className={styles.full} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" checked={editing.draft.featured} onChange={(e) => patch({ featured: e.target.checked })} /> <span>{t('ae.featuredCheck')}</span></label>
            <p className={`${styles.full} ${styles.sub}`} style={{ direction: 'inherit' }}>{t('ae.langNote')}</p>
          </form>
        )}
      </Dialog>

      <ConfirmDialog open={!!toDelete} title={t('ae.deleteTitle')} busy={deleting} confirmLabel={t('common.delete')} onCancel={() => setToDelete(null)} onConfirm={confirmDelete}
        message={<p>{t('ae.deleteMessage', { name: toDelete?.name ?? '' })}</p>} />
    </>
  );
}
