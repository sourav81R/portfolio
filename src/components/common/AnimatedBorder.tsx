import { ReactNode, useEffect, useRef, useState } from 'react'

type AnimatedBorderProps = {
  children: ReactNode
}

/* 🔹 Single source of truth for section gradients */
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
  const [gradient, setGradient] = useState(sectionColorMap.home)

  useEffect(() => {
    if (!ref.current) return

    /* 🔹 Detect nearest section */
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

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-[1.5px] overflow-hidden"
    >
      {/* 🔹 Animated Gradient Border */}
      <div
        className={`
          absolute inset-0
          bg-gradient-to-r ${gradient}
          animate-border
          transition-all duration-700 ease-out
          ${
            inView
              ? 'opacity-100 blur-[6px] scale-105'
              : 'opacity-30 blur-[1px] scale-100'
          }
        `}
      />

      {/* 🔹 Inner content */}
      <div className="relative rounded-2xl bg-white dark:bg-black">
        {children}
      </div>
    </div>
  )
}

export default AnimatedBorder
