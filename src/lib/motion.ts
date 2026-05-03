import type { MotionProps, Variants } from 'framer-motion'

export const MOTION_TOKENS = {
  easing: [0.22, 1, 0.36, 1] as const,
  durations: {
    fast: 0.4,
    medium: 0.5,
    section: 0.6,
    countUp: 1.8,
    wordCycleInterval: 2800,
  },
} as const

const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

export const sectionViewport = {
  once: true,
  amount: 0.12,
} as const

export const sectionRevealTransition = {
  duration: MOTION_TOKENS.durations.section,
  ease: MOTION_TOKENS.easing,
} as const

export const getSectionRevealProps = (reduceMotion: boolean): MotionProps =>
  reduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: sectionViewport,
        variants: sectionRevealVariants,
        transition: sectionRevealTransition,
      }
