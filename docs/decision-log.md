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

## Related documents

- [confirmed-decisions.md](confirmed-decisions.md) — stable record of confirmed decisions
- [open-questions.md](open-questions.md) — unresolved planning items
