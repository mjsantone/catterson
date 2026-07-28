# Assets: Document editing

This mini inline story is published on Home and has no detail route.

## Lead

- `images/confirm.webp`: the proposed edit sitting in the document as tracked changes, with Accept all and Reject all, beside the chat request that produced it. Cropped from `images/confirm.png` to 16:9 so the browser chrome and its address bar stay out of frame. Regenerate with:

```sh
ffmpeg -i images/confirm.png -vf "crop=2946:1657:241:185,scale=1600:900:flags=lanczos" /tmp/de.png
cwebp -q 92 -m 6 -mt -sharp_yuv -metadata none /tmp/de.png -o images/confirm.webp
```

- `images/*.png`: full-resolution masters. Gitignored and never copied into the build.

A moving version would still be stronger: one unbroken take selecting text, opening Ask from the floating toolbar, and showing the edit stream back as tracked changes. Muted loop, 16:9, 1920x1080 preferred, 15 to 25 seconds.

Remove internal names, tenant data, URLs, identifiers, and browser chrome before publishing.
