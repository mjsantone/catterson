# PIECE 4 — AGENT DEBRIEF — FINAL SHORT COPY (draft)
Note: accountability. Interactivity: VIDEO w/ sound (portable but voice too fragile live).

---

# An agent that accounts for itself

## You can't trust an agent with work you put your name on unless you can interrogate why it made its choices. So I made one that hands you its reasoning and lets you argue with it before you rely on it.

In high-stakes professional work you put your name on the output. That means receiving what an agent made is not enough. You have to interrogate why it made those choices, and push back before you rely on them. Most tools hand you an artifact and a shrug. I made one that hands you the reasoning and lets you argue with it.

An agent generates an artifact, then debriefs you on the decisions it made to get there. Every decision is a chip that carries its own intent, its confidence, the alternatives it rejected, and the source it leaned on. And each chip is bound to the exact part of the artifact that decision produced.

The strongest moment is that link. Touch a decision and the artifact scrolls to and pulses the precise region that decision shaped. This is the whole point, not a nicety. Reasoning you cannot locate in the output is reasoning you cannot check. Binding "I assumed the audience already knows the project, confidence low" to the specific slide it changed is what lets a professional catch a wrong call before it ships. When the artifact is a full HTML document sealed inside an iframe, I made a message bridge to carry the highlight across that boundary. The trust link had to survive even the hardest rendering case.

The debrief is spoken and turn-taking by design. The agent raises one decision, then stops and waits, the way a colleague accounting for their work would. It does not lecture. I tuned it toward feedback and action items, and against monologue, and it took several passes to stop it stacking every question into one breathless run.

Here is the honest state. The reasoning-to-artifact link works across structured and HTML artifacts, and the decisions are extracted from the model's own thinking rather than bolted on after. It is rough in places: the highlight matches on the decision's text, so if that text isn't present verbatim in the document it quietly does nothing, and the spoken cadence stays prompt-dependent. There is no adoption data. This is a prototype making an argument, not a shipped product. I would rather show you the argument than pretend it's finished.

---
BUILD: lead clip = the trust moment (click chip -> artifact scrolls+pulses), once on slide + once on HTML. Then spoken debrief w/ voice pushback. All video, sound, captions, <90s.
