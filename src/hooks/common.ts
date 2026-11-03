import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, ms = 250): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} — Chema Trade (Demo)`;
  }, [title]);
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)').matches));
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}
