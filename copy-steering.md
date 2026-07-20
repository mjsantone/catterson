# PIECE 3 — STEERING (workflow learning loop) — FINAL SHORT COPY (draft)
Note: the learning loop. Interactivity: VIDEO (live demo = interview stretch).

---

# An assistant that learns you, and knows when to stop watching

## Deterministic workflows can enforce steps but can't learn what "good" looks like for one person. I made a learning loop that watches how you refine its output, codifies your taste into a reusable workflow, and knows when to stop recording.

A workflow can enforce a sequence of steps. It cannot learn what "good" looks like for one specific person. A litigator and a corporate associate want different things from "summarize this," and neither will fill out a preferences form to get it. Nobody can name in advance, out of everything they might want, the one thing they need right now, so they pour that effort into the prompt every time and start each session cold. I made a learning loop that sits a layer above the workflow: it watches how you refine its output, codifies those preferences into a reusable workflow, then keeps refining that as you work. Create, refine, codify, reuse, update. The hard part was never the steps. It was trust.

The strongest idea arrived as a course-correction, out of a brainstorm with a researcher whose whole argument was that the system must never quietly take control away from the person. I had a manual "update workflow" button, then changed my mind mid-build: what if learning just continued, and instead of an update button you had a pause. Go off the record for a minute. That became the whole trust model. Pausing stops any new learning while everything already learned keeps applying. In the code it is one consent flag: the capture path checks it, the part that shapes the output ignores it. The faucet is the learning, the bottle is the saved recipe. You can shut the faucet without emptying the bottle. In high-stakes work, a professional has to know exactly when the system is recording them, and this is that line drawn in one gesture.

Here is the honest state. The applying side is proven: adherence to a saved workflow sits at a measured ceiling, on an eval harness that reports its confidence intervals. The learning side, whether it captured what you actually meant and not just whether it applied it, is the seam I am still verifying end to end. I would rather show you that seam than tell you the loop is finished.

---
BUILD: lead clip = refinement folding into workflow (+Undo toast). Then off-the-record toggle. Then "just learned X". All fresh capture (no existing loop imagery). "Where the intelligence lives" / classifier beat held for the interview, like the kit's debugging beat.
