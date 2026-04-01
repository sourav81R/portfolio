import type { ProjectRecord } from '../data/projects'

export const recommendationGoals = [
  'Frontend UI',
  'AI Features',
  'Realtime Systems',
  'Mobile Apps',
  'APIs & Backend',
] as const

export type RecommendationGoal = (typeof recommendationGoals)[number]

const goalKeywords: Record<RecommendationGoal, string[]> = {
  'Frontend UI': ['React', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'UI'],
  'AI Features': ['OpenAI', 'TensorFlow/Keras', 'AI', 'ML', 'Firebase'],
  'Realtime Systems': ['Socket.IO', 'Realtime', 'JWT'],
  'Mobile Apps': ['React Native', 'Expo', 'Mobile'],
  'APIs & Backend': ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Flask'],
}

export const getRecommendedProjects = (
  allProjects: ProjectRecord[],
  goals: RecommendationGoal[],
  recruiterMode = false
) =>
  [...allProjects]
    .map((project) => {
      let score = recruiterMode ? project.recruiterPriority : 0

      goals.forEach((goal) => {
        const keywords = goalKeywords[goal]
        const haystack = `${project.title} ${project.description} ${project.tech.join(' ')}`

        keywords.forEach((keyword) => {
          if (haystack.toLowerCase().includes(keyword.toLowerCase())) {
            score += 3
          }
        })
      })

      return { project, score }
    })
    .sort((a, b) => b.score - a.score)
    .filter((entry) => entry.score > 0)
    .slice(0, 3)
    .map((entry) => entry.project)
