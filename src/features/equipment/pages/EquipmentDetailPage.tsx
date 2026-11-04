import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '@/components/ui/PageHeader';
import { Badge, DemoTag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EquipmentImage } from '@/components/ui/EquipmentImage';
import { ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { useLocalizedItem, useLocalizedList } from '@/i18n/useLocalized';
import { services } from '@/services';
import { NotFoundContent } from '@/features/company/pages/NotFoundPage';
import { EquipmentCard } from '../components/EquipmentCard';
import styles from './EquipmentDetailPage.module.css';

export function EquipmentDetailPage() {
  const { slug = '' } = useParams();
  const { t, formatDate } = useI18n();
  const raw = useQuery(() => services.equipment.getBySlug(slug), [slug]);
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
  const item = useLocalizedItem(raw.data);
  const cats = useLocalizedList(categories.data);
  const relatedItems = useLocalizedList(related.data);
  useDocumentTitle(item?.name ?? t('common.equipment'));

  if (raw.status === 'loading') return <div className={`container ${styles.pad}`}><LoadingState label={t('catalog.loading')} /></div>;
  if (raw.status === 'error') return <div className={`container ${styles.pad}`}><ErrorState message={raw.error.message} onRetry={raw.retry} /></div>;
  if (!item) return <NotFoundContent title={t('detail.notFoundTitle')} message={t('detail.notFoundText')} backTo="/equipment" backLabel={t('detail.back')} />;

  const category = cats?.find((c) => c.id === item.categoryId);

  return (
    <article className={`container ${styles.wrap}`}>
      <Breadcrumbs items={[{ label: t('nav.equipment'), to: '/equipment' }, ...(category ? [{ label: category.name, to: `/equipment?category=${category.slug}` }] : []), { label: item.name }]} />
      <div className={styles.head}>
        <div>
          <p className="eyebrow">{category?.name ?? t('common.equipment')}</p>
          <h1>{item.name}</h1>
          <p className="lede">{item.summary}</p>
          <div className={styles.badges}><Badge>{item.status}</Badge><DemoTag>{t('common.demoContent')}</DemoTag></div>
        </div>
        <div className={styles.side}>
        <EquipmentImage src={item.image} name={item.name} className={styles.hero} eager />
        <div className={styles.aside}>
          <p className="eyebrow">{t('detail.nextStep')}</p>
          <p>{t('detail.nextText')}</p>
          <Button to={`/request-quote?equipment=${item.slug}`}>{t('detail.request')}</Button>
          <Button to="/contact" variant="secondary">{t('detail.ask')}</Button>
        </div>
        </div>
      </div>

      <div className={styles.body}>
        <section aria-labelledby="desc-h">
          <h2 id="desc-h">{t('detail.description')}</h2>
          <p className={styles.desc}>{item.description}</p>
          {item.illustrativePrice && <p className={styles.price}>{item.illustrativePrice}</p>}
        </section>
        <section aria-labelledby="spec-h">
          <h2 id="spec-h">{t('detail.specs')}</h2>
          <p className={styles.specNote}>{t('detail.specNote')}</p>
          <table className={styles.specs}>
            <caption className="visually-hidden">{t('detail.specCaption', { name: item.name })}</caption>
            <tbody>
              {item.specs.map((s) => (
                <tr key={s.label}><th scope="row">{s.label}</th><td>{s.value}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <Notice tone="demo" title={t('detail.confirmTitle')}>{t('demo.disclaimer')} {t('detail.lastEdited', { date: formatDate(item.updatedAt) })}</Notice>

      {relatedItems && relatedItems.length > 0 && (
        <section aria-labelledby="rel-h" className={styles.related}>
          <h2 id="rel-h">{t('detail.related')}</h2>
          <ul className={`${styles.relGrid} stagger`}>
            {relatedItems.map((r) => <li key={r.id}><EquipmentCard item={r} categoryName={category?.name} /></li>)}
          </ul>
        </section>
      )}
    </article>
  );
}
