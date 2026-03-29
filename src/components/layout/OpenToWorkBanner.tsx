import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const DISMISS_KEY = 'portfolio-open-to-work-dismissed'

const OpenToWorkBanner = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === 'true'
    setVisible(!dismissed)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--banner-offset',
      visible ? '44px' : '0px'
    )

    return () => {
      document.documentElement.style.setProperty('--banner-offset', '0px')
    }
  }, [visible])

  const dismissBanner = () => {
    window.localStorage.setItem(DISMISS_KEY, 'true')
    setVisible(false)
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className={visible ? 'sticky top-0 z-[60] min-h-[44px]' : 'relative z-[60] h-0'}>
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            initial={{ y: -44, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -44, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-[44px] items-center border-b border-emerald-500/20 bg-gray-950 px-4 text-white shadow-sm dark:bg-black sm:px-6"
          >
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 font-mono">
              <div className="flex min-w-0 items-center gap-3 text-xs sm:text-sm">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <p className="truncate text-white/90">
                  Open to full-time roles - Available from June 2026
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white transition hover:bg-white/20 sm:text-xs"
                >
                  Contact me
                </button>
                <button
                  type="button"
                  aria-label="Dismiss open to work banner"
                  onClick={dismissBanner}
                  className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OpenToWorkBanner
