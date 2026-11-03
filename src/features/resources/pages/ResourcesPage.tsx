import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { formatDate } from '@/lib/format';
import { services } from '@/services';
import { useState } from 'react';
import styles from './ResourcePages.module.css';

export function ResourcesPage() {
  useDocumentTitle('Technical resources');
  const [term, setTerm] = useState('');
  const search = useDebouncedValue(term, 200);
  const q = useQuery(() => services.articles.list({ status: 'Published', search }), [search]);
  return (
    <>
      <PageHeader eyebrow="Technical resources" title="Notes from the bench" lede="General laboratory-practice articles written as sample editorial content for this demo." demoTag />
      <div className={`container ${styles.wrap}`}>
        <div className={styles.search}>
          <label htmlFor="res-search" className="eyebrow">Search articles</label>
          <input id="res-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Balance, safety, maintenance…" />
        </div>
        {q.status === 'loading' && <LoadingState label="Loading articles…" />}
        {q.status === 'error' && <ErrorState message={q.error.message} onRetry={q.retry} />}
        {q.status === 'success' && q.data.length === 0 && <EmptyState title="No articles found">Try a different search term.</EmptyState>}
        {q.status === 'success' && q.data.length > 0 && (
          <ul className={styles.list}>
            {q.data.map((a) => (
              <li key={a.id} className={styles.item}>
                <div className={styles.meta}>
                  <Badge>{a.tag}</Badge>
                  <time className="mono" dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
                </div>
                <h2><Link to={`/resources/${a.slug}`}>{a.title}</Link></h2>
                <p>{a.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
