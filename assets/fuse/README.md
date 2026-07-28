# Asset: Fuse

- `fuse-preview.webp`: 1010x568 capture of the public Fuse canvas with three weighted text ingredients and an active review-framework prompt.
- `images/preview.png`: full-resolution master. Gitignored and never copied into the build.
- Live URL: `https://fuse-catterson-gcakeab6etetcaaq.westus2-01.azurewebsites.net`

The remote app does not load reliably in a cross-origin iframe, so Home uses a clickable preview image instead.

## Recapturing

Home renders the preview in a 505x284 box, so capture at exactly 1010x568 for 2x density.

Two constraints drive the recipe:

1. The canvas sizes itself to the viewport **on load only**. It ignores later resizes, so set the
   viewport before navigating or the canvas keeps its old dimensions.
2. Ingredient blobs are a fixed absolute size, roughly 170px across, and the canvas spreads them
   apart on its own. A wider canvas therefore means smaller, further-apart blobs. Capturing at
   1010 wide keeps the interface chrome at a natural scale but the blobs stay separate rather than
   merging into one metaball. Capturing near 505 wide merges them but makes the chrome look huge.

State lives in memory only, with nothing in localStorage, so a reload clears the ingredients and
they have to be re-entered. The text entry is a plain form, so it commits with `requestSubmit()`:

```js
document.querySelector('footer button[aria-label="Add ingredient"]').click();
document.querySelector('[role="menuitem"]').click();          // Text
const f = document.getElementById('text-entry');
const i = document.getElementById('text-entry-input');
f.style.left = '520px'; f.style.top = '270px';                 // placement hint
i.value = 'legal review'; i.dispatchEvent(new Event('input', { bubbles: true }));
f.requestSubmit();
```

Set the prompt by assigning to the `What should these become?` input, then click empty canvas to
drop the selection so the per-ingredient toolbar is not in frame.
