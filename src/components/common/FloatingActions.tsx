import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { ArrowUp, Send, X } from 'lucide-react'
import { useSmoothScroll } from '../../providers/SmoothScrollProvider'
import { useAppStore } from '../../store/useAppStore'
import useCoarsePointer from '../../hooks/useCoarsePointer'

const WHATSAPP_NUMBER = '916294660381'
const DEFAULT_MESSAGE =
  "Hi Sourav, I came across your portfolio and I'd like to connect about an opportunity."

/** Scroll distance (px) before the back-to-top button appears. */
const SHOW_AFTER = 320

/** Dragged position, persisted so the button stays where it was put. */
const POSITION_KEY = 'portfolio-whatsapp-offset'

/** lucide-react ships no brand icons, so the WhatsApp glyph is inlined. */
const WhatsAppIcon = ({ size = 26 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [dragBounds, setDragBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const draggedRef = useRef(false)
  const closeTimer = useRef(0)

  // Framer writes drag deltas into these directly, so the button stays where
  // it is dropped instead of being reset by the next React render.
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const { scrollTo } = useSmoothScroll()
  const reduceMotion = useReducedMotion()
  const isCoarsePointer = useCoarsePointer()
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

    // Run once so a reload partway down the page shows the button immediately.
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== 0) window.cancelAnimationFrame(raf)
    }
  }, [])

  // Keep the button inside the viewport, and restore a saved position.
  useEffect(() => {
    const BUTTON = 56 // h-14
    const MARGIN = 24 // bottom-6 / right-6

    const applyBounds = () => {
      // The element is anchored bottom-right, so it can only move up/left.
      const bounds = {
        left: -(window.innerWidth - BUTTON - MARGIN * 2),
        right: 0,
        top: -(window.innerHeight - BUTTON - MARGIN * 2),
        bottom: 0,
      }
      setDragBounds(bounds)

      // Clamp the current position after a resize or rotation.
      x.set(Math.min(0, Math.max(bounds.left, x.get())))
      y.set(Math.min(0, Math.max(bounds.top, y.get())))
    }

    try {
      const saved = window.localStorage.getItem(POSITION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          x.set(parsed.x)
          y.set(parsed.y)
        }
      }
    } catch {
      // Ignore unreadable/corrupt storage and keep the default corner.
    }

    applyBounds()
    window.addEventListener('resize', applyBounds)
    window.addEventListener('orientationchange', applyBounds)

    return () => {
      window.removeEventListener('resize', applyBounds)
      window.removeEventListener('orientationchange', applyBounds)
    }
  }, [x, y])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const openPanel = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    setPanelOpen(true)
  }, [])

  // Small delay so moving the cursor between button and panel does not close it.
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setPanelOpen(false), 220)
  }, [])

  const send = useCallback(() => {
    const text = message.trim() || DEFAULT_MESSAGE
    recordClick('whatsapp-contact')
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    )
    setPanelOpen(false)
    setMessage('')
  }, [message, recordClick])

  // Touch devices have no hover, so there the button taps open the panel.
  const hoverProps = isCoarsePointer
    ? {}
    : { onMouseEnter: openPanel, onMouseLeave: scheduleClose }

  return (
    <>
      {/*
       * Back to top: bottom-left corner, on the same baseline as the WhatsApp
       * button on the right so the two read as a balanced pair.
       */}
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

      {/* WhatsApp: bottom-right, draggable, always visible. */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={dragBounds}
        // Motion values, not plain numbers: framer writes the drag offset
        // straight into these. Passing state numbers would make every render
        // reset x/y and snap the button back to its origin.
        style={{ x, y }}
        onDragStart={() => {
          draggedRef.current = true
          setPanelOpen(false)
        }}
        onDragEnd={() => {
          try {
            window.localStorage.setItem(
              POSITION_KEY,
              JSON.stringify({ x: x.get(), y: y.get() })
            )
          } catch {
            // Position simply will not persist; not worth surfacing.
          }
          // Let the click handler know this gesture was a drag, not a tap.
          window.setTimeout(() => {
            draggedRef.current = false
          }, 0)
        }}
        className="fixed bottom-6 right-6 z-[95] flex cursor-grab flex-col items-end gap-3 active:cursor-grabbing"
        {...hoverProps}
      >
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              key="wa-panel"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              // Dragging from inside the panel would fight the text field.
              onPointerDownCapture={(event) => event.stopPropagation()}
              className="w-[min(88vw,20rem)] cursor-default overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-center justify-between bg-[#0f766e] px-4 py-3 text-white">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#25D366]">
                    <WhatsAppIcon size={16} />
                  </span>
                  Chat with Sourav
                </span>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  aria-label="Close chat panel"
                  className="rounded p-1 text-white/80 transition hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 p-4">
                <p className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  Hi, I&apos;m Sourav. Thanks for stopping by! Have a role in mind
                  or a question about my work? Send a message and I&apos;ll reply
                  shortly.
                </p>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      send()
                    }
                  }}
                  rows={3}
                  placeholder="Type your message here..."
                  aria-label="Message"
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={send}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Send on WhatsApp <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/*
         * Halo + float wrapper. The button itself stays a plain <button> so
         * the drag handler on the parent and the click target are unaffected.
         */}
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center"
          animate={
            reduceMotion || panelOpen ? { y: 0 } : { y: [0, -6, 0] }
          }
          transition={
            reduceMotion || panelOpen
              ? { duration: 0.2 }
              : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <button
            type="button"
            onClick={() => {
              // Suppress the click that ends a drag gesture.
              if (draggedRef.current) return
              setPanelOpen((prev) => !prev)
            }}
            aria-label="Chat with Sourav on WhatsApp"
            aria-expanded={panelOpen}
            title="Chat on WhatsApp"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          >
            {panelOpen ? <X size={24} /> : <WhatsAppIcon size={26} />}
          </button>
        </motion.div>
      </motion.div>
    </>
  )
}

export default FloatingActions
