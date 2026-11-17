import { useId, useRef, useState, type ComponentType } from 'react'
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
  SlidersHorizontal,
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

/** Short visible labels; the full meaning lives in the tooltip / aria-label. */
const getTypeLabel = (type: TypeFilter) => (type === 'All' ? 'All' : type)
const getTypeHint = (type: TypeFilter) =>
  type === 'All'
    ? 'All projects'
    : `${projectTypeFilterLabels[type]}: ${projectTypeDescriptions[type]}`

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

/**
 * Compact projects filter bar.
 *
 * Primary controls (type tabs + search) are always visible. Secondary ones
 * (domain + featured) sit behind a "Filters" toggle so the bar stays one or
 * two rows tall on every device. The results line only appears while a filter
 * is active; otherwise the grid itself is the result.
 */
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
  const moreFiltersId = useId()
  const trimmedQuery = query.trim()

  const secondaryActiveCount =
    (selectedCategory !== 'All' ? 1 : 0) + (featuredOnly ? 1 : 0)
  // Open by default only if a secondary filter is already applied.
  const [showMoreFilters, setShowMoreFilters] = useState(secondaryActiveCount > 0)

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

  const showResultsRow = activeFilters.length > 0 || inferredGoals.length > 0
  const resultsText = `Showing ${visibleCount} of ${matchCount}${
    matchCount === totalCount ? ' projects' : ` matching (${totalCount} total)`
  }`

  return (
    <div className="mb-8 rounded-3xl border border-gray-200 bg-white/80 p-2 shadow-sm shadow-gray-900/[0.03] dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-none sm:p-3">
      {/* Always announce the result count, even when the row is hidden. */}
      <p className="sr-only" aria-live="polite">
        {resultsText}
      </p>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
        {/* Type tabs: one row on every device. Counts show from sm up; below that
            they would push "Software" off-screen. Scrolls only on <330px. */}
        <div
          role="group"
          aria-label="Filter projects by type"
          className="flex gap-1 overflow-x-auto rounded-2xl bg-gray-100 p-1 [scrollbar-width:none] dark:bg-gray-950/70 lg:shrink-0 [&::-webkit-scrollbar]:hidden"
        >
          {typeFilters.map((type) => {
            const isActive = selectedType === type
            const Icon = typeIcons[type]

            return (
              <button
                key={type}
                type="button"
                aria-pressed={isActive}
                aria-label={`${getTypeHint(type)} (${typeCounts[type]})`}
                title={getTypeHint(type)}
                onClick={() => onTypeChange(type)}
                className={clsx(
                  'relative inline-flex min-h-[40px] min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 text-[13px] font-semibold transition-colors sm:px-3 sm:text-sm lg:flex-none lg:px-4',
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
                  size={15}
                  className={clsx(
                    'relative hidden shrink-0 sm:block',
                    isActive ? 'text-sky-600 dark:text-sky-400' : 'opacity-70'
                  )}
                />
                <span className="relative">{getTypeLabel(type)}</span>
                <span
                  aria-hidden="true"
                  className={clsx(
                    'relative hidden text-xs font-bold tabular-nums sm:inline',
                    isActive ? 'text-sky-600 dark:text-sky-300' : 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {typeCounts[type]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search + secondary-filter toggle */}
        <div className="flex flex-1 gap-2">
          <div className="relative min-w-0 flex-1">
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
              className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-900 placeholder:text-gray-400 transition-colors hover:border-gray-300 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/15 dark:border-gray-700 dark:bg-gray-950/60 dark:text-white dark:placeholder:text-gray-500 dark:hover:border-gray-600 dark:focus:border-sky-500 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  onQueryChange('')
                  searchRef.current?.focus()
                }}
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

          <button
            type="button"
            onClick={() => setShowMoreFilters((open) => !open)}
            aria-expanded={showMoreFilters}
            aria-controls={moreFiltersId}
            className={clsx(
              'relative inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition-colors sm:px-4',
              focusRing,
              showMoreFilters || secondaryActiveCount > 0
                ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/50 dark:bg-sky-500/15 dark:text-sky-300'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-950/60 dark:text-gray-300 dark:hover:border-gray-600'
            )}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sr-only sm:hidden">More filters</span>
            {secondaryActiveCount > 0 && (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-bold text-white">
                {secondaryActiveCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Secondary filters: domain + featured */}
      <AnimatePresence initial={false}>
        {showMoreFilters && (
          <motion.div
            id={moreFiltersId}
            key="more-filters"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-gray-100 px-1 pt-3 dark:border-gray-800">
              <div
                role="group"
                aria-label="Filter projects by domain"
                className="flex flex-wrap items-center gap-1.5"
              >
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
                        'inline-flex min-h-[34px] items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors',
                        focusRing,
                        isActive
                          ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/50 dark:bg-sky-500/15 dark:text-sky-300'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-white'
                      )}
                    >
                      {Icon && <Icon size={13} className="shrink-0" />}
                      {category === 'All' ? 'All domains' : category}
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
                  'group inline-flex min-h-[34px] items-center gap-2 rounded-full py-1 pl-1 pr-1 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
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
                Featured
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results line: only while filtering */}
      {showResultsRow && (
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-gray-100 px-1 pt-2.5 dark:border-gray-800">
          <p aria-hidden="true" className="mr-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{matchCount}</span>{' '}
            of {totalCount}
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
                  'inline-flex max-w-[14rem] items-center gap-1 rounded-full border border-sky-200 bg-white py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-sky-700 transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20',
                  focusRing
                )}
              >
                <span className="truncate">{filter.label}</span>
                <X size={12} className="shrink-0 opacity-70" />
              </motion.button>
            ))}
          </AnimatePresence>

          {activeFilters.length > 1 && (
            <button
              type="button"
              onClick={onReset}
              className={clsx(
                'rounded-full px-1 text-xs font-semibold text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white',
                focusRing
              )}
            >
              Clear all
            </button>
          )}

          {inferredGoals.length > 0 && (
            <span className="ml-auto inline-flex flex-wrap items-center gap-1.5">
              <Sparkles size={12} className="text-fuchsia-500" aria-hidden="true" />
              {inferredGoals.map((goal) => (
                <span
                  key={goal}
                  className="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[11px] font-medium text-fuchsia-700 dark:text-fuchsia-300"
                >
                  {goal}
                </span>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectFilterPanel
