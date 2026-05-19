# First-Content Readiness

**Status:** Active — produced by Issue #30.  
**Last updated:** 2026-05-16

This document defines the artifacts and criteria needed to move from planning into active content creation. It covers the candidate post set for the first series, the process for starting a post, the drafting checklist, the quality bar for publication, and the pre-publication self-review checklist.

Parent-level operating context now lives under `docs/series/`. Use those documents for current child-series composition, ordering, backlog posture, and next expansion points; use this document for readiness criteria and writing workflow.

Language-policy note:
- filenames and slugs remain English identifiers
- post titles and planned post bodies are intended to be Korean for new and editable backlog content
- backlog title synchronization happens per rollout; already published content is left unchanged unless a task explicitly targets it

Graph-link note:
- generic `[[wikilinks]]` are reserved for post links
- Obsidian graph links to series use `[[series_indexes/<parent>]]` or `[[series_indexes/<parent>/<child>]]`
- child series indexes may include ordered post wikilinks for Obsidian authoring visibility
- `[[concept:slug]]` is not supported
- post stubs remain valid without graph-link blocks
- `order` remains canonical for post sequencing

Example note:
- short explanatory snippets stay inside the post body
- short term definitions also stay inline inside the post body
- project-style implementation examples may later be added as separate example pages attached to a post
- a post remains valid without any attached example pages

Current operating documents:
- [`docs/series/database-systems.md`](series/database-systems.md)
- [`docs/series/computer-networks.md`](series/computer-networks.md)
- [`docs/series/data-structures-and-algorithms.md`](series/data-structures-and-algorithms.md)
- [`docs/series/computer-architecture.md`](series/computer-architecture.md)
- [`docs/series/operating-systems.md`](series/operating-systems.md)
- [`docs/series/spring-framework.md`](series/spring-framework.md)
- [`docs/series/spring-boot.md`](series/spring-boot.md)

---
## Current Status Posture

This document no longer maintains live backlog-status tables. Current post status is derived from frontmatter in `src/content/posts/`, and current series posture is described in the parent operating docs under `docs/series/`.

As of 2026-05-19, the repository contains 150 posts in total:
- 9 `published`
- 141 `draft`

The published posts are currently concentrated in two child series:
- `database-internals`: 4 published, 1 draft
- `spring-core`: 5 published

When the live status posture matters, treat `src/content/posts/` frontmatter as the source of truth and use the `docs/series/` files only as narrative operating summaries.

---

## Starting a Post: `idea` → `draft` Process

### Vault directory location

New post files are created inside the vault's dedicated posts directory — the same directory passed as `--input` to the conversion script. Keep all post `.md` files in this one flat directory; do not nest them in subdirectories.

Recommended vault layout:

```
<vault-root>/
  posts/            ← create new post files here
    what-is-a-database-index.md
    b-plus-tree-index.md       ← new file goes here
  attachments/      ← images and other assets referenced from posts
  templates/        ← Obsidian templates (not processed by the script)
```

### Step 1 — Create the file in the Obsidian vault

Create a new `.md` file in the vault `posts/` directory. File name must follow D-15/D-16: all-lowercase kebab-case, English only.

```
b-plus-tree-index.md
transaction-and-acid.md
write-ahead-log.md
```

### Step 2 — Write the minimum frontmatter for `idea` state

A post in `idea` state must set the required frontmatter. Frontmatter-only stubs or minimal-body notes remain valid. All three D-25 required fields must be set even at `idea` state, because the conversion script and Astro schema both require them.

```yaml
---
title: "B+Tree Index Structure"
series: database-internals
order: 2
status: idea
---
```

Recommended minimal body for an idea stub:

```md
아이디어 단계 메모.
```

Minimum fields at `idea` state:

| Field | Required | Value at `idea` state |
|-------|----------|-----------------------|
| `title` | Yes (D-25) | The intended post title |
| `series` | Yes (D-25) | Confirmed series slug (e.g., `database-internals`) |
| `order` | Yes (D-25) | Intended position in the series (integer) |
| `status` | Yes (D-32) | `idea` — marks the post as not yet written |

No other frontmatter fields are required at `idea` state. `status` must still be set explicitly even for early drafts so lifecycle and visibility remain unambiguous. Under D-33, only `status: published` is included in staged and production output, so `idea` posts stay off the public site.

### Step 3 — Advance to `draft`

When ready to work on the post, change status to `draft`. This single working state now covers both outline-only documents and prose drafts.

Change status to `draft`:

```yaml
status: draft
```

A `draft`-state post body may still be outline-only:

```markdown
## What B+Tree Is
- balanced tree; all values in leaf nodes
- internal nodes store keys only
- ...

## How It Works
- insert/delete: splits and rotations
- range query: leaf-level linked list
- ...

## Example
- concrete lookup trace: root → internal → leaf
- show key comparisons at each level

## Quiz
Topic: properties of B+Tree vs. binary search tree
```

Begin writing prose when ready. The post does not need to be complete — `draft` means active work is in progress, whether that work is structural or prose-level.

The conversion script (`pnpm convert`) is not needed during Obsidian writing. Run it before previewing with Astro.

---

## First-Post Drafting Checklist

Use this while writing a post in `draft` state. Each item maps to a confirmed decision.

### Required content areas (D-6, D-7, D-8)

- [ ] Definition-level explanation written — what the topic is; accessible without prior knowledge
- [ ] Operational principles written — how it works internally; not just surface behavior
- [ ] At least one concrete example included inline (not a link to an external resource)
- [ ] Quiz section present and placed last

### Quiz (D-27)

- [ ] Exactly 5 MCQ questions
- [ ] Each question has exactly 4 answer options
- [ ] Each question has exactly 1 correct answer
- [ ] Each answer includes a brief explanation inside `<details>`

### File and metadata (D-15, D-16, D-25)

- [ ] File name is all-lowercase kebab-case, English only
- [ ] `title`, `series`, `order` are set in frontmatter
- [ ] `series` value is `database-internals` (or another confirmed slug from `docs/series-backlog.md`)
- [ ] `order` is an integer that does not conflict with existing posts in the same series

### Writing quality (D-9, D-29)

- [ ] The definition-level section is readable without prior technical knowledge
- [ ] No unexplained jargon introduced without a definition nearby
- [ ] Examples are correct and directly illustrate the point they accompany

---

## Quality Bar — What "Good Enough to Publish" Means

A post is ready to move from `draft` to `published` when all of the following are true:

**Content**
- Every required content area (definition, operational principles, examples, quiz) is complete — no `[Write here]` placeholders or stubs remain.
- Technical claims are accurate to the best of the author's knowledge.
- The post covers the topic at the two required depths (definition-level and operational-principles-level) without significant gaps.

**Quiz**
- All 5 questions test concepts that appear in the post body. No quiz question tests a fact not covered in the post.
- All 4 answer options per question are plausible distractors or correct; no obviously throwaway options.
- Answer explanations are complete sentences — not just "correct" or "see above."

**Readability**
- Reading the post end-to-end as a reader (not as the author) produces no confusion about the main argument or sequence.
- The post would make sense to a reader who has not read any other post in the series.

**Format**
- The file name and frontmatter are valid (see drafting checklist above).
- The Obsidian-to-Astro conversion runs without errors on this file (`pnpm convert --strict`).
- `pnpm build` completes without errors after conversion.
- The post becomes reader-visible only after frontmatter is explicitly changed to `status: published`.

This quality bar applies to the first post and to all subsequent posts. The bar does not lower for early posts.

---

## Pre-Publication Self-Review Checklist

Run through this checklist in a single sitting after the `docs/review-checklist.md` draft-readiness items all pass.

### Read-through pass

- [ ] Read the entire post as a reader — start to finish, no editing
- [ ] The opening paragraph answers "what is this topic" for a reader who knows nothing about it
- [ ] The operational principles section explains the mechanism, not just the outcome
- [ ] The transition between sections is logical — the post does not jump without context
- [ ] The final paragraph before the quiz leaves the reader with a clear takeaway

### Quiz pass

- [ ] Each question is unambiguous — a careful reader knows exactly what is being asked
- [ ] The correct answer cannot be guessed by elimination alone (distractors are plausible)
- [ ] Answer explanations add information beyond restating the question

### Technical accuracy pass

- [ ] Every claim that could be fact-checked has been verified
- [ ] No overgeneralizations that would be misleading to a practitioner audience
- [ ] Code examples (if any) are correct and would run as written

### Rendering pass

- [ ] Run `pnpm convert --input <vault-dir> --strict` — no errors or unresolved wikilinks
- [ ] Run `pnpm build` — no build errors
- [ ] Check the rendered post at `/posts/<slug>`: code blocks highlighted, images load, quiz `<details>` toggle correctly

### Final gate

- [ ] All items in this checklist pass
- [ ] All items in `docs/review-checklist.md` pass
- [ ] Change `status` to `published` in frontmatter
- [ ] Run conversion and build one final time before deploying

---

## Related Documents

- [`docs/post-template.md`](post-template.md) — confirmed post structure rules (D-6, D-7, D-8, D-26–D-28)
- [`docs/first-post-outline-template.md`](first-post-outline-template.md) — fill-in-the-blank Obsidian template
- [`docs/review-checklist.md`](review-checklist.md) — draft-readiness and publish checks
- [`docs/status-lifecycle.md`](status-lifecycle.md) — status vocabulary and update policy (D-30–D-33)
- [`docs/series-backlog.md`](series-backlog.md) — confirmed series list (D-21, D-22)
- [`docs/obsidian-conversion-contract.md`](obsidian-conversion-contract.md) — conversion script input contract
- [`docs/rendering-compatibility.md`](rendering-compatibility.md) — validated Markdown construct support
