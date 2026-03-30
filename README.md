# Sourav Portfolio

A recruiter-focused developer portfolio built with React, TypeScript, Tailwind CSS, Framer Motion, and React Router. The app combines a polished single-page landing experience with dedicated case-study routes, resume actions, hiring-friendly shortcuts, and a project gallery that lets visitors explore live demos without leaving the site.

## Preview

![Desktop preview](./site-home.png)
![Mobile preview](./site-mobile.png)

## What This Project Includes

- Single-page portfolio homepage composed from modular React sections
- Dedicated case-study pages at `/case-studies/:slug`
- Lazy-loaded sections for most homepage content
- Dark/light theme toggle persisted with `localStorage`
- Command palette opened with `Ctrl/Cmd + K`
- Resume preview modal and animated resume download flow
- Dismissible open-to-work banner with sticky offset handling
- Scroll-aware navbar with active-section tracking and progress bar
- Filterable projects grid with modal details and embedded live demo tab
- Contact section with mailto form, copy-to-clipboard actions, and recruiter email template
- Open Graph metadata and preview image for link sharing

## Stack

- React 19
- TypeScript
- React Router DOM 7
- Tailwind CSS 3
- Framer Motion
- Zustand
- Lucide React
- Vite via `rolldown-vite`
- PostCSS + Autoprefixer

## Routes

- `/` renders the full landing page
- `/case-studies/:slug` renders a detailed case study page
- Unknown routes redirect back to `/`

## Homepage Sections

The homepage is assembled in [`src/App.tsx`](/c:/portfolio2/sourav-portfolio/src/App.tsx) and currently renders these sections in order:

1. `Hero`
2. `RecruiterHighlights`
3. `About`
4. `Experience`
5. `Testimonials`
6. `Skills`
7. `Projects`
8. `Education`
9. `Certifications`
10. `Contact`

## Content Map

Most portfolio content is stored directly in the codebase instead of a CMS.

- [`src/components/sections/Projects.tsx`](/c:/portfolio2/sourav-portfolio/src/components/sections/Projects.tsx) contains the homepage project inventory, filters, featured state, modal content, and demo links.
- [`src/data/caseStudies.ts`](/c:/portfolio2/sourav-portfolio/src/data/caseStudies.ts) contains the structured data for case-study pages.
- [`src/components/sections/Experience.tsx`](/c:/portfolio2/sourav-portfolio/src/components/sections/Experience.tsx), [`src/components/sections/Education.tsx`](/c:/portfolio2/sourav-portfolio/src/components/sections/Education.tsx), and [`src/components/sections/Certifications.tsx`](/c:/portfolio2/sourav-portfolio/src/components/sections/Certifications.tsx) hold timeline/profile content.
- [`src/components/sections/Contact.tsx`](/c:/portfolio2/sourav-portfolio/src/components/sections/Contact.tsx) contains direct contact info, the email form, and the recruiter template copy action.
- [`src/components/layout/Navbar.tsx`](/c:/portfolio2/sourav-portfolio/src/components/layout/Navbar.tsx), [`src/components/layout/OpenToWorkBanner.tsx`](/c:/portfolio2/sourav-portfolio/src/components/layout/OpenToWorkBanner.tsx), and [`src/components/common/CommandPalette.tsx`](/c:/portfolio2/sourav-portfolio/src/components/common/CommandPalette.tsx) define the core recruiter-facing navigation and shortcut flows.

## Project Structure

```text
sourav-portfolio/
  public/
    images/              project assets and resume PDF
    og-preview.png       social share preview image
    profile.jpg          hero/profile image
  src/
    components/
      common/            reusable motion, modal, and utility components
      layout/            navbar, footer, open-to-work banner
      sections/          homepage sections
    constants/           shared section color map
    data/                case-study content
    pages/               route-level pages
    store/               Zustand store for command palette state
    styles/              shared visual effect styles
    App.tsx              homepage composition
    main.tsx             router entry point
    index.css            global Tailwind and app styles
  index.html             SEO and social metadata
  tailwind.config.js     Tailwind config
  vite.config.ts         Vite config
```

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates the production bundle in `dist/`
- `npm run preview` serves the built app locally

## Notable Implementation Details

- [`src/main.tsx`](/c:/portfolio2/sourav-portfolio/src/main.tsx) uses `BrowserRouter`, explicit routes, and a catch-all redirect.
- [`src/App.tsx`](/c:/portfolio2/sourav-portfolio/src/App.tsx) lazy-loads most content sections and retries hash scrolling after route changes.
- [`src/components/common/ResumePreviewModal.tsx`](/c:/portfolio2/sourav-portfolio/src/components/common/ResumePreviewModal.tsx) renders the PDF viewer through a portal.
- [`src/components/common/SmartResume.tsx`](/c:/portfolio2/sourav-portfolio/src/components/common/SmartResume.tsx) handles the animated download flow.
- [`src/components/sections/Projects.tsx`](/c:/portfolio2/sourav-portfolio/src/components/sections/Projects.tsx) supports category filters, featured-only mode, project detail modals, and inline iframe demo previews with fallback messaging.
- [`src/components/sections/Skills.tsx`](/c:/portfolio2/sourav-portfolio/src/components/sections/Skills.tsx) includes optional hover-triggered Web Audio feedback.
- [`index.html`](/c:/portfolio2/sourav-portfolio/index.html) defines SEO, Open Graph, and Twitter card metadata for the deployed site.

## Current Case Studies

These slugs are currently backed by structured data and route pages:

- `resumeiq`
- `foodooza`
- `pollroom`
- `estateperks`

## Notes

- This repository currently does not define test or lint scripts.
- The active application lives in this `sourav-portfolio/` folder.
