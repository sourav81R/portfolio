import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Check,
  Copy,
  FileText,
  Github,
  LayoutDashboard,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useSmoothScroll } from '../../providers/SmoothScrollProvider'
import { getSectionRevealProps } from '../../lib/motion'

const EMAIL = 'souravchowdhury0203@gmail.com'
const PHONE_DISPLAY = '+91 62946 60381'
const PHONE_HREF = 'tel:+916294660381'
const RESUME_URL = '/images/resume.pdf'
const LOCATION = 'Kolkata, India'

/** Left nav column - the sections a visitor most often jumps to. */
const quickLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Second nav column. The reference layout puts "Company" here; a personal
 * portfolio has no careers or legal pages, so this maps onto the remaining
 * real sections instead of shipping dead links.
 */
const moreLinks = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'github', label: 'GitHub Activity' },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/sourav81R', icon: Github },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/souravchowdhury-2003r',
    icon: Linkedin,
  },
  { label: 'Email', href: `mailto:${EMAIL}`, icon: Mail },
]

const Footer = () => {
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const recordClick = useAppStore((state) => state.recordClick)
  const { scrollTo } = useSmoothScroll()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      recordClick('footer-copy-email')
    } catch {
      // Clipboard blocked (insecure context or denied permission). The address
      // stays visible as text, so there is nothing useful to surface here.
    }
  }

  const goToSection = (id: string) => {
    recordClick(`footer-nav-${id}`)
    scrollTo(`#${id}`)
  }

  /** Shared renderer for the two link columns. */
  const renderNavColumn = (
    heading: string,
    links: { id: string; label: string }[]
  ) => (
    <nav aria-label={heading}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
        {heading}
      </h2>
      <ul className="mt-5 space-y-3 text-sm sm:text-base">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              onClick={(event) => {
                // Let modified clicks (open in new tab, etc.) behave natively.
                if (event.metaKey || event.ctrlKey || event.shiftKey) return
                event.preventDefault()
                goToSection(link.id)
              }}
              className="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/70 to-cyan-100/80 dark:from-gray-950 dark:via-emerald-950/25 dark:to-gray-950">
      {/* Hairline that ties the footer to the emerald section dividers above. */}
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
        aria-hidden="true"
      />
      <div className="grain-overlay absolute inset-0" aria-hidden="true" />

      <motion.div
        {...sectionRevealProps}
        className="relative mx-auto max-w-6xl px-6 py-14 font-mono sm:px-8 sm:py-16"
      >
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* ---------- Brand ---------- */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-extrabold italic tracking-tight text-emerald-600 dark:text-emerald-400">
              Sourav Chowdhury
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Building fast, accessible web apps - one commit at a time.
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  /*
                   * rel="me" marks these as profiles belonging to the site's
                   * owner. It is the signal Google uses to tie the GitHub and
                   * LinkedIn identities to this person, which is what
                   * separates this Sourav Chowdhury from others sharing the
                   * name on a bare-name query.
                   */
                  rel={
                    social.href.startsWith('http')
                      ? 'me noopener noreferrer'
                      : 'me'
                  }
                  aria-label={social.label}
                  title={social.label}
                  onClick={() =>
                    recordClick(`footer-social-${social.label.toLowerCase()}`)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:text-emerald-600 hover:shadow-md dark:bg-gray-900 dark:text-gray-300 dark:hover:text-emerald-400"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ---------- Quick Links ---------- */}
          {renderNavColumn('Quick Links', quickLinks)}

          {/* ---------- More sections ---------- */}
          {renderNavColumn('More', moreLinks)}

          {/* ---------- Contact ---------- */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              Contact Us
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm sm:text-base">
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <MapPin size={17} className="shrink-0 text-emerald-500" />
                {LOCATION}
              </li>
              <li>
                <a
                  href={PHONE_HREF}
                  onClick={() => recordClick('footer-phone')}
                  className="flex items-center gap-3 text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  <Phone size={17} className="shrink-0 text-emerald-500" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                {/*
                 * Click copies rather than opening a mail client: on a desktop
                 * with no mail app configured a mailto: does nothing visible,
                 * which reads as a broken link.
                 */}
                <button
                  type="button"
                  onClick={copyEmail}
                  title="Copy email address"
                  aria-label={
                    copied ? 'Email address copied' : `Copy email address ${EMAIL}`
                  }
                  className="group flex max-w-full items-center gap-3 text-left text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  <Mail size={17} className="shrink-0 text-emerald-500" />
                  <span className="truncate">{EMAIL}</span>
                  {copied ? (
                    <Check size={14} className="shrink-0 text-emerald-500" />
                  ) : (
                    <Copy
                      size={14}
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            </ul>
          </div>

          {/* ---------- Resume / Dashboard ---------- */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              Get Started
            </h2>

            <div className="mt-5 space-y-3">
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordClick('footer-resume')}
                className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-white px-4 py-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md dark:border-emerald-500/25 dark:bg-gray-900"
              >
                <FileText size={22} className="shrink-0 text-emerald-500" />
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
                    Download my
                  </span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    Resume (PDF)
                  </span>
                </span>
              </a>

              <Link
                to="/dashboard"
                onClick={() => recordClick('footer-dashboard')}
                className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-white px-4 py-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md dark:border-emerald-500/25 dark:bg-gray-900"
              >
                <LayoutDashboard size={22} className="shrink-0 text-emerald-500" />
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
                    Explore the
                  </span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    Dashboard
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ---------- Copyright ---------- */}
        <div className="mt-12 border-t border-gray-300/60 pt-6 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Sourav Chowdhury. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
