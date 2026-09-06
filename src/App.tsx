import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import OpenToWorkBanner from './components/layout/OpenToWorkBanner'
import Hero from './components/sections/Hero'
import CommandPalette from './components/common/CommandPalette'
import PwaInstallPrompt from './components/common/PwaInstallPrompt'
import AmbientBackground from './components/common/AmbientBackground'
import CursorSpiderEffect from './components/common/CursorSpiderEffect'
import FloatingActions from './components/common/FloatingActions'
import SectionErrorBoundary from './components/system/SectionErrorBoundary'
import { useAppStore } from './store/useAppStore'
import { useSmoothScroll } from './providers/SmoothScrollProvider'
import { usePageMetadata } from './hooks/usePageMetadata'

const About = lazy(() => import('./components/sections/About'))
const Experience = lazy(() => import('./components/sections/Experience'))
const Skills = lazy(() => import('./components/sections/Skills'))
const Projects = lazy(() => import('./components/sections/Projects'))
const GitHubActivity = lazy(() => import('./components/sections/GitHubActivity'))
const Education = lazy(() => import('./components/sections/Education'))
const Certifications = lazy(() => import('./components/sections/Certifications'))
const Contact = lazy(() => import('./components/sections/Contact'))

const sectionOrder = [
  'about',
  'experience',
  'skills',
  'projects',
  'github',
  'education',
  'certifications',
  'contact',
] as const

/**
 * Approximate rendered height of each lazy section, in px.
 *
 * The placeholder has to stand in for the real thing closely enough that
 * mounting does not move the content below it. A flat 96px card meant a
 * section could grow by more than 1600px the moment it mounted, shoving
 * everything after it down the page; on a phone that reads as the page
 * scrolling itself back towards the top.
 *
 * These are measured at a 412px-wide viewport, which is the worst case - the
 * same content is shorter on a desktop layout, and a placeholder that is
 * slightly too tall collapses harmlessly below the fold instead of displacing
 * what you are reading.
 */
const SECTION_MIN_HEIGHTS: Record<string, number> = {
  about: 1600,
  experience: 1900,
  skills: 3300,
  projects: 3600,
  github: 1150,
  education: 1350,
  certifications: 1950,
  contact: 1500,
}

const SectionFallback = ({ minHeight }: { minHeight?: number }) => {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
      style={minHeight ? { minHeight } : undefined}
    >
      <motion.div
        className="mx-auto h-24 max-w-6xl rounded-2xl border border-gray-200/70 bg-gray-100/60 dark:border-gray-800/70 dark:bg-gray-900/40"
        animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
        }
      />
    </div>
  )
}

const SectionDivider = () => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0">
    <div className="h-[2px] w-screen bg-emerald-300/75 shadow-[0_0_20px_rgba(52,211,153,0.34)] dark:bg-emerald-200/70" />
    <div className="h-[4px] w-screen bg-gradient-to-r from-emerald-400/28 via-emerald-300/78 to-emerald-400/28 shadow-[0_0_28px_rgba(52,211,153,0.3)] dark:from-emerald-300/22 dark:via-emerald-200/68 dark:to-emerald-300/22" />
  </div>
)

function App() {
  const location = useLocation()
  const recordPageView = useAppStore((state) => state.recordPageView)
  const activeHash = location.hash.replace('#', '')
  const { scrollTo } = useSmoothScroll()

  // Restores the homepage title and canonical URL when returning from a
  // case study, which sets its own.
  usePageMetadata({
    title: 'Sourav Chowdhury | Full Stack Developer (MERN, Next.js)',
    description:
      'Sourav Chowdhury is a Full Stack Developer at Oneisok Digital Solution in Kolkata, India, building production systems with Next.js, React, TypeScript, Node.js and PostgreSQL - including Voteniti, an election management platform used across India.',
    path: '/',
  })

  useEffect(() => {
    recordPageView(location.pathname || '/')
  }, [location.pathname, recordPageView])

  useEffect(() => {
    if (!location.hash) return

    const targetId = location.hash.replace('#', '')
    if (!targetId) return

    let timeoutId = 0
    let attempts = 0
    const maxAttempts = 18

    const alignToHash = () => {
      const target = document.getElementById(targetId)
      attempts += 1

      if (target) {
        // `immediate` on every attempt: this realigns repeatedly while lazy
        // sections mount and shift layout, so an animated scroll would be
        // restarted 18 times and visibly stutter.
        scrollTo(target, { immediate: true })
      }

      if (attempts < maxAttempts) {
        timeoutId = window.setTimeout(alignToHash, 80)
      }
    }

    timeoutId = window.setTimeout(alignToHash, 0)

    return () => window.clearTimeout(timeoutId)
  }, [location.hash, scrollTo])

  return (
    <div className="relative min-h-screen bg-transparent text-gray-900 dark:text-gray-300">
      <CommandPalette />
      <PwaInstallPrompt />
      <AmbientBackground />
      <CursorSpiderEffect />
      <FloatingActions />
      <div className="relative z-10">
        <OpenToWorkBanner />
        <Navbar />

        <Hero />
        <LazySection id="about" title="About" activeHash={activeHash} sectionIndex={0}><About /></LazySection>
        <LazySection id="experience" title="Experience" activeHash={activeHash} sectionIndex={1}><Experience /></LazySection>
        <LazySection id="skills" title="Skills" activeHash={activeHash} sectionIndex={2}><Skills /></LazySection>
        <LazySection id="projects" title="Projects" activeHash={activeHash} sectionIndex={3}><Projects /></LazySection>
        <LazySection id="github" title="GitHub Activity" activeHash={activeHash} sectionIndex={4}><GitHubActivity /></LazySection>
        <LazySection id="education" title="Education" activeHash={activeHash} sectionIndex={5}><Education /></LazySection>
        <LazySection id="certifications" title="Certifications" activeHash={activeHash} sectionIndex={6}><Certifications /></LazySection>
        <LazySection id="contact" title="Contact" activeHash={activeHash} sectionIndex={7}><Contact /></LazySection>
        <Footer />
      </div>
    </div>
  )
}

function LazySection({
  children,
  id,
  title,
  activeHash,
  sectionIndex,
}: {
  children: ReactNode
  id: string
  title: string
  activeHash: string
  sectionIndex: number
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const activeHashIndex = sectionOrder.indexOf(activeHash as (typeof sectionOrder)[number])
  const shouldPreloadForHash = activeHashIndex >= 0 && sectionIndex <= activeHashIndex
  const [shouldRender, setShouldRender] = useState(activeHash === id || shouldPreloadForHash)

  useEffect(() => {
    if (activeHash === id || shouldPreloadForHash) {
      setShouldRender(true)
    }
  }, [activeHash, id, shouldPreloadForHash])

  useEffect(() => {
    if (shouldRender) return
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldRender(true)
        observer.disconnect()
      },
      {
        // Mount well before the section is reached. Combined with the
        // reserved placeholder height, the swap happens off-screen and never
        // displaces what is currently being read.
        rootMargin: '1200px 0px',
        threshold: 0,
      }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [shouldRender])

  const reservedHeight = SECTION_MIN_HEIGHTS[id]

  return (
    <section id={id} ref={sectionRef} className="relative">
      {shouldRender ? (
        <SectionErrorBoundary title={title}>
          <Suspense fallback={<SectionFallback minHeight={reservedHeight} />}>
            {children}
          </Suspense>
        </SectionErrorBoundary>
      ) : (
        <SectionFallback minHeight={reservedHeight} />
      )}
      <SectionDivider />
    </section>
  )
}

export default App
