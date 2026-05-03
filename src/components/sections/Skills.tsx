import { useState, useCallback, useEffect, useRef, type MouseEvent } from 'react'
import {
  Code,
  Database,
  Server,
  Wrench,
  Music,
  Music2,
  Music3,
  Music4,
  Coffee,
  FileCode,
  Atom,
  Smartphone,
  Layout,
  GitBranch,
  Github,
  Terminal,
  Globe,
  FileJson,
  Layers,
  Box,
  Volume2,
  VolumeX,
  type LucideIcon,
} from 'lucide-react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import useCoarsePointer from '../../hooks/useCoarsePointer'
import { getSectionRevealProps } from '../../lib/motion'

const skillCategories = [
  {
    title: 'Programming & Frontend',
    icon: Code,
    skills: [
      { name: 'Java', icon: Coffee, color: '#f89820' },
      { name: 'C', icon: FileCode, color: '#00599C' },
      { name: 'JavaScript (ES6+)', icon: FileJson, color: '#F7DF1E' },
      { name: 'TypeScript (Basic)', icon: FileCode, color: '#3178C6' },
      { name: 'React.js', icon: Atom, color: '#61DAFB' },
      { name: 'Next.js 14', icon: Globe, color: '#111111' },
      { name: 'React Native', icon: Smartphone, color: '#61DAFB' },
      { name: 'HTML5', icon: Layout, color: '#E34F26' },
      { name: 'CSS3', icon: Layers, color: '#1572B6' },
    ],
  },
  {
    title: 'Backend & APIs',
    icon: Server,
    skills: [
      { name: 'Node.js', icon: Server, color: '#339933' },
      { name: 'REST API', icon: Globe, color: '#009688' },
      { name: 'Auth Workflows', icon: Wrench, color: '#FF6C37' },
      { name: 'API Debugging', icon: Terminal, color: '#10b981' },
    ],
  },
  {
    title: 'Databases',
    icon: Database,
    skills: [
      { name: 'MongoDB', icon: Database, color: '#47A248' },
      { name: 'SQL', icon: Database, color: '#4479A1' },
    ],
  },
  {
    title: 'Tools & Platforms',
    icon: Wrench,
    skills: [
      { name: 'Git', icon: GitBranch, color: '#F05032' },
      { name: 'GitHub', icon: Github, color: '#6e5494' },
      { name: 'Postman', icon: Globe, color: '#FF6C37' },
      { name: 'VS Code', icon: Code, color: '#007ACC' },
      { name: 'Firebase', icon: Database, color: '#FFCA28' },
      { name: 'Vercel', icon: Server, color: '#0070f3' },
      { name: 'Expo', icon: Smartphone, color: '#4630EB' },
    ],
  },
] as const

type SkillNote = {
  id: number
  icon: LucideIcon
  x: number
  skillId: string
}

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

const skillGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const skillItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
}

const playSkillSound = (index: number) => {
  const audioWindow = window as AudioWindow
  const AudioContextCtor = window.AudioContext || audioWindow.webkitAudioContext
  if (!AudioContextCtor) return null

  const ctx = new AudioContextCtor()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  const scale = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25]
  osc.frequency.value = scale[index % scale.length]
  osc.type = 'sine'

  gain.gain.setValueAtTime(0.1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5)

  osc.start()
  osc.stop(ctx.currentTime + 0.5)

  return ctx
}

const Skills = () => {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [musicNotes, setMusicNotes] = useState<SkillNote[]>([])
  const noteTimeoutsRef = useRef<number[]>([])
  const soundCtxRef = useRef<AudioContext | null>(null)
  const reduceMotion = useReducedMotion()
  const isCoarsePointer = useCoarsePointer()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const [skillTapRotations, setSkillTapRotations] = useState<Record<string, number>>({})

  const musicIcons = [Music, Music2, Music3, Music4]

  useEffect(() => {
    return () => {
      noteTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      noteTimeoutsRef.current = []
      if (soundCtxRef.current && soundCtxRef.current.state !== 'closed') {
        soundCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  const handleSkillHover = useCallback(
    (categoryIndex: number, skillIndex: number, skillId: string) => {
      setHoveredSkill(skillId)

      if (!soundEnabled) return

      let globalIndex = 0
      for (let i = 0; i < categoryIndex; i += 1) {
        globalIndex += skillCategories[i].skills.length
      }
      globalIndex += skillIndex

      if (!soundCtxRef.current || soundCtxRef.current.state === 'closed') {
        soundCtxRef.current = playSkillSound(globalIndex)
      } else {
        const osc = soundCtxRef.current.createOscillator()
        const gain = soundCtxRef.current.createGain()
        osc.connect(gain)
        gain.connect(soundCtxRef.current.destination)

        const scale = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25]
        osc.frequency.value = scale[globalIndex % scale.length]
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.1, soundCtxRef.current.currentTime)
        gain.gain.exponentialRampToValueAtTime(
          0.00001,
          soundCtxRef.current.currentTime + 0.5
        )
        osc.start()
        osc.stop(soundCtxRef.current.currentTime + 0.5)
      }

      const newNote = {
        id: Date.now(),
        icon: musicIcons[Math.floor(Math.random() * musicIcons.length)],
        x: Math.random() * 40 - 20,
        skillId,
      }

      setMusicNotes((prev) => [...prev.slice(-4), newNote])

      const timeoutId = window.setTimeout(() => {
        setMusicNotes((prev) => prev.filter((note) => note.id !== newNote.id))
      }, 3500)
      noteTimeoutsRef.current.push(timeoutId)
    },
    [soundEnabled]
  )

  const handleSkillCardClick =
    (skillId: string) => (event: MouseEvent<HTMLDivElement>) => {
      if (!isCoarsePointer || reduceMotion) return

      const target = event.target as HTMLElement
      if (target.closest('button, a, input, textarea')) {
        return
      }

      setSkillTapRotations((current) => ({
        ...current,
        [skillId]: (current[skillId] ?? 0) + 1,
      }))
    }

  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <AnimatedBorder>
        <div className="mx-auto max-w-6xl p-4 font-mono sm:p-6 md:p-10">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-4 flex items-center justify-center gap-3 sm:gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                My Skills
              </h2>
              <motion.button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                className="rounded-full p-2 text-gray-700 dark:text-gray-300"
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              >
                {soundEnabled ? (
                  <Volume2 className="h-6 w-6" />
                ) : (
                  <VolumeX className="h-6 w-6" />
                )}
              </motion.button>
            </div>
            <p className="mx-auto mt-4 max-w-2xl px-4 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
              Powers and tools I use to build amazing things.
              <span className="mt-2 block text-sm font-medium text-green-500">
                {soundEnabled ? 'Hover over skills to hear soft marimba notes.' : ''}
              </span>
            </p>
          </motion.div>

          <div className="space-y-16">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="mb-6 flex items-center justify-center gap-3 text-center text-xl font-bold tracking-wider text-green-600 dark:text-green-400 sm:mb-8 sm:text-2xl">
                  <category.icon className="h-6 w-6" />
                  {category.title}
                </h3>

                <motion.div
                  variants={reduceMotion ? undefined : skillGridVariants}
                  initial={reduceMotion ? undefined : 'hidden'}
                  whileInView={reduceMotion ? undefined : 'visible'}
                  viewport={{ once: true, amount: 0.12 }}
                  className="flex flex-wrap justify-center gap-4 sm:gap-6"
                >
                  {category.skills.map((skill, skillIndex) => {
                    const IconComponent = skill.icon || Box
                    const skillId = `${category.title}-${skill.name}`
                    const isHovered = hoveredSkill === skillId
                    const skillRotation = isCoarsePointer
                      ? (skillTapRotations[skillId] ?? 0) * 360
                      : isHovered
                        ? 360
                        : 0

                    return (
                      <motion.div
                        key={skill.name}
                        variants={reduceMotion ? undefined : skillItemVariants}
                        onMouseEnter={() =>
                          handleSkillHover(categoryIndex, skillIndex, skillId)
                        }
                        onMouseLeave={() => setHoveredSkill(null)}
                        className="group h-24 w-24 overflow-visible sm:h-28 sm:w-28"
                      >
                        <div className="relative h-full w-full [perspective:1000px]">
                          <motion.div
                            onClick={handleSkillCardClick(skillId)}
                            animate={
                              reduceMotion
                                ? undefined
                                : {
                                    scale: isHovered ? 1.08 : 1,
                                    rotateY: skillRotation,
                                  }
                            }
                            transition={
                              reduceMotion
                                ? undefined
                                : isCoarsePointer
                                  ? {
                                      duration: 0.7,
                                      ease: 'easeInOut',
                                    }
                                  : isHovered
                                  ? {
                                      type: 'spring',
                                      stiffness: 300,
                                      damping: 18,
                                    }
                                  : { duration: 0 }
                            }
                            className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 will-change-transform"
                            style={{
                              transformStyle: 'preserve-3d',
                              willChange: 'transform',
                            }}
                          >
                            <motion.span
                              className="pointer-events-none absolute inset-0 rounded-xl border border-indigo-400/0"
                              animate={
                                isHovered && !reduceMotion
                                  ? {
                                      boxShadow: '0 0 12px rgba(99,102,241,0.6)',
                                      borderColor: 'rgba(99,102,241,0.7)',
                                    }
                                  : {
                                      boxShadow: '0 0 0px transparent',
                                      borderColor: 'rgba(99,102,241,0)',
                                    }
                              }
                              transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 18,
                              }}
                            />

                            <AnimatePresence>
                              {isHovered && !reduceMotion &&
                                musicNotes
                                  .filter((note) => note.skillId === skillId)
                                  .slice(-1)
                                  .map((note) => {
                                    const NoteIcon = note.icon

                                    return (
                                      <motion.div
                                        key={note.id}
                                        initial={{
                                          opacity: 0,
                                          y: 0,
                                          x: 0,
                                          scale: 0.3,
                                          rotate: -20,
                                        }}
                                        animate={{
                                          opacity: [0, 1, 1, 1, 0],
                                          y: [-10, -30, -60, -90, -120],
                                          x: [
                                            0,
                                            note.x * 0.3,
                                            note.x * 0.6,
                                            note.x * 0.8,
                                            note.x,
                                          ],
                                          scale: [0.3, 0.8, 1.1, 1.2, 0.9],
                                          rotate: [-20, 0, 10, 5, 15],
                                        }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{
                                          duration: 2,
                                          ease: 'easeOut',
                                        }}
                                        className="pointer-events-none absolute z-50"
                                        style={{
                                          left: '50%',
                                          top: '50%',
                                          color: skill.color || '#22c55e',
                                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                                          transformOrigin: 'center',
                                          marginLeft: '-12px',
                                          marginTop: '-12px',
                                        }}
                                      >
                                        <NoteIcon className="h-6 w-6" strokeWidth={2.5} />
                                      </motion.div>
                                    )
                                  })}
                            </AnimatePresence>

                            <motion.div
                              animate={
                                isHovered && !reduceMotion
                                  ? { rotate: [0, 10, -10, 0] }
                                  : { rotate: 0 }
                              }
                              transition={{ duration: 0.45, ease: 'easeInOut' }}
                            >
                              <IconComponent
                                className="h-8 w-8 sm:h-10 sm:w-10"
                                style={{ color: skill.color }}
                              />
                            </motion.div>
                            <span className="text-xs font-bold leading-tight text-gray-700 dark:text-gray-300">
                              {skill.name}
                            </span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedBorder>
    </motion.div>
  )
}

export default Skills
