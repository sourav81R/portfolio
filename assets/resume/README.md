# Resume source

`resume.html` is the source for `public/images/resume.pdf`, which the site
serves from the hero, footer, and command palette. Editing the PDF directly is
not possible, so change the HTML and re-render.

The photo is read from `public/profile.jpg` at render time, so run the command
from the repo root.

## Regenerating

```bash
chrome --headless --disable-gpu --no-pdf-header-footer \n  --print-to-pdf=public/images/resume.pdf \n  "file:///$(pwd)/assets/resume/resume.html"
```

Pass an absolute `file://` URL - a bare relative path makes Chrome resolve the
stylesheet and photo from the wrong base and the layout collapses to one page.

On Windows the binary is usually at
`C:\Program Files\Google\Chrome\Application\chrome.exe`.

Keep it to two A4 pages. `@page` margins and the `.nb` (no-break) class on each
entry stop a job or project from splitting across the page boundary.
