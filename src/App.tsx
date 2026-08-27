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
import SectionErrorBoundary from './components/system/SectionErrorBoundary'
import { useAppStore } from './store/useAppStore'
import { useSmoothScroll } from './providers/SmoothScrollProvider'

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

const SectionFallback = () => {
  const reduceMotion = useReducedMotion()

  return (
    <div className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
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
        rootMargin: '420px 0px',
        threshold: 0.01,
      }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [shouldRender])

  return (
    <section id={id} ref={sectionRef} className="relative">
      {shouldRender ? (
        <SectionErrorBoundary title={title}>
          <Suspense fallback={<SectionFallback />}>{children}</Suspense>
        </SectionErrorBoundary>
      ) : (
        <SectionFallback />
      )}
      <SectionDivider />
    </section>
  )
}

export default App
