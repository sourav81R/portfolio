import { useEffect } from 'react'
import { useSmoothScroll } from '../providers/SmoothScrollProvider'

/**
 * Locks page scrolling while an overlay is open.
 *
 * The native `overflow: hidden` lock alone is not enough once Lenis is
 * running: Lenis drives scroll from wheel/touch events and would keep
 * moving the page behind the overlay. Stopping the instance is required.
 */
export function useScrollLock(locked: boolean) {
  const { stop, start } = useSmoothScroll()

  useEffect(() => {
    if (!locked) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    stop()

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      start()
    }
  }, [locked, stop, start])
}
