import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { LayoutDashboard, Menu, Moon, Sun, Users, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sectionTextColors } from '../../constants/sectionColor'
import { useAppStore } from '../../store/useAppStore'

const sections = [
  'home',
  'highlights',
  'about',
  'experience',
  'testimonials',
  'skills',
  'projects',
  'signals',
  'ai-workbench',
  'education',
  'certifications',
  'contact',
]

const sectionLabels: Record<string, string> = {
  home: 'Home',
  highlights: 'Highlights',
  about: 'About',
  experience: 'Experience',
  testimonials: 'Testimonials',
  skills: 'Skills',
  projects: 'Projects',
  signals: 'Signals',
  'ai-workbench': 'AI Lab',
  education: 'Education',
  certifications: 'Certifications',
  contact: 'Contact',
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    return saved ?? 'dark'
  })
  const recruiterMode = useAppStore((state) => state.recruiterMode)
  const toggleRecruiterMode = useAppStore((state) => state.toggleRecruiterMode)
  const recordClick = useAppStore((state) => state.recordClick)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  useEffect(() => {
    let raf = 0
    let sectionElements = [] as HTMLElement[]

    const readSections = () =>
      sections
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[]

    const updateOnScroll = () => {
      if (
        sectionElements.length === 0 ||
        sectionElements.some((section) => !section.isConnected)
      ) {
        sectionElements = readSections()
      }

      const scrollY = window.scrollY + 140
      const matchedSection = sectionElements.find(
        (section) =>
          scrollY >= section.offsetTop &&
          scrollY < section.offsetTop + section.offsetHeight
      )

      if (matchedSection?.id) {
        setActive((prev) => (prev === matchedSection.id ? prev : matchedSection.id))
      }

      raf = 0
    }

    const onScroll = () => {
      if (raf !== 0) return
      raf = window.requestAnimationFrame(updateOnScroll)
    }

    sectionElements = readSections()
    updateOnScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf !== 0) {
        window.cancelAnimationFrame(raf)
      }
    }
  }, [])

  return (
    <nav
      className="fixed inset-x-0 z-50 px-4 sm:px-6"
      style={{ top: 'calc(var(--banner-offset, 0px) + 0.75rem)' }}
    >
      <div
        className={`relative overflow-hidden border border-emerald-200/80 bg-gradient-to-r from-white/95 via-emerald-50/95 to-cyan-50/95 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.6)] backdrop-blur-md dark:border-emerald-500/25 dark:bg-gradient-to-r dark:from-gray-900/95 dark:via-gray-950/95 dark:to-slate-900/95 ${
          isOpen ? 'rounded-2xl' : 'rounded-2xl sm:rounded-full'
        }`}
      >
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
          <motion.div
            className={`h-full origin-left ${sectionTextColors[active]}`}
            style={{ scaleX, transformOrigin: '0% 50%' }}
          />
        </div>

        <div className="flex items-center justify-between px-3 py-2.5 font-mono sm:px-5 sm:py-3">
          <a
            href="#home"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm dark:bg-white dark:text-black sm:text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            sourav.is-a.dev
          </a>

          <ul className="hidden items-center gap-5 text-sm lg:flex">
            {sections.map((item) => (
              <li key={item}>
                <a
                  href={`#${item}`}
                    className={`relative text-[13px] transition ${
                      active === item
                      ? sectionTextColors[item]
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
                  }`}
                >
                  {sectionLabels[item]}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 ${
                      active === item ? 'scale-x-100' : ''
                    }`}
                    style={{
                      backgroundColor:
                        active === item ? 'currentColor' : 'transparent',
                    }}
                  />
                </a>
              </li>
            ))}

            <button
              aria-label="Toggle recruiter mode"
              onClick={() => {
                toggleRecruiterMode()
                recordClick('recruiter-mode')
              }}
              className={`ml-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                recruiterMode
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-indigo-500 dark:text-gray-400'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Users size={14} />
                Recruiter
              </span>
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-sky-500 hover:text-sky-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-sky-400"
              onClick={() => recordClick('dashboard-route')}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>

            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full p-2 text-gray-600 transition hover:text-green-500 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </ul>

          <div className="flex items-center gap-1.5 lg:hidden sm:gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full p-2 text-gray-600 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              aria-label="Toggle recruiter mode"
              onClick={() => {
                toggleRecruiterMode()
                recordClick('recruiter-mode')
              }}
              className={`rounded-full p-2 ${recruiterMode ? 'text-indigo-500' : 'text-gray-700 dark:text-gray-300'}`}
            >
              <Users size={18} />
            </button>

            <button
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full p-2 text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="max-h-[min(70vh,28rem)] overflow-y-auto border-t border-emerald-200/80 bg-emerald-50/95 dark:border-emerald-500/30 dark:bg-gray-900/95 lg:hidden">
            <ul className="flex flex-col items-stretch gap-1 px-3 py-3 font-mono">
              {sections.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm transition sm:text-base ${
                      active === item
                        ? sectionTextColors[item]
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    {sectionLabels[item]}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => {
                    setIsOpen(false)
                    recordClick('dashboard-route')
                  }}
                  className="block rounded-lg px-3 py-2 text-sm transition sm:text-base text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
