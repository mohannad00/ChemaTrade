import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomePage } from '@/features/home/pages/HomePage';
import { EquipmentCatalogPage } from '@/features/equipment/pages/EquipmentCatalogPage';
import { EquipmentDetailPage } from '@/features/equipment/pages/EquipmentDetailPage';
import { MaintenancePage, SparePartsPage } from '@/features/maintenance/pages/MaintenancePages';
import { RequestQuotationPage } from '@/features/quotations/pages/RequestQuotationPage';
import { RequestMaintenancePage } from '@/features/maintenance/pages/RequestMaintenancePage';
import { ResourcesPage } from '@/features/resources/pages/ResourcesPage';
import { ArticlePage } from '@/features/resources/pages/ArticlePage';
import { AboutPage } from '@/features/company/pages/AboutPage';
import { ContactPage } from '@/features/company/pages/ContactPage';
import { PrivacyPage, TermsPage } from '@/features/company/pages/LegalPages';
import { NotFoundPage } from '@/features/company/pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    hydrateFallbackElement: <p className="visually-hidden" role="status" aria-label="Loading" />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'equipment', element: <EquipmentCatalogPage /> },
      { path: 'equipment/:slug', element: <EquipmentDetailPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'spare-parts', element: <SparePartsPage /> },
      { path: 'request-quote', element: <RequestQuotationPage /> },
      { path: 'request-maintenance', element: <RequestMaintenancePage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'resources/:slug', element: <ArticlePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      {
        path: 'admin',
        lazy: async () => ({ Component: (await import('@/features/admin/components/AdminLayout')).AdminLayout }),
        children: [
          { index: true, lazy: async () => ({ Component: (await import('@/features/admin/pages/AdminOverviewPage')).AdminOverviewPage }) },
          { path: 'equipment', lazy: async () => ({ Component: (await import('@/features/admin/pages/AdminEquipmentPage')).AdminEquipmentPage }) },
          { path: 'quotations', lazy: async () => ({ Component: (await import('@/features/admin/pages/AdminRequestsPages')).AdminQuotationsPage }) },
          { path: 'maintenance', lazy: async () => ({ Component: (await import('@/features/admin/pages/AdminRequestsPages')).AdminMaintenancePage }) },
          { path: 'content', lazy: async () => ({ Component: (await import('@/features/admin/pages/AdminContentPage')).AdminContentPage }) },
          { path: '*', element: <Navigate to="/admin" replace /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
