# Assets: Editorial

Shot list from CONTENT-SPEC.md. Drop files here with these exact names, run `node build.js`, and they replace their placeholders.

## Lead
- `bolt-dodger.html`: the playable artifact, self-contained HTML. Embedded in a sandboxed iframe (`allow-scripts`, no keys, no auth).

## Supporting
- Published carousel, in order: `The Rule Against Perpetuities.html`, `Liebeck v McDonalds  Myth vs the Record.html`, and `The Fox and the Baseball.html`. Liebeck is the featured center slide. Each self-contained output stays scrollable and links to a standalone full-width view. One doctrine explainer, one report, one scroll story, so the three show different outputs rather than the same output three times.
- Generated artifacts embed their images as base64. They arrive as PNG and must be converted before publishing, which takes roughly ninety percent off the file. Decode each `data:image/png;base64` payload, run `cwebp -q 86 -m 6 -mt -sharp_yuv -metadata none`, and write it back as `data:image/webp;base64`.
- Posters are the first screen of each artifact at 896x504, so the still matches what the iframe shows on load. Capture with:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --virtual-time-budget=9000 --window-size=896,504 --screenshot=/tmp/p.png "file:///path/to/artifact.html"
ffmpeg -i /tmp/p.png -vf "scale=896:504:flags=lanczos" /tmp/p896.png
cwebp -q 88 -m 6 -mt -sharp_yuv -metadata none /tmp/p896.png -o posters/name.webp
```

- Filenames are matched case-sensitively by the build manifest even though macOS is not, so the name in `src/content.js` must match the file exactly or the artifact silently fails to copy into `dist`.
- `direction-folio-split/`: the real Folio direction source. The Editorial detail page shows a manually scoped selection from its core, component, and QA markdown. Markdown files are excluded from `dist` and are not downloadable from the site.
- Held back in `src/content.js`: `bolt-dodger.html`.
- `scroll-header.mp4`: the scroll-story glass header. Muted loop.
- `gallery-hover.mp4`: the gallery cursor-spotlight hover. Muted loop.
- `generation-speedrun.mp4`: a full report generating, sped up. Muted loop.

Redaction reminder: strip internal names from filenames and metadata before dropping files in.
