# Retrieval-First Loading Policy

> Archived document. This policy was written for an earlier planning-agent workflow and is not current operating guidance.

**Status:** Active  
**Last updated:** 2026-05-06

This document defines how agents in this repository should load documents. The core rule: read the smallest set of documents that makes the task possible. Do not load the full repository by default.

---

## The Principle

Every file an agent reads consumes tokens. Reading documents that are not needed for the current task wastes context on information that does not change the output. Over many sessions, this compounds.

Retrieval-first loading means: before opening any document, determine whether you actually need it for this specific task. If the answer is unclear, check the document index or a context pack first — do not speculatively open files.

---

## Document Categories

Not all documents have the same role in a task. Loading strategy depends on category.

| Category | Description | When to load |
|---|---|---|
| **Authoritative** | Define project state, confirmed decisions, and open items. Ground truth for any task. | Load only the specific authoritative doc relevant to the task; never all of them at once unless the task explicitly requires a cross-doc review. |
| **Task-specific** | Reference documents for the current topic area (e.g., `file-naming-conventions.md` for a naming task). | Load when the task is scoped to that topic. |
| **Supporting** | Architecture, workflow, and role guides. Needed for orientation, not for every task. | Load only when the task involves a process question, not a content question. |

### Authoritative Documents

- `docs/confirmed-decisions.md`
- `docs/open-questions.md`
- `docs/decision-log.md`
- `CLAUDE.md`

### Task-Specific Documents (examples)

- `docs/series-backlog.md` — series structure work
- `docs/file-naming-conventions.md` — naming convention work
- `docs/publishing-workflow.md` — publishing platform work
- `docs/post-template.md` — post format work
- `docs/status-lifecycle.md` — lifecycle work

### Supporting Documents

- `docs/README.md` — document map; load to orient at start of session
- `docs/documentation-workflow.md` — load when update process is unclear
- `docs/agent-architecture.md` — load when agent routing or handoff is unclear
- `.claude/agents/*.md` — load only the guide for the active agent role

---

## Minimal Read Sets by Agent

Each agent role has a defined starting set. Start here; expand only if the task requires it.

### Planning Lead

1. `CLAUDE.md`
2. `docs/README.md`
3. `docs/documentation-workflow.md`

Then, only if needed to classify the task:
- `docs/open-questions.md`
- `docs/confirmed-decisions.md`

### Decision Reviewer

1. `docs/confirmed-decisions.md`
2. `docs/open-questions.md`
3. `docs/decision-log.md`

### Documentation Curator

Depends on the specific cleanup task:
- Stale-reference cleanup: `docs/README.md` + affected document
- Cross-link fix: the two documents whose links need aligning
- Document-map accuracy: `docs/README.md` only

### Structure Planner

Depends on the open question being addressed:
- Q-1/Q-2 (publishing): `docs/open-questions.md` (Q-1, Q-2) + `docs/publishing-workflow.md`
- Q-3 (series): `docs/open-questions.md` (Q-3) + `docs/series-backlog.md` + `docs/confirmed-decisions.md`
- Q-4 (naming): `docs/open-questions.md` (Q-4) + `docs/file-naming-conventions.md`
- Q-6 (template): `docs/open-questions.md` (Q-6) + `docs/post-template.md` + `docs/confirmed-decisions.md`

---

## Prefer Context Packs When Available

A context pack bundles confirmed inputs and relevant open items for a specific task into one document. When a pack exists for the current task, read it before opening individual planning documents.

Loading order when a context pack exists:
1. Read the context pack (`docs/context-packs/<task>.md`)
2. Open individual documents only when the pack references a detail you need

Loading order when no context pack exists:
1. Read `docs/README.md` to orient
2. Open only the documents in the minimal read set for the current agent role
3. Expand to task-specific documents as needed

---

## Efficient Loading Sequences — Examples

**Example 1: Documentation Curator fixing a stale reference**

```
1. docs/README.md          — find the affected entry
2. <affected document>     — confirm the stale marker
3. Fix in place
```
Total: 2 files.

**Example 2: Structure Planner preparing options for Q-4**

```
1. docs/context-packs/file-naming.md   — if pack exists, start here
   OR
1. docs/open-questions.md (Q-4 entry)  — if no pack
2. docs/file-naming-conventions.md     — options reference
3. docs/confirmed-decisions.md         — confirmed constraints only
```
Total: 1–3 files.

**Example 3: Decision Reviewer validating after a new confirmed decision**

```
1. docs/confirmed-decisions.md    — locate the new entry
2. docs/decision-log.md           — confirm log entry exists
3. docs/open-questions.md         — verify question status updated
```
Total: 3 files.

**Example 4: Planning Lead classifying an ambiguous incoming task**

```
1. CLAUDE.md                        — role boundaries and project state
2. docs/README.md                   — what documents exist
3. docs/documentation-workflow.md   — what update process applies
   → classify → route to appropriate agent
```
Total: 3 files, then stop.

---

## Ambiguity Rule

When it is unclear which document contains a needed piece of information:

1. Check `docs/README.md` first — the document map describes what each file covers
2. If still unclear, open `docs/documentation-workflow.md` for process questions or `docs/confirmed-decisions.md` for fact questions
3. Do not speculatively open multiple documents hoping one contains the answer

If the task cannot proceed without information that is not in any loaded document, stop and ask the user rather than loading more files by guessing.

---

## Related Documents

- [`docs/README.md`](../README.md) — document map
- [`docs/archive/context-packs/README.md`](context-packs/README.md) — archived context pack structure and usage
- [`docs/documentation-workflow.md`](../documentation-workflow.md) — how planning documents are updated
- [`docs/agent-architecture.md`](../agent-architecture.md) — agent model and handoff rules
