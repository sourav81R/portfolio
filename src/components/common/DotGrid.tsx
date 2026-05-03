import { motion, useReducedMotion } from 'framer-motion'

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
            className="text-emerald-400/70 dark:text-emerald-300/40"
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.18, 0.55, 0.18] }
            }
            transition={
              reduceMotion
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
