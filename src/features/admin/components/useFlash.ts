import { useEffect, useState } from 'react';

/** Shared transient-feedback hook for admin actions. */
export function useFlash(ms = 3500): [string | null, (m: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), ms);
    return () => clearTimeout(t);
  }, [msg, ms]);
  return [msg, setMsg];
}
