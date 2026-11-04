import { APP_CONFIG } from '@/config/app.config';
import { safeStorage } from '@/lib/storage';
import { mockEquipment } from '@/data/mock/equipment';
import { mockArticles } from '@/data/mock/articles';
import { mockQuotations } from '@/data/mock/quotations';
import { mockMaintenanceRequests } from '@/data/mock/maintenance';
import type { Equipment } from '@/features/equipment/equipment.types';
import type { Article } from '@/features/resources/resources.types';
import type { QuotationRequest } from '@/features/quotations/quotations.types';
import type { MaintenanceRequest } from '@/features/maintenance/maintenance.types';

export interface DemoState {
  equipment: Equipment[];
  articles: Article[];
  quotations: QuotationRequest[];
  maintenance: MaintenanceRequest[];
}

const clone = <T,>(v: T): T => structuredClone(v);

function seed(): DemoState {
  return {
    equipment: clone(mockEquipment),
    articles: clone(mockArticles),
    quotations: clone(mockQuotations),
    maintenance: clone(mockMaintenanceRequests),
  };
}

function isDemoState(v: unknown): v is DemoState {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return ['equipment', 'articles', 'quotations', 'maintenance'].every((k) => Array.isArray(o[k]));
}

/** Sessions saved before images existed: give seeded items their image. An empty string means the image was cleared on purpose. */
function withSeedImages(s: DemoState): DemoState {
  const images = new Map(mockEquipment.map((e) => [e.id, e.image]));
  return { ...s, equipment: s.equipment.map((e) => (e.image === undefined && images.has(e.id) ? { ...e, image: images.get(e.id) } : e)) };
}

function load(): DemoState {
  const raw = safeStorage.get(APP_CONFIG.demoStorageKey);
  if (!raw) return seed();
  try {
    const parsed: unknown = JSON.parse(raw);
    return isDemoState(parsed) ? withSeedImages(parsed) : seed();
  } catch {
    return seed();
  }
}

let state: DemoState | null = null;

export function getState(): DemoState {
  state ??= load();
  return state;
}

/** Applies a mutation, then persists. State objects are replaced, never mutated in place. */
export function commit(mutator: (s: DemoState) => DemoState): void {
  state = mutator(getState());
  safeStorage.set(APP_CONFIG.demoStorageKey, JSON.stringify(state));
}

export function resetState(): void {
  safeStorage.remove(APP_CONFIG.demoStorageKey);
  state = seed();
}

/** Test helper: forget the in-memory copy so the next read reloads from storage. */
export function __discardMemoryForTests(): void {
  state = null;
}

export function delay(ms: number = APP_CONFIG.mockLatencyMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
