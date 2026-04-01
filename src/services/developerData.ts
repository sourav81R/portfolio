import { getCachedValue, setCachedValue } from '../lib/cache'

export type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  updated_at: string
}

export type DeveloperInsights = {
  github: {
    repos: GitHubRepo[]
    totalStars: number
    publicRepos: number
    recentCommits: number
    contributionEstimate: number
  }
  leetcode: {
    solved: number
    ranking: string
    streak: number
    source: 'live' | 'mock'
  }
  articles: {
    id: number | string
    title: string
    url: string
    publishedAt: string
    source: string
  }[]
}

const CACHE_TTL = 1000 * 60 * 15
const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'sourav81R'
const devtoUsername = import.meta.env.VITE_DEVTO_USERNAME || 'sourav81R'
const leetCodeEndpoint = import.meta.env.VITE_LEETCODE_API_URL

const mockData: DeveloperInsights = {
  github: {
    repos: [],
    totalStars: 12,
    publicRepos: 18,
    recentCommits: 27,
    contributionEstimate: 84,
  },
  leetcode: {
    solved: 320,
    ranking: 'Top 18%',
    streak: 21,
    source: 'mock',
  },
  articles: [
    {
      id: 'mock-1',
      title: 'Designing recruiter-friendly portfolio UX',
      url: '#projects',
      publishedAt: '2026-03-01',
      source: 'Portfolio Notes',
    },
    {
      id: 'mock-2',
      title: 'What I learned from building realtime apps',
      url: '#projects',
      publishedAt: '2026-02-10',
      source: 'Portfolio Notes',
    },
  ],
}

const fetchJson = async <T>(url: string, init?: RequestInit) => {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return (await response.json()) as T
}

export const getDeveloperInsights = async (): Promise<DeveloperInsights> => {
  const cacheKey = `developer-insights:${githubUsername}:${devtoUsername}`
  const cached = getCachedValue<DeveloperInsights>(cacheKey)
  if (cached) return cached

  try {
    const [user, repos, events, articles, leetcode] = await Promise.all([
      fetchJson<{ public_repos: number }>(`https://api.github.com/users/${githubUsername}`),
      fetchJson<GitHubRepo[]>(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`),
      fetchJson<Array<{ type: string; payload?: { commits?: Array<unknown> } }>>(
        `https://api.github.com/users/${githubUsername}/events/public?per_page=30`
      ),
      fetchJson<Array<{ id: number; title: string; url: string; published_at: string }>>(
        `https://dev.to/api/articles?username=${devtoUsername}&per_page=3`
      ).catch(() => []),
      leetCodeEndpoint
        ? fetchJson<{ solved: number; ranking: string; streak: number }>(leetCodeEndpoint)
        : Promise.resolve(mockData.leetcode),
    ])

    const recentCommits = events
      .filter((event) => event.type === 'PushEvent')
      .reduce((total, event) => total + (event.payload?.commits?.length ?? 0), 0)

    const contributionEstimate = events.reduce((total, event) => {
      if (event.type === 'PushEvent') return total + (event.payload?.commits?.length ?? 1)
      if (event.type === 'PullRequestEvent') return total + 2
      return total + 1
    }, 0)

    const insights: DeveloperInsights = {
      github: {
        repos,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        publicRepos: user.public_repos,
        recentCommits,
        contributionEstimate,
      },
      leetcode: {
        solved: leetcode.solved,
        ranking: leetcode.ranking,
        streak: leetcode.streak,
        source: leetCodeEndpoint ? 'live' : 'mock',
      },
      articles:
        articles.length > 0
          ? articles.map((article) => ({
              id: article.id,
              title: article.title,
              url: article.url,
              publishedAt: article.published_at,
              source: 'DEV Community',
            }))
          : mockData.articles,
    }

    setCachedValue(cacheKey, insights, CACHE_TTL)
    return insights
  } catch {
    setCachedValue(cacheKey, mockData, CACHE_TTL)
    return mockData
  }
}
