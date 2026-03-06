import { useEffect, useState } from 'react'
import { Github, ExternalLink, X, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
  caseStudySlug?: string
}

const categories: Category[] = ['All', 'React', 'JavaScript', 'Mobile']

const projects: Project[] = [
  {
    title: 'ResumeIQ',
    role: 'Full Stack Developer',
    description:
      'AI-powered resume analyzer and ATS optimizer built as a production-ready SaaS app.',
    problem:
      'Job seekers struggle to understand ATS compatibility, missing keywords, and section-level resume weaknesses.',
    solution:
      'Built a full-stack platform with secure auth, resume parsing, AI analysis, weighted ATS scoring, and downloadable reports.',
    points: [
      'Implemented Firebase Google Sign-In and protected routes with secure session cookies',
      'Built PDF/DOCX upload flow with Firebase Storage and Firestore report history',
      'Integrated OpenAI analysis for ATS score, keyword match, skill gaps, and improvements',
    ],
    learnings: [
      'Designing production-ready App Router APIs in Next.js',
      'Balancing AI outputs with deterministic scoring logic',
      'Building secure and scalable Firebase-backed SaaS workflows',
    ],
    tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Firebase', 'OpenAI'],
    category: 'React',
    featured: true,
    github: 'https://resume-iq-coral.vercel.app',
    demo: 'https://resume-iq-coral.vercel.app',
    bgImage: '/resumeiq.jpeg',
    caseStudySlug: 'resumeiq',
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
    tech: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'React Native Web', 'React Navigation', 'Axios', 'React Native Maps'],
    category: 'Mobile',
    featured: true,
    github: 'https://github.com/sourav81R/EstatePerks',
    demo: 'https://estate-perks.vercel.app/auth/login',
    bgImage: '/images/estate.jpeg',
    caseStudySlug: 'estateperks',
  },

  {
    title: 'Foodooza (Food Delivery App)',
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
    tech: [
      'React (Vite)',
      'Redux Toolkit / Context API',
      'Tailwind CSS',
      'Socket.IO Client',
      'Node.js',
      'Express.js',
      'MongoDB + Mongoose',
      'JWT / Cookies',
      'Stripe / Razorpay',
      'Cloudinary / Multer',
    ],
    category: 'React',
    github: 'https://github.com/sourav81R/Food-App',
    demo: 'https://food-app-frontend-lh2k.onrender.com/',
    bgImage: '/images/food.jpeg',
    caseStudySlug: 'foodooza',
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
    tech: ['React 18', 'React Router', 'Axios', 'React Leaflet', 'Node.js', 'Express', 'Mongoose', 'JWT', 'bcryptjs', 'MongoDB', 'helmet', 'cors', 'express-rate-limit', 'nodemailer'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Employee-Management',
    demo: 'https://employee-management-ivory-mu.vercel.app/login',
    bgImage: '/employee.jpeg',
  },

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
    title: 'PollRoom',
    role: 'Full Stack Developer',
    description:
      'Real-time polling application where users can create polls, vote, and see live updates.',
    problem:
      'Standard polling often lacks real-time interactivity and instant feedback.',
    solution:
      'Built a full-stack app with Socket.IO for real-time updates and robust auth.',
    points: [
      'Real-time result updates via Socket.IO',
      'Secure Auth (JWT + Google OAuth)',
      'Fairness mechanisms (1 vote/identity)',
    ],
    learnings: [
      'WebSocket implementation',
      'Authentication strategies',
      'Database schema for polling',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    category: 'React',
    featured: true,
    github: 'https://github.com/sourav81R/realtime-poll-app',
    demo: 'https://realtime-poll-app-one.vercel.app',
    bgImage: '/poll.webp',
    caseStudySlug: 'pollroom',
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
    tech: ['React 18', 'React Router', 'Axios', 'React Leaflet', 'Node.js', 'Express', 'Mongoose', 'JWT', 'bcryptjs', 'MongoDB', 'helmet', 'cors', 'express-rate-limit', 'nodemailer'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Quiz-App',
    demo: 'https://quiz-app-ebon-five-26.vercel.app',
    bgImage: '/quiz.png',
  },

  {
    title: 'Regional Weather Studio',
    role: 'Full Stack + ML Developer',
    description:
      'Flask + JavaScript weather intelligence platform combining API weather data, ML prediction, sky vision, maps, alerts, and offline-ready PWA support.',
    problem:
      'Typical weather apps show raw data but lack unified decision support, hyperlocal fusion, and resilient offline behavior.',
    solution:
      'Engineered a dual-runtime weather studio with backend intelligence services and automatic static fallback when APIs/backend are unavailable.',
    points: [
      'Built Flask APIs for weather, analytics, AI insights, alerts, travel planning, agriculture advisory, and rule-based chatbot workflows',
      'Implemented ML next-day forecasting and vision-based sky condition detection (upload + live camera) with hyperlocal fusion scoring',
      'Shipped storm-aware weather maps, PWA installability, service-worker caching, and offline forecast fallback engine',
    ],
    learnings: [
      'Designing reliable backend-first apps with graceful static-mode degradation',
      'Combining probabilistic signals from API, ML, sky vision, and satellite/map inputs into a confidence-weighted forecast',
      'Operationalizing model-dependent features with safe fallback logic when TensorFlow/OpenCV artifacts are unavailable',
    ],
    tech: ['Python', 'Flask', 'JavaScript', 'SQLite', 'scikit-learn', 'TensorFlow/Keras', 'OpenCV', 'Chart.js', 'Leaflet', 'OpenWeather API', 'Open-Meteo API', 'PWA'],
    category: 'JavaScript',
    github:
      'https://github.com/sourav81R/weather-forecasting-religion-language',
    demo: 'https://weather-forecasting-religion-langua.vercel.app/',
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
    tech: ['React 18', 'React Router', 'Axios', 'React Leaflet', 'Node.js', 'Express', 'Mongoose', 'JWT', 'bcryptjs', 'MongoDB', 'helmet', 'cors', 'express-rate-limit', 'nodemailer'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Currency-Converter',
    demo: 'https://sourav81r.github.io/Currency-Converter/',
    bgImage: '/images/currency.png',
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
    tech: ['React 18', 'React Router', 'Axios', 'React Leaflet', 'Node.js', 'Express', 'Mongoose', 'JWT', 'bcryptjs', 'MongoDB', 'helmet', 'cors', 'express-rate-limit', 'nodemailer'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Rock-Paper-Scissor',
    demo: 'https://sourav81r.github.io/Rock-Paper-Scissor/',
    bgImage: '/images/game.jpeg',
  },
]

const prioritizedProjectOrder = [
  'Foodooza (Food Delivery App)',
  'ResumeIQ',
  'EstatePerks',
  'Employee Management',
  'Regional Weather Studio',
  'PollRoom',
  'Quiz App',
]

const projectOrderMap = new Map(
  prioritizedProjectOrder.map((title, index) => [title, index])
)

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const navigate = useNavigate()

  const INITIAL_PROJECTS_COUNT = 6
  const sortedProjects = [...projects].sort((a, b) => {
    const aOrder = projectOrderMap.get(a.title)
    const bOrder = projectOrderMap.get(b.title)

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder
    }
    if (aOrder !== undefined) {
      return -1
    }
    if (bOrder !== undefined) {
      return 1
    }
    return 0
  })

  const filteredProjects = sortedProjects.filter(
    (project) =>
      (selectedCategory === 'All' || project.category === selectedCategory) &&
      (!featuredOnly || Boolean(project.featured))
  )
  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, INITIAL_PROJECTS_COUNT)
  const hasMoreProjects = filteredProjects.length > INITIAL_PROJECTS_COUNT

  useEffect(() => {
    setShowAll(false)
  }, [selectedCategory, featuredOnly])

  const openProjectDetails = (project: Project) => {
    if (project.caseStudySlug) {
      navigate(`/case-studies/${project.caseStudySlug}`)
      return
    }
    setSelectedProject(project)
  }

  return (
    <section id="projects" className="section-padding relative overflow-hidden py-20 sm:py-24 lg:py-28 px-4 sm:px-6">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <AnimatedBorder>
        <div className="max-w-6xl mx-auto relative z-10 font-mono p-4 sm:p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.25 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-wider mb-4">
              Projects
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
              A selection of my work, from full-stack applications to fun experiments.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4 mb-8 sm:mb-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-black border-gray-900 dark:border-white'
                      : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setFeaturedOnly((prev) => !prev)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors ${
                  featuredOnly
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-500'
                }`}
              >
                {featuredOnly ? 'Featured Only: ON' : 'Featured Only: OFF'}
              </button>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProjects.length} project
                {filteredProjects.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayedProjects.map((project) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <motion.div
                  className="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-lg group"
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Project Image */}
                  <div
                    className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden cursor-pointer"
                    onClick={() => openProjectDetails(project)}
                  >
                    <img
                      src={project.bgImage}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Shine effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg line-clamp-1">
                        {project.title}
                      </h3>
                    </div>

                    {/* View icon hint */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 p-2 rounded-full border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white"
                    >
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  </div>

                  {/* Project Content */}
                  <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {project.tech.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded border border-gray-900/30 dark:border-white/30"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium border border-gray-900/30 dark:border-white/30 rounded text-gray-500">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-auto">
                      {/* Top row: Details and Demo side by side */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openProjectDetails(project)}
                          className="flex-1 h-9 sm:h-10 flex items-center justify-center gap-2 px-3 text-xs sm:text-sm font-bold border-2 border-gray-900 dark:border-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Details
                        </button>
                        <a
                          href={project.demo || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 h-9 sm:h-10 flex items-center justify-center gap-2 px-3 text-xs sm:text-sm font-bold border-2 border-gray-900 dark:border-white rounded-md transition-colors bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 ${!project.demo ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={(e) => !project.demo && e.preventDefault()}
                        >
                          <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Live Demo</span>
                          <span className="sm:hidden">Demo</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              No projects match this filter yet.
            </div>
          )}

          {/* View More Projects Button */}
          {hasMoreProjects && (
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="group flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Show Less Projects</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    <span>
                      View More Projects ({filteredProjects.length - INITIAL_PROJECTS_COUNT} more)
                    </span>
                  </>
                )}
              </button>
            </motion.div>
          )}
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
    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-3 sm:px-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="relative max-w-3xl w-full bg-gray-50 dark:bg-gray-950 rounded-xl p-4 sm:p-6 md:p-10 font-mono max-h-[90vh] overflow-y-auto"
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

      <h2 className="pr-8 text-xl sm:text-2xl font-bold mb-2">{project.title}</h2>
      <p className="text-green-500 mb-6">{project.role}</p>

      <Section title="Problem" text={project.problem} />
      <Section title="Solution" text={project.solution} />
      <List title="Key Contributions" items={project.points} />
      <List title="What I Learned" items={project.learnings} />

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
        <a href={project.github} target="_blank" className="flex items-center gap-2 break-all">
          <Github size={18} /> GitHub
        </a>
        {project.demo && (
          <a href={project.demo} target="_blank" className="flex items-center gap-2 break-all">
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



