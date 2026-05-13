import { useState } from 'react'
import { Award, Calendar, CheckCircle, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import CertificationModal, {
  type CertificationItem,
} from '../common/CertificationModal'
import { getSectionRevealProps } from '../../lib/motion'

const resolvePublicAsset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

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
]

const Certifications = () => {
  const [activeCertification, setActiveCertification] =
    useState<CertificationItem | null>(null)
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)

  return (
    <>
      <motion.div
        {...sectionRevealProps}
        className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
      >
        <AnimatedBorder>
          <div className="mx-auto max-w-5xl p-4 font-mono sm:p-6 md:p-10">
            <h2 className="mb-10 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:mb-14 sm:text-3xl md:text-4xl">
              Certifications
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {certifications.map((cert, index) => {
                const extension = cert.fileSrc.split('.').pop()?.toLowerCase()
                const actionLabel =
                  extension === 'pdf' ? 'View Document' : 'View Certificate'

                return (
                  <motion.button
                    key={cert.title}
                    type="button"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    whileHover={{ scale: reduceMotion ? 1 : 1.015, y: reduceMotion ? 0 : -2 }}
                    onClick={() => setActiveCertification(cert)}
                    className="group relative rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left shadow-sm transition hover:border-green-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400/70 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-green-500 sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-green-500/10 p-3 text-green-500">
                        <Award size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {cert.title}
                            </h3>
                            <p className="mt-1 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle size={14} className="text-green-500" />
                              {cert.issuer}
                            </p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-700 dark:text-sky-300">
                            <Calendar size={12} />
                            {cert.completedOn}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {cert.summary}
                        </p>

                        <div className="mt-5">
                          <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_35px_-22px_rgba(16,185,129,0.75)] transition group-hover:bg-emerald-400 dark:text-slate-950">
                            {actionLabel}
                            <ExternalLink size={15} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
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
