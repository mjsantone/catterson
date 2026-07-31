# Assets: Starter kit

Shot list from CONTENT-SPEC.md. Drop files here with these exact names, run `node build.js`, and they replace their placeholders.

## Lead
- `images/persona.webp`: the synthetic user picker open over the persona's own greeting, cropped from `images/persona.png` to 16:9 so the browser chrome, its address bar, and the model label stay out of frame. Regenerate with:

```sh
ffmpeg -i images/persona.png -vf "crop=2086:1173:205:872,scale=1600:900:flags=lanczos" /tmp/kit.png
cwebp -q 92 -m 6 -mt -sharp_yuv -metadata none /tmp/kit.png -o images/persona.webp
```

- `images/*.png`: full-resolution masters. Gitignored and never copied into the build.

## Supporting
- `restraint-01.png`, `restraint-02.png`, ... : restraint-detail stills, if present. Any count works; they render in filename order.

When real stills land, review the generated alt text in `src/content.js` and make it specific.
