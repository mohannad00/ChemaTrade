import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { translatedSearchText } from '@/i18n/localize';
import { useLocalizedList } from '@/i18n/useLocalized';
import { services } from '@/services';
import styles from './ResourcePages.module.css';

export function ResourcesPage() {
  const { t, formatDate } = useI18n();
  useDocumentTitle(t('res.eyebrow'));
  const [term, setTerm] = useState('');
  const search = useDebouncedValue(term, 200);
  const q = useQuery(() => services.articles.list({ status: 'Published' }), []);
  const list = useLocalizedList(q.data);
  const needle = search.trim().toLowerCase();
  const shown = list?.filter((a) => !needle || `${a.title} ${a.excerpt} ${a.tag} ${translatedSearchText(a)}`.toLowerCase().includes(needle));
  return (
    <>
      <PageHeader eyebrow={t('res.eyebrow')} title={t('res.title')} lede={t('res.lede')} demoTag />
      <div className={`container ${styles.wrap}`}>
        <div className={styles.search}>
          <label htmlFor="res-search" className="eyebrow">{t('res.search')}</label>
          <input id="res-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t('res.searchPlaceholder')} />
        </div>
        {q.status === 'loading' && <LoadingState label={t('res.loading')} />}
        {q.status === 'error' && <ErrorState message={q.error.message} onRetry={q.retry} />}
        {shown && shown.length === 0 && <EmptyState title={t('res.emptyTitle')}>{t('res.emptyText')}</EmptyState>}
        {shown && shown.length > 0 && (
          <ul className={`${styles.list} stagger`}>
            {shown.map((a) => (
              <li key={a.id} className={styles.item} data-glow>
                <div className={styles.meta}>
                  <Badge raw>{a.tag}</Badge>
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
