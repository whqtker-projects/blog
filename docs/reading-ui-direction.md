# Reading UI Direction

**Status:** Resolved — first reading-focused UI phase implemented.  
**Last updated:** 2026-05-08

This document records the design direction that guided the first reading-focused UI pass. It is no longer a statement of the current rendered site state.

This document defines the reading-focused UI direction that was implemented in the first reading-focused phase. At design time, the blog had working navigation structure and published content but no visual layer yet. That phase added readability without introducing full branding or a component library.

---

## Purpose

The current site renders entirely in browser default styles. Every page type — homepage, series landing, post, concept — outputs unstyled HTML with no layout constraints, no typography control, and no visual separation between navigation and body content. A reader arriving at a post gets raw browser-rendered text at full viewport width with default Times New Roman or equivalent.

This phase adds a minimal but deliberate reading layer: content width, spacing, typographic hierarchy, and navigation clarity. The goal is a site that is comfortable to read, not a site that has a brand identity.

---

## Current UI State

Inspection of `src/layouts/BaseLayout.astro`, `src/layouts/PostLayout.astro`, and all four page files confirms the following:

**Layouts**

- `BaseLayout.astro` — bare HTML shell: `<html lang="ko">`, `<head>` with charset and viewport meta, `<body>` with `<slot />` only. No CSS, no font loading, no layout container.
- `PostLayout.astro` — wraps `BaseLayout`. Outputs `<article>` > `<header>` (series link + order number, `<h1>`) > `<slot />` > `<nav>` (prev/next links). No styles applied at any point.

**Pages**

- `src/pages/index.astro` — `<main>` > `<h1>Posts</h1>` > per-series `<section>` with `<h2>` (series slug as link) > `<ul>` of post title links. Series names display as raw slugs (e.g., `database-internals`).
- `src/pages/series/[series].astro` — `<main>` > `<h1>` (series slug) > `<ol>` of post links. Same raw-slug display issue.
- `src/pages/posts/[slug].astro` — routes through `PostLayout`. No additional layout.
- `src/pages/concepts/[slug].astro` — `<article>` > `<header>` (`<h1>` title, "Also known as" aliases paragraph) > `<Content />`. No link back to the homepage or related posts. No layout wrapper beyond `BaseLayout`.

**Gaps visible from inspection**

- No global stylesheet or scoped styles exist anywhere in the project.
- Series names render as kebab-case slugs. D-23 defines a display name rule (Title Case, known acronyms uppercased) that is confirmed but not yet implemented.
- No site-level navigation element links between page types.
- The `<nav>` in `PostLayout` sits inline with post content with no visual separation.
- `docs/astro-bootstrap.md` lists only two routes (`/` and `/posts/[slug]`); it is now outdated — `/series/[series]` and `/concepts/[slug]` also exist.

---

## Design Goal for This Phase

Make every page type readable and navigable with the minimum visual intervention that achieves that goal. The implementation should:

1. Constrain content width to a readable line length on all page types.
2. Add vertical rhythm and spacing so heading hierarchy is visible.
3. Make navigation elements (series breadcrumb, prev/next, concept aliases) visually distinct from body content.
4. Apply consistent spacing and type sizing so the reader never has to fight the layout to follow the text.

This phase produces a usable reading site, not a polished product. Every decision here should be reversible or easily layered over.

---

## Non-Goals

The following are explicitly out of scope for this phase:

- Full branding redesign (logo, color palette, identity system)
- Dark mode
- Custom typeface licensing or brand font decisions
- Advanced motion or animation
- A component library or design token system
- Hover previews or popover concept cards
- Backlinks, "related posts", or wiki-style concept discovery UX
- Mobile-first responsive redesign beyond a readable baseline

---

## Page Roles

### Homepage (`/`)

The homepage lists all published posts grouped by series. Its job is to help a reader locate the right series and find a starting point within it.

**Reader task:** Orient quickly — what series exist, which posts are in each, where to start.

**Visual emphasis:** Series names should be prominent and clearly labeled as navigable groupings. Post titles within each group should be legible but subordinate to the series heading. The page should not feel like a flat dump — the grouping structure is meaningful.

**Open question — Series display names on homepage:** D-23 is confirmed (display name = Title Case from slug, known acronyms uppercased), but implementing this transformation requires either a compile-time utility or a runtime helper. This is a confirmed decision that needs implementation, not a design decision. It should be tracked as a separate implementation issue.

### Series Page (`/series/[series]`)

The series page shows all posts in a single series in reading order. Its job is to give a reader who arrives mid-series a full view of the arc and let them navigate to any post.

**Reader task:** Understand what the series covers end-to-end, jump to a specific post by position.

**Visual emphasis:** The series name as a clear heading. Posts listed in numbered order — the `<ol>` element is semantically correct; the numbering should be visually readable. The current ordered list markup is appropriate.

**Same open question** as homepage: series name should display as a formatted name, not a raw slug.

### Post Page (`/posts/[slug]`)

The post page is where the reader spends most of their time. It needs to be readable for long-form technical prose with headings, code blocks, and quiz sections.

**Reader task:** Read continuously, follow a technical explanation, reference examples, take the quiz.

**Visual emphasis:**
- The post title and series breadcrumb (series name + order) should orient the reader at the top without taking over.
- Body text should have a comfortable line length and font size for sustained reading.
- Headings within the post should clearly signal section transitions.
- The prev/next navigation at the bottom should be visible as a navigation element, not inline text.
- `<nav>` currently sits directly below `<slot />` content with no separation. In this phase it should at minimum have spacing and visual separation from the body.

### Concept Page (`/concepts/[slug]`)

The concept page is a short reference entry, not a long-form article. Its job is to provide a quick definition when a reader follows a `[[concept:...]]` link.

**Reader task:** Read a short definition, optionally follow aliases, return to the post they came from.

**Visual emphasis:**
- The title and alias line are the primary content — they should be clear and prominent.
- The body text (one to three sentences) should be readable but the page should not feel padded.
- There is currently no link back to the homepage or to the referencing post. Whether to add a "back" link or a link to home is an open question (see below).
- The "Also known as" aliases line should be visually subordinate to the title, not styled as body text.

**Open question — Concept page return navigation:** The current concept page has no link back to the homepage or to any referencing post. Options include: (a) a simple home link in the header, (b) no explicit back link (rely on browser back button), (c) a site-level nav visible on all pages. This requires explicit user confirmation before implementation.

---

## Shared Layout Principles

These principles apply across all page types unless a page-specific exception is noted above.

**Content width**

All readable content should be constrained to a maximum width that prevents overly long lines on wide viewports. A common target for prose is 60–75 characters per line. The exact value is an open question (see below), but any implementation must apply this constraint to all page types equally.

**Open question — Content width target:** The specific `max-width` value (e.g., `65ch`, `720px`, `42rem`) is not yet confirmed. Any value in the readable range is appropriate; the choice should be made explicitly rather than left to default.

**Page padding**

Body content should have horizontal padding on narrow viewports to avoid text touching screen edges. Vertical padding at the top of the page should provide breathing room before the first heading.

**Section spacing**

The visual gap between sections (heading-to-content, content-to-nav, series group to series group) should be consistent and larger than the gap between adjacent lines of the same section.

**Navigation vs. body separation**

The `<nav>` in `PostLayout` (prev/next links) and the series breadcrumb in `<header>` both live inside `<article>`. They should be visually distinct from body prose — through spacing, smaller type size, or both — so a reader does not mistake them for content.

---

## Typography Principles

**Heading hierarchy**

Each page has a single `<h1>`. The `PostLayout` header renders `<h1>` for the post title and the series breadcrumb above it in a `<p>`. Post body content uses `<h2>` and below for sections. This structure is correct and should be preserved. Heading sizes should descend clearly: `<h1>` noticeably larger than `<h2>`, `<h2>` noticeably larger than `<h3>`.

**Body text readability**

Body text should have a comfortable `line-height` (typically 1.5–1.7 for prose) and a readable `font-size`. The exact values are not confirmed (see open question on font stack below).

**Open question — Font stack:** Whether to use a system font stack or load a web font is not confirmed. System fonts (e.g., `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`) require no additional loading overhead and are a safe default. A web font choice requires a decision the user has not made. This document does not assume either; the implementation issue must confirm this first.

**Code blocks**

Posts contain code examples. Code blocks should use a monospace font, have a visually distinct background, and not wrap mid-token. The Astro build uses Shiki for syntax highlighting (confirmed in `astro.config.mjs`); this phase should not reconfigure the Shiki theme — only ensure code blocks have appropriate spacing and width handling within the constrained content column.

**Metadata and navigation text**

Series breadcrumb, post order, alias lines on concept pages, and prev/next labels are secondary text. They should be smaller or less visually heavy than body prose, but still clearly legible.

**List readability**

The homepage and series pages use `<ul>` and `<ol>` for post lists. List items should have sufficient vertical spacing to be scannable. The series page `<ol>` numbering should be visible and aligned.

**Concept alias presentation**

The "Also known as" line on concept pages is currently a plain `<p>`. It should be styled to read as metadata (subordinate to the title), not as body prose.

---

## Navigation Principles

**Series links**

Series names appear as links in three places: the homepage `<h2>`, the PostLayout breadcrumb, and the series landing page `<h1>`. All three should make it visually clear that the text is a series identifier, not just a heading. Raw slugs (e.g., `database-internals`) are acceptable for now; the D-23 display name transformation is a separate implementation item.

**Prev/next links**

`PostLayout` renders prev and next as plain `<a>` tags in a `<nav>` block at the bottom of the post. They should be visually separated from post body content and styled so the reader knows they are at a navigation boundary. Labels (`←` / `→`) are in place; no changes to the data or routing are needed — only styling and spacing.

**Concept links**

Inline `[[concept:...]]` links in post body text resolve to `/concepts/<slug>`. They should be visually distinguishable from normal post-to-post links. Whether this is done through color, underline style, or a subtle label is not confirmed.

**Open question — Concept link visual treatment:** Should inline concept links look identical to normal links, or have a distinct visual treatment (different color, icon, underline style)? This requires explicit user confirmation before implementation.

**Page-type clarity**

Currently there is no persistent site-level navigation (no `<header>` with a home link). Whether to add a minimal site header with a home link on all pages is an open question tied to the concept page return navigation question above.

---

## Implementation Boundaries

**Where styles should live**

The current codebase has no CSS files. For this phase, styles should be added in one of:
- A global stylesheet imported in `BaseLayout.astro` (affects all pages uniformly)
- Scoped `<style>` blocks in individual layout files where page-specific rules apply

A global stylesheet for shared rules (content width, body typography, base spacing) plus scoped styles for page-specific elements (post nav, concept aliases) is a reasonable split. The exact approach is not confirmed; the implementation issue should decide this.

**How far this phase should go**

This phase ends when every page type is readable at a comfortable line length with visible heading hierarchy and navigable prev/next links. It does not need to look polished — it needs to not be broken.

**What should not be refactored**

- The data and routing layer (`getStaticPaths`, content collections, wikilink conversion) — no changes needed for reading UI.
- The `PostLayout` prop interface (title, series, order, prev, next) — no changes needed.
- The content collection schemas — no changes needed.
- Frontmatter fields — no changes needed.

**What should remain simple**

Avoid introducing a CSS framework, a design token system, or a utility class library in this phase. Plain CSS is sufficient and keeps the diff reviewable. Build complexity should not grow for a styling pass.

---

## Acceptance Criteria for This Design Phase

The following can serve as a practical checklist when implementation issues are written:

- [ ] All page types render with content constrained to a readable maximum width
- [ ] Body text `line-height` and `font-size` are set explicitly (not browser defaults)
- [ ] Heading hierarchy (`h1` > `h2` > `h3`) is visually clear on post pages
- [ ] The post prev/next `<nav>` is visually separated from post body content
- [ ] The series breadcrumb in `PostLayout` is visually subordinate to the post title
- [ ] Series post lists (homepage and series page) are scannable without feeling dense
- [ ] Code blocks do not overflow the content column
- [ ] Concept page alias line is styled as metadata, not body prose
- [ ] All pages have adequate horizontal padding on narrow viewports (no text at screen edge)
- [ ] The four open questions listed in this document are explicitly resolved before implementation begins

---

## Follow-up Work (Later)

The following items are intentionally deferred from this phase:

- **D-23 display name transformation** — Implement the series slug → display name conversion (Title Case, acronym uppercasing) in the UI. Confirmed decision, not yet implemented. Separate implementation issue needed.
- **`docs/astro-bootstrap.md` route table update** — The route table in that document lists only `/` and `/posts/[slug]`. It should be updated to include `/series/[series]` and `/concepts/[slug]`. This is a Documentation Curator task, not a UI task.
- **Site-level navigation** — Whether to add a persistent `<header>` with a home link on all pages. Deferred pending user decision on concept page return navigation.
- **Concept link visual treatment** — Distinct styling for inline `[[concept:...]]` links vs. normal post links. Deferred.
- **Dark mode** — Out of scope for this phase entirely.
- **Responsive design beyond baseline** — A reading-width layout and viewport padding are sufficient for this phase. Full responsive design is later work.

---

## Open Questions Summary

All four questions resolved 2026-05-08 via AskUserQuestion (Issue #117). Decisions recorded as D-40–D-43 in `confirmed-decisions.md`.

| ID | Question | Decision | Decision ID |
|----|----------|----------|-------------|
| OQ-UI-1 | Content width target | `max-width: 65ch` | D-40 |
| OQ-UI-2 | Font stack | System font stack; no web font import | D-41 |
| OQ-UI-3 | Concept page return navigation | Site-level header on all pages (`BaseLayout.astro`) | D-42 |
| OQ-UI-4 | Concept link visual treatment | Identical to normal links; no distinct style | D-43 |

---

## Related Documents

- [`src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) — current HTML shell; no styles
- [`src/layouts/PostLayout.astro`](../src/layouts/PostLayout.astro) — post page structure with prev/next nav
- [`src/pages/index.astro`](../src/pages/index.astro) — homepage series grouping
- [`src/pages/series/[series].astro`](../src/pages/series/%5Bseries%5D.astro) — series landing page
- [`src/pages/posts/[slug].astro`](../src/pages/posts/%5Bslug%5D.astro) — post route
- [`src/pages/concepts/[slug].astro`](../src/pages/concepts/%5Bslug%5D.astro) — concept page
- [`docs/concept-authoring-workflow.md`](concept-authoring-workflow.md) — concept page authoring contract
- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-23 (series display names), D-17 (Astro), D-36 (URL structure)
- [`docs/astro-bootstrap.md`](astro-bootstrap.md) — build commands and content workflow
