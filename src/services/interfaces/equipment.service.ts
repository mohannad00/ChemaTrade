import type { Category, Equipment, EquipmentFilter, EquipmentInput } from '@/features/equipment/equipment.types';

export interface EquipmentService {
  list(filter?: EquipmentFilter): Promise<Equipment[]>;
  getBySlug(slug: string): Promise<Equipment | null>;
  create(input: EquipmentInput): Promise<Equipment>;
  update(id: string, input: EquipmentInput): Promise<Equipment>;
  remove(id: string): Promise<void>;
}

export interface CategoryService {
  list(): Promise<Category[]>;
}
