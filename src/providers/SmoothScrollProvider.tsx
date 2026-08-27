import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'

type ScrollTarget = string | number | HTMLElement

type SmoothScrollContextValue = {
  scrollTo: (target: ScrollTarget, options?: { offset?: number; immediate?: boolean }) => void
  stop: () => void
  start: () => void
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null)

/**
 * Offset applied when scrolling to a section so the fixed navbar
 * does not cover the heading. Mirrors the 140px probe in Navbar.
 */
const NAV_OFFSET = -96

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reduceMotion = useReducedMotion()
  // Re-render consumers once Lenis exists so they don't capture a null ref.
  const [, setReady] = useState(false)

  useEffect(() => {
    // Respect the OS "reduce motion" setting: fall back to native scrolling.
    if (reduceMotion) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have good native inertia; hijacking it feels worse.
      syncTouch: false,
      // Let modals, dropdowns and any opt-out subtree scroll natively.
      prevent: (node) => node.hasAttribute?.('data-lenis-prevent') ?? false,
    })

    lenisRef.current = lenis
    setReady(true)

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
      setReady(false)
    }
  }, [reduceMotion])

  const scrollTo = useCallback<SmoothScrollContextValue['scrollTo']>(
    (target, options) => {
      const lenis = lenisRef.current

      if (!lenis) {
        // Reduced motion, or Lenis not mounted: use the native equivalent.
        const element =
          typeof target === 'string' ? document.querySelector(target) : target

        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' })
        } else if (element instanceof HTMLElement) {
          element.scrollIntoView({
            behavior: options?.immediate ? 'auto' : 'smooth',
            block: 'start',
          })
        }
        return
      }

      lenis.scrollTo(target, {
        offset: options?.offset ?? NAV_OFFSET,
        immediate: options?.immediate ?? false,
      })
    },
    []
  )

  const stop = useCallback(() => lenisRef.current?.stop(), [])
  const start = useCallback(() => lenisRef.current?.start(), [])

  const value = useMemo(
    () => ({ scrollTo, stop, start }),
    [scrollTo, stop, start]
  )

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext)

  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider')
  }

  return context
}
