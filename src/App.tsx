import { Suspense, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import OpenToWorkBanner from './components/layout/OpenToWorkBanner'
import Hero from './components/sections/Hero'
import CommandPalette from './components/common/CommandPalette'
import './styles/noise.css'

const RecruiterHighlights = lazy(() => import('./components/sections/RecruiterHighlights'))
const About = lazy(() => import('./components/sections/About'))
const Experience = lazy(() => import('./components/sections/Experience'))
const Testimonials = lazy(() => import('./components/sections/Testimonials'))
const Skills = lazy(() => import('./components/sections/Skills'))
const Projects = lazy(() => import('./components/sections/Projects'))
const Education = lazy(() => import('./components/sections/Education'))
const Certifications = lazy(() => import('./components/sections/Certifications'))
const Contact = lazy(() => import('./components/sections/Contact'))

const SectionFallback = ({ id }: { id: string }) => (
  <section id={id} className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
    <div className="mx-auto h-24 max-w-6xl animate-pulse rounded-2xl border border-gray-200/70 bg-gray-100/60 dark:border-gray-800/70 dark:bg-gray-900/40" />
  </section>
)

function App() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const targetId = location.hash.replace('#', '')
    if (!targetId) return

    let attempts = 0
    const maxAttempts = 25

    const timer = window.setInterval(() => {
      const target = document.getElementById(targetId)
      attempts += 1

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.clearInterval(timer)
        return
      }

      if (attempts >= maxAttempts) {
        window.clearInterval(timer)
      }
    }, 80)

    return () => window.clearInterval(timer)
  }, [location.hash])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_26%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_24%),#ffffff] text-gray-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_top_left,rgba(56,189,248,0.09),transparent_24%),#020617] dark:text-gray-300">
      <CommandPalette />
      <OpenToWorkBanner />
      <Navbar />

      <Hero />
      <Suspense fallback={<SectionFallback id="highlights" />}>
        <RecruiterHighlights />
      </Suspense>
      <Suspense fallback={<SectionFallback id="about" />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionFallback id="experience" />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionFallback id="testimonials" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionFallback id="skills" />}>
        <Skills />
      </Suspense>
      <Suspense fallback={<SectionFallback id="projects" />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionFallback id="education" />}>
        <Education />
      </Suspense>
      <Suspense fallback={<SectionFallback id="certifications" />}>
        <Certifications />
      </Suspense>
      <Suspense fallback={<SectionFallback id="contact" />}>
        <Contact />
      </Suspense>
      <Footer />
    </div>
  )
}

export default App
