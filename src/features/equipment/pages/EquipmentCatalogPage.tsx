import { useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { DEMO_DISCLAIMER } from '@/config/app.config';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { services } from '@/services';
import { EQUIPMENT_STATUSES, type EquipmentStatus } from '../equipment.types';
import { EquipmentCard } from '../components/EquipmentCard';
import styles from './EquipmentCatalogPage.module.css';

function parseStatus(v: string | null): EquipmentStatus | undefined {
  return EQUIPMENT_STATUSES.find((s) => s === v);
}

export function EquipmentCatalogPage() {
  useDocumentTitle('Equipment catalog');
  const [params, setParams] = useSearchParams();
  const categorySlug = params.get('category') ?? undefined;
  const status = parseStatus(params.get('status'));
  const [searchInput, setSearchInput] = useState(params.get('q') ?? '');
  const search = useDebouncedValue(searchInput, 250);

  const categories = useQuery(() => services.categories.list(), []);
  const items = useQuery(() => services.equipment.list({ categorySlug, status, search }), [categorySlug, status, search]);

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const clearAll = () => {
    setSearchInput('');
    setParams(new URLSearchParams(), { replace: true });
  };

  const catName = (id: string) => categories.data?.find((c) => c.id === id)?.name;
  const activeCategory = categories.data?.find((c) => c.slug === categorySlug);
  const filtered = !!(categorySlug || status || search);

  return (
    <>
      <PageHeader
        eyebrow="Equipment catalog"
        title={activeCategory ? activeCategory.name : 'Laboratory equipment'}
        lede={activeCategory?.description ?? 'Browse sample equipment by category. Every entry here is demonstration content: request a quotation to have availability and specifications confirmed.'}
        demoTag
      />
      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar} aria-label="Filters">
          <form role="search" onSubmit={(e) => e.preventDefault()} className={styles.search}>
            <label htmlFor="catalog-search" className="eyebrow">Search</label>
            <div className={styles.searchBox}>
              <Search aria-hidden="true" />
              <input id="catalog-search" type="search" value={searchInput} onChange={(e) => { setSearchInput(e.target.value); setParam('q', e.target.value.trim() || undefined); }} placeholder="Name or specification" />
            </div>
          </form>

          <nav aria-label="Categories" className={styles.group}>
            <h2 className="eyebrow">Category</h2>
            <ul>
              <li><button type="button" className={styles.filter} aria-pressed={!categorySlug} onClick={() => setParam('category', undefined)}>All categories</button></li>
              {categories.data?.map((c) => (
                <li key={c.id}>
                  <button type="button" className={styles.filter} aria-pressed={categorySlug === c.slug} onClick={() => setParam('category', c.slug)}>{c.name}</button>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.group} role="group" aria-labelledby="status-h">
            <h2 id="status-h" className="eyebrow">Status</h2>
            <ul>
              <li><button type="button" className={styles.filter} aria-pressed={!status} onClick={() => setParam('status', undefined)}>Any status</button></li>
              {EQUIPMENT_STATUSES.map((s) => (
                <li key={s}><button type="button" className={styles.filter} aria-pressed={status === s} onClick={() => setParam('status', s)}>{s}</button></li>
              ))}
            </ul>
          </div>
          {filtered && <Button variant="secondary" size="sm" onClick={clearAll}>Clear filters</Button>}
        </aside>

        <section aria-label="Results" className={styles.results}>
          <Notice tone="demo" title="Demo content">{DEMO_DISCLAIMER} “Available” is a sample label, not a stock claim.</Notice>
          <p className={`mono ${styles.count}`} aria-live="polite">{items.status === 'success' ? `${items.data.length} sample ${items.data.length === 1 ? 'item' : 'items'}` : ' '}</p>
          {items.status === 'loading' && <LoadingState label="Loading equipment…" />}
          {items.status === 'error' && <ErrorState message={items.error.message} onRetry={items.retry} />}
          {items.status === 'success' && items.data.length === 0 && (
            <EmptyState title="No equipment matches" action={filtered ? <Button variant="secondary" onClick={clearAll}>Clear filters</Button> : undefined}>
              Try a different category or search term, or request a quotation for something specific.
            </EmptyState>
          )}
          {items.status === 'success' && items.data.length > 0 && (
            <ul className={styles.grid}>
              {items.data.map((e) => (
                <li key={e.id}><EquipmentCard item={e} categoryName={catName(e.categoryId)} /></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
