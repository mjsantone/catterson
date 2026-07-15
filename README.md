# catterson

A lean, static, flip-through portfolio. Paper and ink, one serif, four pieces.

## How it works

- `node build.js` writes the whole site to `dist/`. No dependencies, no framework.
- The words are parsed straight out of the four `copy-*.md` files at build time
  (headline, standfirst, body), so the rendered copy is verbatim by construction.
  Edit the copy files, rebuild, done.
- `src/content.js` holds everything that is not copy: piece order, asset slots,
  and generated microcopy (captions, labels). `src/templates.js` renders the one
  piece component used by all four pieces. `src/css/site.css` is the design.
- Assets are looked up on disk. A missing file renders as a labeled placeholder
  showing the exact path it expects. Drop the file in `assets/<piece>/` with the
  name from that folder's README, rebuild, and it replaces its placeholder.
- The build fails if an em dash, an internal term, or the word "built" sneaks
  into generated output (see `shipChecks` in `build.js`).

## Local preview

```
node build.js
python3 -m http.server 8000 --directory dist
```

## Deploy

Pushes to `main` build and deploy to GitHub Pages via
`.github/workflows/deploy.yml`. In the repo settings, set Pages to deploy from
GitHub Actions. If the site moves to a custom domain, change `site.url` in
`src/content.js` so canonical and OG URLs follow.

## Source of truth

`CONTENT-SPEC.md` governs the build. `voice-and-tone.md` governs any microcopy.
The four `copy-*.md` files are final and verbatim.
