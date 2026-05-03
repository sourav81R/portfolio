import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MOTION_TOKENS } from '../../lib/motion'

type WordCycleProps = {
  words: string[]
  interval?: number
}

const WordCycle = ({
  words,
  interval = MOTION_TOKENS.durations.wordCycleInterval,
}: WordCycleProps) => {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [minWidth, setMinWidth] = useState<number | undefined>(undefined)
  const measureRef = useRef<HTMLSpanElement>(null)
  const longestWord = useMemo(
    () => words.reduce((longest, word) => (word.length > longest.length ? word : longest), words[0] ?? ''),
    [words]
  )

  useEffect(() => {
    const nextWidth = measureRef.current?.offsetWidth
    if (!nextWidth) return
    setMinWidth(nextWidth)
  }, [longestWord])

  useEffect(() => {
    if (reduceMotion || words.length <= 1) return

    const timeoutId = window.setTimeout(() => {
      setIndex((current) => (current + 1) % words.length)
    }, interval)

    return () => window.clearTimeout(timeoutId)
  }, [index, interval, reduceMotion, words.length])

  if (words.length === 0) {
    return null
  }

  if (reduceMotion) {
    return <span>{words[0]}</span>
  }

  return (
    <span
      className="relative inline-flex items-center align-baseline"
      style={minWidth ? { minWidth } : undefined}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
      >
        {longestWord}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={`${words[index]}-${index}`}
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
          transition={{
            duration: MOTION_TOKENS.durations.fast,
            ease: MOTION_TOKENS.easing,
          }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default WordCycle
