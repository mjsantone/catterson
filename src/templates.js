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

const RANSOM_FONTS = [
  "Abril Fatface",
  "Bebas Neue",
  "Bungee Shade",
  "DM Serif Display",
  "Alfa Slab One",
  "Fredericka the Great",
  "Lobster",
  "Monoton",
  "Pacifico",
  "Playfair Display",
  "Rye",
  "Rubik Mono One",
];
const RANSOM_CLUSTERS = ["Sa", "to"];

function ransomClusters(word) {
  const clusters = [];
  for (let index = 0; index < word.length;) {
    const cluster = RANSOM_CLUSTERS.find((candidate) => word.startsWith(candidate, index));
    clusters.push(cluster || word[index]);
    index += cluster ? cluster.length : 1;
  }
  return clusters;
}

function ransomName(name) {
  let index = 0;
  const words = name.split(" ").map((word) => {
    const letters = ransomClusters(word).map((letter) => {
      const font = RANSOM_FONTS[index % RANSOM_FONTS.length];
      index++;
      return `<span class="home-name__letter" data-letter="${esc(letter)}" style="--ransom-font: '${font}'" aria-hidden="true"><span class="home-name__base">${esc(letter)}</span></span>`;
    });
    return `<span class="home-name__word">${letters.join("")}</span>`;
  });
  return words.join(" ");
}

// Recurring class recipes. Kept as named constants so the markup below stays legible.
const META = "meta text-ink-faint";
const PAGE = "mx-auto flex min-h-svh max-w-[62rem] flex-col px-[clamp(1.25rem,5vw,3rem)]";
const DISPLAY = "font-display [font-weight:440] tracking-[-0.01em] text-balance";
const HOVER_TITLE = "group-hover:italic group-hover:text-oxblood group-focus-visible:italic group-focus-visible:text-oxblood";
const CAPTION =
  "mt-3.5 max-w-[35em] font-sans text-[0.78rem] tracking-[0.02em] text-ink-faint";
const DROP_CAP =
  "first-letter:float-left first-letter:font-display first-letter:text-[3.4em] first-letter:leading-[0.8] first-letter:pr-[0.12em] first-letter:mt-[0.05em]";
const DETAIL_HEADLINE = `${DISPLAY} mt-6 text-[48px] leading-[1.02] sm:text-[64px]`;
const DETAIL_STANDFIRST =
  "mt-6 max-w-[44rem] text-[28px] leading-[1.4] font-normal text-pretty text-ink-soft italic sm:text-[32px]";
const BODY_LARGE = "max-w-[44rem] text-[24px] leading-[1.7] text-pretty";
const BODY_MEDIUM = "max-w-[44rem] text-[20px] leading-[1.7] text-pretty";

function bodyParagraph(text, index, total) {
  const size = index === 0 || index === total - 1 ? BODY_LARGE : BODY_MEDIUM;
  return `<p class="${size}${index === 0 ? " " + DROP_CAP : ""}">${esc(text)}</p>`;
}

// While assets were being captured, a missing one rendered a labeled placeholder.
// We are past that: a missing asset now renders nothing, so the page shows only
// real work. A slot still lights up the moment its file lands. Flip this back to
// true to preview the planned slots.
const SHOW_PLACEHOLDERS = false;

// root is "" on the home page and "../" on subpages, so the site works from any base path.
function shell({ site, root, title, description, url, ogType, noindex, body }) {
  return `<!doctype html>
<html lang="en" class="site-locked">
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
<script>try{if(localStorage.getItem("catterson.access.v1")==="open")document.documentElement.className="site-unlocked"}catch(e){}try{if(sessionStorage.getItem("catterson.access.v1")==="open")document.documentElement.className="site-unlocked"}catch(e){}</script>
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${root}fonts/fraunces-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}css/site.css">
<script src="${root}js/password-gate.js" defer></script>
<script src="${root}js/site.js" defer></script>
<script src="${root}js/clippy-cameo.js" defer></script>
</head>
<body data-root="${root}">
<div class="password-gate" id="password-gate" data-site-name="${esc(site.name)}">
<header class="password-gate__header">
<span class="meta">${esc(site.name)}</span>
<span class="meta text-ink-faint">Private preview</span>
</header>
<main class="password-gate__main">
<form class="password-gate__form" id="password-gate-form" novalidate>
<label class="password-gate__label" for="password-gate-input">Enter password</label>
<p class="password-gate__hint" id="password-gate-hint">Nine letters</p>
<div class="password-gate__entry" id="password-gate-entry">
<input class="password-gate__input" id="password-gate-input" name="password" type="password" maxlength="9" autocomplete="current-password" autocapitalize="none" spellcheck="false" aria-describedby="password-gate-hint password-gate-status" aria-invalid="false">
<div class="password-gate__cells" aria-hidden="true">
${Array.from({ length: 9 }, () => '<span class="password-gate__cell"></span>').join("\n")}
</div>
</div>
<p class="password-gate__status" id="password-gate-status" role="status" aria-live="polite"></p>
<button class="sr-only" type="submit">Unlock portfolio</button>
</form>
</main>
</div>
<div class="site-content">
<a class="absolute top-0 -left-[100vw] z-10 bg-ink px-4 py-2 font-sans text-sm text-paper focus-visible:left-0" href="#main">Skip to content</a>
${body}
</div>
</body>
</html>
`;
}

function figure(asset, resolved, root, slug, opts) {
  const dir = `assets/${slug}/`;
  const cap = asset.caption ? `<figcaption class="${CAPTION}">${esc(asset.caption)}</figcaption>` : "";
  const media = opts && opts.flush
    ? `class=""`
    : opts && opts.lead
      ? `class="mt-16 mb-[clamp(2.75rem,7vh,4.5rem)]"`
      : `class="my-[clamp(2.75rem,7vh,4.5rem)]"`;

  if (asset.kind === "video") {
    if (!resolved.exists) {
      return placeholder("Video placeholder", asset.caption, dir + asset.file);
    }
    const poster = resolved.poster ? ` poster="${root}${dir}${asset.poster}"` : "";
    const attrs = asset.sound
      ? `controls preload="metadata"${poster}`
      : `data-autoplay muted loop playsinline preload="${resolved.poster ? "none" : "metadata"}"${poster}`;
    return `<figure ${media}>
<video class="block h-auto w-full rounded-[32px] bg-ink" ${attrs} src="${root}${dir}${asset.file}" aria-label="${esc(asset.caption)}"></video>
${cap}
</figure>`;
  }

  if (asset.kind === "stills") {
    if (!resolved.files.length) {
      const expected = asset.files ? asset.files.join(", ") : dir + asset.prefix + "*.png";
      return placeholder("Stills placeholder", asset.caption, expected);
    }
    const imgs = resolved.files
      .map(
        (f, i) => {
          const src = `${root}${dir}${f.split("/").map(encodeURIComponent).join("/")}`;
          const alt = resolved.files.length === 1
            ? asset.caption
            : `${asset.caption} Still ${i + 1} of ${resolved.files.length}.`;
          const image = `<img class="block h-auto w-full rounded-[32px] bg-paper-deep" src="${src}" alt="${esc(alt)}" loading="${opts && opts.lead ? "eager" : "lazy"}" decoding="async"${opts && opts.lead ? ' fetchpriority="high"' : ""}>`;
          return asset.fullView
            ? `<a class="block cursor-zoom-in" href="${src}" target="_blank" rel="noopener" aria-label="View full-size image: ${esc(asset.caption)}" title="Open full size">${image}</a>`
            : image;
        }
      )
      .join("\n");
    const layout = asset.layout === "sequence"
      ? "grid gap-[clamp(1rem,3vw,1.5rem)]"
      : "grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4";
    const fullViewSrc = asset.fullView
      ? `${root}${dir}${resolved.files[0].split("/").map(encodeURIComponent).join("/")}`
      : "";
    const stillsCap = asset.caption
      ? asset.fullView
        ? `<figcaption class="mt-3.5 flex max-w-[44rem] flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-sans text-[0.78rem] tracking-[0.02em] text-ink-faint"><span>${esc(asset.caption)}</span><a class="shrink-0 text-ink no-underline hover:text-oxblood" href="${fullViewSrc}" target="_blank" rel="noopener">Open full size <span aria-hidden="true">↗</span></a></figcaption>`
        : cap
      : "";
    return `<figure ${media}><div class="${layout}">
${imgs}
</div>${stillsCap}</figure>`;
  }

  if (asset.kind === "documents") {
    if (!resolved.files.length) {
      return placeholder("Document placeholder", "Editorial outputs", dir + "*.html");
    }
    const slides = resolved.files
      .map(({ file, title }, index) => {
        const src = `${root}${dir}${file.split("/").map(encodeURIComponent).join("/")}`;
        const active = index === resolved.featuredIndex;
        const inactiveAttrs = active ? "" : ` aria-hidden="true"`;
        const inactiveTab = active ? "" : ` tabindex="-1"`;
        return `<div class="document-carousel__slide" data-carousel-slide data-active="${active}"${inactiveAttrs}>
      <div class="document-carousel__frame"><iframe class="block h-full w-full border-0 bg-paper" src="${esc(src)}" title="${esc(title)}" loading="eager" sandbox="allow-same-origin" data-document-viewer${inactiveTab}></iframe></div>
<div class="document-carousel__caption">
<span>${esc(title)}</span>
      <a class="shrink-0 text-ink no-underline hover:text-oxblood" href="${esc(src)}" target="_blank" rel="noopener" aria-label="Open ${esc(title)} full view" title="Open full view"${inactiveTab}>Open full view <span aria-hidden="true">↗</span></a>
 </div>
</div>`;
      })
      .join("\n");
    return `<figure ${media}>
<div class="document-carousel" data-document-carousel data-featured-index="${resolved.featuredIndex}">
<div class="document-carousel__viewport" data-carousel-viewport tabindex="0" aria-label="Editorial outputs">
<div class="document-carousel__track">
${slides}
</div>
</div>
<div class="document-carousel__controls">
<button class="document-carousel__button" type="button" data-carousel-prev aria-label="Previous output" title="Previous output">←</button>
<button class="document-carousel__button" type="button" data-carousel-next aria-label="Next output" title="Next output">→</button>
</div>
</div>
</figure>`;
  }

  if (asset.kind === "iframe") {
    if (!resolved.exists) {
      return placeholder("Playable artifact placeholder", asset.caption || asset.title, dir + asset.file);
    }
    const sandbox = asset.sandbox || "allow-scripts allow-pointer-lock";
    const fullscreen = asset.fullscreen ? ` allow="fullscreen"` : "";
    return `<figure ${media}>
<div class="aspect-[16/10] bg-ink"><iframe class="block h-full w-full border-0" src="${root}${dir}${asset.file}" title="${esc(asset.title)}" loading="lazy" sandbox="${esc(sandbox)}"${fullscreen}></iframe></div>
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

function footer(site, { clip, narrow, center } = {}) {
  return `<footer class="mt-16 flex items-center justify-between gap-4 border-t border-line py-10${narrow ? " max-w-[44rem]" : ""}${center ? " mx-auto w-full" : ""}">
<a class="${META} no-underline hover:text-oxblood" href="mailto:${esc(site.email)}" title="${esc(site.email)}">Message me</a>
<span class="flex items-center gap-4">
<span class="${META}">Set in Fraunces and Newsreader.</span>
${clip ? `<a class="p-1.5 leading-none text-ink-faint transition-[transform,color] duration-200 hover:-rotate-8 hover:text-oxblood motion-reduce:hover:rotate-0" href="clippy/" aria-label="A paperclip"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.5l-8.7 8.7a5.9 5.9 0 0 1-8.4-8.4l9.2-9.2a3.9 3.9 0 0 1 5.6 5.6l-8.8 8.8a2 2 0 0 1-2.8-2.8l7.9-7.9"/></svg></a>` : ""}
</span>
</footer>`;
}

function home({ site, pieces, copies, inlineStories }) {
  const ransomFontQuery = RANSOM_FONTS.map((font) => `family=${font.replace(/ /g, "+")}`).join("&");
  const ransomFontText = encodeURIComponent(site.name.replace(/\s+/g, ""));
  const entries = pieces
    .map(
      (p) => `<a class="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-line py-[clamp(1.6rem,4vh,2.4rem)] no-underline max-sm:grid-cols-1 max-sm:gap-2.5" id="${p.slug}" href="${p.slug}/">
<span class="${DISPLAY} ${HOVER_TITLE} text-[clamp(1.6rem,3.7vw,2.7rem)] leading-[1.08] transition-colors duration-150">${esc(copies[p.slug].headline)}</span>
<span class="${META} justify-self-end text-right max-sm:justify-self-start max-sm:text-left">${esc(p.kicker)}</span>
</a>`
    )
    .join("\n");
  const inlineStoryMarkup = inlineStories.length
    ? `<section class="mb-16 pt-[clamp(4rem,10vh,7rem)]" aria-label="More things I made">
${inlineStories.map(({ piece, copy, body: storyBody, resolved }, storyIndex) => {
  const media = figure(piece.lead, resolved.lead, "", piece.slug, { flush: true });
  const storyClass = storyIndex === 0
    ? ""
    : "mt-8 border-t border-line pt-[clamp(2rem,5vh,3rem)]";
  return `<article class="${storyClass}" id="${piece.slug}">
<div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)] md:gap-12">
<header>
<p class="${META}"><span>${esc(piece.title)}</span><span class="max-sm:hidden" aria-hidden="true"> · </span><span class="max-sm:block">${esc(piece.kicker)}</span></p>
<h2 class="${DISPLAY} mt-4 max-w-[18em] text-[28px] leading-[1.08] sm:text-[40px]">${esc(copy.headline)}</h2>
${media ? `<div class="mt-[clamp(2rem,5vh,3rem)]">${media}</div>` : ""}
</header>
<div class="space-y-[1.2em] text-[1.2rem] leading-[1.65] text-pretty">
${storyBody.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("\n")}
</div>
</div>
</article>`;
}).join("\n")}
</section>`
    : "";
  const externalPreview = site.homeExternalPreview
    ? `<figure class="mb-16 border-t border-line pt-[clamp(2.5rem,7vh,4.5rem)]">
<div class="mx-auto max-w-[31.5625rem]">
<a class="block overflow-hidden rounded-[32px] bg-ink no-underline" href="${esc(site.homeExternalPreview.url)}" target="_blank" rel="noopener" aria-label="Open ${esc(site.homeExternalPreview.title)} live tool">
<img class="block aspect-video h-auto w-full object-cover" src="${esc(site.homeExternalPreview.image)}" alt="${esc(site.homeExternalPreview.title)} canvas combining accountability, legal review, and human judgment into a review framework." loading="lazy" decoding="async">
</a>
<figcaption class="mt-3.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-sans text-[0.78rem] tracking-[0.02em] text-ink-faint">
<span><span class="text-ink">${esc(site.homeExternalPreview.title)}</span> · ${esc(site.homeExternalPreview.description)}</span>
<a class="shrink-0 text-ink no-underline hover:text-oxblood" href="${esc(site.homeExternalPreview.url)}" target="_blank" rel="noopener">Open ${esc(site.homeExternalPreview.label.toLowerCase())} <span aria-hidden="true">↗</span></a>
</figcaption>
</div>
</figure>`
    : "";

  const body = `<style>
@import url("https://fonts.googleapis.com/css2?${ransomFontQuery}&text=${ransomFontText}&display=swap");
.home-name__word{position:relative;display:inline-block;white-space:nowrap;isolation:isolate}
.home-name__word+.home-name__word{margin-left:.22em}
.home-name__letter{position:relative;z-index:0;display:inline-block}
.home-name__base{transition:opacity 80ms linear}
.home-name__letter::after{content:attr(data-letter);position:absolute;left:50%;top:50%;opacity:0;font-family:var(--ransom-font);font-size:.92em;font-weight:400;line-height:1;white-space:nowrap;transform:translate(-50%,-48%);transition:opacity 80ms linear;color:var(--color-oxblood);pointer-events:none}
@media (hover:hover){
  .home-name__letter:hover{z-index:2}
  .home-name__letter:hover .home-name__base{opacity:0}
  .home-name__letter:hover::after{opacity:1}
}
@media (prefers-reduced-motion:reduce){.home-name__base,.home-name__letter::after{transition:none}}
</style>
<div class="${PAGE}">
<header class="pt-[clamp(4rem,16vh,9rem)] pb-[clamp(2.5rem,7vh,4.5rem)]">
<h1 class="${DISPLAY} max-w-[12em] text-[clamp(2.7rem,7.4vw,5.8rem)] leading-[1.0]" aria-label="${esc(site.name)}">${ransomName(site.name)}</h1>
<p class="meta mt-6 text-ink-soft">${esc(site.tagline)}</p>
</header>
<main id="main" class="flex-1">
<nav class="border-b border-line" aria-label="Main stories">
${entries}
</nav>
${inlineStoryMarkup}
${externalPreview}
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

function piecePage({ site, piece, copy, resolved, prev, next, cyclePrev, cycleNext }) {
  const root = "../";
  const cycle = cyclePrev && cycleNext
    ? ` data-cycle-prev="../${esc(cyclePrev.slug)}/" data-cycle-next="../${esc(cycleNext.slug)}/"`
    : "";

  const supportingFigures = piece.supporting.map((asset, i) =>
    figure(asset, resolved.supporting[i], root, piece.slug)
  );
  const placedSupporting = new Set();
  const bodyBlocks = [];
  let prose = [];
  const flushProse = () => {
    if (!prose.length) return;
    bodyBlocks.push(`<div class="space-y-[1.35em] [font-variant-numeric:oldstyle-nums] [hanging-punctuation:first_last]">
${prose.join("\n")}
</div>`);
    prose = [];
  };

  copy.body.forEach((para, i) => {
    prose.push(bodyParagraph(para, i, copy.body.length));
    if (piece.pullQuote && piece.pullQuote.afterParagraph === i + 1) {
      prose.push(
        `<blockquote class="my-[2.6em] max-w-[35em] border-y border-line py-[1.8em]"><p class="font-display text-center text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.25] text-balance italic">${esc(piece.pullQuote.text)}</p></blockquote>`
      );
    }
    piece.supporting.forEach((asset, assetIndex) => {
      if (asset.afterParagraph === i + 1) {
        flushProse();
        bodyBlocks.push(supportingFigures[assetIndex]);
        placedSupporting.add(assetIndex);
      }
    });
  });
  flushProse();
  supportingFigures.forEach((supportingFigure, i) => {
    if (!placedSupporting.has(i)) bodyBlocks.push(supportingFigure);
  });
  const leadFigure = figure(piece.lead, resolved.lead, root, piece.slug, { lead: true });
  const articleClass = leadFigure ? "" : " [&>header+*]:mt-16";

  const flipLink = (href, label, title, right) =>
    `<a class="group flex flex-col gap-2 no-underline${right ? " ml-auto text-right" : ""}" href="${href}"><span class="${META}">${label}</span><span class="${HOVER_TITLE} font-display text-[1.5rem]">${esc(title)}</span></a>`;

  const nav = `<nav class="flex max-w-[44rem] justify-between gap-8 border-t border-line py-10" style="margin-top:clamp(4rem,8vh,4.5rem)" aria-label="More pieces">
${prev ? flipLink(`../${prev.slug}/`, "Previous", prev.title) : flipLink("../", "Start", "Index")}
${next ? flipLink(`../${next.slug}/`, "Next", next.title, true) : flipLink("../", "End", "Back to the index", true)}
</nav>`;

  const body = `<div class="${PAGE}">
${header(site, root)}
<main id="main" class="flex-1"${cycle}>
<article class="${articleClass.trim()}">
<header class="max-w-[44rem] pt-[clamp(3rem,9vh,5.5rem)]">
<p class="${META}">${esc(piece.kicker)}</p>
<h1 class="${DETAIL_HEADLINE}">${esc(copy.headline)}</h1>
<h2 class="${DETAIL_STANDFIRST}">${esc(copy.standfirst)}</h2>
</header>
${leadFigure}
${bodyBlocks.join("\n")}
</article>
${nav}
</main>
${footer(site, { narrow: true })}
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

// The Folio system, rendered page-native as a full-width exhibit (not an inset).
// Its chrome is deliberately mono/source, so it never reads as a finished output.
// The one code panel quotes real token values from the direction source, scoped:
// the composition logic that applies them is not shown.
const FOLIO_SYS = `<div class="py-[clamp(0.75rem,2vh,1.25rem)]">
<style>
.folio-sys{--f-paper:#f4f2ee;--f-panel:#1b1917;--f-panel-ink:#e9e5dd;--f-panel-faint:#8f8880;--f-ink:#1f1c1a;--f-muted:#6f6862;--f-faint:#9a938b;--f-line:#e2ddd4;--f-line-2:#cfc8bd;--f-accent:#7a2e24;--f-mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,Consolas,monospace;
  container:folioSys / inline-size;font-family:var(--f-mono);color:var(--f-ink);font-size:14px;line-height:1.6}
.folio-sys *{box-sizing:border-box}
.folio-sys .fs-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:1px solid var(--f-line-2);padding-bottom:14px}
.folio-sys .fs-path{color:var(--f-faint);font-size:12px}
.folio-sys .fs-kick{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--f-accent)}
.folio-sys .fs-note{color:var(--f-muted);font-size:12.5px;max-width:64ch;line-height:1.65;margin-top:14px}
.folio-sys .fs-sec{margin-top:34px}
.folio-sys .fs-lab{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--f-faint);margin-bottom:14px}
.folio-sys .fs-div{display:flex;flex-direction:column;border:1px solid var(--f-line-2);border-radius:12px;overflow:hidden}
.folio-sys .fs-lane{padding:16px 18px}
.folio-sys .fs-lane.b{background:#eeece6}
.folio-sys .fs-who{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--f-faint);margin-bottom:8px}
.folio-sys .fs-does{font-size:14px;font-weight:600;margin-bottom:8px}
.folio-sys .fs-does b{color:var(--f-accent);font-weight:600}
.folio-sys .fs-lane ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.folio-sys .fs-lane li{font-size:12px;color:var(--f-muted);padding-left:13px;position:relative}
.folio-sys .fs-lane li::before{content:"+";position:absolute;left:0;color:var(--f-faint)}
.folio-sys .fs-seam{display:flex;align-items:center;justify-content:center;padding:8px 0;color:var(--f-accent);font-size:18px;border-top:1px solid var(--f-line-2);border-bottom:1px solid var(--f-line-2)}
.folio-sys .fs-file{border:1px solid var(--f-line-2);border-radius:12px;overflow:hidden}
.folio-sys .fs-bar{display:flex;align-items:center;gap:8px;background:var(--f-panel);color:var(--f-panel-faint);padding:9px 14px;font-size:12px}
.folio-sys .fs-dot{width:9px;height:9px;border-radius:50%;background:#45403a}
.folio-sys .fs-dot.a{background:#b0554b}.folio-sys .fs-dot.b{background:#b09a4b}.folio-sys .fs-dot.c{background:#5c7a4a}
.folio-sys .fs-fname{margin-left:6px;color:var(--f-panel-ink)}
.folio-sys .fs-badge{margin-left:auto;font-size:10px;letter-spacing:.14em;text-transform:uppercase}
.folio-sys .fs-code{background:var(--f-panel);color:var(--f-panel-ink);counter-reset:ln;padding:14px 0;font-size:12.5px;line-height:1.9}
.folio-sys .fs-code .l{display:block;padding:0 16px 0 52px;position:relative;white-space:pre-wrap;word-break:break-word}
.folio-sys .fs-code .l::before{counter-increment:ln;content:counter(ln);position:absolute;left:0;width:36px;text-align:right;color:#514b44;font-size:11px}
.folio-sys .fs-code .c{color:#7c766c;font-style:italic}
.folio-sys .fs-code .p{color:#9ec1b6}
.folio-sys .fs-code .v{color:#cbb48f}
.folio-sys .fs-code .blank{min-height:.5em}
.folio-sys .fs-cap{margin-top:12px;font-size:12px;color:var(--f-muted);line-height:1.65}
.folio-sys .fs-cap b{color:var(--f-accent);font-weight:600}
.folio-sys .fs-tree{background:var(--f-panel);color:var(--f-panel-ink);padding:14px 18px;font-size:12.5px;line-height:1.85;white-space:pre-wrap}
.folio-sys .fs-tree .d{color:#e9c3a0}.folio-sys .fs-tree .m{color:#9ec1b6}.folio-sys .fs-tree .x{color:var(--f-panel-faint)}
@container folioSys (max-width:640px){
  .folio-sys .fs-bar .fs-badge{display:none}
  .folio-sys .fs-fname{font-size:11px;white-space:nowrap}
  .folio-sys .fs-tree{padding:12px 14px;font-size:11px;line-height:1.8;white-space:pre;overflow:hidden}
  .folio-sys .fs-tree .x{display:none}
}
</style>
<section class="folio-sys" aria-label="Folio, the house style">
  <div class="fs-head"><span class="fs-path">direction-folio-split/ &rsaquo; SKILL.md</span><span class="fs-kick">Real source, scoped</span></div>
  <p class="fs-note">Folio moves the decisions a probabilistic model cannot hold consistently into an enforceable layer: one lean core, component contracts loaded on demand, and QA that catches drift.</p>

  <div class="fs-sec">
    <div class="fs-lab">What the architecture protects</div>
    <div class="fs-div">
      <div class="fs-lane"><div class="fs-who">Input</div><div class="fs-does">The model <b>authors</b></div><ul><li>content and argument</li><li>rough intent per section</li><li>which component to reach for</li></ul></div>
      <div class="fs-seam" aria-hidden="true">&darr;</div>
      <div class="fs-lane b"><div class="fs-who">Source of truth</div><div class="fs-does">The render layer <b>enforces</b></div><ul><li>grid, measure, and rhythm</li><li>type, color, and spacing</li><li>every rule the model cannot hold</li></ul></div>
    </div>
  </div>

  <div class="fs-sec">
    <div class="fs-lab">The editorial judgment, scoped</div>
    <div class="fs-file">
      <div class="fs-bar"><span class="fs-dot a"></span><span class="fs-dot b"></span><span class="fs-dot c"></span><span class="fs-fname">direction-folio-split/SKILL.md</span><span class="fs-badge">composition rhythm</span></div>
      <div class="fs-code">
<span class="l"><span class="c">## Composition Rhythm</span></span>
<span class="l blank"> </span>
<span class="l">Long-form documents need <span class="v">visual punctuation</span>.</span>
<span class="l">A wall of body paragraphs reads as a brief, not as Folio.</span>
<span class="l blank"> </span>
<span class="l">Some moments are positional, not free-floating:</span>
<span class="l"><span class="p">-</span> the Standfirst opens the report</span>
<span class="l"><span class="p">-</span> one Big-Number Band lands at the apex</span>
<span class="l"><span class="p">-</span> an Editorial Plate appears when images belong together</span>
<span class="l blank"> </span>
<span class="l">Do not pad with visuals if the content does not earn them.</span>
<span class="l">A pull quote belongs only when the sentence already exists</span>
<span class="l">in the prose and is strong enough to stop the reader.</span>
      </div>
    </div>
    <p class="fs-cap">A real, shortened slice of the core. Component implementations and orchestration stay private.</p>
  </div>
</section>
</div>`;

function editorialPage({ site, piece, copy, resolved, prev, next, cyclePrev, cycleNext }) {
  const root = "../";
  const cycle = cyclePrev && cycleNext
    ? ` data-cycle-prev="../${esc(cyclePrev.slug)}/" data-cycle-next="../${esc(cycleNext.slug)}/"`
    : "";

  // The finished output leads the page, in the same position as lead media on
  // every other piece. Other supporting media stays in the later story flow.
  const leadOutput = piece.supporting
    .map((asset, i) =>
      asset.kind === "documents"
        ? figure(asset, resolved.supporting[i], root, piece.slug, { lead: true })
        : ""
    )
    .filter(Boolean)
    .join("\n");
  const supportingMedia = piece.supporting
    .map((asset, i) =>
      asset.kind !== "documents"
        ? figure(asset, resolved.supporting[i], root, piece.slug, { flush: true })
        : ""
    )
    .filter(Boolean)
    .join("\n");

  const READING =
    "reading mx-auto max-w-[44rem] space-y-[1.35em] [font-variant-numeric:oldstyle-nums] [hanging-punctuation:first_last]";
  const paras = copy.body.map((p, i) => bodyParagraph(p, i, copy.body.length));
  const pull = piece.pullQuote
    ? `<blockquote class="mx-auto max-w-[35em] border-y border-line py-[1.8em]"><p class="font-display text-center text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.25] text-balance italic">${esc(piece.pullQuote.text)}</p></blockquote>`
    : "";

  // Story, then the system exhibit, then a real output, then the close.
  const runA = `<div class="${READING}">\n${[paras[0], paras[1], pull, paras[2]].filter(Boolean).join("\n")}\n</div>`;
  const runB = paras[3] ? `<div class="${READING}">${paras[3]}</div>` : "";
  const runC = paras[4] ? `<div class="${READING}">${paras.slice(4).join("\n")}</div>` : "";

  const flow = [runA, FOLIO_SYS, runB, supportingMedia, runC].filter(Boolean).join("\n");

  const flipLink = (href, label, title, right) =>
    `<a class="group flex flex-col gap-2 no-underline${right ? " ml-auto text-right" : ""}" href="${href}"><span class="${META}">${label}</span><span class="${HOVER_TITLE} font-display text-[1.5rem]">${esc(title)}</span></a>`;

  const nav = `<nav class="mx-auto mt-[clamp(3rem,8vh,5rem)] flex max-w-[44rem] justify-between gap-8 border-t border-line py-10" aria-label="More pieces">
${prev ? flipLink(`../${prev.slug}/`, "Previous", prev.title) : flipLink("../", "Start", "Index")}
${next ? flipLink(`../${next.slug}/`, "Next", next.title, true) : flipLink("../", "End", "Back to the index", true)}
</nav>`;

  const body = `<div class="${PAGE}">
${header(site, root)}
<main id="main" class="flex-1"${cycle}>
<article>
<header class="mx-auto max-w-[44rem] pt-[clamp(3rem,9vh,5.5rem)]">
<p class="${META}">${esc(piece.kicker)}</p>
<h1 class="${DETAIL_HEADLINE}">${esc(copy.headline)}</h1>
<h2 class="${DETAIL_STANDFIRST}">${esc(copy.standfirst)}</h2>
</header>
${leadOutput}
<div class="mt-[clamp(2.25rem,7vh,3.75rem)] space-y-[clamp(2.25rem,6.5vh,3.6rem)]">
${flow}
</div>
</article>
${nav}
</main>
${footer(site, { narrow: true, center: true })}
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
<h1 class="${DETAIL_HEADLINE.replace(" mt-6", "")}">${esc(clippy.title)}</h1>
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
    description: clippy.description,
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
<h1 class="${DISPLAY} text-[clamp(2.5rem,6vw,4.3rem)] leading-[1.04]">This page stayed out.</h1>
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

module.exports = { home, piecePage, editorialPage, clippyPage, notFound };
