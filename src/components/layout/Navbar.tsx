import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from 'framer-motion'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useCommandPalette } from '../../store/useCommandpalette'
import { useSmoothScroll } from '../../providers/SmoothScrollProvider'
import { resolvePublicAsset } from '../../lib/publicAsset'
import { MOTION_TOKENS } from '../../lib/motion'
import { sectionGradientBackgrounds, sectionTextColors } from '../../constants/sectionColor'

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

/**
 * Tailwind's `lg` breakpoint, where the desktop link row replaces the
 * hamburger. Kept in sync with the `lg:` classes below so the resize handler
 * closes the mobile menu at exactly the width it stops being reachable.
 */
const DESKTOP_BREAKPOINT = 1024

/**
 * Menu motion. Deliberately short: this is navigation, not decoration, and a
 * long ease makes every tap feel laggy. Closing runs faster than opening
 * because the user has already committed and is waiting on the scroll.
 *
 * The container animates `height: auto` so the nav pill grows with the list
 * rather than the menu overlapping the page, which keeps the rounded card
 * intact at every breakpoint.
 */
const menuVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: { duration: 0.28, ease: MOTION_TOKENS.easing },
      opacity: { duration: 0.18, ease: 'linear' },
      staggerChildren: 0.04,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.22, ease: MOTION_TOKENS.easing },
      opacity: { duration: 0.14, ease: 'linear' },
      staggerChildren: 0,
    },
  },
}

const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: MOTION_TOKENS.easing } },
  // Items fade with the container on exit instead of staggering out; a
  // reverse stagger on close delays the scroll the user is waiting for.
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    return saved ?? 'dark'
  })
  const setPaletteOpen = useCommandPalette((state) => state.setOpen)
  // Apple keyboards use Cmd; everything else uses Ctrl. Read once on mount so
  // the hint matches the shortcut the palette actually listens for.
  const [isAppleDevice, setIsAppleDevice] = useState(false)

  useEffect(() => {
    setIsAppleDevice(/Mac|iPhone|iPad|iPod/.test(navigator.platform))
  }, [])

  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollTo } = useSmoothScroll()

  /**
   * Closes the menu, then scrolls once the exit animation has run.
   *
   * The delay matters. Scrolling while the menu is still collapsing means
   * Lenis measures a target position that the collapsing menu is about to
   * change, so it lands short and the page visibly settles afterwards.
   * Waiting for the exit keeps the measurement and the scroll consistent.
   * This mirrors the deferred `runCommand` in CommandPalette.
   *
   * Scroll is driven through the shared provider rather than the anchor's
   * native jump, so the nav offset and the reduced-motion fallback both come
   * from one place. `preventDefault` stops the browser jumping first.
   */
  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, item: string) => {
      event.preventDefault()
      setIsOpen(false)

      const target = `#${item}`
      const immediate = reduceMotion ?? false
      // Reduced motion has no exit animation to wait for.
      const delay = reduceMotion || !isOpen ? 0 : 220

      window.setTimeout(() => {
        scrollTo(target, { immediate })
        // Keep the URL hash in step with the section, matching the plain
        // anchors this replaces, without letting the browser scroll.
        if (window.location.hash !== target) {
          window.history.replaceState(null, '', target)
        }
      }, delay)
    },
    [isOpen, reduceMotion, scrollTo]
  )

  // Escape closes the menu and returns focus to the control that opened it,
  // so keyboard users are not dropped at the top of the document.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      menuButtonRef.current?.focus()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  // A tap outside the nav pill closes the menu. Bound on `pointerdown` so it
  // beats the click that may land on page content underneath.
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current) return
      if (navRef.current.contains(event.target as Node)) return
      setIsOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isOpen])

  // Rotating to landscape or resizing past `lg` hides the hamburger while the
  // menu is still open, which would otherwise strand it with no way to close.
  useEffect(() => {
    if (!isOpen) return

    const media = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
    const onChange = () => {
      if (media.matches) setIsOpen(false)
    }

    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [isOpen])
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
      const bar = navRef.current?.firstElementChild
      const navBottom =
        bar?.getBoundingClientRect().bottom ??
        navRef.current?.getBoundingClientRect().bottom ??
        0
      const probe = navBottom + 24

      // getBoundingClientRect is viewport-relative, so it stays correct inside
      // the transformed/positioned wrappers (PageTransition, AnimatedBorder)
      // where offsetTop would have reported the wrong origin.
      // Score by how much of the viewport each section actually occupies,
      // rather than probing a single line. A line has to be positioned
      // perfectly for both cases at once: an anchor click leaves a section
      // starting ~200px down (nav offset plus its own padding), while free
      // scrolling puts the reader mid-section. Any fixed line satisfied one
      // and broke the other. Visible area is true in both.
      const viewportTop = probe
      const viewportBottom = window.innerHeight

      let matchedSection: HTMLElement | undefined
      let bestVisible = 0
      // Tracked during the single measuring pass below so the bottom-of-page
      // fallback does not need a second one.
      let lastStartedSection: HTMLElement | undefined

      for (const section of sectionElements) {
        const { top, bottom } = section.getBoundingClientRect()
        const visible =
          Math.min(bottom, viewportBottom) - Math.max(top, viewportTop)

        if (top <= probe) {
          lastStartedSection = section
        }

        if (visible > bestVisible) {
          bestVisible = visible
          matchedSection = section
        }
      }

      /*
       * Past the probe line at the very bottom of the page (short last
       * section), fall back to the last section that has started.
       *
       * `scrollHeight` is only read in this branch, which is reached at most
       * once per scroll session rather than every frame. Reading it after the
       * rect loop also means the layout is already flushed, so it does not
       * force a second reflow.
       */
      if (!matchedSection && lastStartedSection) {
        const atPageBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2

        if (atPageBottom) {
          matchedSection = lastStartedSection
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
        className={`relative mx-auto w-full max-w-5xl overflow-hidden border border-emerald-200/80 bg-gradient-to-r from-white/95 via-emerald-50/95 to-cyan-50/95 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.6)] backdrop-blur-md dark:border-emerald-500/25 dark:bg-gradient-to-r dark:from-gray-900/95 dark:via-gray-950/95 dark:to-slate-900/95 ${
          isOpen ? 'rounded-2xl' : 'rounded-2xl sm:rounded-full'
        }`}
      >
        <div className="relative flex items-center justify-between px-3 py-2 font-mono sm:px-4 sm:py-2.5">
          <a
            href="#home"
            aria-label="Back to top"
            onClick={(event) => handleNavClick(event, 'home')}
            className="relative z-10 inline-flex shrink-0 items-center rounded-full transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <img
              src={resolvePublicAsset('/icon-192.png')}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
          </a>

          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-3 text-sm lg:flex xl:gap-4">
            {sections.map((item) => (
              <li key={item}>
                <a
                  href={`#${item}`}
                  onClick={(event) => handleNavClick(event, item)}
                  aria-current={active === item ? 'true' : undefined}
                    className={`relative whitespace-nowrap text-[13.5px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
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
          </ul>

          <div className="relative z-10 hidden shrink-0 items-center gap-2 lg:flex">
            <button
              type="button"
              aria-label="Open command palette"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/70 py-1.5 pl-3 pr-1.5 text-xs text-gray-600 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400 dark:hover:text-emerald-400 sm:text-sm"
            >
              <Search size={14} className="shrink-0" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="rounded-md border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {isAppleDevice ? '⌘' : 'Ctrl'} K
              </kbd>
            </button>

            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full p-2 text-gray-600 transition hover:text-green-500 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1.5 lg:hidden sm:gap-2">
            <button
              type="button"
              aria-label="Open command palette"
              onClick={() => setPaletteOpen(true)}
              className="rounded-full p-2 text-gray-600 dark:text-gray-400"
            >
              <Search size={18} />
            </button>

            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full p-2 text-gray-600 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
              // Functional update; rapid taps would otherwise read a stale
              // `isOpen` from the closure and drop a toggle.
              onClick={() => setIsOpen((open) => !open)}
              className="rounded-full p-2 text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-gray-300"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/*
         * `initial={false}` keeps the menu from animating open on mount if a
         * re-render ever arrives with it already true. Height animation is
         * skipped entirely under reduced motion - the menu just appears.
         */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              id="mobile-nav-menu"
              variants={reduceMotion ? undefined : menuVariants}
              initial={reduceMotion ? undefined : 'hidden'}
              animate={reduceMotion ? undefined : 'visible'}
              exit={reduceMotion ? undefined : 'exit'}
              // `overflow-hidden` is what makes the height animation read as a
              // reveal rather than the list being squashed. The inner wrapper
              // owns scrolling so a long list still reaches the last item.
              className="overflow-hidden border-t border-emerald-200/80 bg-emerald-50/95 dark:border-emerald-500/30 dark:bg-gray-900/95 lg:hidden"
            >
              <div
                className="max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain"
                // Lenis would otherwise swallow wheel/touch events aimed at
                // this list and scroll the page behind the open menu instead.
                data-lenis-prevent
              >
                <ul
                  className="flex flex-col items-stretch gap-1 px-3 py-3 font-mono"
                  aria-label="Site sections"
                >
                  {sections.map((item) => (
                    <motion.li key={item} variants={reduceMotion ? undefined : menuItemVariants}>
                      <a
                        href={`#${item}`}
                        onClick={(event) => handleNavClick(event, item)}
                        aria-current={active === item ? 'true' : undefined}
                        className={`block rounded-lg px-3 py-2 text-base transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:text-lg ${
                          active === item
                            ? sectionTextColors[item]
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                        }`}
                      >
                        {sectionLabels[item]}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </nav>
    </>
  )
}

export default Navbar
