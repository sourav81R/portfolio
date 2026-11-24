import resumeIqImage from '../assets/projects/resumeiq.jpeg'
import { resolvePublicAsset } from '../lib/publicAsset'

/** Technical domain - shown as a secondary filter and on the modal header. */
export type ProjectCategory = 'Web' | 'AI' | 'Mobile' | 'Realtime'

/**
 * What kind of thing was built - the primary filter in the projects section.
 * - `Frontend`: marketing / content sites and client-only apps, no backend of mine.
 * - `Full Stack`: websites with their own API, database, auth, and admin surface.
 * - `Software`: products and tools (SaaS, platforms, mobile apps) rather than websites.
 */
export type ProjectType = 'Frontend' | 'Full Stack' | 'Software'

/** Order here is the order of the filter chips. */
export const projectTypes: ProjectType[] = ['Frontend', 'Full Stack', 'Software']

/** Singular label, used on cards and in the modal. */
export const projectTypeLabels: Record<ProjectType, string> = {
  Frontend: 'Frontend Website',
  'Full Stack': 'Full Stack Website',
  Software: 'Software',
}

/** One-line explanation shown under the type filter for the active type. */
export const projectTypeDescriptions: Record<ProjectType, string> = {
  Frontend: 'Marketing and content sites and client-side apps - design, motion, accessibility, and SEO.',
  'Full Stack': 'Websites with their own API, database, authentication, and admin panel.',
  Software: 'Products and platforms - SaaS, operations systems, mobile apps, and tools.',
}

/** Plural label, used on the filter chips. */
export const projectTypeFilterLabels: Record<ProjectType, string> = {
  Frontend: 'Frontend Websites',
  'Full Stack': 'Full Stack Websites',
  Software: 'Software',
}

export type ProjectRecord = {
  slug: string
  title: string
  role: string
  description: string
  problem: string
  solution: string
  points: string[]
  learnings: string[]
  tech: string[]
  category: ProjectCategory
  type: ProjectType
  featured?: boolean
  /** Omitted for closed-source professional work, which links to the live product instead. */
  github?: string
  liveUrl?: string
  /**
   * false when the live site sends X-Frame-Options / frame-ancestors that forbid
   * embedding; the modal then shows the cover with an "Open live site" button
   * instead of an iframe that would only render the browser's blocked page.
   */
  embeddable?: boolean
  bgImage: string
  caseStudySlug?: string
  recruiterPriority: number
  impact: string
  previewVideo?: string
}

/**
 * Display order is driven by `recruiterPriority` (highest first), not by the
 * position in this array - see `useProjectDiscovery`. The agreed order is:
 *   TejViral (20) > Voteniti (19) > Oneisok website (18) > Satyanarayan
 *   Travel (17) > Avatar Ink (16) > Darjeeling Hair Company (15.5) >
 *   Sonam's Clothing (15) > OneisOk Legal (14)
 * followed by earlier work at 10 and below. Keep gaps unique when reordering.
 */
export const projects: ProjectRecord[] = [
  {
    slug: 'tejviral',
    title: 'TejViral',
    role: 'Full Stack Developer',
    description:
      'Built the current TejViral platform as a full-stack product for local-business discovery, customer and vendor services, marketing automation, digital storefronts, and online commerce.',
    problem:
      'Local businesses needed one place to get discovered, reach nearby customers, market their services, and sell online. Since the product was already live, its data, customer accounts, URLs, and mobile-app API also had to keep working as the platform moved to a modern stack.',
    solution:
      'Built the current platform with Next.js 16, React 19, TypeScript, Express 5, and Supabase PostgreSQL. Delivered customer, vendor, partner, and admin workspaces alongside business search, campaign automation, Mb24h storefronts, and online shopping, while preserving the existing customer and mobile-app experience.',
    points: [
      'Built the business-discovery experience, including category and subcategory browsing, PIN-code and radius search, and Daily Needs suggestions informed by local searches.',
      'Delivered separate customer, vendor, partner, and admin workspaces, including partner territories and the tools each role needs to manage its work.',
      'Created SMS, email, and WhatsApp campaign workflows with provider gateways, contact lists, reusable templates, QR-linked WhatsApp devices, and reporting.',
      'Launched Mb24h hosted vCards and WhatsApp stores, with themes, NFC cards, referrals, and AI-assisted card tools; also delivered the shop’s cart, coupons, shipping, payments, and vendor commissions.',
      'Added HTTP-only session cookies, Origin-based CSRF protection, role-checked admin APIs, and PostgreSQL Row Level Security for public tables.',
      'Deployed and operate the production platform on AWS EC2 with Nginx, PM2, and a GitHub Actions pipeline for reviewed releases.',
      'Moved the live 97-table, 61,767-row database to PostgreSQL 17, checked 616,365 cell values with no mismatches, and preserved existing passwords and the mobile-app API contract.',
    ],
    learnings: [
      'Modernising a live system incrementally without breaking its mobile clients or existing user accounts',
      'Designing additive, idempotent migrations and verifying data integrity before cut-over',
      'Running background messaging workers safely alongside production data',
      'Owning self-managed cloud infrastructure end to end, from Nginx and PM2 to CI/CD',
    ],
    tech: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Node.js 22',
      'Express 5',
      'PostgreSQL 17',
      'Supabase',
      'Kysely',
      'Zod',
      'Razorpay',
      'Firebase',
      'WhatsApp Cloud API',
      'AWS EC2',
      'Nginx',
      'PM2',
      'GitHub Actions',
    ],
    category: 'Web',
    type: 'Software',
    featured: true,
    embeddable: false,
    liveUrl: 'https://tejviral.com',
    bgImage: resolvePublicAsset('/images/tejviral.webp'),
    recruiterPriority: 20,
    impact:
      'Built and shipped a live, multi-workspace platform for local-business discovery, customer and vendor operations, marketing automation, digital storefronts, and online commerce.',
  },
  {
    slug: 'satyanarayan-travel',
    title: 'Satyanarayan Travel',
    role: 'Full Stack Developer',
    description:
      'Travel agency website with tour package discovery, customer enquiries, booking workflows, and an admin CMS.',
    problem:
      'The agency sold domestic and international tours over phone and WhatsApp, with no online catalogue, no structured enquiry pipeline, and no way for staff to update packages themselves.',
    solution:
      'Built a full-stack Next.js site where customers browse packages and destinations and send enquiries, while staff manage tours, bookings, and content from a secured admin CMS.',
    points: [
      'Built tour package and destination discovery, customer enquiries, and booking workflows',
      'Delivered an admin CMS so staff manage packages, destinations, gallery, and blog content without a developer',
      'Secured accounts with the Firebase Admin SDK, HTTP-only session cookies, and server-side role authorisation',
      'Persisted catalogue, enquiry, and booking data in MongoDB through Mongoose models',
    ],
    learnings: [
      'Server-side session handling with HTTP-only cookies instead of client-held tokens',
      'Enforcing roles on the server so hidden admin UI is never the only line of defence',
      'Modelling a content-heavy catalogue that non-technical staff can safely edit',
    ],
    tech: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'Firebase Auth',
      'MongoDB',
      'Mongoose',
    ],
    category: 'Web',
    type: 'Full Stack',
    featured: true,
    embeddable: false,
    liveUrl: 'https://satyanarayan-travel.vercel.app',
    bgImage: resolvePublicAsset('/images/satyanarayan-travel.webp'),
    recruiterPriority: 17,
    impact:
      'Turned a phone-and-WhatsApp travel business into an online catalogue with enquiries, bookings, and a staff CMS.',
  },
  {
    slug: 'avatar-ink-tattoo-studio',
    title: 'Avatar Ink Tattoo Studio',
    role: 'Frontend Developer',
    description:
      'Responsive, animated marketing site for a Darjeeling tattoo studio with artist, gallery, and contact pages.',
    problem:
      'The studio relied on social media alone, with no home for its portfolio, artists, and services, and no simple way for new clients to request a booking.',
    solution:
      'Designed and built a cinematic, motion-rich marketing site that showcases the work and routes booking enquiries straight to WhatsApp, while staying fully accessible.',
    points: [
      'Built home, about, artist, gallery, and contact pages with a dark, editorial visual identity',
      'Added smooth scrolling and scroll-driven animation with Lenis and Framer Motion',
      'Routed booking enquiries straight to WhatsApp, so no backend is needed to capture leads',
      'Kept it accessible with full keyboard navigation and a reduced-motion mode that disables animation',
    ],
    learnings: [
      'Making heavy motion feel premium without hurting performance or accessibility',
      'Respecting prefers-reduced-motion as a first-class design state',
      'Shipping a conversion-focused site for a small business with zero running cost',
    ],
    tech: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'Framer Motion',
      'Lenis',
    ],
    category: 'Web',
    type: 'Frontend',
    featured: true,
    liveUrl: 'https://avatarinktattoostudio.in',
    bgImage: resolvePublicAsset('/images/avatar-ink.webp'),
    recruiterPriority: 16,
    impact:
      'Motion-rich studio site that converts visitors into WhatsApp bookings, with keyboard and reduced-motion support.',
  },
  {
    slug: 'sonams-clothing',
    title: "Sonam's Clothing",
    role: 'Full Stack Developer',
    description:
      'E-commerce store for a Darjeeling clothing shop with catalogue, wishlist, cart, UPI checkout, and a full admin panel.',
    problem:
      'A family clothing store (est. 2001) wanted to sell across India without payment-gateway fees or paid hosting, while staying in control of catalogue, orders, and payment verification.',
    solution:
      'Built a Next.js storefront with a manual UPI / QR checkout the admin verifies, an admin panel for products, categories, orders, and settings, and image storage inside MongoDB so it runs entirely on free tiers.',
    points: [
      'Built shop, product, wishlist, cart, and checkout flows with category and subcategory filters',
      'Designed a UPI / QR checkout where a unique transaction ID per order stops one payment being reused, and the admin verifies it',
      'Re-priced every cart and order on the server, so prices, stock, shipping, and roles are never trusted from the browser',
      'Stored admin image uploads in MongoDB with client-side resizing and file-signature checks, staying under Vercel limits with no paid storage',
      'Verified Firebase ID tokens on the server with Node crypto and shared cached catalogue reads across serverless instances with tag-based revalidation',
    ],
    learnings: [
      'Designing a trustworthy checkout when there is no payment gateway to lean on',
      'Fitting a real store inside free-tier limits for hosting, database, and media',
      'Cache invalidation that stays correct across serverless instances',
    ],
    tech: [
      'Next.js 16',
      'TypeScript',
      'Tailwind CSS 4',
      'MongoDB',
      'Firebase Auth',
      'Vercel',
    ],
    category: 'Web',
    type: 'Full Stack',
    featured: true,
    liveUrl: 'https://sonamsclothing.com',
    bgImage: resolvePublicAsset('/images/sonams-clothing.webp'),
    recruiterPriority: 15,
    impact:
      'All-India e-commerce store with verified UPI checkout and an admin panel, running entirely on free tiers.',
  },
  {
    slug: 'oneisok-legal',
    title: 'OneisOk Legal Consultancy',
    role: 'Frontend Developer at Oneisok Digital Solution',
    description:
      'Premium, fully static legal consultancy website with 35+ data-driven service pages, built with no framework and no build step.',
    problem:
      'The consultancy needed a fast, trustworthy site that deploys unchanged to both Vercel and cPanel shared hosting, with no backend or database to maintain.',
    solution:
      'Built a vanilla HTML, CSS, and JavaScript site where one JSON file drives every service card, detail page, and enquiry form, and the same files ship to either host.',
    points: [
      'Made services.json the single source of truth: one entry creates a card, a detail page, and a form option',
      'Shipped matching vercel.json and .htaccess configs so both hosts serve the same clean URLs, caching, and security headers',
      'Built accessible navigation with a keyboard-operable dropdown, a focus-trapped mobile drawer, and full reduced-motion support',
      'Measured every key colour pair against WCAG AA and added JSON-LD for LegalService, FAQPage, Article, and per-service pages',
      'Routed static forms to prefilled WhatsApp messages with a honeypot and a drop-in hosted-form fallback',
    ],
    learnings: [
      'How far a framework-free site can go with good structure and a token-based design system',
      'Writing deployment config that works identically on two different hosts',
      'Treating accessibility and contrast as measured requirements, not assumptions',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Lenis', 'JSON-LD', 'Vercel', 'cPanel'],
    category: 'Web',
    type: 'Frontend',
    featured: true,
    embeddable: false,
    liveUrl: 'https://legal.oneisok.co',
    bgImage: resolvePublicAsset('/images/oneisok-legal.webp'),
    recruiterPriority: 14,
    impact:
      'Zero-build, host-agnostic legal site with 35+ data-driven service pages and WCAG AA contrast throughout.',
  },
  {
    slug: 'darjeeling-hair-company',
    title: 'Darjeeling Hair Company',
    role: 'Full Stack Developer',
    description:
      'Full-stack salon website and super admin for bookings, services, gallery, hero slides, and business settings.',
    problem:
      'The salon needed a polished way to present its services and work online, collect appointment requests, and keep everyday website content current without developer involvement.',
    solution:
      'Built a Next.js 16 salon website with a Firebase-authenticated super admin, MongoDB-backed content, and image uploads stored in GridFS. Admins can manage bookings, services, gallery items, homepage slides, contact details, and opening hours.',
    points: [
      'Built a responsive salon website with service discovery, gallery, contact details, and appointment requests',
      'Created a protected super admin for managing bookings, hero slides, services, gallery, and site settings',
      'Verified Firebase ID tokens on the server and restricted admin access to an explicit email allowlist',
      'Resized and converted uploaded images to WebP in the browser before storing them in MongoDB GridFS',
      'Added bundled starter content so the site remains presentable before the salon uploads its own photos and services',
    ],
    learnings: [
      'Building a content-management workflow around the real tasks salon staff perform',
      'Handling protected admin access with server-side identity verification and an email allowlist',
      'Managing image uploads efficiently while keeping site content in MongoDB',
    ],
    tech: [
      'Next.js 16',
      'TypeScript',
      'Tailwind CSS v4',
      'Framer Motion',
      'MongoDB',
      'GridFS',
      'Firebase Auth',
    ],
    category: 'Web',
    type: 'Full Stack',
    featured: true,
    embeddable: false,
    liveUrl: 'https://www.thedarjeelinghaircompanyunisexsalon.in/',
    bgImage: resolvePublicAsset('/images/Darjeeling Salon.png'),
    recruiterPriority: 15.5,
    impact:
      'Live salon website with a protected super admin for bookings, services, gallery, and MongoDB GridFS image uploads.',
  },
  {
    slug: 'voteniti',
    title: 'Voteniti',
    role: 'Full Stack Developer at Oneisok Digital Solution',
    description:
      'Production Election Management System running MP, MLA, Municipal, and Panchayat election operations across India.',
    problem:
      'Election teams manage a deep geography - state, district, constituency, block, panchayat, ward, booth - with thousands of workers per seat. Spreadsheets and ad hoc tools cannot enforce who may act at which level, and loading the whole national administrative dataset would blow past a small database tier.',
    solution:
      'Built a hierarchy-driven platform where the org chart itself is the team: real Area Master records drive every election type, area- and election-scoped RBAC gates every write, and large datasets are served on demand instead of being stored.',
    points: [
      'Modeled the full India hierarchy (543 Lok Sabha seats down to individual booths) as an authoritative Area Master seeded from ECI and LGD government datasets',
      'Designed an on-demand data layer serving ~255k Gram Panchayats and ~97k urban Wards from bundled NDJSON, materializing single rows into Postgres only on first use to stay inside a 500 MB tier',
      'Implemented enterprise RBAC with area- and election-scoped assignments, server-side subtree guards, and smart-delete requests routed to Super Admin approval',
      'Cut MP hierarchy load from minutes to seconds by replacing thousands of serial per-row queries with bulk subtree materialization',
      'Shipped the public Voteniti marketing site with an admin CMS for blogs, team, testimonials, per-page SEO, and a message inbox',
    ],
    learnings: [
      'Designing schemas against messy real-world government data and its known quirks',
      'Trading storage for compute with on-demand materialization under a hard database ceiling',
      'Building recursive permission guards that hold up against direct API calls, not just hidden UI',
    ],
    tech: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Node.js',
      'Express',
      'PostgreSQL',
      'TanStack Query',
      'Zod',
      'JWT',
      'Tailwind CSS',
    ],
    category: 'Web',
    type: 'Software',
    featured: true,
    liveUrl: 'https://voteniti.in',
    bgImage: resolvePublicAsset('/images/voteniti.webp'),
    recruiterPriority: 19,
    impact:
      'Nationwide election operations platform: 543 constituencies modeled, 85+ migrations, minutes-to-seconds hierarchy loads.',
  },
  {
    slug: 'oneisok-website',
    title: 'Oneisok Website & Admin Panel',
    role: 'Full Stack Developer at Oneisok Digital Solution',
    description:
      'Company website rebuilt on Next.js 14 with a role-based admin panel and a self-service influencer portal.',
    problem:
      'The existing site needed a developer and a deploy for every content change, and staff had no safe way to manage services, testimonials, or influencer submissions themselves.',
    solution:
      'Rebuilt the site on the App Router with MongoDB Atlas persistence and a built-in admin panel, so HR and office staff manage content directly while the app still runs locally on bundled sample data.',
    points: [
      'Built a role-based admin panel (Super Admin, HR, Office staff) for managing site content without a deploy',
      'Added a self-service influencer portal with profile submission and review workflows',
      'Kept the app runnable with zero database credentials by falling back to bundled sample data for local development',
      'Migrated existing data off Firestore onto MongoDB Atlas and scripted seeding, staff creation, and content sync',
    ],
    learnings: [
      'Structuring App Router projects so public pages and admin surfaces share logic without leaking access',
      'Making a database-backed app pleasant to develop against with no credentials',
      'Planning and executing a one-off production data migration safely',
    ],
    tech: [
      'Next.js 14',
      'TypeScript',
      'Tailwind CSS',
      'MongoDB Atlas',
      'Firebase Auth',
      'App Router',
    ],
    category: 'Web',
    type: 'Full Stack',
    featured: true,
    // Canonical host: oneisok.co 307-redirects to www, so link www directly.
    liveUrl: 'https://www.oneisok.co',
    bgImage: resolvePublicAsset('/images/oneisok.webp'),
    recruiterPriority: 18,
    impact:
      'Content ships without a deploy; staff self-serve through a role-based panel backed by MongoDB Atlas.',
  },
  {
    slug: 'resumeiq',
    title: 'ResumeIQ',
    role: 'Full Stack Developer',
    description: 'AI-powered resume analyzer and ATS optimizer built as a production-ready SaaS app.',
    problem: 'Job seekers struggle to understand ATS compatibility, missing keywords, and section-level resume weaknesses.',
    solution: 'Built a full-stack platform with secure auth, resume parsing, AI analysis, weighted ATS scoring, and downloadable reports.',
    points: [
      'Implemented Firebase Google Sign-In and protected routes with secure session cookies',
      'Built PDF and DOCX upload flow with Firebase Storage and Firestore report history',
      'Integrated OpenAI analysis for ATS score, keyword match, skill gaps, and improvements',
    ],
    learnings: [
      'Designing production-ready Next.js App Router APIs',
      'Balancing AI outputs with deterministic scoring logic',
      'Building secure and scalable Firebase-backed SaaS workflows',
    ],
    tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Firebase', 'OpenAI'],
    category: 'AI',
    type: 'Software',
    featured: true,
    github: 'https://resume-iq-coral.vercel.app',
    liveUrl: 'https://resume-iq-coral.vercel.app',
    bgImage: resumeIqImage,
    caseStudySlug: 'resumeiq',
    recruiterPriority: 10,
    impact: 'End-to-end ATS workflow with auth, AI, scoring, and history.',
  },
  {
    slug: 'foodooza',
    title: 'Foodooza',
    role: 'Full Stack Developer',
    description: 'Real-time food delivery app with authentication, payments, and database integration.',
    problem: 'Traditional food ordering lacked real-time updates, payment clarity, and operational automation.',
    solution: 'Developed a full-stack application with authentication, live data, and production-style integrations.',
    points: [
      'Coordinated frontend and backend integration for the full order flow',
      'Implemented authentication workflows and guarded operations',
      'Handled payment/media integrations and order consistency concerns',
    ],
    learnings: ['Full-stack architecture tradeoffs', 'Auth systems', 'Backend debugging'],
    tech: ['React (Vite)', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'Stripe'],
    category: 'Realtime',
    type: 'Full Stack',
    featured: true,
    github: 'https://github.com/sourav81R/Food-App',
    liveUrl: 'https://food-app-frontend-lh2k.onrender.com/',
    bgImage: resolvePublicAsset('/images/food.jpeg'),
    caseStudySlug: 'foodooza',
    recruiterPriority: 9,
    impact: 'Realtime ordering journey from catalog to checkout and tracking.',
  },
  {
    slug: 'estateperks',
    title: 'EstatePerks',
    role: 'Mobile Application Developer',
    description: 'Cross-platform mobile app for property visit tracking and rewards.',
    problem: 'Property visits and reward tracking were being handled manually.',
    solution: 'Built a React Native app to automate visits, rewards, and navigation.',
    points: ['Multi-screen navigation', 'Context API state management', 'REST API integration'],
    learnings: ['Mobile UX design', 'React Native architecture', 'State management patterns'],
    tech: ['React Native', 'Expo', 'TypeScript', 'React Navigation', 'Axios'],
    category: 'Mobile',
    type: 'Software',
    featured: true,
    github: 'https://github.com/sourav81R/EstatePerks',
    liveUrl: 'https://estate-perks.vercel.app/auth/login',
    bgImage: resolvePublicAsset('/images/estate.jpeg'),
    caseStudySlug: 'estateperks',
    recruiterPriority: 8,
    impact: 'Mobile workflow automation for field operations and reward tracking.',
  },
  {
    slug: 'pollroom',
    title: 'PollRoom',
    role: 'Full Stack Developer',
    description: 'Real-time polling application where users can create polls, vote, and see live updates.',
    problem: 'Standard polling often lacks real-time interactivity and fair participation controls.',
    solution: 'Built a full-stack app with Socket.IO for real-time updates and robust auth.',
    points: [
      'Real-time result updates via Socket.IO',
      'Secure auth with JWT and Google OAuth',
      'Fairness mechanisms for one vote per identity',
    ],
    learnings: ['WebSocket implementation', 'Authentication strategies', 'Realtime schema design'],
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.IO', 'JWT'],
    category: 'Realtime',
    type: 'Software',
    featured: true,
    github: 'https://github.com/sourav81R/realtime-poll-app',
    liveUrl: 'https://realtime-poll-app-one.vercel.app',
    bgImage: resolvePublicAsset('/poll.webp'),
    caseStudySlug: 'pollroom',
    recruiterPriority: 8,
    impact: 'Instant audience feedback loop with secure participation rules.',
  },
  {
    slug: 'employee-management',
    title: 'Employee Management',
    role: 'Full Stack Learner',
    description: 'Basic CRUD application for managing employee records through a cleaner admin workflow.',
    problem: 'Manual employee record handling becomes slow, repetitive, and error-prone as data grows.',
    solution: 'Built a CRUD-based full-stack interface to create, update, review, and manage employee information efficiently.',
    points: [
      'Implemented create, read, update, and delete flows for employee records',
      'Built structured form handling and validation for data entry',
      'Connected frontend workflows with backend persistence and auth-ready architecture',
    ],
    learnings: [
      'Data modeling for admin-facing CRUD interfaces',
      'Form validation and state synchronization',
      'Connecting React views to backend APIs in a maintainable way',
    ],
    tech: [
      'React 18',
      'React Router',
      'Axios',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'JWT',
      'bcryptjs',
      'helmet',
      'cors',
      'express-rate-limit',
      'nodemailer',
    ],
    category: 'Web',
    type: 'Full Stack',
    github: 'https://github.com/sourav81R/Employee-Management',
    liveUrl: 'https://employee-management-ivory-mu.vercel.app/login',
    bgImage: resolvePublicAsset('/employee.jpeg'),
    recruiterPriority: 6,
    impact: 'Shows practical CRUD, API integration, and full-stack workflow fundamentals.',
  },
  {
    slug: 'quiz-app',
    title: 'Quiz App',
    role: 'Frontend Developer',
    description: 'Interactive quiz experience with dynamic questions, scoring, and instant feedback.',
    problem: 'Static quizzes often feel flat and do not provide clear feedback loops for users.',
    solution: 'Created a responsive quiz interface with score tracking, state-driven progression, and lightweight UX feedback.',
    points: [
      'Built dynamic question progression with score calculation',
      'Handled answer selection and result-state transitions cleanly',
      'Designed a simple interface focused on usability and clarity',
    ],
    learnings: [
      'Conditional rendering for interactive flows',
      'State-driven UI updates',
      'Designing small apps with clear user feedback',
    ],
    tech: ['React', 'JavaScript', 'CSS', 'Vercel'],
    category: 'Web',
    type: 'Frontend',
    github: 'https://github.com/sourav81R/Quiz-App',
    liveUrl: 'https://quiz-app-ebon-five-26.vercel.app',
    bgImage: resolvePublicAsset('/quiz.png'),
    recruiterPriority: 5,
    impact: 'Demonstrates clean frontend logic for interactive user flows.',
  },
  {
    slug: 'currency-converter',
    title: 'Currency Converter',
    role: 'Frontend Developer',
    description: 'Web utility for converting currencies using live exchange-rate data.',
    problem: 'Users needed a simple way to compare currencies quickly without navigating heavyweight finance apps.',
    solution: 'Built a lightweight converter with real-time API data, validation, and a focused single-purpose UI.',
    points: [
      'Integrated live exchange-rate data into a responsive form flow',
      'Added validation for reliable user input and conversion handling',
      'Kept the interface fast and minimal for utility-focused use',
    ],
    learnings: [
      'Formatting API data for UI presentation',
      'User input validation patterns',
      'Designing simple tools that feel polished and practical',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Exchange Rate API', 'GitHub Pages'],
    category: 'Web',
    type: 'Frontend',
    github: 'https://github.com/sourav81R/Currency-Converter',
    liveUrl: 'https://sourav81r.github.io/Currency-Converter/',
    bgImage: resolvePublicAsset('/images/currency.png'),
    recruiterPriority: 5,
    impact: 'Highlights API consumption and focused utility-product design.',
  },
  {
    slug: 'rock-paper-scissor',
    title: 'Rock-Paper-Scissor Game',
    role: 'Game UI Developer',
    description: 'Classic browser-based Rock Paper Scissors game with score tracking and replayable interaction.',
    problem: 'Simple games can become messy quickly when the interaction logic and score state are not well structured.',
    solution: 'Built a lightweight game flow with clear event handling, score management, and responsive UI behavior.',
    points: [
      'Implemented the core win-loss game logic and replay loop',
      'Tracked score state and round outcomes in the browser',
      'Created a responsive interface for quick play sessions',
    ],
    learnings: [
      'Separating game logic from UI rendering',
      'Event handling for interactive browser apps',
      'Building playful interfaces with simple state models',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    category: 'Web',
    type: 'Frontend',
    github: 'https://github.com/sourav81R/Rock-Paper-Scissor',
    liveUrl: 'https://sourav81r.github.io/Rock-Paper-Scissor/',
    bgImage: resolvePublicAsset('/images/game.jpeg'),
    recruiterPriority: 4,
    impact: 'Shows approachable interactive logic and browser-based state management.',
  },
  {
    slug: 'verifyai',
    title: 'VerifyAI',
    role: 'Team Member & Frontend Lead',
    description: 'AI-powered platform to detect fake news and deepfake content.',
    problem: 'AI-generated misinformation is difficult to verify quickly and reliably.',
    solution: 'Built a real-time verification dashboard using React and API-driven validation.',
    points: ['Designed data-heavy UI components', 'Integrated verification APIs', 'Handled error states and edge cases'],
    learnings: ['Scalable UI design', 'API performance optimization', 'Team collaboration'],
    tech: ['React', 'JavaScript', 'REST APIs'],
    category: 'AI',
    type: 'Software',
    featured: true,
    github: 'https://github.com/sourav81R/VerifyAI',
    liveUrl: 'https://verifyai.is-a.software/',
    bgImage: resolvePublicAsset('/images/verifyai.jpeg'),
    recruiterPriority: 7,
    impact: 'Trust-oriented interface for AI misinformation validation.',
  },
  {
    slug: 'regional-weather-studio',
    title: 'Regional Weather Studio',
    role: 'Full Stack + ML Developer',
    description: 'Flask and JavaScript weather intelligence platform with ML prediction and offline-ready support.',
    problem: 'Typical weather apps show raw data but lack unified decision support and resilient offline behavior.',
    solution: 'Engineered a dual-runtime weather studio with backend intelligence services and fallback logic.',
    points: [
      'Built Flask APIs for analytics, AI insights, alerts, and planning workflows',
      'Implemented ML next-day forecasting and sky-condition detection',
      'Added storm-aware maps, PWA support, and offline forecast fallback',
    ],
    learnings: ['Graceful degradation', 'Confidence-weighted forecast fusion', 'Model-aware fallback logic'],
    tech: ['Python', 'Flask', 'JavaScript', 'SQLite', 'TensorFlow/Keras', 'Leaflet'],
    category: 'AI',
    type: 'Software',
    github: 'https://github.com/sourav81R/weather-forecasting-religion-language',
    liveUrl: 'https://weather-forecasting-religion-langua.vercel.app/',
    bgImage: resolvePublicAsset('/images/weather.jpeg'),
    recruiterPriority: 7,
    impact: 'Complex backend-first product with analytics, ML, and resilience.',
  },
]

export const featuredProjects = projects.filter((project) => project.featured)
