import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCommandPalette } from '../../store/useCommandpalette'
import { useAppStore } from '../../store/useAppStore'

type Command = {
  label: string
  group: string
  action: () => void
  shortcut?: string[]
}

const CommandPalette = () => {
  const { open, setOpen } = useCommandPalette()
  const [query, setQuery] = useState('')
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
  }, [])

  const commands: Command[] = [
    { label: 'Go to Home', group: 'Navigate', action: () => go('#home'), shortcut: ['G', 'H'] },
    { label: 'Go to Highlights', group: 'Navigate', action: () => go('#highlights') },
    { label: 'Go to About', group: 'Navigate', action: () => go('#about'), shortcut: ['G', 'A'] },
    { label: 'Go to Developer Signals', group: 'Navigate', action: () => go('#signals') },
    { label: 'Go to AI Workbench', group: 'Navigate', action: () => go('#ai-workbench') },
    { label: 'Go to Testimonials', group: 'Navigate', action: () => go('#testimonials') },
    { label: 'Go to Projects', group: 'Navigate', action: () => go('#projects'), shortcut: ['G', 'P'] },
    { label: 'Go to Skills', group: 'Navigate', action: () => go('#skills') },
    { label: 'Go to Contact', group: 'Navigate', action: () => go('#contact'), shortcut: ['G', 'C'] },
    { label: 'Open Dashboard', group: 'Navigate', action: () => navigate('/dashboard') },
    {
      label: 'Toggle Dark Mode',
      group: 'Preferences',
      action: () => {
        const isDark = document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        recordClick('toggle-dark-mode')
      },
      shortcut: ['T'],
    },
    {
      label: 'Toggle Recruiter Mode',
      group: 'Preferences',
      action: () => {
        toggleRecruiterMode()
        recordClick('recruiter-mode')
      },
    },
    {
      label: 'Open Theme Panel',
      group: 'Preferences',
      action: () => {
        setThemePanelOpen(true)
        recordClick('theme-panel')
      },
    },
    {
      label: 'Open GitHub',
      group: 'Links',
      action: () => window.open('https://github.com/sourav81R', '_blank'),
    },
    {
      label: 'Open LinkedIn',
      group: 'Links',
      action: () =>
        window.open('https://linkedin.com/in/souravchowdhury-2003r', '_blank'),
    },
    {
      label: 'Open Resume',
      group: 'Links',
      action: () => window.open('/images/resume.pdf', '_blank'),
      shortcut: ['R'],
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
    },
    {
      label: 'Open Case Study: ResumeIQ',
      group: 'Case Studies',
      action: () => navigate('/case-studies/resumeiq'),
    },
    {
      label: 'Open Case Study: Foodooza',
      group: 'Case Studies',
      action: () => navigate('/case-studies/foodooza'),
    },
    {
      label: 'Open Case Study: PollRoom',
      group: 'Case Studies',
      action: () => navigate('/case-studies/pollroom'),
    },
    {
      label: 'Open Case Study: EstatePerks',
      group: 'Case Studies',
      action: () => navigate('/case-studies/estateperks'),
    },
    {
      label: 'Copy Email Address',
      group: 'Links',
      action: () => {
        navigator.clipboard.writeText('souravchowdhury0203@gmail.com')
      },
    },
  ]

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

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
    setTimeout(action, 80)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 shadow-lg font-mono max-h-[85vh] overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-300 dark:border-gray-800">
          <Search size={16} className="text-gray-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            className="w-full bg-transparent outline-none text-gray-900 dark:text-white text-sm"
          />
        </div>

        {/* Commands */}
        <div className="max-h-[65vh] overflow-y-auto">
          {Object.entries(grouped).map(([group, groupCommands]) => (
            <div key={group} className="py-1">
              <p className="px-4 pt-3 text-[11px] uppercase tracking-[0.22em] text-gray-400">
                {group}
              </p>
              <ul>
                {groupCommands.map((cmd, i) => (
                  <li
                    key={`${group}-${i}`}
                    onClick={() => runCommand(cmd.action)}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm cursor-pointer
                               text-gray-700 dark:text-gray-300
                               hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    <span>{cmd.label}</span>
                    {cmd.shortcut && (
                      <span className="flex items-center gap-1">
                        {cmd.shortcut.map((key) => (
                          <kbd
                            key={key}
                            className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500 dark:border-white/20 dark:bg-white/10 dark:text-gray-300"
                          >
                            {key}
                          </kbd>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
