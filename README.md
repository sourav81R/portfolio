# Sourav Portfolio

Personal developer portfolio built with React, TypeScript, Tailwind CSS, Framer Motion, and React Router. The app presents a recruiter-friendly landing page, interactive project showcase, detailed case-study routes, and a contact experience focused on quick hiring outreach.

## Overview

This codebase powers a single-page portfolio at `/` plus dedicated case-study pages at `/case-studies/:slug`.

The homepage is organized into these sections:

- `Hero`
- `RecruiterHighlights`
- `About`
- `Experience`
- `Testimonials`
- `Skills`
- `Projects`
- `Education`
- `Certifications`
- `Contact`

Sections are lazy-loaded where it makes sense, and the navigation supports hash-based scrolling, active section tracking, theme toggling, and a command palette opened with `Ctrl/Cmd + K`.

## Key Features

- Animated hero section with terminal-style typing, floating icons, and resume actions
- Open-to-work banner with dismiss persistence and direct contact CTA
- Resume preview modal rendered inline from the PDF
- Global command palette for section jumps, theme switching, external links, and case-study shortcuts
- Responsive navbar with scroll spy and progress indicator
- Recruiter-focused highlight section with quick hiring facts and contact shortcuts
- Testimonials section ready for LinkedIn recommendations
- Filterable project gallery with featured toggle, modal details, and case-study deep dives
- Dedicated case-study routes for `ResumeIQ`, `Foodooza`, `PollRoom`, and `EstatePerks`, each with a TL;DR card
- Interactive skills section with optional hover-triggered audio feedback
- Contact section with copy-to-clipboard actions and a mailto-powered outreach form
- Dark/light theme persistence using `localStorage`

## Tech Stack

- React 19
- TypeScript
- React Router DOM 7
- Tailwind CSS 3
- Framer Motion
- Zustand
- Lucide React
- Vite via `rolldown-vite`
- PostCSS + Autoprefixer

## Project Structure

```text
src/
  components/
    common/        reusable animated, modal, and utility UI
    layout/        navbar and footer
    sections/      homepage sections
    ui/            small UI primitives
  constants/       shared UI constants such as section colors
  data/            case studies and shared content collections
  pages/           route-level pages
  store/           Zustand state for the command palette
  styles/          global visual effects and shared CSS
  App.tsx          homepage composition
  main.tsx         router entry point
public/
  images/          resume PDF and project images
  *.jpeg|*.png     additional portfolio assets
```

## Routing

- `/` renders the full portfolio landing page
- `/case-studies/:slug` renders detailed project case-study pages
- any unknown route redirects back to `/`

## Content Model

Most portfolio content is stored directly in code:

- `src/components/sections/Projects.tsx` contains the active project card data used on the homepage
- `src/data/caseStudies.ts` powers the case-study detail pages
- `src/components/sections/Experience.tsx`, `src/components/sections/Education.tsx`, and `src/components/sections/Certifications.tsx` store profile timeline content inline
- `src/components/sections/Contact.tsx` contains contact links and the email template logic

If you want to update portfolio content, these files are the main editing points.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` serves the production build locally

## Design Notes

- Tailwind handles the bulk of layout and theming
- Framer Motion powers section reveals, hover interactions, and motion accents
- The visual style leans on monospace typography, animated borders, glow effects, glassy panel treatments, and a subtle hero grain overlay
- Reduced-motion preferences are partially respected in animated areas like the hero and border effects

## Repository Notes

Legacy Vue starter files and dependencies have been removed, so the repo now reflects the active React portfolio much more closely.

## Current Status

The README now matches the implemented portfolio, including the recruiter-focused upgrades, project structure, setup flow, and cleaned dependency set.
