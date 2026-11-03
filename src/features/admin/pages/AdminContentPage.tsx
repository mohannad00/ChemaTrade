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
import { invalidateData } from '@/lib/dataVersion';
import { formatDate } from '@/lib/format';
import { minLength, required } from '@/lib/validation';
import { services } from '@/services';
import type { Article, ArticleInput, ArticleStatus } from '@/features/resources/resources.types';
import { useFlash } from '../components/useFlash';
import styles from '../components/Admin.module.css';

interface Draft { title: string; tag: string; excerpt: string; body: string; status: ArticleStatus }
const blank: Draft = { title: '', tag: '', excerpt: '', body: '', status: 'Draft' };
const toInput = (d: Draft): ArticleInput => ({ title: d.title.trim(), tag: d.tag.trim(), excerpt: d.excerpt.trim(), body: d.body.trim(), status: d.status });
type Errs = Partial<Record<keyof Draft, string>>;

export function AdminContentPage() {
  useDocumentTitle('Content management (demo)');
  const [term, setTerm] = useState('');
  const search = useDebouncedValue(term, 200);
  const [status, setStatus] = useState<ArticleStatus | ''>('');
  const q = useQuery(() => services.articles.list({ search, status: status || undefined }), [search, status]);
  const [flash, setFlash] = useFlash();
  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null);
  const [errs, setErrs] = useState<Errs>({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  const patch = (p: Partial<Draft>) => setEditing((s) => (s ? { ...s, draft: { ...s.draft, ...p } } : s));
  const openNew = () => { setErrs({}); setEditing({ id: null, draft: blank }); };
  const openEdit = (a: Article) => { setErrs({}); setEditing({ id: a.id, draft: { title: a.title, tag: a.tag, excerpt: a.excerpt, body: a.body, status: a.status } }); };

  const save = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    const d = editing.draft;
    const found: Errs = { title: required(d.title, 'Title'), tag: required(d.tag, 'Tag'), excerpt: required(d.excerpt, 'Excerpt'), body: required(d.body, 'Body') ?? minLength(d.body, 20, 'Body') };
    setErrs(found);
    if (Object.values(found).some(Boolean)) return;
    setSaving(true);
    try {
      if (editing.id) await services.articles.update(editing.id, toInput(d));
      else await services.articles.create(toInput(d));
      invalidateData();
      setFlash(editing.id ? 'Article updated.' : 'Article created.');
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
      await services.articles.remove(toDelete.id);
      invalidateData();
      setFlash(`Deleted “${toDelete.title}”.`);
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
        <h1>Content</h1>
        <div className={styles.tools}>
          <div className={styles.tool}><label className="eyebrow" htmlFor="ar-q">Search</label><input id="ar-q" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Title, tag" /></div>
          <div className={styles.tool}><label className="eyebrow" htmlFor="ar-s">Status</label>
            <select id="ar-s" value={status} onChange={(e) => setStatus(e.target.value as ArticleStatus | '')}><option value="">All</option><option>Published</option><option>Draft</option></select></div>
          <Button icon={<Plus aria-hidden="true" />} onClick={openNew}>New article</Button>
        </div>
      </div>
      {flash && <div role="status" className={styles.flash}>{flash}</div>}
      {q.status === 'loading' && <LoadingState />}
      {q.status === 'error' && <ErrorState message={q.error.message} onRetry={q.retry} />}
      {q.status === 'success' && q.data.length === 0 && <EmptyState title="No articles" action={<Button onClick={openNew}>New article</Button>}>Create a demo article to see it appear in Technical Resources once published.</EmptyState>}
      {q.status === 'success' && q.data.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Title</th><th>Tag</th><th>Status</th><th>Updated</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
            <tbody>
              {q.data.map((a) => (
                <tr key={a.id}>
                  <td><div className={styles.name}>{a.status === 'Published' ? <Link to={`/resources/${a.slug}`}>{a.title}</Link> : a.title}</div><div className={styles.sub}>/{a.slug}</div></td>
                  <td>{a.tag}</td><td><Badge>{a.status}</Badge></td><td>{formatDate(a.updatedAt)}</td>
                  <td><div className={styles.rowActions}>
                    <button type="button" className={styles.iconBtn} aria-label={`Edit ${a.title}`} onClick={() => openEdit(a)}><Pencil aria-hidden="true" /></button>
                    <button type="button" className={`${styles.iconBtn} ${styles.del}`} aria-label={`Delete ${a.title}`} onClick={() => setToDelete(a)}><Trash2 aria-hidden="true" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={!!editing} title={editing?.id ? 'Edit article' : 'New article'} onClose={() => !saving && setEditing(null)} wide
        footer={<><Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button><Button type="submit" form="article-form" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button></>}>
        {editing && (
          <form id="article-form" className={styles.formGrid} onSubmit={save} noValidate>
            <div className={styles.full}><TextField label="Title" name="title" required value={editing.draft.title} error={errs.title} onChange={(e) => patch({ title: e.target.value })} /></div>
            <TextField label="Tag" name="tag" required value={editing.draft.tag} error={errs.tag} onChange={(e) => patch({ tag: e.target.value })} />
            <SelectField label="Status" name="status" value={editing.draft.status} onChange={(e) => patch({ status: e.target.value as ArticleStatus })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Published', label: 'Published' }]} />
            <div className={styles.full}><TextField label="Excerpt" name="excerpt" required value={editing.draft.excerpt} error={errs.excerpt} onChange={(e) => patch({ excerpt: e.target.value })} /></div>
            <div className={styles.full}><TextAreaField label="Body" name="body" rows={10} required value={editing.draft.body} error={errs.body} hint="Separate paragraphs with a blank line. Start a line with “## ” for a subheading." onChange={(e) => patch({ body: e.target.value })} /></div>
          </form>
        )}
      </Dialog>
      <ConfirmDialog open={!!toDelete} title="Delete article?" busy={deleting} confirmLabel="Delete" onCancel={() => setToDelete(null)} onConfirm={confirmDelete}
        message={<p>“{toDelete?.title}” will be removed from the demo. You can restore it with “Reset demo data”.</p>} />
    </>
  );
}
