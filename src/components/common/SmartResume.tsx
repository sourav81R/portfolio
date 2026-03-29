import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  open: boolean
  onClose: () => void
}

const lines = [
  '$ preparing resume...',
  '$ checking latest version...',
  '[ok] resume.pdf ready',
]

const SmartResume = ({ open, onClose }: Props) => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!open) return

    setStep(0)
    const timers = lines.map((_, i) =>
      setTimeout(() => setStep(i + 1), i * 200)
    )

    const downloadTimer = setTimeout(() => {
      const link = document.createElement('a')
      link.href = '/images/resume.pdf'
      link.download = 'Sourav_Chowdhury_Resume.pdf'
      link.click()
      onClose()
    }, lines.length * 200 + 500)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(downloadTimer)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-950 p-4 font-mono text-xs sm:p-6 sm:text-sm"
          >
            <div className="mb-4 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>

            <div className="space-y-2">
              {lines.slice(0, step).map((line, i) => (
                <p
                  key={i}
                  className={line.startsWith('[ok]') ? 'text-green-500' : 'text-gray-300'}
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SmartResume
