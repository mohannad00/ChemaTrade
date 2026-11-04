import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { safeStorage } from '@/lib/storage';
import { nextTheme, readStoredTheme, resolveTheme, systemPrefersDark, THEME_STORAGE_KEY, type ResolvedTheme, type ThemeChoice } from '@/lib/theme';

interface ThemeValue {
  choice: ThemeChoice;
  resolved: ResolvedTheme;
  setChoice: (c: ThemeChoice) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(readStoredTheme);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => setSystemDark(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const resolved = resolveTheme(choice, systemDark);

  const first = useRef(true);
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!first.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-anim');
      window.setTimeout(() => root.classList.remove('theme-anim'), 450);
    }
    first.current = false;
    document.documentElement.dataset.theme = resolved;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#071A1D' : '#F1FBFA');
  }, [resolved]);

  const setChoice = useCallback((c: ThemeChoice) => {
    safeStorage.set(THEME_STORAGE_KEY, c);
    setChoiceState(c);
  }, []);

  const value = useMemo<ThemeValue>(() => ({ choice, resolved, setChoice, cycle: () => setChoice(nextTheme(choice)) }), [choice, resolved, setChoice]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
