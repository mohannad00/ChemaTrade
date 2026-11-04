import { describe, expect, it } from 'vitest';
import { en } from './messages.en';
import { ar } from './messages.ar';
import { translate } from './I18nProvider';
import { formatDate, formatMonth } from '@/lib/format';
import { mockEquipment } from '@/data/mock/equipment';
import { mockCategories } from '@/data/mock/categories';
import { mockArticles } from '@/data/mock/articles';
import { mockMaintenanceServices, mockSparePartGroups } from '@/data/mock/maintenance';
import { localize } from './localize';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const ARABIC = /[\u0600-\u06FF]/;

describe('i18n dictionaries', () => {
  it('Arabic has exactly the English keys', () => {
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
  });
  it('every Arabic message keeps the same placeholders as English', () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) expect(placeholders(ar[key]), key).toBe(placeholders(en[key]));
  });
  it('every Arabic message is non-empty', () => {
    for (const [k, v] of Object.entries(ar)) expect(v.trim().length, k).toBeGreaterThan(0);
  });
});

describe('translate()', () => {
  it('interpolates params', () => {
    expect(translate('en', 'catalog.count', { n: 3 })).toBe('Sample items: 3');
    expect(translate('ar', 'catalog.count', { n: 3 })).toContain('3');
  });
  it('falls back to the key for unknown keys', () => expect(translate('ar', 'nope.missing')).toBe('nope.missing'));
});

describe('date formatting', () => {
  it('formats per language with Latin digits', () => {
    expect(formatDate('2026-10-20T10:00:00Z', 'en')).toMatch(/Oct/);
    expect(formatDate('2026-10-20T10:00:00Z', 'ar')).toMatch(/2026/);
    expect(formatMonth('2026-10', 'ar')).toMatch(ARABIC);
  });
});

describe('Arabic sample content', () => {
  const sets: [string, { id: string; i18n?: { ar?: object } }[]][] = [
    ['categories', mockCategories], ['equipment', mockEquipment], ['articles', mockArticles],
    ['maintenance services', mockMaintenanceServices], ['spare parts', mockSparePartGroups],
  ];
  for (const [name, items] of sets) {
    it(`every ${name} item has an Arabic translation`, () => {
      for (const item of items) expect(item.i18n?.ar, `${name}:${item.id}`).toBeDefined();
    });
  }
  it('translated equipment keeps spec rows aligned with the English original', () => {
    for (const e of mockEquipment) expect(localize(e, 'ar').specs.length, e.id).toBe(e.specs.length);
  });
  it('localize() returns the Arabic name, and English is untouched', () => {
    const e = mockEquipment[0]!;
    expect(localize(e, 'ar').name).toMatch(ARABIC);
    expect(localize(e, 'en').name).toBe(e.name);
  });
});
