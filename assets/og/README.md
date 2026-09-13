# Open Graph preview source

`og-preview.html` is the source for `public/og-preview-2026.png`, the card
shown when the site is shared on WhatsApp, LinkedIn, Slack or X. Editing the
PNG directly is not practical, so change the HTML and re-render.

The page is self-contained: no webfonts and no external images, so a screenshot
renders identically on any machine. A webfont that failed to load would
silently change the layout.

## Regenerating

```bash
chrome --headless --disable-gpu --hide-scrollbars \
  --window-size=1200,630 \
  --screenshot=assets/og/tmp.png \
  "file:///$(pwd)/assets/og/og-preview.html"
```

Pass an absolute `file://` URL. On Windows the binary is usually at
`C:\Program Files\Google\Chrome\Application\chrome.exe`, and `$(pwd -W)` gives
Chrome a path it understands from Git Bash.

Chrome writes a ~390 KB PNG because it stores the background gradients
inefficiently. Compress before shipping:

```bash
npm install --no-save sharp
node -e "require('sharp')('assets/og/tmp.png').png({quality:80,compressionLevel:9,palette:true}).toFile('public/og-preview-2026.png')"
```

That lands around 69 KB with no visible loss - the art is flat colour and text,
so the palette quantisation is invisible. Delete `tmp.png` afterwards.

## Size

Must stay exactly 1200x630. That is what the platforms expect, and it is
declared in `index.html` as `og:image:width` / `og:image:height`. Changing the
canvas means changing those meta tags too.

## Filename

The file carries a year suffix. Social platforms and Google cache preview
images aggressively by URL, so replacing the bytes of an existing filename
leaves the old card showing for weeks. Ship a new path instead, and update both
`og:image` and `twitter:image`.

The previous card (`public/og-preview.png`, June 2026) is kept so links shared
before the change do not break. It can be deleted once nothing references it.

## Content

Keep it honest and current. The June 2026 version said "Open to full-time
roles" after the Oneisok role had started, which read as job-hunting, and its
badges listed Firebase and Tailwind rather than the Next.js and PostgreSQL the
site now leads with.
