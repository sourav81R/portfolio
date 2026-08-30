# Brand assets

Source artwork kept out of `public/` on purpose: everything in `public/` is
copied verbatim into the build, so a 1.1MB source image would be shipped to
every visitor even though no page references it.

## logo-source.png

Full circular logo (1254x1254) drawn on a square white canvas.

The app icons use the whole logo. The favicons use the "SC" glyph alone with the
white ground knocked out: at 16-32px the full logo is mostly white with a thin
pale ring, which disappears against a light browser tab strip. The knockout keys
off **saturation**, not lightness — the ribbon carries bright highlights that a
lightness threshold erases along with the background.

The ring sits at centre (625, 626.5) with a minimum radius of 615, so icons are
cropped to that square and masked to a circle. Without the mask the square white
canvas ships with the icon and the logo reads as a circle *inside a white box*.

Generated files:

| File | Size | Shape |
| --- | --- | --- |
| `favicon.ico` | 16/32/48/64 | SC glyph, transparent ground |
| `favicon-16/32/48/64.png` | 16–64 | SC glyph, transparent ground |
| `icon-192.png`, `icon-512.png` | 192, 512 | round, transparent |
| `apple-touch-icon.png` | 180 | round on **opaque** white |
| `icon-512-maskable.png` | 512 | opaque, 80% safe zone |


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
