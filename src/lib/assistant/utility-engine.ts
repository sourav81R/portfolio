export interface UtilityReply {
  text: string
  speak: string
  handler: string
}

const parseMath = (source: string): number | null => {
  const normalized = source
    .toLowerCase()
    .replace(/^\s*(what(?: is|'s)?|calculate|compute|solve|evaluate)\s+/, '')
    .replace(/\bmultiplied by\b|\btimes\b/g, '*')
    .replace(/\bdivided by\b|\bover\b/g, '/')
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\bmodulo?\b/g, '%')
    .replace(/\bto the power of\b|\bpower\b/g, '^')
    .replace(/[?=]/g, '')
    .trim()
  if (normalized.length > 100 || !/[+*/%^]|\s-\s/.test(normalized) || !/^[\d\s.+*/%^()-]+$/.test(normalized)) return null

  let cursor = 0
  const spaces = () => { while (/\s/.test(normalized[cursor] ?? '')) cursor += 1 }
  const primary = (): number => {
    spaces()
    if (normalized[cursor] === '(') {
      cursor += 1
      const value = sum()
      spaces()
      if (normalized[cursor] !== ')') throw new Error('paren')
      cursor += 1
      return value
    }
    const start = cursor
    while (/\d|\./.test(normalized[cursor] ?? '')) cursor += 1
    const value = Number(normalized.slice(start, cursor))
    if (start === cursor || !Number.isFinite(value)) throw new Error('number')
    return value
  }
  const power = (): number => {
    const left = primary()
    spaces()
    if (normalized[cursor] !== '^') return left
    cursor += 1
    const result = left ** power()
    if (!Number.isFinite(result)) throw new Error('result')
    return result
  }
  const product = (): number => {
    let value = power()
    while (true) {
      spaces()
      const operator = normalized[cursor]
      if (!['*', '/', '%'].includes(operator ?? '')) return value
      cursor += 1
      const next = power()
      if ((operator === '/' || operator === '%') && next === 0) throw new Error('zero')
      value = operator === '*' ? value * next : operator === '/' ? value / next : value % next
    }
  }
  const sum = (): number => {
    let value = product()
    while (true) {
      spaces()
      const operator = normalized[cursor]
      if (operator !== '+' && operator !== '-') return value
      cursor += 1
      const next = product()
      value = operator === '+' ? value + next : value - next
    }
  }

  try {
    const value = sum()
    spaces()
    return cursor === normalized.length && Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

export const processUtilityQuery = (input: string): UtilityReply | null => {
  const math = parseMath(input)
  if (math !== null) return { text: `That equals ${Number(math.toPrecision(10))}.`, speak: `That equals ${Number(math.toPrecision(10))}.`, handler: 'utility:math' }

  if (/\b(what time is it|current time|time now|what is the time)\b/i.test(input)) {
    const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date())
    return { text: `It’s ${time}.`, speak: `It’s ${time}.`, handler: 'utility:time' }
  }
  if (/\b(today'?s date|what is the date|what day is it|current date)\b/i.test(input)) {
    const date = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full' }).format(new Date())
    return { text: `Today is ${date}.`, speak: `Today is ${date}.`, handler: 'utility:date' }
  }
  return null
}
