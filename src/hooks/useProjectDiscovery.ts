import { useMemo } from 'react'
import type { ProjectCategory, ProjectRecord } from '../data/projects'
import { getBestSearchScore } from '../lib/fuzzySearch'
import {
  getRecommendedProjects,
  inferRecommendationGoals,
} from '../lib/recommendations'

type CategoryFilter = 'All' | ProjectCategory

type UseProjectDiscoveryOptions = {
  allProjects: ProjectRecord[]
  query: string
  selectedCategory: CategoryFilter
  featuredOnly: boolean
  recruiterMode: boolean
  projectOrder: string[]
}

export const useProjectDiscovery = ({
  allProjects,
  query,
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

  const filteredProjects = useMemo(() => {
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

  const recommendedProjects = useMemo(() => {
    if (inferredGoals.length === 0) return []

    return getRecommendedProjects(orderedProjects, inferredGoals, recruiterMode)
  }, [inferredGoals, orderedProjects, recruiterMode])

  return {
    filteredProjects,
    inferredGoals,
    recommendedProjects,
    totalProjects: orderedProjects.length,
  }
}
