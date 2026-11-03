import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '@/components/ui/PageHeader';
import { Badge, DemoTag } from '@/components/ui/Badge';
import { ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { NotFoundContent } from '@/features/company/pages/NotFoundPage';
import { useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { formatDate } from '@/lib/format';
import { services } from '@/services';
import { ArticleBody } from '../components/ArticleBody';
import styles from './ResourcePages.module.css';

export function ArticlePage() {
  const { slug = '' } = useParams();
  const q = useQuery(() => services.articles.getBySlug(slug), [slug]);
  useDocumentTitle(q.data?.title ?? 'Article');

  if (q.status === 'loading') return <div className={`container ${styles.pad}`}><LoadingState label="Loading article…" /></div>;
  if (q.status === 'error') return <div className={`container ${styles.pad}`}><ErrorState message={q.error.message} onRetry={q.retry} /></div>;
  if (!q.data) return <NotFoundContent title="Article not found" message="This article does not exist or has not been published." backTo="/resources" backLabel="Back to resources" />;
  const a = q.data;
  return (
    <article className={`container ${styles.article}`}>
      <Breadcrumbs items={[{ label: 'Resources', to: '/resources' }, { label: a.title }]} />
      <header className={styles.ahead}>
        <div className={styles.meta}><Badge>{a.tag}</Badge><DemoTag>Sample article</DemoTag></div>
        <h1>{a.title}</h1>
        <p className="lede">{a.excerpt}</p>
        <p className="mono">{a.author} · <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time></p>
      </header>
      <ArticleBody body={a.body} />
      <Notice tone="demo" title="General information only">This is sample editorial content for the demo and is not professional, safety or regulatory advice. Follow your instrument manufacturer’s instructions and your organisation’s procedures.</Notice>
      <p><Link to="/resources">← All resources</Link></p>
    </article>
  );
}
