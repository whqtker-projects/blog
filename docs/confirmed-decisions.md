# Confirmed Decisions

This document is the stable reference for decisions that have been explicitly agreed upon.

**Rules for this document:**
- Add only confirmed decisions. Do not add proposals or guesses.
- Do not resolve any item from `open-questions.md` by assumption.
- When a new decision is confirmed, add it here and remove it from `open-questions.md`.
- For the full decision record with context and rationale, see `decision-log.md`.

**Last updated:** 2026-05-06

---

## System Design

| # | Decision |
|---|---|
| D-1 | Obsidian is the internal knowledge repository. All writing originates there. |
| D-2 | The blog is the reader-facing artifact derived from Obsidian documents. |
| D-3 | The conversion path from Obsidian to blog is direct. The document format is Obsidian Markdown. |
| D-4 | Local readability within Obsidian is a hard requirement for any publishing approach chosen later. |

---

## Content Direction

| # | Decision |
|---|---|
| D-5 | The blog focuses on concept explanation, not troubleshooting or step-by-step how-to content. |
| D-6 | Each post covers a topic at two depths: (1) definition-level explanation, (2) operational principles. |
| D-7 | Concrete examples must be included inside posts as much as possible. |
| D-8 | Each post ends with a quiz section. |

---

## Audience

| # | Decision |
|---|---|
| D-9 | The target audience ranges from beginners to practitioners. |

---

## Topic Domains

| # | Decision |
|---|---|
| D-10 | Confirmed topic domains: CS fundamentals and algorithms, AI/ML/LLM, backend and systems, software engineering. |

---

## Content Ownership

| # | Decision |
|---|---|
| D-12 | The user decides the detailed content of each post personally. |
| D-13 | Planning agents support documentation, structure, decision tracking, and planning workflows, but do not decide detailed post content on behalf of the user. |

---

## Current Stage

| # | Decision |
|---|---|
| D-14 | Planning documents, structure, and decision records must be established before article drafting begins. |

---

## File Naming

| # | Decision |
|---|---|
| D-15 | Obsidian file names use all-lowercase kebab-case with no prefix (no series prefix, no date prefix). Example: `transformer-attention-mechanism.md`. |
| D-16 | File names are English only. Korean content is expressed in post titles and body text, not in file names. |

---

## Publishing

| # | Decision |
|---|---|
| D-17 | The blog is published using Astro as the static site generator. |
| D-18 | The Obsidian → blog conversion is automated via a script that converts wikilinks to standard Markdown links before the Astro build step. |

---

## Future Decisions

The following areas are not yet decided. See `open-questions.md` for the full list.

- Series and category names within topic domains (Q-3)
- Series boundary rules — single vs. multiple domain membership (Q-5)
- Exact post template structure and section names (Q-6)
- Quiz count and format per post (Q-7)
- Post length guidelines (Q-8)
- Audience segmentation per series (Q-9)

---

## Related documents

- [open-questions.md](open-questions.md) — unresolved planning items
- [decision-log.md](decision-log.md) — chronological record of how decisions were reached
- [decisions/ADR-001-project-foundations.md](decisions/ADR-001-project-foundations.md) — foundational decision record
