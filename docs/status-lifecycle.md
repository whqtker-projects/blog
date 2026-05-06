# Post Status Lifecycle

**Status:** Proposed — the lifecycle defined here is a working proposal, not a confirmed convention. The user confirms or revises it.  
**Last updated:** 2026-05-06

This document proposes a shared vocabulary for tracking how posts and planning documents move from idea to publication. A consistent status system makes it possible to see the state of the blog at a glance without reading individual files.

---

## Proposed Statuses

| Status | Meaning |
|---|---|
| `idea` | A topic or post concept has been noted but not yet structured |
| `outline` | The post has a defined scope, section headings, and key points — no prose yet |
| `draft` | Prose is being written; the post is not ready for review |
| `review` | The post is complete enough to evaluate for accuracy, clarity, and structure |
| `published` | The post is live on the blog |

These statuses are proposed. They are not final until confirmed.

---

## What Each Status Means in Practice

### `idea`

The post exists as a note or title only. No commitment to write it yet. Ideas can stay in the series backlog without advancing.

### `outline`

The post has a clear scope and structure. Key concepts, examples, and the quiz topic are decided. Writing has not started.

### `draft`

Active writing phase. The post may be incomplete, rough, or missing sections. Not for sharing externally.

### `review`

The post is self-consistent and complete. It is being checked for:
- Factual accuracy
- Clarity at the target audience level
- Coverage of definition-level and operational-principle-level content
- Quality of examples
- Quiz alignment with post content

### `published`

The post is live. Post-publication edits (corrections, updates) do not change the status back unless the content is substantially revised.

---

## How the Lifecycle Applies

### Obsidian Notes

Notes in the Obsidian vault carry a status in their frontmatter (proposed):

```yaml
---
status: draft
---
```

This makes the status visible inside Obsidian and searchable via Dataview or similar plugins.

### Blog Drafts

A blog draft is an Obsidian document at `draft` or `review` status that is being prepared for publication. It lives in the Obsidian vault until it is published.

### Published Posts

Once published, the post exists both in the Obsidian vault (as a source document) and on the blog (as the reader-facing artifact). The Obsidian copy remains the source of truth for edits.

### Planning Documents

Planning documents (this file, `open-questions.md`, ADRs, series backlog) use a different status vocabulary:

| Status | Meaning |
|---|---|
| `Active` | In use and being updated |
| `Proposed` | A working draft, not yet confirmed |
| `Resolved` | Decision made; document no longer changes |
| `Superseded` | Replaced by a newer document or decision |

---

## Next Step

The user confirms, revises, or extends this lifecycle. When confirmed, it will be noted in [`docs/decisions/`](decisions/) and the `Proposed` status on this document will change to `Active`.
