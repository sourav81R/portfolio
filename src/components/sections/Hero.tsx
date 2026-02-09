import { useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Download, Eye, Terminal as TerminalIcon, Code2, Cpu, Globe } from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'
import MagneticButton from '../common/MagneticButton'
import { useCommandPalette } from '../../store/useCommandpalette'
import SmartResume from '../common/SmartResume'
import './About.css'

/* ---------------- TERMINAL DATA ---------------- */
type Line = {
  prompt: string
  text: string
}

const lines: Line[] = [
  { prompt: '➜ ~', text: 'whoami' },
  {
    prompt: '➜ ~',
    text: 'Sourav Chowdhury',
  },
  {
    prompt: '➜ ~',
    text: 'cat role.txt',
  },
  {
    prompt: '➜ ~',
    text: 'Final Year B.Tech CSE Student | Software Developer',
  },
  {
    prompt: '➜ ~',
    text: 'ls skills/',
  },
  {
    prompt: '➜ ~',
    text: 'React · TypeScript · REST APIs · React Native · Node.js',
  },
  {
    prompt: '➜ ~',
    text: 'echo "Ready to build!"',
  },
]

const TYPING_SPEED = 35
const LINE_DELAY = 600

/* ---------------- NAME ANIMATION ---------------- */
const fullName = 'SOURAV CHOWDHURY'

const Hero = () => {
  const { open } = useCommandPalette()

  /* ---------------- TERMINAL STATE ---------------- */
  const [displayedLines, setDisplayedLines] = useState<Line[]>([])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [showResume, setShowResume] = useState(false)

  /* Cursor blink */
  useEffect(() => {
    const blink = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(blink)
  }, [])

  /* Typing animation */
  useEffect(() => {
    if (lineIndex >= lines.length) return

    const fullText = lines[lineIndex].text

    if (charIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + fullText[charIndex])
        setCharIndex((prev) => prev + 1)
      }, TYPING_SPEED)

      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, lines[lineIndex]])
        setCurrentText('')
        setCharIndex(0)
        setLineIndex((prev) => prev + 1)
      }, LINE_DELAY)

      return () => clearTimeout(timeout)
    }
  }, [charIndex, lineIndex])

  /* ---------------- PARALLAX ---------------- */
  const { scrollY } = useScroll()
  const nameY = useTransform(scrollY, [0, 400], [0, -40])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const handleResumeClose = useCallback(() => setShowResume(false), [])

  return (
    <motion.section
      id="home"
      animate={{
        scale: open ? 0.96 : 1,
        filter: open ? 'blur(2px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen flex items-center px-6 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[98%] mx-auto w-full relative z-10">
        <AnimatedBorder>
          <div className="grid lg:grid-cols-2 gap-16 items-center p-8 md:p-12 min-h-[70vh] border border-gray-200 dark:border-gray-800 rounded-xl">
            {/* ---------------- LEFT SIDE ---------------- */}
            <div className="font-mono flex flex-col items-start">
          {/* AVATAR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 rounded-full blur-xl bg-green-500/30 animate-pulse" />
            <img
              src="/profile.jpg"
              alt="Sourav Chowdhury"
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-green-500/50 shadow-lg"
            />
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Available for Work
          </motion.div>

          {/* NAME */}
          <motion.h1
            style={{ y: nameY }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-gray-900 dark:text-white"
          >
            {fullName.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block hover:text-green-500 transition-colors duration-300 cursor-default"
                style={{
                  marginRight: char === ' ' ? '0.35rem' : '0.05rem',
                  textShadow: '0 0 20px rgba(0,0,0,0.1)',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed"
          >
            Building{' '}
            <span className="text-gray-900 dark:text-white font-semibold">
              digital experiences
            </span>{' '}
            with modern technologies. Focused on creating accessible,
            pixel-perfect, and performant web applications.
          </motion.p>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4">
            <MagneticButton>
              <a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                View Projects
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:border-gray-900 dark:hover:border-white transition-colors bg-white/50 dark:bg-black/50 backdrop-blur-sm"
              >
                <Eye size={18} />
                View Resume
              </a>
            </MagneticButton>

            <MagneticButton>
              <button
                onClick={() => setShowResume(true)}
                className="group flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all bg-white/50 dark:bg-black/50 backdrop-blur-sm"
              >
                <Download size={18} />
                Download
              </button>
            </MagneticButton>
          </div>
            </div>

            {/* ---------------- RIGHT SIDE ---------------- */}
            <div className="relative hidden md:block">
          {/* Floating Icons */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-12 -right-4 z-20 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <Code2 className="text-blue-500" size={24} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute top-1/2 -left-8 z-20 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <Cpu className="text-purple-500" size={24} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute -bottom-8 right-12 z-20 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <Globe className="text-green-500" size={24} />
          </motion.div>

              <div className="rounded-xl bg-gray-900/95 text-gray-300 p-1 font-mono shadow-2xl backdrop-blur-sm w-full max-w-lg mx-auto border border-gray-800/50">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 rounded-t-lg border-b border-gray-700/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TerminalIcon size={12} />
                  <span>bash — 80x24</span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 space-y-4 min-h-[300px] text-sm overflow-hidden">
                {displayedLines.map((line, i) => (
                  <div key={i} className="break-words">
                    <span className="text-green-400 font-bold mr-2">
                      {line.prompt}
                    </span>
                    <span className="text-gray-100">{line.text}</span>
                  </div>
                ))}

                {lineIndex < lines.length && (
                  <div className="break-words">
                    <span className="text-green-400 font-bold mr-2">
                      {lines[lineIndex].prompt}
                    </span>
                    <span className="text-gray-100">
                      {currentText}
                      <span
                        className="ml-1 animate-pulse inline-block w-2 h-4 bg-gray-400 align-middle"
                        style={{ opacity: showCursor ? 1 : 0 }}
                      />
                    </span>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </AnimatedBorder>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent dark:from-gray-600" />
      </motion.div>

      <SmartResume open={showResume} onClose={handleResumeClose} />
    </motion.section>
  )
}

export default Hero
