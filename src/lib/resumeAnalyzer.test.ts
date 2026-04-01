import { describe, expect, it } from 'vitest'
import { analyzeResumeText } from './resumeAnalyzer'

describe('analyzeResumeText', () => {
  it('rewards keyword coverage and metrics', () => {
    const result = analyzeResumeText(
      'Built React TypeScript projects with APIs and Firebase. Improved performance by 30% across 3 releases. Project experience includes testing and Tailwind.'
    )

    expect(result.score).toBeGreaterThan(60)
    expect(result.keywordCoverage).toContain('react')
    expect(result.strengths.length).toBeGreaterThan(0)
    expect(result.readiness).not.toBe('Needs work')
  })

  it('flags thin resumes for improvement', () => {
    const result = analyzeResumeText('Student looking for work.')

    expect(result.improvements.length).toBeGreaterThan(0)
    expect(result.missingKeywords.length).toBeGreaterThan(0)
  })
})
