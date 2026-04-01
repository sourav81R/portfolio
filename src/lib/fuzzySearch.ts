export const scoreFuzzyMatch = (value: string, query: string) => {
  const normalizedValue = value.toLowerCase()
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return 0
  if (normalizedValue === normalizedQuery) return 140
  if (normalizedValue.startsWith(normalizedQuery)) return 110
  if (normalizedValue.includes(normalizedQuery)) return 90

  let queryIndex = 0
  let consecutive = 0
  let score = 0

  for (let index = 0; index < normalizedValue.length; index += 1) {
    if (normalizedValue[index] !== normalizedQuery[queryIndex]) continue

    queryIndex += 1
    consecutive += 1
    score += 8 + consecutive * 3

    if (queryIndex === normalizedQuery.length) {
      return score
    }
  }

  return 0
}

export const getBestSearchScore = (query: string, candidates: string[]) =>
  candidates.reduce((highest, candidate) => {
    const nextScore = scoreFuzzyMatch(candidate, query)
    return Math.max(highest, nextScore)
  }, 0)
