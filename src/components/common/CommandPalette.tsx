import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCommandPalette } from '../../store/useCommandpalette'

type Command = {
  label: string
  action: () => void
  shortcut?: string[]
}

const CommandPalette = () => {
  const { open, setOpen } = useCommandPalette()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

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
    { label: 'Go to Home', action: () => go('#home'), shortcut: ['G', 'H'] },
    { label: 'Go to Highlights', action: () => go('#highlights') },
    { label: 'Go to About', action: () => go('#about'), shortcut: ['G', 'A'] },
    { label: 'Go to Testimonials', action: () => go('#testimonials') },
    { label: 'Go to Projects', action: () => go('#projects'), shortcut: ['G', 'P'] },
    { label: 'Go to Skills', action: () => go('#skills') },
    { label: 'Go to Contact', action: () => go('#contact'), shortcut: ['G', 'C'] },
    {
      label: 'Toggle Dark Mode',
      action: () => {
        const isDark = document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
      },
      shortcut: ['T'],
    },
    {
      label: 'Open GitHub',
      action: () => window.open('https://github.com/sourav81R', '_blank'),
    },
    {
      label: 'Open LinkedIn',
      action: () =>
        window.open('https://linkedin.com/in/souravchowdhury-2003r', '_blank'),
    },
    {
      label: 'Open Resume',
      action: () => window.open('/images/resume.pdf', '_blank'),
      shortcut: ['R'],
    },
    {
      label: 'Download Resume',
      action: () => {
        const link = document.createElement('a')
        link.href = '/images/resume.pdf'
        link.download = 'Sourav_Chowdhury_Resume.pdf'
        link.click()
      },
    },
    {
      label: 'Open Case Study: ResumeIQ',
      action: () => navigate('/case-studies/resumeiq'),
    },
    {
      label: 'Open Case Study: PollRoom',
      action: () => navigate('/case-studies/pollroom'),
    },
    {
      label: 'Open Case Study: EstatePerks',
      action: () => navigate('/case-studies/estateperks'),
    },
    {
      label: 'Copy Email Address',
      action: () => {
        navigator.clipboard.writeText('souravchowdhury0203@gmail.com')
      },
    },
  ]

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

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
        <ul className="max-h-[65vh] overflow-y-auto">
          {filtered.map((cmd, i) => (
            <li
              key={i}
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

          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-500">
              No results
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default CommandPalette
