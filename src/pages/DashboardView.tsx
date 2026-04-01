import { useMemo, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  BarChart3,
  CalendarRange,
  Eye,
  MousePointerClick,
  RefreshCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import {
  useAppStore,
  type AnalyticsEvent,
  type AnalyticsEventKind,
} from '../store/useAppStore'

type MetricIcon = typeof Eye
type TimeRange = '24h' | '7d' | '30d' | 'all'

type MetricCardProps = {
  icon: MetricIcon
  label: string
  value: string
  detail: string
}

type ChartCardProps = {
  title: string
  icon: typeof BarChart3
  children: ReactNode
}

type DataPoint = {
  label: string
  value: number
}

const chartPalette = ['#0ea5e9', '#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b']
const timeRanges: TimeRange[] = ['24h', '7d', '30d', 'all']

const DashboardView = () => {
  const analytics = useAppStore((state) => state.analytics)
  const resetAnalytics = useAppStore((state) => state.resetAnalytics)
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [activeKind, setActiveKind] = useState<'all' | AnalyticsEventKind>('all')

  const events = analytics.events ?? []
  const filteredEvents = useMemo(
    () => filterEvents(events, timeRange, activeKind),
    [activeKind, events, timeRange]
  )

  const routeData = useMemo(
    () =>
      getCounts(
        filteredEvents.filter((event) => event.kind === 'page-view')
      ).map(([label, value]) => ({ label, value })),
    [filteredEvents]
  )

  const allClickData = useMemo(
    () =>
      getCounts(
        filteredEvents.filter((event) => event.kind === 'click')
      ).map(([label, value]) => ({ label, value })),
    [filteredEvents]
  )

  const clickData = useMemo(() => allClickData.slice(0, 5), [allClickData])

  const projectData = useMemo(() => {
    const interactionMap = new Map(
      getCounts(filteredEvents.filter((event) => event.kind === 'project'))
    )

    return projects
      .map((project) => ({
        label: project.title,
        value: interactionMap.get(project.slug) ?? 0,
      }))
      .filter((project) => project.value > 0)
  }, [filteredEvents])

  const timelineData = useMemo(
    () => buildTimelineData(filteredEvents, timeRange),
    [filteredEvents, timeRange]
  )

  const totalViews = routeData.reduce((sum, item) => sum + item.value, 0)
  const totalClicks = allClickData.reduce((sum, item) => sum + item.value, 0)
  const totalProjectInteractions = projectData.reduce((sum, item) => sum + item.value, 0)
  const totalEvents = filteredEvents.length

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900 dark:bg-black dark:text-gray-300 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:border-sky-500 hover:text-sky-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-sky-400"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>

          <button
            type="button"
            onClick={resetAnalytics}
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-500/15 dark:text-rose-300"
          >
            <RefreshCcw size={15} />
            Reset analytics
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-sky-600 dark:text-sky-400">
              Frontend Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Product analytics with filters, engagement signals, and trend visibility
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
            This route now behaves like a lightweight analytics console with range filters, live interaction buckets, and recruiter-facing usage summaries.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/50 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Time Range
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setTimeRange(range)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      timeRange === range
                        ? 'bg-sky-600 text-white'
                        : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Event Focus
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(['all', 'page-view', 'click', 'project'] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setActiveKind(kind)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      activeKind === kind
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {kind === 'all' ? 'All events' : kind}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard icon={Eye} label="Total Views" value={String(totalViews)} detail="Page navigation signals" />
          <MetricCard icon={MousePointerClick} label="Tracked Clicks" value={String(totalClicks)} detail="Intent and CTA activity" />
          <MetricCard icon={Sparkles} label="Project Interactions" value={String(totalProjectInteractions)} detail="Project discovery depth" />
          <MetricCard icon={TrendingUp} label="Event Volume" value={String(totalEvents)} detail={`Filtered to ${timeRange}`} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ChartCard title="Interaction Timeline" icon={CalendarRange}>
            <TimelineBars
              data={timelineData}
              emptyMessage="No recent interaction history matches the selected filters yet."
            />
          </ChartCard>

          <ChartCard title="Top Click Targets" icon={MousePointerClick}>
            <DonutChartCard
              data={clickData}
              emptyMessage="Tracked clicks will populate this panel once visitors interact with the interface."
            />
          </ChartCard>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <ChartCard title="Views by Route" icon={BarChart3}>
            <HorizontalBarList
              data={routeData}
              emptyMessage="Page visits will appear here after navigation events are tracked."
            />
          </ChartCard>

          <ChartCard title="Project Engagement" icon={Sparkles}>
            <HorizontalBarList
              data={projectData}
              emptyMessage="Project interactions will show up here after visitors explore your featured work."
              compact
            />
          </ChartCard>
        </div>
      </div>
    </main>
  )
}

const filterEvents = (
  events: AnalyticsEvent[],
  range: TimeRange,
  kind: 'all' | AnalyticsEventKind
) => {
  const now = Date.now()
  const rangeMap: Record<Exclude<TimeRange, 'all'>, number> = {
    '24h': 1000 * 60 * 60 * 24,
    '7d': 1000 * 60 * 60 * 24 * 7,
    '30d': 1000 * 60 * 60 * 24 * 30,
  }

  const cutoff = range === 'all' ? 0 : now - rangeMap[range]

  return events.filter((event) => {
    if (kind !== 'all' && event.kind !== kind) return false
    return event.timestamp >= cutoff
  })
}

const getCounts = (events: AnalyticsEvent[]) =>
  [...events.reduce<Map<string, number>>((map, event) => {
    map.set(event.key, (map.get(event.key) ?? 0) + 1)
    return map
  }, new Map())].sort((left, right) => right[1] - left[1])

const buildTimelineData = (events: AnalyticsEvent[], range: TimeRange): DataPoint[] => {
  const bucketCount = range === '24h' ? 6 : range === '7d' ? 7 : range === '30d' ? 10 : 8
  const now = Date.now()
  const spanMs =
    range === '24h'
      ? 1000 * 60 * 60 * 24
      : range === '7d'
        ? 1000 * 60 * 60 * 24 * 7
        : range === '30d'
          ? 1000 * 60 * 60 * 24 * 30
          : 1000 * 60 * 60 * 24 * 56

  const bucketMs = spanMs / bucketCount

  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = now - spanMs + index * bucketMs
    const bucketEnd = bucketStart + bucketMs
    const labelDate = new Date(bucketEnd)
    const value = events.filter(
      (event) => event.timestamp >= bucketStart && event.timestamp < bucketEnd
    ).length

    return {
      label:
        range === '24h'
          ? `${labelDate.getHours()}:00`
          : `${labelDate.getDate()}/${labelDate.getMonth() + 1}`,
      value,
    }
  })
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  detail,
}: MetricCardProps) => (
  <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
      <Icon size={18} />
    </span>
    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{detail}</p>
  </div>
)

const ChartCard = ({
  title,
  icon: Icon,
  children,
}: ChartCardProps) => (
  <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50 sm:p-6">
    <div className="mb-5 flex items-center gap-3">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
        <Icon size={18} />
      </span>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
    {children}
  </div>
)

const TimelineBars = ({
  data,
  emptyMessage,
}: {
  data: DataPoint[]
  emptyMessage: string
}) => {
  const maxValue = Math.max(...data.map((item) => item.value), 0)

  if (maxValue === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="flex min-h-64 items-end gap-3">
      {data.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-3">
          <div className="flex h-52 w-full items-end rounded-2xl bg-gray-200/70 p-1 dark:bg-gray-800">
            <div
              className="w-full rounded-[1rem] bg-gradient-to-t from-sky-500 via-cyan-400 to-indigo-500 transition-[height] duration-500"
              style={{
                height: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 0)}%`,
              }}
            />
          </div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p className="font-semibold text-gray-700 dark:text-gray-200">{item.value}</p>
            <p>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const HorizontalBarList = ({
  data,
  emptyMessage,
  compact = false,
}: {
  data: DataPoint[]
  emptyMessage: string
  compact?: boolean
}) => {
  const filteredData = data.filter((item) => item.value > 0)
  const maxValue = Math.max(...filteredData.map((item) => item.value), 0)

  if (filteredData.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {filteredData.map((item, index) => {
        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
        const color = chartPalette[index % chartPalette.length]

        return (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="truncate font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
              <span className="shrink-0 text-gray-500 dark:text-gray-400">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200/80 dark:bg-gray-800">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${Math.max(percentage, 8)}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const DonutChartCard = ({
  data,
  emptyMessage,
}: {
  data: DataPoint[]
  emptyMessage: string
}) => {
  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  let offset = 0
  const gradientStops = data.map((item, index) => {
    const start = offset
    const sweep = total > 0 ? (item.value / total) * 360 : 0
    offset += sweep
    return `${chartPalette[index % chartPalette.length]} ${start}deg ${offset}deg`
  })

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
      <div className="mx-auto flex w-full max-w-[220px] items-center justify-center">
        <div
          className="relative h-44 w-44 rounded-full"
          style={{
            background: `conic-gradient(${gradientStops.join(', ')})`,
          }}
        >
          <div className="absolute inset-5 flex items-center justify-center rounded-full bg-white text-center dark:bg-slate-950">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Total Clicks
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 dark:border-gray-800 dark:bg-slate-950/60"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: chartPalette[index % chartPalette.length] }}
                />
                <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                  {item.label}
                </span>
              </div>
              <div className="shrink-0 text-right text-sm">
                <p className="font-semibold text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-gray-500 dark:text-gray-400">{percentage}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 text-center text-sm leading-relaxed text-gray-500 dark:border-gray-700 dark:bg-slate-950/40 dark:text-gray-400">
    {message}
  </div>
)

export default DashboardView
