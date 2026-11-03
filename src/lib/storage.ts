const memory = new Map<string, string>();

function ls(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/** localStorage wrapper that degrades to in-memory storage (private mode, tests). */
export const safeStorage = {
  get(key: string): string | null {
    try {
      const store = ls();
      return store ? store.getItem(key) : (memory.get(key) ?? null);
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key: string, value: string): void {
    memory.set(key, value);
    try {
      ls()?.setItem(key, value);
    } catch {
      /* quota or privacy mode: memory copy is kept for this session */
    }
  },
  remove(key: string): void {
    memory.delete(key);
    try {
      ls()?.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export const sessionFlag = {
  get(key: string): boolean {
    try {
      return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key) === '1';
    } catch {
      return false;
    }
  },
  set(key: string, on: boolean): void {
    try {
      if (typeof sessionStorage === 'undefined') return;
      if (on) sessionStorage.setItem(key, '1');
      else sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
