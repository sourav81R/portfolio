import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'

type ResumePreviewModalProps = {
  open: boolean
  onClose: () => void
  pdfUrl: string
}

const ResumePreviewModal = ({
  open,
  onClose,
  pdfUrl,
}: ResumePreviewModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!mounted) return null

  const downloadResume = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'Sourav_Chowdhury_Resume.pdf'
    link.click()
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-3 py-4 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.24 }}
            className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-green-600 dark:text-green-400">
                  Resume Preview
                </p>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                  Sourav Chowdhury Resume
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadResume}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 dark:border-gray-700 dark:text-gray-200 dark:hover:text-green-400"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  type="button"
                  aria-label="Close resume preview"
                  onClick={onClose}
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 p-2 dark:bg-black sm:p-3">
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                title="Sourav Chowdhury resume preview"
                className="h-full w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ResumePreviewModal
