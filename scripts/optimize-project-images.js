/**
 * Regenerates the shipped project-cover derivatives from the full-resolution
 * sources in `assets/projects/`.
 *
 * The sources are ~1.7 MB PNGs, but the largest place a cover is ever rendered
 * is the project modal at roughly 600px wide. Shipping the originals would cost
 * about 3.4 MB on a section that sits near the top of the page, so each source
 * is resized to 2x that render and encoded as WebP with a JPEG fallback.
 *
 * `sharp` is not a project dependency - this runs by hand when a cover changes:
 *
 *   npm install --no-save sharp
 *   node scripts/optimize-project-images.js
 */
import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const SOURCE_DIR = join(root, 'assets', 'projects')
const OUTPUT_DIR = join(root, 'public', 'images')

// 2x the ~600px modal render, at the 16:9 the sources already use.
const WIDTH = 1200
const HEIGHT = 675
const QUALITY = 82

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`

const loadSharp = async () => {
  try {
    return (await import('sharp')).default
  } catch {
    console.error(
      'sharp is not installed. Run `npm install --no-save sharp` first.'
    )
    process.exit(1)
  }
}

const sharp = await loadSharp()

const sources = readdirSync(SOURCE_DIR).filter((file) => file.endsWith('.png'))

if (sources.length === 0) {
  console.error(`No .png sources found in ${SOURCE_DIR}`)
  process.exit(1)
}

for (const file of sources) {
  const name = file.replace(/\.png$/, '')
  const sourcePath = join(SOURCE_DIR, file)
  const before = statSync(sourcePath).size

  // `position: top` keeps the headline and logo in frame when the card crops.
  const resized = () =>
    sharp(sourcePath).resize(WIDTH, HEIGHT, { fit: 'cover', position: 'top' })

  await resized()
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(join(OUTPUT_DIR, `${name}.webp`))
  await resized()
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(join(OUTPUT_DIR, `${name}.jpg`))

  const after = statSync(join(OUTPUT_DIR, `${name}.webp`)).size
  const saved = (100 - (after / before) * 100).toFixed(1)

  console.log(
    `${name.padEnd(10)} ${kb(before).padStart(8)} -> ${kb(after).padStart(7)} webp  (${saved}% smaller)`
  )
}
