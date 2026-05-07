# First-Content Readiness

**Status:** Active — produced by Issue #30.  
**Last updated:** 2026-05-07

This document defines the artifacts and criteria needed to move from planning into active content creation. It covers the candidate post set for the first series, the process for starting a post, the drafting checklist, the quality bar for publication, and the pre-publication self-review checklist.

---

## Candidate Posts — `database-internals` Series

The first series is `database-internals` (D-22). The five candidate posts below cover its core topic areas: indexing structures, transaction guarantees, durability mechanisms, and query execution.

| Order | File name | Title |
|-------|-----------|-------|
| 1 | `what-is-a-database-index.md` | What Is a Database Index? |
| 2 | `b-plus-tree-index.md` | B+Tree Index Structure |
| 3 | `transaction-and-acid.md` | Transactions and ACID |
| 4 | `write-ahead-log.md` | Write-Ahead Log and Durability |
| 5 | `query-execution-plan.md` | Query Execution and the Optimizer |

Post 1 (`what-is-a-database-index.md`) exists as a committed sample fixture. Posts 2–5 are candidates to be written in order.

The author may adjust order, add topics, or split a post — this list is a starting point, not a commitment. Any changes to the confirmed candidate set should be reflected here.

---

## Starting a Post: `idea` → `outline` Process

### Step 1 — Create the file in the Obsidian vault

Create a new `.md` file in the Obsidian vault posts directory. File name must follow D-15/D-16: all-lowercase kebab-case, English only.

```
b-plus-tree-index.md
transaction-and-acid.md
write-ahead-log.md
```

### Step 2 — Write the frontmatter

Minimum required fields (D-25) plus status:

```yaml
---
title: "B+Tree Index Structure"
series: database-internals
order: 2
status: idea
---
```

A post in `idea` state needs only the frontmatter. No body content is required.

### Step 3 — Advance to `outline`

When ready to structure the post, add section headings and bullet-point notes under each. Do not write prose yet. Decide the quiz topic.

Change status to `outline`:

```yaml
status: outline
```

An `outline`-state post body looks like:

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

### Step 4 — Advance to `draft`

Begin writing prose. Change status to `draft`. The post does not need to be complete — draft means active writing is in progress.

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

A post is ready to move from `review` to `published` when all of the following are true:

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

This quality bar applies to the first post and to all subsequent posts. The bar does not lower for early posts.

---

## Pre-Publication Self-Review Checklist

Run through this checklist in a single sitting after completing the `draft → review` checklist in `docs/review-checklist.md`.

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
- [ ] All items in `docs/review-checklist.md` (Review → Published section) pass
- [ ] Change `status` to `published` in frontmatter
- [ ] Run conversion and build one final time before deploying

---

## Related Documents

- [`docs/post-template.md`](post-template.md) — confirmed post structure rules (D-6, D-7, D-8, D-26–D-28)
- [`docs/first-post-outline-template.md`](first-post-outline-template.md) — fill-in-the-blank Obsidian template
- [`docs/review-checklist.md`](review-checklist.md) — draft → review and review → published checklists
- [`docs/status-lifecycle.md`](status-lifecycle.md) — status vocabulary and update policy (D-30–D-33)
- [`docs/series-backlog.md`](series-backlog.md) — confirmed series list (D-21, D-22)
- [`docs/obsidian-conversion-contract.md`](obsidian-conversion-contract.md) — conversion script input contract
- [`docs/rendering-compatibility.md`](rendering-compatibility.md) — validated Markdown construct support
