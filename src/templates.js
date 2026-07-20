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
const DISPLAY = "font-display [font-weight:440] tracking-[-0.01em] text-balance";
const HOVER_TITLE = "group-hover:italic group-hover:text-oxblood group-focus-visible:italic group-focus-visible:text-oxblood";
const CAPTION =
  "mt-3.5 max-w-[35em] font-sans text-[0.78rem] tracking-[0.02em] text-ink-faint";
const DROP_CAP =
  "first-letter:float-left first-letter:font-display first-letter:text-[3.4em] first-letter:leading-[0.8] first-letter:pr-[0.12em] first-letter:mt-[0.05em]";

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
<link rel="preload" href="${root}fonts/fraunces-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}css/site.css">
<script src="${root}js/site.js" defer></script>
<script src="${root}js/clippy-cameo.js" defer></script>
</head>
<body data-root="${root}">
<a class="absolute top-0 -left-[100vw] z-10 bg-ink px-4 py-2 font-sans text-sm text-paper focus-visible:left-0" href="#main">Skip to content</a>
${body}
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

  if (asset.kind === "documents") {
    if (!resolved.files.length) {
      return placeholder("Document placeholder", "Editorial outputs", dir + "*.html");
    }
    return resolved.files
      .map(({ file, title }) => {
        const src = `${root}${dir}${file.split("/").map(encodeURIComponent).join("/")}`;
        return `<figure ${media}>
      <div class="aspect-video overflow-hidden rounded-[32px] border border-line bg-ink"><iframe class="block h-full w-full border-0 bg-paper" src="${esc(src)}" title="${esc(title)}" loading="lazy" sandbox="allow-same-origin" data-document-viewer></iframe></div>
<figcaption class="mt-3.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-sans text-[0.78rem] tracking-[0.02em] text-ink-faint">
<span>${esc(title)}</span>
<a class="shrink-0 text-ink no-underline hover:text-oxblood" href="${esc(src)}" target="_blank" rel="noopener" aria-label="Open ${esc(title)} full view" title="Open full view">Open full view <span aria-hidden="true">↗</span></a>
</figcaption>
</figure>`;
      })
      .join("\n");
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

function footer(site, { clip } = {}) {
  return `<footer class="mt-16 flex items-center justify-between gap-4 border-t border-line py-10">
<a class="${META} no-underline hover:text-oxblood" href="mailto:${esc(site.email)}" title="${esc(site.email)}">Message me</a>
<span class="flex items-center gap-4">
<span class="${META}">Set in Fraunces and Newsreader.</span>
${clip ? `<a class="p-1.5 leading-none text-ink-faint transition-[transform,color] duration-200 hover:-rotate-8 hover:text-oxblood motion-reduce:hover:rotate-0" href="clippy/" aria-label="A paperclip"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.5l-8.7 8.7a5.9 5.9 0 0 1-8.4-8.4l9.2-9.2a3.9 3.9 0 0 1 5.6 5.6l-8.8 8.8a2 2 0 0 1-2.8-2.8l7.9-7.9"/></svg></a>` : ""}
</span>
</footer>`;
}

function home({ site, pieces, copies }) {
  const entries = pieces
    .map(
      (p) => `<a class="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-line py-[clamp(1.6rem,4vh,2.4rem)] no-underline max-sm:grid-cols-1 max-sm:gap-2.5" id="${p.slug}" href="${p.slug}/">
<span class="${DISPLAY} ${HOVER_TITLE} text-[clamp(1.6rem,3.7vw,2.7rem)] leading-[1.08] transition-colors duration-150">${esc(copies[p.slug].headline)}</span>
<span class="${META} justify-self-end text-right max-sm:justify-self-start max-sm:text-left">${esc(p.kicker)}</span>
</a>`
    )
    .join("\n");

  const body = `<div class="${PAGE}">
<header class="pt-[clamp(4rem,16vh,9rem)] pb-[clamp(2.5rem,7vh,4.5rem)]">
<h1 class="${DISPLAY} max-w-[12em] text-[clamp(2.7rem,7.4vw,5.8rem)] leading-[1.0]">${esc(site.name)}</h1>
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
    bodyBlocks.push(`<div class="max-w-[35em] space-y-[1.35em] [font-variant-numeric:oldstyle-nums] [hanging-punctuation:first_last]">
${prose.join("\n")}
</div>`);
    prose = [];
  };

  copy.body.forEach((para, i) => {
    prose.push(`<p class="text-pretty${i === 0 ? " " + DROP_CAP : ""}">${esc(para)}</p>`);
    if (piece.pullQuote && piece.pullQuote.afterParagraph === i + 1) {
      prose.push(
        `<blockquote class="my-[2.6em] border-y border-line py-[1.8em]"><p class="font-display text-center text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.25] text-balance italic">${esc(piece.pullQuote.text)}</p></blockquote>`
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

  const flipLink = (href, label, title, right) =>
    `<a class="group flex flex-col gap-2 no-underline${right ? " ml-auto text-right" : ""}" href="${href}"><span class="${META}">${label}</span><span class="${HOVER_TITLE} font-display text-[1.5rem]">${esc(title)}</span></a>`;

  const nav = `<nav class="flex justify-between gap-8 border-t border-line py-10" aria-label="More pieces">
${prev ? flipLink(`../${prev.slug}/`, "Previous", prev.title) : flipLink("../", "Start", "Index")}
${next ? flipLink(`../${next.slug}/`, "Next", next.title, true) : flipLink("../", "End", "Back to the index", true)}
</nav>`;

  const body = `<div class="${PAGE}">
${header(site, root)}
<main id="main" class="flex-1"${cycle}>
<article>
<header class="max-w-[44rem] pt-[clamp(3rem,9vh,5.5rem)]">
<p class="${META}">${esc(piece.kicker)}</p>
<h1 class="${DISPLAY} mt-6 text-[clamp(2.5rem,6vw,4.3rem)] leading-[1.04]">${esc(copy.headline)}</h1>
<h2 class="mt-6 text-[clamp(1.25rem,2.4vw,1.5rem)] leading-[1.45] font-normal text-pretty text-ink-soft italic">${esc(copy.standfirst)}</h2>
</header>
${figure(piece.lead, resolved.lead, root, piece.slug, { lead: true })}
${bodyBlocks.join("\n")}
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

// The Folio system, rendered page-native as a full-width exhibit (not an inset).
// Its chrome is deliberately mono/source, so it never reads as a finished output.
// The one code panel quotes real token values from the direction source, scoped:
// the composition logic that applies them is not shown.
const FOLIO_SYS = `
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
      <div class="fs-seam">&rarr;</div>
      <div class="fs-lane b"><div class="fs-who">Source of truth</div><div class="fs-does">The render layer <b>enforces</b></div><ul><li>grid, measure, and rhythm</li><li>type, color, and spacing</li><li>every rule the model cannot hold</li></ul></div>
    </div>
  </div>

  <div class="fs-sec">
    <div class="fs-lab">The enforceable layer, scoped</div>
    <div class="fs-file">
      <div class="fs-bar"><span class="fs-dot a"></span><span class="fs-dot b"></span><span class="fs-dot c"></span><span class="fs-fname">direction-folio-split/SKILL.md</span><span class="fs-badge">token excerpt</span></div>
      <div class="fs-code">
<span class="l"><span class="c">/* real declarations; composition logic omitted */</span></span>
<span class="l"><span class="p">--folio-serif</span>:<span class="v"> 'Newsreader', 'Source Serif 4', Georgia, serif</span>;</span>
<span class="l"><span class="p">--folio-sans</span>:<span class="v"> 'Inter', 'Source Sans 3', system-ui, sans-serif</span>;</span>
<span class="l blank"> </span>
<span class="l"><span class="p">--folio-pumpkin-light</span>:<span class="v"> #FDE61E</span>;</span>
<span class="l"><span class="p">--folio-pumpkin-mid</span>:<span class="v"> #E46832</span>;</span>
<span class="l"><span class="p">--folio-pumpkin-dark</span>:<span class="v"> #762F0E</span>;</span>
<span class="l blank"> </span>
<span class="l"><span class="p">--w-main</span>:<span class="v"> min(704px, calc(100vw - (var(--page-margin) * 2)))</span>;</span>
<span class="l"><span class="p">--w-off-grid</span>:<span class="v"> min(1068px, calc(100vw - (var(--page-margin) * 2)))</span>;</span>
      </div>
    </div>
    <p class="fs-cap">A real slice of the core. Component implementations and orchestration stay private.</p>
  </div>
</section>`;

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
    "reading max-w-[35em] space-y-[1.35em] [font-variant-numeric:oldstyle-nums] [hanging-punctuation:first_last]";
  const paras = copy.body.map(
    (p, i) => `<p class="text-pretty${i === 0 ? " " + DROP_CAP : ""}">${esc(p)}</p>`
  );
  const pull = piece.pullQuote
    ? `<blockquote class="border-y border-line py-[1.8em]"><p class="font-display text-center text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.25] text-balance italic">${esc(piece.pullQuote.text)}</p></blockquote>`
    : "";

  // Story, then the system exhibit, then a real output, then the close.
  const runA = `<div class="${READING}">\n${[paras[0], paras[1], pull, paras[2]].filter(Boolean).join("\n")}\n</div>`;
  const runB = paras[3] ? `<div class="${READING}">${paras[3]}</div>` : "";
  const runC = paras[4] ? `<div class="${READING}">${paras.slice(4).join("\n")}</div>` : "";

  const flow = [runA, FOLIO_SYS, runB, supportingMedia, runC].filter(Boolean).join("\n");

  const flipLink = (href, label, title, right) =>
    `<a class="group flex flex-col gap-2 no-underline${right ? " ml-auto text-right" : ""}" href="${href}"><span class="${META}">${label}</span><span class="${HOVER_TITLE} font-display text-[1.5rem]">${esc(title)}</span></a>`;

  const nav = `<nav class="flex justify-between gap-8 border-t border-line py-10 mt-[clamp(3rem,8vh,5rem)]" aria-label="More pieces">
${prev ? flipLink(`../${prev.slug}/`, "Previous", prev.title) : flipLink("../", "Start", "Index")}
${next ? flipLink(`../${next.slug}/`, "Next", next.title, true) : flipLink("../", "End", "Back to the index", true)}
</nav>`;

  const body = `<div class="${PAGE}">
${header(site, root)}
<main id="main" class="flex-1"${cycle}>
<article>
<header class="max-w-[44rem] pt-[clamp(3rem,9vh,5.5rem)]">
<p class="${META}">${esc(piece.kicker)}</p>
<h1 class="${DISPLAY} mt-6 text-[clamp(2.5rem,6vw,4.3rem)] leading-[1.04]">${esc(copy.headline)}</h1>
<h2 class="mt-6 text-[clamp(1.25rem,2.4vw,1.5rem)] leading-[1.45] font-normal text-pretty text-ink-soft italic">${esc(copy.standfirst)}</h2>
</header>
${leadOutput}
<div class="mt-[clamp(2.25rem,7vh,3.75rem)] space-y-[clamp(2.25rem,6.5vh,3.6rem)]">
${flow}
</div>
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
<h1 class="${DISPLAY} text-[clamp(2.5rem,6vw,4.3rem)] leading-[1.04]">${esc(clippy.title)}</h1>
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
