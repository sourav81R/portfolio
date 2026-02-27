const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const Footer = () => {
  return (
    <footer className="px-4 sm:px-6 pb-10 pt-6">
      <div className="max-w-6xl mx-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 sm:p-6 font-mono">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-900 dark:text-white font-semibold">Sourav Chowdhury</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Entry-level software developer focused on React, TypeScript, and API-driven products.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-600 dark:text-gray-400">
          <p>Press Ctrl/Cmd + K for quick actions.</p>
          <div className="flex items-center gap-3">
            <a href="mailto:souravchowdhury0203@gmail.com" className="hover:text-green-600 dark:hover:text-green-400">
              Email
            </a>
            <a href="/images/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400">
              Resume
            </a>
            <a href="https://github.com/sourav81R" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
