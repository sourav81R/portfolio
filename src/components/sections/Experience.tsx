import { useRef } from 'react'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import { getSectionRevealProps, MOTION_TOKENS } from '../../lib/motion'

const experienceData = [
  {
    role: 'Full Stack Developer Intern',
    company: 'Euphoria GenX',
    period: 'Aug 2025 - Feb 2026',
    location: 'Remote',
    description: [
      'Completed a structured skill development and internship program focused on full-stack web development.',
      'Built the Foodooza real-time food delivery application with end-to-end frontend and backend functionality.',
      'Implemented responsive UI flows, real-time interactions, and integration across core product features.',
      'Strengthened debugging, deployment, and collaboration skills in an industry-style development environment.',
    ],
    metrics: [
      '6-month internship program completed',
      '1 end-to-end food delivery app built',
      'Real-time UX and backend integration delivered',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
  },
  {
    role: 'Full-Stack Developer Intern',
    company: 'Pinnacle Labs Pvt Ltd',
    period: 'Oct 2024 - Nov 2024',
    location: 'Remote',
    description: [
      'Developed frontend components using React and modern JavaScript',
      'Integrated REST APIs and handled request/response workflows',
      'Debugged UI, API, and data-flow issues',
      'Used Git and followed SDLC-based development practices',
    ],
    metrics: [
      '5+ UI modules delivered',
      '4 core API workflows integrated',
      '<24h turnaround on recurring UI and data bugs',
    ],
    tech: ['React', 'JavaScript', 'REST APIs', 'Git'],
  },
]

const Experience = () => {
  const text = 'Experience'
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 60%'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
  })

  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <AnimatedBorder>
        <div ref={sectionRef} className="max-w-5xl mx-auto font-mono p-4 sm:p-6 md:p-10">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 sm:mb-14 tracking-tight">
            {text}
          </h2>

          <div className="relative ml-3 space-y-12 md:ml-6">
            <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-gray-200 dark:bg-gray-800" />
            <motion.div
              className="absolute left-0 top-0 w-[2px] bg-green-500"
              style={{
                scaleY: reduceMotion ? 1 : smoothProgress,
                transformOrigin: 'top',
              }}
            />
            {experienceData.map((exp, index) => (
              <motion.div
                key={index}
                initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: MOTION_TOKENS.durations.medium,
                  ease: MOTION_TOKENS.easing,
                }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full border-4 border-green-500 bg-white dark:bg-black" />

                {/* Content Card */}
                <div className="
                    relative
                    p-4 sm:p-6 rounded-xl
                    bg-gray-50 dark:bg-gray-900/50
                    border border-gray-200 dark:border-gray-800
                    hover:border-green-500 dark:hover:border-green-500
                    shadow-sm hover:shadow-md
                ">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {exp.role}
                      </h3>
                      <p className="text-green-500 font-medium flex items-center gap-2 mt-1">
                        <Briefcase size={16} />
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {exp.description.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {exp.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 font-mono text-xs text-teal-600 dark:text-teal-400"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="
                                    px-3 py-1 text-xs font-medium
                                    bg-green-500/10 text-green-600 dark:text-green-400
                                    rounded-full border border-green-500/20
                                "
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedBorder>
    </motion.div>
  )
}

export default Experience
