# PIECE 2 — EDITORIAL (ANCHOR / CLOSER) — FINAL SHORT COPY
Note: judgment + pull. Interactivity: playable artifacts (live) + video (scroll/gallery/gen).
Status: DONE. Sets the template for the other three.

---

# I codified the house style, then got teams to want it

## Fluent Expression had designed a report language in Figma. I codified it into skills and a render system so an LLM could compose with it, from a tort case to the rule against perpetuities, then merged the experiment into Microsoft's Researcher agent.

AI-generated reports looked cheap: gray boxes, default type, charts a spreadsheet would be embarrassed by. Engineering had correctly prioritized stability and feature parity. I went looking for a visual foundation that could survive generation, not just make one report look better.

The Fluent Expression team had already designed that foundation in Figma. I asked whether an LLM could compose with it. That experiment became Folio. I translated the visual language into a decision framework: a reading column, a rhythm, and a vocabulary of data components the model can select and adapt. A prompt goes in; a composed editorial report comes out. Hierarchy tells the reader what matters, and evidence stays attached to the claim.

The hard part was not styling one report. It was making good visual decisions repeatable across content I had never seen, without me in the loop. I drew a boundary that became the system: the model authors content and rough intent; the render layer enforces the editorial rules it cannot hold consistently. The model writes. The render layer is the source of truth for how it looks.

Folio is now merged into a pre-production version of Microsoft's Researcher agent, where I am developing it with the engineer who owns integration. A config-only attempt to produce richer layouts did not work. Moving consistency into the render layer did. That failure clarified which layer should own the visual contract. I stayed in the code through implementation, including layout defects the screenshots hid.

The first pull signal came from another team. They pointed to Folio as the bar for design-system output and chose to integrate it into their pipeline. Other teams have since brought the same request. Today, the evidence is a working pre-production integration and unsolicited demand beyond the team that made it. Production adoption is still ahead.

---

## BUILD NOTES
- Optional pull-quote (NOT in body): "The output isn't the answer. It's the argument."
- Lead visual: a playable 3D/game artifact (Bolt Dodger) OR a strong report still.
- Supporting visuals: 5 report artifacts (round-11 screenshots), scroll-story glass header
  (video), Discover gallery cursor-spotlight hover (video), sped-up generation (video).
- Every claim verified. No PR numbers. No "shipped to production."
