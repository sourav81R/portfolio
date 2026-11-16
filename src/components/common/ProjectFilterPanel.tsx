import { useRef, type ComponentType } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import {
  BrainCircuit,
  Cpu,
  Globe,
  Layers,
  LayoutGrid,
  MonitorSmartphone,
  Radio,
  Search,
  Smartphone,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import {
  projectTypeDescriptions,
  projectTypeFilterLabels,
  projectTypes,
} from '../../data/projects'
import type { CategoryFilter, TypeFilter } from '../../hooks/useProjectDiscovery'

type IconComponent = ComponentType<{ size?: number; className?: string }>

const typeFilters: TypeFilter[] = ['All', ...projectTypes]
const categories: CategoryFilter[] = ['All', 'Web', 'AI', 'Mobile', 'Realtime']

const typeIcons: Record<TypeFilter, IconComponent> = {
  All: LayoutGrid,
  Frontend: MonitorSmartphone,
  'Full Stack': Layers,
  Software: Cpu,
}

const categoryIcons: Partial<Record<CategoryFilter, IconComponent>> = {
  Web: Globe,
  AI: BrainCircuit,
  Mobile: Smartphone,
  Realtime: Radio,
}

const getTypeLabel = (type: TypeFilter) =>
  type === 'All' ? 'All Projects' : projectTypeFilterLabels[type]

/** Phone-width labels, so the segmented control fits two per row. */
const getShortTypeLabel = (type: TypeFilter) => (type === 'All' ? 'All' : type)

const getTypeDescription = (type: TypeFilter) =>
  type === 'All'
    ? 'Everything I have shipped - client websites, full-stack platforms, and software products.'
    : projectTypeDescriptions[type]

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950'

type ProjectFilterPanelProps = {
  selectedType: TypeFilter
  onTypeChange: (type: TypeFilter) => void
  typeCounts: Record<TypeFilter, number>
  selectedCategory: CategoryFilter
  onCategoryChange: (category: CategoryFilter) => void
  featuredOnly: boolean
  onFeaturedChange: (featuredOnly: boolean) => void
  query: string
  onQueryChange: (query: string) => void
  visibleCount: number
  matchCount: number
  totalCount: number
  inferredGoals: readonly string[]
  onReset: () => void
}

const ProjectFilterPanel = ({
  selectedType,
  onTypeChange,
  typeCounts,
  selectedCategory,
  onCategoryChange,
  featuredOnly,
  onFeaturedChange,
  query,
  onQueryChange,
  visibleCount,
  matchCount,
  totalCount,
  inferredGoals,
  onReset,
}: ProjectFilterPanelProps) => {
  const reduceMotion = useReducedMotion()
  const searchRef = useRef<HTMLInputElement>(null)
  const trimmedQuery = query.trim()

  const indicatorTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 34 }

  const activeFilters = [
    selectedType !== 'All' && {
      key: 'type',
      label: projectTypeFilterLabels[selectedType],
      onRemove: () => onTypeChange('All'),
    },
    selectedCategory !== 'All' && {
      key: 'category',
      label: selectedCategory,
      onRemove: () => onCategoryChange('All'),
    },
    featuredOnly && {
      key: 'featured',
      label: 'Featured',
      onRemove: () => onFeaturedChange(false),
    },
    trimmedQuery && {
      key: 'query',
      label: `"${trimmedQuery}"`,
      onRemove: () => onQueryChange(''),
    },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[]

  const clearSearch = () => {
    onQueryChange('')
    searchRef.current?.focus()
  }

  return (
    <div className="mb-8 rounded-3xl border border-gray-200 bg-white/80 p-3 shadow-sm shadow-gray-900/[0.03] dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-none sm:p-4">
      {/* Row 1: project type + search */}
      {/* Side by side only at xl: below that the four labels and the search box
          do not fit on one line, and the control would wrap mid-row. */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div
          role="group"
          aria-label="Filter projects by type"
          className="grid grid-cols-2 gap-1 rounded-2xl bg-gray-100 p-1 dark:bg-gray-950/70 sm:inline-flex sm:flex-wrap sm:self-start xl:shrink-0 xl:flex-nowrap xl:self-auto"
        >
          {typeFilters.map((type) => {
            const isActive = selectedType === type
            const Icon = typeIcons[type]

            return (
              <button
                key={type}
                type="button"
                aria-pressed={isActive}
                onClick={() => onTypeChange(type)}
                className={clsx(
                  'relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors sm:justify-start sm:px-4',
                  focusRing,
                  isActive
                    ? 'text-sky-700 dark:text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="project-type-indicator"
                    transition={indicatorTransition}
                    className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  size={16}
                  className={clsx(
                    'relative shrink-0',
                    isActive ? 'text-sky-600 dark:text-sky-400' : 'opacity-70'
                  )}
                />
                <span className="relative sm:hidden">{getShortTypeLabel(type)}</span>
                <span className="relative hidden sm:inline">{getTypeLabel(type)}</span>
                <span
                  className={clsx(
                    'relative min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold tabular-nums transition-colors',
                    isActive
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
                      : 'bg-gray-200/80 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
                  )}
                >
                  {typeCounts[type]}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative w-full xl:min-w-[14rem] xl:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault()
                onQueryChange('')
              }
            }}
            placeholder="Search projects or tech..."
            aria-label="Search projects"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 transition-colors hover:border-gray-300 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/15 dark:border-gray-700 dark:bg-gray-950/60 dark:text-white dark:placeholder:text-gray-500 dark:hover:border-gray-600 dark:focus:border-sky-500 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className={clsx(
                'absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200',
                focusRing
              )}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-2.5 px-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-[13px]">
        {getTypeDescription(selectedType)}
      </p>

      {/* Row 2: domain + featured */}
      <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter projects by domain"
          className="flex flex-wrap items-center gap-1.5"
        >
          <span className="mr-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
            Domain
          </span>
          {categories.map((category) => {
            const isActive = selectedCategory === category
            const Icon = categoryIcons[category]

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => onCategoryChange(category)}
                className={clsx(
                  'inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors',
                  focusRing,
                  isActive
                    ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/50 dark:bg-sky-500/15 dark:text-sky-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-white'
                )}
              >
                {Icon && <Icon size={13} className="shrink-0" />}
                {category}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={featuredOnly}
          onClick={() => onFeaturedChange(!featuredOnly)}
          className={clsx(
            'group inline-flex min-h-[36px] items-center gap-2.5 self-start rounded-full py-1 pl-3 pr-1.5 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:self-auto',
            focusRing
          )}
        >
          <Star
            size={15}
            className={clsx(
              'transition-colors',
              featuredOnly
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-400 group-hover:text-amber-400'
            )}
          />
          Featured only
          <span
            aria-hidden="true"
            className={clsx(
              'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors',
              featuredOnly ? 'bg-sky-600' : 'bg-gray-300 dark:bg-gray-700'
            )}
          >
            <span
              className={clsx(
                'inline-block h-5 w-5 rounded-full bg-white shadow-sm',
                !reduceMotion && 'transition-transform duration-200',
                featuredOnly ? 'translate-x-[18px]' : 'translate-x-0.5'
              )}
            />
          </span>
        </button>
      </div>

      {/* Row 3: results + active filters */}
      <div className="mt-3 flex flex-col gap-2.5 rounded-2xl bg-gray-50 px-3 py-2.5 dark:bg-gray-950/50 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <p aria-live="polite" className="text-sm text-gray-600 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{visibleCount}</span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{matchCount}</span>
            {matchCount === totalCount ? ' projects' : ` matching (${totalCount} total)`}
          </p>

          <AnimatePresence initial={false}>
            {activeFilters.map((filter) => (
              <motion.button
                key={filter.key}
                type="button"
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={filter.onRemove}
                aria-label={`Remove filter: ${filter.label}`}
                className={clsx(
                  'inline-flex max-w-[16rem] items-center gap-1 rounded-full border border-sky-200 bg-white py-1 pl-2.5 pr-1.5 text-xs font-semibold text-sky-700 transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20',
                  focusRing
                )}
              >
                <span className="truncate">{filter.label}</span>
                <X size={13} className="shrink-0 opacity-70" />
              </motion.button>
            ))}
          </AnimatePresence>

          {activeFilters.length > 1 && (
            <button
              type="button"
              onClick={onReset}
              className={clsx(
                'rounded-full px-1.5 text-xs font-semibold text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white',
                focusRing
              )}
            >
              Clear all
            </button>
          )}
        </div>

        {inferredGoals.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-fuchsia-600 dark:text-fuchsia-400">
              <Sparkles size={13} />
              AI matched
            </span>
            {inferredGoals.map((goal) => (
              <span
                key={goal}
                className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-0.5 text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300"
              >
                {goal}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectFilterPanel
