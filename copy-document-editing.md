<!-- markdownlint-disable MD025 MD026 -->

# MINI STORY - DOCUMENT EDITING

Note: prototype as specification. Interactivity: recorded selection-to-review flow.

---

# I didn't hand off a spec. I handed off the working thing.

## I made an AI document-editing interaction concrete enough to use, and engineering used the working prototype as the specification for production.

Normal handoff turns an interaction into a translation of a translation. A static file can describe states, but it cannot hold feel, timing, or behavior. This interaction needed all three.

Select text inside an AI-generated document and a toolbar follows with Ask, Comment, and Copy. Ask sends that exact passage to the model. The proposed edit streams back as tracked changes to accept or reject, with comments anchored to the words they touch.

I made the interaction work instead of describing it. That meant staying in the real code, down to fixing a stale closure that sent only the first selected passage and choosing one bundled stream so parallel calls could not race shared document state.

Engineering used the working prototype as the specification for production. I made the prototype. They built the product.

---
BUILD: one unbroken recording of select text, Ask, streamed tracked changes, and accept or reject.

## INLINE STORY

Normal handoff turns an interaction into a translation of a translation. This one could not survive that route. Select text inside an AI-generated document and a toolbar follows with Ask, Comment, and Copy. Ask streams a proposed edit back as tracked changes to accept or reject, with comments anchored to the words they touch.

I made it work instead of describing it, down to fixing a stale closure that sent only the first selected passage. Engineering used the working prototype as the specification. I made the prototype. They built the product.
