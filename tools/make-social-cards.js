// Renders the Open Graph cards from the built site so card text can never drift from page copy.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { site, pieces } = require("../src/content.js");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const ORIGIN = "http://localhost:3001";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const strip = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

function headlineOf(slug) {
  const file = path.join(DIST, slug, "index.html");
  const match = fs.readFileSync(file, "utf8").match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!match) throw new Error(`No h1 in ${slug}`);
  return strip(match[1]);
}

// Poster frames stand in for the video leads.
const VISUALS = {
  "agent-debrief": "/assets/agent-debrief/03_memo-poster.webp",
  editorial: "/assets/editorial/posters/liebeck.webp",
  steering: "/assets/steering/01_create-poster.webp",
};

const cards = [
  {
    name: "home",
    eyebrow: site.name,
    headline: site.tagline,
    visual: "/" + site.homeExternalPreview.image,
  },
  ...pieces
    .filter((p) => p.social && VISUALS[p.slug])
    .map((p) => ({
      name: p.slug,
      eyebrow: `${site.name} / ${p.kicker}`,
      headline: headlineOf(p.slug),
      visual: VISUALS[p.slug],
    })),
];

const sizeFor = (text) => (text.length <= 40 ? 54 : text.length <= 60 ? 48 : 44);

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const template = (card) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "Fraunces";
    src: url("/fonts/fraunces-latin.woff2") format("woff2");
    font-weight: 100 900;
    font-display: block;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #faf8f4; color: #1b1917;
    display: grid; grid-template-columns: 700px 500px;
  }
  .copy { padding: 62px 56px 62px 72px; display: flex; flex-direction: column; overflow: hidden; }
  .eyebrow {
    font: 600 15px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: .15em; text-transform: uppercase; color: #756e66;
  }
  .headline {
    margin: auto 0 0; font-family: "Fraunces", Georgia, serif;
    font-size: ${sizeFor(card.headline)}px; font-weight: 440;
    line-height: 1.08; letter-spacing: -.01em;
  }
  .visual { position: relative; display: grid; place-items: center; background: #1b1917; overflow: hidden; }
  .visual::before {
    content: ""; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(250,248,244,.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(250,248,244,.05) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .visual img { position: relative; width: 100%; height: auto; max-height: 100%; object-fit: contain; }
</style>
<section class="copy">
  <div class="eyebrow">${escape(card.eyebrow)}</div>
  <h1 class="headline">${escape(card.headline)}</h1>
</section>
<div class="visual"><img src="${card.visual}" alt=""></div>
`;

const scratchHtml = path.join(DIST, "_card.html");
const outDir = path.join(ROOT, "assets", "social");

for (const card of cards) {
  fs.writeFileSync(scratchHtml, template(card));
  const png = path.join("/tmp", `card-${card.name}.png`);
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=5000",
      "--window-size=1200,630",
      `--screenshot=${png}`,
      `${ORIGIN}/_card.html`,
    ],
    { stdio: "ignore" }
  );
  const jpg = path.join(outDir, `${card.name}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "84", png, "--out", jpg], {
    stdio: "ignore",
  });
  const dims = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", jpg], {
    encoding: "utf8",
  });
  const w = dims.match(/pixelWidth: (\d+)/)[1];
  const h = dims.match(/pixelHeight: (\d+)/)[1];
  if (w !== "1200" || h !== "630") throw new Error(`${card.name}: got ${w}x${h}`);
  console.log(`${card.name.padEnd(14)} ${w}x${h}  ${card.headline}`);
}

fs.unlinkSync(scratchHtml);
console.log(`\nWrote ${cards.length} cards to assets/social/`);
