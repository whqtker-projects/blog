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

## DL-016 — Hierarchical series architecture policy (#151)

**Date:** 2026-05-09
**Status:** confirmed

### Context

The current implementation is flat-series-first: posts belong directly to one `series`, and `series_indexes` define which `/series/<slug>` pages exist. The homepage lists all `series_indexes` documents flat. Before migrating to a two-level parent-child model, five structural policy questions needed explicit answers to unblock schema, routing, validation, and migration work.

### Alternatives considered

**Content type for parent vs. child series:**
- New `parent_series` content type separate from `series_indexes`: Cleaner type separation, but adds schema maintenance overhead and requires additional routing logic. Rejected.
- Extend existing `series_indexes` with a `parent` field (chosen): One content type handles both levels. Parent series omit `parent`; child series carry it. Lower structural change; existing tooling continues to work.

**URL structure:**
- `/series/<child-slug>` (flat URLs preserved): Child series keep existing short URLs; parent series get new `/series/<parent-slug>` pages. No URL migration for existing content, but hierarchy is invisible in the URL. Rejected.
- `/series/<parent-slug>/<child-slug>` (chosen): URL reflects the hierarchy. Easier for readers and crawlers to infer structure. Existing flat URLs are not preserved after migration — intentional given the site is not yet widely indexed.

**Homepage content:**
- Parent + grouped child structure (parent header with child list indented below): Gives full overview on one page; complexity grows as series expand. Rejected.
- Parent series only (chosen): Homepage stays simple and stable. Child series are discovered through their parent's page.

**network-protocols slug during migration:**
- Replace slug with a new slug under a broader parent (e.g., `computer-networks`): More semantically accurate parent grouping, but requires renaming an already-used slug and updating all post frontmatter. Rejected.
- Retain `network-protocols` slug as-is (chosen): No frontmatter migration required for existing posts. The slug remains the child-series identifier. No redirect added for the old flat URL — the site is pre-indexing at migration time.

### Decision

- D-57: Extend `series_indexes` with an optional `parent` field; no new content type.
- D-58: Two-level URL scheme — `/series/<parent-slug>` and `/series/<parent-slug>/<child-slug>`.
- D-59: Homepage lists parent series only.
- D-60: Existing flat series slugs become child series slugs unchanged; no redirects from old flat URLs.

### Follow-up

- Schema migration: add `parent` field (optional string) to `series_indexes` in `src/content.config.ts`.
- Routing: create `/series/[parent].astro` (parent page) and `/series/[parent]/[child].astro` (child page); retire flat `/series/[series].astro`.
- Validation: update `scripts/check-content.mjs` to enforce that `post.series` matches a child `series_indexes` slug, and that every child slug has a corresponding parent.
- Migration: add `parent` field to existing `series_indexes` documents (`network-protocols`, `data-structures`, `database-internals`) once a parent series for each is created.
- Homepage: update `src/pages/index.astro` to list only parent `series_indexes` documents (those without `parent`).

### References

- `confirmed-decisions.md`: D-57 through D-60
- Issue #151 (closed after this entry)
- `docs/content-model.md` — will need updating after schema/routing changes land

---

## DL-017 — Parent-child series information architecture (#152)

**Date:** 2026-05-09
**Status:** confirmed

### Context

Issue #151 resolved the structural policy needed to start the hierarchical-series migration: one `series_indexes` content type, two URL levels, parent-only homepage entries, and preserved child slugs. Issue #152 needed to turn those structural answers into an IA contract that later schema, routing, validation, and migration issues can implement without making up page responsibilities case by case.

The current repository still behaves like a flat series system:
- `src/pages/index.astro` lists every `series_indexes` document as a homepage entry.
- `src/pages/series/[series].astro` treats every series slug as a terminal listing page that directly owns posts.
- `docs/content-model.md` and `docs/astro-bootstrap.md` still describe posts as belonging directly to one flat series.

That makes the missing IA distinctions explicit work, not implied implementation detail.

### Alternatives considered

**Parent page behavior:**
- Parent page renders all descendant posts in one combined list: gives a broad overview, but collapses the distinction between parent and child series and makes the child layer feel redundant. Rejected.
- Parent page lists child series only (chosen): preserves the hierarchy and gives each child series its own terminal ordered post listing.

**Post attachment point:**
- Allow posts to attach to either parent or child series: flexible, but weakens validation and creates ambiguity for ordering, breadcrumbs, and navigation. Rejected.
- Restrict posts to child series only (chosen): keeps one terminal ownership layer for ordered content.

**Homepage discovery model:**
- Continue listing every child series directly on the homepage: simpler migration, but keeps the old flat browsing model visible at the top level. Rejected.
- List parent series only, with child discovery on the parent page (chosen): matches the intended two-level IA cleanly.

### Decision

- D-61: a parent series is a navigation and IA container for child series; it may have metadata and its own page, but it does not own posts directly.
- D-62: a child series belongs to exactly one parent series and is the terminal ordered content container; posts attach to child series only.
- D-63: the parent page introduces the parent direction and lists its child series; it does not flatten descendant posts into one mixed list.
- D-64: the child page lists visible posts in that child series and provides the series context used by post navigation and breadcrumbs.

### Follow-up

- Issue #153 should encode these parent/child roles in the `series_indexes` schema shape.
- Issue #154 should replace the flat homepage and flat `/series/[series]` behavior with separate parent and child page responsibilities.
- Issue #155 should enforce that posts cannot attach directly to parent series.
- Issue #156 should map existing flat series into explicit parent and child roles without leaving ambiguous ownership behind.

### References

- `confirmed-decisions.md`: D-61 through D-64
- Issue #152
- Issue #151
- `docs/content-model.md`
- `docs/astro-bootstrap.md`
- `src/pages/index.astro`
- `src/pages/series/[series].astro`

---

## DL-018 — Computer Networks child-series backlog breakdown (#157)

**Date:** 2026-05-09
**Status:** confirmed

### Context

Once the repository adopted a real parent-child hierarchy, the old `network-protocols` flat backlog became too broad to remain the only child series under `computer-networks`. The committed backlog mixed application/web protocols, transport reliability topics, and naming/addressing topics in one ordered list. Issue `#157` existed to turn that flat set into a reviewable child-series-based backlog without reopening status or deployment policy.

### Alternatives considered

**Keep all current backlog items in `network-protocols` only:**
- Lowest migration cost, but leaves the new `computer-networks` parent with only one overloaded child series and does not create a meaningful child-series breakdown. Rejected.

**Replace `network-protocols` entirely with new child slugs:**
- Cleaner topical split on paper, but violates the confirmed migration rule that the existing `network-protocols` slug should be retained as a child series during transition. Rejected.

**Retain `network-protocols` and add sibling child series (chosen):**
- Preserves the confirmed slug while still separating the backlog into coherent units. Existing posts can be moved only where the topical split is strong enough, and additional idea-stage files can be added sparingly to avoid one-post dead ends.

### Decision

- D-65: `computer-networks` is currently split into three child series: `network-protocols`, `transport-and-reliability`, and `naming-and-routing`.
- D-66: `network-protocols` is retained as the application/web-protocol child series. `what-is-http`, `tls-and-https`, and `http2-and-http3` stay there. `tcp-connection-and-reliability` moves to `transport-and-reliability`. `dns-resolution` moves to `naming-and-routing`.
- D-67: the original 12-series flat inventory remains a historical baseline, but active child-series inventory can expand when a parent direction is rebuilt into multiple child series.
- Added minimal idea-stage backlog files only where needed to make the new sibling series coherent: `udp-and-quic.md` and `ip-addressing-and-routing.md`.

### Follow-up

- Issue `#158` should update active docs so they describe the split `computer-networks` backlog accurately.
- Future content work can grow each child series independently without reopening the parent-child routing or validation model.

### References

- `confirmed-decisions.md`: D-65, D-66
- Issue `#157`
- `src/content/series_indexes/computer-networks.md`
- `src/content/series_indexes/network-protocols.md`
- `src/content/series_indexes/transport-and-reliability.md`
- `src/content/series_indexes/naming-and-routing.md`
- `src/content/posts/what-is-http.md`
- `src/content/posts/tcp-connection-and-reliability.md`
- `src/content/posts/dns-resolution.md`

---

## DL-017 — Child-series ordering and post title-prefix policy (#161)

**Date:** 2026-05-09
**Status:** confirmed

### Context

Child series currently have no explicit `order` field — `src/utils/series-hierarchy.ts` sorts them by `title`. Posts already carry `order`. Before adding an `order` field to child series and deciding whether post titles may include numeric prefixes (e.g. `01. TCP란 무엇인가`), four policy edges needed explicit answers: prefix scope, rendering behavior, migration approach for child-series `order`, and rollout breadth.

### Alternatives considered

**Post title prefix scope:**
- Selectively required for some series (e.g. computer-architecture only): Inconsistency across series; introduces per-series authoring rules that are harder to document and enforce. Rejected.
- Eventually required everywhere: Forces a global convention that may not suit all series styles. Rejected.
- Globally optional (chosen): Authors choose per series whether prefixes add value. No enforcement added to validation; `order` remains the structural source of truth regardless of prefix presence.

**Rendering behavior:**
- Strip prefixes at build time: Keeps source readable while hiding ordinal numbers from readers. Adds a string-processing step to the build and requires a stable prefix format convention to parse reliably. Rejected.
- Render as-is (chosen): No build-time transformation needed. What is in the source file title is what readers see. Simpler build pipeline; authors are responsible for prefix presentation.

**Child-series `order` migration approach:**
- Staged migration (optional first, then required): Lower immediate migration cost, but prolongs a period where some child series have `order` and others do not, making sort behavior inconsistent. Rejected.
- Immediately required for all (chosen): One-time update across all child series indexes; consistent validation from day one; no ambiguous mixed state.

**Rollout breadth:**
- computer-architecture only as pilot: Allows verification before touching other series. Rejected — child-series count is small enough that simultaneous update is low risk and avoids a second migration pass.
- All parent series simultaneously (chosen): Updates all child series indexes in one phase; validation catches any missing `order` fields immediately.

### Decision

- D-68: Numeric post title prefixes are globally optional. No validation enforces or forbids them.
- D-69: Prefixes render as-is in public HTML; no stripping at build time.
- D-70: Child-series `order` is immediately required for all existing child series; missing `order` is a validation error.
- D-71: First rollout covers all parent series simultaneously.

### Follow-up

- Add `order: z.number()` to the `series_indexes` schema in `src/content.config.ts`.
- Update `src/utils/series-hierarchy.ts` to sort child series by `order` instead of `title`.
- Update `scripts/check-content.mjs` to validate child-series `order` presence and uniqueness per parent.
- Add `order` to all existing child series index files under `src/content/series_indexes/`.
- Update `docs/series-index-authoring.md` and `docs/post-metadata.md` to document the prefix optionality and child-series `order` requirement.

### References

- `confirmed-decisions.md`: D-68 through D-71
- Issue #161 (closed after this entry)

---

## DL-018 — Reader-facing numbering presentation policy (#169)

**Date:** 2026-05-09
**Status:** confirmed

### Context

After the hierarchy and ordering rollout, `order` drives both child-series and post sort order. The remaining open question was how that structural ordering should surface to readers. `computer-architecture` already has numeric post title prefixes; `PostLayout.astro` renders `#order` in the breadcrumb. Three distinct presentation surfaces needed explicit policy: the parent page child-series list, the child page post title list, and the post page breadcrumb.

### Alternatives considered

**Parent page child-series numbering:**
- Show `1. 2. 3.` labels alongside child series titles: Makes the ordering visible at a glance, but adds decoration that may feel mechanical and clutters the navigation layer whose purpose is discovery, not enumeration. Rejected.
- No visible numbering, sort only (chosen): Readers see a clean title-and-description list in the correct order. The structural `order` field is the source of truth without surfacing as a displayed number.

**Child page post title rendering:**
- Strip numeric prefixes from the listing view, keep them on the post page title: Reduces visual noise in the listing, but creates an inconsistency between the list view and the post heading the reader sees after clicking. Rejected.
- Render as-is (chosen): What is in the source is what appears in the list. Consistent with D-69. Authors who add `01.` prefixes see them displayed; those who omit them see no prefix.

**Post page breadcrumb `#order`:**
- Keep `#order` alongside prefix: Two numbering cues on the same page. The breadcrumb shows `#1` and the heading shows `01.` — redundant and visually noisy. Rejected.
- Remove `#order` (chosen): When a post title already carries a numeric prefix, the breadcrumb shows only the series path and post title. No ordinal indicator in the breadcrumb.

### Decision

- D-72: Parent pages show child series sorted by `order`, no visible numeric label.
- D-73: Child pages render post titles exactly as in source; no stripping.
- D-74: Post page breadcrumbs omit `#order`; breadcrumb shows series path and title only.

### Follow-up

- Remove `#{order}` from `src/layouts/PostLayout.astro` breadcrumb template.
- Verify `src/pages/series/[parent].astro` does not add numbering to child series list items (currently does not — no change needed).
- Update `docs/reading-ui-direction.md` if it references breadcrumb numbering.

### References

- `confirmed-decisions.md`: D-72 through D-74
- Issue #169 (closed after this entry)
- `src/layouts/PostLayout.astro` — breadcrumb line to remove

---

## DL-019 — Refine the `computer-networks` parent around a university-style course flow

**Date:** 2026-05-09
**Status:** confirmed

### Context

After the first `computer-networks` split, the parent was more coherent than the original flat `network-protocols` backlog, but inspection still showed a strong backend/web bias. The committed child series were:
- `network-protocols` for HTTP/TLS/HTTP2+/application protocols
- `transport-and-reliability` for TCP/UDP/QUIC
- `naming-and-routing` for DNS and IP/routing

That structure worked for the initial migration, but a university-style networking outline made two gaps obvious:
- there was no explicit foundations child series for overview, layering, encapsulation, and basic networking technology
- `naming-and-routing` was too broad for the internet-layer topics that should eventually include subnetting, ARP, ICMP, NAT, fragmentation, and routing protocols

The refinement needed to stay repository-aware. Existing `draft` work such as `what-is-http.md` and `tcp-connection-and-reliability.md` should not be discarded or buried under a textbook-perfect redesign.

### Alternatives considered

**Keep the current three-child breakdown unchanged:**
- Lowest migration cost, but leaves the parent without a true entry layer and keeps too much internet-layer scope compressed into one child. Rejected.

**Rebuild the parent into many narrow textbook children immediately:**
- More academically pure, but creates too much churn for a repository that already has active draft work and explicitly discourages adding broad new child series too early. Rejected.

**Add one foundations child and refine the routing/addressing child (chosen):**
- Preserves the current practical work, fills the missing introductory layer, and makes the internet-layer backlog specific enough to become real post stubs. Chosen.

### Decision

- D-75: `computer-networks` now uses four child series: `network-foundations`, `transport-and-reliability`, `internet-addressing-and-routing`, and `network-protocols`.
- D-76: `network-protocols` keeps DNS + HTTP/TLS/HTTP2+/application protocol scope, while `internet-addressing-and-routing` owns IP addressing, subnetting, ARP, ICMP, NAT, fragmentation, and routing protocols.

### Follow-up

- Update the actual child index files and post frontmatter to match the refined structure.
- Split the old `ip-addressing-and-routing.md` idea stub into narrower idea-stage posts.
- Keep future expansion conservative; this refinement is meant to improve the learning arc without reopening the whole hierarchy model.

### References

- `confirmed-decisions.md`: D-75, D-76
- `docs/series/computer-networks.md`
- `docs/series-backlog.md`
- `docs/first-content-readiness.md`
- `src/content/series_indexes/computer-networks/`
- `src/content/posts/what-is-http.md`
- `src/content/posts/tcp-connection-and-reliability.md`

---

## DL-020 — Refine the `database-systems` parent around a university-style database course flow

**Date:** 2026-05-09
**Status:** confirmed

### Context

Inspection showed that `database-systems` was structurally much narrower than the parent name implied. The parent had only one child series, `database-internals`, and that child already contained five published posts covering indexes, B+Tree, transactions, WAL, and the optimizer. The current structure worked well as a backend/systems reading track, but it did not expose the earlier database-learning layers that a university-style database outline would usually cover first: database vocabulary, ERD, normalization, relational design, and join semantics.

Because `database-internals` is already the repository's most mature published child series, the refinement needed to preserve it as a stable anchor instead of carelessly splitting or renaming it.

### Alternatives considered

**Leave `database-systems` unchanged with only `database-internals`:**
- Lowest churn, but leaves the parent unable to express database foundations or relational design topics cleanly. Rejected.

**Split `database-internals` itself into multiple smaller internals children:**
- More textbook-like on paper, but would create unnecessary churn in a stable published series and would move existing public content without strong repository justification. Rejected.

**Keep `database-internals` intact and add sibling children before it (chosen):**
- Preserves the stable published anchor while adding the missing learning arc for foundations, modeling, and query semantics. Chosen.

### Decision

- D-77: `database-systems` now uses four child series: `database-foundations`, `data-modeling-and-design`, `relational-queries-and-joins`, and `database-internals`.
- D-78: `database-internals` remains the stable published anchor. Indexes, B+Tree, WAL, optimizer behavior, join algorithms, and deeper engine internals stay there.

### Follow-up

- Add child index files under `src/content/series_indexes/database-systems/` for the three new sibling series.
- Create idea-stage backlog files for foundations, modeling/design, and relational query semantics.
- Keep the published `database-internals` posts unchanged while allowing future internals growth behind the new pre-internals layers.

### References

- `confirmed-decisions.md`: D-77, D-78
- `docs/series/database-systems.md`
- `docs/series-backlog.md`
- `docs/first-content-readiness.md`
- `src/content/series_indexes/database-systems/`
- `src/content/posts/what-is-a-database-index.md`
- `src/content/posts/query-execution-plan.md`

---

## Related documents

- [confirmed-decisions.md](confirmed-decisions.md) — stable record of confirmed decisions
- [open-questions.md](open-questions.md) — unresolved planning items
