import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Download, ExternalLink, FileText, X } from 'lucide-react'
import useCoarsePointer from '../../hooks/useCoarsePointer'

export type CertificationItem = {
  title: string
  issuer: string
  category: string
  summary: string
  fileSrc: string
  completedOn: string
}

type CertificationModalProps = {
  open: boolean
  certification: CertificationItem | null
  onClose: () => void
}

const CertificationModal = ({
  open,
  certification,
  onClose,
}: CertificationModalProps) => {
  const [mounted, setMounted] = useState(false)
  const isCoarsePointer = useCoarsePointer()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!mounted || !certification) return null

  const extension = certification.fileSrc.split('.').pop()?.toLowerCase() ?? ''
  const isPdf = extension === 'pdf'
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(extension)
  const shouldUsePdfFallback = isCoarsePointer && isPdf

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
            className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl min-h-0 flex-col overflow-hidden rounded-[24px] border border-gray-800/80 bg-gradient-to-br from-[#040816] via-[#020617] to-emerald-950/10 text-white shadow-[0_32px_100px_-52px_rgba(0,0,0,0.9)] sm:max-h-[calc(100dvh-3rem)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#040816]/95 px-4 py-4 backdrop-blur-sm sm:px-5">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.26em] text-emerald-300">
                  Certification Document
                </p>
                <h2 className="mt-2 text-base font-semibold text-white sm:text-xl">
                  {certification.title}
                </h2>
                <p className="mt-1.5 text-xs text-white/65 sm:text-sm">
                  {certification.issuer} · {certification.category}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close certification modal"
                onClick={onClose}
                className="shrink-0 rounded-full border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="document-modal-scroll min-h-0 flex-1 overflow-y-scroll overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
                <div className="space-y-4">
                  <div className="rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-emerald-200">
                      <Award size={14} />
                      Issued Certificate
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-white">
                      {certification.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">
                      {certification.summary}
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                      Completed On
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/80">
                      <Award size={14} />
                      {certification.completedOn}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={certification.fileSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      Open full document
                      <ExternalLink size={15} />
                    </a>
                    <a
                      href={certification.fileSrc}
                      download
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Download
                      <Download size={15} />
                    </a>
                  </div>

                  {shouldUsePdfFallback && (
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-200">
                        <FileText size={22} />
                      </div>
                      <h4 className="mt-4 text-base font-semibold text-white">
                        Mobile PDF viewing fallback
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">
                        Some mobile browsers handle PDF files in their own viewer. Use
                        "Open full document" above for the best preview experience.
                      </p>
                    </div>
                  )}
                </div>

                <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#090f1a]">
                  {isPdf ? (
                    shouldUsePdfFallback ? (
                      <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/[0.06] text-white/70">
                          <FileText size={30} />
                        </div>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
                          The PDF is ready. Open it in the browser viewer for a full-screen
                          preview.
                        </p>
                      </div>
                    ) : (
                      <iframe
                        src={`${certification.fileSrc}#toolbar=0&navpanes=0`}
                        title={`${certification.title} preview`}
                        className="h-[60vh] min-h-[360px] w-full bg-white"
                      />
                    )
                  ) : isImage ? (
                    <img
                      src={certification.fileSrc}
                      alt={certification.title}
                      className="h-full w-full object-contain bg-white"
                    />
                  ) : (
                    <div className="flex h-full min-h-[280px] items-center justify-center px-6 py-10 text-center text-sm text-white/65">
                      Preview is not available for this document type.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default CertificationModal
