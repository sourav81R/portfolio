import { useRef } from 'react'
import clsx from 'clsx'
import { Calendar, GraduationCap, School, Sparkles } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import { getSectionRevealProps } from '../../lib/motion'

const educationData = [
  {
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    school: 'Greater Kolkata College of Engineering & Management',
    year: '2022 - 2026',
    grade: 'CGPA: 7.75',
    status: 'Current Degree',
  },
  {
    degree: 'Higher Secondary (Class XII)',
    field: 'Science',
    school: 'Shyamnagar Sri Ramkrishna Vidyamandir',
    year: '2019 - 2021',
    grade: '83%',
    status: 'Foundation Stage',
  },
  {
    degree: 'Secondary (Class X)',
    field: 'General',
    school: 'Shyamnagar Sri Ramkrishna Vidyamandir',
    year: '2018 - 2019',
    grade: '70.14%',
    status: 'School Milestone',
  },
] as const

const Education = () => {
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 82%', 'end 62%'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 18,
  })

  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <AnimatedBorder>
        <div className="mx-auto max-w-5xl p-4 font-mono sm:p-6 md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] uppercase tracking-[0.34em] text-fuchsia-500">
              Academic Journey
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Education
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
              A cleaner view of the milestones that shaped my technical foundation,
              learning habits, and readiness for software roles.
            </p>
          </div>

          <div ref={timelineRef} className="relative mx-auto mt-12 max-w-4xl">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-gray-200 dark:bg-gray-800 md:left-1/2 md:-translate-x-1/2" />
            <motion.div
              className="absolute bottom-0 left-5 top-0 w-px bg-emerald-400 md:left-1/2 md:-translate-x-1/2"
              style={{
                scaleY: reduceMotion ? 1 : smoothProgress,
                transformOrigin: 'top',
              }}
            />

            <div className="space-y-6 md:space-y-10">
              {educationData.map((edu, index) => {
                const alignsLeft = index % 2 === 0

                return (
                  <motion.article
                    key={`${edu.degree}-${edu.year}`}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, x: alignsLeft ? -28 : 28, y: 20 }
                    }
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.3 }}
                    className={clsx(
                      'relative flex',
                      alignsLeft ? 'md:justify-start' : 'md:justify-end'
                    )}
                  >
                    <div className="absolute left-5 top-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-emerald-500 shadow-[0_0_0_8px_rgba(16,185,129,0.10)] dark:border-[#020617] md:left-1/2" />

                    <div
                      className={clsx(
                        'ml-10 w-full md:ml-0 md:w-[calc(50%-2.25rem)]',
                        alignsLeft ? 'md:mr-auto' : 'md:ml-auto'
                      )}
                    >
                      <div className="group relative overflow-hidden rounded-[26px] border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_22px_55px_-38px_rgba(16,185,129,0.45)] dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-emerald-500/35">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="max-w-xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
                                <Sparkles size={12} />
                                {edu.status}
                              </span>
                            </div>

                            <h3 className="mt-4 flex items-start gap-3 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                              <span className="mt-0.5 inline-flex rounded-2xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <GraduationCap size={18} />
                              </span>
                              <span>{edu.degree}</span>
                            </h3>

                            <p className="mt-3 text-base font-medium text-gray-700 dark:text-gray-300">
                              {edu.field}
                            </p>

                            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                              <School size={16} />
                              {edu.school}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 sm:items-end">
                            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              <Calendar size={14} />
                              {edu.year}
                            </span>
                            <span className="inline-flex rounded-full bg-fuchsia-500/10 px-3 py-1 text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-300">
                              {edu.grade}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </div>
      </AnimatedBorder>
    </motion.div>
  )
}

export default Education
