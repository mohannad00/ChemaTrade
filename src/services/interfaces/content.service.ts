import type { Article, ArticleFilter, ArticleInput } from '@/features/resources/resources.types';
import type { DashboardStats } from '@/features/admin/admin.types';

export interface ArticleService {
  list(filter?: ArticleFilter): Promise<Article[]>;
  getBySlug(slug: string, options?: { includeDrafts?: boolean }): Promise<Article | null>;
  create(input: ArticleInput): Promise<Article>;
  update(id: string, input: ArticleInput): Promise<Article>;
  remove(id: string): Promise<void>;
}

export interface DashboardService {
  getStats(): Promise<DashboardStats>;
}

/** Demo-only capability. A real backend would not implement this. */
export interface DemoControlService {
  resetDemoData(): Promise<void>;
}
