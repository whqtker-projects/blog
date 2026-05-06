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

## Related documents

- [confirmed-decisions.md](confirmed-decisions.md) — stable record of confirmed decisions
- [open-questions.md](open-questions.md) — unresolved planning items
