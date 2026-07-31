<!-- markdownlint-disable MD025 MD026 -->

# MINI STORY - PRODUCTION CODE

Note: craft at the detail level. Interactivity: none. The merged changes are the artifact.

---

# Craft bugs sit at the bottom of the backlog. I started fixing them myself.

## Twenty-nine changes merged to production code in nine months. Most were defects too small for anyone to prioritise, the kind that sit in an engineering backlog until they become the way the product looks.

A design review produces a list, and then someone else decides what happens to it. The gap between what I noticed and what shipped was always the same gap. So I closed it from the other side and opened the pull request myself.

Most of what I sent is too small to assign. A dropdown that produced two scrollbars. A loading skeleton whose label did not match the label that replaced it. A title that drifted off center once the viewport got narrow. An input whose inset padding was symmetric in the spec and not in the build. None of these are features. They are the difference between a product that feels considered and one that feels close enough.

The larger ones took out components I had made myself. A custom title came out and the shared one went in. A hand-rolled carousel came out and the design system's carousel went in. A bespoke tab list came out behind a feature flag. Each of those started as something I made, and the right ending for each was to let it disappear into the system everyone else already uses.

A redesign went out in order: dependencies and a flag first, then typography and layout tokens, then the component swaps, then the motion. Accessibility work and unit tests rode along with the components that needed them, and the ones worth reusing got Storybook entries, so the next person does not have to read my diff to understand them.

Design leadership that stops at the critique leaves the last ten percent to whoever has time. That last ten percent is the part people feel.

---
BUILD: lead = the visual regression diff from a pull request, cropped to the overlay panel. No titles, repositories, or reviewers appear in it, so it needs no redaction.

## INLINE STORY

Design feedback is easy to send and easy to ignore, and a defect this small never reaches the top of anyone's queue. Over nine months I opened twenty-nine pull requests instead: a dropdown that produced two scrollbars, a title that drifted off center at narrow widths, an input inset that was symmetric in the spec and not in the build.

The larger changes retired components I had made myself and put the shared design system in their place: a custom title, a hand-rolled carousel, a bespoke tab list. All twenty-nine merged. The right ending for a component you built alone is to disappear into the system everyone else already uses.
