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
    <div ref={ref} className="relative overflow-hidden rounded-2xl p-[1.5px]">
      <motion.div
        className="absolute inset-0"
        animate={
          shouldAnimate
            ? {
                backgroundPosition: ['0% 50%', '200% 50%'],
                opacity: [0.78, 0.95, 0.78],
              }
            : {
                backgroundPosition: '0% 50%',
                opacity: 0.55,
              }
        }
        transition={
          shouldAnimate
            ? {
                duration: 7,
                repeat: Infinity,
                ease: 'linear',
              }
            : {
                duration: 0.3,
                ease: 'easeOut',
              }
        }
        style={{
          backgroundImage: gradient,
          backgroundSize: '220% 220%',
          willChange: shouldAnimate ? 'background-position, opacity' : 'opacity',
        }}
      />

      <div className="relative rounded-2xl bg-white dark:bg-black">
        {children}
      </div>
    </div>
  )
}

export default AnimatedBorder
