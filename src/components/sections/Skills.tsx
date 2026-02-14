import { useState, useCallback, useEffect, useRef } from 'react'
import { 
  Code, Database, Server, Wrench, 
  Music, Music2, Music3, Music4,
  Coffee, FileCode, Atom, Smartphone, Layout, 
  GitBranch, Github, Terminal, Globe, 
  FileJson, Layers, Box
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import './About.css'

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
]

const playSkillSound = (index: number) => {
  const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextCtor) return null

  const ctx = new AudioContextCtor()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25] // C major
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
  const [musicNotes, setMusicNotes] = useState<{ id: number; icon: any; x: number; skill: string }[]>([])
  const noteTimeoutsRef = useRef<number[]>([])
  const soundCtxRef = useRef<AudioContext | null>(null)

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

  const handleSkillHover = useCallback((categoryIndex: number, skillIndex: number, skillName: string) => {
    setHoveredSkill(skillName)

    if (!soundEnabled) return

    // Calculate a unique index for each skill across all categories
    let globalIndex = 0
    for (let i = 0; i < categoryIndex; i++) {
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
      const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
      osc.frequency.value = scale[globalIndex % scale.length]
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.1, soundCtxRef.current.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, soundCtxRef.current.currentTime + 0.5)
      osc.start()
      osc.stop(soundCtxRef.current.currentTime + 0.5)
    }

    // Generate ONE music note
    const newNote = {
      id: Date.now(),
      icon: musicIcons[Math.floor(Math.random() * musicIcons.length)],
      x: Math.random() * 40 - 20, // Random x offset between -20 and 20
      skill: skillName,
    }

    setMusicNotes((prev) => [...prev.slice(-4), newNote])

    // Remove note after animation (3.5 seconds)
    const timeoutId = window.setTimeout(() => {
      setMusicNotes((prev) => prev.filter((note) => note.id !== newNote.id))
    }, 3500)
    noteTimeoutsRef.current.push(timeoutId)
  }, [soundEnabled])

  return (
    <section id="skills" className="px-4 sm:px-6 py-20 sm:py-24 lg:py-28">
      <AnimatedBorder>
        <div className="max-w-6xl mx-auto font-mono p-4 sm:p-6 md:p-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                My Skills
              </h2>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-2xl hover:scale-110 transition-transform p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4">
              Powers and tools I use to build amazing things.
              <span className="block text-sm mt-2 text-green-500 font-medium">
                {soundEnabled ? '🎵 Hover over skills to hear marimba notes!' : ''}
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
                <h3 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 tracking-wider mb-6 sm:mb-8 text-center flex items-center justify-center gap-3">
                  <category.icon className="w-6 h-6" />
                  {category.title}
                </h3>
                
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {category.skills.map((skill, skillIndex) => {
                    const IconComponent = skill.icon || Box

                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.12 }}
                        transition={{
                          duration: 0.2,
                          ease: 'easeOut',
                        }}
                        whileHover={{
                          y: -8,
                          scale: 1.1,
                          transition: { type: 'spring', stiffness: 400, damping: 10 },
                        }}
                        onMouseEnter={() => handleSkillHover(categoryIndex, skillIndex, skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className="
                          flex flex-col items-center justify-center gap-3 text-center 
                          w-24 h-24 sm:w-28 sm:h-28 
                          bg-white dark:bg-gray-900 
                          p-3 rounded-xl 
                          border border-gray-200 dark:border-gray-800 
                          shadow-sm hover:shadow-xl hover:border-green-500 dark:hover:border-green-500
                          transition-all cursor-pointer group relative overflow-visible
                        "
                      >
                        {/* Floating Music Note - Realistic Animation */}
                        <AnimatePresence>
                          {hoveredSkill === skill.name && musicNotes
                            .filter((note) => note.skill === skill.name)
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
                                    rotate: -20
                                  }}
                                  animate={{
                                    opacity: [0, 1, 1, 1, 0],
                                    y: [-10, -30, -60, -90, -120],
                                    x: [0, note.x * 0.3, note.x * 0.6, note.x * 0.8, note.x],
                                    scale: [0.3, 0.8, 1.1, 1.2, 0.9],
                                    rotate: [-20, 0, 10, 5, 15]
                                  }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  transition={{
                                    duration: 2,
                                    ease: "easeOut"
                                  }}
                                  className="absolute pointer-events-none z-50"
                                  style={{
                                    left: '50%',
                                    top: '50%',
                                    color: skill.color || '#22c55e',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                                    transformOrigin: 'center',
                                    marginLeft: '-12px', // Center the note (w-6 = 24px)
                                    marginTop: '-12px'
                                  }}
                                >
                                  <NoteIcon className="w-6 h-6" strokeWidth={2.5} />
                                </motion.div>
                              )
                            })}
                        </AnimatePresence>

                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent
                            className="h-8 w-8 sm:h-10 sm:w-10 transition-colors"
                            style={{ color: skill.color }}
                          />
                        </motion.div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">
                          {skill.name}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedBorder>
    </section>
  )
}

export default Skills
