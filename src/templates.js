// HTML rendering, styled with Tailwind utilities. This file is the only source
// Tailwind scans, so every class must appear here as a literal string.
// piecePage() is the one component the spec asks for: kicker, headline, unlabeled
// standfirst, lead asset, flowing body, supporting assets.
"use strict";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Recurring class recipes. Kept as named constants so the markup below stays legible.
const META = "meta text-ink-faint";
const PAGE = "mx-auto flex min-h-svh max-w-[62rem] flex-col px-[clamp(1.25rem,5vw,3rem)]";
const DISPLAY = "font-display font-normal tracking-[-0.01em] text-balance";
const HOVER_TITLE = "group-hover:italic group-hover:text-oxblood group-focus-visible:italic group-focus-visible:text-oxblood";
const CAPTION =
  "mt-3.5 max-w-[35em] border-t border-line pt-3 font-sans text-[0.78rem] tracking-[0.02em] text-ink-faint";

// While assets were being captured, a missing one rendered a labeled placeholder.
// We are past that: a missing asset now renders nothing, so the page shows only
// real work. A slot still lights up the moment its file lands. Flip this back to
// true to preview the planned slots.
const SHOW_PLACEHOLDERS = false;

// root is "" on the home page and "../" on subpages, so the site works from any base path.
function shell({ site, root, title, description, url, ogType, noindex, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? `<meta name="robots" content="noindex">\n` : ""}<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="${ogType || "website"}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#faf8f4">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${root}fonts/instrument-serif-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}css/site.css">
<script src="${root}js/site.js" defer></script>
</head>
<body data-root="${root}">
<a class="absolute top-0 -left-[100vw] z-10 bg-ink px-4 py-2 font-sans text-sm text-paper focus-visible:left-0" href="#main">Skip to content</a>
${body}
</body>
</html>
`;
}

function figure(asset, resolved, root, slug) {
  const dir = `assets/${slug}/`;
  const cap = asset.caption ? `<figcaption class="${CAPTION}">${esc(asset.caption)}</figcaption>` : "";
  const media = `class="my-[clamp(2.75rem,7vh,4.5rem)]"`;

  if (asset.kind === "video") {
    if (!resolved.exists) {
      return placeholder("Video placeholder", asset.caption, dir + asset.file);
    }
    const poster = resolved.poster ? ` poster="${root}${dir}${asset.poster}"` : "";
    const attrs = asset.sound
      ? `controls preload="metadata"${poster}`
      : `data-autoplay muted loop playsinline preload="${resolved.poster ? "none" : "metadata"}"${poster}`;
    return `<figure ${media}>
<video class="block h-auto w-full bg-ink" ${attrs} src="${root}${dir}${asset.file}" aria-label="${esc(asset.caption)}"></video>
${cap}
</figure>`;
  }

  if (asset.kind === "stills") {
    if (!resolved.files.length) {
      return placeholder("Stills placeholder", asset.caption, dir + asset.prefix + "*.png");
    }
    const imgs = resolved.files
      .map(
        (f, i) =>
          `<img class="block h-auto w-full bg-paper-deep" src="${root}${dir}${f}" alt="${esc(asset.caption)} Still ${i + 1} of ${resolved.files.length}." loading="lazy" decoding="async">`
      )
      .join("\n");
    return `<figure ${media}><div class="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
${imgs}
</div>${cap}</figure>`;
  }

  if (asset.kind === "iframe") {
    if (!resolved.exists) {
      return placeholder("Playable artifact placeholder", asset.caption || asset.title, dir + asset.file);
    }
    return `<figure ${media}>
<div class="aspect-[16/10] bg-ink"><iframe class="block h-full w-full border-0" src="${root}${dir}${asset.file}" title="${esc(asset.title)}" loading="lazy" sandbox="allow-scripts allow-pointer-lock"></iframe></div>
${cap}
</figure>`;
  }

  throw new Error(`Unknown asset kind: ${asset.kind}`);
}

function placeholder(kindLabel, desc, expectedPath) {
  if (!SHOW_PLACEHOLDERS) return "";
  return `<figure class="my-[clamp(2.75rem,7vh,4.5rem)]">
<div class="flex aspect-video flex-col items-center justify-center gap-3 border border-dashed border-line bg-paper-deep p-8 text-center" role="img" aria-label="Placeholder. ${esc(desc)}">
<span class="${META}">${esc(kindLabel)}</span>
<span class="max-w-[26em] leading-[1.4] text-ink-soft italic">${esc(desc)}</span>
<span class="font-mono text-[0.72rem] text-ink-faint">${esc(expectedPath)}</span>
</div>
</figure>`;
}

function header(site, root, right) {
  return `<header class="flex items-baseline justify-between border-b border-line py-7">
<a class="meta text-ink no-underline hover:text-oxblood" href="${root || "./"}">${esc(site.name)}</a>
${right ? `<span class="${META}">${right}</span>` : ""}
</header>`;
}

function footer(site, { clip } = {}) {
  return `<footer class="mt-16 flex items-center justify-between gap-4 border-t border-line py-10">
<a class="${META} no-underline hover:text-oxblood" href="mailto:${esc(site.email)}" title="${esc(site.email)}">Message me</a>
<span class="flex items-center gap-4">
<span class="${META}" title="And with agents.">Made by hand.</span>
${clip ? `<a class="p-1.5 leading-none text-ink-faint transition-[transform,color] duration-200 hover:-rotate-8 hover:text-oxblood motion-reduce:hover:rotate-0" href="clippy/" aria-label="A paperclip"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.5l-8.7 8.7a5.9 5.9 0 0 1-8.4-8.4l9.2-9.2a3.9 3.9 0 0 1 5.6 5.6l-8.8 8.8a2 2 0 0 1-2.8-2.8l7.9-7.9"/></svg></a>` : ""}
</span>
</footer>`;
}

function home({ site, pieces, copies }) {
  const entries = pieces
    .map(
      (p) => `<a class="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-line py-[clamp(1.6rem,4vh,2.4rem)] no-underline max-sm:grid-cols-1 max-sm:gap-2.5" id="${p.slug}" href="${p.slug}/">
<span class="${DISPLAY} ${HOVER_TITLE} text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] transition-colors duration-150">${esc(copies[p.slug].headline)}</span>
<span class="${META} justify-self-end text-right max-sm:justify-self-start max-sm:text-left">${esc(p.kicker)}</span>
</a>`
    )
    .join("\n");

  const body = `<div class="${PAGE}">
<header class="pt-[clamp(4rem,16vh,9rem)] pb-[clamp(2.5rem,7vh,4.5rem)]">
<h1 class="${DISPLAY} max-w-[12em] text-[clamp(2.9rem,8.2vw,6.5rem)] leading-[0.98]">${esc(site.name)}</h1>
<p class="meta mt-6 text-ink-soft">${esc(site.tagline)}</p>
</header>
<main id="main" class="flex-1">
<nav class="mb-16 border-b border-line" aria-label="Pieces">
${entries}
</nav>
</main>
${footer(site, { clip: true })}
</div>`;

  return shell({
    site,
    root: "",
    title: site.name,
    description: site.tagline,
    url: site.url,
    body,
  });
}

function piecePage({ site, piece, copy, resolved, index, total, prev, next }) {
  const root = "../";
  const num = String(index + 1).padStart(2, "0");

  // The opening paragraph gets a drop cap set in the display face.
  const DROP_CAP =
    "first-letter:float-left first-letter:font-display first-letter:text-[3.4em] first-letter:leading-[0.8] first-letter:pr-[0.12em] first-letter:mt-[0.05em]";

  const paragraphs = [];
  copy.body.forEach((para, i) => {
    paragraphs.push(`<p class="text-pretty${i === 0 ? " " + DROP_CAP : ""}">${esc(para)}</p>`);
    if (piece.pullQuote && piece.pullQuote.afterParagraph === i + 1) {
      paragraphs.push(
        `<blockquote class="my-[2.6em] border-y border-line py-[1.8em]"><p class="font-display text-center text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.25] text-balance italic">${esc(piece.pullQuote.text)}</p></blockquote>`
      );
    }
  });

  const supporting = piece.supporting
    .map((a, i) => figure(a, resolved.supporting[i], root, piece.slug))
    .join("\n");

  const flipLink = (href, label, title, right) =>
    `<a class="group flex flex-col gap-2 no-underline${right ? " ml-auto text-right" : ""}" href="${href}"><span class="${META}">${label}</span><span class="${HOVER_TITLE} font-display text-[1.5rem]">${esc(title)}</span></a>`;

  const nav = `<nav class="flex justify-between gap-8 border-t border-line py-10" aria-label="More pieces">
${prev ? flipLink(`../${prev.slug}/`, "Previous", prev.title) : flipLink("../", "Start", "Index")}
${next ? flipLink(`../${next.slug}/`, "Next", next.title, true) : flipLink("../", "End", "Back to the index", true)}
</nav>`;

  const body = `<div class="${PAGE}">
${header(site, root, `${num}&hairsp;/&hairsp;${String(total).padStart(2, "0")}`)}
<main id="main" class="flex-1">
<article>
<header class="max-w-[44rem] pt-[clamp(3rem,9vh,5.5rem)]">
<p class="${META}"><span class="mr-[1em] text-oxblood">${num}</span>${esc(piece.kicker)}</p>
<h1 class="${DISPLAY} mt-6 text-[clamp(2.7rem,6.6vw,4.75rem)] leading-[1.0]">${esc(copy.headline)}</h1>
<h2 class="mt-6 text-[clamp(1.25rem,2.4vw,1.5rem)] leading-[1.45] font-normal text-pretty text-ink-soft italic">${esc(copy.standfirst)}</h2>
</header>
${figure(piece.lead, resolved.lead, root, piece.slug)}
<div class="max-w-[35em] space-y-[1.35em] [font-variant-numeric:oldstyle-nums] [hanging-punctuation:first_last]">
${paragraphs.join("\n")}
</div>
${supporting}
</article>
${nav}
</main>
${footer(site)}
</div>`;

  return shell({
    site,
    root,
    title: `${copy.headline} · ${site.name}`,
    description: copy.standfirst,
    url: `${site.url}${piece.slug}/`,
    ogType: "article",
    body,
  });
}

function clippyPage({ site, clippy, resolved }) {
  const root = "../";
  const body = `<div class="${PAGE}">
${header(site, root)}
<main id="main" class="flex-1">
<article>
<header class="pt-[clamp(3rem,9vh,5.5rem)]">
<h1 class="${DISPLAY} text-[clamp(2.7rem,6.6vw,4.75rem)] leading-[1.0]">${esc(clippy.title)}</h1>
<h2 class="mt-6 text-[clamp(1.25rem,2.4vw,1.5rem)] leading-[1.45] font-normal text-pretty text-ink-soft italic">${esc(clippy.standfirst)}</h2>
</header>
${figure(clippy.lead, resolved.lead, root, clippy.slug)}
</article>
</main>
${footer(site)}
</div>`;

  return shell({
    site,
    root,
    title: `${clippy.title} · ${site.name}`,
    description: clippy.standfirst,
    url: `${site.url}clippy/`,
    noindex: true,
    body,
  });
}

// GitHub Pages serves this from the root for any missing path, so every URL in it
// must be absolute. The line is a self-quote from the kit piece.
function notFound({ site }) {
  const root = site.url;
  const body = `<div class="${PAGE}">
${header(site, root)}
<main id="main" class="flex-1">
<article>
<header class="pt-[clamp(3rem,9vh,5.5rem)]">
<h1 class="${DISPLAY} text-[clamp(2.7rem,6.6vw,4.75rem)] leading-[1.0]">This page stayed out.</h1>
<h2 class="mt-6 text-[clamp(1.25rem,2.4vw,1.5rem)] leading-[1.45] font-normal text-pretty text-ink-soft italic">The restraint is the design.</h2>
<p class="mt-10"><a class="${META} no-underline hover:text-oxblood" href="${esc(site.url)}">Back to the index</a></p>
</header>
</article>
</main>
${footer(site)}
</div>`;

  return shell({
    site,
    root,
    title: `Not found · ${site.name}`,
    description: "This page stayed out.",
    url: site.url,
    noindex: true,
    body,
  });
}

module.exports = { home, piecePage, clippyPage, notFound };
