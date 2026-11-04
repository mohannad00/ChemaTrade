import type { DashboardBaseline } from '@/features/admin/admin.types';

/** Illustrative sample series only. Not real business statistics. */
export const mockDashboardBaseline: DashboardBaseline = {
  activity: [
    { month: '2026-06', quotations: 4, maintenance: 2 },
    { month: '2026-07', quotations: 6, maintenance: 3 },
    { month: '2026-08', quotations: 5, maintenance: 4 },
    { month: '2026-09', quotations: 8, maintenance: 3 },
    { month: '2026-10', quotations: 7, maintenance: 5 },
  ],
};
