# Brand assets

Source artwork kept out of `public/` on purpose: everything in `public/` is
copied verbatim into the build, so a 1.1MB source image would be shipped to
every visitor even though no page references it.

## logo-source.png

Full circular logo (1254x1254) drawn on a square white canvas. The favicons in
`public/` are generated from it — the small sizes use a crop of the "SC"
monogram, since the wordmark and tech icons are unreadable below ~48px.

The ring sits at centre (625, 626.5) with a minimum radius of 615, so icons are
cropped to that square and masked to a circle. Without the mask the square white
canvas ships with the icon and the logo reads as a circle *inside a white box*.

Generated files:

| File | Size | Source | Shape |
| --- | --- | --- | --- |
| `favicon.ico` | 16/32/48/64 | SC monogram crop | round, transparent |
| `favicon-16/32/48.png` | 16–48 | SC monogram crop | round, transparent |
| `favicon-64.png` | 64 | full logo | round, transparent |
| `icon-192.png`, `icon-512.png` | 192, 512 | full logo | round, transparent |
| `apple-touch-icon.png` | 180 | full logo | round on **opaque** white |
| `icon-512-maskable.png` | 512 | full logo | opaque, 80% safe zone |

Two files stay opaque on purpose:

- **`apple-touch-icon.png`** — iOS ignores alpha here and composites
  transparency against black, so a transparent circle would render as a black
  square. iOS applies its own rounded-rect mask on top.
- **`icon-512-maskable.png`** — Android crops `purpose: "maskable"` icons to its
  own shape and only guarantees the inner 80%, so the logo is inset into that
  safe zone. Masking it to a circle first would get it double-cropped.

To regenerate, install `sharp` and `png-to-ico` with `--no-save` (they are
build-time only and intentionally absent from `package.json`), resize from
this file, and bump `CACHE_NAME` in `public/sw.js` so returning visitors do
not keep the old icon from the service worker cache.
