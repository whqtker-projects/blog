# docs/

This directory holds all planning, decision, and workflow documents for the Obsidian-based technical blog project.

The repository is in the **active content-creation stage**. The Astro build, conversion script, parent/child series routes, and published content are in place. All structural decisions are finalized. The current ongoing work is writing, reviewing, and publishing posts.

---

## Document Map

### Codebase reference

| File | Purpose |
|---|---|
| [codebase-manual.html](codebase-manual.html) | Korean standalone HTML manual for understanding and working in the current codebase |

### Session start

| File | Purpose |
|---|---|
| [project-overview.md](project-overview.md) | High-level purpose, scope, and current stage of the project |
| [agent-architecture.md](agent-architecture.md) | Agent model, role boundaries, and candidate-agent dispositions |
| [confirmed-decisions.md](confirmed-decisions.md) | Stable record of all confirmed project decisions |
| [open-questions.md](open-questions.md) | Active tracker for future unresolved planning questions |
| [decision-log.md](decision-log.md) | Chronological record of planning discussions and their outcomes |
| [documentation-workflow.md](documentation-workflow.md) | How to update planning documents correctly |

### Content creation workflow

| File | Purpose |
|---|---|
| [first-content-readiness.md](first-content-readiness.md) | Status transitions, drafting checklist, quality bar, pre-publication self-review |
| [review-checklist.md](review-checklist.md) | Draft → review and review → published criteria |
| [obsidian-conversion-contract.md](obsidian-conversion-contract.md) | Conversion script input requirements, wikilink rules, output policy |
| [status-lifecycle.md](status-lifecycle.md) | Post status vocabulary and production build behavior |
| [first-post-outline-template.md](first-post-outline-template.md) | Fill-in-the-blank Obsidian template for starting a new post |

### Post and content reference

| File | Purpose |
|---|---|
| [post-template.md](post-template.md) | Confirmed post structure rules (D-6, D-7, D-8) |
| [post-metadata.md](post-metadata.md) | Frontmatter field definitions |
| [series-backlog.md](series-backlog.md) | Confirmed series and topic domain organization |
| [series/](series/) | Parent-series operating documents: current child composition, ordering, and backlog posture |
| [rendering-compatibility.md](rendering-compatibility.md) | Validated Markdown constructs and rendering behavior |

### Technical decisions

| File | Purpose |
|---|---|
| [astro-bootstrap.md](astro-bootstrap.md) | Astro project setup, commands, and build contract |
| [deployment-workflow.md](deployment-workflow.md) | Production and staging deployment workflow, branch model, and CI gate |
| [file-naming-conventions.md](file-naming-conventions.md) | Confirmed file naming rules (D-15, D-16) |
| [publishing-workflow.md](publishing-workflow.md) | Current publishing model and conversion/deployment handoff |
| [github-issue-workflow.md](github-issue-workflow.md) | How to create GitHub issues and proceed with implementation |
| [series-index-authoring.md](series-index-authoring.md) | Series index document rules, required fields, and operating invariants |
| [content-model.md](content-model.md) | Role boundaries for posts, examples, and series indexes; homepage and series page behavior |

### Decision records and archive

| File | Purpose |
|---|---|
| [decisions/ADR-001-project-foundations.md](decisions/ADR-001-project-foundations.md) | Foundational decisions from the initial planning session |
| [archive/](archive/) | Historical planning, context-pack, and design documents no longer used as current operating guidance |

---

## How to use this directory

- **Starting a content session:** Read `first-content-readiness.md`, then open the post you are working on.
- **Checking review readiness:** Use `review-checklist.md` to step through each gate.
- **Running the conversion:** See `obsidian-conversion-contract.md` for input requirements; commands are in `astro-bootstrap.md`.
- **Checking confirmed decisions:** Read `confirmed-decisions.md` — do not re-open resolved questions by assumption.
- **Maintenance or document cleanup:** See `agent-architecture.md` for the Documentation Curator's scope.

---

## What this directory is not

- This is not where blog posts are stored — those live in `src/content/posts/` (converted output).
- This is not where Obsidian notes live — the vault is a local, author-owned directory.
- Detailed post content is decided by the user personally — not by agents or planning documents.
