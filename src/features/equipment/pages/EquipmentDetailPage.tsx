import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '@/components/ui/PageHeader';
import { Badge, DemoTag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { DEMO_DISCLAIMER } from '@/config/app.config';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { services } from '@/services';
import { NotFoundContent } from '@/features/company/pages/NotFoundPage';
import { formatDate } from '@/lib/format';
import { EquipmentCard } from '../components/EquipmentCard';
import styles from './EquipmentDetailPage.module.css';

export function EquipmentDetailPage() {
  const { slug = '' } = useParams();
  const item = useQuery(() => services.equipment.getBySlug(slug), [slug]);
  const categories = useQuery(() => services.categories.list(), []);
  const related = useQuery(
    async () => {
      const current = await services.equipment.getBySlug(slug);
      if (!current) return [];
      const cat = (await services.categories.list()).find((c) => c.id === current.categoryId);
      const same = await services.equipment.list({ categorySlug: cat?.slug });
      return same.filter((e) => e.id !== current.id).slice(0, 3);
    },
    [slug],
  );
  useDocumentTitle(item.data?.name ?? 'Equipment');

  if (item.status === 'loading') return <div className={`container ${styles.pad}`}><LoadingState label="Loading equipment…" /></div>;
  if (item.status === 'error') return <div className={`container ${styles.pad}`}><ErrorState message={item.error.message} onRetry={item.retry} /></div>;
  if (!item.data) return <NotFoundContent title="Equipment not found" message="This sample item does not exist, or was deleted in the demo dashboard." backTo="/equipment" backLabel="Back to catalog" />;

  const e = item.data;
  const category = categories.data?.find((c) => c.id === e.categoryId);

  return (
    <article className={`container ${styles.wrap}`}>
      <Breadcrumbs items={[{ label: 'Equipment', to: '/equipment' }, ...(category ? [{ label: category.name, to: `/equipment?category=${category.slug}` }] : []), { label: e.name }]} />
      <div className={styles.head}>
        <div>
          <p className="eyebrow">{category?.name ?? 'Equipment'}</p>
          <h1>{e.name}</h1>
          <p className="lede">{e.summary}</p>
          <div className={styles.badges}><Badge>{e.status}</Badge><DemoTag>Demo content</DemoTag></div>
        </div>
        <div className={styles.aside}>
          <p className="eyebrow">Next step</p>
          <p>Ask Chema Trade to confirm availability, configuration and a real quotation for this type of equipment.</p>
          <Button to={`/request-quote?equipment=${e.slug}`}>Request a quotation</Button>
          <Button to="/contact" variant="secondary">Ask a question</Button>
        </div>
      </div>

      <div className={styles.body}>
        <section aria-labelledby="desc-h">
          <h2 id="desc-h">Description</h2>
          <p className={styles.desc}>{e.description}</p>
          {e.illustrativePrice && <p className={`mono ${styles.price}`}>{e.illustrativePrice}</p>}
        </section>
        <section aria-labelledby="spec-h">
          <h2 id="spec-h">Technical specifications</h2>
          <p className={`mono ${styles.specNote}`}>Sample specifications — illustrative only.</p>
          <table className={styles.specs}>
            <caption className="visually-hidden">Sample technical specifications for {e.name}</caption>
            <tbody>
              {e.specs.map((s) => (
                <tr key={s.label}><th scope="row">{s.label}</th><td>{s.value}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <Notice tone="demo" title="Confirm before relying on this">{DEMO_DISCLAIMER} Last edited in the demo: {formatDate(e.updatedAt)}.</Notice>

      {related.status === 'success' && related.data.length > 0 && (
        <section aria-labelledby="rel-h" className={styles.related}>
          <h2 id="rel-h">Related sample equipment</h2>
          <ul className={styles.relGrid}>
            {related.data.map((r) => <li key={r.id}><EquipmentCard item={r} categoryName={category?.name} /></li>)}
          </ul>
        </section>
      )}
    </article>
  );
}
