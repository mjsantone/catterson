// Site structure and asset plan. The words on the piece pages do NOT live here:
// headline, standfirst, and body are parsed from the copy-*.md files at build time,
// so the rendered copy stays verbatim by construction. This file holds everything
// else: order, asset slots, and the microcopy (captions, labels) the build generates.
//
// Microcopy rules (voice-and-tone.md): no em dashes, "made" not "built", plain and direct.
"use strict";

const site = {
  name: "Matthew Santone",
  tagline: "Principal design architect. I think by making.",
  // Change this if the site moves to a custom domain. Used for canonical + OG URLs.
  url: "https://mjsantone.github.io/catterson/",
  email: "matthewsantone@gmail.com",
};

// Asset slot shapes:
//   { kind: "video",  file, poster?, sound?, caption }   sound: true renders controls, never autoplays
//   { kind: "stills", prefix, caption }                  matches assets/<slug>/<prefix>*.png|jpg|webp
//   { kind: "iframe", file, title, caption }             self-contained HTML, sandboxed
const pieces = [
  {
    slug: "kit",
    title: "Starter kit",
    kicker: "Foundations and restraint",
    copy: "copy-kit.md",
    lead: {
      kind: "video",
      file: "persona-picker.mp4",
      poster: "persona-picker-poster.jpg",
      caption: "Pick a persona and the whole prototype reshapes around them.",
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
    slug: "steering",
    title: "Steering",
    kicker: "The learning loop",
    copy: "copy-steering.md",
    lead: {
      kind: "video",
      file: "refinement-loop.mp4",
      poster: "refinement-loop-poster.jpg",
      caption: "A refinement folds into the saved workflow, with an Undo toast.",
    },
    supporting: [
      {
        kind: "video",
        file: "off-the-record.mp4",
        caption: "Off the record: new learning stops while everything already learned keeps applying.",
      },
      {
        kind: "video",
        file: "just-learned.mp4",
        caption: "The \"just learned\" toast, the moment it tells you what it noticed.",
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
      file: "trust-moment.mp4",
      poster: "trust-moment-poster.jpg",
      sound: true,
      caption: "With sound. Click a decision chip and the artifact scrolls to and pulses the exact region that decision shaped.",
    },
    supporting: [
      {
        kind: "video",
        file: "debrief-turns.mp4",
        poster: "debrief-turns-poster.jpg",
        sound: true,
        caption: "With sound. The spoken debrief raises one decision, then stops and waits.",
      },
      {
        kind: "stills",
        prefix: "still-",
        caption: "Decision chips carry intent, confidence, rejected alternatives, and sources.",
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
        kind: "stills",
        prefix: "report-",
        caption: "Five reports, five topics, one house style.",
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

// The Easter egg. Footer-level wink, not a fifth piece.
const clippy = {
  slug: "clippy",
  title: "You found the paperclip.",
  standfirst: "A playable side-scroller. Dessert, not a fifth piece.",
  lead: {
    kind: "iframe",
    file: "clippy-game.html",
    title: "Clippy, a playable side-scroller",
    caption: "",
  },
};

module.exports = { site, pieces, clippy };
