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
    const onScroll = () => {
      const scrollY = window.scrollY + 140

      sections.forEach((id) => {
        const section = document.getElementById(id)
        if (
          section &&
          scrollY >= section.offsetTop &&
          scrollY < section.offsetTop + section.offsetHeight
        ) {
          setActive(id)
        }
      })
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ---------- SCROLL PROGRESS ---------- */
  useEffect(() => {
    const onScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight

      const progress = (scrollTop / docHeight) * 100
      const bar = document.getElementById('scroll-progress')
      if (bar) bar.style.width = `${progress}%`
    }

    window.addEventListener('scroll', onScrollProgress)
    return () => window.removeEventListener('scroll', onScrollProgress)
  }, [])

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 ...">
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
        <div
          id="scroll-progress"
          className={`h-full transition-[width] duration-150 ${sectionColors[active]}`}
          style={{ width: '0%' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between font-mono">
        {/* Logo */}
        <a href="#home" className="font-bold text-gray-900 dark:text-white">
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
            className="ml-4 text-gray-600 dark:text-gray-400 hover:text-green-500 transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </ul>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-600 dark:text-gray-400"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 max-h-[calc(100vh-73px)] overflow-y-auto">
          <ul className="flex flex-col items-center gap-5 py-6 font-mono">
            {sections.map((item) => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg transition ${
                    active === item
                      ? sectionColors[item]
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
