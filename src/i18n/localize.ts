import type { Lang } from './I18nProvider';

/** Entities that carry optional per-language text overrides (used by seeded demo content). */
export interface Translatable {
  i18n?: Partial<Record<Exclude<Lang, 'en'>, object>>;
}

/**
 * Returns the item with its translated fields applied for `lang`.
 * The overrides are authored per entity as a subset of its own fields, so the merge keeps the original type.
 */
export function localize<T extends Translatable>(item: T, lang: Lang): T {
  if (lang === 'en') return item;
  const overrides = item.i18n?.[lang];
  return overrides ? ({ ...item, ...overrides } as T) : item;
}

export function localizeAll<T extends Translatable>(items: readonly T[], lang: Lang): T[] {
  return items.map((i) => localize(i, lang));
}

/** All translated strings of an item, so searches also match Arabic text. */
export function translatedSearchText(item: Translatable): string {
  return item.i18n ? JSON.stringify(item.i18n) : '';
}
