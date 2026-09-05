import { useEffect } from 'react'

export const SITE_URL = 'https://sourav.is-a.dev'
const DEFAULT_TITLE =
  'Sourav Chowdhury - Full Stack Developer (Next.js, React, Node.js)'

type PageMetadata = {
  title: string
  description: string
  /** Path only, e.g. `/case-studies/resumeiq`. Joined onto SITE_URL. */
  path: string
  /** Kept out of the index for pages with no search value. */
  noIndex?: boolean
  /**
   * Optional JSON-LD injected for this route, keyed by `#page-schema`.
   * Case studies use it to declare Sourav Chowdhury as their author, which
   * links every sub-page back to the same Person entity and concentrates the
   * name's authority on one identity instead of spreading it thin.
   */
  structuredData?: Record<string, unknown>
}

const PAGE_SCHEMA_ID = 'page-schema'

/** Creates the tag on first use, so index.html only needs the shared defaults. */
const upsertMeta = (selector: string, attr: 'name' | 'property', key: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }

  return element
}

/**
 * Applies per-route document metadata.
 *
 * The site is client-rendered, so every route otherwise inherits the title,
 * description and canonical URL baked into index.html - which tells Google the
 * case studies are duplicates of the homepage. Googlebot renders JavaScript,
 * so updating these on mount is enough for them to be indexed separately.
 */
export const usePageMetadata = ({
  title,
  description,
  path,
  noIndex,
  structuredData,
}: PageMetadata) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`
    const previousTitle = document.title

    document.title = title

    upsertMeta('meta[name="description"]', 'name', 'description').content = description
    upsertMeta('meta[property="og:title"]', 'property', 'og:title').content = title
    upsertMeta('meta[property="og:description"]', 'property', 'og:description').content =
      description
    upsertMeta('meta[property="og:url"]', 'property', 'og:url').content = canonicalUrl
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title').content = title
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description').content =
      description

    upsertMeta('meta[name="robots"]', 'name', 'robots').content = noIndex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    let schemaTag = document.getElementById(PAGE_SCHEMA_ID)

    if (structuredData) {
      if (!schemaTag) {
        schemaTag = document.createElement('script')
        schemaTag.id = PAGE_SCHEMA_ID
        schemaTag.setAttribute('type', 'application/ld+json')
        document.head.appendChild(schemaTag)
      }
      schemaTag.textContent = JSON.stringify(structuredData)
    } else if (schemaTag) {
      schemaTag.remove()
    }

    return () => {
      document.title = previousTitle
      // The homepage carries its own schema in index.html; leaving a case
      // study's node behind would describe the wrong page after navigation.
      document.getElementById(PAGE_SCHEMA_ID)?.remove()
    }
  }, [title, description, path, noIndex, structuredData])
}

export default usePageMetadata

export const DEFAULT_PAGE_TITLE = DEFAULT_TITLE
