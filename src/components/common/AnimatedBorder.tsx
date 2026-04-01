import { ReactNode, useEffect, useRef, useState } from 'react'
import { sectionGradientColors } from '../../constants/sectionColor'

type AnimatedBorderProps = {
  children: ReactNode
}

const AnimatedBorder = ({ children }: AnimatedBorderProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [gradient, setGradient] = useState(sectionGradientColors.home)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduceMotion(media.matches)
    onChange()

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!ref.current) return

    const section = ref.current.closest('section')
    const sectionId = section?.id ?? 'home'
    setGradient(sectionGradientColors[sectionId] || sectionGradientColors.home)

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.15,
        rootMargin: '-40px 0px -40px 0px',
      }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const shouldAnimate = inView && !reduceMotion

  return (
    <div ref={ref} className="relative rounded-2xl p-[1.5px] overflow-hidden">
      <div
        className={`
          absolute inset-0
          bg-gradient-to-r ${gradient}
          ${shouldAnimate ? 'animate-border opacity-95' : 'opacity-55'}
          transition-opacity duration-500 ease-out
        `}
        style={shouldAnimate ? { willChange: 'background-position' } : undefined}
      />

      <div className="relative rounded-2xl bg-white dark:bg-black">
        {children}
      </div>
    </div>
  )
}

export default AnimatedBorder
