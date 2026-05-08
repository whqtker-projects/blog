# Decision Log

Chronological record of planning discussions and their outcomes.

**Rules for this document:**
- Append new entries below existing ones. Do not edit past entries.
- Each entry captures the context and reasoning, not just the outcome.
- Final decisions belong in `confirmed-decisions.md`. This log explains how they were reached.
- Open items that were not resolved in a discussion belong in `open-questions.md`.

---

## Entry Template

```
## DL-XXX — [Topic]

**Date:** YYYY-MM-DD
**Status:** confirmed | open | superseded

### Context
Why this topic came up. What problem or question prompted the discussion.

### Alternatives considered
What other approaches or answers were considered, and why they were set aside.

### Decision
What was agreed upon. Should match the corresponding entry in confirmed-decisions.md.

### Follow-up
Open questions or next steps that remain after this decision.

### References
- confirmed-decisions.md: D-XX
- open-questions.md: Q-XX (if applicable)
```

---

## DL-001 — Project foundations and blog direction

**Date:** 2026-05-06
**Status:** confirmed

### Context

Initial planning session for the Obsidian-based technical blog project. The session established the fundamental direction: what kind of content the blog produces, who it is for, how Obsidian and the blog relate to each other, and what the current work stage is.

### Alternatives considered

- **Troubleshooting-first format:** Rejected. The user's intent is concept explanation — readers should understand how things work, not just fix specific errors.
- **Separate writing environment:** Rejected. Maintaining Obsidian notes and a separate blog draft environment would create duplication. Obsidian is designated as the single source of truth.
- **Platform-first approach (decide publishing platform before structure):** Deferred. The document format (Obsidian Markdown) is fixed as a constraint; the external platform remains an open question.

### Decision

The following were confirmed (see `confirmed-decisions.md` for the stable record):

- Obsidian is the internal knowledge repository. The blog is the reader-facing artifact. Conversion is direct.
- The blog focuses on concept explanation at two depths: definition level and operational principles.
- Examples are included inside posts as much as possible. Each post ends with a quiz.
- Target audience: beginners to practitioners.
- Confirmed topic domains: CS fundamentals and algorithms, AI/ML/LLM, backend and systems, software engineering.
- The user decides detailed post content personally.
- Planning documents and structure come before article drafting.

### Follow-up

The following remain unresolved and are tracked in `open-questions.md`:

- Q-1: Publishing platform
- Q-2: Obsidian-to-blog conversion tooling
- Q-3: Series and category names within topic domains
- Q-4: Obsidian file naming conventions
- Q-5: Single vs. multiple domain membership per post
- Q-6: Exact post template structure and section names
- Q-7: Quiz count and format
- Q-8: Post length guidelines
- Q-9: Audience segmentation per series

### References

- `confirmed-decisions.md`: D-1 through D-14
- `open-questions.md`: Q-1 through Q-9
- `decisions/ADR-001-project-foundations.md`

---

## DL-002 — Obsidian file naming convention (Q-4)

**Date:** 2026-05-06  
**Status:** confirmed

### Context

File naming affects Obsidian wikilink resolution, filesystem search, and the Obsidian-to-blog URL conversion path. A consistent convention needs to be set before posts are created to avoid retroactive renaming across all internal links. Q-4 was prepared through a full agent-workflow pilot (see `docs/pilot-record.md`), which produced a tradeoff summary across five dimensions.

### Alternatives considered

- **Korean filenames:** Obsidian-compatible, but URL encoding behavior depends on the conversion tool (Q-1/Q-2 unresolved). Risk flagged as conditional; English chosen to remove the dependency.
- **snake_case:** Functional but less conventional for web URLs than kebab-case.
- **Title case:** Higher readability as filenames, but introduces case-sensitivity risk across OS environments (Linux vs. macOS). Rejected in favor of all-lowercase.
- **Series prefix (domain or numbered):** Domain prefix depends on Q-3 (series names not yet decided). Numbered prefix is structurally fragile when posts are inserted or reordered. Both deferred; no prefix chosen.
- **Date prefix:** Suits time-ordered content, but the blog produces evergreen concept posts (D-5, D-6). Adds noise without benefit.

### Decision

- File names use all-lowercase kebab-case. Example: `transformer-attention-mechanism.md`.
- File names are English only. Korean content goes in post titles and body text.
- No series prefix and no date prefix.

### Follow-up

- If a series prefix is desired in the future after Q-3 is resolved, the convention can be extended. This would require renaming existing files and updating all wikilinks — a non-trivial migration.
- Q-1/Q-2 (publishing platform and conversion tooling) remain open. The chosen convention (ASCII kebab-case) is safe regardless of platform.

### References

- `confirmed-decisions.md`: D-15, D-16
- `open-questions.md`: Q-4 (resolved)

---

## DL-003 — Publishing platform and conversion workflow (Q-1, Q-2)

**Date:** 2026-05-06  
**Status:** confirmed

### Context

Q-1 (publishing platform) and Q-2 (conversion tooling) were discussed together because they are coupled — the right conversion approach depends on the platform. The key confirmed constraints were: Obsidian Markdown source, local readability required (D-4), posts include code blocks, examples, and a quiz section (D-6, D-7, D-8), and the conversion path is direct Obsidian → blog (D-3).

### Alternatives considered

- **Obsidian Publish:** Wikilinks work natively, but limited layout control, subscription cost, and quiz rendering requires workarounds. Rejected.
- **Hosted platform (Ghost, Hashnode, dev.to):** Lower operational burden, but Obsidian Markdown compatibility varies and rendering control is limited. Rejected.
- **Hugo:** Fastest build times, but quiz section interactivity requires separate JS and lacks native component model. Not selected.
- **Manual conversion:** No tooling setup required, but impractical as post count grows. Rejected in favor of automated script.

### Decision

- **Q-1:** Astro is the static site generator. Content collections manage posts; MDX support enables quiz component implementation; code highlighting is built in.
- **Q-2:** Conversion is automated via a script that transforms Obsidian wikilinks to standard Markdown links before the Astro build step.

### Follow-up

- The specific conversion script design (language, trigger mechanism, wikilink edge cases) is not yet defined and will be addressed when implementation begins.
- Quiz component rendering approach in Astro (MDX component vs. plain HTML/JS) is not yet specified — Q-7 (quiz format) remains open.

### References

- `confirmed-decisions.md`: D-17, D-18
- `open-questions.md`: Q-1, Q-2 (both resolved)

---

## DL-004 — Series structure within topic domains (Q-3, Q-5)

**Date:** 2026-05-07
**Status:** confirmed

### Context

Q-3 (series/category names) and Q-5 (single vs. multiple domain membership) were addressed together as part of issue #24. The topic domains were already confirmed (D-10), but the internal series structure within each domain was not. A key structural question was whether each domain maps to a single series or multiple.

### Alternatives considered

- **One series per domain:** Simple navigation; risks combining unrelated topics (e.g., databases and distributed systems) into a single unnamed group. Rejected — does not scale as post count grows.
- **Multiple series per domain (chosen):** Each domain contains named series with a clear learning arc. More navigation structure upfront but cleaner separation of topics.
- **Cross-series membership (one post in multiple series):** Would allow posts like "CAP theorem" to appear in both `distributed-systems` and `database-internals`. Rejected — creates ambiguity in post ownership and ordering.

### Decision

- Each topic domain contains multiple series (D-19).
- Each post belongs to exactly one series (D-20).
- 12 series confirmed across 4 domains (D-21). See `confirmed-decisions.md` for full list.

### Follow-up

- Slug/naming policy for series identifiers is tracked in issue #33.
- Post metadata structure (how a post declares its series) is tracked in issue #34.
- Series-level descriptions, post ordering within each series, and navigation design remain to be defined during implementation.

### References

- `confirmed-decisions.md`: D-19, D-20, D-21
- `open-questions.md`: Q-3 (resolved), Q-5 (resolved)

---

## DL-005 — First series selection (database-internals)

**Date:** 2026-05-07
**Status:** confirmed

### Context

After the full 12-series list was confirmed, the starting series was selected to unblock drafting. The choice needed to reflect the user's current interest and the topic area with the clearest post scope.

### Alternatives considered

The 12 confirmed series were all candidates. The user selected `database-internals` (Backend/Systems domain) as the first series to write.

### Decision

- The first series is `database-internals` within the Backend/Systems domain (D-22).

### Follow-up

- The first series issue (#35) will define the series description, candidate post list, and ordering.
- Post drafting does not begin until Q-6, Q-7, Q-8 (template structure, quiz format, length guidelines) are resolved.

### References

- `confirmed-decisions.md`: D-22
- Issue #35 — first series setup

---

## DL-006 — Series slug/naming policy (#33)

**Date:** 2026-05-07
**Status:** confirmed

### Context

Once the 12 series were confirmed (D-21), the remaining question was how slugs translate into display names and whether "category" is a concept distinct from "domain". Both are needed before Astro content collection schemas and blog navigation can be built.

### Alternatives considered

- **Manual display name mapping:** Each series has an independently chosen display name stored in a mapping table. Maximum flexibility; requires maintaining a separate lookup. Rejected — the slugs are already descriptive enough that auto-derivation works for all 12 confirmed series.
- **Separate category layer:** A category concept above domain (e.g., "Computer Science" as category, "CS Fundamentals" as domain). Rejected — adds structural complexity without a clear use case given the current domain set.

### Decision

- Display names are auto-derived by Title Case conversion with acronym exceptions (D-23).
- Category = Domain. Hierarchy is domain > series > post. Domain slugs defined: `backend-systems`, `cs-fundamentals`, `ai-ml-llm`, `software-engineering` (D-24).

### Follow-up

- Acronym list (D-23) can be extended as new series slugs are added.
- Blog navigation design (how domains and series are surfaced in the UI) is not yet addressed and will be handled during Astro implementation.

### References

- `confirmed-decisions.md`: D-23, D-24
- Issue #33 (closed)

---

## DL-007 — Post metadata/frontmatter structure (#34)

**Date:** 2026-05-07
**Status:** confirmed

### Context

Posts need a machine-readable frontmatter schema for Astro content collections to index them by series and ordering. The key question was whether to store domain explicitly or infer it from series.

### Alternatives considered

- **series + domain both explicit:** More query-friendly; allows domain-level filtering without a lookup. Rejected — redundant with the series-to-domain mapping; risks inconsistency if the two fields diverge.
- **series only (chosen):** Domain inferred from series via a lookup table maintained in the codebase. Single source of truth per post; no redundancy.

### Decision

- Three required frontmatter fields: `title`, `series`, `order` (D-25).
- Domain is inferred from `series`, not stored as a separate field.

### Follow-up

- Optional fields (e.g., `description`, `draft`, `tags`) are not yet defined. They will be addressed when the Astro content collection schema is implemented (Issue #27 sub-issues).
- The full Astro schema (types, validation, default values) is an implementation concern — not a planning document concern.

### References

- `confirmed-decisions.md`: D-25
- Issue #34 (closed)

---

## DL-008 — Post format: section structure, quiz, length, audience (Q-6, Q-7, Q-8, Q-9)

**Date:** 2026-05-07
**Status:** confirmed

### Context

The four remaining open questions about post format were addressed together as part of issue #25. The confirmed content areas (definition, operational principles, examples, quiz) were already settled (D-6, D-7, D-8), but section titles, ordering, quiz details, length, and audience segmentation were not.

### Alternatives considered

**Q-6 (section structure):**
- Fixed order with standard English titles ("Definition" / "How It Works" / "Examples" / "Quiz"): Provides consistency but forces a rigid layout even when topic flow suggests a different order. Rejected.
- Fixed order with question-style titles ("What Is X?" / "How Does It Work?"): More reader-friendly tone but still inflexible. Rejected.
- Fixed order with per-post titles: Preserves sequence; titles customized. Rejected in favor of full flexibility.
- Flexible (chosen): Titles and ordering decided per post. Quiz remains last (D-8 constraint). Required content areas (D-6, D-7) must still be present.

**Q-7 (quiz):**
- 3 MCQ: Lighter; may not adequately cover the topic. Rejected.
- 3 MCQ + 2 short answer: Richer assessment; Astro rendering complexity increases for free-text input. Rejected.
- Per-post decision: No standard; inconsistent reader experience. Rejected.
- 5 MCQ (chosen): Consistent, self-contained, straightforward Astro component implementation.

**Q-8 (length):**
- Word count targets (1,500–2,500 or 2,500–4,000): Adds a metric to manage; can conflict with topic depth. Rejected.
- Per-section limits: More precise but complex to enforce and monitor. Rejected.
- Topic-driven, no limit (chosen): Length follows the topic's requirements. Consistent with the concept-first approach (D-5).

**Q-9 (audience):**
- Per-series segmentation: More targeted; requires defining and maintaining audience criteria per series. Rejected — the blog's overall audience (D-9) already spans beginner to practitioner.
- Uniform (chosen): All series target the same range. No additional audience management needed.

### Decision

- D-26: Flexible section titles and ordering; Quiz always last.
- D-27: 5 MCQ per post, 4 options each, one correct answer.
- D-28: No word count limit; length is topic-driven.
- D-29: All series target beginner-to-practitioner (same as D-9).

### Follow-up

- The Astro MCQ quiz component design (rendering, interaction) is an implementation concern tracked in Issue #28 sub-issues.
- A reusable first-post outline template is defined in `docs/first-post-outline-template.md` (Issue #43).

### References

- `confirmed-decisions.md`: D-26, D-27, D-28, D-29
- `open-questions.md`: Q-6, Q-7, Q-8, Q-9 (all resolved)
- Issue #25 (parent), #36, #37, #38, #39, #40, #41

---

## DL-009 — Post status lifecycle, update policy, and frontmatter usage (#26)

**Date:** 2026-05-07
**Status:** confirmed

### Context

`docs/status-lifecycle.md` was created as a proposal during initial planning. Before drafting begins, the status vocabulary, update policy, and frontmatter usage needed to be confirmed so that the Obsidian workflow is consistent from the first post.

### Alternatives considered

**Post status vocabulary:**
- Fewer stages (e.g., draft → published only): Too coarse — no distinction between work-in-progress and ready-to-review states. Rejected.
- More stages (e.g., adding `archived` or `deprecated`): Not needed for the current scale. Can be added later if required.
- Confirmed as proposed: idea / outline / draft / review / published.

**Published-post update policy:**
- All edits require review cycle: Adds overhead for minor corrections (typos, broken links). Rejected.
- No policy (ad hoc): Inconsistent behavior over time. Rejected.
- Corrections keep status; rewrites return to draft (chosen): Balances quality control with low overhead for small fixes.

**`status` frontmatter field:**
- Required field: Forces a decision on every post even when status tracking isn't needed. Rejected.
- Optional with no default (chosen): Low friction; status can be added when it provides value inside Obsidian.

### Decision

- D-30: Five post statuses confirmed (idea, outline, draft, review, published).
- D-31: Correction-type edits keep `published`; substantial rewrites return to `draft`.
- D-32: `status` is an optional frontmatter field.

### Follow-up

- The Obsidian-to-Astro build pipeline may filter posts by `status` (e.g., exclude `draft` posts). Implementation tracked in Issue #28 sub-issues.
- Review checklist formalized in `docs/review-checklist.md` (Issue #47).

### References

- `confirmed-decisions.md`: D-30, D-31, D-32
- `docs/status-lifecycle.md` — updated from Proposed to Active
- `docs/review-checklist.md` — new
- Issue #26 (parent), #44, #45, #46, #47, #48, #49

---

## DL-010 — Second series selection (network-protocols)

**Date:** 2026-05-08
**Status:** confirmed

### Context

`database-internals` is complete (five published posts). The next series needed to be selected from the 11 remaining confirmed series before drafting work could begin.

### Alternatives considered

- `distributed-systems` — natural follow-on to database-internals (consensus, replication), but higher prerequisite burden for beginners.
- `operating-systems` — strong CS fundamentals coverage, but further from the backend-focused content already established.
- `llm-internals` — high reader interest, but domain shift from systems content.

### Decision

`network-protocols` selected as the second series. It pairs naturally with `database-internals` in the Backend/Systems domain and covers foundational protocol knowledge (TCP, HTTP, DNS, TLS) that is prerequisite for many backend and distributed systems topics.

Decision recorded as D-39 in `confirmed-decisions.md`.

### Follow-up

- Candidate posts defined in `docs/first-content-readiness.md` (Issue #110)
- `idea`-state stubs committed to `src/content/posts/` (Issue #111)

### References

- `confirmed-decisions.md`: D-39
- `docs/series-backlog.md` — `network-protocols` marked In progress
- Issue #101, #109

---

## DL-011 — Reading UI design decisions (OQ-UI-1 through OQ-UI-4)

**Date:** 2026-05-08
**Status:** confirmed

### Context

The reading-focused UI phase (`docs/reading-ui-direction.md`) identified four design questions that could not be resolved by assumption. These were collected from the user via AskUserQuestion as Issue #117.

### Alternatives considered

- OQ-UI-1: `720px` (fixed pixel) and `48rem` (rem-based) were offered alongside `65ch`. `65ch` chosen for font-relative adaptability.
- OQ-UI-2: Google Fonts (Noto Sans KR) was the alternative. System font stack chosen to avoid external loading overhead.
- OQ-UI-3: Concept-page-only back link and browser-back reliance were alternatives. Site-level header on all pages chosen for consistent navigation across all page types.
- OQ-UI-4: Dashed underline and color-based distinction were offered. Identical styling chosen for simplicity.

### Decision

- D-40: `max-width: 65ch` for all page types.
- D-41: System font stack; no web font import.
- D-42: Site-level header (home link) added to `BaseLayout.astro`; visible on all pages.
- D-43: Concept links styled identically to normal links; no distinct visual treatment.

### Follow-up

- #118 (shared layout + typography) now unblocked — implements D-40, D-41, D-42.
- #119 (homepage/series), #120 (post/concept) now unblocked.
- #121 (polish) — OQ-UI-4 resolved as no-op; D-43 requires no additional implementation.

### References

- `confirmed-decisions.md`: D-40, D-41, D-42, D-43
- `docs/reading-ui-direction.md` — Open Questions Summary
- Issue #117, #122

---

## DL-012 — First deployment model decisions (#133)

**Date:** 2026-05-08
**Status:** confirmed

### Context

The Astro static site is code-complete and the content model is stable. Before configuring Vercel deployment (Issue #135) and writing deployment documentation (Issue #136), five deployment decisions remained unresolved. These were collected from the user via `AskUserQuestion` as part of Issue #133.

### Alternatives considered

**Project structure (single vs. two Vercel projects):**
- Two separate Vercel projects (`blog-prod` / `blog-staging`): Provides full environment isolation and independent env vars. Adds management overhead. Rejected — unnecessary complexity for a single-maintainer static site.
- Single project with branch-based routing (chosen): Aligns with Vercel's default model. `master` → production, `develop` → Preview Deployment. Lower setup cost.

**Deploy gate:**
- `pnpm build` only: Lightest gate. Misses content structural errors that `check:content` would catch. Not selected.
- `pnpm build` + `pnpm check:content`: Intermediate option. Does not run conversion script tests.
- Full CI pass via `ci.yml` (`pnpm build` + `pnpm test:convert`) (chosen): Consistent with existing CI contract. Only one check definition to maintain.

**CI scope (master-only vs. develop-inclusive):**
- `master`-only: Simpler initial config. But staging deployments would have no build verification beyond Vercel's own build step. Not selected.
- Both branches (chosen): Ensures consistent build verification before any deployment — production or staging.

**Custom domain:**
- In scope now: Would block deployment setup on DNS/domain availability. Not selected.
- Deferred (chosen): Deployment can be verified using the Vercel-assigned `*.vercel.app` URL first. Domain setup is a follow-on task.

### Decision

- D-44: Deployment platform: Vercel.
- D-45: Production branch `master`; staging branch `develop`.
- D-46: Single Vercel project; `master` → production, `develop` → Preview Deployment.
- D-47: Deploy gate: full CI pass (`pnpm build` + `pnpm test:convert`) required before merging to `master`.
- D-48: `ci.yml` extended to cover `develop` branch.
- D-49: Custom domain deferred; initial deployment uses `*.vercel.app`.

### Follow-up

- Issue #134: Create `develop` branch and extend `ci.yml`.
- Issue #135: Add `vercel.json` and configure Vercel project settings.
- Issue #136: Document the production/staging deployment workflow.

### References

- `confirmed-decisions.md`: D-44 through D-49
- Issue #133 (closed), #134, #135, #136, #137 (parent)

---

## DL-013 — Public-site quality and publication-workflow scope (#138)

**Date:** 2026-05-08
**Status:** confirmed

### Context

After the first deployment phase was complete, the next natural step was establishing a public-site quality baseline (discoverability, metadata) and sharpening the publication workflow (staging review, promotion criteria). Six scope decisions were collected from the user via `AskUserQuestion` as part of Issue #138.

### Alternatives considered

**Custom domain (D-49 → D-50):**
- Continue deferring: site remains on `*.vercel.app`. Simpler, but hinders discoverability and makes canonical URLs less stable.
- Proceed now (chosen): user confirmed `blog.whqtker.com` as the target domain. Allows stable canonical URLs in sitemap and meta tags from the start.

**description field (D-51):**
- Required for `published` posts: enforces consistency but adds friction to the publish workflow and requires schema + checklist changes.
- Optional with site-level fallback (chosen): lower friction; Google and social scrapers still receive a usable description via the fallback.

**OG/Twitter Card (D-52):**
- Defer to later: reduces scope now but means shared links lack preview cards.
- Add in this phase (chosen): once BaseLayout is being modified for canonical/description, OG tags are low marginal cost.

**RSS:**
- Not asked — deferred by default. No confirmed user need identified.

**Staging review (D-53):**
- Strict checklist (mobile, console errors, all links): high overhead for a solo maintainer.
- Lightweight checklist (chosen): covers the main rendering and interaction concerns without over-formalizing.

### Decision

- D-50: Custom domain `blog.whqtker.com`.
- D-51: `description` optional; site-level fallback in BaseLayout.
- D-52: OG + Twitter Card tags on all page templates.
- D-53: Lightweight staging checklist.

### Follow-up

- Issue #139: sitemap, robots.txt, meta baseline, OG tags
- Issue #140: Vercel custom domain + DNS configuration
- Issue #141: staging checklist and promotion criteria docs

### References

- `confirmed-decisions.md`: D-50 through D-53
- Issue #138 (closed), #139, #140, #141, #142 (parent)

---

## DL-014 — Explicit publish-only production visibility

**Date:** 2026-05-08
**Status:** confirmed

### Context

The repository had moved into active multi-stage content production. At that point, treating a missing `status` field as deployable created an avoidable ambiguity: an unfinished or newly added post could appear on the public site unless the author remembered to add a non-published status immediately.

### Alternatives considered

- Keep the existing rule (`status` absent or `published` → included): Lower friction, but too easy to expose incomplete content accidentally.
- Require `status: published` explicitly for deployment (chosen): Makes public visibility intentional and aligns deployed output with the documented review → publish workflow.

### Decision

- D-33 revised: only posts explicitly marked `status: published` are included in the production build.
- Posts with `status` absent are now excluded, the same as `idea`, `outline`, `draft`, and `review`.

### Follow-up

- Route-generation filters must use the explicit `published` check only.
- Lifecycle and review documents must state that omission is not a publish signal.
- Content validation should warn when committed posts omit `status`, because omission now always hides the post from production.

### References

- `confirmed-decisions.md`: D-33
- `docs/status-lifecycle.md`
- `docs/review-checklist.md`
- `docs/first-content-readiness.md`

---

## DL-015 — Simplified status model and environment-specific visibility (#143)

**Date:** 2026-05-08
**Status:** confirmed

### Context

After explicit publish-only production visibility was adopted, the repository still retained a five-stage authoring model in docs, schema, and content files. That level of detail was acceptable for a small handcrafted set of posts, but it added unnecessary state-management overhead for the next phase: large-scale intake of idea-stage content. Issue #143 was opened to resolve the remaining policy questions before implementation work changed routes, validation, and existing post frontmatter.

### Alternatives considered

**Status vocabulary:**
- Keep the five-stage model (`idea`, `outline`, `draft`, `review`, `published`): Preserves fine-grained workflow labels, but creates extra maintenance burden for bulk intake and requires more migration decisions for low-value distinctions.
- Reduce to `idea`, `draft`, `published` (chosen): Keeps the meaningful separation between backlog items, active work, and public content while removing two intermediate states that do not affect deployment visibility.

**Legacy `outline` / `review` mapping:**
- Preserve them as special-case legacy values during migration: Lowers immediate migration cost, but weakens the goal of simplification and prolongs mixed semantics.
- Map both to `draft` (chosen): Treats all in-progress authoring states as a single non-public working state.

**Staging visibility:**
- Make local development, staging, and production all show every post: Simplifies preview behavior, but weakens the staging environment as a public-site approximation.
- Make staging behave like local development while production stays stricter: Helps unpublished-content review, but splits non-production environments in a harder-to-reason-about way.
- Keep staging aligned with production while local development shows everything (chosen): Preserves local author convenience without changing the meaning of the develop Preview Deployment as a public-facing verification step.

**Missing `status`:**
- Warn only: Lower friction, but inconsistent with the goal of explicit state management for a larger repository.
- Treat as repository error (chosen): Forces intentional lifecycle assignment on every committed post and avoids silent ambiguity during bulk intake.

**First bulk batch scope:**
- Limit the first larger idea-stage batch to existing confirmed series only: Lower structural risk, but unnecessarily constrains backlog intake.
- Allow new series as long as the existing content model rules are followed (chosen): Supports broader intake without redesigning `posts`, `concepts`, or `series_indexes`.

### Decision

- D-30 revised: simplified status vocabulary is `idea`, `draft`, `published`.
- D-30 revised: legacy `outline` and `review` map to `draft`.
- D-32 revised: committed posts must set `status` explicitly; missing `status` is an error under the new model.
- D-33 revised: production excludes `idea` and `draft`; only explicit `published` is public.
- D-54: local development should show all posts regardless of status.
- D-55: Vercel Preview / staging should follow production visibility, not local-development visibility.
- D-56: the first bulk idea-stage batch may include new series, provided the existing series-index and content-model rules are satisfied.

### Follow-up

- Issue #144: implement environment-aware route and series-list visibility.
- Issue #145: migrate existing posts from `outline` / `review` to `draft`.
- Issue #146: update schema and repository validation so missing `status` fails and only the three simplified values remain.
- Issue #147: validate the model with a pilot batch before the first larger intake.
- Issue #148: add the first larger idea-stage batch under the new rules.

### References

- `confirmed-decisions.md`: D-30 through D-33, D-54 through D-56
- Issue #143
- `docs/status-lifecycle.md`
- `docs/review-checklist.md`
- `docs/first-content-readiness.md`
- `docs/deployment-workflow.md`

---

## Related documents

- [confirmed-decisions.md](confirmed-decisions.md) — stable record of confirmed decisions
- [open-questions.md](open-questions.md) — unresolved planning items
