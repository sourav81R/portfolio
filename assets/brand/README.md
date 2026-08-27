# Brand assets

Source artwork kept out of `public/` on purpose: everything in `public/` is
copied verbatim into the build, so a 1.1MB source image would be shipped to
every visitor even though no page references it.

## logo-source.png

Full circular logo (1254x1254). The favicons in `public/` are generated from
it — the small sizes use a crop of the "SC" monogram, since the wordmark and
tech icons are unreadable below ~48px.

Generated files:

| File | Size | Source |
| --- | --- | --- |
| `favicon.ico` | 16/32/48/64 | SC monogram crop |
| `favicon-16/32/48/64.png` | 16–64 | SC monogram crop |
| `apple-touch-icon.png` | 180 | full logo |
| `icon-192.png`, `icon-512.png` | 192, 512 | full logo |

To regenerate, install `sharp` and `png-to-ico` with `--no-save` (they are
build-time only and intentionally absent from `package.json`), resize from
this file, and bump `CACHE_NAME` in `public/sw.js` so returning visitors do
not keep the old icon from the service worker cache.
