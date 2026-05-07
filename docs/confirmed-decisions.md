# Confirmed Decisions

This document is the stable reference for decisions that have been explicitly agreed upon.

**Rules for this document:**
- Add only confirmed decisions. Do not add proposals or guesses.
- Do not resolve any item from `open-questions.md` by assumption.
- When a new decision is confirmed, add it here and remove it from `open-questions.md`.
- For the full decision record with context and rationale, see `decision-log.md`.

**Last updated:** 2026-05-07

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

## Series Structure

| # | Decision |
|---|---|
| D-19 | Each topic domain contains multiple series. Domains and series are not 1:1. |
| D-20 | Each post belongs to exactly one series. Cross-series membership is not allowed. |
| D-21 | Confirmed series (12 total): **Backend/Systems** — `database-internals`, `distributed-systems`, `network-protocols`, `backend-design`; **CS Fundamentals** — `data-structures`, `algorithms`, `operating-systems`, `computer-architecture`, `computer-security`; **AI/ML/LLM** — `llm-internals`, `ml-fundamentals`; **Software Engineering** — `design-principles`. |
| D-22 | The first series to be written is `database-internals` (Backend/Systems domain). |

---

## Series Naming and Display

| # | Decision |
|---|---|
| D-23 | Series display names are derived from slugs by Title Case conversion. Hyphen-separated words are capitalized; known acronyms (LLM, ML, CS, API, HTTP, DNS, TLS, TCP, IP, CPU) are fully uppercased. Example: `llm-internals` → "LLM Internals", `database-internals` → "Database Internals". |
| D-24 | "Category" is not a separate concept. The blog hierarchy is **domain > series > post**. Domains serve as categories. Domain slugs: `backend-systems`, `cs-fundamentals`, `ai-ml-llm`, `software-engineering`. |

---

## Post Metadata

| # | Decision |
|---|---|
| D-25 | Post frontmatter has three required fields: `title` (string), `series` (series slug, string), `order` (integer, position within the series). Domain is inferred from `series` and is not a separate frontmatter field. |

---

## Post Format

| # | Decision |
|---|---|
| D-26 | Post section titles and ordering are flexible and decided per post. The required content areas (definition-level explanation, operational principles, examples — D-6, D-7) can appear in any order under any heading. The Quiz section must always be last (D-8). |
| D-27 | Each post ends with exactly 5 multiple-choice questions (MCQ). Each question has 4 answer options with one correct answer. |
| D-28 | There is no word count limit. Post length is determined by the topic's requirements — long enough to cover it fully, no longer. |
| D-29 | All series target the same audience: beginner to practitioner (D-9). No per-series audience segmentation. |

---

## Status Lifecycle

| # | Decision |
|---|---|
| D-30 | Post status vocabulary (5 values): `idea`, `outline`, `draft`, `review`, `published`. |
| D-31 | Published-post update policy: typo, link, and factual-error fixes keep `published` status. Section additions or substantial rewrites return the post to `draft`. |
| D-32 | `status` is an optional frontmatter field. No default value. Required fields remain `title`, `series`, `order` (D-25). |
| D-33 | Production build inclusion policy: a post is included if `status` is absent or equals `published`. A post is excluded if `status` is `idea`, `outline`, `draft`, or `review`. |

---

## Future Decisions

The following areas are not yet decided. See `open-questions.md` for the current status.

- No remaining pre-drafting planning decisions are open.

---

## Related documents

- [open-questions.md](open-questions.md) — unresolved planning items
- [decision-log.md](decision-log.md) — chronological record of how decisions were reached
- [decisions/ADR-001-project-foundations.md](decisions/ADR-001-project-foundations.md) — foundational decision record
