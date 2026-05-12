import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Flame, Github, GitPullRequest, Trophy } from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'
import { getSectionRevealProps } from '../../lib/motion'

const GITHUB_USERNAME = 'sourav81R'

type GitHubStats = {
  publicRepos: number
  totalPRs: number
  topLanguage: string
  languages: { name: string; percentage: number; color: string }[]
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  EJS: '#a91e50',
  Shell: '#89e051',
  SCSS: '#c6538c',
  Vue: '#41b883',
}

const ACHIEVEMENTS = [
  { name: 'Pull Shark', img: 'https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png' },
  { name: 'YOLO', img: 'https://github.githubassets.com/assets/yolo-default-be0bbff04951.png' },
  { name: 'Quickdraw', img: 'https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png' },
  { name: 'Pair Extraordinaire', img: 'https://user-images.githubusercontent.com/101352977/178841186-98adb2c7-3c39-4e69-8251-09891cbe1983.png' },
]

type GitHubRepo = {
  language: string | null
}

const toLanguageBreakdown = (repos: GitHubRepo[]) => {
  const counts = repos.reduce<Record<string, number>>((acc, repo) => {
    if (!repo.language) return acc
    acc[repo.language] = (acc[repo.language] ?? 0) + 1
    return acc
  }, {})

  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  if (entries.length === 0) {
    return [
      { name: 'TypeScript', percentage: 60, color: LANGUAGE_COLORS.TypeScript },
      { name: 'JavaScript', percentage: 25, color: LANGUAGE_COLORS.JavaScript },
      { name: 'HTML', percentage: 10, color: LANGUAGE_COLORS.HTML },
      { name: 'CSS', percentage: 5, color: LANGUAGE_COLORS.CSS },
    ]
  }

  const total = entries.reduce((sum, [, count]) => sum + count, 0)

  return entries.map(([name, count], index) => {
    const raw = (count / total) * 100
    const rounded = Number(raw.toFixed(2))
    return {
      name,
      percentage: index === entries.length - 1
        ? Number((100 - entries.slice(0, index).reduce((sum, [, c]) => sum + Number(((c / total) * 100).toFixed(2)), 0)).toFixed(2))
        : rounded,
      color: LANGUAGE_COLORS[name] ?? '#64748b',
    }
  })
}

const GitHubActivity = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [isDark, setIsDark] = useState(false)
  const calendarScrollRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)

  useEffect(() => {
    let cancelled = false

    const fetchStats = async () => {
      try {
        const [userRes, reposRes, prsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
          fetch(`https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr&per_page=1`),
        ])

        const userData = (await userRes.json()) as { public_repos?: number }
        const repos = (await reposRes.json()) as GitHubRepo[]
        const prData = (await prsRes.json()) as { total_count?: number }
        const languages = toLanguageBreakdown(Array.isArray(repos) ? repos : [])

        if (cancelled) return

        setStats({
          publicRepos: userData.public_repos ?? 0,
          totalPRs: prData.total_count ?? 0,
          topLanguage: languages[0]?.name ?? 'TypeScript',
          languages,
        })
      } catch {
        if (cancelled) return
        setStats({
          publicRepos: 0,
          totalPRs: 0,
          topLanguage: 'TypeScript',
          languages: toLanguageBreakdown([]),
        })
      }
    }

    fetchStats()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setIsDark(root.classList.contains('dark'))
    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (calendarScrollRef.current) {
        calendarScrollRef.current.scrollLeft = calendarScrollRef.current.scrollWidth
      }
    }, 550)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const statItems = useMemo(
    () => [
      {
        icon: Github,
        label: 'Public Repositories',
        value: stats?.publicRepos ?? '...',
        color: 'text-purple-500',
      },
      {
        icon: Flame,
        label: 'Top Language',
        value: stats?.topLanguage ?? '...',
        subtitle: 'Based on public repos',
        color: 'text-orange-500',
      },
      {
        icon: GitPullRequest,
        label: 'Total PRs',
        value: stats?.totalPRs ?? '...',
        color: 'text-green-500',
      },
      {
        icon: Trophy,
        label: 'Achievements',
        value: ACHIEVEMENTS.length,
        color: 'text-yellow-500',
      },
    ],
    [stats]
  )

  const contributionGraphUrl = isDark
    ? `https://ghchart.rshah.org/39d353/${GITHUB_USERNAME}`
    : `https://ghchart.rshah.org/216e39/${GITHUB_USERNAME}`

  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <AnimatedBorder>
        <div className="mx-auto max-w-6xl p-4 font-mono sm:p-6 md:p-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              GitHub Activity
            </h2>
            <p className="mx-auto mt-4 max-w-2xl px-4 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
              My coding journey visualized through repository activity and contribution consistency.
            </p>
          </div>

          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {statItems.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="rounded-xl border border-gray-200 bg-white/80 p-4 shadow-md transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/70 sm:p-6"
              >
                <div className="mb-2 flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
                    {stat.label}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  {stat.value}
                </p>
                {'subtitle' in stat && stat.subtitle && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {stat.subtitle}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="rounded-xl border border-gray-200 bg-white/80 p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900/70 sm:p-6"
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Most Used Languages
              </h3>

              <div className="mb-4 flex h-4 overflow-hidden rounded-full">
                {stats?.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color,
                    }}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {stats?.languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span className="text-sm text-gray-800 dark:text-gray-200">{lang.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="rounded-xl border border-gray-200 bg-white/80 p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900/70 sm:p-6"
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Achievements
              </h3>

              <div className="flex flex-wrap justify-center gap-4">
                {ACHIEVEMENTS.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="group relative"
                  >
                    <img
                      src={achievement.img}
                      alt={achievement.name}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 rounded-full border-2 border-gray-400/30 shadow-md sm:h-16 sm:w-16"
                    />
                    <div className="absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-900">
                      {achievement.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white/80 shadow-lg dark:border-gray-700 dark:bg-gray-900/70"
          >
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/90 p-4 backdrop-blur dark:bg-gray-900/85 sm:p-6 md:px-8 md:pt-8 md:pb-4">
              <Github className="h-6 w-6 text-emerald-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Contribution Graph
              </h3>
            </div>

            <div ref={calendarScrollRef} className="overflow-x-auto px-4 pb-4 sm:px-6 md:px-8">
              <div className="flex min-w-[760px] justify-center md:min-w-0">
                <img
                  src={contributionGraphUrl}
                  alt={`${GITHUB_USERNAME} contribution graph`}
                  className="h-auto w-full max-w-5xl rounded-lg border border-gray-200/70 dark:border-gray-700/70"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>

          <div className="mt-8 text-center">
            <motion.a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-emerald-600 hover:border-emerald-600 dark:border-white dark:bg-white dark:text-gray-900 dark:hover:bg-emerald-300"
            >
              <Github className="h-5 w-5" />
              View Full Profile
            </motion.a>
          </div>
        </div>
      </AnimatedBorder>
    </motion.div>
  )
}

export default GitHubActivity
