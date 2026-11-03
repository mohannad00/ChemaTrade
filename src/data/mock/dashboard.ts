import type { DashboardBaseline } from '@/features/admin/admin.types';

/** Illustrative sample series only. Not real business statistics. */
export const mockDashboardBaseline: DashboardBaseline = {
  activity: [
    { month: 'Jun', quotations: 4, maintenance: 2 },
    { month: 'Jul', quotations: 6, maintenance: 3 },
    { month: 'Aug', quotations: 5, maintenance: 4 },
    { month: 'Sep', quotations: 8, maintenance: 3 },
    { month: 'Oct', quotations: 7, maintenance: 5 },
  ],
};
