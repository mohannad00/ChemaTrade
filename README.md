# Chema Trade — Phase 1 frontend demo

A complete, frontend-only demonstration of the Chema Trade website and an admin dashboard. **There is no backend.** All products, specifications, articles, requests and statistics are sample content.

Stack: React 19, TypeScript (strict), Vite, CSS Modules, React Router, Motion (`motion/react`), Lucide icons. Fonts (Inter, JetBrains Mono, IBM Plex Sans Arabic) are bundled via Fontsource, so there are no external requests.

Themes: **light, dark and system** (header button cycles light, dark, system; remembered in `localStorage`). Languages: **English and Arabic (RTL)**. Use the language button in the header; the choice is remembered in `localStorage`.

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
  i18n/                I18nProvider, messages.en/ar, localize helpers
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
| Company details | About/Contact copy and contact details are placeholders to be supplied by Chema Trade |

## What a real backend will need (future phase)

- Implement the interfaces in `src/services/interfaces` (e.g. `src/services/supabase/`) and return them from `src/services/index.ts` when `DEMO_MODE` is false. `DemoControlService` is demo-only and is dropped.
- **Real authentication and authorisation** for `/admin`, enforced server-side (e.g. row-level security). Frontend route guards are never security.
- Persisting and validating requests server-side, with spam protection, plus real notification delivery (email/WhatsApp) once approved by Chema Trade.
- Server-generated reference numbers, file/image storage for products, real pagination and search.
- Real product data, specifications and availability from Chema Trade; real legal text (privacy, terms); real company copy.
- No secrets or placeholder environment variables are included, because no external service is used.

## Localization (English / Arabic)

- `src/i18n/messages.en.ts` is the source of truth for UI strings; `messages.ar.ts` is typed against its keys, so a missing Arabic string fails `npm run typecheck`. A unit test also checks that placeholders match.
- `I18nProvider` sets `<html lang>` and `dir` (`rtl` for Arabic) and exposes `useI18n()` (`t`, `te` for enum values such as statuses, `formatDate`).
- Sample content (equipment, categories, articles, services, spare parts) carries Arabic overrides in `src/data/mock/content.ar.ts`; views apply them with `useLocalizedList` / `useLocalizedItem`. Service interfaces and stored data stay language-neutral, so a future backend can add translated columns without UI changes.
- Validation errors are structured (`{ key, labelKey }`) and translated at render time.
- CSS uses logical properties (`margin-inline`, `text-align: start`, `inset-inline-start`), and directional icons mirror in RTL. Dates use Latin digits in both languages.
- Admin-entered content is stored in the language it was typed in (there is no per-language editor in this demo).

## Light / dark theme

- Colours are CSS custom properties in `src/styles/tokens.css`. Light is the default; `<html data-theme="dark">` swaps the whole set. Components use tokens only (no hard-coded colours).
- `ThemeProvider` (`src/app/ThemeProvider.tsx`) resolves the choice (`light` / `dark` / `system`), follows the OS setting live in system mode, and updates `<meta name="theme-color">`.
- A tiny inline script in `index.html` sets `data-theme` before first paint so dark mode does not flash light.
- Token roles: `--ink`, `--muted`, `--coral-ink`, `--accent`, `--danger` are text colours and flip per theme; `--solid-*` are backgrounds that always carry white text; `--inverse-bg` is a dark panel that stays dark in both themes.
- `src/styles/tokens.test.ts` checks WCAG AA (4.5:1) for every text/background pair in both themes, so a token change that breaks contrast fails `npm test`.
## Design notes

The visual language follows the "Medusa JF-4 field simulator" reference, adapted for a trading and maintenance business (the 3D robot, live telemetry and tour were deliberately **not** copied; they have no business meaning here and would imply data that does not exist).

- Palette (`src/styles/tokens.css`): pale aqua-white ground `#F1FBFA` to `#E3F4F3`, deep teal ink `#0E3A3D`, one coral accent `#FF5A3C`, teal `#0F9D8A`. Dark mode has its own set.
- Type: Inter for headings and numbers, JetBrains Mono for small spaced labels (Arabic uses IBM Plex Sans Arabic and drops letter-spacing and uppercase).
- Coral text and buttons use a darker AA-safe variant (`--coral-ink` `#C93216`); the bright coral is decorative only.
- Signature elements: animated logo and wordmark, and the always-animating, hover-reactive glassware illustration.

### Corners, motion and the mouse highlight

- Radius scale `--r-xs/sm/md/lg/pill` (6/10/14/20/999px) and one motion system (`--ease`, `--ease-spring`, `--dur-1/2/3`) in `tokens.css`. Buttons, cards, fields, badges and dialogs all draw from these, so the feel can be retuned in one place.
- Cards carry a coral inset edge (`--edge`) that follows the rounded corner and mirrors in RTL.
- `PointerEffects` (`src/components/layout/`) adds a teal spotlight with a faint dot grid, plus a coral ring and dot that grow over controls, shrink on press and become an I-beam over text inputs. Elements marked `data-glow` also get a highlight that follows the pointer. It is visible in light and dark mode, runs on one `requestAnimationFrame` loop, and is disabled for touch devices and under `prefers-reduced-motion`.
- Pages fade/slide in on navigation (`PageTransition`), lists stagger in, and switching theme cross-fades colours.
- Logo: `src/components/ui/Logo.tsx` (a coral tile with an Erlenmeyer flask, animated liquid and bubbles, and a rising trade arrow). The static version is `public/favicon.svg`.
- **Scroll motion** (`src/components/motion/`, built on `motion/react`; no colors involved):
  - `ScrollLayer` moves, scales and fades the hero text and figure at different speeds as you scroll away.
  - `BackgroundWord` is oversized type behind each home section that drifts sideways.
  - `SectionHead` is an eyebrow, a heading that rises word by word, and a lede.
  - `FloatItem` / `Parallax` are cards that slide in from alternating sides and drift at column-dependent speeds.
  - `ScrollScale` is the request band, which grows into view.
  - `ScrollProgress` is a thin bar at the top.
  - `Reveal` (`components/ui`) is the shared fade/slide-in, with `up`, `start`, `end` and `scale` variants. `start` and `end` mirror in RTL, and sub-page headers use it on mount.
  - All of it is spring-smoothed, shortened on small screens, and replaced by static content under `prefers-reduced-motion`.
- All animation is disabled under `prefers-reduced-motion`.
## Product images

- Every sample item has a generic illustration in `public/images/equipment/<slug>.svg`, labelled “Sample image” in the UI. These are not real product photos.
- `Equipment.image` accepts a path or an https URL. The demo admin form can change it, and a missing or broken image falls back to a placeholder.
- Replace the SVGs (or the URLs) with real photos once Chema Trade supplies them.

## Known limitations

- Placeholder company info and sample copy (see above). Arabic translations of the sample copy are machine-assisted drafts that need review by a native speaker before launch.
- Local-storage state is per browser and per origin; there is no multi-user behaviour.
- Search is a simple substring match. No pagination (13 sample items).
- No end-to-end test suite; unit tests cover validation, reference generation and the mock services. UI flows were verified manually with browser automation.

