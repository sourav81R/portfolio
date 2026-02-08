import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  open: boolean
  onClose: () => void
}

const lines = [
  '$ preparing resume...',
  '$ checking latest version...',
  '✔ resume.pdf ready',
]

const SmartResume = ({ open, onClose }: Props) => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!open) return

    setStep(0)
    const timers = lines.map((_, i) =>
      setTimeout(() => setStep(i + 1), i * 200)
    )

    // auto download after animation
    const downloadTimer = setTimeout(() => {
      const link = document.createElement('a')
      link.href = '/resume.pdf'
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
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="
              w-full max-w-md
              rounded-xl
              bg-gray-950
              border border-gray-800
              p-6
              font-mono
              text-sm
            "
          >
            {/* Terminal header */}
            <div className="flex gap-2 mb-4">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            {/* Terminal output */}
            <div className="space-y-2">
              {lines.slice(0, step).map((line, i) => (
                <p
                  key={i}
                  className={
                    line.startsWith('✔')
                      ? 'text-green-500'
                      : 'text-gray-300'
                  }
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
