# Resume source

> **The shipped resume is no longer generated from this folder.** Since
> November 2026, `public/images/resume.pdf` is the owner's own exported PDF
> (the two-page version with TejViral, Voteniti, Oneisok, Satyanarayan Travel,
> and Avatar Ink). `resume.html` predates it and is kept only for reference.
> **Do not run the command below** unless you first bring `resume.html` up to
> date, or it will overwrite the current resume with older content.
>
> To update the resume, replace `public/images/resume.pdf` in place. Keep that
> filename: the URL has been live and shared, and every link reads it from
> `RESUME_URL` in `src/constants/resume.ts`. Visitors still download it as
> `Sourav_Chowdhury_Resume.pdf`.

`resume.html` was the source for `public/images/resume.pdf`, which the site
serves from the hero, footer, and command palette.

The photo is read from `public/profile.jpg` at render time (generated from
`assets/profile/profile-source.png`), so run the command from the repo root.

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
