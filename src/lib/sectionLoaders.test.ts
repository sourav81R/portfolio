import { describe, expect, it, vi } from 'vitest'
import { prefetchSection, sectionLoaders } from './sectionLoaders'

/**
 * The loader map has to stay in step with the section ids used by the navbar
 * and by App's LazySection list. A typo here is silent - the prefetch simply
 * does nothing and the section loads late - so it is worth pinning down.
 */

// Mirrors the ids rendered in App.tsx and listed in the navbar.
const SECTION_IDS = [
  'about',
  'experience',
  'skills',
  'projects',
  'github',
  'education',
  'certifications',
  'contact',
]

describe('sectionLoaders', () => {
  it('covers every lazy section id', () => {
    expect(Object.keys(sectionLoaders).sort()).toEqual([...SECTION_IDS].sort())
  })

  it('exposes a callable loader per section', () => {
    Object.values(sectionLoaders).forEach((loader) => {
      expect(typeof loader).toBe('function')
    })
  })
})

describe('prefetchSection', () => {
  it('ignores ids that are not lazy sections', () => {
    // 'home' is the hero, which is eagerly imported and has no chunk.
    expect(() => prefetchSection('home')).not.toThrow()
    expect(() => prefetchSection('does-not-exist')).not.toThrow()
  })

  it('swallows a failed import rather than surfacing it', async () => {
    // A prefetch is an optimisation; the real import on mount retries with
    // Suspense handling the error properly, so a rejection here must not
    // become an unhandled rejection.
    const failing = vi
      .spyOn(sectionLoaders, 'about')
      .mockRejectedValue(new Error('offline') as never)

    expect(() => prefetchSection('about')).not.toThrow()
    await Promise.resolve()

    expect(failing).toHaveBeenCalled()
    failing.mockRestore()
  })
})
