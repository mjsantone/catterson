// Site structure and asset plan. The words on the piece pages do NOT live here:
// headline, standfirst, and body are parsed from the copy-*.md files at build time,
// so the rendered copy stays verbatim by construction. This file holds everything
// else: order, asset slots, and the microcopy (captions, labels) the build generates.
//
// Microcopy rules (voice-and-tone.md): no em dashes, "made" not "built", plain and direct.
"use strict";

const site = {
  name: "Matthew Santone",
  tagline: "Principal product designer. I think by making.",
  // The first paragraph says who Matthew is; the second establishes the breadth
  // of an ongoing practice. Both stay in present tense.
  intro: [
    "I design complicated software and make it easier to understand and use.",
    "My work ranges from developer tools and enterprise platforms to mixed reality and consumer products. Depending on the problem, I move between product strategy, interaction design, prototyping, design systems, writing, and production code.",
  ],
  // Change this if the site moves to a custom domain. Used for canonical + OG URLs.
  url: "https://mjsantone.github.io/catterson/",
  email: "matthewsantone@gmail.com",
  social: {
    image: "assets/social/home.jpg",
    alt: "Matthew Santone, principal product designer. I think by making.",
  },
  homeExternalPreview: {
    title: "Fuse",
    label: "Live tool",
    description: "Blend weighted ingredients into a new output on a freeform canvas.",
    alt: "Fuse canvas with flow, form, and play blended into one shape, each ingredient holding its own share of the result.",
    image: "assets/fuse/fuse-preview.webp",
    url: "https://fuse-catterson-gcakeab6etetcaaq.westus2-01.azurewebsites.net",
  },
  // Published elsewhere, newest first. Titles and outlets are as printed.
  writing: [
    {
      title: "Lucid dreaming together with AI",
      publication: "Microsoft Design",
      year: "2025",
      url: "https://microsoft.design/articles/lucid-dreaming-together-with-ai/",
    },
    {
      title: "A designer's guide to conquering anxiety",
      publication: "Fast Company",
      year: "2017",
      url: "https://www.fastcompany.com/90139038/a-designers-guide-to-conquering-anxiety",
    },
  ],
  // A 2023 portfolio deck, one tile per page, discovered on disk at build time.
  // No visible heading or caption: at this size the tiles are texture. A hidden
  // heading and summary give the archive a name for assistive technology.
  archive: {
    dir: "archive",
    thumbDir: "archive/thumbs",
    label: "Earlier work",
    description: "One hundred thirty pages from a 2023 portfolio deck, followed by eight screens from Salesforce and Wrap, shown as a visual archive.",
    // The deck's own chapter openers, which are the pages that carry no page
    // number. They take the double tiles. Their spacing is uneven, which is
    // the point: a fixed interval lands every large tile in the same column.
    large: [1, 6, 49, 64, 67, 76, 77, 94, 102, 123],
    // Page five is the mosaic the rest of this site was drawn from, so it is
    // the one tile that opens itself.
    origin: {
      file: "slide-005.webp",
      label: "Open the mosaic this site was drawn from, full size",
    },
  },
};

// Asset slot shapes:
//   { kind: "video",  file, poster?, sound?, caption }   sound: true renders controls, never autoplays
//   { kind: "stills", prefix?, files?, layout?, caption } matches discovered or explicit images
//   { kind: "documents", exclude? }                      embeds discovered local HTML with full-view links
//   { kind: "iframe", file, title, caption }             self-contained HTML, sandboxed
const pieces = [
  {
    slug: "document-editing",
    title: "Document editing",
    kicker: "Prototype as specification",
    copy: "copy-document-editing.md",
    lead: {
      kind: "stills",
      files: ["images/confirm.webp"],
      width: 1600,
      height: 900,
      layout: "sequence",
      caption: "A proposed edit arrives as tracked changes, ready to accept or reject.",
    },
    supporting: [],
  },
  {
    slug: "kit",
    title: "1P Starter Kit",
    kicker: "Foundations and restraint",
    copy: "copy-kit.md",
    lead: {
      kind: "stills",
      files: ["images/landing.webp"],
      width: 1600,
      height: 900,
      layout: "sequence",
      caption: "The empty state: one input, a few starting points, nothing else.",
    },
    supporting: [
      {
        kind: "stills",
        prefix: "restraint-",
        optional: true,
        caption: "The details where the line held.",
      },
    ],
  },
  {
    slug: "production-code",
    title: "Production code",
    kicker: "Craft in the details",
    copy: "copy-production-code.md",
    lead: {
      kind: "stills",
      files: ["images/diff.webp"],
      width: 604,
      height: 340,
      layout: "sequence",
      caption: "A visual diff of one component, before and after, showing exactly where the layout moved.",
    },
    supporting: [],
  },
  {
    slug: "steering",
    title: "Steering",
    kicker: "The learning loop",
    social: {
      image: "assets/social/steering.jpg",
      alt: "An assistant that learns you, and knows when to stop watching.",
    },
    copy: "copy-steering.md",
    lead: {
      kind: "video",
      file: "01_create.mp4",
      poster: "01_create-poster.webp",
      caption: "Start with the task in chat, no preferences form.",
    },
    supporting: [
      {
        kind: "video",
        file: "02_learn.mp4",
        poster: "02_learn-poster.webp",
        afterParagraph: 1,
        caption: "Refine the result, then save the run as a named workflow.",
      },
      {
        kind: "video",
        file: "03_reuse.mp4",
        poster: "03_reuse-poster.webp",
        afterParagraph: 2,
        caption: "Reuse it later and each rule shows the correction it came from.",
      },
      {
        kind: "stills",
        prefix: "state-",
        optional: true,
        caption: "States of the loop: create, refine, codify, reuse, update.",
      },
    ],
  },
  {
    slug: "agent-debrief",
    title: "Agent debrief",
    kicker: "Accountability",
    social: {
      image: "assets/social/agent-debrief.jpg",
      alt: "An agent that accounts for itself.",
    },
    copy: "copy-agent-debrief.md",
    lead: {
      kind: "video",
      file: "03_memo.mp4",
      poster: "03_memo-poster.webp",
      caption: "Each call stays tied to the passage it produced, with its reasoning beside it.",
    },
    supporting: [
      {
        kind: "video",
        file: "01_challenge.mp4",
        poster: "01_challenge-poster.webp",
        afterParagraph: 4,
        caption: "Pushed with bare authority, the call holds and says why.",
      },
      {
        kind: "video",
        file: "02_rechallenge.mp4",
        poster: "02_rechallenge-poster.webp",
        afterParagraph: 4,
        caption: "Given a real reason, it revises the call and records the change.",
      },
    ],
  },
  {
    slug: "editorial",
    title: "Editorial",
    kicker: "Judgment and pull",
    social: {
      image: "assets/social/editorial.jpg",
      alt: "I codified the house style, and other teams made it their standard.",
    },
    copy: "copy-editorial.md",
    // The only approved pull-quote on the site (CONTENT-SPEC.md). Rendered as an
    // aside after the given body paragraph, never inserted into the prose itself.
    pullQuote: {
      text: "The output isn't the answer. It's the argument.",
      afterParagraph: 2,
    },
    lead: {
      kind: "iframe",
      file: "bolt-dodger.html",
      optional: true,
      title: "Bolt Dodger, a playable artifact",
      caption: "Bolt Dodger. A playable artifact, embedded live.",
    },
    supporting: [
      {
        kind: "documents",
        files: [
          "Folio System Storybook.html",
          "Liebeck v McDonalds  Myth vs the Record.html",
          "The Rule Against Perpetuities.html",
        ],
        posters: {
          "Folio System Storybook.html": "posters/folio.webp",
          "Liebeck v McDonalds  Myth vs the Record.html": "posters/liebeck.webp",
          "The Rule Against Perpetuities.html": "posters/perpetuities.webp",
        },
        featured: "Liebeck v McDonalds  Myth vs the Record.html",
        exclude: [
          "bolt-dodger.html",
        ],
      },
      {
        kind: "video",
        file: "scroll-header.mp4",
        optional: true,
        caption: "The scroll-story glass header.",
      },
      {
        kind: "video",
        file: "gallery-hover.mp4",
        optional: true,
        caption: "The gallery's cursor-spotlight hover.",
      },
      {
        kind: "video",
        file: "generation-speedrun.mp4",
        optional: true,
        caption: "A full report generating, sped up.",
      },
    ],
  },
];

// Main stories appear in the Home index and previous/next sequence.
const publishedPieceSlugs = ["agent-debrief", "editorial", "steering"];

// Smaller stories render in full on Home and do not generate detail routes.
// Pieces omitted from both lists still generate hidden, directly accessible routes.
const inlineStorySlugs = ["document-editing", "kit", "production-code"];

// The Easter egg. Footer-level wink, not a fifth piece.
const clippy = {
  slug: "clippy",
  title: "You found the paperclip.",
  description: "CLIPPY.EXE: The Office Assistant Strikes Back.",
  lead: {
    kind: "iframe",
    file: "clippy-main/index.html",
    title: "Clippy, a playable side-scroller",
    sandbox: "allow-scripts allow-pointer-lock allow-same-origin",
    fullscreen: true,
    bundle: true,
    caption: "",
  },
};

module.exports = { site, pieces, publishedPieceSlugs, inlineStorySlugs, clippy };
