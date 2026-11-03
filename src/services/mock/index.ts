import { delay, commit, getState } from './store';
import { mockCategories } from '@/data/mock/categories';
import { mockMaintenanceServices, mockSparePartGroups } from '@/data/mock/maintenance';
import { mockDashboardBaseline } from '@/data/mock/dashboard';
import { randomId, slugify, uniqueSlug, generateReference } from '@/lib/ids';
import type { CategoryService, EquipmentService } from '../interfaces/equipment.service';
import type { MaintenanceService, QuotationService } from '../interfaces/requests.service';
import type { ArticleService, DashboardService, DemoControlService } from '../interfaces/content.service';
import type { Equipment } from '@/features/equipment/equipment.types';
import type { Article } from '@/features/resources/resources.types';
import type { DashboardStats } from '@/features/admin/admin.types';
import { resetState } from './store';

function byDateDesc<T extends { createdAt?: string; publishedAt?: string }>(a: T, b: T): number {
  return (b.createdAt ?? b.publishedAt ?? '').localeCompare(a.createdAt ?? a.publishedAt ?? '');
}

function fail(message: string): never {
  throw new Error(message);
}

export const mockCategoryService: CategoryService = {
  async list() {
    await delay(150);
    return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  },
};

export const mockEquipmentService: EquipmentService = {
  async list(filter = {}) {
    await delay();
    const cat = filter.categorySlug ? mockCategories.find((c) => c.slug === filter.categorySlug) : undefined;
    const q = filter.search?.trim().toLowerCase();
    return getState()
      .equipment.filter((e) => {
        if (filter.categorySlug && e.categoryId !== cat?.id) return false;
        if (filter.status && e.status !== filter.status) return false;
        if (filter.featuredOnly && !e.featured) return false;
        if (q && !`${e.name} ${e.summary} ${e.specs.map((s) => s.value).join(' ')}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  async getBySlug(slug) {
    await delay();
    return getState().equipment.find((e) => e.slug === slug) ?? null;
  },
  async create(input) {
    await delay();
    const taken = new Set(getState().equipment.map((e) => e.slug));
    const { slug: requested, ...rest } = input;
    const item: Equipment = {
      ...rest,
      id: randomId('eq'),
      slug: uniqueSlug(requested || input.name, taken),
      isDemo: true,
      updatedAt: new Date().toISOString(),
    };
    commit((s) => ({ ...s, equipment: [item, ...s.equipment] }));
    return item;
  },
  async update(id, input) {
    await delay();
    const current = getState().equipment.find((e) => e.id === id) ?? fail('Equipment not found.');
    const { slug: requested, ...rest } = input;
    const taken = new Set(getState().equipment.filter((e) => e.id !== id).map((e) => e.slug));
    const nextSlug = requested?.trim() ? uniqueSlug(requested, taken) : current.slug;
    const item: Equipment = { ...current, ...rest, slug: nextSlug, updatedAt: new Date().toISOString() };
    commit((s) => ({ ...s, equipment: s.equipment.map((e) => (e.id === id ? item : e)) }));
    return item;
  },
  async remove(id) {
    await delay(200);
    if (!getState().equipment.some((e) => e.id === id)) fail('Equipment not found.');
    commit((s) => ({ ...s, equipment: s.equipment.filter((e) => e.id !== id) }));
  },
};

export const mockQuotationService: QuotationService = {
  async list() {
    await delay();
    return [...getState().quotations].sort(byDateDesc);
  },
  async create(input) {
    await delay(900);
    const refs = new Set(getState().quotations.map((q) => q.reference));
    const item = {
      ...input,
      id: randomId('qt'),
      reference: generateReference('QT', refs),
      createdAt: new Date().toISOString(),
      status: 'New' as const,
      isSample: false,
    };
    commit((s) => ({ ...s, quotations: [item, ...s.quotations] }));
    return item;
  },
  async updateStatus(id, status) {
    await delay(200);
    const current = getState().quotations.find((q) => q.id === id) ?? fail('Quotation request not found.');
    const item = { ...current, status };
    commit((s) => ({ ...s, quotations: s.quotations.map((q) => (q.id === id ? item : q)) }));
    return item;
  },
};

export const mockMaintenanceService: MaintenanceService = {
  async list() {
    await delay();
    return [...getState().maintenance].sort(byDateDesc);
  },
  async create(input) {
    await delay(900);
    const refs = new Set(getState().maintenance.map((m) => m.reference));
    const item = {
      ...input,
      id: randomId('mt'),
      reference: generateReference('MT', refs),
      createdAt: new Date().toISOString(),
      status: 'New' as const,
      isSample: false,
    };
    commit((s) => ({ ...s, maintenance: [item, ...s.maintenance] }));
    return item;
  },
  async updateStatus(id, status) {
    await delay(200);
    const current = getState().maintenance.find((m) => m.id === id) ?? fail('Maintenance request not found.');
    const item = { ...current, status };
    commit((s) => ({ ...s, maintenance: s.maintenance.map((m) => (m.id === id ? item : m)) }));
    return item;
  },
  async listServices() {
    await delay(150);
    return mockMaintenanceServices;
  },
  async listSparePartGroups() {
    await delay(150);
    return mockSparePartGroups;
  },
};

export const mockArticleService: ArticleService = {
  async list(filter = {}) {
    await delay();
    const q = filter.search?.trim().toLowerCase();
    return getState()
      .articles.filter((a) => (!filter.status || a.status === filter.status) && (!q || `${a.title} ${a.excerpt} ${a.tag}`.toLowerCase().includes(q)))
      .sort(byDateDesc);
  },
  async getBySlug(slug, options = {}) {
    await delay();
    const a = getState().articles.find((x) => x.slug === slug);
    if (!a) return null;
    return a.status === 'Published' || options.includeDrafts ? a : null;
  },
  async create(input) {
    await delay();
    const taken = new Set(getState().articles.map((a) => a.slug));
    const now = new Date().toISOString();
    const { slug: requested, ...rest } = input;
    const item: Article = {
      ...rest,
      id: randomId('ar'),
      slug: uniqueSlug(requested || input.title, taken),
      author: 'Demo admin',
      publishedAt: now,
      updatedAt: now,
      isDemo: true,
    };
    commit((s) => ({ ...s, articles: [item, ...s.articles] }));
    return item;
  },
  async update(id, input) {
    await delay();
    const current = getState().articles.find((a) => a.id === id) ?? fail('Article not found.');
    const { slug: requested, ...rest } = input;
    const taken = new Set(getState().articles.filter((a) => a.id !== id).map((a) => a.slug));
    const slug = requested?.trim() ? uniqueSlug(slugify(requested), taken) : current.slug;
    const now = new Date().toISOString();
    const publishedAt = current.status === 'Draft' && rest.status === 'Published' ? now : current.publishedAt;
    const item: Article = { ...current, ...rest, slug, publishedAt, updatedAt: now };
    commit((s) => ({ ...s, articles: s.articles.map((a) => (a.id === id ? item : a)) }));
    return item;
  },
  async remove(id) {
    await delay(200);
    if (!getState().articles.some((a) => a.id === id)) fail('Article not found.');
    commit((s) => ({ ...s, articles: s.articles.filter((a) => a.id !== id) }));
  },
};

export const mockDashboardService: DashboardService = {
  async getStats() {
    await delay();
    const s = getState();
    const byStatus: Record<string, number> = {};
    s.equipment.forEach((e) => (byStatus[e.status] = (byStatus[e.status] ?? 0) + 1));
    const submitted = s.quotations.filter((q) => !q.isSample).length + s.maintenance.filter((m) => !m.isSample).length;
    const recent: DashboardStats['recent'] = [
      ...s.quotations.map((q) => ({ kind: 'Quotation' as const, id: q.id, reference: q.reference, who: q.organisation, createdAt: q.createdAt, status: q.status })),
      ...s.maintenance.map((m) => ({ kind: 'Maintenance' as const, id: m.id, reference: m.reference, who: m.organisation, createdAt: m.createdAt, status: m.status })),
    ]
      .sort(byDateDesc)
      .slice(0, 6);
    const activity = mockDashboardBaseline.activity.map((a) => ({ ...a }));
    return {
      equipmentTotal: s.equipment.length,
      equipmentByStatus: byStatus,
      quotationsTotal: s.quotations.length,
      quotationsOpen: s.quotations.filter((q) => q.status === 'New' || q.status === 'In Review').length,
      maintenanceTotal: s.maintenance.length,
      maintenanceOpen: s.maintenance.filter((m) => m.status === 'New' || m.status === 'In Review' || m.status === 'Scheduled').length,
      articlesPublished: s.articles.filter((a) => a.status === 'Published').length,
      articlesDraft: s.articles.filter((a) => a.status === 'Draft').length,
      submittedThisSession: submitted,
      activity,
      recent,
    };
  },
};

export const mockDemoControlService: DemoControlService = {
  async resetDemoData() {
    await delay(250);
    resetState();
  },
};
