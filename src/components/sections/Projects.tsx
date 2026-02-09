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

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="px-6 py-28">
      <AnimatedBorder>
        <div className="max-w-6xl mx-auto font-mono p-6 md:p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight">
            {text}
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-14">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="relative px-4 py-2 rounded-full text-sm font-medium transition focus:outline-none"
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-green-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${activeFilter === filter ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400'}`}>
                  {filter}
                </span>
                {activeFilter !== filter && (
                  <div className="absolute inset-0 rounded-full border border-gray-300 dark:border-gray-700" />
                )}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid md:grid-cols-2 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="
                    flex flex-col h-full
                    rounded-xl
                    bg-gray-50 dark:bg-gray-900/50
                    border border-gray-200 dark:border-gray-800
                    hover:border-green-500 dark:hover:border-green-500
                    transition-all duration-300
                    shadow-sm hover:shadow-md
                    group overflow-hidden
                  "
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={project.bgImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                    {project.featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-xs px-2 py-1 font-medium border border-green-500/30 text-green-600 dark:text-green-400 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      {stars[project.title] !== undefined && (
                        <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400 text-xs font-medium bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                          <Star size={12} fill="currentColor" />
                          <span>{stars[project.title]}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-4">
                      {project.role}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed text-sm">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-green-500 dark:hover:text-green-400 transition-colors"
                      >
                        View Case Study →
                      </button>
                      
                      <div className="flex gap-3">
                         <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Github size={18} />
                         </a>
                         {project.demo && (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <ExternalLink size={18} />
                            </a>
                         )}
                      </div>
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
