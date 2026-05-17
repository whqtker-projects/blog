# Context Packs

> Archived document. Context packs were used during early planning. Current work should use the active document map in [`../../README.md`](../../README.md).

**Status:** Active  
**Last updated:** 2026-05-06

This directory holds context-pack documents. Each pack bundles exactly the information needed for one focused task so an agent can work without loading the full planning document set.

---

## What Is a Context Pack?

A context pack is a single, self-contained document that answers the question: *what does an agent need to know to work on this specific task, and nothing more?*

It is not a summary of the repository. It is not a duplicate of the planning system. It is a scoped brief for one task or decision area, assembled from confirmed facts and open items already recorded in the planning documents.

---

## When to Use a Context Pack

Use a context pack when:
- The task is focused on one open question or one decision area
- The agent would otherwise need to read four or more planning documents to get oriented
- The same task type recurs across sessions (packs amortize the reading cost)
- The task involves a new session where prior context is cold

Read planning documents directly when:
- The task spans multiple unrelated decision areas
- A pack does not yet exist for the task
- The relevant documents have changed and the pack may be stale

---

## Standard Pack Structure

Every context pack uses this structure. Sections may be brief; none should be omitted.

```markdown
# Context Pack: [Task or Decision Area]

**Scope:** One sentence describing what this pack covers.  
**Related open question(s):** Q-N, Q-N  
**Last updated:** YYYY-MM-DD

---

## Confirmed Inputs

Facts already decided that constrain or inform this task.
Cite the source decision ID (e.g., D-1) where possible.

---

## Unresolved Questions

Open items that this task must not resolve by assumption.
Reference the question ID from open-questions.md (e.g., Q-4).

---

## Related Documents

Links to the planning documents an agent should read if it needs
more detail beyond what this pack provides.

---

## Do Not Assume

An explicit list of things an agent must not treat as decided.
Keep this short — one to five items.

---

## Expected Output

What a successful result looks like: a decision-ready options summary,
a set of tradeoffs for the user, a document update, etc.
```

---

## How Context Packs Reduce Token Usage

Without a context pack, an agent opening a task cold typically reads:
- `CLAUDE.md`
- `docs/README.md`
- `docs/confirmed-decisions.md`
- `docs/open-questions.md`
- One or more task-specific reference documents

That is five or more files per session for common, recurring tasks.

A context pack consolidates the confirmed inputs and relevant open items into one document. The agent reads one file to get oriented, then opens task-specific reference documents only when it needs detail. The full planning document set stays unloaded unless the task genuinely requires it.

---

## Keeping Packs Current

A context pack is derived from the planning documents. When confirmed decisions or open questions change, the affected packs should be updated.

Packs become stale when:
- A related open question is resolved
- A confirmed decision that the pack cites is superseded
- The scope of the task changes

Stale packs are worse than no pack — an agent acting on outdated confirmed inputs can introduce inconsistencies. If a pack's `Last updated` date is significantly behind the last relevant change in `confirmed-decisions.md` or `open-questions.md`, treat the pack as unverified until reviewed.

---

## Related Documents

- [`docs/README.md`](../../README.md) — document map
- [`docs/confirmed-decisions.md`](../../confirmed-decisions.md) — source for confirmed inputs
- [`docs/open-questions.md`](../../open-questions.md) — source for unresolved items
- [`docs/archive/retrieval-workflow.md`](../retrieval-workflow.md) — archived retrieval-first loading policy
- [`docs/agent-architecture.md`](../../agent-architecture.md) — agent model
