import { motion, useReducedMotion } from 'framer-motion'

type SkeletonProps = {
  className?: string
}

const Skeleton = ({ className = '' }: SkeletonProps) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 ${className}`}
      animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
      }
    />
  )
}

export default Skeleton
