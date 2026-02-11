import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

type Command = {
  label: string
  action: () => void
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const commands: Command[] = [
    { label: 'Go to Home', action: () => go('#home') },
    { label: 'Go to About', action: () => go('#about') },
    { label: 'Go to Projects', action: () => go('#projects') },
    { label: 'Go to Skills', action: () => go('#skills') },
    { label: 'Go to Contact', action: () => go('#contact') },
    {
      label: 'Toggle Dark Mode',
      action: () => document.documentElement.classList.toggle('dark'),
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
      action: () => window.open('/resume.pdf', '_blank'),
    },
    {
      label: 'Download Resume',
      action: () => {
        const link = document.createElement('a')
        link.href = '/resume.pdf'
        link.download = 'Sourav_Chowdhury_Resume.pdf'
        link.click()
      },
    },
  ]

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  function go(id: string) {
    setOpen(false)
    setTimeout(() => {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
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
              onClick={cmd.action}
              className="px-4 py-3 text-sm cursor-pointer
                         text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              {cmd.label}
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
