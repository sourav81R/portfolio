import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Download,
  Github,
  LayoutDashboard,
  Linkedin,
  Mail,
  MoonStar,
  Palette,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getBestSearchScore } from '../../lib/fuzzySearch'
import { useCommandPalette } from '../../store/useCommandpalette'
import { useAppStore } from '../../store/useAppStore'

type Command = {
  label: string
  group: string
  action: () => void
  shortcut?: string[]
  keywords?: string[]
  icon: LucideIcon
}

const CommandPalette = () => {
  const { open, setOpen } = useCommandPalette()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()
  const toggleRecruiterMode = useAppStore((state) => state.toggleRecruiterMode)
  const setThemePanelOpen = useAppStore((state) => state.setThemePanelOpen)
  const recordClick = useAppStore((state) => state.recordClick)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!useCommandPalette.getState().open)
      }
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setOpen])

  const commands: Command[] = [
    { label: 'Go to Home', group: 'Navigate', action: () => go('#home'), shortcut: ['G', 'H'], keywords: ['hero', 'top'], icon: Search },
    { label: 'Go to Highlights', group: 'Navigate', action: () => go('#highlights'), keywords: ['recruiter'], icon: Users },
    { label: 'Go to About', group: 'Navigate', action: () => go('#about'), shortcut: ['G', 'A'], icon: Search },
    { label: 'Go to Developer Signals', group: 'Navigate', action: () => go('#signals'), keywords: ['github', 'leetcode', 'blog'], icon: Sparkles },
    { label: 'Go to AI Workbench', group: 'Navigate', action: () => go('#ai-workbench'), keywords: ['ai lab', 'resume analyzer'], icon: Sparkles },
    { label: 'Go to Testimonials', group: 'Navigate', action: () => go('#testimonials'), icon: Search },
    { label: 'Go to Projects', group: 'Navigate', action: () => go('#projects'), shortcut: ['G', 'P'], keywords: ['work', 'portfolio'], icon: Search },
    { label: 'Go to Skills', group: 'Navigate', action: () => go('#skills'), icon: Search },
    { label: 'Go to Contact', group: 'Navigate', action: () => go('#contact'), shortcut: ['G', 'C'], icon: Mail },
    { label: 'Open Dashboard', group: 'Navigate', action: () => navigate('/dashboard'), keywords: ['analytics'], icon: LayoutDashboard },
    {
      label: 'Toggle Dark Mode',
      group: 'Preferences',
      action: () => {
        const isDark = document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        recordClick('toggle-dark-mode')
      },
      shortcut: ['T'],
      keywords: ['theme', 'light', 'dark'],
      icon: MoonStar,
    },
    {
      label: 'Toggle Recruiter Mode',
      group: 'Preferences',
      action: () => {
        toggleRecruiterMode()
        recordClick('recruiter-mode')
      },
      keywords: ['hiring', 'recruiter'],
      icon: Users,
    },
    {
      label: 'Open Theme Panel',
      group: 'Preferences',
      action: () => {
        setThemePanelOpen(true)
        recordClick('theme-panel')
      },
      keywords: ['accent', 'color', 'customize'],
      icon: Palette,
    },
    {
      label: 'Install Portfolio App',
      group: 'Preferences',
      action: () => {
        window.dispatchEvent(new Event('portfolio-install-pwa'))
      },
      keywords: ['pwa', 'install', 'app'],
      icon: Download,
    },
    {
      label: 'Open GitHub',
      group: 'Links',
      action: () => window.open('https://github.com/sourav81R', '_blank'),
      icon: Github,
    },
    {
      label: 'Open LinkedIn',
      group: 'Links',
      action: () => window.open('https://linkedin.com/in/souravchowdhury-2003r', '_blank'),
      icon: Linkedin,
    },
    {
      label: 'Open Resume',
      group: 'Links',
      action: () => window.open('/images/resume.pdf', '_blank'),
      shortcut: ['R'],
      icon: Download,
    },
    {
      label: 'Download Resume',
      group: 'Links',
      action: () => {
        const link = document.createElement('a')
        link.href = '/images/resume.pdf'
        link.download = 'Sourav_Chowdhury_Resume.pdf'
        link.click()
      },
      icon: Download,
    },
    {
      label: 'Copy Email Address',
      group: 'Links',
      action: () => {
        void navigator.clipboard.writeText('souravchowdhury0203@gmail.com')
      },
      icon: Mail,
    },
    {
      label: 'Open Case Study: ResumeIQ',
      group: 'Case Studies',
      action: () => navigate('/case-studies/resumeiq'),
      keywords: ['ats', 'ai'],
      icon: Sparkles,
    },
    {
      label: 'Open Case Study: Foodooza',
      group: 'Case Studies',
      action: () => navigate('/case-studies/foodooza'),
      keywords: ['food', 'delivery', 'realtime'],
      icon: Sparkles,
    },
    {
      label: 'Open Case Study: PollRoom',
      group: 'Case Studies',
      action: () => navigate('/case-studies/pollroom'),
      keywords: ['poll', 'socket', 'realtime'],
      icon: Sparkles,
    },
    {
      label: 'Open Case Study: EstatePerks',
      group: 'Case Studies',
      action: () => navigate('/case-studies/estateperks'),
      keywords: ['mobile', 'react native'],
      icon: Sparkles,
    },
  ]

  const filtered = useMemo(() => {
    if (!query.trim()) return commands

    return commands
      .map((command) => {
        const score = getBestSearchScore(query, [
          command.label,
          command.group,
          ...(command.keywords ?? []),
        ])

        return { command, score }
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .map((entry) => entry.command)
  }, [commands, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, open])

  useEffect(() => {
    if (!open) return

    const onPaletteKeyDown = (event: KeyboardEvent) => {
      if (filtered.length === 0) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((current) => (current + 1) % filtered.length)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((current) => (current - 1 + filtered.length) % filtered.length)
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        runCommand(filtered[activeIndex].action)
      }
    }

    window.addEventListener('keydown', onPaletteKeyDown)
    return () => window.removeEventListener('keydown', onPaletteKeyDown)
  }, [activeIndex, filtered, open])

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, command) => {
    acc[command.group] ??= []
    acc[command.group].push(command)
    return acc
  }, {})

  function go(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  function runCommand(action: () => void) {
    setOpen(false)
    setQuery('')
    window.setTimeout(action, 80)
  }

  if (!open) return null

  let visualIndex = -1

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 sm:px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/92 font-mono shadow-[0_30px_120px_-40px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-cyan-300">
              <Search size={18} />
            </span>
            <div className="flex-1">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search navigation, recruiter tools, install app, resume..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/35">
                {filtered.length} quick actions
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-2 py-2">
          {Object.entries(grouped).map(([group, groupCommands]) => (
            <div key={group} className="py-2">
              <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.24em] text-white/35">
                {group}
              </p>
              <ul className="space-y-1">
                {groupCommands.map((cmd) => {
                  visualIndex += 1
                  const isActive = visualIndex === activeIndex
                  const Icon = cmd.icon

                  return (
                    <li
                      key={`${group}-${cmd.label}`}
                      onClick={() => runCommand(cmd.action)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/75 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
                          style={{
                            background: isActive ? 'var(--accent-soft)' : 'rgba(255,255,255,0.04)',
                            color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.75)',
                          }}
                        >
                          <Icon size={17} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{cmd.label}</p>
                          <p className="truncate text-[11px] uppercase tracking-[0.18em] text-white/35">
                            {cmd.group}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cmd.shortcut && (
                          <span className="flex items-center gap-1">
                            {cmd.shortcut.map((key) => (
                              <kbd
                                key={key}
                                className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-white/60"
                              >
                                {key}
                              </kbd>
                            ))}
                          </span>
                        )}
                        <ArrowRight size={14} className="text-white/30" />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-white/50">
              No commands matched that search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
