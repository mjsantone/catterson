# Assets: Editorial

Shot list from CONTENT-SPEC.md. Drop files here with these exact names, run `node build.js`, and they replace their placeholders.

## Lead
- `bolt-dodger.html`: the playable artifact, self-contained HTML. Embedded in a sandboxed iframe (`allow-scripts`, no keys, no auth).

## Supporting
- `*.html`: editorial outputs. Self-contained HTML files are embedded in filename order as scrollable viewers and linked to standalone full-width views. The viewer label comes from the document's `<title>`. Reports are trusted local documents embedded without script permission.
- `direction-folio-split/`: the real Folio direction source. The Editorial detail page shows a manually scoped selection from its core, component, and QA markdown. Markdown files are excluded from `dist` and are not downloadable from the site.
- Published output: `Liebeck v McDonalds  Myth vs the Record.html`, shown as the finished artifact the system produces.
- Held back in `src/content.js`: `bolt-dodger.html`, `Folio System Storybook.html`, and `The Rule Against Perpetuities.html`. The files remain available for later use.
- `scroll-header.mp4`: the scroll-story glass header. Muted loop.
- `gallery-hover.mp4`: the gallery cursor-spotlight hover. Muted loop.
- `generation-speedrun.mp4`: a full report generating, sped up. Muted loop.

Redaction reminder: strip internal names from filenames and metadata before dropping files in.
