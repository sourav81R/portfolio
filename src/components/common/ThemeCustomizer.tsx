import { useEffect } from 'react'
import { Palette, Users } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const accentOptions = [
  { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'violet', label: 'Violet', color: '#8b5cf6' },
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
] as const

const ThemeCustomizer = () => {
  const recruiterMode = useAppStore((state) => state.recruiterMode)
  const toggleRecruiterMode = useAppStore((state) => state.toggleRecruiterMode)
  const accent = useAppStore((state) => state.accent)
  const setAccent = useAppStore((state) => state.setAccent)
  const themePanelOpen = useAppStore((state) => state.themePanelOpen)
  const setThemePanelOpen = useAppStore((state) => state.setThemePanelOpen)

  useEffect(() => {
    const root = document.documentElement
    const accentMap = {
      cyan: { solid: '#0ea5e9', soft: 'rgba(14, 165, 233, 0.16)' },
      emerald: { solid: '#10b981', soft: 'rgba(16, 185, 129, 0.18)' },
      violet: { solid: '#8b5cf6', soft: 'rgba(139, 92, 246, 0.18)' },
      amber: { solid: '#f59e0b', soft: 'rgba(245, 158, 11, 0.18)' },
    } as const

    root.style.setProperty('--accent', accentMap[accent].solid)
    root.style.setProperty('--accent-soft', accentMap[accent].soft)
  }, [accent])

  if (!themePanelOpen) {
    return (
      <button
        type="button"
        onClick={() => setThemePanelOpen(true)}
        className="fixed bottom-5 right-5 z-[90] inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg dark:bg-white dark:text-black"
        aria-label="Open customization panel"
      >
        <Palette size={18} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90] w-[min(92vw,20rem)] rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/95">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
            Theme Lab
          </p>
          <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
            Customize Experience
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setThemePanelOpen(false)}
          className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300"
        >
          Close
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Accent Theme</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {accentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAccent(option.value)}
              className={`rounded-full border px-3 py-2 text-sm ${
                accent === option.value
                  ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white'
                  : 'border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Users size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Recruiter Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prioritize hiring signals and key projects.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleRecruiterMode}
          className={`mt-4 w-full rounded-full px-4 py-3 text-sm font-semibold ${
            recruiterMode
              ? 'bg-indigo-600 text-white'
              : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
          }`}
        >
          {recruiterMode ? 'Recruiter Mode Enabled' : 'Enable Recruiter Mode'}
        </button>
      </div>
    </div>
  )
}

export default ThemeCustomizer
