import { useMemo } from 'react'
import {
  projectTypeLabels,
  projectTypes,
  type ProjectCategory,
  type ProjectRecord,
  type ProjectType,
} from '../data/projects'
import { getBestSearchScore } from '../lib/fuzzySearch'
import {
  getRecommendedProjects,
  inferRecommendationGoals,
} from '../lib/recommendations'

export type CategoryFilter = 'All' | ProjectCategory
export type TypeFilter = 'All' | ProjectType

type UseProjectDiscoveryOptions = {
  allProjects: ProjectRecord[]
  query: string
  selectedType?: TypeFilter
  selectedCategory: CategoryFilter
  featuredOnly: boolean
  recruiterMode: boolean
  projectOrder: string[]
}

export const useProjectDiscovery = ({
  allProjects,
  query,
  selectedType = 'All',
  selectedCategory,
  featuredOnly,
  recruiterMode,
  projectOrder,
}: UseProjectDiscoveryOptions) => {
  const orderedProjects = useMemo(() => {
    if (projectOrder.length === 0) return allProjects

    return [...allProjects].sort(
      (left, right) => projectOrder.indexOf(left.slug) - projectOrder.indexOf(right.slug)
    )
  }, [allProjects, projectOrder])

  const inferredGoals = useMemo(() => inferRecommendationGoals(query), [query])

  /**
   * Everything except the type filter. Kept separate so the type chips can
   * show how many projects each would reveal under the current domain,
   * featured, and search filters - the counts always match the click result.
   */
  const rankedProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return orderedProjects
      .filter((project) =>
        selectedCategory === 'All' ? true : project.category === selectedCategory
      )
      .filter((project) => (featuredOnly ? project.featured : true))
      .map((project) => {
        const searchScore = normalizedQuery
          ? getBestSearchScore(normalizedQuery, [
              project.title,
              project.description,
              project.role,
              project.impact,
              projectTypeLabels[project.type],
              project.category,
              ...project.tech,
            ])
          : 0

        const recruiterBoost = recruiterMode ? project.recruiterPriority * 4 : 0

        return {
          project,
          searchScore,
          rank: normalizedQuery ? searchScore + recruiterBoost : recruiterBoost,
        }
      })
      .filter((entry) => (normalizedQuery ? entry.searchScore > 0 : true))
      .sort((left, right) => {
        if (right.rank !== left.rank) return right.rank - left.rank
        return right.project.recruiterPriority - left.project.recruiterPriority
      })
      .map((entry) => entry.project)
  }, [featuredOnly, orderedProjects, query, recruiterMode, selectedCategory])

  const typeCounts = useMemo(() => {
    const counts = Object.fromEntries(
      projectTypes.map((type) => [type, 0])
    ) as Record<ProjectType, number>

    rankedProjects.forEach((project) => {
      counts[project.type] += 1
    })

    return { All: rankedProjects.length, ...counts } as Record<TypeFilter, number>
  }, [rankedProjects])

  const filteredProjects = useMemo(
    () =>
      selectedType === 'All'
        ? rankedProjects
        : rankedProjects.filter((project) => project.type === selectedType),
    [rankedProjects, selectedType]
  )

  const recommendedProjects = useMemo(() => {
    if (inferredGoals.length === 0) return []

    return getRecommendedProjects(orderedProjects, inferredGoals, recruiterMode)
  }, [inferredGoals, orderedProjects, recruiterMode])

  return {
    filteredProjects,
    typeCounts,
    inferredGoals,
    recommendedProjects,
    totalProjects: orderedProjects.length,
  }
}
