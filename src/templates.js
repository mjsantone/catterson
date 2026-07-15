// HTML rendering. Every page goes through shell(); every piece goes through piecePage(),
// which is the one component the spec asks for: kicker, headline, unlabeled standfirst,
// lead asset, flowing body, supporting assets.
"use strict";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
<link rel="preload" href="${root}fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}css/site.css">
<script src="${root}js/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${body}
</body>
</html>
`;
}

function figure(asset, resolved, root, slug) {
  const dir = `assets/${slug}/`;
  const cap = asset.caption ? `<figcaption>${esc(asset.caption)}</figcaption>` : "";

  if (asset.kind === "video") {
    if (!resolved.exists) {
      return placeholder("Video placeholder", asset.caption, dir + asset.file);
    }
    const poster = resolved.poster ? ` poster="${root}${dir}${asset.poster}"` : "";
    const attrs = asset.sound
      ? `controls preload="metadata"${poster}`
      : `data-autoplay muted loop playsinline preload="${resolved.poster ? "none" : "metadata"}"${poster}`;
    return `<figure class="media">
<video ${attrs} src="${root}${dir}${asset.file}" aria-label="${esc(asset.caption)}"></video>
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
          `<img src="${root}${dir}${f}" alt="${esc(asset.caption)} Still ${i + 1} of ${resolved.files.length}." loading="lazy" decoding="async">`
      )
      .join("\n");
    return `<figure class="media stills"><div class="stills-grid" data-count="${resolved.files.length}">
${imgs}
</div>${cap}</figure>`;
  }

  if (asset.kind === "iframe") {
    if (!resolved.exists) {
      return placeholder("Playable artifact placeholder", asset.caption || asset.title, dir + asset.file);
    }
    return `<figure class="media">
<div class="frame"><iframe src="${root}${dir}${asset.file}" title="${esc(asset.title)}" loading="lazy" sandbox="allow-scripts allow-pointer-lock"></iframe></div>
${cap}
</figure>`;
  }

  throw new Error(`Unknown asset kind: ${asset.kind}`);
}

function placeholder(kindLabel, desc, expectedPath) {
  return `<figure class="media">
<div class="slot" role="img" aria-label="Placeholder. ${esc(desc)}">
<span class="slot-kind">${esc(kindLabel)}</span>
<span class="slot-desc">${esc(desc)}</span>
<span class="slot-path">${esc(expectedPath)}</span>
</div>
</figure>`;
}

function header(site, root, right) {
  return `<header class="bar">
<a class="bar-name meta" href="${root || "./"}">${esc(site.name)}</a>
${right ? `<span class="bar-right meta">${right}</span>` : ""}
</header>`;
}

function footer(site, { clip } = {}) {
  return `<footer class="foot">
<a class="meta" href="mailto:${esc(site.email)}">${esc(site.email)}</a>
${clip ? `<a class="clip" href="clippy/" aria-label="A paperclip"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.5l-8.7 8.7a5.9 5.9 0 0 1-8.4-8.4l9.2-9.2a3.9 3.9 0 0 1 5.6 5.6l-8.8 8.8a2 2 0 0 1-2.8-2.8l7.9-7.9"/></svg></a>` : ""}
</footer>`;
}

function home({ site, pieces, copies }) {
  const entries = pieces
    .map(
      (p, i) => `<a class="entry" id="${p.slug}" href="${p.slug}/">
<span class="entry-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
<span class="entry-headline">${esc(copies[p.slug].headline)}</span>
<span class="entry-kicker meta">${esc(p.kicker)}</span>
</a>`
    )
    .join("\n");

  const body = `<div class="page home">
<header class="masthead">
<h1>${esc(site.name)}</h1>
<p class="tagline meta">${esc(site.tagline)}</p>
</header>
<main id="main">
<nav class="index" aria-label="Pieces">
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

  const paragraphs = [];
  copy.body.forEach((para, i) => {
    paragraphs.push(`<p>${esc(para)}</p>`);
    if (piece.pullQuote && piece.pullQuote.afterParagraph === i + 1) {
      paragraphs.push(`<blockquote class="pull"><p>${esc(piece.pullQuote.text)}</p></blockquote>`);
    }
  });

  const supporting = piece.supporting
    .map((a, i) => figure(a, resolved.supporting[i], root, piece.slug))
    .join("\n");

  const nav = `<nav class="flip" aria-label="More pieces">
${prev ? `<a class="flip-prev" href="../${prev.slug}/"><span class="meta">Previous</span><span class="flip-title">${esc(prev.title)}</span></a>` : `<a class="flip-prev" href="../"><span class="meta">Start</span><span class="flip-title">Index</span></a>`}
${next ? `<a class="flip-next" href="../${next.slug}/"><span class="meta">Next</span><span class="flip-title">${esc(next.title)}</span></a>` : `<a class="flip-next" href="../"><span class="meta">End</span><span class="flip-title">Back to the index</span></a>`}
</nav>`;

  const body = `<div class="page">
${header(site, root, `${num}&hairsp;/&hairsp;${String(total).padStart(2, "0")}`)}
<main id="main">
<article class="piece">
<header class="piece-head">
<p class="kicker meta"><span class="kicker-num">${num}</span>${esc(piece.kicker)}</p>
<h1>${esc(copy.headline)}</h1>
<h2 class="standfirst">${esc(copy.standfirst)}</h2>
</header>
${figure(piece.lead, resolved.lead, root, piece.slug)}
<div class="prose">
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
  const body = `<div class="page">
${header(site, root)}
<main id="main">
<article class="piece egg">
<header class="piece-head">
<h1>${esc(clippy.title)}</h1>
<h2 class="standfirst">${esc(clippy.standfirst)}</h2>
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

module.exports = { home, piecePage, clippyPage };
