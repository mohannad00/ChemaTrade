import { DEMO_MODE } from '@/config/app.config';
import {
  mockArticleService,
  mockCategoryService,
  mockDashboardService,
  mockDemoControlService,
  mockEquipmentService,
  mockMaintenanceService,
  mockQuotationService,
} from './mock';
import type {
  ArticleService,
  CategoryService,
  DashboardService,
  DemoControlService,
  EquipmentService,
  MaintenanceService,
  QuotationService,
} from './interfaces';

export interface Services {
  equipment: EquipmentService;
  categories: CategoryService;
  quotations: QuotationService;
  maintenance: MaintenanceService;
  articles: ArticleService;
  dashboard: DashboardService;
  demo: DemoControlService;
}

const mockServices: Services = {
  equipment: mockEquipmentService,
  categories: mockCategoryService,
  quotations: mockQuotationService,
  maintenance: mockMaintenanceService,
  articles: mockArticleService,
  dashboard: mockDashboardService,
  demo: mockDemoControlService,
};

/**
 * Composition root for data access. UI code imports `services` and never touches mock data.
 * A future Supabase implementation would be built here and returned when DEMO_MODE is false.
 */
function createServices(): Services {
  if (DEMO_MODE) return mockServices;
  throw new Error('No backend implementation is available yet. Set DEMO_MODE to true.');
}

export const services: Services = createServices();
