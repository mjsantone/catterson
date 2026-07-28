# Assets: Production code

This mini inline story is published on Home and has no detail route.

## Lead

- `images/diff.webp`: the overlay panel from a pull request's visual regression check, one render in pink and the other in green, with the offsets showing where the layout moved.

Cropped from `images/diff.png`, a three-panel export: baseline, overlay, and new render. Only the middle panel is published.

```sh
ffmpeg -i images/diff.png -vf "crop=604:340:1618:181" /tmp/diff.png
cwebp -q 92 -m 6 -mt -sharp_yuv -metadata none /tmp/diff.png -o images/diff.webp
```

The crop stays at native resolution on purpose. The component render is only about 384px wide in the source, so enlarging it to match the 1600x900 of the other inline stories would invent detail and soften the type. At 604px the browser scales down into the 448px slot instead of up.

Nothing here needs redaction. The sample content is generic and no title, repository, branch, or reviewer appears.

- `images/*.png`: full-resolution masters. Gitignored and never copied into the build.
