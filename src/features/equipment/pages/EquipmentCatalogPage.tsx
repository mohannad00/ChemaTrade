import { useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState, Notice } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { useDebouncedValue, useDocumentTitle } from '@/hooks/common';
import { useQuery } from '@/hooks/useQuery';
import { useI18n } from '@/i18n/I18nProvider';
import { translatedSearchText } from '@/i18n/localize';
import { useLocalizedList } from '@/i18n/useLocalized';
import { services } from '@/services';
import { EQUIPMENT_STATUSES, type EquipmentStatus } from '../equipment.types';
import { EquipmentCard } from '../components/EquipmentCard';
import styles from './EquipmentCatalogPage.module.css';

function parseStatus(v: string | null): EquipmentStatus | undefined {
  return EQUIPMENT_STATUSES.find((s) => s === v);
}

export function EquipmentCatalogPage() {
  const { t, te } = useI18n();
  useDocumentTitle(t('catalog.eyebrow'));
  const [params, setParams] = useSearchParams();
  const categorySlug = params.get('category') ?? undefined;
  const status = parseStatus(params.get('status'));
  const [searchInput, setSearchInput] = useState(params.get('q') ?? '');
  const search = useDebouncedValue(searchInput, 250);

  const categories = useQuery(() => services.categories.list(), []);
  const items = useQuery(() => services.equipment.list({ categorySlug, status }), [categorySlug, status]);
  const cats = useLocalizedList(categories.data);
  const localized = useLocalizedList(items.data);

  const needle = search.trim().toLowerCase();
  const shown = localized?.filter((e) => !needle || `${e.name} ${e.summary} ${e.specs.map((s) => s.value).join(' ')} ${translatedSearchText(e)}`.toLowerCase().includes(needle));

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

  const catName = (id: string) => cats?.find((c) => c.id === id)?.name;
  const activeCategory = cats?.find((c) => c.slug === categorySlug);
  const filtered = !!(categorySlug || status || search);

  return (
    <>
      <PageHeader eyebrow={t('catalog.eyebrow')} title={activeCategory ? activeCategory.name : t('catalog.title')} lede={activeCategory?.description ?? t('catalog.lede')} demoTag />
      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar} aria-label={t('catalog.filters')}>
          <form role="search" onSubmit={(e) => e.preventDefault()} className={styles.search}>
            <label htmlFor="catalog-search" className="eyebrow">{t('common.search')}</label>
            <div className={styles.searchBox}>
              <Search aria-hidden="true" />
              <input id="catalog-search" type="search" value={searchInput} onChange={(e) => { setSearchInput(e.target.value); setParam('q', e.target.value.trim() || undefined); }} placeholder={t('catalog.searchPlaceholder')} />
            </div>
          </form>

          <nav aria-label={t('catalog.category')} className={styles.group}>
            <h2 className="eyebrow">{t('catalog.category')}</h2>
            <ul>
              <li><button type="button" className={styles.filter} aria-pressed={!categorySlug} onClick={() => setParam('category', undefined)}>{t('catalog.allCategories')}</button></li>
              {cats?.map((c) => (
                <li key={c.id}>
                  <button type="button" className={styles.filter} aria-pressed={categorySlug === c.slug} onClick={() => setParam('category', c.slug)}>{c.name}</button>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.group} role="group" aria-labelledby="status-h">
            <h2 id="status-h" className="eyebrow">{t('catalog.status')}</h2>
            <ul>
              <li><button type="button" className={styles.filter} aria-pressed={!status} onClick={() => setParam('status', undefined)}>{t('catalog.anyStatus')}</button></li>
              {EQUIPMENT_STATUSES.map((s) => (
                <li key={s}><button type="button" className={styles.filter} aria-pressed={status === s} onClick={() => setParam('status', s)}>{te('status', s)}</button></li>
              ))}
            </ul>
          </div>
          {filtered && <Button variant="secondary" size="sm" onClick={clearAll}>{t('common.clearFilters')}</Button>}
        </aside>

        <section aria-label={t('catalog.results')} className={styles.results}>
          <Notice tone="demo" title={t('common.demoContent')}>{t('demo.disclaimer')} {t('catalog.availableNote')}</Notice>
          <p className={`mono ${styles.count}`} aria-live="polite">{shown ? t('catalog.count', { n: shown.length }) : ' '}</p>
          {items.status === 'loading' && <LoadingState label={t('catalog.loading')} />}
          {items.status === 'error' && <ErrorState message={items.error.message} onRetry={items.retry} />}
          {shown && shown.length === 0 && (
            <EmptyState title={t('catalog.emptyTitle')} action={filtered ? <Button variant="secondary" onClick={clearAll}>{t('common.clearFilters')}</Button> : undefined}>
              {t('catalog.emptyText')}
            </EmptyState>
          )}
          {shown && shown.length > 0 && (
            <ul className={`${styles.grid} stagger`} key={`${categorySlug}|${status}|${needle}`}>
              {shown.map((e) => (
                <li key={e.id}><EquipmentCard item={e} categoryName={catName(e.categoryId)} /></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
