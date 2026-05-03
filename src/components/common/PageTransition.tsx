import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION_TOKENS } from '../../lib/motion'

export function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: MOTION_TOKENS.durations.medium,
        ease: MOTION_TOKENS.easing,
      }}
    >
      {children}
    </motion.div>
  )
}
