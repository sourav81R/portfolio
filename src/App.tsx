import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import OpenToWorkBanner from './components/layout/OpenToWorkBanner'
import Hero from './components/sections/Hero'
import CommandPalette from './components/common/CommandPalette'
import PwaInstallPrompt from './components/common/PwaInstallPrompt'
import ThemeCustomizer from './components/common/ThemeCustomizer'
import SectionErrorBoundary from './components/system/SectionErrorBoundary'
import { useAppStore } from './store/useAppStore'

const RecruiterHighlights = lazy(() => import('./components/sections/RecruiterHighlights'))
const About = lazy(() => import('./components/sections/About'))
const Experience = lazy(() => import('./components/sections/Experience'))
const Testimonials = lazy(() => import('./components/sections/Testimonials'))
const Skills = lazy(() => import('./components/sections/Skills'))
const Projects = lazy(() => import('./components/sections/Projects'))
const DeveloperSignals = lazy(() => import('./components/sections/DeveloperSignals'))
const AIWorkbench = lazy(() => import('./components/sections/AIWorkbench'))
const Education = lazy(() => import('./components/sections/Education'))
const Certifications = lazy(() => import('./components/sections/Certifications'))
const Contact = lazy(() => import('./components/sections/Contact'))

const SectionFallback = () => (
  <div className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
    <div className="mx-auto h-24 max-w-6xl animate-pulse rounded-2xl border border-gray-200/70 bg-gray-100/60 dark:border-gray-800/70 dark:bg-gray-900/40" />
  </div>
)

function App() {
  const location = useLocation()
  const recordPageView = useAppStore((state) => state.recordPageView)
  const activeHash = location.hash.replace('#', '')

  useEffect(() => {
    recordPageView(location.pathname || '/')
  }, [location.pathname, recordPageView])

  useEffect(() => {
    if (!location.hash) return

    const targetId = location.hash.replace('#', '')
    if (!targetId) return

    let frameId = 0
    let attempts = 0
    const maxAttempts = 12

    const alignToHash = () => {
      const target = document.getElementById(targetId)
      attempts += 1

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      if (attempts < maxAttempts) {
        frameId = window.requestAnimationFrame(alignToHash)
      }
    }

    frameId = window.requestAnimationFrame(alignToHash)

    return () => window.cancelAnimationFrame(frameId)
  }, [location.hash])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_26%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_24%),#ffffff] text-gray-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_top_left,rgba(56,189,248,0.09),transparent_24%),#020617] dark:text-gray-300">
      <CommandPalette />
      <PwaInstallPrompt />
      <ThemeCustomizer />
      <OpenToWorkBanner />
      <Navbar />

      <Hero />
      <LazySection id="highlights" title="Recruiter Highlights" activeHash={activeHash}><RecruiterHighlights /></LazySection>
      <LazySection id="about" title="About" activeHash={activeHash}><About /></LazySection>
      <LazySection id="experience" title="Experience" activeHash={activeHash}><Experience /></LazySection>
      <LazySection id="testimonials" title="Testimonials" activeHash={activeHash}><Testimonials /></LazySection>
      <LazySection id="skills" title="Skills" activeHash={activeHash}><Skills /></LazySection>
      <LazySection id="projects" title="Projects" activeHash={activeHash}><Projects /></LazySection>
      <LazySection id="signals" title="Developer Signals" activeHash={activeHash}><DeveloperSignals /></LazySection>
      <LazySection id="ai-workbench" title="AI Workbench" activeHash={activeHash}><AIWorkbench /></LazySection>
      <LazySection id="education" title="Education" activeHash={activeHash}><Education /></LazySection>
      <LazySection id="certifications" title="Certifications" activeHash={activeHash}><Certifications /></LazySection>
      <LazySection id="contact" title="Contact" activeHash={activeHash}><Contact /></LazySection>
      <Footer />
    </div>
  )
}

function LazySection({
  children,
  id,
  title,
  activeHash,
}: {
  children: ReactNode
  id: string
  title: string
  activeHash: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldRender, setShouldRender] = useState(activeHash === id)

  useEffect(() => {
    if (activeHash === id) {
      setShouldRender(true)
    }
  }, [activeHash, id])

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
    <section id={id} ref={sectionRef}>
      {shouldRender ? (
        <SectionErrorBoundary title={title}>
          <Suspense fallback={<SectionFallback />}>{children}</Suspense>
        </SectionErrorBoundary>
      ) : (
        <SectionFallback />
      )}
    </section>
  )
}

export default App
