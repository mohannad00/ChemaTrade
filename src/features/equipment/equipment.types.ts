export type EquipmentStatus = 'Available' | 'Request a Quote' | 'Sourcing on Request';

export const EQUIPMENT_STATUSES: readonly EquipmentStatus[] = ['Available', 'Request a Quote', 'Sourcing on Request'];

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  i18n?: { ar?: Partial<Pick<Category, 'name' | 'description'>> };
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
  /** Path or http(s) URL of a product image. Seed images are generic sample illustrations, not real product photos. */
  image?: string;
  /** Every item in this phase is sample content. */
  isDemo: true;
  updatedAt: string;
  i18n?: { ar?: Partial<Pick<Equipment, 'name' | 'summary' | 'description' | 'specs' | 'illustrativePrice'>> };
}

export type EquipmentInput = Omit<Equipment, 'id' | 'slug' | 'isDemo' | 'updatedAt' | 'i18n'> & { slug?: string };

export interface EquipmentFilter {
  categorySlug?: string;
  status?: EquipmentStatus;
  search?: string;
  featuredOnly?: boolean;
}
