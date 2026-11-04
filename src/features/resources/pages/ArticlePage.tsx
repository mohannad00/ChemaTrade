import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '@/components/ui/PageHeader';
import { Badge, DemoTag } from '@/components/ui/Badge';
import { ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { NotFoundContent } from '@/features/company/pages/NotFoundPage';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { useLocalizedItem } from '@/i18n/useLocalized';
import { services } from '@/services';
import { ArticleBody } from '../components/ArticleBody';
import styles from './ResourcePages.module.css';

export function ArticlePage() {
  const { slug = '' } = useParams();
  const { t, formatDate } = useI18n();
  const q = useQuery(() => services.articles.getBySlug(slug), [slug]);
  const a = useLocalizedItem(q.data);
  useDocumentTitle(a?.title ?? t('res.eyebrow'));

  if (q.status === 'loading') return <div className={`container ${styles.pad}`}><LoadingState label={t('article.loading')} /></div>;
  if (q.status === 'error') return <div className={`container ${styles.pad}`}><ErrorState message={q.error.message} onRetry={q.retry} /></div>;
  if (!a) return <NotFoundContent title={t('article.notFoundTitle')} message={t('article.notFoundText')} backTo="/resources" backLabel={t('article.notFoundBack')} />;
  return (
    <article className={`container ${styles.article}`}>
      <Breadcrumbs items={[{ label: t('nav.resources'), to: '/resources' }, { label: a.title }]} />
      <header className={styles.ahead}>
        <div className={styles.meta}><Badge raw>{a.tag}</Badge><DemoTag>{t('article.sample')}</DemoTag></div>
        <h1>{a.title}</h1>
        <p className="lede">{a.excerpt}</p>
        <p className={styles.byline}>{a.author} · <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time></p>
      </header>
      <ArticleBody body={a.body} />
      <Notice tone="demo" title={t('article.noticeTitle')}>{t('article.notice')}</Notice>
      <p><Link to="/resources">{t('article.back')}</Link></p>
    </article>
  );
}
