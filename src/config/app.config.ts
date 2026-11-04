/** Central application configuration. */

/**
 * When true, all data services are backed by the in-browser mock layer
 * (`src/services/mock`). A future Supabase implementation is registered in
 * `src/services/index.ts` behind the same interfaces.
 */
export const DEMO_MODE = true;

export const APP_CONFIG = {
  companyName: 'Chema Trade',
  /** Simulated network latency (ms) applied by the mock services. */
  mockLatencyMs: 350,
  demoStorageKey: 'chematrade.demo.state.v1',
  demoSessionKey: 'chematrade.demo.admin-session.v1',
} as const;
