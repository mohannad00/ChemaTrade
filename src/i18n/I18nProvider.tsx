import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { safeStorage } from '@/lib/storage';
import type { FieldError } from '@/lib/validation';
import { formatDate as fmtDate, formatMonth as fmtMonth } from '@/lib/format';
import { en, type MessageKey } from './messages.en';
import { ar } from './messages.ar';

export type Lang = 'en' | 'ar';
export const LANGS: readonly Lang[] = ['en', 'ar'];
export const DIRECTION: Record<Lang, 'ltr' | 'rtl'> = { en: 'ltr', ar: 'rtl' };
export const LANG_STORAGE_KEY = 'chematrade.lang.v1';

const DICTIONARIES: Record<Lang, Record<MessageKey, string>> = { en, ar };

export type Params = Record<string, string | number>;

/** Pure translation lookup: falls back to English, then to the key itself. */
export function translate(lang: Lang, key: string, params?: Params): string {
  const dict = DICTIONARIES[lang] as Record<string, string>;
  const raw = dict[key] ?? (en as Record<string, string>)[key] ?? key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}

export function hasMessage(key: string): key is MessageKey {
  return key in en;
}

function initialLang(): Lang {
  const stored = safeStorage.get(LANG_STORAGE_KEY);
  if (stored === 'en' || stored === 'ar') return stored;
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

interface I18nValue {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: MessageKey, params?: Params) => string;
  /** Translates a data enum (e.g. a status) using `${group}.${value}`; unknown values are shown as-is. */
  te: (group: string, value: string) => string;
  /** Translates a structured validation error. */
  tErr: (error: FieldError | undefined) => string | undefined;
  formatDate: (iso: string) => string;
  formatMonth: (yearMonth: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = DIRECTION[lang];
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    safeStorage.set(LANG_STORAGE_KEY, next);
    setLangState(next);
  }, []);

  const value = useMemo<I18nValue>(() => {
    const t: I18nValue['t'] = (key, params) => translate(lang, key, params);
    const te: I18nValue['te'] = (group, value) => {
      const key = `${group}.${value}`;
      return hasMessage(key) ? translate(lang, key) : value;
    };
    return {
      lang,
      dir: DIRECTION[lang],
      setLang,
      toggleLang: () => setLang(lang === 'en' ? 'ar' : 'en'),
      t,
      te,
      tErr: (e) => (e ? t(e.key, { label: e.labelKey ? t(e.labelKey) : '', n: e.n ?? 0 }) : undefined),
      formatDate: (iso) => fmtDate(iso, lang),
      formatMonth: (ym) => fmtMonth(ym, lang),
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
