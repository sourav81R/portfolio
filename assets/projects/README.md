# Project cover sources

Full-resolution originals for the project cards. These are **source art** and are
deliberately kept out of `public/` so they never ship in the bundle - the site
serves the optimized derivatives in `public/images/` instead.

| Source | Shipped derivatives |
| --- | --- |
| `voteniti.png` (1672x941, ~1.8 MB) | `public/images/voteniti.webp` + `.jpg` |
| `oneisok.png` (1672x941, ~1.6 MB) | `public/images/oneisok.webp` + `.jpg` |

## Regenerating

Derivatives are 1200x675 (2x the largest render, which is the ~600px project
modal), WebP quality 82 with a JPEG fallback for browsers without WebP support.

```bash
npm install --no-save sharp
node scripts/optimize-project-images.js
```

This cuts roughly 3.4 MB of PNG down to about 190 KB, which matters because the
project cards sit above the fold on the projects section.
