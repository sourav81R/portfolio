import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type SyntheticEvent,
} from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ExternalLink,
  Github,
  GripVertical,
  LoaderCircle,
  Sparkles,
  Video,
  X,
} from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'
import ProjectFilterPanel from '../common/ProjectFilterPanel'
import {
  projects as projectData,
  projectTypeLabels,
  type ProjectRecord,
} from '../../data/projects'
import useCoarsePointer from '../../hooks/useCoarsePointer'
import { getSectionRevealProps } from '../../lib/motion'
import { useAppStore } from '../../store/useAppStore'
import {
  useProjectDiscovery,
  type CategoryFilter,
  type TypeFilter,
} from '../../hooks/useProjectDiscovery'

const projectFallbackImage = `${import.meta.env.BASE_URL}og-preview.png`

/**
 * Covers ship as WebP with a JPEG twin beside them. The handful of browsers
 * without WebP support get the JPEG first, and only then the generic preview,
 * so a cover never degrades straight to the site-wide OG image.
 */
const handleCoverError = (
  event: SyntheticEvent<HTMLImageElement, Event>
) => {
  const image = event.currentTarget

  if (image.src.endsWith('.webp')) {
    image.src = image.src.replace(/.webp$/, '.jpg')
    return
  }

  image.onerror = null
  image.src = projectFallbackImage
}
const INITIAL_VISIBLE_PROJECTS = 6
const mobileSpinKeyframes = [0, 90, 180, 270, 360]
const mobileSpinTransition: Transition = {
  duration: 0.7,
  ease: 'easeInOut',
  times: [0, 0.28, 0.56, 0.82, 1],
}

const Projects = () => {
  const reduceMotion = useReducedMotion()
  const isCoarsePointer = useCoarsePointer()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  const recruiterMode = useAppStore((state) => state.recruiterMode)
  const projectOrder = useAppStore((state) => state.projectOrder)
  const initializeProjectOrder = useAppStore((state) => state.initializeProjectOrder)
  const reorderProjects = useAppStore((state) => state.reorderProjects)
  const recordProjectInteraction = useAppStore((state) => state.recordProjectInteraction)

  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null)
  const [selectedType, setSelectedType] = useState<TypeFilter>('All')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [draggingSlug, setDraggingSlug] = useState<string | null>(null)
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string | null>(null)
  const [projectTapRotations, setProjectTapRotations] = useState<Record<string, number>>({})
  const [visibleProjectCount, setVisibleProjectCount] = useState(INITIAL_VISIBLE_PROJECTS)

  useEffect(() => {
    initializeProjectOrder(projectData)
  }, [initializeProjectOrder])

  const {
    filteredProjects,
    typeCounts,
    inferredGoals,
    recommendedProjects,
    totalProjects,
  } = useProjectDiscovery({
    allProjects: projectData,
    query,
    selectedType,
    selectedCategory,
    featuredOnly,
    recruiterMode,
    projectOrder,
  })

  useEffect(() => {
    setVisibleProjectCount(INITIAL_VISIBLE_PROJECTS)
  }, [selectedType, selectedCategory, featuredOnly, query, recruiterMode])

  const hasActiveFilters =
    selectedType !== 'All' ||
    selectedCategory !== 'All' ||
    featuredOnly ||
    query.trim().length > 0

  const resetFilters = () => {
    setSelectedType('All')
    setSelectedCategory('All')
    setFeaturedOnly(false)
    setQuery('')
  }

  const visibleProjects = filteredProjects.slice(0, visibleProjectCount)
  const hasMoreProjects = filteredProjects.length > visibleProjectCount
  const canToggleProjectVisibility =
    filteredProjects.length > INITIAL_VISIBLE_PROJECTS

  const handleProjectCardClick =
    (slug: string) => (event: MouseEvent<HTMLDivElement>) => {
      if (!isCoarsePointer || reduceMotion) return

      const target = event.target as HTMLElement
      if (target.closest('button, a, input, textarea, iframe, video')) {
        return
      }

      setProjectTapRotations((current) => ({
        ...current,
        [slug]: (current[slug] ?? 0) + 1,
      }))
    }

  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <AnimatedBorder>
        <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-10">
          <div className="mb-6 sm:mb-8">
            <p className="mb-2 text-xs uppercase tracking-[0.26em] text-sky-600 dark:text-sky-400">
              Projects
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Selected work
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Live client products, platforms, and personal builds.
            </p>
          </div>

          <ProjectFilterPanel
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            typeCounts={typeCounts}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            featuredOnly={featuredOnly}
            onFeaturedChange={setFeaturedOnly}
            query={query}
            onQueryChange={setQuery}
            visibleCount={visibleProjects.length}
            matchCount={filteredProjects.length}
            totalCount={totalProjects}
            inferredGoals={inferredGoals}
            onReset={resetFilters}
          />

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
                      {projectTypeLabels[project.type]}
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
              {visibleProjects.map((project) => (
                (() => {
                  const isHovered = hoveredProjectSlug === project.slug
                  const projectTapCount = projectTapRotations[project.slug] ?? 0
                  const shouldSpinOnTap = isCoarsePointer && projectTapCount > 0
                  const projectRotation = isHovered ? 360 : 0

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
                          key={shouldSpinOnTap ? `${project.slug}-${projectTapCount}` : project.slug}
                          onClick={handleProjectCardClick(project.slug)}
                          initial={{ rotateY: 0 }}
                          animate={
                            reduceMotion
                              ? undefined
                              : shouldSpinOnTap
                                ? {
                                    rotateY: mobileSpinKeyframes,
                                  }
                                : {
                                  rotateY: projectRotation,
                                }
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
                          onError={handleCoverError}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                          <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                            {projectTypeLabels[project.type]}
                          </span>
                          {!isCoarsePointer && (
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                            <GripVertical size={12} />
                            Drag
                          </span>
                          )}
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

          {canToggleProjectVisibility && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {hasMoreProjects
                  ? `${filteredProjects.length - visibleProjects.length} more ${
                      filteredProjects.length - visibleProjects.length === 1
                        ? 'project'
                        : 'projects'
                    } available`
                  : `All ${filteredProjects.length} projects shown`}
              </p>
              <motion.button
                type="button"
                onClick={() =>
                  setVisibleProjectCount(
                    hasMoreProjects ? filteredProjects.length : INITIAL_VISIBLE_PROJECTS
                  )
                }
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                  hasMoreProjects
                    ? 'border-sky-400/60 bg-sky-500 text-white shadow-sky-500/30 hover:bg-sky-400 hover:border-sky-300'
                    : 'border-fuchsia-400/60 bg-fuchsia-500 text-white shadow-fuchsia-500/30 hover:bg-fuchsia-400 hover:border-fuchsia-300'
                }`}
              >
                <Sparkles size={16} />
                {hasMoreProjects ? 'View More Projects' : 'View Less'}
              </motion.button>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-950/40">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">No projects matched these filters</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Try a broader keyword like React, AI, mobile, API, or realtime, or switch project type.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-500"
                >
                  Clear filters
                </button>
              )}
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
  const titleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [tab, setTab] = useState<'overview' | 'preview'>('overview')
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    setTab('overview')
    setIframeLoaded(false)
  }, [project.slug])

  // The parent passes a new inline onClose each render; reading it through a
  // ref keeps the effect below mount-only, so focus is not re-stolen.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Keyboard users land on the close button, and Escape closes the modal.
  useEffect(() => {
    closeButtonRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 px-4 sm:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* The card is split in two so the close button can live outside the
          scroll container: it never scrolls away and is not clipped when it
          overhangs the corner. */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-5xl"
        initial={{ scale: 0.95, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 24 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={`Close ${project.title} details`}
          title="Close (Esc)"
          className="absolute -right-3 -top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg shadow-black/40 ring-2 ring-white transition hover:bg-red-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 motion-safe:hover:scale-110 dark:bg-gray-800 dark:ring-white/80 dark:hover:bg-red-500 sm:-right-4 sm:-top-4 sm:h-11 sm:w-11"
        >
          <X size={20} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div
          data-lenis-prevent
          className="max-h-[88vh] overflow-y-auto rounded-2xl bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 md:p-8"
        >
        <div className="overflow-hidden rounded-2xl">
          <img
            src={project.bgImage}
            alt={project.title}
            loading="lazy"
            decoding="async"
            onError={handleCoverError}
            className="h-60 w-full object-cover sm:h-72"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
              {projectTypeLabels[project.type]} · {project.category}
            </p>
            <h2 id={titleId} className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{project.title}</h2>
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
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      <Github size={15} />
                      GitHub
                    </a>
                  )}
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
            ) : project.liveUrl && project.embeddable === false ? (
              <div className="relative h-[56vh] overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 dark:border-gray-800">
                <img
                  src={project.bgImage}
                  alt={`${project.title} homepage`}
                  loading="lazy"
                  decoding="async"
                  onError={handleCoverError}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-center">
                  <p className="max-w-md text-sm text-white/85">
                    This site blocks embedded previews for security, so open it in a new tab to explore it live.
                  </p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-lg transition hover:bg-sky-50"
                  >
                    <ExternalLink size={15} />
                    Open live site
                  </a>
                </div>
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
        </div>
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
