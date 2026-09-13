# Sourav Portfolio

A React 19 + TypeScript portfolio built as a product-style frontend experience
rather than a static resume page. It combines animated sections, recruiter-focused
project browsing, route-based case studies, dashboard analytics, and PWA support
in a single Vite app.

**Live:** [sourav.is-a.dev](https://sourav.is-a.dev)

## Preview

## What This App Includes

- Single-page portfolio with lazy-mounted sections for faster first load
- Dedicated routes for `/dashboard` and `/case-studies/:slug`
- Theme-aware UI with Framer Motion transitions and reduced-motion support
- Lenis smooth scrolling, with a native-scroll fallback for reduced motion
- Command palette (Ctrl/Cmd + K), recruiter mode, and interaction analytics
- Searchable and reorderable projects with modal previews
- Canvas cursor effects, including a click burst that cycles through rainbow colours
- Draggable WhatsApp contact widget and a back-to-top action
- PWA manifest, service worker, and install prompt support
- Section-level and app-level error boundaries
- Build-time sitemap generation plus structured data for search

## Stack

- React 19
- TypeScript 5.9 (strict, with `noUnusedLocals` / `noUnusedParameters`)
- React Router DOM 7
- Tailwind CSS 3 (class-based dark mode)
- Framer Motion
- Zustand (with `persist`)
- Lenis
- Lucide React
- Vite 7 via `rolldown-vite`
- Vitest + Testing Library

### A note on the Vite setup

`vite` is aliased to `rolldown-vite` through both `dependencies` and `overrides`
in [`package.json`](./package.json), so the Rust-based Rolldown bundler replaces
Rollup. Two consequences are worth knowing before changing the build:

- **There is no `@vitejs/plugin-react`.** JSX is transformed by the bundler's
  built-in pipeline using the `"jsx": "react-jsx"` setting in
  [`tsconfig.app.json`](./tsconfig.app.json). The only plugin in
  [`vite.config.ts`](./vite.config.ts) is the local sitemap emitter. Adding the
  React plugin back is unnecessary and would double-transform JSX.
- **Fast Refresh comes from the bundler, not the plugin.** If HMR behaves oddly,
  look at the `rolldown-vite` version rather than searching for React plugin
  options.

Vendor chunks are split by hand in `vite.config.ts` (`react-vendor`,
`router-vendor`, `motion-vendor`) so that editing portfolio content does not
invalidate the cached framework code.

## Routes

- `/` main portfolio
- `/dashboard` analytics dashboard (excluded from search indexing)
- `/case-studies/:slug` case study detail page
- unknown routes redirect to `/`

All three routes are lazy-loaded in [`src/main.tsx`](./src/main.tsx) and wrapped
in `PageTransition` inside an `AnimatePresence mode="wait"`.

## Homepage Sections

The homepage is composed in [`src/App.tsx`](./src/App.tsx).

1. `Hero` (eagerly imported, since it carries the LCP element)
2. `About`
3. `Experience`
4. `Skills`
5. `Projects`
6. `GitHubActivity`
7. `Education`
8. `Certifications`
9. `Contact`

Everything after `Hero` is `React.lazy`. Each one mounts through `LazySection`,
which is the part most likely to surprise you when editing a section:

- An `IntersectionObserver` with a `1200px` root margin mounts the section well
  before it scrolls into view, so the swap happens off-screen.
- `SECTION_MIN_HEIGHTS` reserves an approximate height per section, measured at
  a 412px-wide viewport. This exists because a flat placeholder let a section
  grow by 1600px on mount and shove the page content down mid-read. **If you add
  or substantially resize a section, add or update its entry in that map.**
- Deep links preload every section above the target hash, then realign
  repeatedly (18 attempts, 80ms apart, always `immediate`) while lazy content
  settles.

## Key Files

- [`src/App.tsx`](./src/App.tsx) handles homepage composition and viewport-aware section mounting.
- [`src/main.tsx`](./src/main.tsx) sets up routing, route transitions, theme bootstrapping, and service worker behavior.
- [`src/components/layout/Navbar.tsx`](./src/components/layout/Navbar.tsx) manages navigation, theme toggling, scroll progress, and dashboard access.
- [`src/components/layout/Footer.tsx`](./src/components/layout/Footer.tsx) holds the sitemap, contact details, and resume/dashboard links.
- [`src/components/common/CommandPalette.tsx`](./src/components/common/CommandPalette.tsx) provides keyboard-driven navigation, ghost-suggestion autocomplete, and quick actions.
- [`src/components/common/CursorSpiderEffect.tsx`](./src/components/common/CursorSpiderEffect.tsx) draws the cursor trail and the per-click colour-cycling web burst.
- [`src/components/sections/Projects.tsx`](./src/components/sections/Projects.tsx) contains filtering, fuzzy search, modal previews, and drag-based project ordering.
- [`src/components/sections/GitHubActivity.tsx`](./src/components/sections/GitHubActivity.tsx) fetches live stats from the public GitHub REST API. The calls are unauthenticated, so they are subject to the 60 requests/hour per-IP rate limit.
- [`src/hooks/useProjectDiscovery.ts`](./src/hooks/useProjectDiscovery.ts) centralizes project filtering and recommendation logic.
- [`src/hooks/usePageMetadata.ts`](./src/hooks/usePageMetadata.ts) applies per-route title, description, and canonical URL.
- [`src/providers/SmoothScrollProvider.tsx`](./src/providers/SmoothScrollProvider.tsx) wraps Lenis and exposes `scrollTo`.
- [`src/store/useAppStore.ts`](./src/store/useAppStore.ts) stores recruiter mode, accent, analytics events, and project ordering.
- [`scripts/sitemap.ts`](./scripts/sitemap.ts) is a Vite plugin that emits `sitemap.xml` at build time.
- [`scripts/optimize-project-images.js`](./scripts/optimize-project-images.js) regenerates project covers from the sources in `assets/projects/`.

## State

Two Zustand stores, deliberately separate:

- [`useAppStore`](./src/store/useAppStore.ts) is persisted to `localStorage`
  under `portfolio-app-store` at schema `version: 2`, with a `migrate` that
  backfills the analytics shape. It holds `recruiterMode`, `accent`,
  `projectOrder`, and the analytics buckets. Events are capped at 400 and
  trimmed from the front, so the dashboard cannot grow unbounded.
  **Bump `version` and extend `migrate` when the persisted shape changes**,
  otherwise returning visitors hydrate a stale object.
- [`useCommandPalette`](./src/store/useCommandpalette.ts) is ephemeral open/close
  state only, intentionally not persisted.

Analytics are entirely local. Nothing is sent anywhere; `/dashboard` visualizes
the current browser's own `localStorage`, which is also why `robots.txt`
disallows it.

## Local Development

### Prerequisites

- Node.js 18+ (developed on 22.x; there is no `engines` field, so this is not enforced)
- npm

### Install

```bash
npm install
```

### Start

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Test

```bash
npm run test
```

## Available Scripts

- `npm run dev` start the Vite dev server
- `npm run build` create a production build
- `npm run preview` preview the production build locally
- `npm run test` run the Vitest suite once
- `npm run test:watch` run Vitest in watch mode

There is no `lint` or `typecheck` script. Type errors surface in the editor, or
through `tsc` run directly; the build itself does not type-check.

## Testing

The suite is deliberately narrow, covering logic and behaviour contracts rather
than markup:

- [`src/lib/recommendations.test.ts`](./src/lib/recommendations.test.ts) (2 tests)
  covers the recommendation scoring that drives recruiter mode.
- [`src/components/layout/Navbar.test.tsx`](./src/components/layout/Navbar.test.tsx)
  (6 tests) covers the mobile menu contract: open, Escape-to-close,
  outside-tap-to-close, rapid toggling, and the close-then-scroll ordering.
  It asserts behaviour, not animation timings.

Note that `matchMedia` is stubbed to report no reduced-motion preference, so a
real Lenis instance is constructed under test and `scrollTo` routes through it
rather than the native fallback. Tests asserting navigation should spy on
`Lenis.prototype.scrollTo`.

[`src/setupTests.ts`](./src/setupTests.ts) stubs `matchMedia` and
`ResizeObserver`, which jsdom does not implement and which Lenis and
`useReducedMotion` both call on init. Any component test added later will need
those stubs, so keep them in place.

Vitest is configured inside [`vite.config.ts`](./vite.config.ts) via
`vitest/config`, not in a separate config file.

## Project Structure

```text
portfolio/
  assets/                  source art, kept out of the shipped bundle
    brand/                 logo source + regeneration notes
    profile/               full-resolution portrait source
    projects/              full-resolution project cover sources
    resume/                resume.html, the source for resume.pdf
  public/
    images/                project assets, certificates, and resume PDF
    manifest.webmanifest   PWA manifest
    robots.txt             crawl rules, points at the sitemap
    sw.js                  service worker
    favicon.ico, icon-*    generated app icons
  scripts/
    sitemap.ts                  build-time sitemap generation
    optimize-project-images.js  cover derivative pipeline
  src/
    assets/                imported build-time assets
    components/
      common/              reusable UI, motion helpers, and modals
      layout/              navbar, footer, and banner components
      sections/            homepage sections
      system/              error boundaries
    constants/             shared UI maps and configuration
    data/                  project and case-study content
    hooks/                 reusable hooks
    lib/                   search, recommendations, and motion helpers
    pages/                 route-level pages
    providers/             smooth scroll provider
    store/                 Zustand stores
    App.tsx                homepage composition
    main.tsx               app entry and routing
  index.html
  tailwind.config.js
  vercel.json
  vite.config.ts
```

Each directory under `assets/` carries its own README explaining the source
geometry and how to regenerate the shipped derivative. Read those before
replacing any image.

## Content

Project and case-study content is data, not markup. Adding work means editing
[`src/data/projects.ts`](./src/data/projects.ts) and, if it warrants a long-form
write-up, [`src/data/caseStudies.ts`](./src/data/caseStudies.ts).

There are currently 12 projects across four categories (`Web`, `AI`, `Mobile`,
`Realtime`) and 4 case studies.

### Case study slugs

- `resumeiq`
- `foodooza`
- `pollroom`
- `estateperks`

A project links to its write-up via `caseStudySlug`. The sitemap reads slugs
straight out of `caseStudies.ts`, so adding a case study is enough; there is no
separate URL list to update.

### Closed-source work

Professional work at Oneisok Digital Solution (Voteniti and the oneisok.co
rebuild) is listed in `projects.ts` and `Experience.tsx` but has no case-study
route, since the source is not public.

Two type fields are optional so closed-source work renders honestly rather than
linking somewhere dead:

- `ProjectRecord.github` - omitted for Voteniti and Oneisok, whose cards show
  only "Open Live Demo". The GitHub action is skipped when there is no repo.
- `ExperienceEntry.credential` - the current role has no completion
  certificate, so its card renders a single "View Details" action.

`liveUrl` points at each product's canonical host: `voteniti.in` serves 200
directly, while `oneisok.co` 307-redirects to `www.oneisok.co`, so the `www`
form is linked to save visitors a redirect.

### Project cover images

Covers are optimized derivatives, not the originals. Full-resolution sources
live in [`assets/projects/`](./assets/projects/) (out of the bundle); the site
serves 1200x675 WebP with a JPEG twin from `public/images/`. This turns roughly
3.4 MB of PNG into about 190 KB. `handleCoverError` in `Projects.tsx` falls
back WebP -> JPEG -> generic preview.

`sharp` is intentionally not a dependency. The pipeline runs by hand when a
cover changes:

```bash
npm install --no-save sharp
node scripts/optimize-project-images.js
```

### Brand assets

Icons are generated from `assets/brand/logo-source.png`. See
[`assets/brand/README.md`](./assets/brand/README.md) for the crop geometry, why
two files stay opaque, and how to regenerate them.

## SEO

- `sitemap.xml` is generated during `npm run build` from the case-study data in
  [`src/data/caseStudies.ts`](./src/data/caseStudies.ts), so it cannot drift out
  of sync when a case study is added. The plugin parses slugs with a regex
  rather than importing the module, because `caseStudies.ts` imports an image
  asset that only Vite can resolve. **If the shape of that file changes, the
  build throws rather than silently emitting an empty sitemap.**
- [`public/robots.txt`](./public/robots.txt) points at the sitemap and disallows
  `/dashboard`.
- [`index.html`](./index.html) carries the canonical URL and Person / WebSite /
  ProfilePage / BreadcrumbList JSON-LD. The `Person` node is written inline
  under `ProfilePage.mainEntity` rather than as an `@id` reference, because
  Google's ProfilePage validator does not resolve cross-node references; both
  copies share one `@id`, so JSON-LD merges them into a single node.
- [`vercel.json`](./vercel.json) 301-redirects the Vercel deployment host to the
  canonical domain so ranking signals are not split across duplicates.
- Client-rendered routes set their own metadata via `usePageMetadata`.

Fonts load through a non-blocking `<link>` in the head rather than an `@import`
in CSS, and `/profile.jpg` is preloaded as the LCP image. Keep both in
`index.html`; moving either back into CSS serialises the fetch behind the
stylesheet and delays first paint.

## Service Worker

[`public/sw.js`](./public/sw.js) precaches the shell and is registered only in
production. In development, `main.tsx` actively unregisters any existing worker
and clears caches prefixed `sourav-portfolio-`, so a stale production worker
cannot shadow the dev server.

**Bump `CACHE_NAME` (currently `sourav-portfolio-v14`) whenever a cached asset
such as an icon changes**, or returning visitors keep the old copy.

## Deployment

Deployed on Vercel. [`vercel.json`](./vercel.json) handles:

- the canonical-host 301 redirect
- SPA rewrites, scoped to extension-less paths so real files still resolve
- immutable year-long caching for `/assets/*`, whose filenames are hashed
- `must-revalidate` plus explicit content types for `robots.txt`, `sitemap.xml`,
  and `sw.js`, which must never be served stale
