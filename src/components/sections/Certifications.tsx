import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileBadge2,
  Sparkles,
} from 'lucide-react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import CertificationModal, {
  type CertificationItem,
} from '../common/CertificationModal'
import { getSectionRevealProps } from '../../lib/motion'
import { resolvePublicAsset } from '../../lib/publicAsset'
import { useSmoothScroll } from '../../providers/SmoothScrollProvider'

const certifications: CertificationItem[] = [
  {
    title: 'AWS Academy Data Engineering',
    issuer: 'AWS Academy',
    category: 'Cloud & Data Engineering',
    summary:
      'AWS Academy graduate certificate for the Data Engineering learning track and foundational cloud/data workflow training.',
    fileSrc: resolvePublicAsset('/images/certifications/aws-academy-data-engineering.pdf'),
    completedOn: '13 Feb 2024',
  },
  {
    title: 'AI-ML Virtual Internship / Tech Camp',
    issuer: 'EduSkills',
    category: 'AI / ML Program',
    summary:
      'EduSkills certificate document for the tech camp and virtual internship learning experience.',
    fileSrc: resolvePublicAsset('/images/certifications/eduskills-tech-camp.pdf'),
    completedOn: '26 Feb 2025',
  },
  {
    title: 'Full-Stack (MERN) Training & Internship',
    issuer: 'Euphoria GenX',
    category: 'Internship Certificate',
    summary:
      'Internship completion certificate for the Euphoria GenX program and the PetPooja/Food Delivery web app work.',
    fileSrc: resolvePublicAsset(
      '/images/certifications/euphoria-genx-internship-certificate.jpg'
    ),
    completedOn: '18 Feb 2026',
  },
  {
    title: 'Digital Literacy Certificate',
    issuer: 'Capgemini',
    category: 'Professional Development',
    summary:
      'Capgemini certificate document covering digital literacy and foundational professional skills.',
    fileSrc: resolvePublicAsset('/images/certifications/capgemini-digital-literacy.pdf'),
    completedOn: 'Nov 2022',
  },
] as const

/** One accent per card. Full class strings so Tailwind keeps them. */
const accents = [
  {
    card: 'bg-emerald-50/80 dark:bg-emerald-500/[0.07]',
    border: 'border-emerald-400/70 hover:border-emerald-500 dark:border-emerald-400/55 dark:hover:border-emerald-300',
    panel: 'border-emerald-300/70 dark:border-emerald-400/30',
    line: 'from-emerald-400 via-teal-400 to-sky-400',
    chip: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
    icon: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300',
    seal: 'border-emerald-400/60 text-emerald-600 dark:text-emerald-300',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
  },
  {
    card: 'bg-sky-50/80 dark:bg-sky-500/[0.07]',
    border: 'border-sky-400/70 hover:border-sky-500 dark:border-sky-400/55 dark:hover:border-sky-300',
    panel: 'border-sky-300/70 dark:border-sky-400/30',
    line: 'from-sky-400 via-cyan-400 to-indigo-400',
    chip: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-200',
    icon: 'bg-sky-500/12 text-sky-600 dark:text-sky-300',
    seal: 'border-sky-400/60 text-sky-600 dark:text-sky-300',
    button: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
  },
  {
    card: 'bg-fuchsia-50/80 dark:bg-fuchsia-500/[0.07]',
    border: 'border-fuchsia-400/70 hover:border-fuchsia-500 dark:border-fuchsia-400/55 dark:hover:border-fuchsia-300',
    panel: 'border-fuchsia-300/70 dark:border-fuchsia-400/30',
    line: 'from-fuchsia-400 via-pink-400 to-violet-400',
    chip: 'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-200',
    icon: 'bg-fuchsia-500/12 text-fuchsia-600 dark:text-fuchsia-300',
    seal: 'border-fuchsia-400/60 text-fuchsia-600 dark:text-fuchsia-300',
    button: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white',
  },
  {
    card: 'bg-amber-50/80 dark:bg-amber-500/[0.07]',
    border: 'border-amber-400/70 hover:border-amber-500 dark:border-amber-400/55 dark:hover:border-amber-300',
    panel: 'border-amber-300/70 dark:border-amber-400/30',
    line: 'from-amber-400 via-orange-400 to-rose-400',
    chip: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-200',
    icon: 'bg-amber-500/12 text-amber-600 dark:text-amber-300',
    seal: 'border-amber-400/60 text-amber-600 dark:text-amber-300',
    button: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
  },
] as const

const pad = (value: number) => String(value).padStart(2, '0')

/** Shared horizontal gutter: header, track start, and progress line up. */
const GUTTER = 'px-4 sm:px-8 lg:px-[5vw]'

/**
 * Certifications as a full-screen, scroll-driven horizontal track.
 *
 * The section is a tall "runway" with a sticky, full-viewport panel inside.
 * While the runway scrolls past, vertical progress is mapped 1:1 onto the
 * track's horizontal offset: scrolling down moves the cards right-to-left,
 * scrolling up moves them back. The track runs edge to edge; cards are wide
 * enough that one full card and about half of the next are in view.
 *
 * Reduced motion skips the pinning and falls back to a native, swipeable
 * scroll-snap row.
 *
 * Sticky only works because html/body/#root use `overflow-x: clip` (see
 * index.css). This section also avoids AnimatedBorder, whose overflow-hidden
 * would break the pin.
 */
const Certifications = () => {
  const [activeCertification, setActiveCertification] =
    useState<CertificationItem | null>(null)
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const { scrollTo } = useSmoothScroll()

  const runwayRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const pinned = !reduceMotion && distance > 0

  // Horizontal distance the track has to travel: its overflow past the gutter.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      setDistance(Math.max(0, track.scrollWidth - track.clientWidth))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, (progress) =>
    pinned ? -progress * distance : 0
  )

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!pinned) return
    const next = Math.round(progress * (certifications.length - 1))
    setActiveIndex((current) => (current === next ? current : next))
  })

  /*
   * Keyboard users tabbing to an off-screen card (and the step buttons): move
   * the page to the scroll position that brings that card into view, instead
   * of letting the browser scroll the track (which would fight the transform).
   */
  const focusCard = (index: number) => {
    if (!pinned) return
    const runway = runwayRef.current
    const track = trackRef.current
    if (!runway || !track) return

    track.parentElement?.scrollTo({ left: 0 })
    const runwayTop = runway.getBoundingClientRect().top + window.scrollY
    const progress = index / (certifications.length - 1)
    scrollTo(runwayTop + progress * distance, { offset: 0, immediate: true })
  }

  const header = (
    <div
      className={clsx(
        GUTTER,
        'flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10'
      )}
    >
      <div>
        <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-700 dark:text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
          Certifications
        </p>
        <h2 className="display-poster mt-3 text-4xl uppercase leading-[0.95] text-gray-950 dark:text-white sm:text-5xl">
          <span className="inline-block -skew-x-6">
            Certified{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-fuchsia-500 bg-clip-text text-transparent">
              &amp; verified.
            </span>
          </span>
        </h2>
      </div>
      <div className="hidden max-w-md md:block">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
          Certificates, internships, and learning milestones across cloud, AI,
          and full-stack work.
        </p>
        {pinned && (
          <p className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
            Keep scrolling
            <ArrowRight size={14} />
          </p>
        )}
      </div>
    </div>
  )

  const track = (
    // The gutter wrapper does not clip: cards slide out to the screen edges,
    // and the sticky panel's overflow-hidden is what crops them.
    <div
      className={clsx(
        GUTTER,
        'mt-6 w-full sm:mt-8',
        !pinned && 'snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:thin]'
      )}
    >
      <motion.div
        ref={trackRef}
        style={{ x }}
        className="flex gap-4 will-change-transform sm:gap-6"
      >
        {certifications.map((cert, index) => {
          const accent = accents[index % accents.length]
          const extension = cert.fileSrc.split('.').pop()?.toLowerCase()
          const actionLabel = extension === 'pdf' ? 'View Document' : 'View Certificate'

          return (
            <article
              key={cert.title}
              className={clsx(
                'w-[86%] shrink-0 snap-start sm:w-[62%] lg:w-[46%]',
              )}
            >
              <button
                type="button"
                onClick={() => setActiveCertification(cert)}
                onFocus={() => focusCard(index)}
                aria-label={`${cert.title}, ${cert.issuer}, ${cert.completedOn}. ${actionLabel}`}
                className={clsx(
                  'group relative flex h-full w-full overflow-hidden rounded-[28px] border-2 p-5 text-left shadow-[0_30px_80px_-50px_rgba(15,23,42,0.5)] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 dark:shadow-[0_30px_80px_-50px_rgba(0,0,0,0.9)] sm:p-6 md:min-h-[clamp(15rem,38vh,20rem)] lg:p-7',
                  accent.card,
                  accent.border
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', accent.line)}
                />

                {/* Details */}
                <div className="relative flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]',
                        accent.chip
                      )}
                    >
                      <Sparkles size={12} />
                      {cert.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1 font-mono text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 md:hidden">
                      <Calendar size={12} />
                      {cert.completedOn}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                    {cert.title}
                  </h3>

                  <p className="mt-2.5 inline-flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <CheckCircle size={16} className="text-emerald-500" />
                    {cert.issuer}
                  </p>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {cert.summary}
                  </p>

                  <span
                    className={clsx(
                      'mt-5 inline-flex min-h-10 items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold shadow-[0_14px_35px_-22px_rgba(15,23,42,0.6)] transition-colors',
                      accent.button
                    )}
                  >
                    <FileBadge2 size={15} />
                    {actionLabel}
                    <ExternalLink size={14} />
                  </span>
                </div>

                {/* Credential panel (tablet/desktop) */}
                <div
                  className={clsx(
                    'relative ml-5 hidden w-[34%] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[20px] border bg-white/75 p-4 text-center shadow-[0_20px_50px_-35px_rgba(15,23,42,0.5)] backdrop-blur-sm dark:bg-white/[0.04] md:flex lg:ml-6',
                    accent.panel
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-6 -right-2 select-none font-mono text-[4.5rem] font-black leading-none text-gray-900/[0.05] dark:text-white/[0.05] lg:text-[5rem]"
                  >
                    {pad(index + 1)}
                  </span>
                  <span
                    className={clsx(
                      'relative inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed transition-transform duration-500 group-hover:rotate-12 lg:h-[4.5rem] lg:w-[4.5rem]',
                      accent.seal
                    )}
                  >
                    <span
                      className={clsx(
                        'inline-flex h-11 w-11 items-center justify-center rounded-full lg:h-12 lg:w-12',
                        accent.icon
                      )}
                    >
                      <Award size={20} />
                    </span>
                  </span>
                  <p className="relative mt-3 text-sm font-bold text-gray-900 dark:text-white">
                    {cert.issuer}
                  </p>
                  <p className="relative mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                    <Calendar size={12} />
                    {cert.completedOn}
                  </p>
                  <span className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                    <BadgeCheck size={12} />
                    Verified credential
                  </span>
                </div>
              </button>
            </article>
          )
        })}
      </motion.div>
    </div>
  )

  const progress = pinned ? (
    <div className={clsx(GUTTER, 'mt-6 flex w-full items-center gap-4 font-mono sm:mt-8')}>
      <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
        {pad(activeIndex + 1)}
        <span className="text-gray-400 dark:text-gray-500"> / {pad(certifications.length)}</span>
      </span>
      <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-400"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
      {/* Clickable steps: jump straight to a certificate. */}
      <div role="group" aria-label="Jump to certificate" className="hidden items-center gap-1.5 sm:flex">
        {certifications.map((cert, index) => (
          <button
            key={cert.title}
            type="button"
            onClick={() => focusCard(index)}
            aria-label={`Show ${cert.title}`}
            aria-current={index === activeIndex ? 'step' : undefined}
            className={clsx(
              'h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70',
              index === activeIndex
                ? 'w-6 bg-gray-900 dark:bg-white'
                : 'w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-500'
            )}
          />
        ))}
      </div>
    </div>
  ) : null

  return (
    <>
      <motion.div {...sectionRevealProps} className={pinned ? '' : 'py-16 sm:py-20'}>
        {/*
          One DOM tree for both modes, so toggling the pin never remounts the
          track (the ResizeObserver keeps measuring the same element).
          Pinned: the runway is one viewport tall plus the travel distance.
        */}
        <div
          ref={runwayRef}
          className="relative"
          style={pinned ? { height: `calc(100dvh + ${distance}px)` } : undefined}
        >
          <div
            className={clsx(
              pinned &&
                'sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pb-6 pt-16 sm:pt-20'
            )}
          >
            {header}
            {track}
            {progress}
          </div>
        </div>
      </motion.div>

      <CertificationModal
        open={activeCertification !== null}
        certification={activeCertification}
        onClose={() => setActiveCertification(null)}
      />
    </>
  )
}

export default Certifications
