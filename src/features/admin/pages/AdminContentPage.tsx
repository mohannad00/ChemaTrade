import { useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog, Dialog } from '@/components/ui/Dialog';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { translatedSearchText } from '@/i18n/localize';
import { useLocalizedList } from '@/i18n/useLocalized';
import { invalidateData } from '@/lib/dataVersion';
import { hasErrors, minLength, required, type FieldErrors } from '@/lib/validation';
import { services } from '@/services';
import type { Article, ArticleInput, ArticleStatus } from '@/features/resources/resources.types';
import { useFlash } from '../components/useFlash';
import styles from '../components/Admin.module.css';

interface Draft { title: string; tag: string; excerpt: string; body: string; status: ArticleStatus }
const blank: Draft = { title: '', tag: '', excerpt: '', body: '', status: 'Draft' };
const toInput = (d: Draft): ArticleInput => ({ title: d.title.trim(), tag: d.tag.trim(), excerpt: d.excerpt.trim(), body: d.body.trim(), status: d.status });

export function AdminContentPage() {
  const { t, te, formatDate } = useI18n();
  useDocumentTitle(t('ac.title'));
  const [term, setTerm] = useState('');
  const search = useDebouncedValue(term, 200);
  const [status, setStatus] = useState<ArticleStatus | ''>('');
  const q = useQuery(() => services.articles.list({ status: status || undefined }), [status]);
  const localized = useLocalizedList(q.data);
  const [flash, setFlash] = useFlash();
  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null);
  const [errs, setErrs] = useState<FieldErrors<keyof Draft>>({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  const needle = search.trim().toLowerCase();
  const rows = (localized ?? []).filter((a) => !needle || `${a.title} ${a.excerpt} ${a.tag} ${translatedSearchText(a)}`.toLowerCase().includes(needle));

  const patch = (p: Partial<Draft>) => setEditing((s) => (s ? { ...s, draft: { ...s.draft, ...p } } : s));
  const openNew = () => { setErrs({}); setEditing({ id: null, draft: blank }); };
  const openEdit = (a: Article) => { const raw = q.data?.find((x) => x.id === a.id); if (!raw) return; setErrs({}); setEditing({ id: a.id, draft: { title: raw.title, tag: raw.tag, excerpt: raw.excerpt, body: raw.body, status: raw.status } }); };

  const save = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    const d = editing.draft;
    const found: FieldErrors<keyof Draft> = { title: required(d.title, 'field.title'), tag: required(d.tag, 'field.tag'), excerpt: required(d.excerpt, 'field.excerpt'), body: required(d.body, 'field.body') ?? minLength(d.body, 20, 'field.body') };
    setErrs(found);
    if (hasErrors(found)) return;
    setSaving(true);
    try {
      if (editing.id) await services.articles.update(editing.id, toInput(d));
      else await services.articles.create(toInput(d));
      invalidateData();
      setFlash(editing.id ? t('ac.updated') : t('ac.created'));
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
      await services.articles.remove(toDelete.id);
      invalidateData();
      setFlash(t('ae.deleted', { name: toDelete.title }));
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
        <h1>{t('ac.title')}</h1>
        <div className={styles.tools}>
          <div className={styles.tool}><label className="eyebrow" htmlFor="ar-q">{t('common.search')}</label><input id="ar-q" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t('ac.searchPlaceholder')} /></div>
          <div className={styles.tool}><label className="eyebrow" htmlFor="ar-s">{t('col.status')}</label>
            <select id="ar-s" value={status} onChange={(e) => setStatus(e.target.value as ArticleStatus | '')}><option value="">{t('common.all')}</option><option value="Published">{te('status', 'Published')}</option><option value="Draft">{te('status', 'Draft')}</option></select></div>
          <Button icon={<Plus aria-hidden="true" />} onClick={openNew}>{t('ac.new')}</Button>
        </div>
      </div>
      {flash && <div role="status" className={styles.flash}>{flash}</div>}
      {q.status === 'loading' && <LoadingState />}
      {q.status === 'error' && <ErrorState message={q.error.message} onRetry={q.retry} />}
      {q.status === 'success' && rows.length === 0 && <EmptyState title={t('ac.emptyTitle')} action={<Button onClick={openNew}>{t('ac.new')}</Button>}>{t('ac.emptyText')}</EmptyState>}
      {q.status === 'success' && rows.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>{t('col.title')}</th><th>{t('col.tag')}</th><th>{t('col.status')}</th><th>{t('col.updated')}</th><th><span className="visually-hidden">{t('common.actions')}</span></th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td><div className={styles.name}>{a.status === 'Published' ? <Link to={`/resources/${a.slug}`}>{a.title}</Link> : a.title}</div><div className={styles.sub}>/{a.slug}</div></td>
                  <td>{a.tag}</td><td><Badge>{a.status}</Badge></td><td>{formatDate(a.updatedAt)}</td>
                  <td><div className={styles.rowActions}>
                    <button type="button" className={styles.iconBtn} aria-label={t('ae.editAria', { name: a.title })} onClick={() => openEdit(a)}><Pencil aria-hidden="true" /></button>
                    <button type="button" className={`${styles.iconBtn} ${styles.del}`} aria-label={t('ae.deleteAria', { name: a.title })} onClick={() => setToDelete(a)}><Trash2 aria-hidden="true" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={!!editing} title={editing?.id ? t('ac.editTitle') : t('ac.new')} onClose={() => !saving && setEditing(null)} wide
        footer={<><Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>{t('common.cancel')}</Button><Button type="submit" form="article-form" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</Button></>}>
        {editing && (
          <form id="article-form" className={styles.formGrid} onSubmit={save} noValidate>
            <div className={styles.full}><TextField label={t('field.title')} name="title" required value={editing.draft.title} error={errs.title} onChange={(e) => patch({ title: e.target.value })} /></div>
            <TextField label={t('field.tag')} name="tag" required value={editing.draft.tag} error={errs.tag} onChange={(e) => patch({ tag: e.target.value })} />
            <SelectField label={t('field.status')} name="status" value={editing.draft.status} onChange={(e) => patch({ status: e.target.value as ArticleStatus })} options={[{ value: 'Draft', label: te('status', 'Draft') }, { value: 'Published', label: te('status', 'Published') }]} />
            <div className={styles.full}><TextField label={t('field.excerpt')} name="excerpt" required value={editing.draft.excerpt} error={errs.excerpt} onChange={(e) => patch({ excerpt: e.target.value })} /></div>
            <div className={styles.full}><TextAreaField label={t('field.body')} name="body" rows={10} required value={editing.draft.body} error={errs.body} hint={t('ac.bodyHint')} onChange={(e) => patch({ body: e.target.value })} /></div>
          </form>
        )}
      </Dialog>
      <ConfirmDialog open={!!toDelete} title={t('ac.deleteTitle')} busy={deleting} confirmLabel={t('common.delete')} onCancel={() => setToDelete(null)} onConfirm={confirmDelete}
        message={<p>{t('ac.deleteMessage', { name: toDelete?.title ?? '' })}</p>} />
    </>
  );
}
