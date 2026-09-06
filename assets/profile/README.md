# Profile photo source

`profile-source.png` is the full-resolution original (1142x1377, ~1.8 MB). It is
kept out of `public/` so it never ships in the bundle.

The site and the resume serve the optimized derivatives instead:

| Shipped file | Used by |
| --- | --- |
| `public/profile.jpg` | hero image, JSON-LD, preload hint, sitemap, resume PDF |
| `public/profile.webp` | smaller modern-browser variant |

Both are 800x965, cropped from the top so the face stays framed. The JPEG is
about 71 KB against 1.78 MB for the PNG, which matters because the hero image
is preloaded with `fetchpriority="high"` and lands in the LCP path.

## Regenerating

```bash
npm install --no-save sharp
node -e "
const sharp=require('sharp');
sharp('assets/profile/profile-source.png')
  .resize(800,965,{fit:'cover',position:'top'})
  .jpeg({quality:86,mozjpeg:true}).toFile('public/profile.jpg');
"
```
