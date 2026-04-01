import { describe, expect, it } from 'vitest'
import { featuredProjects } from '../data/projects'
import { getRecommendedProjects } from './recommendations'

describe('getRecommendedProjects', () => {
  it('returns AI-heavy projects when AI goals are selected', () => {
    const results = getRecommendedProjects(featuredProjects, ['AI Features'], false)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].title).toBe('ResumeIQ')
  })

  it('uses recruiter priority when recruiter mode is enabled', () => {
    const results = getRecommendedProjects(featuredProjects, ['Frontend UI'], true)
    expect(results[0].recruiterPriority).toBeGreaterThanOrEqual(results[1].recruiterPriority)
  })
})
