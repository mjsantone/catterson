# Assets: Production code

This mini inline story is published on Home and has no detail route.

## Lead

- `images/pull-requests.webp`: the merged pull request list. The slot renders nothing until this file exists, so Home is safe to ship without it.

The shape is the proof, not the text: row count, completed badges, review avatars, comment counts. Every title, repository name, branch name, feature codename, and reviewer identity has to be obscured or replaced before this ships. The source capture shows internal project names in every row.

Crop to 16:9 and export at 1600x900 so it matches the other two inline stories:

```sh
ffmpeg -i images/pull-requests.png -vf "crop=W:H:X:Y,scale=1600:900:flags=lanczos" /tmp/pr.png
cwebp -q 92 -m 6 -mt -sharp_yuv -metadata none /tmp/pr.png -o images/pull-requests.webp
```

- `images/*.png`: full-resolution masters. Gitignored and never copied into the build.

Update the caption in `src/content.js` once the real crop lands, so it describes what is actually visible.
