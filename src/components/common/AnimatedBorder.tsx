import { ReactNode, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { sectionGradientBackgrounds } from '../../constants/sectionColor'

type AnimatedBorderProps = {
  children: ReactNode
}

const AnimatedBorder = ({ children }: AnimatedBorderProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const reduceMotion = useReducedMotion()
  const [gradient, setGradient] = useState(sectionGradientBackgrounds.home)

  useEffect(() => {
    if (!ref.current) return

    const section = ref.current.closest('section')
    const sectionId = section?.id ?? 'home'
    setGradient(
      sectionGradientBackgrounds[sectionId] || sectionGradientBackgrounds.home
    )

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.15,
        rootMargin: '-40px 0px -40px 0px',
      }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const shouldAnimate = inView && !reduceMotion

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-10 z-0 h-36 w-36 rounded-full blur-3xl"
        animate={
          shouldAnimate
            ? {
                opacity: [0.05, 0.12, 0.05],
                scale: [0.96, 1.04, 0.96],
                x: ['-3%', '2%', '-3%'],
              }
            : {
                opacity: 0.06,
                scale: 1,
                x: '0%',
              }
        }
        transition={
          shouldAnimate
            ? {
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {
                duration: 0.3,
                ease: 'easeOut',
              }
        }
        style={{
          backgroundImage: gradient,
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 right-[10%] z-0 h-28 w-28 rounded-full blur-2xl"
        animate={
          shouldAnimate
            ? {
                opacity: [0.04, 0.1, 0.04],
                scale: [1, 1.08, 1],
                y: ['0%', '-6%', '0%'],
              }
            : {
                opacity: 0.05,
                scale: 1,
                y: '0%',
              }
        }
        transition={
          shouldAnimate
            ? {
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.8,
              }
            : {
                duration: 0.3,
                ease: 'easeOut',
              }
        }
        style={{
          backgroundImage: gradient,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default AnimatedBorder
