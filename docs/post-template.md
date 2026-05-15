# Post Template

**Status:** Decided — all format details resolved on 2026-05-07.  
See `confirmed-decisions.md` D-6, D-7, D-8, D-26, D-27, D-28, D-29.

This document captures the confirmed post structure. For a fill-in-the-blank writing template, see [`docs/first-post-outline-template.md`](first-post-outline-template.md).

---

## Confirmed Structure

Every post must include the following content areas. Titles and ordering are decided per post (D-26).

| Content area | Requirement | Notes |
|---|---|---|
| Definition-level explanation | Required (D-6) | What the topic is; accessible to beginners |
| Operational principles | Required (D-6) | How it works internally |
| Examples | Required (D-7) | Concrete, inline — not external links or appendices |
| Quiz | Required, always last (D-8) | 5 MCQ, 4 options, 1 correct answer (D-27) |

---

## Format Rules

| Rule | Decision |
|---|---|
| Section titles | Chosen per post — no fixed naming convention (D-26) |
| Section ordering | Flexible — ordered for the topic's flow (D-26); Quiz always last |
| Post length | No word count limit; determined by the topic (D-28) |
| Target audience | Beginner to practitioner for all series (D-29) |
| Quiz format | 5 MCQ, 4 options each, one correct answer (D-27) |

## Language Policy

- Post `title` is reader-facing display text and is intended to be written in Korean for new and editable backlog posts.
- Post body content is intended to be written in Korean.
- Exact code, CLI commands, API names, protocol names, and other technical identifiers may remain in their original form when needed.
- English filenames and slugs remain identifier-only fields and do not imply English rendered content.
- Quiz sections, when later written, follow the same Korean writing policy unless another repository rule explicitly overrides it.

## Graph-Link Scope

- Generic `[[wikilinks]]` are reserved for post links.
- Use `[[concept:slug]]` for concept links.
- Series graph wiring is handled through series index bodies, not post bodies.
- When a series graph link is needed in authoring docs or examples, prefer actual Obsidian file links such as `[[series_indexes/<parent>]]` or `[[series_indexes/<parent>/<child>]]`.
- `[[series:<parent>]]` and `[[series:<parent>/<child>]]` remain converter-supported syntax, but they are not the default graph-wiring form in the vault.
- Post stubs remain valid without any leading `관련 링크:` block.
- `order` remains canonical for sequencing.

Minimal stub-safe pattern:

```md
아이디어 단계 메모.
```

---

## What This Document Is Not

- Not a writing prompt or fill-in-the-blank template.
- Not a style guide.
- Not a content outline for any specific post.

Detailed post content is decided by the user personally. This document only records the structural constraints that apply to all posts.

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-6, D-7, D-8, D-26, D-27, D-28, D-29
- [`docs/decision-log.md`](decision-log.md) — DL-008 (Q-6, Q-7, Q-8, Q-9 decisions with alternatives)
- [`docs/first-post-outline-template.md`](first-post-outline-template.md) — reusable writing template
- [`docs/open-questions.md`](open-questions.md) — Q-6, Q-7, Q-8, Q-9 (all resolved)
