import type { MotionProps, Variants } from 'framer-motion'

const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

export const sectionViewport = {
  once: true,
  amount: 0.12,
} as const

export const sectionRevealTransition = {
  duration: 0.6,
  ease: 'easeOut',
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
