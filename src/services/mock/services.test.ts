import { beforeEach, describe, expect, it } from 'vitest';
import { services } from '@/services';
import { __discardMemoryForTests, resetState } from '@/services/mock/store';

describe('mock services', () => {
  beforeEach(() => resetState());

  it('creates a quotation that appears in the list with a demo reference', async () => {
    const created = await services.quotations.create({ fullName: 'T', organisation: 'O', email: 'a@b.co', equipmentName: 'General enquiry', quantity: 1, details: 'Testing the demo flow' });
    expect(created.reference.startsWith('DEMO-QT-')).toBe(true);
    expect((await services.quotations.list()).some((q) => q.id === created.id)).toBe(true);
  });

  it('persists across a reload and clears on reset', async () => {
    await services.equipment.remove('eq-001');
    __discardMemoryForTests();
    expect(await services.equipment.getBySlug('binocular-compound-microscope-demo')).toBeNull();
    await services.demo.resetDemoData();
    expect(await services.equipment.getBySlug('binocular-compound-microscope-demo')).not.toBeNull();
  });

  it('hides draft articles from public lookups', async () => {
    expect(await services.articles.getBySlug('writing-a-good-quotation-request')).toBeNull();
    expect(await services.articles.getBySlug('writing-a-good-quotation-request', { includeDrafts: true })).not.toBeNull();
  });
});
