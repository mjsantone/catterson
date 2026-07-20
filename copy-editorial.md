# PIECE 2 — EDITORIAL (ANCHOR / CLOSER) — FINAL SHORT COPY
Note: judgment + pull. Interactivity: playable artifacts (live) + video (scroll/gallery/gen).
Status: DONE. Sets the template for the other three.

---

# I made the house style, then got teams to want it

## AI-generated reports looked cheap. I made the house style that fixed it, argued it up the chain, and teams keep coming to ask for it.

The output looked like AI output. Gray boxes, default type, charts a spreadsheet would be embarrassed by. Everyone could see it and nobody owned it. Polish had been deprioritized for stability and feature parity, a completely valid call by engineering to keep the product moving. I decided waiting wasn't enough.

So I made the thing instead of asking for it. A house style called Folio that an LLM composes inside of, not a stylesheet but a decision framework: a reading column, a rhythm, a vocabulary of data components the model reaches for and adapts. A prompt goes in, a designed editorial report comes out. Once you can point at generated output that looks composed instead of assembled, "it looks cheap" stops being an opinion and becomes a before-and-after.

The hard part was not styling one report. It was teaching a probabilistic model to make good visual decisions on content it has never seen, thousands of times, without me in the loop. You cannot art-direct every output. So I drew a line that became the whole approach: the model authors content and rough intent, and the render layer enforces every editorial rule the model can't hold consistently. The model writes. The render layer is the source of truth for how it looks. That division is the reusable idea, and it is the same problem anyone generating documents with an LLM has to solve.

I made the argument up the chain too, that the output is the product, not the packaging. It got forwarded two levels. And I stayed honest about the work itself. The Folio house style and composition rules are mine, merged into the staging mirror for Microsoft's Researcher agent, and I am developing them now with the engineer who owns integration toward production. I stayed in the code the whole way, down to catching the layout bugs by eye that the screenshots hid. I measure what I ship: one round of config changes to push richer layouts simply didn't work, and I reported that plainly instead of dressing it up. Knowing which lever actually moves the model, and which just adds complexity, is the difference between craft and decoration.

Then the part that matters more than shipping: another team came to me. They pointed at what I had made as the example of well-crafted, design-system output, and asked how to get theirs closer. The decision out of that room was to integrate my work into their pipeline. And it kept happening. It is about a team a week now, reaching out with the same question. That is pull, not push. I did not lobby any of them. They saw the bar and wanted it.

---

## BUILD NOTES
- Optional pull-quote (NOT in body): "The output isn't the answer. It's the argument."
- Lead visual: a playable 3D/game artifact (Bolt Dodger) OR a strong report still.
- Supporting visuals: 5 report artifacts (round-11 screenshots), scroll-story glass header
  (video), Discover gallery cursor-spotlight hover (video), sped-up generation (video).
- Every claim verified. No PR numbers. No "shipped to production."
