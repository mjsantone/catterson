# PORTFOLIO CONTENT SPEC
## The single source of truth for the build. If this spec and any other file disagree, this spec wins.

**What this site is:** a lean screening-trigger portfolio for a senior design role at
Harvey (legal AI). Audience: a VP of Design + her team deciding whether to interview
Matthew (Catterson) Santone. Its ONE job: make them say "let's talk to this guy."
It is not the full case. Depth is saved for the interview.

**What it must feel like:** a familiar online portfolio people can flip through, executed
with unmistakable craft. The work carries the interest; the words stay out of its way.
Quiet confidence, zero salesmanship.

---

## SITE STRUCTURE

1. **Home / index** — minimal. Name, one line of positioning, the four pieces as a
   flip-through sequence (cards or a vertical scroll — designer's call, keep it familiar).
   No manifesto, no intro essay, no stated thesis.
2. **Four piece pages** (or four full-bleed sections), IN THIS ORDER:
   1. Starter kit  (note: foundations + restraint)
   2. Steering     (note: the learning loop)
   3. Agent debrief (note: accountability)
   4. Editorial    (note: judgment + pull — the closer)
3. **Clippy Easter egg** — hidden or footer-level wink. A playable side-scroller.
   Do NOT give it a card equal to the four pieces. It's dessert.

## ONE-LINE POSITIONING (homepage, under the name)
"Principal design architect. I think by making."
(If a second line is wanted: "Twenty years of craft, now applied to how humans and AI
agents work together." Use at most one of these two lines beyond the name — lean.)

## THE REPEATABLE PIECE COMPONENT (build ONCE, use 4x)
Every piece renders identically:
- **H1 HEADLINE** — the punchy claim
- **H2 STANDFIRST** — unlabeled, 2 sentences, first person. Visually a subtitle, never
  labeled "TL;DR" or "Summary."
- **LEAD ASSET** — the money-moment video or playable iframe, placed high, before or
  immediately after the standfirst
- **BODY** — dense prose (~350-450 words), rendered as flowing paragraphs. NO added
  subheads inside the body, NO bullets, NO pull-quotes unless specified per piece.
- **SUPPORTING ASSETS** — interleaved with or following the body per piece notes

## FINAL COPY
The four copy files are FINAL and verbatim: copy-kit.md, copy-steering.md,
copy-agent-debrief.md, copy-editorial.md (headline, standfirst, body in each; ignore the
file-header metadata lines and BUILD NOTES sections — those are instructions, not copy).
DO NOT rewrite, "improve," tighten, or expand ANY sentence. Voice rules are in
voice-and-tone.md — they apply to any microcopy you must generate (nav labels, alt text,
captions): no em dashes anywhere on the site, "made" not "built," plain and direct.

## PER-PIECE ASSET PLAN
Assets arrive in /assets/{kit,steering,agent-debrief,editorial,clippy}/ — each folder has
a README naming its money moments. Lead asset per piece:

| Piece | Lead asset | Supporting |
|---|---|---|
| Kit | persona-picker flow video (pick persona → whole prototype reshapes) | restraint-detail stills if present |
| Steering | refinement-folds-into-workflow video (+Undo toast) | off-the-record toggle video; "just learned" toast; state stills |
| Agent debrief | the trust moment, WITH SOUND: chip click → artifact scrolls+pulses | spoken turn-taking debrief clip; stills |
| Editorial | ONE playable artifact embedded as an iframe (self-contained HTML, e.g. the game) | report stills (the 5 topics); scroll-header video; gallery-hover video; sped-up generation |

- Editorial's optional pull-quote (the ONLY approved pull-quote on the site):
  "The output isn't the answer. It's the argument."
- Videos: muted autoplay-safe, captions burned in where the source has them, loop the
  short ones, always show controls on the sound-on debrief clip (it must NOT autoplay
  with sound).
- Missing assets at build time: render a clearly-labeled placeholder slot per the plan
  above and continue. Do not fake, generate, or substitute imagery.

## HARD CONSTRAINTS
- Personal project: NO Microsoft packages, internal registries, enterprise auth, or
  internal URLs anywhere in the repo. Static site. No API keys — nothing on this site
  calls a model. (The parked chat feature is explicitly NOT in scope.)
- The playable editorial artifact and Clippy are self-contained HTML in sandboxed iframes
  (they need no keys). Everything else is images and video.
- Accessibility: real alt text, keyboard navigable, prefers-reduced-motion respected,
  captions on sound media.
- Performance: this is a page recruiters open from a link. Fast first paint, lazy-load
  media below the fold, poster frames on videos.
- Shareable: per-piece URLs/anchors, sensible OG tags (title + standfirst per piece).
- Redaction check before ship: no internal repo names/paths, no colleague full names
  beyond what the copy itself states, nothing Microsoft-internal in filenames, metadata,
  or alt text. The copy files are pre-cleared; everything else gets checked.

## WHAT THIS SITE IS NOT
No stated thesis or manifesto. No "about my process" page. No contact form (a mailto/
LinkedIn link is fine). No live model calls. No analytics beyond the basics. No fifth
piece. Lean is the requirement, not the compromise.
