import { useEffect, useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { sectionColors } from '../../constants/sectionColor'

const sections = [
  'home',
  'about',
  'experience',
  'skills',
  'projects',
  'education',
  'certifications',
  'contact',
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  /* ---------- LOAD SAVED THEME ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)
  }, [])

  /* ---------- APPLY THEME ---------- */
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

  /* ---------- SCROLL SPY ---------- */
  useEffect(() => {
    let raf = 0
    let sectionElements = [] as HTMLElement[]
    const bar = document.getElementById('scroll-progress')

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

      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      if (bar) bar.style.width = `${progress}%`
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
    <nav className="fixed inset-x-0 top-2.5 z-50 px-4 sm:top-4 sm:px-6">
      <div
        className={`relative overflow-hidden border border-emerald-200/80 bg-gradient-to-r from-emerald-50/95 via-white/95 to-cyan-50/95 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.8)] backdrop-blur-sm dark:border-emerald-500/30 dark:bg-gradient-to-r dark:from-gray-900/95 dark:via-gray-950/95 dark:to-gray-900/95 ${
          isOpen ? 'rounded-2xl' : 'rounded-2xl sm:rounded-full'
        }`}
      >
        {/* Scroll Progress Bar */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
          <div
            id="scroll-progress"
            className={`h-full transition-[width] duration-150 ${sectionColors[active]}`}
            style={{ width: '0%' }}
          />
        </div>

        <div className="px-3 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between font-mono">
          {/* Logo */}
          <a href="#home" className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
            sourav.dev
          </a>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex gap-6 text-sm items-center">
            {sections.map((item) => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  className={`relative transition ${
                    active === item
                      ? sectionColors[item]
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
                  }`}
                >
                  {item}

                  {/* Animated underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 transition-transform duration-300
                      ${active === item ? 'scale-x-100' : ''}
                    `}
                    style={{
                      backgroundColor:
                        active === item ? 'currentColor' : 'transparent',
                    }}
                  />
                </a>
              </li>
            ))}

            {/* Theme Toggle */}
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 rounded-full p-2 text-gray-600 transition hover:text-green-500 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </ul>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-emerald-200/80 bg-emerald-50/95 dark:border-emerald-500/30 dark:bg-gray-900/95 max-h-[min(70vh,28rem)] overflow-y-auto">
            <ul className="flex flex-col items-stretch gap-1 px-3 py-3 font-mono">
              {sections.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm sm:text-base transition ${
                      active === item
                        ? sectionColors[item]
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
