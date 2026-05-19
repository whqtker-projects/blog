# Post Template

**Status:** Decided — updated on 2026-05-19.  
See `confirmed-decisions.md` D-6, D-7, D-26, D-27, D-28, D-29.

This document captures the confirmed post structure. For a fill-in-the-blank writing template, see [`docs/first-post-outline-template.md`](first-post-outline-template.md).

---

## Confirmed Structure

Every post should be organized with real Markdown headings. Titles and ordering are decided per post (D-26).

| Content area | Requirement | Notes |
|---|---|---|
| Definition-level explanation | Required (D-6) | What the topic is; accessible to beginners |
| Operational principles | Required (D-6) | How it works internally |
| Examples | Required (D-7) | Concrete support for the explanation; short snippets stay inline |
| Self-check or quiz | Optional (D-27) | Add only when it materially improves the post |

---

## Format Rules

| Rule | Decision |
|---|---|
| Section titles | Chosen per post — no fixed naming convention (D-26) |
| Section ordering | Flexible — ordered for the topic's flow (D-26) |
| Post length | No word count limit; determined by the topic (D-28) |
| Target audience | Beginner to practitioner for all series (D-29) |
| Outline structure | Use headings to express the working structure instead of a separate table-of-contents list |
| Quiz format | Optional; if included, use a format that suits the post (D-27) |

## Example Policy

- Short code snippets remain inside the post body.
- Project-style implementation examples may live as separate `examples` pages attached to the post.
- Separate example pages are optional; a post remains valid without them.
- Use a separate example page when the material needs project structure, multiple files, commands, tests, or outputs.

## Language Policy

- Post `title` is reader-facing display text and is intended to be written in Korean for new and editable backlog posts.
- Post body content is intended to be written in Korean.
- Exact code, CLI commands, API names, protocol names, and other technical identifiers may remain in their original form when needed.
- English filenames and slugs remain identifier-only fields and do not imply English rendered content.
- Optional self-check or quiz sections, when written, follow the same Korean writing policy unless another repository rule explicitly overrides it.

## Graph-Link Scope

- Generic `[[wikilinks]]` are reserved for post links.
- Series graph wiring is handled through series index bodies, not post bodies.
- When a series graph link is needed in authoring docs or examples, prefer actual Obsidian file links such as `[[series_indexes/<parent>]]` or `[[series_indexes/<parent>/<child>]]`.
- `[[series:<parent>]]` and `[[series:<parent>/<child>]]` remain converter-supported syntax, but they are not the default graph-wiring form in the vault.
- `[[concept:slug]]` is not supported.
- Post stubs remain valid without any leading `관련 링크:` block.
- `order` remains canonical for sequencing.

Minimal stub-safe pattern:

```md
## [Section title]

- [핵심 메모]
```

---

## What This Document Is Not

- Not a writing prompt or fill-in-the-blank template.
- Not a style guide.
- Not a content outline for any specific post.

Detailed post content is decided by the user personally. This document only records the structural constraints that apply to all posts.

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-6, D-7, D-26, D-27, D-28, D-29
- [`docs/decision-log.md`](decision-log.md) — DL-008 (Q-6, Q-7, Q-8, Q-9 decisions with alternatives)
- [`docs/first-post-outline-template.md`](first-post-outline-template.md) — reusable writing template
- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — resolved Q-6, Q-7, Q-8, Q-9 outcomes
