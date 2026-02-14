import { ReactNode, useEffect, useRef, useState } from 'react'

type AnimatedBorderProps = {
  children: ReactNode
}

const sectionColorMap: Record<string, string> = {
  home: 'from-green-500 via-emerald-400 to-green-500',
  about: 'from-blue-500 via-cyan-400 to-blue-500',
  experience: 'from-orange-500 via-amber-400 to-orange-500',
  skills: 'from-purple-500 via-fuchsia-400 to-purple-500',
  projects: 'from-sky-500 via-blue-400 to-sky-500',
  education: 'from-pink-500 via-rose-400 to-pink-500',
  certifications: 'from-lime-500 via-green-400 to-lime-500',
  contact: 'from-red-500 via-rose-400 to-red-500',
}

const AnimatedBorder = ({ children }: AnimatedBorderProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [gradient, setGradient] = useState(sectionColorMap.home)

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
    setGradient(sectionColorMap[sectionId] || sectionColorMap.home)

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
