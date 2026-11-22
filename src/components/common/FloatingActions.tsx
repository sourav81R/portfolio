import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useSmoothScroll } from '../../providers/SmoothScrollProvider'
import { useAppStore } from '../../store/useAppStore'

const SHOW_AFTER = 320

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { scrollTo } = useSmoothScroll()
  const reduceMotion = useReducedMotion()
  const recordClick = useAppStore((state) => state.recordClick)

  useEffect(() => {
    let raf = 0

    const update = () => {
      setShowScrollTop(window.scrollY > SHOW_AFTER)
      raf = 0
    }

    const onScroll = () => {
      if (raf !== 0) return
      raf = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== 0) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-[95]">
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            key="scroll-top"
            onClick={() => {
              recordClick('scroll-to-top')
              scrollTo(0, { offset: 0, immediate: reduceMotion ?? false })
            }}
            aria-label="Scroll back to top"
            title="Back to top"
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-emerald-500 text-white shadow-[0_8px_24px_-4px_rgba(16,185,129,0.6)] transition hover:scale-105 hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-gray-900/70 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.85 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ArrowUp size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingActions
