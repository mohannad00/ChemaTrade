# Chema Trade — Phase 1 frontend demo

A complete, frontend-only demonstration of the Chema Trade website and an admin dashboard. **There is no backend.** All products, specifications, articles, requests and statistics are sample content.

Stack: React 19, TypeScript (strict), Vite, CSS Modules, React Router, Motion (`motion/react`), Lucide icons. Fonts (Newsreader, Courier Prime) are bundled via Fontsource, so there are no external requests.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # vitest (validation + mock services)
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Routes

`/` · `/equipment` (`?category=`, `?status=`, `?q=`) · `/equipment/:slug` · `/maintenance` · `/spare-parts` · `/request-quote` · `/request-maintenance` · `/resources` · `/resources/:slug` · `/about` · `/contact` · `/privacy` · `/terms` · `/admin` (+ `/equipment`, `/quotations`, `/maintenance`, `/content`)

## Architecture

```
src/
  app/                 router.tsx, providers.tsx
  config/app.config.ts DEMO_MODE flag, storage keys, disclaimer strings
  data/mock/           equipment, categories, articles, quotations, maintenance, dashboard
  services/
    interfaces/        Equipment, Category, Quotation, Maintenance, Article, Dashboard, DemoControl
    mock/              store.ts (localStorage-backed) + implementations of every interface
    index.ts           composition root: `services`
  features/            equipment, quotations, maintenance, resources, company, home, admin
  components/          layout/, ui/, forms/
  hooks/, lib/         useQuery, validation, ids, storage
  styles/              tokens.css, global.css
```

Rules the code follows:

- UI never imports mock data. Components call `services.*` through the `useQuery` hook.
- Business logic (validation, reference generation, slugging) lives in `lib/` and `*.logic.ts`, not in components.
- Entity types live next to their feature (`*.types.ts`). Service interfaces are in `src/services/interfaces`.
- Mutations call `invalidateData()`, which refetches every active query, so changes appear immediately.

## Simulated in this phase

| Feature | Demo behaviour |
| --- | --- |
| Equipment, categories, articles | Seeded from `src/data/mock`; admin edits persist in this browser's `localStorage` |
| Quotation / maintenance / contact forms | Validated client-side; "submit" waits ~1 s, generates a `DEMO-QT-…` / `DEMO-MT-…` reference, stores the request locally only. Nothing is emailed, messaged, ordered or booked, and the UI says so |
| Admin dashboard | Statistics are computed from local data; the monthly chart is an illustrative sample series |
| "Login" | A demonstration-only button with no accounts or passwords. It is **not security**: anyone can bypass it. |
| Reset | "Reset demo data" (with confirmation) restores the seeds and clears submitted requests |
| Product image | `public/assets/product-cutout.placeholder.svg` is a **temporary placeholder** drawing, labelled as such on screen. Replace it with the final transparent-background product photo (update `PRODUCT_CUTOUT_SRC` in `TravelingProduct.tsx`) |
| Company details | About/Contact copy and contact details are placeholders to be supplied by Chema Trade |

## What a real backend will need (future phase)

- Implement the interfaces in `src/services/interfaces` (e.g. `src/services/supabase/`) and return them from `src/services/index.ts` when `DEMO_MODE` is false. `DemoControlService` is demo-only and is dropped.
- **Real authentication and authorisation** for `/admin`, enforced server-side (e.g. row-level security). Frontend route guards are never security.
- Persisting and validating requests server-side, with spam protection, plus real notification delivery (email/WhatsApp) once approved by Chema Trade.
- Server-generated reference numbers, file/image storage for products, real pagination and search.
- Real product data, specifications and availability from Chema Trade; real legal text (privacy, terms); real company copy.
- No secrets or placeholder environment variables are included, because no external service is used.

## Design notes

Palette, type and rules follow the brief via `src/styles/tokens.css`: square corners, thin rules, no gradients or decorative shadows. Signature elements: fixed translucent navigation, an animated wordmark, a scroll-linked travelling product cutout (desktop ≥ 1024 px) and a self-drawing SVG glassware illustration. Under `prefers-reduced-motion` or on narrow screens the cutout is a static image and the drawing is already complete.

## Known limitations

- Placeholder product art, placeholder company info and sample copy (see above).
- Local-storage state is per browser and per origin; there is no multi-user behaviour.
- Search is a simple substring match. No pagination (13 sample items).
- No end-to-end test suite; unit tests cover validation, reference generation and the mock services. UI flows were verified manually with browser automation.
- The travelling cutout is desktop-only by design; tablet/mobile show a static image in the hero.
