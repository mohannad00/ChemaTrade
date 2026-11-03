export type EquipmentStatus = 'Available' | 'Request a Quote' | 'Sourcing on Request';

export const EQUIPMENT_STATUSES: readonly EquipmentStatus[] = ['Available', 'Request a Quote', 'Sourcing on Request'];

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface EquipmentSpec {
  label: string;
  value: string;
}

export interface Equipment {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  status: EquipmentStatus;
  summary: string;
  description: string;
  specs: EquipmentSpec[];
  /** Optional, illustrative only. Never a real quotation. */
  illustrativePrice?: string;
  featured: boolean;
  /** Every item in this phase is sample content. */
  isDemo: true;
  updatedAt: string;
}

export type EquipmentInput = Omit<Equipment, 'id' | 'slug' | 'isDemo' | 'updatedAt'> & { slug?: string };

export interface EquipmentFilter {
  categorySlug?: string;
  status?: EquipmentStatus;
  search?: string;
  featuredOnly?: boolean;
}
