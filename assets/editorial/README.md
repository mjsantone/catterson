# Assets: Editorial

Shot list from CONTENT-SPEC.md. Drop files here with these exact names, run `node build.js`, and they replace their placeholders.

## Lead
- `bolt-dodger.html`: the playable artifact, self-contained HTML. Embedded in a sandboxed iframe (`allow-scripts`, no keys, no auth).

## Supporting
- Published carousel, in order: `Folio System Storybook.html`, `Liebeck v McDonalds  Myth vs the Record.html`, and `The Rule Against Perpetuities.html`. Liebeck is the featured center slide. Each self-contained output stays scrollable and links to a standalone full-width view.
- `direction-folio-split/`: the real Folio direction source. The Editorial detail page shows a manually scoped selection from its core, component, and QA markdown. Markdown files are excluded from `dist` and are not downloadable from the site.
- Held back in `src/content.js`: `bolt-dodger.html`.
- `scroll-header.mp4`: the scroll-story glass header. Muted loop.
- `gallery-hover.mp4`: the gallery cursor-spotlight hover. Muted loop.
- `generation-speedrun.mp4`: a full report generating, sped up. Muted loop.

Redaction reminder: strip internal names from filenames and metadata before dropping files in.
