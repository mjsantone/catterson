# Assets: Steering

Shot list from CONTENT-SPEC.md. Drop files here with these exact names, run `node build.js`, and they replace their placeholders. All fresh capture.

Raw screen recordings stay in per-capture revision folders (`r1/`, `r2/`, `r3/`, ...), which are gitignored and never copied into the build. `r4/` is the current source: it runs the loop against public frontier-model news on localhost, so no colleague names, internal projects, or tenant URLs appear on screen. Compress each keeper to this folder with:

```sh
ffmpeg -i r4/01_create.mp4 -c:v libx264 -crf 26 -preset slow -profile:v high \
  -level 4.0 -pix_fmt yuv420p -r 30 -an -movflags +faststart 01_create.mp4
```

## Lead

- `01_create.mp4`: start the task in chat, no preferences form. Muted loop, autoplay-safe.
- `01_create-poster.webp`: frame-zero poster, so the video holds `preload="none"` until it scrolls into view.

## Supporting

- `02_learn.mp4`: refine the result, then save the run as a named workflow. Muted loop.
- `02_learn-poster.webp`: frame-zero poster.
- `03_reuse.mp4`: reuse the saved workflow; each rule shows the correction it came from. Muted loop.
- `03_reuse-poster.webp`: frame-zero poster.
- `eval-rule-adherence.webp`: the eval harness showing per-rule adherence, confidence intervals, and decay as rules stack. Still needed.
- `state-01.png`, `state-02.png`, ... : state stills. Any count works; they render in filename order.

Superseded by the `r4/` capture and no longer referenced: `00_chat-input.mp4`, `01_save-to-workflow.mp4`, `02_reuse-workflow.mp4`. These show real colleague names and internal project names, so they should be deleted rather than left in the build.
