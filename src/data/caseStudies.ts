export type CaseStudyMetric = {
  label: string
  value: string
  detail: string
}

export type CaseStudySection = {
  title: string
  items: string[]
}

export type CaseStudy = {
  slug: string
  title: string
  role: string
  duration: string
  summary: string
  tldr: {
    problem: string
    built: string
    result: string
  }
  problem: string[]
  architecture: CaseStudySection[]
  impactMetrics: CaseStudyMetric[]
  keyDecisions: string[]
  learnings: string[]
  tech: string[]
  github?: string
  demo?: string
  image: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'resumeiq',
    title: 'ResumeIQ',
    role: 'Full Stack Developer',
    duration: '2025',
    summary:
      'Built an AI-assisted resume analysis platform that combines deterministic ATS checks with LLM feedback for practical resume improvements.',
    tldr: {
      problem: 'Job seekers needed clearer ATS feedback than generic resume advice usually provides.',
      built: 'A full-stack resume analyzer with upload, parsing, scoring, AI recommendations, and history tracking.',
      result: 'Created an end-to-end workflow that turns resume uploads into actionable reports in under 20 seconds.',
    },
    problem: [
      'Most job seekers do not know why their resume is filtered by ATS systems.',
      'Generic AI feedback can be too vague to act on and hard to trust.',
      'Users need a repeatable workflow to upload resumes, get analysis, and track improvements.',
    ],
    architecture: [
      {
        title: 'Frontend (Next.js + TypeScript)',
        items: [
          'Upload-first experience with clear analysis states and report history.',
          'Structured UI for score, keyword match, missing skills, and rewrite suggestions.',
          'Session-aware protected routes with role-safe rendering.',
        ],
      },
      {
        title: 'Backend & AI Layer',
        items: [
          'Server-side APIs validate file uploads, parse content, and orchestrate scoring + LLM calls.',
          'Weighted ATS scoring logic runs before AI generation to keep outputs grounded.',
          'Prompt templates enforce response shape for section-level recommendations.',
        ],
      },
      {
        title: 'Data & Storage',
        items: [
          'Firebase Auth for identity and guarded workflows.',
          'Firestore stores analysis snapshots for trend tracking.',
          'Firebase Storage handles resume files and report assets.',
        ],
      },
    ],
    impactMetrics: [
      {
        label: 'Analysis Time',
        value: '< 20s',
        detail: 'From upload to actionable report on average network conditions.',
      },
      {
        label: 'Scoring Signal',
        value: '4 dimensions',
        detail: 'ATS score, keyword coverage, skill gap, and section quality.',
      },
      {
        label: 'Workflow Coverage',
        value: 'End-to-end',
        detail: 'Auth, upload, parsing, scoring, AI recommendations, and history.',
      },
    ],
    keyDecisions: [
      'Combined deterministic scoring with LLM feedback to reduce hallucination risk.',
      'Kept report cards concise to improve recruiter-facing readability.',
      'Stored historical reports so users can compare progress over time.',
    ],
    learnings: [
      'LLM output quality improves significantly with strict prompt structure.',
      'Users trust AI feedback more when paired with transparent numeric signals.',
      'Error states for file parsing are critical for support load reduction.',
    ],
    tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Firebase', 'OpenAI'],
    github: 'https://resume-iq-coral.vercel.app',
    demo: 'https://resume-iq-coral.vercel.app',
    image: '/resumeiq.jpeg',
  },
  {
    slug: 'foodooza',
    title: 'Foodooza (Food Delivery App)',
    role: 'Full Stack Developer',
    duration: '2025',
    summary:
      'Delivered a full-stack food ordering platform with authentication, real-time order awareness, and production-style payment and media integrations.',
    tldr: {
      problem: 'Food ordering flows often break down around auth, payments, and real-time order state changes.',
      built: 'A full-stack delivery platform with secure auth, cart and checkout flows, live order updates, and media handling.',
      result: 'Shipped a production-style ordering experience that covers the full journey from menu browse to post-order tracking.',
    },
    problem: [
      'Users needed a fast and reliable way to browse menus, place orders, and track outcomes.',
      'Conventional demo apps often skip real payment, auth security, and operational workflows.',
      'Restaurant and customer data consistency can break under concurrent order updates.',
    ],
    architecture: [
      {
        title: 'Frontend (React + State Management)',
        items: [
          'Built responsive catalog, cart, checkout, and order status screens with reusable UI patterns.',
          'Used Redux Toolkit / Context API patterns to keep cart and user flows predictable.',
          'Added robust loading, validation, and error boundaries across key user actions.',
        ],
      },
      {
        title: 'Backend (Node.js + Express)',
        items: [
          'REST APIs handle auth, product catalog, cart processing, and order lifecycle.',
          'JWT + cookie-based sessions secure user access and role-aware operations.',
          'Socket events and async flows support near-real-time order status updates.',
        ],
      },
      {
        title: 'Data, Payments, and Media',
        items: [
          'MongoDB + Mongoose model products, users, orders, and payment records.',
          'Integrated Stripe / Razorpay style payment flows for transaction handling.',
          'Cloudinary / Multer pipeline supports image upload and delivery for product media.',
        ],
      },
    ],
    impactMetrics: [
      {
        label: 'Workflow Scope',
        value: 'Full order lifecycle',
        detail: 'From menu discovery to payment and post-order state tracking.',
      },
      {
        label: 'Security Coverage',
        value: 'Auth + protected APIs',
        detail: 'Session handling and guarded routes reduced unauthorized actions.',
      },
      {
        label: 'Reliability Focus',
        value: 'State consistency',
        detail: 'Structured state and API guards improved cart/order correctness.',
      },
    ],
    keyDecisions: [
      'Kept API contracts explicit to simplify debugging between frontend and backend.',
      'Separated payment concerns from core ordering logic for safer iteration.',
      'Built with production-like integrations instead of a simplified prototype stack.',
    ],
    learnings: [
      'Order systems require careful state synchronization across multiple async events.',
      'Payment integration quality depends on strict validation and failure-state UX.',
      'Clear schema design early reduces refactoring overhead as features expand.',
    ],
    tech: [
      'React (Vite)',
      'Redux Toolkit / Context API',
      'Node.js',
      'Express.js',
      'MongoDB + Mongoose',
      'JWT / Cookies',
      'Socket.IO',
      'Stripe / Razorpay',
      'Cloudinary / Multer',
    ],
    github: 'https://github.com/sourav81R/Food-App',
    demo: 'https://food-app-frontend-lh2k.onrender.com/',
    image: '/images/food.jpeg',
  },
  {
    slug: 'pollroom',
    title: 'PollRoom',
    role: 'Full Stack Developer',
    duration: '2025',
    summary:
      'Designed a real-time polling platform with reliable live updates, secure participation, and fairness checks for vote integrity.',
    tldr: {
      problem: 'Traditional polling tools feel static and are vulnerable to duplicate participation.',
      built: 'A React and Socket.IO polling app with live updates, guarded voting, and server-side fairness rules.',
      result: 'Enabled instant audience feedback while keeping poll participation trustworthy and synchronized.',
    },
    problem: [
      'Traditional polling tools feel static and do not provide instant feedback loops.',
      'Vote integrity becomes difficult when users can vote multiple times.',
      'Real-time systems need predictable synchronization between clients and server.',
    ],
    architecture: [
      {
        title: 'Client Experience',
        items: [
          'React interface with immediate result updates using socket events.',
          'Optimistic UI patterns for smooth voting interactions.',
          'Poll creation and participation flows with clean validation feedback.',
        ],
      },
      {
        title: 'Realtime Backend',
        items: [
          'Socket.IO channels broadcast vote updates to connected participants.',
          'JWT + Google OAuth used for identity and guarded actions.',
          'Server-side checks enforce one vote per identity strategy.',
        ],
      },
      {
        title: 'Data Layer',
        items: [
          'MongoDB schema models polls, options, participants, and vote records.',
          'Indexes and query shaping keep active poll reads responsive.',
          'Aggregated vote summaries are emitted after each accepted vote.',
        ],
      },
    ],
    impactMetrics: [
      {
        label: 'Realtime Sync',
        value: 'Instant',
        detail: 'Connected users receive vote updates without manual refresh.',
      },
      {
        label: 'Fairness Control',
        value: '1 vote / identity',
        detail: 'Server checks reduce duplicate participation patterns.',
      },
      {
        label: 'Engagement',
        value: 'Live loop',
        detail: 'Interactive feedback increases user participation quality.',
      },
    ],
    keyDecisions: [
      'Kept vote validation server-authoritative instead of client-trusted.',
      'Used event-driven updates to avoid polling-heavy API calls.',
      'Separated poll creation and voting permissions for safer expansion.',
    ],
    learnings: [
      'Realtime UX requires explicit handling of disconnect/reconnect states.',
      'Simple fairness rules dramatically improve trust in poll outcomes.',
      'Socket event naming conventions matter for long-term maintainability.',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.IO', 'JWT', 'Google OAuth'],
    github: 'https://github.com/sourav81R/realtime-poll-app',
    demo: 'https://realtime-poll-app-one.vercel.app',
    image: '/poll.webp',
  },
  {
    slug: 'estateperks',
    title: 'EstatePerks',
    role: 'Mobile Application Developer',
    duration: '2024',
    summary:
      'Built a cross-platform mobile workflow for property visit tracking and reward management, replacing manual coordination.',
    tldr: {
      problem: 'Property visits and reward tracking were still being coordinated through manual processes.',
      built: 'A React Native workflow for visit tracking, rewards, navigation, and API-backed status management.',
      result: 'Improved operational visibility with a mobile-first system that streamlined field execution across devices.',
    },
    problem: [
      'Field visit tracking and rewards were managed manually, causing delays and errors.',
      'Teams needed a mobile-first interface with predictable navigation and status visibility.',
      'Business users required clear records of completed visits and reward outcomes.',
    ],
    architecture: [
      {
        title: 'Mobile Frontend',
        items: [
          'React Native screens with predictable flow for visits, rewards, and status.',
          'State handled through Context API with explicit loading/error states.',
          'Map-assisted visit flow to improve location context and execution speed.',
        ],
      },
      {
        title: 'Integration Layer',
        items: [
          'REST APIs for visits, reward updates, and profile operations.',
          'Axios service abstraction to centralize request and error handling.',
          'Auth-aware API calls to keep user actions scoped and secure.',
        ],
      },
      {
        title: 'Delivery & Runtime',
        items: [
          'Expo setup enabled faster iteration across Android and iOS environments.',
          'Navigation architecture designed for scale with modular screen groups.',
          'Web-compatible builds supported demo and broader accessibility.',
        ],
      },
    ],
    impactMetrics: [
      {
        label: 'Platform Reach',
        value: 'Cross-platform',
        detail: 'Single codebase for multiple device environments.',
      },
      {
        label: 'Operational Clarity',
        value: 'Structured tracking',
        detail: 'Visits and rewards move through a visible workflow.',
      },
      {
        label: 'Delivery Speed',
        value: 'Faster iteration',
        detail: 'Expo-based dev cycle shortened release feedback loops.',
      },
    ],
    keyDecisions: [
      'Prioritized usability and navigation consistency for field users.',
      'Used API abstraction to reduce duplication across screens.',
      'Scoped core feature set first, then optimized for smoother flow.',
    ],
    learnings: [
      'Mobile UX quality depends heavily on form-state and loading-state handling.',
      'Field workflows benefit from explicit statuses more than dense feature lists.',
      'Cross-platform parity requires early testing across different screen sizes.',
    ],
    tech: ['React Native', 'Expo', 'TypeScript', 'Axios', 'React Navigation'],
    github: 'https://github.com/sourav81R/EstatePerks',
    demo: 'https://estate-perks.vercel.app/auth/login',
    image: '/images/estate.jpeg',
  },
]

export const caseStudyBySlug: Record<string, CaseStudy> = caseStudies.reduce(
  (acc, item) => {
    acc[item.slug] = item
    return acc
  },
  {} as Record<string, CaseStudy>
)
