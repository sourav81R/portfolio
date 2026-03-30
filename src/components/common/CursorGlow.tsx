import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const CursorGlow = () => {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 140, damping: 22, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 140, damping: 22, mass: 0.35 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    setEnabled(isFinePointer)

    if (!isFinePointer) return

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX - 140)
      y.set(event.clientY - 140)
    }

    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16),rgba(99,102,241,0.12),transparent_70%)] blur-3xl"
      style={{ x: springX, y: springY }}
    />
  )
}

export default CursorGlow
