import { useRef } from 'react'
import clsx from 'clsx'
import { BookOpen, Calendar, GraduationCap, School, Sparkles } from 'lucide-react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { getSectionRevealProps } from '../../lib/motion'

const educationData = [
  {
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    school: 'Greater Kolkata College of Engineering & Management',
    year: '2022 - 2026',
    grade: 'CGPA: 7.85',
    status: 'Completed',
  },
  {
    degree: 'Higher Secondary (Class XII)',
    field: 'Science',
    school: 'Shyamnagar Sri Ramkrishna Vidyamandir',
    year: '2019 - 2021',
    grade: '83%',
    status: 'Foundation Stage',
  },
  {
    degree: 'Secondary (Class X)',
    field: 'General',
    school: 'Shyamnagar Sri Ramkrishna Vidyamandir',
    year: '2018 - 2019',
    grade: '70.14%',
    status: 'School Milestone',
  },
] as const

/** Per-card color system, matching the soft, distinct certification panels. */
const educationAccents = [
  {
    card: 'bg-sky-50 dark:bg-sky-950',
    border: 'border-sky-300/80 dark:border-sky-400/45',
    line: 'from-sky-400 via-cyan-400 to-blue-500',
    badge: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-200',
    icon: 'bg-sky-500/12 text-sky-600 dark:text-sky-300',
    marker: 'bg-sky-500 shadow-[0_0_0_8px_rgba(14,165,233,0.12)]',
    grade: 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-200',
    illustration: 'border-sky-300/60 bg-white/55 dark:border-sky-400/20 dark:bg-gray-950/20',
    path: '#0ea5e9',
  },
  {
    card: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-300/80 dark:border-amber-400/45',
    line: 'from-amber-400 via-orange-400 to-yellow-500',
    badge: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-200',
    icon: 'bg-amber-500/12 text-amber-600 dark:text-amber-300',
    marker: 'bg-amber-500 shadow-[0_0_0_8px_rgba(245,158,11,0.12)]',
    grade: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-200',
    illustration: 'border-amber-300/60 bg-white/55 dark:border-amber-400/20 dark:bg-gray-950/20',
    path: '#f59e0b',
  },
  {
    card: 'bg-fuchsia-50 dark:bg-fuchsia-950',
    border: 'border-fuchsia-300/80 dark:border-fuchsia-400/45',
    line: 'from-fuchsia-400 via-pink-400 to-violet-500',
    badge: 'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-200',
    icon: 'bg-fuchsia-500/12 text-fuchsia-600 dark:text-fuchsia-300',
    marker: 'bg-fuchsia-500 shadow-[0_0_0_8px_rgba(217,70,239,0.12)]',
    grade: 'border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-200',
    illustration: 'border-fuchsia-300/60 bg-white/55 dark:border-fuchsia-400/20 dark:bg-gray-950/20',
    path: '#d946ef',
  },
] as const
const educationIllustrations = [GraduationCap, BookOpen, School] as const

const STACK_TOP = 'calc(var(--banner-offset, 0px) + 6.5rem)'
const STACK_STEP = 16

const Education = () => {
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const stageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  })

  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-5xl font-mono">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.34em] text-fuchsia-500">
            Academic Journey
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Education
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
            A cleaner view of the milestones that shaped my technical foundation,
            learning habits, and readiness for software roles.
          </p>
          {!reduceMotion && (
            <p className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              Keep scrolling to explore
            </p>
          )}
        </div>

        <div
          ref={stageRef}
          className="relative mx-auto mt-10 max-w-4xl"
          style={reduceMotion ? undefined : { height: `${(educationData.length + 1) * 50}vh` }}
        >
          <div
            className={reduceMotion ? 'space-y-5' : 'sticky grid items-start'}
            style={reduceMotion ? undefined : { top: STACK_TOP }}
          >
            {educationData.map((edu, index) => (
              <EducationCard
                key={`${edu.degree}-${edu.year}`}
                edu={edu}
                index={index}
                total={educationData.length}
                progress={scrollYProgress}
                reduceMotion={Boolean(reduceMotion)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

type EducationCardProps = {
  edu: (typeof educationData)[number]
  index: number
  total: number
  progress: MotionValue<number>
  reduceMotion: boolean
}

const EducationCard = ({
  edu,
  index,
  total,
  progress,
  reduceMotion,
}: EducationCardProps) => {
  const accent = educationAccents[index % educationAccents.length]
  const Illustration = educationIllustrations[index % educationIllustrations.length]
  const enterStart = index / (total + 1)
  const enterEnd = (index + 1) / (total + 1)
  const enterFrom = typeof window === 'undefined' ? 600 : window.innerHeight * 0.72
  const y = useTransform(
    progress,
    [enterStart, enterEnd],
    [index === 0 ? 0 : enterFrom, index * STACK_STEP]
  )
  const opacity = useTransform(
    progress,
    [enterStart, enterEnd],
    [index === 0 ? 1 : 0, 1]
  )
  const scale = useTransform(
    progress,
    [enterEnd, 1],
    [1, 1 - (total - index - 1) * 0.035]
  )

  return (
    <motion.article
      style={reduceMotion ? undefined : { y, opacity, scale, zIndex: index + 1 }}
      className={clsx(
        'origin-top',
        reduceMotion ? 'relative' : 'col-start-1 row-start-1'
      )}
    >
      <div
        className={clsx(
          'group relative min-h-[18rem] overflow-hidden rounded-[28px] border-2 p-5 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] transition-shadow duration-300 hover:shadow-[0_34px_90px_-48px_rgba(15,23,42,0.55)] dark:shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)] sm:min-h-[20rem] sm:p-8',
          accent.card,
          accent.border
        )}
      >
        <span
          aria-hidden="true"
          className={clsx('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', accent.line)}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 -top-7 select-none font-mono text-[9rem] font-black leading-none text-gray-900/[0.045] dark:text-white/[0.05] sm:text-[12rem]"
        >
          0{index + 1}
        </span>

        <div className="relative z-10 flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-center sm:gap-10">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]',
                  accent.badge
                )}
              >
                <Sparkles size={12} />
                {edu.status}
              </span>
              <span className="font-mono text-[11px] font-semibold tabular-nums text-gray-500 dark:text-gray-400">
                0{index + 1} / 0{total}
              </span>
            </div>

            <h3 className="mt-5 flex items-start gap-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              <span className={clsx('mt-0.5 inline-flex shrink-0 rounded-2xl p-2.5', accent.icon)}>
                <GraduationCap size={21} />
              </span>
              <span>{edu.degree}</span>
            </h3>
            <p className="mt-3 text-base font-medium text-gray-700 dark:text-gray-300 sm:pl-[3.4rem]">
              {edu.field}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 sm:pl-[3.4rem]">
              <School size={16} className="shrink-0" />
              {edu.school}
            </p>
          </div>

          <div className="relative flex shrink-0 flex-row flex-wrap gap-2 sm:flex-col sm:items-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3.5 py-2 text-sm text-gray-700 shadow-sm dark:border-white/10 dark:bg-gray-950/25 dark:text-gray-200">
              <Calendar size={14} />
              {edu.year}
            </span>
            <span
              className={clsx(
                'inline-flex items-center rounded-full border px-3.5 py-2 text-sm font-semibold shadow-sm',
                accent.grade
              )}
            >
              {edu.grade}
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative z-10 mt-5 w-full lg:absolute lg:bottom-7 lg:left-8 lg:z-0 lg:mt-0 lg:w-[min(52%,30rem)]"
        >
          <svg viewBox="0 0 460 54" className="h-12 w-full overflow-visible sm:h-14">
            <path
              d="M24 25 C100 25 100 25 178 25 S300 25 436 25"
              fill="none"
              stroke={accent.path}
              strokeDasharray="5 7"
              strokeLinecap="round"
              strokeOpacity="0.36"
              strokeWidth="2"
            />
            {[24, 178, 436].map((cx, step) => (
              <g key={cx}>
                <circle cx={cx} cy="25" r="12" fill={accent.path} fillOpacity="0.12" />
                <circle cx={cx} cy="25" r="5" fill={accent.path} />
                <text
                  x={cx}
                  y="51"
                  textAnchor="middle"
                  fill="currentColor"
                  className="font-mono text-[9px] font-semibold uppercase tracking-[1.5px]"
                  opacity="0.68"
                >
                  {['Learn', 'Practice', 'Achieve'][step]}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none relative z-10 mt-4 flex h-[4.5rem] w-full items-center gap-3 overflow-hidden rounded-[18px] border px-4 shadow-sm backdrop-blur-sm lg:absolute lg:bottom-6 lg:right-6 lg:z-0 lg:mt-0 lg:h-32 lg:w-60 lg:gap-4 lg:rounded-[22px] lg:px-5',
            accent.illustration
          )}
        >
          <span className={clsx('inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl lg:h-[4.25rem] lg:w-[4.25rem] lg:rounded-[20px]', accent.icon)}>
            <Illustration size={30} strokeWidth={1.5} className="lg:hidden" />
            <Illustration size={38} strokeWidth={1.5} className="hidden lg:block" />
          </span>
          <span className="relative flex min-w-0 flex-col gap-1">
            <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400 lg:text-[9px] lg:tracking-[0.2em]">
              Academic journey
            </span>
            <span className="text-xs font-bold leading-snug text-gray-800 dark:text-gray-100 lg:text-sm">
              Learn · grow · achieve
            </span>
            <span className={clsx('mt-0.5 h-1 w-12 rounded-full lg:mt-1 lg:w-14', accent.icon.split(' ')[0])} />
          </span>
          <Sparkles size={15} className={clsx('absolute right-3 top-3 lg:right-4 lg:top-4', accent.icon.split(' ')[1])} />
        </div>
      </div>
    </motion.article>
  )
}

export default Education
