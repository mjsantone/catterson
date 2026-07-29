# Portfolio Fidelity Backlog

This backlog tracks the next work that materially raises proof, polish, and screening quality. Proof assets come before more typography or copy refinement.

## Ownership

- **ASSET NEEDED: MATTHEW**: Matthew must capture or provide source media before implementation can finish.
- **READY: COPILOT**: No new source asset is required. Copilot can implement and verify it.
- **DECISION NEEDED: MATTHEW**: A product or editorial choice is required before work starts.

## 2026-07-29 Code And Experience Audit

All items below are **READY: COPILOT**. They are ordered by measured user impact, then hardening and polish.

- [x] Reserve intrinsic space for Home stills and reduce measured mobile CLS from 0.399 to less than 0.1. Verified at 0.000.
- [x] Replace denylist-based asset copying with an explicit publish manifest; stop shipping the three unreferenced Agent Debrief stills.
- [x] Bring global metadata and the Folio exhibit's small text to WCAG AA contrast. Verified at 4.74:1 to 5.01:1.
- [x] Put the main-story index before the four capability statements on Home so work appears in the first mobile viewport. First story now begins at 650px on a 390x844 viewport.
- [x] Generate responsive archive thumbnails and use `srcset` so mobile does not decode 97 million source pixels. Mobile now selects the 384px derivatives.
- [x] Defer inactive Editorial report iframes without removing their visual context. Static posters preserve the neighboring reports while only the active iframe runs.
- [x] Render detail standfirsts as paragraphs rather than section headings.
- [x] Fail the build for missing required media; mark the six intentionally empty slots optional and report their names.
- [x] Add route-specific Open Graph and Twitter preview images.
- [x] Repair the Home Clippy cameo selector and add a regression check.
- [x] Give the visual archive a screen-reader-only heading and summary.
- [x] Collapse the two Fuse links into one keyboard stop.
- [x] Remove the twelve-request external font waterfall from the Home name hover.

**Done when:** `npm test` covers the static contracts, all published routes pass browser regression checks at mobile and desktop widths, and the production Pages build is verified after deployment.

## Asset Queue

| Priority | Asset needed from Matthew | Target path | Capture brief |
| --- | --- | --- | --- |
| P0 | Steering pause-learning clip | `assets/steering/03_pause-learning.mp4` | Show learning active, pause or off-the-record, make a revision, then show that saved preferences still apply while the new revision is not captured. Muted, 16:9, 1920x1080 preferred, 15 to 25 seconds. |
| DONE | Steering create, learn, reuse clips | `assets/steering/0{1,2,3}_*.mp4` | Landed from the `r3/` capture. Reuse clip also covers the newly-learned marker: each applied rule names the correction it came from. |
| P1 | Steering eval result slice | `assets/steering/eval-rule-adherence.webp` | Capture the real eval harness with per-rule adherence, 95 percent confidence intervals, and visible decay as rules stack. Keep the legend and sample size readable. 1920px wide preferred. |
| DONE | Agent Debrief binding clip | `assets/agent-debrief/03_memo.mp4` | Landed from the `movs/r1` capture. Calls stay tied to the passages they produced, with reasoning beside them. |
| DONE | Agent Debrief hold clip | `assets/agent-debrief/01_challenge.mp4` | Landed from the `movs/r1` capture. Pushed with bare authority, the call holds and says why. |
| DONE | Agent Debrief tracked-revision clip | `assets/agent-debrief/02_rechallenge.mp4` | Landed from the `movs/r1` capture. A real reason upgrades the call and the change is recorded. |
| P0 | Agent Debrief sign-off gate clip | `assets/agent-debrief/vignettes/06-sign-off-gate.mp4` | In the same legal report, try to sign off with an unresolved call and show the gate stop the reviewer. Muted, 16:9, 1920x1080 preferred, about 8 seconds. |
| P1 | Agent Debrief volunteered-doubt clip | `assets/agent-debrief/vignettes/01-volunteered-doubt.mp4` | Let the answer land, then show the agent flagging its own weakest call before the reviewer acts. Muted, 16:9, 1920x1080 preferred, about 8 seconds. |
| P1 | Agent Debrief evidence-swap clip | `assets/agent-debrief/vignettes/05-swap-evidence.mp4` | Provide a better legal source and show one call re-ground against it. Muted, 16:9, 1920x1080 preferred, about 10 seconds. |
| P1 | Document Editing prototype-as-spec clip | `assets/document-editing/prototype-as-spec.mp4` | In one unbroken take, select text, open Ask from the floating toolbar, show the proposed edit streaming back as tracked changes, then accept or reject it. Muted, 16:9, 1920x1080 preferred, 15 to 25 seconds. |
| DONE | 1P Starter Kit lead visual | `assets/kit/images/landing.webp` | Landed as the empty state, cropped to 16:9 to keep the browser address bar out of frame. A persona-picker clip would still be stronger if captured. |
| P1 | Editorial pre-Folio output | `assets/editorial/before-generic-report.webp` | Capture the generic AI report state before Folio. Match the content or report section used by an existing Folio artifact when possible. Full-page or 16:9 at 1920px wide preferred. |
| P2 | Spoken Agent Debrief clip, only if the cadence is convincing | `assets/agent-debrief/debrief-turns.mp4` | Show one spoken decision, a stop for reviewer input, a challenge, and one response. Sound on, captions burned in, controls visible, under 45 seconds. |

### Capture Standards

- Use real product or prototype UI. Do not recreate the interaction as a motion mock.
- Remove internal names, tenant data, URLs, identifiers, notifications, and browser chrome that should not ship.
- Keep the cursor visible when it explains the action.
- Start and end on stable frames. Leave about half a second before the first action and after the final state.
- Prefer 1920x1080, H.264 MP4, 24 or 30 fps for video.
- Keep muted loops under 30 seconds where possible.
- Do not add explanatory title cards. The page caption carries the context.
- Strip sensitive metadata before adding assets to the repository.

## P0: Close Claim-to-Proof Gaps

### Steering: show the pause state

**Owner:** ASSET NEEDED: MATTHEW, then READY: COPILOT

- [ ] Matthew provides `assets/steering/03_pause-learning.mp4` using the brief above.
- [ ] Copilot places it after the consent-model paragraph.
- [ ] Copilot adds a concise caption describing capture stopping while saved preferences continue to apply.
- [ ] Copilot creates or extracts a stable poster frame if the video needs one.
- [ ] Verify muted autoplay, looping, reduced-motion behavior, mobile sizing, and no layout shift.

**Done when:** The page visibly proves the phrase "knows when to stop watching."

### Steering: standards over taste

**Owner:** DECISION NEEDED: MATTHEW, then READY: COPILOT

- [ ] Choose the governance model: seeded read-only house standards that win conflicts, or a lighter signal that personal preferences remain subordinate to correctness.
- [ ] Keep the portfolio copy explicit that the current prototype does not yet model this precedence layer.
- [ ] If implemented, capture one conflict where a learned preference loses to a firm or court rule.

**Done when:** The product demonstrates, rather than merely states, that personal taste cannot override a shared standard.

### Steering: show the eval receipt

**Owner:** ASSET NEEDED: MATTHEW, then READY: COPILOT

- [ ] Matthew provides `assets/steering/eval-rule-adherence.webp` using the brief above.
- [ ] Copilot places the result slice beside the final evaluation paragraph.
- [ ] Keep enough chart context to explain what the confidence interval estimates and how the rule stack changes.

**Done when:** The 95 percent confidence-interval claim is inspectable rather than method language alone.

### Agent Debrief: prove accountability in motion

**Owner:** ASSET NEEDED: MATTHEW, then READY: COPILOT

- [ ] Matthew captures the three core vignettes: `02-binding.mp4`, `03-hold.mp4`, and `06-sign-off-gate.mp4`.
- [ ] Use one consistent legal scenario across the clips. Replace the hot-dog report rather than mixing domains.
- [ ] Prefer a low-confidence indemnity-cap or clause interpretation call that can credibly hold or revise.
- [ ] Copilot places the three clips in argument order: locate, hold, block careless sign-off.
- [ ] Keep the current decision-overview still as context unless the volunteered-doubt clip replaces it.
- [ ] Preserve full-size access for the remaining dense screenshots.
- [ ] Verify playback, controls, captions if any, reduced motion, mobile framing, and Safari rendering.

**Done when:** A reviewer can locate the reasoning in a legal report, watch the agent refuse empty pressure, and see it block unresolved sign-off without relying on prose.

### Agent Debrief: deepen the accountability loop

**Owner:** ASSET NEEDED: MATTHEW, then READY: COPILOT

- [ ] Matthew captures `01-volunteered-doubt.mp4`.
- [ ] Matthew captures `04-revise-tracked.mp4`.
- [ ] Matthew captures `05-swap-evidence.mp4` after confirming the newer build re-grounds one call cleanly.
- [ ] Copilot interleaves only the clips that add a distinct proof point.

**Done when:** The page proves that doubt is volunteered, correction is visible and reversible, and the evidence base can be improved.

## P1: Improve Inspection And Evidence

### Mini inline story: Document Editing

**Owner:** ASSET NEEDED: MATTHEW, then READY: COPILOT

- [x] Add the prototype-as-spec story above the 1P Starter Kit.
- [x] Render it in full with no detail-page link.
- [x] Keep the public copy free of internal product names.
- [ ] Matthew provides `assets/document-editing/prototype-as-spec.mp4` using the brief above.
- [ ] Copilot verifies the clip in the inline layout and adds a poster frame if needed.

**Done when:** The story visibly proves that the working interaction, not a static handoff, carried the specification.

### Mini inline story: 1P Starter Kit

**Owner:** ASSET NEEDED: MATTHEW, then READY: COPILOT

- [x] Add a reusable mini inline story type to Home.
- [x] Render the Starter Kit story in full with no detail-page link.
- [x] Remove the generated `/kit/` route.
- [ ] Matthew provides `assets/kit/persona-picker.mp4` using the brief above.
- [ ] Copilot verifies the clip in the inline layout and adds a poster frame if needed.

**Done when:** The mini story proves the persona system visually while remaining subordinate to the three main stories.

### In-site image viewer

**Owner:** READY: COPILOT

- [ ] Replace raw-tab image viewing with an accessible full-screen dialog.
- [ ] Add close, previous, next, and zoom controls using familiar icons.
- [ ] Support Escape, arrow keys, focus trapping, and focus restoration.
- [ ] Support touch zoom or browser-native image zoom on mobile.
- [ ] Keep direct image URLs available as a fallback.
- [ ] Respect reduced motion and avoid decorative transitions.

**Done when:** Agent Debrief UI text can be inspected comfortably on desktop and mobile without leaving the case study.

### Editorial before-and-after proof

**Owner:** ASSET NEEDED: MATTHEW for the before state, then READY: COPILOT

- [ ] Matthew provides `assets/editorial/before-generic-report.webp` using the brief above.
- [ ] Copilot captures or selects a matched Folio after-state from the existing artifacts.
- [ ] Add a restrained comparison immediately after the opening problem paragraph.
- [ ] Use one comparison only. Do not turn the page into a gallery.
- [ ] Verify labels, alt text, mobile stacking, and image payload.

**Done when:** The visual transformation is understandable before the reader reaches the implementation explanation.

### Intentional video poster frames

**Owner:** READY: COPILOT, with optional DECISION NEEDED: MATTHEW on frame choice

- [ ] Extract candidate poster frames from the three existing Steering videos.
- [ ] Prefer the frame that shows the completed action, not an empty input or transition.
- [ ] Ask Matthew only if multiple frames carry meaningfully different stories.
- [ ] Export optimized poster assets and wire them through `src/content.js`.
- [ ] Verify first paint, aspect ratio, and transition from poster to playback.

**Done when:** Every video looks composed before playback and on slower connections.

## P2: Finish The Sharing Layer

### Route-specific social preview images

**Owner:** READY: COPILOT

- [ ] Generate one OG image each for Home, Editorial, Steering, and Agent Debrief.
- [ ] Use the site typography, paper color, headline, and one relevant artifact crop.
- [ ] Keep text inside social-card safe areas.
- [ ] Add `og:image`, image dimensions, alt text, and Twitter image metadata.
- [ ] Verify generated absolute URLs against the GitHub Pages base path.

**Done when:** Shared links look intentional in Slack, Teams, LinkedIn, and Messages.

### Final performance and accessibility audit

**Owner:** READY: COPILOT

- [ ] Run Lighthouse or equivalent checks on all published routes.
- [ ] Confirm zero horizontal page overflow at representative mobile widths.
- [ ] Verify keyboard navigation, focus visibility, dialog behavior, and carousel state.
- [ ] Check video and iframe loading strategy, image dimensions, and cumulative layout shift.
- [ ] Test reduced motion and no-hover environments.
- [ ] Confirm the password gate works with keyboard, screen readers, and persistent browser unlock.

**Done when:** No high-severity accessibility issue remains and media does not compromise first paint or layout stability.

## P3: Optional Depth

### Spoken Agent Debrief sequence

**Owner:** DECISION NEEDED: MATTHEW and ASSET NEEDED: MATTHEW

Only pursue this if the spoken cadence is clearly better than the static and silent proof. A weak voice interaction lowers fidelity more than omitting it.

- [ ] Matthew decides whether the recorded interaction feels natural enough to publish.
- [ ] If yes, provide `assets/agent-debrief/debrief-turns.mp4` using the brief above.
- [ ] Copilot places it after the turn-taking paragraph with sound controls and captions.
- [ ] Verify no autoplay with sound and full keyboard access.

## Recommended Order

1. Capture Steering pause-learning clip.
2. Capture Agent Debrief binding, hold, and sign-off gate clips.
3. Implement the Steering and core Agent Debrief clips with poster frames.
4. Capture Agent Debrief volunteered doubt and tracked revision; add evidence swap only if the newer build proves it cleanly.
5. Capture and add the Document Editing prototype-as-spec clip.
6. Capture and add the 1P Starter Kit persona-picker clip.
7. Add the in-site image viewer.
8. Capture and add Editorial before-and-after proof.
9. Generate route-specific social cards.
10. Run the final performance and accessibility audit.
11. Consider spoken Agent Debrief only after the core proof is complete.
