import { useMemo } from 'react';
import { useI18n } from './I18nProvider';
import { localize, localizeAll, type Translatable } from './localize';

/** Returns localized copies of entities for the active language (memoized). */
export function useLocalizedList<T extends Translatable>(items: readonly T[] | undefined): T[] | undefined {
  const { lang } = useI18n();
  return useMemo(() => (items ? localizeAll(items, lang) : undefined), [items, lang]);
}

export function useLocalizedItem<T extends Translatable>(item: T | null | undefined): T | null | undefined {
  const { lang } = useI18n();
  return useMemo(() => (item ? localize(item, lang) : item), [item, lang]);
}
