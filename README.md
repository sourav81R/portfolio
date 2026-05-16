# Sourav Portfolio

A React 19 + TypeScript portfolio built as a product-style frontend experience rather than a static resume page. It combines animated sections, recruiter-focused project browsing, route-based case studies, dashboard analytics, resume tooling, and PWA support in a single Vite app.

## Preview

![Desktop preview](./site-home.png)
![Mobile preview](./site-mobile.png)

## What This App Includes

- Single-page portfolio with lazy-mounted sections for faster first load
- Dedicated routes for `/dashboard` and `/case-studies/:slug`
- Theme-aware UI with Framer Motion transitions and reduced-motion support
- Command palette, recruiter mode, and interaction analytics
- Searchable and reorderable projects with modal previews
- Resume preview plus local resume analysis utilities
- PWA manifest, service worker, and install prompt support
- Section-level and app-level error boundaries

## Stack

- React 19
- TypeScript
- React Router DOM 7
- Tailwind CSS 3
- Framer Motion
- Zustand
- Lucide React
- `pdfjs-dist`
- `mammoth`
- Vite via `rolldown-vite`
- Vitest + Testing Library

## Routes

- `/` main portfolio
- `/dashboard` analytics dashboard
- `/case-studies/:slug` case study detail page
- unknown routes redirect to `/`

## Homepage Sections

The homepage is composed in [`src/App.tsx`](/c:/portfolio2/sourav-portfolio/src/App.tsx).

1. `Hero`
2. `About`
3. `Experience`
4. `Skills`
5. `Projects`
6. `GitHubActivity`
7. `Education`
8. `Certifications`
9. `Contact`

## Key Files

- [`src/App.tsx`](/c:/portfolio2/sourav-portfolio/src/App.tsx) handles homepage composition and viewport-aware section mounting.
- [`src/main.tsx`](/c:/portfolio2/sourav-portfolio/src/main.tsx) sets up routing, route transitions, and service worker behavior.
- [`src/components/layout/Navbar.tsx`](/c:/portfolio2/sourav-portfolio/src/components/layout/Navbar.tsx) manages navigation, theme toggling, and dashboard access.
- [`src/components/common/CommandPalette.tsx`](/c:/portfolio2/sourav-portfolio/src/components/common/CommandPalette.tsx) provides keyboard-driven navigation and quick actions.
- [`src/components/sections/Projects.tsx`](/c:/portfolio2/sourav-portfolio/src/components/sections/Projects.tsx) contains filtering, fuzzy search, modal previews, and drag-based project ordering.
- [`src/hooks/useProjectDiscovery.ts`](/c:/portfolio2/sourav-portfolio/src/hooks/useProjectDiscovery.ts) centralizes project filtering and recommendation logic.
- [`src/store/useAppStore.ts`](/c:/portfolio2/sourav-portfolio/src/store/useAppStore.ts) stores recruiter mode, analytics events, and project ordering.
- [`src/lib/extractResumeText.ts`](/c:/portfolio2/sourav-portfolio/src/lib/extractResumeText.ts) parses uploaded resume files.
- [`src/lib/resumeAnalyzer.ts`](/c:/portfolio2/sourav-portfolio/src/lib/resumeAnalyzer.ts) analyzes resume text and scores role-fit keywords.

## Project Structure

```text
sourav-portfolio/
  public/
    images/                project assets, certificates, and resume PDF
    manifest.webmanifest   PWA manifest
    portfolio-icon.svg     app icon used by the manifest
    sw.js                  service worker
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
    lib/                   analysis, search, extraction, motion, and cache helpers
    pages/                 route-level pages
    store/                 Zustand stores
    App.tsx                homepage composition
    main.tsx               app entry and routing
  index.html
  tailwind.config.js
  vite.config.ts
```

## Local Development

### Prerequisites

- Node.js 18+
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
- `npm run test` run the Vitest suite
- `npm run test:watch` run Vitest in watch mode

## Case Study Slugs

- `resumeiq`
- `foodooza`
- `pollroom`
- `estateperks`

## Cleanup Notes

- Removed unused code and assets that were no longer referenced by the app.
- Temporary and build-output folders are not part of the source structure.
- Runtime assets now map directly to actively used files only.
