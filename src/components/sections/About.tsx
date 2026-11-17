import {
  Brain,
  Briefcase,
  Code,
  Database,
  Rocket,
  Users,
  Zap,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import CountUp from '../common/CountUp'
import { getSectionRevealProps } from '../../lib/motion'

type StatItem = {
  icon: typeof Briefcase
  value: string
  countTo?: number
  suffix?: string
  label: string
  /** Optional plain-language clarification shown under the label. */
  note?: string
  color: string
  bg: string
}

const stats: StatItem[] = [
  {
    icon: Briefcase,
    value: 'Oneisok',
    label: 'Full Stack Developer',
    color: 'text-sky-500 dark:text-sky-300',
    bg: 'bg-sky-500/12',
  },
  {
    icon: Code,
    value: '15+',
    countTo: 15,
    suffix: '+',
    // "Built" counts every project in the Projects section (client and
    // personal); every one of them is live. The 5 are client products only -
    // TejViral, Voteniti and the Oneisok website are Oneisok in-house
    // products. Same wording as the hero stats.
    label: 'Projects Built',
    note: 'incl. 5 client products',
    color: 'text-emerald-500 dark:text-emerald-300',
    bg: 'bg-emerald-500/12',
  },
  {
    icon: Database,
    value: 'B.Tech',
    label: 'CSE Graduate, 2026',
    color: 'text-cyan-500 dark:text-cyan-300',
    bg: 'bg-cyan-500/12',
  },
  {
    icon: Zap,
    value: 'APIs',
    label: 'REST Integration',
    color: 'text-blue-500 dark:text-blue-300',
    bg: 'bg-blue-500/12',
  },
]

const qualities = [
  {
    title: 'Problem Solver',
    description:
      'I like breaking down messy requirements into clear, practical steps that a team can actually ship.',
    icon: Brain,
    color: 'text-sky-500 dark:text-sky-300',
    bg: 'bg-sky-500/12',
  },
  {
    title: 'Fast Learner',
    description:
      'I adapt quickly, enjoy exploring new tools, and keep tightening both engineering habits and product judgment.',
    icon: Rocket,
    color: 'text-emerald-500 dark:text-emerald-300',
    bg: 'bg-emerald-500/12',
  },
  {
    title: 'Collaborator',
    description:
      'I value clear communication, steady iteration, and dependable follow-through when building with others.',
    icon: Users,
    color: 'text-cyan-500 dark:text-cyan-300',
    bg: 'bg-cyan-500/12',
  },
] as const

const tags = [
  'Full Stack Developer',
  'Production Systems',
  'Data Modelling',
  'Performance & Scale',
] as const

const focusAreas = [
  'Next.js 16',
  'PostgreSQL at Scale',
  'RBAC & Authorization',
  'System Design',
] as const

const About = () => {
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)

  return (
    <motion.div
      {...sectionRevealProps}
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/65 to-transparent dark:via-white/15" />
        <div className="absolute left-[10%] top-20 h-40 w-40 rounded-full bg-sky-500/10 blur-[95px]" />
        <div className="absolute right-[12%] top-[18%] h-44 w-44 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-10 left-[22%] h-36 w-36 rounded-full bg-cyan-500/8 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.36em] text-sky-600 dark:text-sky-300">
            About Me
          </p>
          <h2 className="display-poster poster-shadow mt-5 text-[2.6rem] uppercase leading-[0.9] text-gray-950 dark:text-white sm:text-[3.35rem] lg:text-[3.8rem]">
            <span className="inline-block -skew-x-6">Built with focus,</span>{' '}
            <span className="inline-block -skew-x-6">growing with intent.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.34, delay: 0.08 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-x-2 -inset-y-2 rounded-[34px] border border-white/10 bg-white/6 dark:bg-white/[0.02]" />
          <div className="premium-panel about-feature-panel soft-panel relative rounded-[30px] border border-white/14 px-6 py-8 pt-16 backdrop-blur-md sm:px-10 sm:py-11 sm:pt-16">
            <div className="about-feature-label absolute -left-3 -top-5 z-20 rounded-[12px] border border-white/20 bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-white sm:-left-4 sm:-top-6 sm:px-6 sm:py-3 sm:text-[15px]">
              About Me
            </div>

            <p className="text-base leading-8 text-gray-700 dark:text-gray-100 sm:text-[1.08rem] sm:leading-9">
              {/* Mirrors the Professional Summary on the resume
                  (public/images/resume.pdf), including its bold phrases.
                  Update both together. */}
              Full Stack Developer with{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                1+ year of development experience
              </span>
              , including{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                full-time at Oneisok Digital Solution
              </span>
              , building and deploying production web platforms, and earlier
              internships at{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                Euphoria GenX
              </span>{' '}
              and{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                Pinnacle Labs
              </span>
              . 2026 B.Tech (CSE) graduate skilled in{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                Next.js, React, TypeScript, Node.js
              </span>{' '}
              and{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                PostgreSQL/MongoDB
              </span>
              , working across REST APIs, authentication, role-based access
              control, payment integration, marketing automation and{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                AWS
              </span>{' '}
              deployment. Shipped 5 live products, including
              business-discovery, election-management and admin platforms.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="premium-chip flex items-center justify-center rounded-2xl border border-white/12 bg-white/78 px-3 py-2 text-center text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] sm:rounded-full sm:px-4 sm:text-[11px] sm:tracking-[0.18em] text-gray-700 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.24)] backdrop-blur-md dark:bg-white/7 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.28, delay: 0.1 + index * 0.06 }}
              className="premium-panel soft-panel rounded-[24px] border border-white/12 bg-white/78 p-4 backdrop-blur-md sm:p-5 dark:bg-[#07111a]/78"
            >
              {/* Heading left, icon right on one row; min-w-0 lets a long
                  value truncate instead of pushing the icon out. */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <h3 className="min-w-0 break-words text-xl font-bold sm:text-2xl text-gray-900 dark:text-white">
                  {typeof stat.countTo === 'number' ? (
                    <CountUp to={stat.countTo} suffix={stat.suffix} />
                  ) : (
                    stat.value
                  )}
                </h3>
                <div
                  aria-hidden="true"
                  className={`inline-flex shrink-0 rounded-xl p-2 sm:rounded-2xl sm:p-2.5 ${stat.bg} ${stat.color}`}
                >
                  <stat.icon size={20} className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] sm:tracking-[0.22em] text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              {stat.note && (
                <p className="mt-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {stat.note}
                </p>
              )}
            </motion.article>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.32, delay: 0.14 }}
            className="premium-panel soft-panel rounded-[30px] border border-white/12 bg-white/78 p-6 backdrop-blur-md dark:bg-[#07111a]/78 sm:p-7"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">
              Current Focus
            </p>
            <p className="mt-4 text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
              Deepening my knowledge of modern React architecture, shipping
              stronger case studies, and building a better understanding of how
              interface decisions connect with performance, scale, and product
              clarity.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              {focusAreas.map((item) => (
                <span
                  key={item}
                  className="premium-chip flex items-center justify-center rounded-2xl border border-emerald-400/18 bg-emerald-500/10 px-3 py-2 text-center text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] sm:rounded-full sm:px-4 sm:text-[11px] sm:tracking-[0.2em] text-emerald-700 dark:text-emerald-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.32, delay: 0.18 }}
            className="premium-panel soft-panel rounded-[30px] border border-white/12 bg-white/78 p-6 backdrop-blur-md dark:bg-[#07111a]/78 sm:p-7"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-300">
              Snapshot
            </p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-gray-700 dark:text-gray-300">
              <p>
                I enjoy structured workflows, clear debugging, and interfaces
                that feel intentional rather than overdesigned.
              </p>
              <p>
                My goal is to keep growing from portfolio projects into team
                environments where quality, communication, and momentum matter.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {qualities.map((quality, index) => (
            <motion.article
              key={quality.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.06 }}
              className="premium-panel soft-panel rounded-[28px] border border-white/12 bg-white/74 p-6 backdrop-blur-md dark:bg-[#07111a]/74"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="min-w-0 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {quality.title}
                </h3>
                <div
                  aria-hidden="true"
                  className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] ${quality.bg} ${quality.color}`}
                >
                  <quality.icon size={22} />
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
                {quality.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default About
