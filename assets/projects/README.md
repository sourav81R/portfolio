# Project cover sources

Full-resolution originals for the project cards. These are **source art** and are
deliberately kept out of `public/` so they never ship in the bundle - the site
serves the optimized derivatives in `public/images/` instead.

| Source | Shipped derivatives |
| --- | --- |
| `voteniti.png` (1672x941, ~1.8 MB) | `public/images/voteniti.webp` + `.jpg` |
| `oneisok.png` (1672x941, ~1.6 MB) | `public/images/oneisok.webp` + `.jpg` |
| `tejviral.png` (1672x941) | `public/images/tejviral.webp` + `.jpg` |
| `satyanarayan-travel.png` (1672x941) | `public/images/satyanarayan-travel.webp` + `.jpg` |
| `avatar-ink.png` (1672x941) | `public/images/avatar-ink.webp` + `.jpg` |
| `sonams-clothing.png` (1672x941) | `public/images/sonams-clothing.webp` + `.jpg` |
| `oneisok-legal.png` (1672x941) | `public/images/oneisok-legal.webp` + `.jpg` |

The five newer sources are owner-supplied promotional renders of each live
site. Keep new sources at 1672x941 (16:9) and name them after the project
`slug` stem used in `bgImage`. Do not drop source PNGs into `public/`: anything
there ships to every visitor as-is.

## Regenerating

Derivatives are 1200x675 (2x the largest render, which is the ~600px project
modal), WebP quality 82 with a JPEG fallback for browsers without WebP support.

```bash
npm install --no-save sharp
node scripts/optimize-project-images.js
```

This cuts roughly 3.4 MB of PNG down to about 190 KB, which matters because the
project cards sit above the fold on the projects section.
