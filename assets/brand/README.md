# Brand assets

Source artwork kept out of `public/` on purpose: everything in `public/` is
copied verbatim into the build, so a 1.1MB source image would be shipped to
every visitor even though no page references it.

## logo-source.png

Full circular logo (1254x1254) drawn on a square white canvas. Every icon in
`public/` is generated from it, so they are all the same artwork at different
sizes.

The ring sits at centre (625, 626.5) with a minimum radius of 615, so icons are
cropped to that square and masked to a circle. Without the mask the square white
canvas ships with the icon and the logo reads as a circle *inside a white box*.

Generated files:

| File | Size | Shape |
| --- | --- | --- |
| `favicon.ico` | 16/32/48/64 | round, transparent |
| `favicon-16/32/48/64.png` | 16–64 | round, transparent |
| `icon-192.png`, `icon-512.png` | 192, 512 | round, transparent |
| `apple-touch-icon.png` | 180 | round on **opaque** white |
| `icon-512-maskable.png` | 512 | opaque, 80% safe zone |

Note the wordmark and tech icons in the logo are not legible below ~48px; the
small sizes read as a coloured disc. Cropping to the "SC" monogram would be
sharper at tab size, at the cost of the favicon no longer matching the app icon.

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
