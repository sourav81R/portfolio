import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Terminal as TerminalIcon,
} from 'lucide-react'
import DotGrid from '../common/DotGrid'
import MagneticButton from '../common/MagneticButton'
import WordCycle from '../common/WordCycle'
import { getSectionRevealProps } from '../../lib/motion'
import { useCommandPalette } from '../../store/useCommandpalette'
import { useAppStore } from '../../store/useAppStore'

const ResumePreviewModal = lazy(() => import('../common/ResumePreviewModal'))

type Line = {
  prompt: string
  text: string
}

type SectionCommand = {
  id: string
  label: string
  commands: readonly string[]
}

const terminalLines: Line[] = [
  { prompt: '>> ~', text: 'npx intro --profile sourav' },
  { prompt: '>> ~', text: 'Loading product-minded developer profile...' },
  { prompt: '>> ~', text: 'Role: Frontend + Full Stack Developer' },
  { prompt: '>> ~', text: 'Focus: React, TypeScript, APIs, and clean UX' },
  { prompt: '>> ~', text: 'Status: Open to interviews and collaborations' },
]

const terminalSequence: Line[] = [
  ...terminalLines,
  { prompt: '>> ~', text: 'Try: about | projects | contact' },
]

const TERMINAL_TYPING_SPEED = 34
const TERMINAL_LINE_PAUSE = 220

const sectionCommands: SectionCommand[] = [
  {
    id: 'about',
    label: 'About',
    commands: ['about', 'about section', 'go to about', 'go to about section'],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    commands: [
      'certification',
      'certifications',
      'certification section',
      'certifications section',
      'go to certification',
      'go to certifications',
      'go to certification section',
      'go to certifications section',
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    commands: [
      'contact',
      'contacts',
      'contact section',
      'contacts section',
      'go to contact',
      'go to contacts',
      'go to contact section',
      'go to contacts section',
    ],
  },
  {
    id: 'education',
    label: 'Education',
    commands: [
      'education',
      'education section',
      'go to education',
      'go to education section',
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    commands: [
      'experience',
      'experience section',
      'go to experience',
      'go to experience section',
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    commands: [
      'project',
      'projects',
      'project section',
      'projects section',
      'go to project',
      'go to projects',
      'go to project section',
      'go to projects section',
    ],
  },
  {
    id: 'github',
    label: 'GitHub',
    commands: [
      'github',
      'github section',
      'github activity',
      'contribution graph',
      'go to github',
      'go to github section',
      'go to github activity',
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    commands: [
      'skill',
      'skills',
      'skill section',
      'skills section',
      'go to skill',
      'go to skills',
      'go to skill section',
      'go to skills section',
    ],
  },
]

const headlineWords = [
  'frontend systems',
  'dashboard experiences',
  'API-led products',
  'case-study interfaces',
]

const quickCommands = ['about', 'projects', 'contact'] as const

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/sourav81R',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/souravchowdhury-2003r',
    icon: Linkedin,
  },
  {
    label: 'Email',
    href: 'mailto:souravchowdhury0203@gmail.com',
    icon: Mail,
  },
] as const

const BADGE_WORDS = [
  'COMPUTER SCIENCE ENGINEER',
  'FULL STACK DEVELOPER',
  'MERN STACK DEVELOPER',
]

const TypingBadge = () => {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (subIndex === BADGE_WORDS[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1000)
      return () => clearTimeout(timeout)
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % BADGE_WORDS.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, reverse ? 75 : 150)

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse])

  return (
    <span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap align-bottom sm:max-w-none">
      {BADGE_WORDS[index].substring(0, subIndex)}
      <motion.span
        className="ml-1 inline-block"
        animate={reduceMotion ? undefined : { opacity: [1, 0, 1] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        |
      </motion.span>
    </span>
  )
}

const Hero = () => {
  const { open } = useCommandPalette()
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const recordClick = useAppStore((state) => state.recordClick)
  const [showResumePreview, setShowResumePreview] = useState(false)
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const [typedTerminalLines, setTypedTerminalLines] = useState<Line[]>(() =>
    reduceMotion ? terminalSequence : []
  )
  const [activeTerminalLine, setActiveTerminalLine] = useState(
    reduceMotion ? -1 : 0
  )
  const [activeTerminalChar, setActiveTerminalChar] = useState(0)
  const [terminalInput, setTerminalInput] = useState('')
  const [isTerminalReady, setIsTerminalReady] = useState(reduceMotion)

  const startTerminalSequence = useCallback(() => {
    setTerminalInput('')

    if (reduceMotion) {
      setTypedTerminalLines(terminalSequence)
      setActiveTerminalLine(-1)
      setActiveTerminalChar(0)
      setIsTerminalReady(true)
      return
    }

    setTypedTerminalLines([])
    setActiveTerminalLine(0)
    setActiveTerminalChar(0)
    setIsTerminalReady(false)
  }, [reduceMotion])

  useEffect(() => {
    startTerminalSequence()
  }, [startTerminalSequence])

  useEffect(() => {
    if (reduceMotion || isTerminalReady || activeTerminalLine < 0) {
      return
    }

    const currentLine = terminalSequence[activeTerminalLine]

    if (!currentLine) {
      setIsTerminalReady(true)
      setActiveTerminalLine(-1)
      return
    }

    const isLineComplete = activeTerminalChar >= currentLine.text.length
    const timeout = window.setTimeout(() => {
      if (isLineComplete) {
        setTypedTerminalLines((prev) => [...prev, currentLine])

        if (activeTerminalLine === terminalSequence.length - 1) {
          setActiveTerminalLine(-1)
          setActiveTerminalChar(0)
          setIsTerminalReady(true)
          return
        }

        setActiveTerminalLine((prev) => prev + 1)
        setActiveTerminalChar(0)
        return
      }

      setActiveTerminalChar((prev) => prev + 1)
    }, isLineComplete ? TERMINAL_LINE_PAUSE : TERMINAL_TYPING_SPEED)

    return () => window.clearTimeout(timeout)
  }, [activeTerminalChar, activeTerminalLine, isTerminalReady, reduceMotion])

  useEffect(() => {
    if (isTerminalReady) {
      terminalInputRef.current?.focus()
    }
  }, [isTerminalReady])

  const handleTerminalCommand = useCallback(
    (value: string) => {
      const trimmedValue = value.trim()
      const command = trimmedValue.toLowerCase().replace(/\s+/g, ' ')

      if (!command) {
        return
      }

      if (command === 'clear') {
        setTypedTerminalLines([])
        setActiveTerminalLine(-1)
        setActiveTerminalChar(0)
        setIsTerminalReady(true)
        return
      }

      if (command === 'start') {
        startTerminalSequence()
        return
      }

      const matchedSection = sectionCommands.find((section) =>
        section.commands.includes(command)
      )

      if (matchedSection) {
        setTypedTerminalLines((prev) => [
          ...prev,
          { prompt: '>> ~', text: trimmedValue },
          { prompt: '>> ~', text: `Opening ${matchedSection.label} section...` },
        ])

        document.getElementById(matchedSection.id)?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        })
        return
      }

      setTypedTerminalLines((prev) => [
        ...prev,
        { prompt: '>> ~', text: trimmedValue },
        { prompt: '>> ~', text: `command not found: ${trimmedValue}` },
      ])
    },
    [reduceMotion, startTerminalSequence]
  )

  const handleTerminalSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const nextCommand = terminalInput

      setTerminalInput('')
      handleTerminalCommand(nextCommand)
    },
    [handleTerminalCommand, terminalInput]
  )

  const liveTerminalLine =
    activeTerminalLine >= 0
      ? {
          ...terminalSequence[activeTerminalLine],
          text: terminalSequence[activeTerminalLine].text.slice(
            0,
            activeTerminalChar
          ),
        }
      : null

  return (
    <motion.section
      id="home"
      animate={{
        scale: open ? 0.96 : 1,
        opacity: open ? 0.9 : 1,
      }}
      transition={{ duration: reduceMotion ? 0.15 : 0.3 }}
      className="relative min-h-[84vh] overflow-hidden px-4 pb-10 pt-28 sm:px-6 sm:pb-10 sm:pt-22 lg:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20" />
        <div className="absolute inset-x-0 bottom-12 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent dark:via-emerald-300/25" />
        <div className="absolute left-[-8%] top-[12%] h-[360px] w-[360px] rounded-full bg-sky-500/12 blur-[120px]" />
        <div className="absolute right-[-5%] top-[22%] h-[420px] w-[420px] rounded-full bg-emerald-500/12 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[26%] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>
      <div className="absolute inset-0 z-0 opacity-40">
        <DotGrid />
      </div>
      <div className="grain-overlay absolute inset-0 z-[1]" />

      <motion.div
        {...sectionRevealProps}
        className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-col gap-8 pt-0 sm:gap-9 sm:pt-1 lg:gap-10 lg:pt-2"
      >
        <div className="grid w-full gap-8 lg:min-h-[480px] lg:grid-cols-[0.96fr_0.9fr] lg:items-center lg:gap-10">
          <div className="relative max-w-[32rem]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex flex-col items-start gap-2.5 font-mono sm:flex-row sm:flex-wrap sm:items-center"
            >
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/12 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-[0_18px_38px_-26px_rgba(16,185,129,0.48)] dark:text-emerald-300 sm:text-[11px] sm:tracking-[0.24em]">
                <span className="relative flex h-2.5 w-2.5">
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70"
                    animate={
                      reduceMotion
                        ? undefined
                        : { scale: [1, 1.8], opacity: [0.7, 0] }
                    }
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 1.6, repeat: Infinity, ease: 'easeOut' }
                    }
                  />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                Open to work
              </span>
              <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-white/18 bg-transparent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-700 dark:text-gray-100 sm:max-w-none sm:text-[13px] sm:tracking-[0.24em]">
                <Sparkles size={14} />
                <TypingBadge />
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="display-poster poster-shadow mt-4 whitespace-nowrap text-[2.95rem] uppercase leading-[0.9] text-gray-950 dark:text-white sm:text-[4rem] lg:text-[4.75rem]"
            >
              <span className="inline-block -skew-x-6">Sourav Chowdhury</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[0.92rem] font-semibold uppercase tracking-[0.18em] text-gray-700 dark:text-gray-200 sm:text-base"
            >
              <span className="text-sky-600 dark:text-sky-300">Full stack developer</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-gray-500 dark:text-gray-400">I build</span>
              <span className="text-emerald-600 dark:text-emerald-300">
                <WordCycle words={headlineWords} />
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="mt-5 flex flex-wrap items-center gap-3"
            >
              <MagneticButton>
                <motion.a
                  href="#projects"
                  onClick={() => recordClick('hero-view-projects')}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[14px] border-[3px] border-white px-5 py-3 font-mono text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_0_0_rgba(255,255,255,0.88),0_26px_55px_-30px_rgba(14,165,233,0.7)] transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), #10b981)',
                  }}
                >
                  View Project
                  <ArrowUpRight size={17} />
                </motion.a>
              </MagneticButton>

              <MagneticButton>
                <motion.button
                  type="button"
                  onClick={() => {
                    recordClick('hero-open-resume-preview')
                    setShowResumePreview(true)
                  }}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[14px] border-[3px] border-slate-200 bg-white/92 px-5 py-3 font-mono text-sm font-extrabold uppercase tracking-[0.12em] text-slate-900 shadow-[0_10px_0_0_rgba(226,232,240,0.95),0_24px_52px_-34px_rgba(15,23,42,0.28)] backdrop-blur-md transition-all hover:bg-white dark:border-white/85 dark:bg-white/10 dark:text-white dark:shadow-[0_10px_0_0_rgba(255,255,255,0.28),0_24px_52px_-34px_rgba(16,185,129,0.44)] dark:hover:bg-white/14"
                >
                  <FileText size={17} />
                  Resume
                </motion.button>
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              {socialLinks.map((link) => {
                const Icon = link.icon

                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      link.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/74 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.26)] backdrop-blur-md dark:bg-white/7 dark:text-gray-200"
                    onClick={() =>
                      recordClick(`hero-social-${link.label.toLowerCase()}`)
                    }
                  >
                    <Icon size={16} />
                    {link.label}
                  </motion.a>
                )
              })}
            </motion.div>
          </div>

          <div className="relative flex items-start justify-center pt-2 lg:-mt-14 lg:justify-end">
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <motion.div
                className="absolute right-[14%] top-[8%] h-[2px] w-28 origin-left bg-gradient-to-r from-white/10 via-sky-300/90 to-transparent"
                animate={reduceMotion ? undefined : { rotate: [-22, -16, -22] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                }
              />
              <motion.div
                className="absolute right-[9%] top-[3%] h-2.5 w-2.5 rounded-full border border-white/30 bg-sky-300"
                animate={reduceMotion ? undefined : { x: [0, 8, 0], y: [0, -4, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                }
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24, y: 14 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.32 }}
              className="relative w-full max-w-[18rem] lg:max-w-[19rem]"
            >
              <div className="absolute inset-x-[12%] top-[10%] h-[72%] rounded-full bg-gradient-to-br from-sky-500/18 via-emerald-500/16 to-transparent blur-[85px]" />

              <div className="absolute inset-x-8 top-4 h-[calc(100%-1.5rem)] rounded-[26px] border border-white/14 bg-white/8 backdrop-blur-[2px] dark:bg-white/4" />
              <div className="absolute inset-x-5 top-2 h-[calc(100%-1.5rem)] rounded-[26px] border border-sky-400/20 bg-sky-500/6 dark:bg-sky-500/5" />

              <motion.div
                animate={
                  reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 0.8, 0] }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 4.4, repeat: Infinity, ease: 'easeInOut' }
                }
                className="tech-frame relative overflow-hidden rounded-[26px] border border-white/16 bg-white/85 p-2.5 shadow-[0_40px_110px_-52px_rgba(15,23,42,0.6)] dark:bg-[#08111a]/88"
              >
                <div className="overflow-hidden rounded-[20px] border border-white/14 bg-gradient-to-br from-sky-100 via-white to-emerald-50 dark:from-[#0d1724] dark:via-[#0a121b] dark:to-[#0f171f]">
                  <div className="relative aspect-[0.92]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_58%)] dark:bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.22),transparent_58%)]" />
                    <img
                      src="/profile.jpg"
                      alt="Portrait of Sourav Chowdhury"
                      loading="eager"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#020617]/85 via-[#020617]/25 to-transparent" />
                  </div>
                </div>

              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="tech-frame soft-panel -mt-3 w-full max-w-5xl self-center overflow-hidden rounded-[24px] bg-[#030712]/94 p-1 font-mono text-gray-300 sm:-mt-4 lg:-mt-6"
        >
          <div className="rounded-[20px] border border-white/6 bg-gradient-to-br from-[#040813] via-[#07131c] to-[#08161a] px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gray-500">
                <TerminalIcon size={12} />
                Interactive console
              </div>
            </div>

            <div
              className="mt-4 min-h-[156px] space-y-2.5 overflow-hidden text-[16px]"
              onClick={() => terminalInputRef.current?.focus()}
            >
              {typedTerminalLines.map((line, index) => (
                <div key={`${line.text}-${index}`} className="break-words">
                  <span className="mr-2 font-bold text-emerald-400">
                    {line.prompt}
                  </span>
                  <span className="text-gray-100">{line.text}</span>
                </div>
              ))}
              {liveTerminalLine ? (
                <div className="break-words">
                  <span className="mr-2 font-bold text-emerald-400">
                    {liveTerminalLine.prompt}
                  </span>
                  <span className="text-gray-100">{liveTerminalLine.text}</span>
                  <motion.span
                    className="ml-1 inline-block h-4 w-2 bg-gray-400 align-middle"
                    animate={reduceMotion ? undefined : { opacity: [1, 0, 1] }}
                    transition={
                      reduceMotion
                        ? undefined
                        : {
                            duration: 1,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }
                    }
                  />
                </div>
              ) : null}
              {isTerminalReady ? (
                <form onSubmit={handleTerminalSubmit} className="break-words">
                  <label className="flex items-center">
                    <span className="mr-2 font-bold text-emerald-400">
                      &gt;&gt; ~
                    </span>
                    <input
                      ref={terminalInputRef}
                      value={terminalInput}
                      onChange={(event) => setTerminalInput(event.target.value)}
                      className="w-full bg-transparent text-gray-100 outline-none placeholder:text-gray-500"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="type a section name or clear"
                    />
                  </label>
                </form>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {quickCommands.map((command) => (
                <button
                  key={command}
                  type="button"
                  onClick={() => handleTerminalCommand(command)}
                  className="rounded-full border border-emerald-400/20 bg-white/6 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-emerald-300 transition hover:bg-emerald-400/12"
                >
                  {command}
                </button>
              ))}
              <button
                type="button"
                onClick={startTerminalSequence}
                className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-gray-300 transition hover:bg-white/10"
              >
                restart
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showResumePreview ? (
        <Suspense fallback={null}>
          <ResumePreviewModal
            open={showResumePreview}
            onClose={() => setShowResumePreview(false)}
            pdfUrl="/images/resume.pdf"
          />
        </Suspense>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="h-[2px] w-screen bg-emerald-300/75 shadow-[0_0_20px_rgba(52,211,153,0.34)] dark:bg-emerald-200/70" />
        <div className="h-[4px] w-screen bg-gradient-to-r from-emerald-400/28 via-emerald-300/78 to-emerald-400/28 shadow-[0_0_28px_rgba(52,211,153,0.3)] dark:from-emerald-300/22 dark:via-emerald-200/68 dark:to-emerald-300/22" />
      </div>
    </motion.section>
  )
}

export default Hero
