# Assets: Agent debrief

Published image sequence from CONTENT-SPEC.md. Run `node build.js` after replacing any derivative.

## Lead

- `images/06 - Show us.webp`: the agent introduces the calls beneath its answer.

## Supporting

- `03_memo.mp4`: each call tied to the passage it produced, with its reasoning beside it.
- `01_challenge.mp4`: pushed with bare authority, the call holds and says why.
- `02_rechallenge.mp4`: given a real reason, the call is revised and the change recorded. Cut from the master in two segments, `12-18` and `32-41.6`, because the master opens by replaying the hold exchange that `01_challenge.mp4` already covers, then sits on "the agent is thinking" for sixteen seconds while the capture tool zooms around an unchanging screen. Rebuild it with:

```sh
ffmpeg -i movs/r1/02_rechallenge.mp4 -filter_complex \
  "[0:v]trim=12:18,setpts=PTS-STARTPTS[a];[0:v]trim=32:41.6,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1[out]" \
  -map "[out]" -c:v libx264 -crf 26 -preset slow -profile:v high -level 4.0 \
  -pix_fmt yuv420p -r 30 -an -movflags +faststart 02_rechallenge.mp4
```
- `*-poster.webp`: frame-zero posters, so each video holds `preload="none"` until it scrolls into view.
- `*-small.mp4`: 960-wide cuts for phones, about 57 percent lighter. A phone renders these near a third of their intrinsic width, so `src/js/site.js` swaps them in below 600px before anything is fetched. Match the framerate of the full-size file beside it, not the master: `02_rechallenge.mp4` is 30fps, the rest are 60.

```sh
ffmpeg -i movs/r1/03_memo.mp4 -vf "scale=960:540:flags=lanczos" -c:v libx264 \
  -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart 03_memo-small.mp4
```

Each published image opens at full resolution. The PNG captures in `images/` are local masters. The quality-92 WebP derivatives are the published assets.

Raw screen recordings stay in `movs/`, which is gitignored and never copied into the build. Compress each keeper to this folder with:

```sh
ffmpeg -i movs/r1/01_challenge.mp4 -c:v libx264 -crf 26 -preset slow -profile:v high \
  -level 4.0 -pix_fmt yuv420p -r 30 -an -movflags +faststart 01_challenge.mp4
```

## Next motion capture

The `movs/r1` capture covers binding, hold, and tracked revise. These still deepen the case. No narration is required. Use one consistent legal report across all clips; do not mix the current hot-dog artifact with the legal framing.

1. `vignettes/01-volunteered-doubt.mp4`: the agent flags its own weakest call, about 8 seconds.
2. `vignettes/05-swap-evidence.mp4`: provide a better source; one call re-grounds, about 10 seconds.
3. `vignettes/06-sign-off-gate.mp4`: attempt sign-off with an unresolved call; the gate stops it, about 8 seconds.
