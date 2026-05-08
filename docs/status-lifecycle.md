# Post Status Lifecycle

**Status:** Active — confirmed on 2026-05-09. See `confirmed-decisions.md` D-30, D-31, D-32, D-33, D-54, D-55 and `decision-log.md` DL-015.  
**Last updated:** 2026-05-09

This document defines the shared vocabulary for tracking how posts move from idea to publication. A consistent status system makes the state of the blog visible at a glance without reading individual files.

---

## Post Status Vocabulary

| Status | Meaning |
|---|---|
| `idea` | A topic or post concept has been noted but not yet structured |
| `draft` | The post is actively being developed. This includes both structured outlines and prose drafts that are not yet public |
| `published` | The post is live on the blog |

These three statuses are confirmed (D-30). `outline` and `review` are no longer separate status values; both map to `draft`.

---

## What Each Status Means in Practice

### `idea`

The post exists as a note or title only. No commitment to write it yet. Ideas can stay in the series backlog without advancing.

### `draft`

Active working state. A `draft` may be a bare outline, a partial prose draft, or a publication-ready post that is still under private review. `draft` is not reader-visible on staged or production builds.

### `published`

The post is live on the blog. See update policy below.

---

## Published-Post Update Policy

When a published post needs to be changed (D-31):

| Change type | Status after change |
|---|---|
| Typo or punctuation fix | `published` (no change) |
| Broken link fix | `published` (no change) |
| Factual error correction | `published` (no change) |
| Section addition or substantial rewrite | Return to `draft` |

Substantial rewrites go through the full review cycle again before republishing.

---

## `status` in Obsidian Frontmatter

`status` is required on every committed post (D-32). It must use one of the three confirmed values above.

```yaml
---
title: "B+Tree 인덱스 구조"
series: database-internals
order: 1
status: draft
---
```

The required frontmatter fields are `title`, `series`, `order`, and `status`. Missing `status` is a repository validation error.

---

## Production Build Behavior

The Astro production build uses `status` to determine which posts are included in the output (D-33):

| `status` value | Build behavior |
|---|---|
| `published` | Included in production build |
| `idea` | Excluded from production build |
| `draft` | Excluded from production build |

Only posts explicitly marked `published` are deployed. Local development shows all posts (D-54), but Vercel Preview / staging follows the same public visibility rule as production (D-55).

---

## Planning Document Status Vocabulary

Planning documents use a separate status vocabulary. They are not interchangeable with post statuses.

| Status | Meaning |
|---|---|
| `Active` | In use and being updated |
| `Proposed` | A working draft, not yet confirmed |
| `Resolved` | Decision made; document is a stable reference |
| `Superseded` | Replaced by a newer document or decision |

Post statuses (`idea`, `draft`, etc.) apply only to content files in the Obsidian vault. Planning document statuses appear in the header block of documents in `docs/`.

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-30 through D-33, D-54, D-55
- [`docs/decision-log.md`](decision-log.md) — DL-015
- [`docs/review-checklist.md`](review-checklist.md) — criteria for moving a post from in-progress draft to published
- [`docs/post-metadata.md`](post-metadata.md) — frontmatter field definitions
