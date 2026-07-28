// Site structure and asset plan. The words on the piece pages do NOT live here:
// headline, standfirst, and body are parsed from the copy-*.md files at build time,
// so the rendered copy stays verbatim by construction. This file holds everything
// else: order, asset slots, and the microcopy (captions, labels) the build generates.
//
// Microcopy rules (voice-and-tone.md): no em dashes, "made" not "built", plain and direct.
"use strict";

const site = {
  name: "Matthew Santone",
  tagline: "Twenty years of craft, now applied to AI that a professional has to answer for.",
  // Change this if the site moves to a custom domain. Used for canonical + OG URLs.
  url: "https://mjsantone.github.io/catterson/",
  email: "matthewsantone@gmail.com",
  homeExternalPreview: {
    title: "Fuse",
    label: "Live tool",
    description: "Blend weighted ingredients into a new output on a freeform canvas.",
    image: "assets/fuse/fuse-preview.webp",
    url: "https://fuse-catterson-gcakeab6etetcaaq.westus2-01.azurewebsites.net",
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
      layout: "sequence",
      caption: "The empty state: one input, a few starting points, nothing else.",
    },
    supporting: [
      {
        kind: "stills",
        prefix: "restraint-",
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
      files: ["images/pull-requests.webp"],
      layout: "sequence",
      caption: "Merged changes to production, titles obscured.",
    },
    supporting: [],
  },
  {
    slug: "steering",
    title: "Steering",
    kicker: "The learning loop",
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
        caption: "States of the loop: create, refine, codify, reuse, update.",
      },
    ],
  },
  {
    slug: "agent-debrief",
    title: "Agent debrief",
    kicker: "Accountability",
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
        featured: "Liebeck v McDonalds  Myth vs the Record.html",
        exclude: [
          "bolt-dodger.html",
        ],
      },
      {
        kind: "video",
        file: "scroll-header.mp4",
        caption: "The scroll-story glass header.",
      },
      {
        kind: "video",
        file: "gallery-hover.mp4",
        caption: "The gallery's cursor-spotlight hover.",
      },
      {
        kind: "video",
        file: "generation-speedrun.mp4",
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
    caption: "",
  },
};

module.exports = { site, pieces, publishedPieceSlugs, inlineStorySlugs, clippy };
