export type ResumeAnalysis = {
  score: number
  strengths: string[]
  improvements: string[]
  keywordCoverage: string[]
  missingKeywords: string[]
  readiness: 'Strong' | 'Promising' | 'Needs work'
  summary: string
}

const roleKeywordMap = {
  'Frontend Engineer': [
    'react',
    'typescript',
    'javascript',
    'tailwind',
    'testing',
    'performance',
    'accessibility',
    'api',
  ],
  'Full Stack Engineer': [
    'react',
    'typescript',
    'node',
    'api',
    'mongodb',
    'express',
    'testing',
    'performance',
  ],
  'Product Engineer': [
    'react',
    'typescript',
    'ux',
    'analytics',
    'experimentation',
    'performance',
    'api',
    'accessibility',
  ],
} as const

export type ResumeTargetRole = keyof typeof roleKeywordMap

export const resumeTargetRoles = Object.keys(roleKeywordMap) as ResumeTargetRole[]

export const analyzeResumeText = (
  resumeText: string,
  targetRole: ResumeTargetRole = 'Frontend Engineer'
): ResumeAnalysis => {
  const normalized = resumeText.toLowerCase()
  const words = normalized.split(/\s+/).filter(Boolean)
  const importantKeywords = roleKeywordMap[targetRole]
  const keywordCoverage = importantKeywords.filter((keyword) =>
    normalized.includes(keyword)
  )
  const missingKeywords = importantKeywords.filter(
    (keyword) => !keywordCoverage.includes(keyword)
  )

  const strengths: string[] = []
  const improvements: string[] = []

  if (words.length > 180) strengths.push('Good detail depth for recruiter review.')
  else improvements.push('Add more measurable detail about projects or impact.')

  if (keywordCoverage.length >= 5) strengths.push('Strong frontend keyword coverage.')
  else improvements.push('Add more role-relevant frontend keywords like React, TypeScript, APIs, and testing.')

  if (/\d/.test(normalized)) strengths.push('Includes measurable outcomes or metrics.')
  else improvements.push('Add numbers or metrics to show business or delivery impact.')

  if (normalized.includes('project') || normalized.includes('experience')) {
    strengths.push('Mentions work or project context clearly.')
  } else {
    improvements.push('Add clearer project or experience context for each achievement.')
  }

  if (normalized.includes('impact') || normalized.includes('improved') || normalized.includes('built')) {
    strengths.push('Uses action-oriented language that reads well in recruiter screening.')
  } else {
    improvements.push('Use stronger action verbs like built, improved, shipped, or optimized.')
  }

  const score = Math.min(
    100,
    35 +
      keywordCoverage.length * 8 +
      (words.length > 180 ? 12 : 0) +
      (/\d/.test(normalized) ? 10 : 0) +
      (normalized.includes('project') || normalized.includes('experience') ? 8 : 0) +
      (normalized.includes('impact') || normalized.includes('improved') || normalized.includes('built') ? 6 : 0)
  )

  const readiness =
    score >= 80 ? 'Strong' : score >= 62 ? 'Promising' : 'Needs work'

  const summary =
    readiness === 'Strong'
      ? `Your resume looks well-aligned for ${targetRole} screening and already includes strong role signals.`
      : readiness === 'Promising'
        ? `Your resume has a solid base for ${targetRole} roles, but adding a few missing keywords and stronger metrics would improve screening results.`
        : `Your resume needs more role-specific language for ${targetRole} positions, especially around skills, delivery impact, and measurable outcomes.`

  return {
    score,
    strengths,
    improvements,
    keywordCoverage,
    missingKeywords,
    readiness,
    summary,
  }
}
