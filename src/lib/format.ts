const dateFormats = new Map<string, Intl.DateTimeFormat>();
const monthFormats = new Map<string, Intl.DateTimeFormat>();

function locale(lang: string): string {
  // Western digits in both languages keep references, quantities and dates visually consistent.
  return lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB';
}

export function formatDate(iso: string, lang: string = 'en'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  let f = dateFormats.get(lang);
  if (!f) {
    f = new Intl.DateTimeFormat(locale(lang), { day: '2-digit', month: 'short', year: 'numeric' });
    dateFormats.set(lang, f);
  }
  return f.format(d);
}

/** Formats "YYYY-MM" as a short month name. */
export function formatMonth(yearMonth: string, lang: string = 'en'): string {
  const d = new Date(`${yearMonth}-01T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return yearMonth;
  let f = monthFormats.get(lang);
  if (!f) {
    f = new Intl.DateTimeFormat(locale(lang), { month: 'short', timeZone: 'UTC' });
    monthFormats.set(lang, f);
  }
  return f.format(d);
}
