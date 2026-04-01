import { useEffect, useMemo } from 'react'
import { ArrowLeft, BarChart3, Eye, MousePointerClick, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { projects } from '../data/projects'

type MetricIcon = typeof Eye

type MetricCardProps = {
  icon: MetricIcon
  label: string
  value: string
}

type ChartCardProps = {
  title: string
  icon: typeof BarChart3
  children: React.ReactNode
}

type DataPoint = {
  label: string
  value: number
}

const chartPalette = ['#0ea5e9', '#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b']

const DashboardPage = () => {
  const analytics = useAppStore((state) => state.analytics)
  const recordPageView = useAppStore((state) => state.recordPageView)

  useEffect(() => {
    recordPageView('/dashboard')
  }, [recordPageView])

  const routeData = useMemo(
    () =>
      Object.entries(analytics.viewsByRoute).map(([route, views]) => ({
        label: route,
        value: views,
      })),
    [analytics.viewsByRoute]
  )

  const projectData = useMemo(
    () =>
      projects.map((project) => ({
        label: project.title,
        value: analytics.projectInteractions[project.slug] ?? 0,
      })),
    [analytics.projectInteractions]
  )

  const allClickData = useMemo(
    () =>
      Object.entries(analytics.clicksByTarget)
        .map(([label, value]) => ({ label, value }))
        .sort((left, right) => right.value - left.value),
    [analytics.clicksByTarget]
  )

  const clickData = useMemo(
    () => allClickData.slice(0, 5),
    [allClickData]
  )

  const totalViews = routeData.reduce((sum, item) => sum + item.value, 0)
  const totalClicks = allClickData.reduce((sum, item) => sum + item.value, 0)
  const totalProjectInteractions = projectData.reduce((sum, item) => sum + item.value, 0)

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900 dark:bg-black dark:text-gray-300 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:border-sky-500 hover:text-sky-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-sky-400"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-sky-600 dark:text-sky-400">
              Frontend Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Interaction analytics and product signals
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
            This dashboard demonstrates analytics visualization, persisted state, and product-style reporting using local chart components and Zustand.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard icon={Eye} label="Total Views" value={String(totalViews)} />
          <MetricCard icon={MousePointerClick} label="Tracked Clicks" value={String(totalClicks)} />
          <MetricCard icon={Sparkles} label="Project Interactions" value={String(totalProjectInteractions)} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <ChartCard title="Views by Route" icon={BarChart3}>
            <HorizontalBarList
              data={routeData}
              emptyMessage="Page visits will appear here after navigation events are tracked."
            />
          </ChartCard>

          <ChartCard title="Top Click Targets" icon={MousePointerClick}>
            <DonutChartCard
              data={clickData}
              emptyMessage="Tracked clicks will populate this panel once visitors interact with the interface."
            />
          </ChartCard>
        </div>

        <div className="mt-8">
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

const MetricCard = ({
  icon: Icon,
  label,
  value,
}: MetricCardProps) => (
  <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
      <Icon size={18} />
    </span>
    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
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

export default DashboardPage
