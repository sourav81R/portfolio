import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ExternalLink,
  Github,
  GripVertical,
  LoaderCircle,
  Search,
  Sparkles,
  Video,
  X,
} from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'
import { projects as projectData, type ProjectCategory, type ProjectRecord } from '../../data/projects'
import { getSectionRevealProps } from '../../lib/motion'
import { useAppStore } from '../../store/useAppStore'
import { useProjectDiscovery } from '../../hooks/useProjectDiscovery'

type Category = 'All' | ProjectCategory

const categories: Category[] = ['All', 'Web', 'AI', 'Mobile', 'Realtime']
const projectFallbackImage = `${import.meta.env.BASE_URL}og-preview.png`

const Projects = () => {
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const recruiterMode = useAppStore((state) => state.recruiterMode)
  const projectOrder = useAppStore((state) => state.projectOrder)
  const initializeProjectOrder = useAppStore((state) => state.initializeProjectOrder)
  const reorderProjects = useAppStore((state) => state.reorderProjects)
  const recordProjectInteraction = useAppStore((state) => state.recordProjectInteraction)

  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [draggingSlug, setDraggingSlug] = useState<string | null>(null)
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string | null>(null)

  useEffect(() => {
    initializeProjectOrder(projectData)
  }, [initializeProjectOrder])

  const { filteredProjects, inferredGoals, recommendedProjects, totalProjects } =
    useProjectDiscovery({
      allProjects: projectData,
      query,
      selectedCategory,
      featuredOnly,
      recruiterMode,
      projectOrder,
    })

  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <AnimatedBorder>
        <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-10">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs uppercase tracking-[0.26em] text-sky-600 dark:text-sky-400">
                Projects System
              </p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Searchable, draggable, recruiter-aware project showcase
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
              This section now acts like a product surface: smart filtering, drag-and-drop ordering, recruiter prioritization, and richer previews.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/50 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-sky-600 text-white'
                        : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-full border border-gray-300 bg-white/80 px-4 py-2 dark:border-gray-700 dark:bg-gray-950/60">
                  <Search size={16} className="text-gray-500" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Smart search projects..."
                    className="bg-transparent text-sm outline-none dark:text-white"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setFeaturedOnly((prev) => !prev)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    featuredOnly
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
                  }`}
                >
                  {featuredOnly ? 'Featured only' : 'Show featured'}
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProjects.length} of {totalProjects} projects
                {query.trim() ? ` for "${query.trim()}"` : ''}
              </p>
              {inferredGoals.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-400">
                    <Sparkles size={14} />
                    AI matched goals
                  </span>
                  {inferredGoals.map((goal) => (
                    <span
                      key={goal}
                      className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {recommendedProjects.length > 0 && (
            <div className="mb-8 grid gap-4 lg:grid-cols-3">
              {recommendedProjects.map((project, index) => (
                <motion.button
                  key={project.slug}
                  type="button"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 0.22, delay: index * 0.05 }
                  }
                  onClick={() => {
                    setSelectedProject(project)
                    recordProjectInteraction(project.slug)
                  }}
                  className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-4 text-left hover:border-fuchsia-400"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-fuchsia-700 dark:text-fuchsia-300">
                      <Sparkles size={14} />
                      Recommended
                    </span>
                    <span className="text-xs text-fuchsia-700/80 dark:text-fuchsia-300/80">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{project.impact}</p>
                </motion.button>
              ))}
            </div>
          )}

          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                (() => {
                  const isHovered = hoveredProjectSlug === project.slug

                  return (
                    <motion.article
                      key={project.slug}
                      layout
                      draggable
                      onHoverStart={() => setHoveredProjectSlug(project.slug)}
                      onHoverEnd={() =>
                        setHoveredProjectSlug((current) =>
                          current === project.slug ? null : current
                        )
                      }
                      onDragStart={() => setDraggingSlug(project.slug)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (draggingSlug && draggingSlug !== project.slug) {
                          reorderProjects(draggingSlug, project.slug)
                        }
                        setDraggingSlug(null)
                      }}
                      onDragEnd={() => setDraggingSlug(null)}
                      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                      transition={reduceMotion ? undefined : { duration: 0.24 }}
                      className="group"
                    >
                      <div className="h-full [perspective:1000px]">
                        <motion.div
                          animate={
                            reduceMotion
                              ? undefined
                              : {
                                  rotateY: isHovered ? 360 : 0,
                                }
                          }
                          transition={
                            reduceMotion
                              ? undefined
                              : isHovered
                                ? { duration: 0.7, ease: 'easeInOut' }
                                : { duration: 0 }
                          }
                          className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/70 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 will-change-transform"
                          style={{
                            transformStyle: 'preserve-3d',
                            willChange: 'transform',
                          }}
                        >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={project.bgImage}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          onError={(event) => {
                            event.currentTarget.onerror = null
                            event.currentTarget.src = projectFallbackImage
                          }}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                          <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                            {project.category}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                            <GripVertical size={12} />
                            Drag
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                          <p className="mt-1 text-sm text-white/80">{project.role}</p>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {project.description}
                        </p>

                        {recruiterMode && (
                          <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                              Recruiter Highlight
                            </p>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                              {project.impact}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tech.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProject(project)
                              recordProjectInteraction(project.slug)
                            }}
                            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
                          >
                            Preview
                          </button>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => recordProjectInteraction(project.slug)}
                              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
                            >
                              <ExternalLink size={15} />
                              Live
                            </a>
                          )}
                        </div>
                      </div>
                        </motion.div>
                      </div>
                    </motion.article>
                  )
                })()
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-950/40">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">No projects matched this query</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Try a broader keyword like React, AI, mobile, API, or realtime.
              </p>
            </div>
          )}
        </div>
      </AnimatedBorder>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const ProjectModal = ({
  project,
  onClose,
}: {
  project: ProjectRecord
  onClose: () => void
}) => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview' | 'preview'>('overview')
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    setTab('overview')
    setIframeLoaded(false)
  }, [project.slug])

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 px-3 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 md:p-8"
        initial={{ scale: 0.95, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 24 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:text-red-500"
        >
          <X size={18} />
        </button>

        <div className="overflow-hidden rounded-2xl">
          <img
            src={project.bgImage}
            alt={project.title}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = projectFallbackImage
            }}
            className="h-60 w-full object-cover sm:h-72"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">{project.category}</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{project.title}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{project.role}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab('overview')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${tab === 'overview' ? 'bg-sky-600 text-white' : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${tab === 'preview' ? 'bg-sky-600 text-white' : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}
            >
              Preview
            </button>
          </div>
        </div>

        {tab === 'overview' ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <ContentCard title="Problem" content={project.problem} />
              <ContentCard title="Solution" content={project.solution} />
              <BulletCard title="Key Contributions" items={project.points} />
              <BulletCard title="What I Learned" items={project.learnings} />
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Tech Stack</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-950/50 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Actions</p>
                <div className="mt-4 grid gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
                  >
                    <Github size={15} />
                    GitHub
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
                    >
                      <ExternalLink size={15} />
                      Open Live Demo
                    </a>
                  )}
                  {project.caseStudySlug && (
                    <button
                      type="button"
                      onClick={() => navigate(`/case-studies/${project.caseStudySlug}`)}
                      className="rounded-full border border-sky-500/30 px-4 py-2 text-sm font-semibold text-sky-600 dark:text-sky-400"
                    >
                      Read Case Study
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {project.previewVideo ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black dark:border-gray-800">
                <video src={project.previewVideo} controls className="h-full w-full" />
              </div>
            ) : project.liveUrl ? (
              <div className="relative h-[56vh] overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 dark:bg-black/80">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-flex"
                      >
                        <LoaderCircle size={18} />
                      </motion.span>
                      Loading live preview...
                    </div>
                  </div>
                )}
                <iframe
                  src={project.liveUrl}
                  title={`${project.title} live preview`}
                  className="h-full w-full"
                  loading="lazy"
                  onLoad={() => setIframeLoaded(true)}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                <span className="inline-flex items-center gap-2">
                  <Video size={16} />
                  Video preview support is built in, but this project currently uses image and live-demo previews.
                </span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

const ContentCard = ({ title, content }: { title: string; content: string }) => (
  <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-900/50">
    <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{content}</p>
  </div>
)

const BulletCard = ({ title, items }: { title: string; items: string[] }) => (
  <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-900/50">
    <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

export default Projects
