import type { QuotationInput, QuotationRequest, QuotationStatus } from '@/features/quotations/quotations.types';
import type {
  MaintenanceInput,
  MaintenanceRequest,
  MaintenanceServiceInfo,
  MaintenanceStatus,
  SparePartGroup,
} from '@/features/maintenance/maintenance.types';

export interface QuotationService {
  list(): Promise<QuotationRequest[]>;
  /** Demo: stores locally only. A real implementation would persist remotely. */
  create(input: QuotationInput): Promise<QuotationRequest>;
  updateStatus(id: string, status: QuotationStatus): Promise<QuotationRequest>;
}

export interface MaintenanceService {
  list(): Promise<MaintenanceRequest[]>;
  create(input: MaintenanceInput): Promise<MaintenanceRequest>;
  updateStatus(id: string, status: MaintenanceStatus): Promise<MaintenanceRequest>;
  listServices(): Promise<MaintenanceServiceInfo[]>;
  listSparePartGroups(): Promise<SparePartGroup[]>;
}
