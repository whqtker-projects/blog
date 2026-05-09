# Post Metadata (Frontmatter) Structure

**Status:** Decided — 2026-05-07. See `confirmed-decisions.md` D-25 and `decision-log.md` DL-007.

This document defines the required frontmatter fields for every blog post.

---

## Required Fields

| Field | Type | Description |
|---|---|---|
| `title` | string | Display title of the post. For new and editable backlog posts, write it in Korean. Numeric prefixes such as `01. ...` are optional display aids only. |
| `series` | string (slug) | Series the post belongs to. Must match a confirmed series slug from `series-backlog.md`. |
| `order` | integer | Position of the post within its series. Starts at 1. |
| `status` | string | Post lifecycle stage. Required values: `idea`, `draft`, `published` (D-30, D-32). |

**Example:**

```yaml
---
title: "B+Tree 인덱스 구조"
series: database-internals
order: 1
status: draft
---
```

---

## Ordering Rule

`order` remains the structural source of truth for post ordering.

- Child series pages sort posts by `order` ascending.
- Post prev/next navigation is derived from `order` ascending.
- `title` is used only as a deterministic fallback when two posts compare equal by `order`.
- If a post title includes a numeric prefix such as `01. `, that prefix is a visible authoring/display aid only.
- When a numeric title prefix is present, repository validation requires it to match the post's explicit `order`.
- Post pages do not add a separate breadcrumb `#order` label on top of the visible title.

File naming is unchanged. Numeric title prefixes do not imply filename prefixes.

Language policy for posts:
- `title` is reader-facing display text, not an identifier field
- filenames and slugs remain English-only identifiers even when the post title and body are Korean
- post body content is intended to be written in Korean
- exact code, CLI commands, API names, and other technical identifiers may remain in their original form when needed
- already published posts may remain as-is until the user explicitly requests a title/body migration

---

## Domain Inference

Domain is not stored as a frontmatter field. It is inferred from `series` via the series-to-domain mapping defined in `series-backlog.md`. This keeps each post as the single source of truth — no risk of `domain` and `series` fields diverging.

**Mapping (series → domain slug):**

| Series slug | Domain slug |
|---|---|
| `database-foundations` | `backend-systems` |
| `data-modeling-and-design` | `backend-systems` |
| `relational-queries-and-joins` | `backend-systems` |
| `database-internals` | `backend-systems` |
| `distributed-systems` | `backend-systems` |
| `network-foundations` | `backend-systems` |
| `network-protocols` | `backend-systems` |
| `transport-and-reliability` | `backend-systems` |
| `internet-addressing-and-routing` | `backend-systems` |
| `backend-design` | `backend-systems` |
| `data-structures` | `cs-fundamentals` |
| `algorithms` | `cs-fundamentals` |
| `operating-systems-overview` | `cs-fundamentals` |
| `processes-and-threads` | `cs-fundamentals` |
| `scheduling-and-synchronization` | `cs-fundamentals` |
| `memory-management` | `cs-fundamentals` |
| `file-systems-and-storage` | `cs-fundamentals` |
| `computer-architecture` | `cs-fundamentals` |
| `computer-security` | `cs-fundamentals` |
| `llm-internals` | `ai-ml-llm` |
| `ml-fundamentals` | `ai-ml-llm` |
| `design-principles` | `software-engineering` |

---

## Additional Optional Fields

| Field | Type | Description |
|---|---|---|
| `description` | string | Optional summary used for metadata and previews when present. |

Optional fields other than `description` (for example `tags`) are not yet defined and must not be added until decided during Astro implementation (Issue #27 sub-issues).

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-25 (frontmatter schema)
- [`docs/decision-log.md`](decision-log.md) — DL-007 (decision context)
- [`docs/series-backlog.md`](series-backlog.md) — confirmed series slugs and domain mapping
