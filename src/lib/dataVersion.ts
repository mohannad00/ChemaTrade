import { useSyncExternalStore } from 'react';

/**
 * Tiny invalidation channel. Mutations call `invalidateData()`; every `useQuery`
 * re-fetches. Backend-agnostic: works the same for mock and remote services.
 */
let version = 0;
const listeners = new Set<() => void>();

export function invalidateData(): void {
  version += 1;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDataVersion(): number {
  return useSyncExternalStore(subscribe, () => version, () => version);
}
