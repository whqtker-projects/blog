# Post Metadata (Frontmatter) Structure

**Status:** Decided — 2026-05-07. See `confirmed-decisions.md` D-25 and `decision-log.md` DL-007.

This document defines the required frontmatter fields for every blog post.

---

## Required Fields

| Field | Type | Description |
|---|---|---|
| `title` | string | Display title of the post. Korean or English. |
| `series` | string (slug) | Series the post belongs to. Must match a confirmed series slug from `series-backlog.md`. |
| `order` | integer | Position of the post within its series. Starts at 1. |

**Example:**

```yaml
---
title: "B+Tree 인덱스 구조"
series: database-internals
order: 1
---
```

---

## Domain Inference

Domain is not stored as a frontmatter field. It is inferred from `series` via the series-to-domain mapping defined in `series-backlog.md`. This keeps each post as the single source of truth — no risk of `domain` and `series` fields diverging.

**Mapping (series → domain slug):**

| Series slug | Domain slug |
|---|---|
| `database-internals` | `backend-systems` |
| `distributed-systems` | `backend-systems` |
| `network-protocols` | `backend-systems` |
| `backend-design` | `backend-systems` |
| `data-structures` | `cs-fundamentals` |
| `algorithms` | `cs-fundamentals` |
| `operating-systems` | `cs-fundamentals` |
| `computer-architecture` | `cs-fundamentals` |
| `computer-security` | `cs-fundamentals` |
| `llm-internals` | `ai-ml-llm` |
| `ml-fundamentals` | `ai-ml-llm` |
| `design-principles` | `software-engineering` |

---

## Optional Fields (Not Yet Decided)

The following fields are candidates for future definition. They are not confirmed and must not be added to posts until decided:

- `description` — short summary for blog listing pages
- `draft` — boolean flag for unpublished posts
- `tags` — freeform topic tags

These will be addressed during Astro content collection implementation (Issue #27 sub-issues).

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-25 (frontmatter schema)
- [`docs/decision-log.md`](decision-log.md) — DL-007 (decision context)
- [`docs/series-backlog.md`](series-backlog.md) — confirmed series slugs and domain mapping
