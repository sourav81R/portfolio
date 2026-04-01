import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setDismissed(false)
    }

    const onInstallRequest = () => {
      void installApp()
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('portfolio-install-pwa', onInstallRequest)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('portfolio-install-pwa', onInstallRequest)
    }
  }, [deferredPrompt])

  const installApp = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  if (!deferredPrompt || dismissed) {
    return null
  }

  return (
    <div className="fixed bottom-5 left-5 z-[90] w-[min(92vw,22rem)] rounded-2xl border border-white/15 bg-slate-950/85 p-4 text-white shadow-2xl backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 rounded-full p-1 text-white/60 transition hover:text-white"
        aria-label="Dismiss install prompt"
      >
        <X size={16} />
      </button>
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Install Portfolio</p>
      <h3 className="mt-2 text-lg font-semibold">Save this as an app</h3>
      <p className="mt-2 text-sm text-white/70">
        Install the portfolio for faster repeat visits, fullscreen mode, and offline support.
      </p>
      <button
        type="button"
        onClick={() => void installApp()}
        className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, var(--accent), #6366f1)',
        }}
      >
        <Download size={16} />
        Install app
      </button>
    </div>
  )
}

export default PwaInstallPrompt
