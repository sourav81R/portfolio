import { useEffect, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, BookOpenText, Code2, Github, Trophy } from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'
import Skeleton from '../common/Skeleton'
import { getSectionRevealProps, MOTION_TOKENS } from '../../lib/motion'
import { getDeveloperInsights, type DeveloperInsights } from '../../services/developerData'

const DeveloperSignals = () => {
  const [data, setData] = useState<DeveloperInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)

  useEffect(() => {
    let active = true

    getDeveloperInsights()
      .then((result) => {
        if (active) setData(result)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <AnimatedBorder>
        <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-10">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">
                Live Signals
              </p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                External data widgets that make the portfolio feel like a real frontend product
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
              GitHub activity, LeetCode progress, and article content are fetched dynamically with fallback data and local caching.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {loading ? (
                <>
                  <Skeleton className="h-36" />
                  <Skeleton className="h-36" />
                  <Skeleton className="h-36" />
                  <Skeleton className="h-36" />
                </>
              ) : (
                <>
                  <StatCard
                    icon={Github}
                    label="Public Repos"
                    value={String(data?.github.publicRepos ?? 0)}
                    detail={`${data?.github.totalStars ?? 0} stars across recent repos`}
                  />
                  <StatCard
                    icon={Code2}
                    label="Recent Commits"
                    value={String(data?.github.recentCommits ?? 0)}
                    detail={`Contribution estimate ${data?.github.contributionEstimate ?? 0}`}
                  />
                  <StatCard
                    icon={Trophy}
                    label="LeetCode Solved"
                    value={String(data?.leetcode.solved ?? 0)}
                    detail={`${data?.leetcode.ranking ?? 'N/A'} · ${data?.leetcode.streak ?? 0} day streak`}
                  />
                  <ShimmerCard className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                      Top Repositories
                    </p>
                    <div className="mt-4 space-y-3">
                      {data?.github.repos.slice(0, 3).map((repo) => (
                        <ShimmerLinkCard
                          key={repo.id}
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-gray-200 bg-white/80 px-4 py-3 hover:border-sky-400 dark:border-gray-800 dark:bg-gray-950/40"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-gray-900 dark:text-white">{repo.name}</p>
                            <ArrowUpRight size={16} className="text-gray-500" />
                          </div>
                          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            {repo.language ?? 'Multi-language'} · {repo.stargazers_count} stars
                          </p>
                        </ShimmerLinkCard>
                      ))}
                    </div>
                  </ShimmerCard>
                </>
              )}
            </div>

            <ShimmerCard className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <BookOpenText size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                    Dynamic Articles
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    Latest writing and frontend notes
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {loading
                  ? [1, 2, 3].map((key) => <Skeleton key={key} className="h-28" />)
                  : data?.articles.map((article, index) => (
                      <ShimmerLinkCard
                        key={article.id}
                        href={article.url}
                        target={article.url.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.18 }}
                        transition={{ duration: 0.24, delay: index * 0.06 }}
                        className="block rounded-2xl border border-gray-200 bg-white/80 p-4 hover:border-sky-400 dark:border-gray-800 dark:bg-gray-950/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
                              {article.source}
                            </p>
                            <h4 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                              {article.title}
                            </h4>
                          </div>
                          <ArrowUpRight size={18} className="text-gray-500" />
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                          Published {new Date(article.publishedAt).toLocaleDateString()}
                        </p>
                      </ShimmerLinkCard>
                    ))}
              </div>
            </ShimmerCard>
          </div>
        </div>
      </AnimatedBorder>
    </motion.div>
  )
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Github
  label: string
  value: string
  detail: string
}) => (
  <ShimmerCard className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
      <Icon size={19} />
    </div>
    <p className="mt-4 text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{detail}</p>
  </ShimmerCard>
)

const ShimmerCard = ({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="rest"
      whileHover={reduceMotion ? undefined : 'hover'}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {!reduceMotion && <CardShimmer />}
    </motion.div>
  )
}

const ShimmerLinkCard = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.a>) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.a
      initial="rest"
      whileHover={reduceMotion ? undefined : 'hover'}
      className={`relative overflow-hidden ${className ?? ''}`}
      {...props}
    >
      {children}
      {!reduceMotion && <CardShimmer />}
    </motion.a>
  )
}

const CardShimmer = () => (
  <motion.div
    variants={{
      rest: {
        x: '-140%',
        opacity: 0,
      },
      hover: {
        x: '140%',
        opacity: 1,
      },
    }}
    transition={{
      duration: MOTION_TOKENS.durations.section,
      ease: MOTION_TOKENS.easing,
    }}
    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10"
  />
)

export default DeveloperSignals
