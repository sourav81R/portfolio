import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { LayoutDashboard, Menu, Moon, Sun, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sectionGradientBackgrounds, sectionTextColors } from '../../constants/sectionColor'
import { useAppStore } from '../../store/useAppStore'

const sections = [
  'home',
  'about',
  'experience',
  'skills',
  'projects',
  'github',
  'education',
  'certifications',
  'contact',
]

const sectionLabels: Record<string, string> = {
  home: 'Home',
  about: 'About',
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  github: 'GitHub',
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
  const recordClick = useAppStore((state) => state.recordClick)
  const navRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  // Tracks progress through the whole document. framer-motion re-measures on
  // resize + ResizeObserver, so lazy sections and the mobile URL-bar collapse
  // are both accounted for.
  const { scrollYProgress } = useScroll()
  // Lenis already smooths the scroll position, so this spring is kept stiff:
  // heavier damping here would stack a second easing layer and make the bar
  // visibly lag behind the page.
  const smoothedScaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  })
  const scaleX = reduceMotion ? scrollYProgress : smoothedScaleX

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

      // Probe line sits just below the navbar. Measured from the real element
      // instead of a hardcoded 140px, which was desktop-only and mismatched
      // the shorter mobile bar.
      const navHeight = navRef.current?.getBoundingClientRect().bottom ?? 0
      const probe = navHeight + 24

      // getBoundingClientRect is viewport-relative, so it stays correct inside
      // the transformed/positioned wrappers (PageTransition, AnimatedBorder)
      // where offsetTop would have reported the wrong origin.
      let matchedSection: HTMLElement | undefined
      for (const section of sectionElements) {
        const { top, bottom } = section.getBoundingClientRect()
        if (top <= probe && bottom > probe) {
          matchedSection = section
          break
        }
      }

      // Past the probe line at the very bottom of the page (short last
      // section), fall back to the last section that has started.
      if (!matchedSection) {
        const atPageBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2

        if (atPageBottom) {
          matchedSection = sectionElements
            .filter((section) => section.getBoundingClientRect().top <= probe)
            .pop()
        }
      }

      if (matchedSection?.id) {
        setActive((prev) => (prev === matchedSection!.id ? prev : matchedSection!.id))
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
    // Rotation and the mobile URL-bar collapse change geometry without
    // firing scroll, which would otherwise leave the active item stale.
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('orientationchange', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('orientationchange', onScroll)
      if (raf !== 0) {
        window.cancelAnimationFrame(raf)
      }
    }
  }, [])

  return (
    <>
      {/*
       * Reading progress. Pinned to the very top of the viewport, full width,
       * and above the banner (z-[60]) so it stays visible while the banner is
       * on screen. Sits outside <nav> so the rounded pill can keep its
       * overflow-hidden without clipping the bar.
       */}
      <div
        className="fixed inset-x-0 z-[70] h-[3px] bg-transparent"
        style={{ top: 'var(--banner-offset, 0px)' }}
        aria-hidden="true"
      >
        <motion.div
          className="h-full w-full will-change-transform"
          style={{
            scaleX,
            transformOrigin: '0% 50%',
            backgroundImage:
              sectionGradientBackgrounds[active] ?? sectionGradientBackgrounds.home,
          }}
        />
      </div>

      <nav
        ref={navRef}
        className="fixed inset-x-0 z-50 px-4 sm:px-6"
        style={{ top: 'calc(var(--banner-offset, 0px) + 0.75rem)' }}
      >
      <div
        className={`relative overflow-hidden border border-emerald-200/80 bg-gradient-to-r from-white/95 via-emerald-50/95 to-cyan-50/95 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.6)] backdrop-blur-md dark:border-emerald-500/25 dark:bg-gradient-to-r dark:from-gray-900/95 dark:via-gray-950/95 dark:to-slate-900/95 ${
          isOpen ? 'rounded-2xl' : 'rounded-2xl sm:rounded-full'
        }`}
      >
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
                    className={`relative text-[15px] transition ${
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
                    className={`block rounded-lg px-3 py-2 text-base transition sm:text-lg ${
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
    </>
  )
}

export default Navbar
