import { useRef, useState } from 'react'
import clsx from 'clsx'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileBadge2,
  MapPin,
  Sparkles,
} from 'lucide-react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import ExperienceModal, {
  type ExperienceEntry,
} from '../common/ExperienceModal'
import { getSectionRevealProps } from '../../lib/motion'
import { resolvePublicAsset } from '../../lib/publicAsset'

const experienceData: ExperienceEntry[] = [
  {
    role: 'Full Stack Developer',
    company: 'Oneisok Digital Solution',
    period: 'May 2026 - Present',
    location: 'Kolkata, India (Onsite)',
    badge: 'Current Role',
    summary:
      'Building and maintaining company platforms end to end - TejViral, a local-business discovery and commerce platform; Voteniti, a nationwide election operations platform; the company website with its own admin CMS; and the OneisOk Legal consultancy site.',
    // Every point names its project, so TejViral and Voteniti work is never
    // mixed up in the details modal or the highlights panel.
    description: [
      'TejViral - Built tejviral.com, a local-business discovery and commerce platform with separate customer, vendor, partner, and admin workspaces on Next.js 16, Express 5, and Supabase PostgreSQL 17.',
      'TejViral - Delivered category, subcategory, PIN-code, and radius-based business search, plus intent-aware Daily Needs search with suggestions and missed-search analytics.',
      'TejViral - Developed SMS, email, and WhatsApp campaign automation (WhatsApp Cloud API and a QR-linked device service) with gateways, contacts, templates, workflows, and reports.',
      'TejViral - Shipped hosted vCards and WhatsApp stores, an online shop with cart, coupons, shipping, and vendor commissions, and Razorpay payments.',
      'TejViral - Run it in production on AWS EC2 with Nginx, PM2, and a GitHub Actions CI/CD pipeline; secured with HTTP-only cookies, CSRF checks, role-based access, and Row Level Security.',
      'Voteniti - Built voteniti.in, a full-stack Election Management System covering MP, MLA, Panchayat, and Municipal elections, down to constituency, block, ward, and booth.',
      'Voteniti - Implemented RBAC with election- and area-specific permissions, smart-delete approval workflows, audit logs, and performance tracking.',
      'Voteniti - Designed hierarchical area management with on-demand loading of large geographic datasets (~255k Gram Panchayats and ~97k urban Wards), so the database stays small.',
      'Voteniti - Replaced thousands of serial per-row queries with bulk subtree loading, cutting MP hierarchy load from minutes to seconds.',
      'Voteniti - Added an admin-managed CMS for blogs, team, testimonials, and per-page SEO on the public site.',
      'Oneisok website - Rebuilt oneisok.co on Next.js 14 with a centralised lead management system, role-based dashboards (Super Admin, HR, Office), and an influencer portal with KYC uploads and review workflows.',
      'OneisOk Legal - Built legal.oneisok.co, a zero-build static site with 35+ data-driven service pages that deploys unchanged to Vercel and cPanel.',
      'Across projects - Deliver CMS and multilingual UI features end to end, improve performance, technical SEO, and security, and own production deployment workflows.',
    ],
    metrics: [
      'TejViral: customer, vendor, partner, and admin workspaces live',
      'Voteniti: elections managed from MP level down to booth level',
      'Oneisok website: lead management, role-based dashboards, and influencer portal',
    ],
    tech: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Supabase',
      'MongoDB',
      'Razorpay',
      'AWS EC2',
      'Tailwind CSS',
      'TanStack Query',
      'Zod',
      'JWT',
    ],
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'Euphoria GenX',
    period: 'Aug 2025 - Feb 2026',
    location: 'Remote',
    badge: 'Previous Internship',
    summary:
      'Built and shipped a real-time food delivery application during a structured full-stack internship focused on practical product delivery.',
    description: [
      'Completed a structured internship focused on full-stack web development and product thinking.',
      'Built the Foodooza real-time food delivery application with end-to-end frontend and backend functionality.',
      'Implemented responsive UI flows, real-time interactions, and integrated key product features across the stack.',
      'Strengthened debugging, deployment, and collaboration skills in an industry-style development environment.',
    ],
    metrics: [
      '6-month internship program completed',
      '1 end-to-end food delivery app built',
      'Real-time UX and backend integration delivered',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
    credential: {
      label: 'Verified internship credential',
      title: 'Certificate of Internship',
      summary:
        'Issued by Euphoria GenX for successfully completing the internship programme and delivering the PetPooja/Foodooza real-time food delivery web app project.',
      fileSrc: resolvePublicAsset('/images/euphoria-internship-certificate.svg'),
      previewImageSrc: resolvePublicAsset('/images/euphoria-internship-certificate.svg'),
      previewImageAlt:
        'Euphoria GenX internship certificate awarded to Sourav Chowdhury for the PetPooja real-time food delivery web app project.',
      credentialId: 'EG-26-1586',
      issuedOn: '18 Feb 2026',
      projectLabel: 'Open case study',
      projectHref: '/case-studies/foodooza',
    },
  },
  {
    role: 'Web Developer Intern',
    company: 'Pinnacle Labs Pvt Ltd',
    period: 'Oct 2024 - Nov 2024',
    location: 'Remote',
    badge: 'Previous Internship',
    summary:
      'Delivered frontend modules, API integrations, and bug fixes in a remote internship focused on shipping production-ready React work.',
    description: [
      'Developed frontend components using React and modern JavaScript.',
      'Integrated REST APIs and handled request/response workflows across core screens.',
      'Debugged UI, API, and data-flow issues to improve delivery reliability.',
      'Used Git and followed SDLC-based development practices in a structured remote setup.',
    ],
    metrics: [
      '5+ UI modules delivered',
      '4 core API workflows integrated',
      '<24h turnaround on recurring UI and data bugs',
    ],
    tech: ['React', 'JavaScript', 'REST APIs', 'Git'],
    credential: {
      label: 'Internship completion certificate',
      title: 'Pinnacle Labs Internship Certificate',
      summary:
        'Certificate PDF for the remote full-stack internship at Pinnacle Labs Pvt Ltd, covering frontend delivery, API integration, debugging, and SDLC-based development practices.',
      fileSrc: resolvePublicAsset('/images/pinnacle-certificate.pdf'),
      verifyLabel: 'Verify on Pinnacle Labs',
      verifyHref: 'https://pinnaclelabs.tech/verify/',
    },
  },
]

type ActiveModalState =
  | {
      view: 'details' | 'certificate'
      experience: ExperienceEntry
    }
  | null

const Experience = () => {
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const stackRef = useRef<HTMLDivElement>(null)
  const [activeModal, setActiveModal] = useState<ActiveModalState>(null)
  // 0 when the first card pins, 1 when the last one has covered the stack.
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  })

  return (
    <>
      {/*
        No AnimatedBorder here: its overflow-hidden would stop the cards from
        sticking. Sticky also relies on html/body/#root using overflow-x: clip
        (see index.css).
      */}
      <motion.div
        {...sectionRevealProps}
        className="px-4 py-16 text-gray-900 dark:text-white sm:px-6 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
            Real Work Timeline
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Experience
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
            Scroll through my roles - each one stacks over the last.
          </p>
        </div>

        <div
          ref={stackRef}
          className="relative mx-auto mt-10 max-w-5xl"
          style={reduceMotion ? undefined : { height: `${(experienceData.length + 1) * 55}vh` }}
        >
          <div
            className={reduceMotion ? 'space-y-6' : 'sticky grid items-start'}
            style={reduceMotion ? undefined : { top: STACK_TOP }}
          >
            {experienceData.map((experience, index) => (
              <StackedExperienceCard
                key={`${experience.company}-${experience.period}`}
                experience={experience}
                index={index}
                total={experienceData.length}
                progress={scrollYProgress}
                reduceMotion={Boolean(reduceMotion)}
                onOpen={(view) => setActiveModal({ view, experience })}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <ExperienceModal
        open={activeModal !== null}
        view={activeModal?.view ?? 'details'}
        experience={activeModal?.experience ?? null}
        onClose={() => setActiveModal(null)}
      />
    </>
  )
}

const pad = (value: number) => String(value).padStart(2, '0')

/** One accent per role, as full class strings so Tailwind keeps them. */
const cardAccents = [
  'border-sky-400/70 dark:border-sky-400/50',
  'border-emerald-400/70 dark:border-emerald-400/50',
  'border-fuchsia-400/70 dark:border-fuchsia-400/50',
] as const
const cardTints = [
  'bg-sky-50 dark:bg-sky-950',
  'bg-emerald-50 dark:bg-emerald-950',
  'bg-fuchsia-50 dark:bg-fuchsia-950',
] as const
const cardLines = [
  'from-sky-400 via-cyan-400 to-emerald-400',
  'from-emerald-400 via-teal-400 to-sky-400',
  'from-fuchsia-400 via-violet-400 to-sky-400',
] as const
/** Tinted highlights panel and its icon colour, per role. */
const panelTints = [
  'border-sky-200/80 bg-sky-50/70 dark:border-sky-400/20 dark:bg-sky-500/[0.06]',
  'border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-500/[0.06]',
  'border-fuchsia-200/80 bg-fuchsia-50/70 dark:border-fuchsia-400/20 dark:bg-fuchsia-500/[0.06]',
] as const
const panelIcons = [
  'text-sky-500 dark:text-sky-300',
  'text-emerald-500 dark:text-emerald-300',
  'text-fuchsia-500 dark:text-fuchsia-300',
] as const

type StackedExperienceCardProps = {
  experience: ExperienceEntry
  index: number
  total: number
  progress: MotionValue<number>
  reduceMotion: boolean
  onOpen: (view: 'details' | 'certificate') => void
}

/*
 * Stacked scroll card.
 *
 * Every card is position: sticky and pins a little lower than the one before
 * it (STACK_TOP + index * STACK_STEP), so the edges of the covered cards stay
 * visible as a stack. Later cards come later in the DOM and paint on top, so
 * scrolling down slides each new card over the previous one; scrolling up
 * peels them back. The spacer after each card (except the last) is the scroll
 * distance a card stays fully in view before the next one arrives.
 *
 * Covered cards shrink slightly as later cards arrive. Reduced motion keeps
 * the stacking (it is scroll position, not animation) but drops the scaling.
 */
// Clears the fixed navbar (and the top banner while it is shown), so the
// stack is never hidden behind the bar when it slides back in.
const STACK_TOP = 'calc(var(--banner-offset, 0px) + 6.5rem)'
const STACK_STEP = 18

const StackedExperienceCard = ({
  experience,
  index,
  total,
  progress,
  reduceMotion,
  onOpen,
}: StackedExperienceCardProps) => {
  const isLast = index === total - 1
  const targetScale = 1 - (total - 1 - index) * 0.04
  const enterStart = index / (total + 1)
  const enterEnd = (index + 1) / (total + 1)
  const startY = typeof window === 'undefined' ? 600 : window.innerHeight * 0.72
  const y = useTransform(
    progress,
    [enterStart, enterEnd],
    [index === 0 ? 0 : startY, index * STACK_STEP]
  )
  const opacity = useTransform(
    progress,
    [enterStart, Math.min(enterStart + 0.01, enterEnd)],
    [index === 0 ? 1 : 0, 1]
  )
  const scale = useTransform(
    progress,
    [enterEnd, 1],
    [1, targetScale]
  )

  return (
    // All cards are direct children of one stack container: sticky can only
    // travel within its parent's content box, so a shared parent keeps every
    // card pinned for the whole stack. The gap is a margin (inside the
    // parent's content box), not padding, for the same reason.
      <motion.article
        style={reduceMotion ? undefined : {
          y,
          opacity,
          zIndex: index + 1,
          scale,
        }}
        className={clsx(
          'origin-top',
          reduceMotion ? 'relative' : 'col-start-1 row-start-1',
          !reduceMotion && !isLast && 'mb-4'
        )}
      >
        <div
          className={clsx(
            'relative overflow-hidden rounded-[28px] border-2 p-5 shadow-[0_-18px_50px_-30px_rgba(15,23,42,0.35),0_30px_70px_-45px_rgba(15,23,42,0.45)] dark:shadow-[0_-18px_50px_-30px_rgba(0,0,0,0.9)] sm:p-7 lg:p-8',
            cardAccents[index % cardAccents.length],
            cardTints[index % cardTints.length]
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
              cardLines[index % cardLines.length]
            )}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-5 select-none font-mono text-[7rem] font-black leading-none text-gray-900/[0.04] dark:text-white/[0.05] sm:text-[9rem]"
          >
            {pad(index + 1)}
          </span>

          {/*
            Phones: single column (as before). From md: details on the left,
            a tinted highlights panel on the right that fills the wider card
            with the role's key outcomes.
          */}
          <div className="relative grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-8">
          <div className="min-w-0">
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-200">
                  {experience.badge}
                </span>
                <span className="font-mono text-[11px] font-semibold tabular-nums text-gray-400 dark:text-gray-500">
                  {pad(index + 1)} / {pad(total)}
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {experience.role}
              </h3>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300 sm:text-base">
                <Briefcase size={16} className="text-emerald-500 dark:text-emerald-400" />
                {experience.company}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 sm:flex-col sm:items-end md:hidden">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800">
                <Calendar size={13} />
                {experience.period}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800">
                <MapPin size={13} />
                {experience.location}
              </span>
            </div>
          </div>

          <p className="relative mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-[15px]">
            {experience.summary}
          </p>

          <div className="relative mt-4 flex flex-wrap gap-2">
            {experience.tech.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div
            className={clsx(
              'relative mt-5 grid gap-2.5',
              experience.credential && 'sm:grid-cols-2'
            )}
          >
            <button
              type="button"
              onClick={() => onOpen('details')}
              className="group inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-full border border-sky-300/35 bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_-16px_rgba(14,165,233,0.85)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:via-cyan-400 hover:to-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200/80 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0b1220]"
            >
              <Briefcase size={16} className="shrink-0 text-white transition group-hover:scale-110" />
              <span>View Details</span>
              <ChevronRight size={16} className="shrink-0 text-white/90 transition group-hover:translate-x-1" />
            </button>
            {experience.credential && (
              <button
                type="button"
                onClick={() => onOpen('certificate')}
                className="group inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-full border border-emerald-300/35 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_-16px_rgba(16,185,129,0.82)] transition duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-emerald-200/80 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0b1220]"
              >
                <FileBadge2 size={16} className="shrink-0 text-white transition group-hover:scale-110" />
                <span>View Certificate</span>
                <ChevronRight size={16} className="shrink-0 text-white/90 transition group-hover:translate-x-1" />
              </button>
            )}
          </div>
          </div>

          {/* Highlights panel (tablet/desktop) */}
          <aside
            className={clsx(
              'relative hidden flex-col rounded-[22px] border p-5 md:flex lg:p-6',
              panelTints[index % panelTints.length]
            )}
          >
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                <Calendar size={13} />
                {experience.period}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                <MapPin size={13} />
                {experience.location}
              </span>
            </div>

            <p className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
              <Sparkles size={13} className={panelIcons[index % panelIcons.length]} />
              Highlights
            </p>
            <ul className="mt-3 space-y-3">
              {experience.metrics.slice(0, 4).map((metric) => (
                <li key={metric} className="flex items-start gap-2.5 text-sm leading-snug text-gray-700 dark:text-gray-200">
                  <CheckCircle2
                    size={17}
                    className={clsx('mt-0.5 shrink-0', panelIcons[index % panelIcons.length])}
                  />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </aside>
          </div>
        </div>
      </motion.article>
  )
}

export default Experience
