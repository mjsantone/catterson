#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { site, pieces, clippy } = require("./src/content.js");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out);
    else out.push(file);
  }
  return out;
}

function count(text, pattern) {
  return Array.from(text.matchAll(pattern)).length;
}

function relativeTarget(page, reference) {
  const clean = decodeURIComponent(reference.split("#")[0].split("?")[0]);
  if (!clean) return null;
  let target = clean.startsWith("/")
    ? path.join(DIST, clean.replace(/^\/+/, ""))
    : path.resolve(path.dirname(page), clean);
  if (clean.endsWith("/") || (fs.existsSync(target) && fs.statSync(target).isDirectory())) {
    target = path.join(target, "index.html");
  }
  return target;
}

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function jpegSize(file) {
  const bytes = fs.readFileSync(file);
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  throw new Error(`Could not read JPEG dimensions: ${file}`);
}

const build = spawnSync(process.execPath, ["build.js"], {
  cwd: ROOT,
  encoding: "utf8",
});
if (build.status !== 0) {
  process.stderr.write(build.stdout);
  process.stderr.write(build.stderr);
  process.exit(build.status || 1);
}

const buildOutput = `${build.stdout}${build.stderr}`;
assert.match(buildOutput, /Built 6 pages to dist\//);
assert.match(buildOutput, /6 optional slots empty/);
assert.match(buildOutput, /editorial\/bolt-dodger\.html/);

const hostPages = walk(DIST).filter((file) => {
  const rel = path.relative(DIST, file);
  return file.endsWith(".html") && !rel.startsWith(`assets${path.sep}`);
});
assert.strictEqual(hostPages.length, 6);

const missing = [];
for (const page of hostPages) {
  const html = fs.readFileSync(page, "utf8");
  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
  assert.strictEqual(new Set(ids).size, ids.length, `Duplicate IDs in ${path.relative(DIST, page)}`);
  assert.doesNotMatch(html, /<img\b(?![^>]*\balt=)[^>]*>/i, `Image without alt in ${page}`);
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(match[0], /\brel="[^"]*noopener[^"]*"/);
  }

  const references = [];
  for (const match of html.matchAll(/(?:src|href|data-src)="([^"]+)"/g)) references.push(match[1]);
  for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
    match[1].split(",").forEach((candidate) => references.push(candidate.trim().split(/\s+/)[0]));
  }
  for (const reference of references) {
    if (/^(?:https?:|mailto:|data:|javascript:|#)/.test(reference)) continue;
    const target = relativeTarget(page, reference);
    if (target && !fs.existsSync(target)) {
      missing.push(`${path.relative(DIST, page)} -> ${reference}`);
    }
  }
}
assert.deepStrictEqual(missing, []);

const home = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
assert.strictEqual(count(home, /class="archive-tile\b/g), 130);
assert.strictEqual(count(home, /assets\/archive\/thumbs\/slide-\d+\.webp 384w/g), 130);
assert.match(home, /<section[^>]+aria-labelledby="archive-heading"/);
assert.match(home, /<h2 class="sr-only" id="archive-heading">Earlier work<\/h2>/);
assert.strictEqual(count(home, /https:\/\/fuse-catterson/g), 1);
assert.doesNotMatch(home, /fonts\.googleapis\.com/);
assert.match(home, /confirm\.webp"[^>]+width="1600" height="900"/);
assert.match(home, /landing\.webp"[^>]+width="1600" height="900"/);
assert.match(home, /diff\.webp"[^>]+width="604" height="340"/);

const detailRoutes = ["agent-debrief", "editorial", "steering"];
for (const route of detailRoutes) {
  const html = fs.readFileSync(path.join(DIST, route, "index.html"), "utf8");
  assert.doesNotMatch(html, /<h2 class="mt-6 max-w-\[44rem\]/);
  assert.match(html, /<p class="mt-6 max-w-\[44rem\]/);
  assert.match(html, /<meta property="og:image" content="https:\/\/mjsantone\.github\.io\/catterson\/assets\/social\//);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
}
assert.match(home, /<meta property="og:image" content="https:\/\/mjsantone\.github\.io\/catterson\/assets\/social\/home\.jpg">/);

const editorial = fs.readFileSync(path.join(DIST, "editorial", "index.html"), "utf8");
assert.strictEqual(count(editorial, /data-document-viewer/g), 3);
assert.strictEqual(count(editorial, /data-src="[^\"]+\.html"/g), 3);
assert.strictEqual(count(editorial, /class="document-carousel__poster"/g), 3);
assert.doesNotMatch(editorial, /data-document-viewer[^>]+loading="eager"/);

const cameo = fs.readFileSync(path.join(DIST, "js", "clippy-cameo.js"), "utf8");
assert.match(cameo, /aria-label="Main stories"/);
assert.doesNotMatch(cameo, /aria-label="Pieces"/);

const css = fs.readFileSync(path.join(ROOT, "src", "css", "site.css"), "utf8");
const faint = css.match(/--color-ink-faint:\s*(#[0-9a-f]{6})/i)[1];
assert(contrast(faint, "#faf8f4") >= 4.5);
assert(contrast("#6f6862", "#f4f2ee") >= 4.5);
assert(contrast("#8f8880", "#1b1917") >= 4.5);

const allAssets = pieces.flatMap((piece) => [piece.lead, ...(piece.supporting || [])]);
assert.strictEqual(allAssets.filter((asset) => asset.optional).length, 6);
assert.strictEqual(clippy.lead.bundle, true);

const archiveFull = fs.readdirSync(path.join(DIST, "assets", "archive")).filter((file) => /^slide-\d+\.webp$/.test(file));
const archiveThumbs = fs.readdirSync(path.join(DIST, "assets", "archive", "thumbs")).filter((file) => /^slide-\d+\.webp$/.test(file));
assert.strictEqual(archiveFull.length, 130);
assert.strictEqual(archiveThumbs.length, 130);
assert(!fs.existsSync(path.join(DIST, "assets", "resume", "ItsMeMatthew_2023_culled.pdf")));
for (const name of ["06 - Show us.webp", "06 - Show us-2.webp", "06 - Show us-3.webp"]) {
  assert(!fs.existsSync(path.join(DIST, "assets", "agent-debrief", "images", name)));
}

for (const file of ["home.jpg", "agent-debrief.jpg", "editorial.jpg", "steering.jpg"]) {
  const socialFile = path.join(DIST, "assets", "social", file);
  assert(fs.existsSync(socialFile));
  assert.deepStrictEqual(jpegSize(socialFile), { width: 1200, height: 630 });
}

console.log("Static checks passed: 6 pages, 130 archive tiles, 0 missing local targets.");
