type CacheEnvelope<T> = {
  expiresAt: number
  value: T
}

export const getCachedValue = <T>(key: string) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheEnvelope<T>
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key)
      return null
    }
    return parsed.value
  } catch {
    return null
  }
}

export const setCachedValue = <T>(key: string, value: T, ttlMs: number) => {
  try {
    const payload: CacheEnvelope<T> = {
      value,
      expiresAt: Date.now() + ttlMs,
    }
    localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // Ignore cache failures to keep runtime resilient.
  }
}
