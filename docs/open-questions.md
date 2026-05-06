# Open Questions

Items that are not yet finalized. Do not resolve these by assumption — bring them to a planning discussion.

**Rules for this document:**
- Every unresolved planning item lives here until explicitly decided.
- Do not answer open questions by assumption. Use `AskUserQuestion` to surface them.
- When a question is resolved, move the decision to `confirmed-decisions.md` and log the context in `decision-log.md`, then update or remove the entry here.

**Status values:** `open` | `under discussion` | `decided`

**Last updated:** 2026-05-06

---

## Publishing

| # | Status | Question | Notes |
|---|---|---|---|
| Q-1 | open | Which platform will the blog be published on? | Format is Obsidian Markdown. Local rendering in Obsidian is required. External platform TBD. See [publishing-workflow.md](publishing-workflow.md) *(planned)*. |
| Q-2 | open | Will the Obsidian → blog conversion be manual or automated? | Direct conversion is the intended path, but the tooling is not decided. |

---

## Structure and Organization

| # | Status | Question | Notes |
|---|---|---|---|
| Q-3 | open | What are the series/category names and their groupings? | Topic domains are confirmed (CS, AI/ML/LLM, backend, software engineering). Series structure within those domains is not yet defined. See [series-backlog.md](series-backlog.md) *(planned)*. |
| Q-4 | open | What are the Obsidian file naming conventions? | Affects internal links, search, and conversion output. See [file-naming-conventions.md](file-naming-conventions.md) *(planned)*. |
| Q-5 | open | Will series be strictly bounded, or can a post belong to multiple domains? | |

---

## Post Format

| # | Status | Question | Notes |
|---|---|---|---|
| Q-6 | open | What is the exact template structure for a post? | Known: definition level → operational principle → examples → quiz. Section names and ordering not formalized yet. See [post-template.md](post-template.md) *(planned)*. |
| Q-7 | open | How many quiz items per post? What format (MCQ, short answer, etc.)? | |
| Q-8 | open | Are there length guidelines per post? | |

---

## Audience

| # | Status | Question | Notes |
|---|---|---|---|
| Q-9 | open | Does each series target a different audience segment, or is every post written for the full beginner-to-practitioner range? | |

---

## How to resolve an open question

1. Discuss with the user and reach an explicit decision.
2. Add the decision to `confirmed-decisions.md`.
3. Record the context and alternatives in `decision-log.md`.
4. Update the status here to `decided` and add a reference, then remove the entry in the next cleanup pass.

---

## Related documents

- [confirmed-decisions.md](confirmed-decisions.md) — destination for resolved items
- [decision-log.md](decision-log.md) — record of how decisions were reached
