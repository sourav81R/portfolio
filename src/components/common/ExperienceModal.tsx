import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react'
import useCoarsePointer from '../../hooks/useCoarsePointer'
import { useScrollLock } from '../../hooks/useScrollLock'

export type ExperienceCredential = {
  label: string
  title: string
  summary: string
  fileSrc: string
  previewImageSrc?: string
  previewImageAlt?: string
  credentialId?: string
  issuedOn?: string
  projectLabel?: string
  projectHref?: string
  verifyLabel?: string
  verifyHref?: string
}

export type ExperienceEntry = {
  role: string
  company: string
  period: string
  location: string
  summary: string
  description: string[]
  metrics: string[]
  tech: string[]
  badge: string
  credential: ExperienceCredential
}

type ExperienceModalView = 'details' | 'certificate'

type ExperienceModalProps = {
  open: boolean
  view: ExperienceModalView
  experience: ExperienceEntry | null
  onClose: () => void
}

const ExperienceModal = ({
  open,
  view,
  experience,
  onClose,
}: ExperienceModalProps) => {
  const [mounted, setMounted] = useState(false)
  const isCoarsePointer = useCoarsePointer()

  useScrollLock(open)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!mounted || !experience) return null

  const { credential } = experience
  const previewSrc = credential.previewImageSrc ?? credential.fileSrc
  const isPdfCertificate = credential.fileSrc.toLowerCase().endsWith('.pdf')
  const shouldUseFallbackPreview = isCoarsePointer && isPdfCertificate

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-end justify-center bg-black/80 px-3 py-3 sm:items-center sm:px-6 sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl min-h-0 flex-col overflow-hidden rounded-[24px] border border-gray-800/80 bg-gradient-to-br from-[#040816] via-[#020617] to-emerald-950/10 text-white shadow-[0_32px_100px_-52px_rgba(0,0,0,0.9)] sm:max-h-[calc(100dvh-3rem)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#040816]/95 px-4 py-4 backdrop-blur-sm sm:px-5">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.26em] text-emerald-300">
                  {view === 'details' ? 'Internship Details' : 'Internship Certificate'}
                </p>
                <h2 className="mt-2 text-base font-semibold text-white sm:text-xl">
                  {experience.role}
                </h2>
                <p className="mt-1.5 text-xs text-white/65 sm:text-sm">
                  {experience.company} · {experience.period}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close experience modal"
                onClick={onClose}
                className="shrink-0 rounded-full border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="experience-modal-scroll min-h-0 flex-1 overflow-y-scroll overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
              {view === 'details' ? (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
                  <div className="space-y-4">
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm leading-relaxed text-white/75">
                        {experience.summary}
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                        What I Worked On
                      </h3>
                      <ul className="mt-3 space-y-2.5">
                        {experience.description.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm leading-relaxed text-white/78"
                          >
                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                        Stack Used
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {experience.tech.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex flex-wrap gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/75">
                          <Calendar size={14} />
                          {experience.period}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/75">
                          <MapPin size={14} />
                          {experience.location}
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                          Timeline Status
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {experience.badge}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                        Key Outcomes
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {experience.metrics.map((metric) => (
                          <span
                            key={metric}
                            className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-emerald-200">
                        <ShieldCheck size={14} />
                        {credential.label}
                      </p>
                      <h3 className="mt-3 text-base font-semibold text-white sm:text-lg">
                        {credential.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        {credential.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                          Back to timeline
                        </button>
                        <a
                          href={credential.fileSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                          Open certificate
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(300px,1.08fr)]">
                  <div className="space-y-4">
                    <div className="rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-emerald-200">
                        <ShieldCheck size={14} />
                        Verified Proof
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-white">
                        {credential.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">
                        {credential.summary}
                      </p>
                    </div>

                    {(credential.credentialId || credential.issuedOn) && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {credential.credentialId && (
                          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                              Credential ID
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {credential.credentialId}
                            </p>
                          </div>
                        )}
                        {credential.issuedOn && (
                          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                              Issued On
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {credential.issuedOn}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={credential.fileSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                      >
                        Open full certificate
                        <ExternalLink size={15} />
                      </a>
                      <a
                        href={credential.fileSrc}
                        download
                        className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                      >
                        Download
                        <Download size={15} />
                      </a>
                      {credential.verifyHref && credential.verifyLabel && (
                        <a
                          href={credential.verifyHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/15"
                        >
                          {credential.verifyLabel}
                          <ExternalLink size={15} />
                        </a>
                      )}
                      {credential.projectHref && credential.projectLabel && (
                        <Link
                          to={credential.projectHref}
                          onClick={onClose}
                          className="inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/15"
                        >
                          {credential.projectLabel}
                        </Link>
                      )}
                    </div>

                    {shouldUseFallbackPreview && (
                      <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-200">
                          <FileText size={22} />
                        </div>
                        <h4 className="mt-4 text-base font-semibold text-white">
                          Mobile PDF viewing fallback
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-white/70">
                          Some mobile browsers handle PDF previews in their own viewer. Use
                          "Open full certificate" above for the most reliable mobile
                          experience.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#090f1a]">
                    {isPdfCertificate ? (
                      shouldUseFallbackPreview ? (
                        <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
                          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/[0.06] text-white/70">
                            <FileText size={30} />
                          </div>
                          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
                            The certificate PDF is ready. Open it in the browser viewer for a
                            full-screen mobile preview.
                          </p>
                        </div>
                      ) : (
                        <iframe
                          src={`${credential.fileSrc}#toolbar=0&navpanes=0`}
                          title={`${experience.company} certificate preview`}
                          className="h-[56vh] min-h-[340px] w-full bg-white"
                        />
                      )
                    ) : (
                      <img
                        src={previewSrc}
                        alt={
                          credential.previewImageAlt ??
                          `${experience.company} internship certificate`
                        }
                        className="h-full w-full object-contain bg-white"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#040816]/95 px-4 py-3 backdrop-blur-sm sm:px-5">
              <p className="text-xs text-white/55">
                Scroll for more details
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Back to experience
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ExperienceModal
