export type ResumeAnalysis = {
  score: number
  strengths: string[]
  improvements: string[]
  keywordCoverage: string[]
}

const importantKeywords = [
  'react',
  'typescript',
  'javascript',
  'node',
  'api',
  'firebase',
  'tailwind',
  'testing',
  'performance',
]

export const analyzeResumeText = (resumeText: string): ResumeAnalysis => {
  const normalized = resumeText.toLowerCase()
  const words = normalized.split(/\s+/).filter(Boolean)
  const keywordCoverage = importantKeywords.filter((keyword) =>
    normalized.includes(keyword)
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

  const score = Math.min(
    100,
    35 +
      keywordCoverage.length * 8 +
      (words.length > 180 ? 12 : 0) +
      (/\d/.test(normalized) ? 10 : 0) +
      (normalized.includes('project') || normalized.includes('experience') ? 8 : 0)
  )

  return {
    score,
    strengths,
    improvements,
    keywordCoverage,
  }
}
