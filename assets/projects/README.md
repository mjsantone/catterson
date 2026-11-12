# Assets: Projects

Four moments, one story: it knows your work, it organizes it, it keeps you current, it acts for you. Every slot is optional until captured; the build renders a labeled placeholder in the meantime. Run `node build.js` after adding any file.

Redaction first: synthetic persona only. No real colleague names or avatars, no tenant names in headers, no real source titles or quotes, no internal product or pipeline names in page titles or tabs. Send any drafted email only to yourself.

## Lead

- `01_home.mp4`: Home opens on cards from real work (requests to you, commitments, decisions waiting). Hover or open one so the "why it is here" and the source link are visible. Scroll to suggested projects. 12 to 18s.

## Supporting

- `02_create.mp4`: start from a suggested project (blank start is not ready). Two setup questions, Create, then hold while connections fill in and move from Preparing to Ready. 12 to 18s.
- `03_catchup.mp4`: use a private project with active chats. Return to it, let the Now write "since your last visit", show a citation, and show one held-back item with its reason. 10 to 15s.
- `04_act.mp4`: turn on "Draft emails in Outlook's compose" and "Revise items in place". Ask for an email from the project's evidence, confirm, then "make it shorter" and show the in-place revision and the note on what changed. 15 to 20s.
- `layers-*.webp`: stills of the two-layer split, what people see above and the receipts view below.
- `*-poster.webp`: frame-zero posters, so each video holds `preload="none"` until it scrolls into view.
- `*-small.mp4`: 960-wide cuts for phones. Match the framerate of the full-size file beside it.

```sh
ffmpeg -i movs/01_home.mov -vf "scale=960:540:flags=lanczos" -c:v libx264 \
  -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart 01_home-small.mp4
```

Social card: `assets/social/projects.jpg`, 1200x630. A poster frame from the lead works.
