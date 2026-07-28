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

0. **Access gate** — first load shows nine rounded password cells. A successful unlock
  persists in the current browser, so reviewers do not need to re-enter it in every tab.
1. **Home / index** — minimal. Name, one line of positioning, the three published pieces as a
   flip-through sequence (cards or a vertical scroll — designer's call, keep it familiar).
   No manifesto, no intro essay, no stated thesis.
2. **Three main piece pages** form the published index and previous/next sequence:
  1. Editorial    (note: judgment + pull)
  2. Steering     (note: the learning loop)
  3. Agent debrief (note: accountability)
3. **Mini inline stories** sit below the main index and are fulfilled entirely on Home.
  They have no detail route or previous/next navigation. Document Editing comes first,
  followed by the 1P Starter Kit. Mini headlines render one step below detail-page
  headlines: 40px wide and 28px narrow. The first mini has no leading divider; later
  minis use a divider between stories. An optional 16:9 proof asset sits below the
  headline in the left column and stacks above the copy on narrow screens.
4. **External live preview** — Fuse appears beneath the mini stories as a clickable
  16:9 screenshot at its native 505px UI scale, with standard 32px artifact corners
  and an external-link fallback. It scales down fluidly on narrow screens.
5. **Clippy Easter egg** — hidden or footer-level wink. A playable side-scroller.
   Do NOT give it a card equal to the four pieces. It's dessert.

## ONE-LINE POSITIONING (homepage, under the name)
"Twenty years of craft, now applied to how humans and AI agents work together."

## THE REPEATABLE PIECE COMPONENT (build ONCE, use 4x)
Every main piece renders identically:
- **H1 HEADLINE** — the punchy claim
- **H2 STANDFIRST** — unlabeled, 2 sentences, first person. Visually a subtitle, never
  labeled "TL;DR" or "Summary."
- **LEAD ASSET** — the money-moment video or playable iframe, placed high, before or
  immediately after the standfirst
- **BODY** — dense prose (~350-450 words), rendered as flowing paragraphs. NO added
  subheads inside the body, NO bullets, NO pull-quotes unless specified per piece.
  Opening and closing paragraphs render at 24px; explanatory middle paragraphs at
  20px. Both share the 704px editorial column; the 24px style lands near 70 characters
  per line, while the 20px style is allowed a longer rag to preserve alignment.
  Detail-page standfirsts step to 32px and headlines to 64px on wide screens, with
  28px and 48px narrow-screen equivalents.
- **SUPPORTING ASSETS** — interleaved with or following the body per piece notes
- **SCROLL REVEAL** — detail-page editorial beats reveal once with a 420ms fade and
  8px rise. Home is excluded. Iframe-containing media is never transformed, hidden tabs
  render immediately, and reduced-motion users receive no animation.

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
| Document Editing inline story | selection to Ask to tracked-change review video | none |
| 1P Starter Kit inline story | empty-state landing still (one input, a few starting points, nothing else) | restraint-detail stills if present |
| Steering | start-in-chat video | refine-into-named-workflow video; reuse video showing each rule's originating correction; pause-learning clip |
| Agent debrief | "show us" overview still, opens full size | binding, hold, and tracked-revision videos; evidence swap and sign-off gate vignettes still to capture |
| Editorial | Page-native, scoped Folio system exhibit grounded in the real direction source | a three-output horizontal carousel with Liebeck featured at center and standalone full-width views; scroll-header video; gallery-hover video; sped-up generation |

- Editorial's optional pull-quote (the ONLY approved pull-quote on the site):
  "The output isn't the answer. It's the argument."
- Videos: muted autoplay-safe, captions burned in where the source has them, and loop
  the short ones. Any future sound-on media must show controls and never autoplay.
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
