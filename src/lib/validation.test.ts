import { describe, expect, it } from 'vitest';
import { validateMaintenance, validateQuotation } from '@/features/quotations/requestForms.logic';
import { hasErrors } from '@/lib/validation';
import { generateReference, uniqueSlug } from '@/lib/ids';

const goodQuote = { fullName: 'A B', organisation: 'Org', email: 'a@b.co', phone: '', equipmentSlug: '', quantity: '2', details: 'Need two units please' };

describe('quotation validation', () => {
  it('accepts a valid form', () => expect(hasErrors(validateQuotation(goodQuote))).toBe(false));
  it('flags required and malformed fields', () => {
    const e = validateQuotation({ ...goodQuote, fullName: ' ', email: 'nope', quantity: '0', details: 'short' });
    expect(e.fullName).toBeTruthy();
    expect(e.email).toMatch(/valid email/);
    expect(e.quantity).toBeTruthy();
    expect(e.details).toBeTruthy();
  });
});

describe('maintenance validation', () => {
  it('requires service type and urgency', () => {
    const e = validateMaintenance({ fullName: 'a', organisation: 'b', email: 'a@b.co', phone: '', equipmentDescription: 'x', serviceType: '', urgency: '', details: 'long enough text' });
    expect(e.serviceType).toBeTruthy();
    expect(e.urgency).toBeTruthy();
  });
});

describe('ids', () => {
  it('generates unique demo references', () => {
    const ref = generateReference('QT', new Set(), new Date('2026-11-03T10:00:00Z'));
    expect(ref).toMatch(/^DEMO-QT-20261103-[A-Z0-9]{4}$/);
  });
  it('makes unique slugs', () => expect(uniqueSlug('Hello World', new Set(['hello-world']))).toBe('hello-world-2'));
});
