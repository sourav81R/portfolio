import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const SITE_URL = 'https://sourav.is-a.dev'

type SitemapEntry = {
  path: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: string
}

/**
 * Case-study slugs are read out of the data file with a regex rather than
 * imported: caseStudies.ts imports an image asset, which only Vite can
 * resolve, so importing it from a plain build script would throw.
 */
const readCaseStudySlugs = (root: string): string[] => {
  const source = readFileSync(resolve(root, 'src/data/caseStudies.ts'), 'utf8')
  const pattern = /^\s{4}slug:\s*'([^']+)'/gm
  const slugs: string[] = []

  for (let match = pattern.exec(source); match !== null; match = pattern.exec(source)) {
    slugs.push(match[1])
  }

  if (slugs.length === 0) {
    throw new Error('sitemap: no case-study slugs found - has caseStudies.ts changed shape?')
  }

  return slugs
}

const buildEntries = (root: string): SitemapEntry[] => [
  // The single-page site is the primary ranking target, so it carries top
  // priority. /dashboard is deliberately absent: robots.txt disallows it.
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  ...readCaseStudySlugs(root).map(
    (slug): SitemapEntry => ({
      path: `/case-studies/${slug}`,
      changefreq: 'monthly',
      priority: '0.8',
    })
  ),
]

export const renderSitemap = (root: string, lastmod: string): string => {
  const urls = buildEntries(root)
    .map(({ path, changefreq, priority }) =>
      [
        '  <url>',
        `    <loc>${SITE_URL}${path}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

/**
 * Emits sitemap.xml at build time so the URL list is generated from the real
 * case-study data instead of a hand-maintained file that silently goes stale
 * whenever a case study is added.
 */
export default function sitemapPlugin(): Plugin {
  let root = process.cwd()

  return {
    name: 'emit-sitemap',
    apply: 'build',
    configResolved(config) {
      root = config.root
    },
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10)

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: renderSitemap(root, lastmod),
      })
    },
  }
}
