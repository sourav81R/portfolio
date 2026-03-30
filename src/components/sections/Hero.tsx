import { useEffect, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Code2,
  Cpu,
  Download,
  Eye,
  Globe,
  MapPin,
  Sparkles,
  Terminal as TerminalIcon,
} from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'
import MagneticButton from '../common/MagneticButton'
import { useCommandPalette } from '../../store/useCommandpalette'
import SmartResume from '../common/SmartResume'
import ResumePreviewModal from '../common/ResumePreviewModal'
type Line = {
  prompt: string
  text: string
}

const terminalLines: Line[] = [
  { prompt: '>> ~', text: 'whoami' },
  { prompt: '>> ~', text: 'Sourav Chowdhury' },
  { prompt: '>> ~', text: 'cat role.txt' },
  {
    prompt: '>> ~',
    text: 'Full stack developer focused on product-quality interfaces',
  },
  { prompt: '>> ~', text: 'ls stack/' },
  {
    prompt: '>> ~',
    text: 'React | TypeScript | REST APIs | React Native | Node.js',
  },
  { prompt: '>> ~', text: 'echo "Ready to build!"' },
]

const heroSignals = [
  {
    label: 'Availability',
    value: 'Open for 2026 roles',
  },
  {
    label: 'Location',
    value: 'Kolkata / Remote-friendly',
  },
  {
    label: 'Core stack',
    value: 'React, TypeScript, Node.js',
  },
]

const heroProof = [
  'Recruiter-friendly case studies',
  'Modern React and TypeScript focus',
  'Frontend, APIs, and mobile experience',
]

const fullName = 'SOURAV CHOWDHURY'
const BADGE_WORDS = [
  'COMPUTER SCIENCE ENGINEER',
  'FULL STACK DEVELOPER',
  'MERN STACK DEVELOPER',
]

const TypingBadge = () => {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)

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
    <span className="inline-block max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap align-bottom sm:max-w-none">
      {BADGE_WORDS[index].substring(0, subIndex)}
      <span className="ml-1 inline-block animate-pulse">|</span>
    </span>
  )
}

const Hero = () => {
  const { open } = useCommandPalette()
  const reduceMotion = useReducedMotion()
  const [showResume, setShowResume] = useState(false)
  const [showResumePreview, setShowResumePreview] = useState(false)

  const handleResumeClose = useCallback(() => setShowResume(false), [])

  return (
    <motion.section
      id="home"
      animate={{
        scale: open ? 0.96 : 1,
        opacity: open ? 0.9 : 1,
      }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-10 sm:pt-32 lg:pt-36"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute right-[2%] top-[-8%] h-[360px] w-[360px] rounded-full bg-green-500/12 blur-[90px]" />
        <div className="absolute left-[-8%] top-[22%] h-[280px] w-[280px] rounded-full bg-sky-500/10 blur-[90px]" />
        <div className="absolute bottom-[-8%] right-[22%] h-[260px] w-[260px] rounded-full bg-emerald-500/10 blur-[90px]" />
      </div>
      <div className="grain-overlay absolute inset-0 z-[1]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <AnimatedBorder>
          <div className="grid min-h-[560px] gap-8 rounded-2xl border border-white/70 bg-gradient-to-br from-white via-white to-emerald-50/70 p-4 shadow-[0_35px_120px_-55px_rgba(15,23,42,0.45)] sm:p-6 md:p-10 lg:min-h-[72vh] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:p-12 dark:border-gray-800/80 dark:bg-gradient-to-br dark:from-[#030712] dark:via-[#020617] dark:to-emerald-950/20">
            <div className="flex flex-col items-start font-mono">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-6 sm:mb-8"
              >
                <div className="absolute inset-0 rounded-full bg-green-500/30 blur-xl animate-pulse" />
                <img
                  src="/profile.jpg"
                  alt="Sourav Chowdhury"
                  className="relative h-24 w-24 rounded-3xl border-2 border-green-500/40 object-cover shadow-xl sm:h-28 sm:w-28 md:h-32 md:w-32"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="mb-5 flex flex-wrap items-center gap-2"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Open to work
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/75 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
                  <Sparkles size={14} />
                  <TypingBadge />
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="mb-6 max-w-2xl"
              >
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.26em] text-gray-500 dark:text-gray-400">
                  Building polished product experiences
                </p>
                <h1 className="text-4xl font-bold leading-[0.95] tracking-tight text-gray-950 dark:text-white sm:text-6xl lg:text-7xl">
                  {fullName}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
                  Full stack developer focused on clean interfaces, practical case studies, and API-driven products that are easy for recruiters and teams to evaluate.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="mb-8 grid w-full gap-3 sm:grid-cols-3"
              >
                {heroSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-2xl border border-gray-200/80 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-gray-800 dark:bg-white/5"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {signal.value}
                    </p>
                  </div>
                ))}
              </motion.div>

              <div className="flex w-full flex-wrap gap-3 sm:gap-4">
                <MagneticButton>
                  <a
                    href="#projects"
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-3 font-medium text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl dark:bg-white dark:text-black dark:hover:bg-gray-100 sm:w-auto sm:px-6"
                  >
                    View Projects
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </MagneticButton>

                <MagneticButton>
                  <button
                    type="button"
                    onClick={() => setShowResumePreview(true)}
                    className="group flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white/70 px-5 py-3 font-medium transition-colors hover:border-gray-900 dark:border-gray-700 dark:bg-white/5 dark:hover:border-white sm:w-auto sm:px-6"
                  >
                    <Eye size={18} />
                    Preview Resume
                  </button>
                </MagneticButton>

                <MagneticButton>
                  <button
                    onClick={() => setShowResume(true)}
                    className="group flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 font-medium text-emerald-700 transition-all hover:bg-emerald-500/15 dark:text-emerald-300 sm:w-auto sm:px-6"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </MagneticButton>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                className="mt-8 flex w-full flex-col gap-3"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
                    <MapPin size={14} />
                    Kolkata, India
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
                    <BadgeCheck size={14} />
                    Recruiter-ready portfolio
                  </span>
                </div>

                <div className="grid gap-2 md:hidden">
                  {heroProof.map((point) => (
                    <div
                      key={point}
                      className="rounded-2xl border border-gray-200/80 bg-white/75 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="relative hidden self-center md:block">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                }
                className="absolute -right-4 -top-12 z-20 rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <Code2 className="text-blue-500" size={24} />
              </motion.div>
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                      }
                }
                className="absolute -left-8 top-1/2 z-20 rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <Cpu className="text-purple-500" size={24} />
              </motion.div>
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2,
                      }
                }
                className="absolute -bottom-8 right-12 z-20 rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <Globe className="text-green-500" size={24} />
              </motion.div>

              <div className="mx-auto w-full max-w-xl rounded-[28px] border border-gray-800/50 bg-gray-900/95 p-1 font-mono text-gray-300 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between rounded-t-lg border-b border-gray-700/50 bg-gray-800/50 px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <TerminalIcon size={12} />
                    <span>bash -- 80x24</span>
                  </div>
                </div>

                <div className="min-h-[300px] space-y-4 overflow-hidden p-6 text-sm">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="break-words">
                      <span className="mr-2 font-bold text-green-400">
                        {line.prompt}
                      </span>
                      <span className="text-gray-100">{line.text}</span>
                    </div>
                  ))}
                  <div className="break-words">
                    <span className="mr-2 font-bold text-green-400">&gt;&gt; ~</span>
                    <span className="text-gray-100">Ready to build</span>
                    <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-gray-400 align-middle" />
                  </div>
                </div>

                <div className="grid gap-2 border-t border-gray-800/80 bg-black/20 px-4 py-4 md:grid-cols-3">
                  {heroProof.map((point) => (
                    <div
                      key={point}
                      className="rounded-xl border border-gray-800 bg-white/5 px-3 py-3 text-xs text-gray-300"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedBorder>
      </div>

      <motion.div
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-gray-400 dark:text-gray-500 sm:flex sm:bottom-8"
        animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="h-12 w-[1px] bg-gradient-to-b from-gray-400 to-transparent dark:from-gray-600" />
      </motion.div>

      <SmartResume open={showResume} onClose={handleResumeClose} />
      <ResumePreviewModal
        open={showResumePreview}
        onClose={() => setShowResumePreview(false)}
        pdfUrl="/images/resume.pdf"
      />
    </motion.section>
  )
}

export default Hero
