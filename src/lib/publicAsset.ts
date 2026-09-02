/**
 * Resolves a root-relative public asset path against Vite's BASE_URL so the
 * same data files work whether the site is served from the domain root or a
 * sub-path. Shared because three separate copies of this had drifted apart:
 * two ignored the case where BASE_URL lacks a trailing slash.
 */
export const resolvePublicAsset = (path: string) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return `${normalizedBase}${path.replace(/^\//, '')}`
}
