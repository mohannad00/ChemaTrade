import { useCallback, useEffect, useRef, useState } from 'react';
import { useDataVersion } from '@/lib/dataVersion';

export type QueryState<T> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'error'; data: undefined; error: Error }
  | { status: 'success'; data: T; error: undefined };

/** Fetches through a service function and refetches when demo data changes. */
export function useQuery<T>(fetcher: () => Promise<T>, deps: readonly unknown[]): QueryState<T> & { retry: () => void } {
  const version = useDataVersion();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<QueryState<T>>({ status: 'loading', data: undefined, error: undefined });
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    fetcherRef.current().then(
      (data) => !cancelled && setState({ status: 'success', data, error: undefined }),
      (err: unknown) => !cancelled && setState({ status: 'error', data: undefined, error: err instanceof Error ? err : new Error('Unexpected error') }),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, attempt, ...deps]);

  const retry = useCallback(() => {
    setState({ status: 'loading', data: undefined, error: undefined });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry } as QueryState<T> & { retry: () => void };
}
