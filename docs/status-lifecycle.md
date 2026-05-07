# Post Status Lifecycle

**Status:** Active — confirmed on 2026-05-07. See `confirmed-decisions.md` D-30, D-31, D-32 and `decision-log.md` DL-009.  
**Last updated:** 2026-05-07

This document defines the shared vocabulary for tracking how posts move from idea to publication. A consistent status system makes the state of the blog visible at a glance without reading individual files.

---

## Post Status Vocabulary

| Status | Meaning |
|---|---|
| `idea` | A topic or post concept has been noted but not yet structured |
| `outline` | The post has a defined scope, section headings, and key points — no prose yet |
| `draft` | Prose is being written; the post is not ready for review |
| `review` | The post is complete enough to evaluate for accuracy, clarity, and structure |
| `published` | The post is live on the blog |

These five statuses are confirmed (D-30). See `docs/review-checklist.md` for what "ready for review" means in practice.

---

## What Each Status Means in Practice

### `idea`

The post exists as a note or title only. No commitment to write it yet. Ideas can stay in the series backlog without advancing.

### `outline`

The post has a clear scope and structure. Key concepts, examples, and the quiz topic are decided. Writing has not started.

### `draft`

Active writing phase. The post may be incomplete, rough, or missing sections. Not for sharing externally.

### `review`

The post is self-consistent and complete. It is being checked against the criteria in `docs/review-checklist.md` before publication.

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

`status` is an optional frontmatter field (D-32). It is not required on every post. When present, it must use one of the five confirmed values above.

```yaml
---
title: "B+Tree 인덱스 구조"
series: database-internals
order: 1
status: draft
---
```

The required frontmatter fields remain `title`, `series`, and `order` (D-25). `status` is supplementary and primarily used to filter posts inside Obsidian (via Dataview or search).

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

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-30, D-31, D-32
- [`docs/decision-log.md`](decision-log.md) — DL-009
- [`docs/review-checklist.md`](review-checklist.md) — criteria for moving a post from `draft` to `review`
- [`docs/post-metadata.md`](post-metadata.md) — frontmatter field definitions
