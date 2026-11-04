export type MaintenanceStatus = 'New' | 'In Review' | 'Scheduled' | 'Completed' | 'Cancelled';
export const MAINTENANCE_STATUSES: readonly MaintenanceStatus[] = ['New', 'In Review', 'Scheduled', 'Completed', 'Cancelled'];

export type MaintenanceServiceType = 'Preventive maintenance' | 'Repair' | 'Calibration' | 'Installation' | 'Spare parts';
export const MAINTENANCE_SERVICE_TYPES: readonly MaintenanceServiceType[] = [
  'Preventive maintenance',
  'Repair',
  'Calibration',
  'Installation',
  'Spare parts',
];

export type MaintenanceUrgency = 'Routine' | 'Soon' | 'Urgent';
export const MAINTENANCE_URGENCIES: readonly MaintenanceUrgency[] = ['Routine', 'Soon', 'Urgent'];

export interface MaintenanceRequest {
  id: string;
  reference: string;
  createdAt: string;
  status: MaintenanceStatus;
  fullName: string;
  organisation: string;
  email: string;
  phone?: string;
  equipmentDescription: string;
  serviceType: MaintenanceServiceType;
  urgency: MaintenanceUrgency;
  details: string;
  isSample: boolean;
}

export interface MaintenanceInput {
  fullName: string;
  organisation: string;
  email: string;
  phone?: string;
  equipmentDescription: string;
  serviceType: MaintenanceServiceType;
  urgency: MaintenanceUrgency;
  details: string;
}

export interface MaintenanceServiceInfo {
  id: string;
  title: string;
  summary: string;
  points: string[];
  i18n?: { ar?: Partial<Pick<MaintenanceServiceInfo, 'title' | 'summary' | 'points'>> };
}

export interface SparePartGroup {
  id: string;
  name: string;
  description: string;
  examples: string[];
  status: 'Request a Quote' | 'Sourcing on Request';
  i18n?: { ar?: Partial<Pick<SparePartGroup, 'name' | 'description' | 'examples'>> };
}
