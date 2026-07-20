#!/usr/bin/env node
// Static build. `node build.js` writes the site to dist/, compiling the CSS
// through the Tailwind CLI (the only dependency).
//
// The words come straight from the copy-*.md files: this script parses each file's
// headline (# ), standfirst (## ), and body paragraphs, so the rendered copy is
// verbatim by construction. Assets are looked up on disk; anything missing renders
// as a labeled placeholder. The build fails on an em dash or a redaction miss.
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { site, pieces, clippy } = require("./src/content.js");
const t = require("./src/templates.js");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const ASSETS = path.join(ROOT, "assets");

// ---------- copy parsing ----------

function parseCopy(filename) {
  const lines = fs.readFileSync(path.join(ROOT, filename), "utf8").split("\n");

  // The first "# " line is file metadata; the second is the headline.
  const h1s = lines.filter((l) => l.startsWith("# "));
  if (h1s.length < 2) throw new Error(`${filename}: expected a metadata line and a headline`);
  const headline = h1s[1].slice(2).trim();

  const headlineIdx = lines.indexOf(h1s[1]);
  let standfirst = null;
  const body = [];

  for (let i = headlineIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      if (standfirst) break; // "## BUILD NOTES" or similar: copy is over
      standfirst = line.slice(3).trim();
      continue;
    }
    if (line === "---" || line.startsWith("BUILD")) break;
    if (standfirst) body.push(line);
  }

  if (!standfirst || !body.length) {
    throw new Error(`${filename}: could not find standfirst or body`);
  }
  return { headline, standfirst, body };
}

// ---------- asset resolution ----------

const IMG_RE = /\.(png|jpe?g|webp|avif|gif)$/i;

function resolveAsset(slug, asset) {
  const dir = path.join(ASSETS, slug);
  if (asset.kind === "stills") {
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.startsWith(asset.prefix) && IMG_RE.test(f)).sort()
      : [];
    return { files };
  }
  const exists = fs.existsSync(path.join(dir, asset.file));
  const poster = asset.poster ? fs.existsSync(path.join(dir, asset.poster)) : false;
  return { exists, poster };
}

function resolvePiece(piece) {
  return {
    lead: resolveAsset(piece.slug, piece.lead),
    supporting: (piece.supporting || []).map((a) => resolveAsset(piece.slug, a)),
  };
}

// ---------- fs helpers ----------

function copyDir(from, to, filter) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst, filter);
    else if (!filter || filter(entry.name)) fs.copyFileSync(src, dst);
  }
}

function writePage(rel, html) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// ---------- ship checks ----------

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function shipChecks() {
  const problems = [];

  // 1. No em dashes anywhere on the site.
  for (const file of walk(DIST).filter((f) => /\.(html|css|js|svg)$/.test(f))) {
    const text = fs.readFileSync(file, "utf8");
    if (text.includes("—")) {
      problems.push(`em dash in ${path.relative(ROOT, file)}`);
    }
  }

  // 2. Redaction: nothing internal in generated microcopy or asset filenames.
  //    (The copy files are pre-cleared, so parsed copy is exempt; everything
  //    this repo generates or names is not.)
  const INTERNAL = /microsoft|msft|azure|sharepoint|workiq|msal|m365|copilot|simthetics/i;
  const microcopy = JSON.stringify({ site, pieces, clippy }, (key, value) =>
    key === "copy" ? undefined : value
  );
  if (INTERNAL.test(microcopy)) problems.push("internal term in src/content.js microcopy");
  if (/—/.test(microcopy)) problems.push("em dash in src/content.js microcopy");
  if (/\bbuilt\b/i.test(microcopy)) problems.push('"built" in microcopy (house rule: "made")');
  for (const file of walk(ASSETS)) {
    if (INTERNAL.test(path.basename(file))) {
      problems.push(`internal term in asset filename: ${path.relative(ROOT, file)}`);
    }
  }

  if (problems.length) {
    throw new Error("Ship checks failed:\n  " + problems.join("\n  "));
  }
}

// ---------- build ----------

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

copyDir(path.join(ROOT, "src/js"), path.join(DIST, "js"));
copyDir(path.join(ROOT, "src/fonts"), path.join(DIST, "fonts"));
copyDir(path.join(ROOT, "src/static"), DIST);
copyDir(ASSETS, path.join(DIST, "assets"), (name) => !name.endsWith(".md"));

const copies = {};
for (const piece of pieces) copies[piece.slug] = parseCopy(piece.copy);

writePage("index.html", t.home({ site, pieces, copies }));

let placeholders = 0;
let found = 0;
pieces.forEach((piece, i) => {
  const resolved = resolvePiece(piece);
  const slots = [resolved.lead, ...resolved.supporting];
  slots.forEach((r) => {
    if (r.files ? r.files.length : r.exists) found++;
    else placeholders++;
  });
  writePage(
    `${piece.slug}/index.html`,
    t.piecePage({
      site,
      piece,
      copy: copies[piece.slug],
      resolved,
      index: i,
      total: pieces.length,
      prev: pieces[i - 1] || null,
      next: pieces[i + 1] || null,
    })
  );
});

const clippyResolved = { lead: resolveAsset(clippy.slug, clippy.lead) };
if (clippyResolved.lead.exists) found++;
else placeholders++;
writePage("clippy/index.html", t.clippyPage({ site, clippy, resolved: clippyResolved }));
writePage("404.html", t.notFound({ site }));

// Compile the stylesheet. Font URLs must stay relative to dist/css/, so fail
// loudly if the compiler ever rewrites them.
const twBin = path.join(ROOT, "node_modules", ".bin", "tailwindcss");
fs.mkdirSync(path.join(DIST, "css"), { recursive: true });
execFileSync(twBin, ["-i", "src/css/site.css", "-o", "dist/css/site.css", "--minify"], {
  cwd: ROOT,
  stdio: ["ignore", "ignore", "inherit"],
});
const css = fs.readFileSync(path.join(DIST, "css/site.css"), "utf8");
if (!css.includes("../fonts/newsreader-latin.woff2")) {
  throw new Error("Compiled CSS lost the relative font path; check the Tailwind url() handling");
}

shipChecks();

console.log(`Built ${pieces.length + 2} pages to dist/`);
console.log(`Assets: ${found} present, ${placeholders} slot${placeholders === 1 ? "" : "s"} empty`);
