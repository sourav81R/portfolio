import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Briefcase, Calendar, ChevronRight, FileBadge2, MapPin } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import ExperienceModal, {
  type ExperienceEntry,
} from '../common/ExperienceModal'
import { getSectionRevealProps, MOTION_TOKENS } from '../../lib/motion'

const resolvePublicAsset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const experienceData: ExperienceEntry[] = [
  {
    role: 'Full Stack Developer Intern',
    company: 'Euphoria GenX',
    period: 'Aug 2025 - Feb 2026',
    location: 'Remote',
    badge: 'Latest Internship',
    summary:
      'Built and shipped a real-time food delivery application during a structured full-stack internship focused on practical product delivery.',
    description: [
      'Completed a structured internship focused on full-stack web development and product thinking.',
      'Built the Foodooza real-time food delivery application with end-to-end frontend and backend functionality.',
      'Implemented responsive UI flows, real-time interactions, and integrated key product features across the stack.',
      'Strengthened debugging, deployment, and collaboration skills in an industry-style development environment.',
    ],
    metrics: [
      '6-month internship program completed',
      '1 end-to-end food delivery app built',
      'Real-time UX and backend integration delivered',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
    credential: {
      label: 'Verified internship credential',
      title: 'Certificate of Internship',
      summary:
        'Issued by Euphoria GenX for successfully completing the internship programme and delivering the PetPooja/Foodooza real-time food delivery web app project.',
      fileSrc: resolvePublicAsset('/images/euphoria-internship-certificate.svg'),
      previewImageSrc: resolvePublicAsset('/images/euphoria-internship-certificate.svg'),
      previewImageAlt:
        'Euphoria GenX internship certificate awarded to Sourav Chowdhury for the PetPooja real-time food delivery web app project.',
      credentialId: 'EG-26-1586',
      issuedOn: '18 Feb 2026',
      projectLabel: 'Open case study',
      projectHref: '/case-studies/foodooza',
    },
  },
  {
    role: 'Web Developer Intern',
    company: 'Pinnacle Labs Pvt Ltd',
    period: 'Oct 2024 - Nov 2024',
    location: 'Remote',
    badge: 'Previous Internship',
    summary:
      'Delivered frontend modules, API integrations, and bug fixes in a remote internship focused on shipping production-ready React work.',
    description: [
      'Developed frontend components using React and modern JavaScript.',
      'Integrated REST APIs and handled request/response workflows across core screens.',
      'Debugged UI, API, and data-flow issues to improve delivery reliability.',
      'Used Git and followed SDLC-based development practices in a structured remote setup.',
    ],
    metrics: [
      '5+ UI modules delivered',
      '4 core API workflows integrated',
      '<24h turnaround on recurring UI and data bugs',
    ],
    tech: ['React', 'JavaScript', 'REST APIs', 'Git'],
    credential: {
      label: 'Internship completion certificate',
      title: 'Pinnacle Labs Internship Certificate',
      summary:
        'Certificate PDF for the remote full-stack internship at Pinnacle Labs Pvt Ltd, covering frontend delivery, API integration, debugging, and SDLC-based development practices.',
      fileSrc: resolvePublicAsset('/images/pinnacle-certificate.pdf'),
      verifyLabel: 'Verify on Pinnacle Labs',
      verifyHref: 'https://pinnaclelabs.tech/verify/',
    },
  },
]

type ActiveModalState =
  | {
      view: 'details' | 'certificate'
      experience: ExperienceEntry
    }
  | null

const Experience = () => {
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeModal, setActiveModal] = useState<ActiveModalState>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 82%', 'end 62%'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 18,
  })

  return (
    <>
      <motion.div
        {...sectionRevealProps}
        className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      >
        <AnimatedBorder>
          <div
            ref={sectionRef}
            className="relative mx-auto max-w-5xl px-4 py-10 text-gray-900 dark:text-white sm:px-5 sm:py-12 lg:px-8"
          >
            <div className="relative z-10">
              <div className="mx-auto max-w-xl text-center">
                <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
                  Real Work Timeline
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Experience
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Compact internship cards first, with deeper proof and certificate access
                  only when someone asks for it.
                </p>
              </div>

              <div className="relative mx-auto mt-10 max-w-4xl">
                <div className="absolute bottom-0 left-5 top-0 w-px bg-gray-200 dark:bg-gray-800 md:left-1/2 md:-translate-x-1/2" />
                <motion.div
                  className="absolute bottom-0 left-5 top-0 w-px bg-emerald-400 md:left-1/2 md:-translate-x-1/2"
                  style={{
                    scaleY: reduceMotion ? 1 : smoothProgress,
                    transformOrigin: 'top',
                  }}
                />

                <div className="space-y-6 md:space-y-10">
                  {experienceData.map((experience, index) => {
                    const alignsLeft = index % 2 === 0

                    return (
                      <motion.article
                        key={`${experience.company}-${experience.period}`}
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, x: alignsLeft ? -36 : 36, y: 20 }
                        }
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{
                          duration: MOTION_TOKENS.durations.medium,
                          ease: MOTION_TOKENS.easing,
                        }}
                        className={clsx(
                          'relative flex',
                          alignsLeft ? 'md:justify-start' : 'md:justify-end'
                        )}
                      >
                        <div className="absolute left-5 top-8 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-400 ring-4 ring-white dark:ring-[#0b1220] md:left-1/2" />

                        <div
                          className={clsx(
                            'ml-10 w-full md:ml-0 md:w-[calc(50%-2.25rem)]',
                            alignsLeft ? 'md:mr-auto' : 'md:ml-auto'
                          )}
                        >
                          <div className="rounded-[24px] border border-gray-200 bg-gray-50/70 p-4 shadow-sm transition duration-300 hover:border-emerald-500/35 hover:shadow-[0_18px_45px_-34px_rgba(16,185,129,0.28)] dark:border-gray-800 dark:bg-gray-900/50 sm:p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="max-w-xl">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-200">
                                    {experience.badge}
                                  </span>
                                </div>
                                <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                                  {experience.role}
                                </h3>
                                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300 sm:text-[15px]">
                                  <Briefcase size={15} className="text-emerald-500 dark:text-emerald-400" />
                                  {experience.company}
                                </p>
                              </div>

                              <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400 sm:items-end">
                                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800">
                                  <Calendar size={13} />
                                  {experience.period}
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800">
                                  <MapPin size={13} />
                                  {experience.location}
                                </span>
                              </div>
                            </div>

                            <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-400">
                              {experience.summary}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {experience.tech.slice(0, 4).map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>

                            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveModal({ view: 'details', experience })
                                }
                                className="group inline-flex min-h-[50px] w-full items-center justify-center gap-1.5 rounded-full border border-sky-300/35 bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_-16px_rgba(14,165,233,0.85)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:via-cyan-400 hover:to-sky-300 hover:shadow-[0_22px_46px_-16px_rgba(56,189,248,1)] focus:outline-none focus:ring-2 focus:ring-sky-200/80 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0b1220]"
                              >
                                <Briefcase
                                  size={16}
                                  className="shrink-0 text-white transition group-hover:scale-110"
                                />
                                <span>View Details</span>
                                <ChevronRight
                                  size={16}
                                  className="shrink-0 text-white/90 transition group-hover:translate-x-1"
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveModal({ view: 'certificate', experience })
                                }
                                className="group inline-flex min-h-[50px] w-full items-center justify-center gap-1.5 rounded-full border border-emerald-300/35 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_-16px_rgba(16,185,129,0.82)] transition duration-200 hover:-translate-y-0.5 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-300 hover:shadow-[0_22px_46px_-16px_rgba(45,212,191,0.98)] focus:outline-none focus:ring-2 focus:ring-emerald-200/80 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0b1220]"
                              >
                                <FileBadge2
                                  size={16}
                                  className="shrink-0 text-white transition group-hover:scale-110"
                                />
                                <span>View Certificate</span>
                                <ChevronRight
                                  size={16}
                                  className="shrink-0 text-white/90 transition group-hover:translate-x-1"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </AnimatedBorder>
      </motion.div>

      <ExperienceModal
        open={activeModal !== null}
        view={activeModal?.view ?? 'details'}
        experience={activeModal?.experience ?? null}
        onClose={() => setActiveModal(null)}
      />
    </>
  )
}

export default Experience
