import { ReactNode, useRef } from 'react'
import { motion } from 'framer-motion'

type Props = {
  children: ReactNode
  className?: string
}

const MagneticButton = ({ children, className = '' }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`
  }

  const reset = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0,0)'
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className={`inline-block transition-transform duration-200 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default MagneticButton
