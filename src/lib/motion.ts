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
  /*
   * Fire as soon as any part of the block enters, and start 120px before it
   * does. At 12% a tall section had to be substantially on screen before its
   * text faded in, so scrolling quickly meant arriving at content that was
   * still animating. Starting early means the reveal has finished by the time
   * the reader gets there.
   */
  amount: 0 as const,
  // Positive margin grows the trigger box, so the reveal starts 140px before
  // the block actually reaches the viewport.
  margin: '0px 0px 140px 0px',
} as const

export const sectionRevealTransition = {
  duration: MOTION_TOKENS.durations.section,
  ease: MOTION_TOKENS.easing,
} as const

export const getSectionRevealProps = (
  reduceMotion: boolean | null | undefined
): MotionProps =>
  reduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: sectionViewport,
        variants: sectionRevealVariants,
        transition: sectionRevealTransition,
      }
