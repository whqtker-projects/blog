# First-Content Readiness

**Status:** Active — produced by Issue #30.  
**Last updated:** 2026-05-09

This document defines the artifacts and criteria needed to move from planning into active content creation. It covers the candidate post set for the first series, the process for starting a post, the drafting checklist, the quality bar for publication, and the pre-publication self-review checklist.

---

## Candidate Posts — `database-internals` Child Series

The first series is `database-internals` (D-22). Under the current hierarchy model, it is now a child series under the parent `database-systems`. The five candidate posts below cover its core topic areas: indexing structures, transaction guarantees, durability mechanisms, and query execution.

| Order | File name | Title | Scope |
|-------|-----------|-------|-------|
| 1 | `what-is-a-database-index.md` | What Is a Database Index? | What an index is, why it exists, and the core read/write tradeoff; B+Tree as the dominant structure |
| 2 | `b-plus-tree-index.md` | B+Tree Index Structure | Internal node layout, leaf-level linked list, insert/delete mechanics, and range query traversal |
| 3 | `transaction-and-acid.md` | Transactions and ACID | What a transaction guarantees, how each ACID property is implemented, and where isolation levels fit |
| 4 | `write-ahead-log.md` | Write-Ahead Log and Durability | How WAL separates write ordering from page writes, crash recovery flow, and checkpoint mechanics |
| 5 | `query-execution-plan.md` | Query Execution and the Optimizer | How the query planner turns SQL into a plan, cost estimation, and when/why index scans beat table scans |

The full initial `database-internals` post set is now committed as real content in the repository: `what-is-a-database-index.md`, `b-plus-tree-index.md`, `transaction-and-acid.md`, `write-ahead-log.md`, and `query-execution-plan.md`. Validation fixtures such as `e2e-rendering-validation.md` remain tracked separately under `test/fixtures/obsidian-vault/` and do not count as real series candidates.

The author may adjust order, add topics, or split a post — this list is a starting point, not a commitment. Any changes to the confirmed candidate set should be reflected here.

### Pilot Batch — Simplified Status Model

The original pilot batch for large-scale idea intake was the committed `network-protocols` child series under the parent `computer-networks`. That pilot is still important historically because it proved the simplified-status and visibility rules on real non-public content before the broader `computer-networks` backlog was split into multiple child series.

Why the original pilot was suitable:

- A real series index exists at `src/content/series_indexes/network-protocols.md`
- The child series now has an explicit parent mapping to `computer-networks`
- All five posts already have explicit `series`, `order`, and `status`
- The batch exercises both non-public lifecycle states now in use: `draft` and `idea`
- The `order` range is contiguous (`1` through `5`), so ordering and listing behavior can be checked without introducing new numbering rules

Current pilot statuses:

| Order | File name | Status |
|-------|-----------|--------|
| 1 | `what-is-http.md` | `draft` |
| 2 | `tcp-connection-and-reliability.md` | `draft` |
| 3 | `dns-resolution.md` | `idea` |
| 4 | `tls-and-https.md` | `idea` |
| 5 | `http2-and-http3.md` | `idea` |

Original pilot verification goals:

- Local development should show all five `network-protocols` posts
- Staged and production builds should keep all five posts off public post routes until each post is explicitly changed to `status: published`
- `pnpm check:content` and `pnpm build` should continue to pass with the batch in place

### First Bulk Batch — `data-structures`

The first larger idea-stage batch is grouped as one new confirmed child series: `data-structures` under the parent `data-structures-and-algorithms`. This keeps the intake reviewable because the batch has a single child series index, a contiguous ordering block, and a consistent all-`idea` status set.

Series indexes:
- `src/content/series_indexes/data-structures-and-algorithms.md`
- `src/content/series_indexes/data-structures.md`

Initial bulk batch:

| Order | File name | Title | Status |
|-------|-----------|-------|--------|
| 1 | `what-is-an-array.md` | What Is an Array? | `idea` |
| 2 | `linked-list.md` | Linked List Structure | `idea` |
| 3 | `stack-and-queue.md` | Stack and Queue Basics | `idea` |
| 4 | `hash-table.md` | Hash Table Basics | `idea` |
| 5 | `binary-search-tree.md` | Binary Search Tree | `idea` |

Why this batch is suitable:

- `data-structures` is already a confirmed series in `docs/series-backlog.md`
- The repository now has both parent and child series indexes before posts in that child series
- All posts use explicit `status: idea`
- The batch is reviewable as one coherent series-level diff instead of many unrelated one-off stubs

---

## Candidate Backlog — `computer-networks` Parent Series

The second major direction is now the parent `computer-networks`. The original `network-protocols` flat backlog has been rebuilt into three child series so future intake can grow in coherent slices instead of one mixed list.

### Child Series — `network-protocols`

This retained child slug now covers the application/web-protocol portion of the backlog.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `what-is-http.md` | What Is HTTP? | HTTP request/response model, methods, status codes, statelessness, and the role of HTTP in the web stack | `draft` |
| 2 | `tls-and-https.md` | TLS and HTTPS | TLS handshake, certificate chain, key exchange, and how HTTPS wraps HTTP | `idea` |
| 3 | `http2-and-http3.md` | HTTP/2 and HTTP/3 | Multiplexing, HPACK, QUIC transport use, and protocol evolution | `idea` |

### Child Series — `transport-and-reliability`

This child series groups transport-layer delivery guarantees and latency/reliability tradeoffs.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `tcp-connection-and-reliability.md` | TCP and Reliable Transmission | Handshake, sequencing, acknowledgments, flow control, congestion control, retransmission | `draft` |
| 2 | `udp-and-quic.md` | UDP, QUIC, and Delivery Tradeoffs | Connectionless delivery, latency tradeoffs, reliability moved to higher layers, and QUIC design motivation | `idea` |

### Child Series — `naming-and-routing`

This child series groups the naming, addressing, and path-selection part of the network stack.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `dns-resolution.md` | DNS and Name Resolution | Domain hierarchy, resolver flow, caching, and record types | `idea` |
| 2 | `ip-addressing-and-routing.md` | IP Addressing and Routing | Address assignment, subnet boundaries, routers, and path selection | `idea` |

The author may still adjust order, add topics, or split a post, but the backlog is now intentionally grouped by child series under `computer-networks`.

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
  attachments/      ← images and other assets
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

A post in `idea` state needs only the frontmatter. No body content is required. All three D-25 required fields must be set even at `idea` state, because the conversion script and Astro schema both require them.

```yaml
---
title: "B+Tree Index Structure"
series: database-internals
order: 2
status: idea
---
```

Minimum fields at `idea` state:

| Field | Required | Value at `idea` state |
|-------|----------|-----------------------|
| `title` | Yes (D-25) | The intended post title |
| `series` | Yes (D-25) | Confirmed series slug (e.g., `database-internals`) |
| `order` | Yes (D-25) | Intended position in the series (integer) |
| `status` | Yes (D-32) | `idea` — marks the post as not yet written |

No other fields are required at `idea` state. `status` must still be set explicitly even for early drafts so lifecycle and visibility remain unambiguous. Under D-33, only `status: published` is included in staged and production output, so `idea` posts stay off the public site.

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
