import { useRef, useState } from 'react'
import clsx from 'clsx'
import {
  Award,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileBadge2,
  Sparkles,
} from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import CertificationModal, {
  type CertificationItem,
} from '../common/CertificationModal'
import { getSectionRevealProps } from '../../lib/motion'
import { resolvePublicAsset } from '../../lib/publicAsset'

const certifications: CertificationItem[] = [
  {
    title: 'AWS Academy Data Engineering',
    issuer: 'AWS Academy',
    category: 'Cloud & Data Engineering',
    summary:
      'AWS Academy graduate certificate for the Data Engineering learning track and foundational cloud/data workflow training.',
    fileSrc: resolvePublicAsset('/images/certifications/aws-academy-data-engineering.pdf'),
    completedOn: '13 Feb 2024',
  },
  {
    title: 'AI-ML Virtual Internship / Tech Camp',
    issuer: 'EduSkills',
    category: 'AI / ML Program',
    summary:
      'EduSkills certificate document for the tech camp and virtual internship learning experience.',
    fileSrc: resolvePublicAsset('/images/certifications/eduskills-tech-camp.pdf'),
    completedOn: '26 Feb 2025',
  },
  {
    title: 'Full-Stack (MERN) Training & Internship',
    issuer: 'Euphoria GenX',
    category: 'Internship Certificate',
    summary:
      'Internship completion certificate for the Euphoria GenX program and the PetPooja/Food Delivery web app work.',
    fileSrc: resolvePublicAsset(
      '/images/certifications/euphoria-genx-internship-certificate.jpg'
    ),
    completedOn: '18 Feb 2026',
  },
  {
    title: 'Digital Literacy Certificate',
    issuer: 'Capgemini',
    category: 'Professional Development',
    summary:
      'Capgemini certificate document covering digital literacy and foundational professional skills.',
    fileSrc: resolvePublicAsset('/images/certifications/capgemini-digital-literacy.pdf'),
    completedOn: 'Nov 2022',
  },
] as const

const Certifications = () => {
  const [activeCertification, setActiveCertification] =
    useState<CertificationItem | null>(null)
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
    <>
      <motion.div
        {...sectionRevealProps}
        className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
      >
        <AnimatedBorder>
          <div className="mx-auto max-w-5xl p-4 font-mono sm:p-6 md:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] uppercase tracking-[0.34em] text-fuchsia-500">
                Verified Learning
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Certifications
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                A structured view of certificates, internships, and learning milestones
                that validate hands-on progress across cloud, AI, and full-stack work.
              </p>
            </div>

            <div ref={timelineRef} className="relative mx-auto mt-10 max-w-[52rem]">
              <div className="absolute bottom-0 left-5 top-0 w-px bg-gray-200 dark:bg-gray-800 md:left-1/2 md:-translate-x-1/2" />
              <motion.div
                className="absolute bottom-0 left-5 top-0 w-px bg-emerald-400 md:left-1/2 md:-translate-x-1/2"
                style={{
                  scaleY: reduceMotion ? 1 : smoothProgress,
                  transformOrigin: 'top',
                }}
              />

              <div className="space-y-5 md:space-y-8">
                {certifications.map((cert, index) => {
                  const alignsLeft = index % 2 === 0
                  const extension = cert.fileSrc.split('.').pop()?.toLowerCase()
                  const actionLabel =
                    extension === 'pdf' ? 'View Document' : 'View Certificate'

                  return (
                    <motion.article
                      key={cert.title}
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, x: alignsLeft ? -28 : 28, y: 20 }
                      }
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className={clsx(
                        'relative flex',
                        alignsLeft ? 'md:justify-start' : 'md:justify-end'
                      )}
                    >
                      <div className="absolute left-5 top-8 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-4 border-white bg-emerald-500 shadow-[0_0_0_8px_rgba(16,185,129,0.10)] dark:border-[#020617] md:left-1/2" />

                      <div
                        className={clsx(
                          'ml-10 w-full md:ml-0 md:w-[calc(50%-2.25rem)]',
                          alignsLeft ? 'md:mr-auto' : 'md:ml-auto'
                        )}
                      >
                        <motion.button
                          type="button"
                          whileHover={
                            reduceMotion ? undefined : { y: -4, scale: 1.01 }
                          }
                          onClick={() => setActiveCertification(cert)}
                          className="group relative w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white/80 p-4 text-left shadow-sm backdrop-blur-sm transition duration-300 hover:border-emerald-400/40 hover:shadow-[0_18px_42px_-34px_rgba(16,185,129,0.42)] focus:outline-none focus:ring-2 focus:ring-emerald-400/70 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-emerald-500/35 sm:p-[18px]"
                        >
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="max-w-xl">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
                                  <Sparkles size={12} />
                                  {cert.category}
                                </span>
                              </div>

                              <h3 className="mt-3 flex items-start gap-3 text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                <span className="mt-0.5 inline-flex rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                  <Award size={16} />
                                </span>
                                <span>{cert.title}</span>
                              </h3>

                              <p className="mt-2.5 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                                <CheckCircle size={15} />
                                {cert.issuer}
                              </p>

                              <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-400">
                                {cert.summary}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:items-end">
                              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                <Calendar size={13} />
                                {cert.completedOn}
                              </span>
                              <span className="inline-flex rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300">
                                Certified
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-center">
                            <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_14px_35px_-22px_rgba(16,185,129,0.75)] transition group-hover:bg-emerald-400">
                              <FileBadge2 size={14} />
                              {actionLabel}
                              <ExternalLink size={14} />
                            </span>
                          </div>
                        </motion.button>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </div>
          </div>
        </AnimatedBorder>
      </motion.div>

      <CertificationModal
        open={activeCertification !== null}
        certification={activeCertification}
        onClose={() => setActiveCertification(null)}
      />
    </>
  )
}

export default Certifications
