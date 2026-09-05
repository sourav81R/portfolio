import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from 'react'
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
  Cloud,
  CloudCog,
  HardDrive,
  Boxes,
  Orbit,
  ShieldCheck,
  Workflow,
  Triangle,
  Rocket,
  Zap,
  Bot,
  Sparkles,
  Brain,
  Users,
  MessagesSquare,
  Lightbulb,
  Palette,
  Binary,
  Volume2,
  VolumeX,
  type LucideIcon,
} from 'lucide-react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import useCoarsePointer from '../../hooks/useCoarsePointer'
import { getSectionRevealProps } from '../../lib/motion'

const skillCategories = [
  {
    title: 'Languages & Core',
    icon: Binary,
    skills: [
      { name: 'TypeScript', icon: FileCode, color: '#3178C6' },
      { name: 'JavaScript (ES6+)', icon: FileJson, color: '#F7DF1E' },
      { name: 'Java', icon: Coffee, color: '#f89820' },
      { name: 'C', icon: FileCode, color: '#00599C' },
      { name: 'SQL', icon: Database, color: '#336791' },
    ],
  },
  {
    title: 'Frontend & UI',
    icon: Palette,
    skills: [
      { name: 'React.js', icon: Atom, color: '#61DAFB' },
      { name: 'Next.js', icon: Globe, color: '#111111', darkColor: '#FFFFFF' },
      { name: 'Three.js', icon: Orbit, color: '#049EF4' },
      { name: 'React Native', icon: Smartphone, color: '#61DAFB' },
      { name: 'Tailwind CSS', icon: Layers, color: '#38BDF8' },
      { name: 'TanStack Query', icon: Workflow, color: '#FF4154' },
      { name: 'HTML5', icon: Layout, color: '#E34F26' },
      { name: 'CSS3', icon: Layers, color: '#1572B6' },
      { name: 'SEO', icon: Globe, color: '#22C55E' },
    ],
  },
  {
    title: 'Backend & APIs',
    icon: Server,
    skills: [
      { name: 'Node.js', icon: Server, color: '#339933' },
      { name: 'Express.js', icon: Server, color: '#444444' },
      { name: 'Nest.js', icon: Boxes, color: '#E0234E' },
      { name: 'REST APIs', icon: Globe, color: '#009688' },
      { name: 'RBAC & Auth', icon: ShieldCheck, color: '#FF6C37' },
      { name: 'JWT', icon: ShieldCheck, color: '#D63AFF' },
      { name: 'Zod Validation', icon: FileCode, color: '#3E67B1' },
      { name: 'API Debugging', icon: Terminal, color: '#10b981' },
    ],
  },
  {
    title: 'Databases',
    icon: Database,
    skills: [
      { name: 'PostgreSQL', icon: Database, color: '#4479A1' },
      { name: 'Supabase', icon: Database, color: '#3ECF8E' },
      { name: 'MongoDB', icon: Database, color: '#47A248' },
      { name: 'Firestore', icon: Database, color: '#FFCA28' },
      { name: 'SQL Migrations', icon: Database, color: '#336791' },
      { name: 'Schema Design', icon: Workflow, color: '#0ea5e9' },
      { name: 'Query Optimization', icon: Terminal, color: '#8b5cf6' },
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    icon: Cloud,
    skills: [
      { name: 'AWS', icon: CloudCog, color: '#FF9900' },
      { name: 'Cloudflare R2', icon: HardDrive, color: '#F38020' },
      { name: 'Vercel', icon: Triangle, color: '#0070f3' },
      { name: 'Render', icon: Cloud, color: '#46E3B7' },
      { name: 'Firebase', icon: Cloud, color: '#FFCA28' },
      { name: 'Object Storage', icon: HardDrive, color: '#38bdf8' },
      { name: 'Deployment & Hosting', icon: Rocket, color: '#22c55e' },
    ],
  },
  {
    title: 'Tools & Workflow',
    icon: Wrench,
    skills: [
      { name: 'Git', icon: GitBranch, color: '#F05032' },
      { name: 'GitHub', icon: Github, color: '#6e5494' },
      { name: 'Postman', icon: Globe, color: '#FF6C37' },
      { name: 'VS Code', icon: Code, color: '#007ACC' },
      { name: 'Expo', icon: Smartphone, color: '#4630EB' },
      { name: 'Vite', icon: Zap, color: '#646CFF' },
    ],
  },
  {
    title: 'AI Tools',
    icon: Sparkles,
    skills: [
      { name: 'Claude', icon: Sparkles, color: '#D97757' },
      { name: 'ChatGPT', icon: Bot, color: '#10A37F' },
      { name: 'Gemini', icon: Sparkles, color: '#4285F4' },
      { name: 'GitHub Copilot', icon: Bot, color: '#6e5494' },
      { name: 'OpenAI API', icon: Brain, color: '#412991' },
    ],
  },
  {
    title: 'Soft Skills',
    icon: Users,
    skills: [
      { name: 'Problem Solving', icon: Lightbulb, color: '#FACC15' },
      { name: 'Teamwork', icon: Users, color: '#38BDF8' },
      { name: 'Communication', icon: MessagesSquare, color: '#34D399' },
      { name: 'Fast Learning', icon: Rocket, color: '#A78BFA' },
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

const mobileSpinKeyframes = [0, 90, 180, 270, 360]
const mobileSpinTransition: Transition = {
  duration: 0.7,
  ease: 'easeInOut',
  times: [0, 0.28, 0.56, 0.82, 1],
}

const skillScale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99]

const getOrCreateAudioContext = () => {
  const audioWindow = window as AudioWindow
  const AudioContextCtor = window.AudioContext || audioWindow.webkitAudioContext
  if (!AudioContextCtor) return null

  return new AudioContextCtor()
}

const playSkillSound = (ctx: AudioContext, index: number) => {
  const now = ctx.currentTime
  const baseFrequency = skillScale[index % skillScale.length]

  const primaryOsc = ctx.createOscillator()
  const overtoneOsc = ctx.createOscillator()
  const gain = ctx.createGain()

  primaryOsc.connect(gain)
  overtoneOsc.connect(gain)
  gain.connect(ctx.destination)

  primaryOsc.type = 'triangle'
  overtoneOsc.type = 'sine'
  primaryOsc.frequency.setValueAtTime(baseFrequency, now)
  overtoneOsc.frequency.setValueAtTime(baseFrequency * 2, now)
  overtoneOsc.detune.setValueAtTime(8, now)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(0.14, now + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

  primaryOsc.start(now)
  overtoneOsc.start(now)
  primaryOsc.stop(now + 0.22)
  overtoneOsc.stop(now + 0.2)
}

const Skills = () => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [musicNotes, setMusicNotes] = useState<SkillNote[]>([])
  const [noteId, setNoteId] = useState(0)
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
        soundCtxRef.current = getOrCreateAudioContext()
      }

      if (soundCtxRef.current) {
        if (soundCtxRef.current.state === 'suspended') {
          void soundCtxRef.current.resume()
        }
        playSkillSound(soundCtxRef.current, globalIndex)
      }

      const newNote: SkillNote = {
        id: noteId,
        icon: musicIcons[Math.floor(Math.random() * musicIcons.length)],
        x: Math.random() * 40 - 20,
        skillId,
      }

      setMusicNotes((prev) => [...prev, newNote])
      setNoteId((prev) => prev + 1)

      const timeoutId = window.setTimeout(() => {
        setMusicNotes((prev) => prev.filter((note) => note.id !== newNote.id))
      }, 3500)
      noteTimeoutsRef.current.push(timeoutId)
    },
    [noteId, soundEnabled]
  )

  const handleSkillPointerDown =
    (categoryIndex: number, skillIndex: number, skillId: string) =>
    (event: PointerEvent<HTMLDivElement>) => {
      if (reduceMotion) return

      const target = event.target as HTMLElement
      if (target.closest('button, a, input, textarea')) {
        return
      }

      if (isCoarsePointer) {
        handleSkillHover(categoryIndex, skillIndex, skillId)
      }
    }

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
                My Arsenal
              </h2>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-2xl transition-transform hover:scale-110"
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              >
                {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </button>
            </div>
            <p className="mx-auto mt-4 max-w-2xl px-4 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
              Powers and tools I use to build amazing things.
              <span className="mt-2 block text-sm font-medium text-green-500">
                {soundEnabled
                  ? isCoarsePointer
                    ? 'Tap skills to hear marimba notes.'
                    : 'Hover over skills to hear marimba notes.'
                  : ''}
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
                    const skillTapCount = skillTapRotations[skillId] ?? 0
                    const shouldSpinOnTap = isCoarsePointer && skillTapCount > 0
                    const skillRotation = isHovered ? 360 : 0

                    return (
                      <motion.div
                        key={skill.name}
                        variants={reduceMotion ? undefined : skillItemVariants}
                        initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={
                          reduceMotion
                            ? undefined
                            : {
                                delay: skillIndex * 0.05,
                                duration: 0.4,
                                ease: 'easeOut',
                              }
                        }
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                y: -8,
                                scale: 1.1,
                                transition: {
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 10,
                                },
                              }
                        }
                        onMouseEnter={() =>
                          handleSkillHover(categoryIndex, skillIndex, skillId)
                        }
                        onMouseLeave={() => setHoveredSkill(null)}
                        onPointerDown={handleSkillPointerDown(
                          categoryIndex,
                          skillIndex,
                          skillId
                        )}
                        className="group h-24 w-24 overflow-visible sm:h-28 sm:w-28"
                      >
                        <div className="relative h-full w-full [perspective:1000px]">
                          <motion.div
                            key={shouldSpinOnTap ? `${skillId}-${skillTapCount}` : skillId}
                            onClick={handleSkillCardClick(skillId)}
                            initial={{ rotateY: 0 }}
                            animate={
                              reduceMotion
                                ? undefined
                                : shouldSpinOnTap
                                  ? { rotateY: mobileSpinKeyframes }
                                  : { rotateY: skillRotation }
                            }
                            transition={
                              reduceMotion
                                ? undefined
                                : shouldSpinOnTap
                                  ? mobileSpinTransition
                                  : isHovered
                                    ? { duration: 0.7, ease: 'easeInOut' }
                                    : { duration: 0 }
                            }
                            className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white p-2 text-center shadow-md transition-shadow group-hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
                            style={{
                              transformStyle: 'preserve-3d',
                              willChange: 'transform',
                            }}
                          >
                            <AnimatePresence>
                              {isHovered &&
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
                                          x: [0, note.x * 0.3, note.x * 0.6, note.x * 0.8, note.x],
                                          scale: [0.3, 0.8, 1.1, 1.2, 0.9],
                                          rotate: [-20, 0, 10, 5, 15],
                                        }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{
                                          duration: 3.5,
                                          ease: [0.25, 0.46, 0.45, 0.94],
                                          opacity: {
                                            times: [0, 0.1, 0.5, 0.8, 1],
                                            ease: 'easeInOut',
                                          },
                                          y: {
                                            ease: [0.33, 1, 0.68, 1],
                                          },
                                          x: {
                                            ease: 'easeInOut',
                                          },
                                          scale: {
                                            times: [0, 0.2, 0.5, 0.7, 1],
                                            ease: 'easeOut',
                                          },
                                          rotate: {
                                            ease: 'easeInOut',
                                          },
                                        }}
                                        className="pointer-events-none absolute z-50"
                                        style={{
                                          left: '50%',
                                          top: '50%',
                                          color: skill.color || '#22c55e',
                                          filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))',
                                          transformOrigin: 'center',
                                        }}
                                      >
                                        <NoteIcon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.5} />
                                      </motion.div>
                                    )
                                  })}
                            </AnimatePresence>

                            <motion.div
                              whileHover={reduceMotion ? undefined : { rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              <IconComponent
                                className="skill-icon h-7 w-7 transition-colors sm:h-8 sm:w-8"
                                style={
                                  {
                                    '--skill-color': skill.color,
                                    '--skill-color-dark':
                                      'darkColor' in skill
                                        ? skill.darkColor
                                        : skill.color,
                                  } as CSSProperties
                                }
                              />
                            </motion.div>
                            <span className="text-[10px] font-bold leading-tight text-gray-700 dark:text-gray-300 sm:text-xs">
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
