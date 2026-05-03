import { animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { MOTION_TOKENS } from '../../lib/motion'

type CountUpProps = {
  to: number
  duration?: number
  suffix?: string
}

const CountUp = ({
  to,
  duration = MOTION_TOKENS.durations.countUp,
  suffix = '',
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(0)
  const rounded = useTransform(count, (value) => Math.round(value))
  const [displayValue, setDisplayValue] = useState(() => Math.round(to))

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(Math.round(to))
      return
    }

    const unsubscribe = rounded.on('change', (value) => {
      setDisplayValue(Math.round(value))
    })

    return unsubscribe
  }, [reduceMotion, rounded, to])

  useEffect(() => {
    if (reduceMotion) return
    if (!isInView) return

    count.set(0)

    const controls = animate(count, to, {
      duration,
      ease: MOTION_TOKENS.easing,
    })

    return () => controls.stop()
  }, [count, duration, isInView, reduceMotion, to])

  if (reduceMotion) {
    return (
      <span ref={ref}>
        {Math.round(to)}
        {suffix}
      </span>
    )
  }

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  )
}

export default CountUp
