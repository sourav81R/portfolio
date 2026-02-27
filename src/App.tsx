import { Suspense, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import CommandPalette from './components/common/CommandPalette'
import './styles/noise.css'

const RecruiterHighlights = lazy(() => import('./components/sections/RecruiterHighlights'))
const About = lazy(() => import('./components/sections/About'))
const Experience = lazy(() => import('./components/sections/Experience'))
const Skills = lazy(() => import('./components/sections/Skills'))
const Projects = lazy(() => import('./components/sections/Projects'))
const Education = lazy(() => import('./components/sections/Education'))
const Certifications = lazy(() => import('./components/sections/Certifications'))
const Contact = lazy(() => import('./components/sections/Contact'))

const SectionFallback = ({ id }: { id: string }) => (
  <section id={id} className="px-4 sm:px-6 py-20 sm:py-24 lg:py-28">
    <div className="max-w-6xl mx-auto h-24 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-gray-100/60 dark:bg-gray-900/40 animate-pulse" />
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
    <div
      className="
        min-h-screen
        bg-white text-gray-900
        dark:bg-black dark:text-gray-300
        transition-colors duration-300
      "
    >
      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette />

      {/* Layout */}
      <Navbar />

      {/* Sections */}
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
