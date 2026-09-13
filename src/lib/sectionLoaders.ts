/**
 * Dynamic-import factories for the lazy homepage sections.
 *
 * These live here rather than in App.tsx so the navbar can warm a chunk
 * without importing App, which imports the navbar - a cycle that would make
 * the two modules' initialisation order undefined.
 *
 * Each factory is used twice: once by `React.lazy` in App.tsx, and once by
 * `prefetchSection` below. Calling the same factory again is free, because
 * the module registry returns the in-flight or resolved promise rather than
 * re-fetching, so a prefetched chunk is already available when Suspense
 * asks for it.
 */
export const sectionLoaders = {
  about: () => import('../components/sections/About'),
  experience: () => import('../components/sections/Experience'),
  skills: () => import('../components/sections/Skills'),
  projects: () => import('../components/sections/Projects'),
  github: () => import('../components/sections/GitHubActivity'),
  education: () => import('../components/sections/Education'),
  certifications: () => import('../components/sections/Certifications'),
  contact: () => import('../components/sections/Contact'),
} as const

export type SectionId = keyof typeof sectionLoaders

/**
 * Warms a section's chunk ahead of use.
 *
 * Clicking a nav link used to scroll to a section whose code had not been
 * downloaded, so the viewport landed on a placeholder and the real content
 * appeared a moment later. The navbar fires this on hover and on pointerdown,
 * which gives the network a head start before the scroll even begins.
 *
 * Failures are swallowed on purpose: a prefetch is an optimisation, and the
 * real import on mount will retry with Suspense handling the error properly.
 */
export const prefetchSection = (id: string) => {
  const loader = sectionLoaders[id as SectionId]
  if (loader) void loader().catch(() => {})
}
