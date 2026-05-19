# Reading UI Direction

> Archived document. This file records the first reading-UI planning pass and is not current UI documentation.

**Status:** Historical design record  
**Last updated:** 2026-05-19

---

## What This File Was

This archive originally captured the first pass at turning an unstyled Astro blog into a readable long-form site. It belonged to an earlier repository shape, before the current parent/child series structure fully settled and before the active layout/styles became the canonical implementation.

The document is preserved because it explains the original intent of the reading-focused UI phase:

- improve readability before pursuing full visual branding
- constrain prose width and spacing
- separate navigation from body content
- keep the implementation lightweight

---

## What Is Historical Only

The original draft discussed repository state that is no longer current, including:

- the retired flat `/series/<series>` route
- removed concept-page routes and related authoring references
- pre-implementation layout assumptions
- open design questions that were later resolved

Those descriptions should be read strictly as historical context from the first design pass, not as present-tense guidance about the live codebase.

---

## Lasting Outcomes

The historical design pass mattered because it established the repository's baseline reading priorities:

- readable content width
- explicit typography and spacing
- visually separated navigation
- minimal styling complexity

Current implementation details should be taken from the live code and active docs, not reconstructed from this archive.

---

## Use These Instead For Current State

- [`../../src/layouts/BaseLayout.astro`](../../src/layouts/BaseLayout.astro) — current shared page shell
- [`../../src/layouts/PostLayout.astro`](../../src/layouts/PostLayout.astro) — current post layout
- [`../../src/styles/global.css`](../../src/styles/global.css) — active styling
- [`../../src/pages/index.astro`](../../src/pages/index.astro) — current homepage
- [`../../src/pages/series/[parent].astro`](../../src/pages/series/%5Bparent%5D.astro) — current parent series page
- [`../../src/pages/series/[parent]/[child].astro`](../../src/pages/series/%5Bparent%5D/%5Bchild%5D.astro) — current child series page
