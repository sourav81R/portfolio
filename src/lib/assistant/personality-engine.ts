export type PersonalityKind = 'compliment' | 'affection' | 'flirty' | 'rude' | null

export interface PersonalityReply {
  kind: Exclude<PersonalityKind, null>
  text: string
}

export const handlePersonalityQuery = (input: string): PersonalityReply | null => {
  const text = input.trim().toLowerCase()
  if (!text) return null

  if (/\b(marry me|date me|are you single|are you cute|be my (?:girlfriend|boyfriend|partner)|what is your gender)\b/.test(text)) {
    return { kind: 'flirty', text: 'I’m just a portfolio assistant, so I’ll leave the dating advice to humans. I can help you discover Sourav’s work, though!' }
  }
  if (/\b(i love you|love you|you are cute|you’re cute)\b/.test(text)) {
    return { kind: 'affection', text: 'That’s kind of you! I’m here to help you explore Sourav’s projects and experience.' }
  }
  if (/\b(stupid|dumb|idiot|useless|shut up|you suck|hate you)\b/.test(text)) {
    return { kind: 'rude', text: 'No worries. Let’s get back to what I can help with: Sourav’s projects, skills, or experience.' }
  }
  if (/\b(you are|you’re) (awesome|amazing|great|cool|smart|helpful|brilliant)\b|\b(good bot|nice work|well done|thanks so much)\b/.test(text)) {
    return { kind: 'compliment', text: 'Thanks! Glad I could help. What would you like to know about Sourav’s work?' }
  }
  return null
}
