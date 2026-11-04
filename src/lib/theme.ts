import { safeStorage } from '@/lib/storage';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'chematrade.theme.v1';
export const THEME_CHOICES: readonly ThemeChoice[] = ['light', 'dark', 'system'];

export function isThemeChoice(v: unknown): v is ThemeChoice {
  return v === 'light' || v === 'dark' || v === 'system';
}

export function readStoredTheme(): ThemeChoice {
  const v = safeStorage.get(THEME_STORAGE_KEY);
  return isThemeChoice(v) ? v : 'system';
}

export function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(choice: ThemeChoice, systemDark: boolean): ResolvedTheme {
  if (choice === 'system') return systemDark ? 'dark' : 'light';
  return choice;
}

/** Order used by the header button: light -> dark -> system -> light. */
export function nextTheme(choice: ThemeChoice): ThemeChoice {
  return choice === 'light' ? 'dark' : choice === 'dark' ? 'system' : 'light';
}
