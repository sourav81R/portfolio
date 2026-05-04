import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Calendar, ExternalLink, FileText, MapPin, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import { getSectionRevealProps, MOTION_TOKENS } from '../../lib/motion'

const resolvePublicAsset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

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
      projectLabel: 'PetPooja / Foodooza case study',
      projectHref: '/case-studies/foodooza',
    },
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

                  {exp.credential && (
                    <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)]">
                      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 sm:p-5">
                        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                          <ShieldCheck size={14} />
                          {exp.credential.label}
                        </p>
                        <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                          {exp.credential.title}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {exp.credential.summary}
                        </p>

                        {(exp.credential.credentialId || exp.credential.issuedOn) && (
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {exp.credential.credentialId && (
                              <div className="rounded-2xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-black/20">
                                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                                  Credential ID
                                </p>
                                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                                  {exp.credential.credentialId}
                                </p>
                              </div>
                            )}
                            {exp.credential.issuedOn && (
                              <div className="rounded-2xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-black/20">
                                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                                  Issue Date
                                </p>
                                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                                  {exp.credential.issuedOn}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <a
                            href={exp.credential.fileSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                          >
                            Open certificate
                            <ExternalLink size={15} />
                          </a>
                          {exp.credential.projectHref && exp.credential.projectLabel && (
                            <Link
                              to={exp.credential.projectHref}
                              className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-500/10 dark:text-sky-300"
                            >
                              {exp.credential.projectLabel}
                            </Link>
                          )}
                          {exp.credential.verifyHref && exp.credential.verifyLabel && (
                            <a
                              href={exp.credential.verifyHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/10 dark:text-emerald-300"
                            >
                              {exp.credential.verifyLabel}
                            </a>
                          )}
                        </div>
                      </div>

                      {exp.credential.previewImageSrc ? (
                        <a
                          href={exp.credential.fileSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                        >
                          <img
                            src={exp.credential.previewImageSrc}
                            alt={exp.credential.previewImageAlt}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                        </a>
                      ) : (
                        <a
                          href={exp.credential.fileSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex min-h-[260px] flex-col justify-between rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-gray-800 dark:from-gray-950 dark:via-slate-950 dark:to-sky-950/50"
                        >
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                            <FileText size={24} />
                          </div>
                          <div className="mt-6">
                            <p className="text-xs uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                              Certificate PDF
                            </p>
                            <h5 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
                              {exp.company}
                            </h5>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                              Open the uploaded certificate document for the full internship proof and issuer verification details.
                            </p>
                          </div>
                          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                            View PDF
                            <ExternalLink size={15} />
                          </div>
                        </a>
                      )}
                    </div>
                  )}

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
