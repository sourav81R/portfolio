import { useState, useEffect } from 'react'
import { Github, ExternalLink, X, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import './About.css'

type Category = 'All' | 'React' | 'JavaScript' | 'Mobile'

type Project = {
  title: string
  role: string
  description: string
  problem: string
  solution: string
  points: string[]
  learnings: string[]
  tech: string[]
  category: Category
  featured?: boolean
  github: string
  demo?: string
   bgImage: string
  video?: string
}

const projects: Project[] = [
  {
    title: 'VerifyAI',
    role: 'Team Member & Frontend Lead',
    description:
      'AI-powered platform to detect fake news and deepfake content.',
    problem:
      'AI-generated misinformation is difficult to verify quickly and reliably.',
    solution:
      'Built a real-time verification dashboard using React and API-driven validation.',
    points: [
      'Designed data-heavy UI components',
      'Integrated verification APIs',
      'Handled error states and edge cases',
    ],
    learnings: [
      'Scalable UI design',
      'API performance optimization',
      'Team collaboration',
    ],
    tech: ['React', 'JavaScript', 'REST APIs'],
    category: 'React',
    featured: true,
    github: 'https://github.com/sourav81R/VerifyAI',
    demo: 'https://hakkanshah.github.io/VerifyAI/',
    bgImage: '/images/verifyai.jpeg',
    video:
      'https://cdn.coverr.com/videos/coverr-typing-on-computer-keyboard-4643/1080p.mp4',
  },

  {
    title: 'EstatePerks',
    role: 'Mobile Application Developer',
    description:
      'Cross-platform mobile app for property visit tracking and rewards.',
    problem:
      'Property visits and reward tracking were being handled manually.',
    solution:
      'Built a React Native app to automate visits, rewards, and navigation.',
    points: [
      'Multi-screen navigation',
      'Context API state management',
      'REST API integration',
    ],
    learnings: [
      'Mobile UX design',
      'React Native architecture',
      'State management patterns',
    ],
    tech: ['React Native', 'Expo', 'REST APIs'],
    category: 'Mobile',
    featured: true,
    github: 'https://github.com/sourav81R/EstatePerks',
    demo: 'https://estate-perks.vercel.app/auth/login',
    bgImage: '/images/estate.jpeg',
  },

  {
    title: 'PetPooja (Food Delivery App)',
    role: 'Full Stack Developer',
    description:
      'Real-time food delivery app with authentication and database integration.',
    problem:
      'Traditional food ordering lacked real-time updates and automation.',
    solution:
      'Developed a full-stack application with authentication and live data.',
    points: [
      'Frontend and backend integration',
      'Authentication workflows',
      'Database consistency handling',
    ],
    learnings: [
      'Full-stack architecture',
      'Auth systems',
      'Backend debugging',
    ],
    tech: ['React', 'Node.js', 'MongoDB'],
    category: 'React',
    github: 'https://github.com/sourav81R/Food-App',
    demo: 'https://food-app-frontend-lh2k.onrender.com/signin',
    bgImage: '/images/food.jpeg',
  },

  {
    title: 'Weather App (Regional)',
    role: 'Frontend Developer',
    description:
      'Weather application with regional language support.',
    problem:
      'Most weather apps ignore local language accessibility.',
    solution:
      'Built a multilingual UI with weather API integration.',
    points: [
      'Responsive UI',
      'Dynamic API data handling',
      'Language preference storage',
    ],
    learnings: [
      'Async JavaScript',
      'API error handling',
      'Localization basics',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github:
      'https://github.com/sourav81R/weather-forecasting-religion-language',
      bgImage: '/images/weather.jpeg',
  },

  {
    title: 'Currency Converter',
    role: 'Frontend Developer',
    description:
      'Web utility to convert currency using live exchange rates.',
    problem:
      'Users needed a fast and simple currency conversion tool.',
    solution:
      'Built a lightweight UI with real-time exchange rate APIs.',
    points: [
      'Live API integration',
      'Form validation',
      'Clean UI design',
    ],
    learnings: [
      'API data formatting',
      'User input validation',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Currency-Converter',
    demo: 'https://sourav81r.github.io/Currency-Converter/',
    bgImage: '/images/currency.png',
  },

  {
    title: 'Quiz App',
    role: 'Frontend Developer',
    description:
      'Interactive quiz application with scoring and feedback.',
    problem:
      'Static quizzes lacked engagement and feedback.',
    solution:
      'Created a dynamic quiz with scoring logic and feedback.',
    points: [
      'Dynamic question loading',
      'Score tracking',
      'User-friendly UI',
    ],
    learnings: [
      'Conditional rendering',
      'State-driven UI',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Quiz-App',
    demo: 'https://quiz-app-ebon-five-26.vercel.app',
    bgImage: '/images/quiz.jpeg',
  },

  {
    title: 'Rock-Paper-Scissor Game',
    role: 'Game UI Developer',
    description:
      'Classic browser-based Rock Paper Scissors game.',
    problem:
      'Simple games often lack clean logic separation.',
    solution:
      'Built game logic with score tracking and replay.',
    points: [
      'Core game logic',
      'Responsive UI',
      'Score management',
    ],
    learnings: [
      'Game logic design',
      'Event handling',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Rock-Paper-Scissor',
    demo: 'https://sourav81r.github.io/Rock-Paper-Scissor/',
    bgImage: '/images/game.jpeg',
  },

  {
    title: 'Employee Management',
    role: 'Fullstack Learner',
    description:
      'Basic CRUD application for managing employee records.',
    problem:
      'Manual employee record management was inefficient.',
    solution:
      'Built a CRUD-based UI for managing employees.',
    points: [
      'CRUD operations',
      'Form handling',
      'State management',
    ],
    learnings: [
      'Data modeling',
      'Form validation',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Employee-Management',
    demo: 'https://employee-management-ivory-mu.vercel.app/login',
    bgImage: '/images/employee.jpeg',
  },
]

const filters: Category[] = ['All', 'React', 'JavaScript', 'Mobile']

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<Category>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [stars, setStars] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchStars = async () => {
      const newStars: Record<string, number> = {}
      await Promise.all(
        projects.map(async (project) => {
          try {
            const repo = project.github.split('/').slice(-2).join('/')
            const res = await fetch(`https://api.github.com/repos/${repo}`)
            const data = await res.json()
            if (typeof data.stargazers_count === 'number') {
              newStars[project.title] = data.stargazers_count
            }
          } catch (e) {
            console.error(e)
          }
        })
      )
      setStars(newStars)
    }
    fetchStars()
  }, [])

  const text = 'Projects'
  const colors = [
    '#ff0000',
    '#ff7f00',
    '#ffff00',
    '#00ff00',
    '#0000ff',
    '#4b0082',
    '#9400d3',
  ]

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="px-6 py-28">
      <AnimatedBorder>
        <div className="max-w-6xl mx-auto font-mono p-6 md:p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight animated-text">
            {text.split('').map((char, index) => (
              <span
                key={index}
                style={{
                  color: colors[index % colors.length],
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {char}
              </span>
            ))}
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-14">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 rounded-full border text-sm transition ${
                  activeFilter === filter
                    ? 'border-green-500 text-green-500'
                    : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid md:grid-cols-2 gap-10">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative border border-white/10 rounded-xl bg-gray-900/50 backdrop-blur-md overflow-hidden group shadow-lg"
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src={project.bgImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {project.video && (
                      <video
                        src={project.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-500" />
                  </div>

                  <div className="relative z-10 p-6">
                    {project.featured && (
                      <span className="absolute top-4 right-4 text-xs px-2 py-1 border border-green-500 text-green-500 rounded-full bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-sm">
                        Featured
                      </span>
                    )}

                    <h3 className="text-xl font-semibold mb-1 animated-text">
                      {project.title.split('').map((char, i) => (
                        <span
                          key={i}
                          style={{
                            color: colors[i % colors.length],
                            animationDelay: `${i * 0.1}s`,
                          }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </h3>
                    <p className="text-green-400 text-sm mb-3">
                      {project.role}
                    </p>

                    <p className="text-gray-300 mb-4">
                      {project.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-green-400 text-sm hover:underline"
                      >
                        View Case Study →
                      </button>
                      {stars[project.title] !== undefined && (
                        <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm border border-yellow-500/30">
                          <Star size={12} fill="currentColor" />
                          <span>{stars[project.title]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </AnimatedBorder>

      {/* MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects

/* ---------------- MODAL ---------------- */

const ProjectModal = ({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="relative max-w-3xl w-full bg-gray-50 dark:bg-gray-950 rounded-xl p-6 md:p-10 font-mono max-h-[90vh] overflow-y-auto"
      initial={{ scale: 0.9, y: 40 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 40 }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
      >
        <X />
      </button>

      <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
      <p className="text-green-500 mb-6">{project.role}</p>

      <Section title="Problem" text={project.problem} />
      <Section title="Solution" text={project.solution} />
      <List title="Key Contributions" items={project.points} />
      <List title="What I Learned" items={project.learnings} />

      <div className="flex gap-4 mt-6">
        <a href={project.github} target="_blank" className="flex gap-2">
          <Github size={18} /> GitHub
        </a>
        {project.demo && (
          <a href={project.demo} target="_blank" className="flex gap-2">
            <ExternalLink size={18} /> Live Demo
          </a>
        )}
      </div>
    </motion.div>
  </motion.div>
)

const Section = ({ title, text }: { title: string; text: string }) => (
  <div className="mt-6">
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-gray-700 dark:text-gray-400">{text}</p>
  </div>
)

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-6">
    <h3 className="font-semibold mb-2">{title}</h3>
    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-400">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
)
