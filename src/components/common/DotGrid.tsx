import { motion, useReducedMotion } from 'framer-motion'
import useCoarsePointer from '../../hooks/useCoarsePointer'

const columns = 14
const rows = 8

const dots = Array.from({ length: columns * rows }, (_, index) => {
  const column = index % columns
  const row = Math.floor(index / columns)

  return {
    id: `${column}-${row}`,
    x: 24 + column * 42,
    y: 24 + row * 42,
    delay: (column + row) * 0.06,
  }
})

const DotGrid = () => {
  const reduceMotion = useReducedMotion()
  /*
   * 112 dots each ran their own infinite opacity tween, so framer-motion was
   * driving 112 independent animations inside the hero - the most expensive
   * thing on the page during the first mobile viewport, and squarely in the
   * critical window Lighthouse measures.
   *
   * On phones the dots keep their staggered container fade (one animation)
   * but stop pulsing individually. The grid still reads as a textured
   * backdrop; it just costs one animation instead of 112.
   */
  const isCoarsePointer = useCoarsePointer()
  const staticDots = reduceMotion || isCoarsePointer

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      animate={
        reduceMotion
          ? undefined
          : { opacity: [0.16, 0.3, 0.16], y: [0, -8, 0] }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 620 360"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {dots.map((dot) => (
          <motion.circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r="1.6"
            fill="currentColor"
            // Static dots sit at the midpoint of the pulse they would have
            // run, so the grid looks the same as a paused frame of it.
            opacity={staticDots ? 0.36 : undefined}
            className="text-emerald-400/70 dark:text-emerald-300/40"
            animate={
              staticDots
                ? undefined
                : { opacity: [0.18, 0.55, 0.18] }
            }
            transition={
              staticDots
                ? undefined
                : {
                    duration: 4.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: dot.delay,
                  }
            }
          />
        ))}
      </svg>
    </motion.div>
  )
}

export default DotGrid
