# Documentation Update Workflow

How planning sessions with agents should update the documentation system.

---

## Document roles (quick reference)

| Document | Role |
|---|---|
| `open-questions.md` | Source of all unresolved planning items |
| `confirmed-decisions.md` | Stable record of explicitly agreed decisions |
| `decision-log.md` | Chronological record of how decisions were reached |
| `project-overview.md` | High-level summary of project direction (not a decision log) |

---

## When to update each document

### `open-questions.md`

Update when:
- A new planning question surfaces that has not been answered.
- An existing question's status changes (`open` → `under discussion` → `decided`).
- A resolved question needs to be marked and referenced before removal.

Do not:
- Resolve a question by assumption. Ambiguous items stay `open` until the user confirms.
- Delete a question without first recording the decision in `confirmed-decisions.md` and `decision-log.md`.

### `confirmed-decisions.md`

Update when:
- The user explicitly confirms a new decision.
- A decision is refined or corrected based on user feedback.

Do not:
- Add proposals, guesses, or natural extensions as confirmed decisions.
- Resolve an open question by inferring from context.

### `decision-log.md`

Update when:
- A planning discussion produces a new confirmed decision (add an entry with context and alternatives).
- A previously confirmed decision is superseded (add a new entry, mark the old one `superseded`).

Do not:
- Edit or remove past entries. The log is append-only.
- Duplicate the full text of `confirmed-decisions.md`. Reference decision IDs (e.g., D-1) instead.

### `project-overview.md`

Update when:
- The confirmed project direction changes significantly (e.g., scope shift, stage change).

Do not:
- Use it as a decision log. Context and rationale belong in `decision-log.md`.
- Add unresolved items. Those belong in `open-questions.md`.

---

## How to handle ambiguity

When a planning session produces an ambiguous or partially discussed item, follow this order:

1. **Check `open-questions.md`** — the item may already be tracked.
2. **Check `confirmed-decisions.md`** — the item may already be resolved.
3. **If still ambiguous, use `AskUserQuestion`** to surface the question before proceeding.
4. **Do not guess.** Do not infer a decision from related confirmed decisions.
5. **If a task cannot proceed without the answer**, block and ask rather than assuming.

---

## What agents must not do

- Invent decisions that the user has not explicitly confirmed.
- Resolve open questions by assumption or contextual inference.
- Decide detailed blog post content on behalf of the user.
- Remove an open question without a corresponding confirmed decision.
- Treat proposals or notes as confirmed decisions.

---

## What agents may do

- Propose options or surface tradeoffs for the user to evaluate.
- Draft planning documents based on confirmed decisions.
- Track open questions and flag which ones block progress.
- Suggest updates to planning documents when new decisions are confirmed.
- Help structure and organize planning work at the user's request.

---

## Standard update flow

```
Planning discussion
        │
        ▼
New item surfaces
        │
        ├─ Already confirmed? ──► No update needed. Reference confirmed-decisions.md.
        │
        ├─ Unresolved? ──────────► Add to open-questions.md (status: open)
        │
        └─ User confirms now? ───► 1. Append entry to decision-log.md
                                   2. Add decision to confirmed-decisions.md
                                   3. Update open-questions.md (status: decided)
```

---

## Related documents

- [confirmed-decisions.md](confirmed-decisions.md)
- [decision-log.md](decision-log.md)
- [open-questions.md](open-questions.md)
- [project-overview.md](project-overview.md)
