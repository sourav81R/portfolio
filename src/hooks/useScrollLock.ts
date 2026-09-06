import { useEffect } from 'react'
import { useSmoothScroll } from '../providers/SmoothScrollProvider'

/**
 * Locks page scrolling while an overlay is open.
 *
 * The native `overflow: hidden` lock alone is not enough once Lenis is
 * running: Lenis drives scroll from wheel/touch events and would keep
 * moving the page behind the overlay. Stopping the instance is required.
 *
 * The lock deliberately stays off `documentElement`. Lenis already sets
 * `overflow: hidden` there through its own `lenis-stopped` class, and adding
 * a second one made the root the only scroll owner on the page, so wheel
 * events over an overlay's scroll container were swallowed before they
 * reached it. Locking `body` alone holds the background still while any
 * element marked `data-lenis-prevent` scrolls natively.
 *
 * The scroll position is restored on unlock because hiding body overflow
 * drops it on some browsers.
 */
export function useScrollLock(locked: boolean) {
  const { stop, start } = useSmoothScroll()

  useEffect(() => {
    if (!locked) return

    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    const scrollY = window.scrollY

    // Compensate for the vanishing scrollbar so the page does not shift.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      const current = parseFloat(getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${current + scrollbarWidth}px`
    }

    body.style.overflow = 'hidden'
    stop()

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      start()
      window.scrollTo(0, scrollY)
    }
  }, [locked, stop, start])
}
