import resumeIqImage from '../assets/projects/resumeiq.jpeg'
import { resolvePublicAsset } from '../lib/publicAsset'

export type ProjectCategory = 'Web' | 'AI' | 'Mobile' | 'Realtime'

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
  featured?: boolean
  /** Omitted for closed-source professional work, which links to the live product instead. */
  github?: string
  liveUrl?: string
  bgImage: string
  caseStudySlug?: string
  recruiterPriority: number
  impact: string
  previewVideo?: string
}

export const projects: ProjectRecord[] = [
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
    featured: true,
    liveUrl: 'https://voteniti.in',
    bgImage: resolvePublicAsset('/images/voteniti.webp'),
    recruiterPriority: 12,
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
    featured: true,
    // Canonical host: oneisok.co 307-redirects to www, so link www directly.
    liveUrl: 'https://www.oneisok.co',
    bgImage: resolvePublicAsset('/images/oneisok.webp'),
    recruiterPriority: 11,
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
    github: 'https://github.com/sourav81R/weather-forecasting-religion-language',
    liveUrl: 'https://weather-forecasting-religion-langua.vercel.app/',
    bgImage: resolvePublicAsset('/images/weather.jpeg'),
    recruiterPriority: 7,
    impact: 'Complex backend-first product with analytics, ML, and resilience.',
  },
]

export const featuredProjects = projects.filter((project) => project.featured)
