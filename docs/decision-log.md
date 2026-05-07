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

## Related documents

- [confirmed-decisions.md](confirmed-decisions.md) — stable record of confirmed decisions
- [open-questions.md](open-questions.md) — unresolved planning items
