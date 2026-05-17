# Context Pack: Series Structure

> Archived document. Q-3 and Q-5 are resolved; see [`../../series-backlog.md`](../../series-backlog.md) and [`../../content-model.md`](../../content-model.md) for current guidance.

**Scope:** Prepare options for defining series names and groupings within the confirmed topic domains (Q-3).  
**Related open question(s):** Q-3, Q-5  
**Last updated:** 2026-05-06

---

## Confirmed Inputs

| ID | Decision |
|---|---|
| D-9 | Target audience ranges from beginners to practitioners. |
| D-10 | Confirmed topic domains: CS fundamentals and algorithms, AI/ML/LLM, backend and systems, software engineering. |
| D-12 | The user decides the detailed content of each post personally. |
| D-13 | Planning agents support structure and planning, but do not decide post content. |

Key constraint from D-10: four topic domains are confirmed. Series names and groupings must not contradict those confirmed domains. Whether the domain model may expand later is not part of the confirmed decision set and should not be assumed here.

---

## Unresolved Questions

| ID | Question |
|---|---|
| Q-3 | What are the series/category names and their groupings? |
| Q-5 | Will series be strictly bounded, or can a post belong to multiple domains? |

Q-3 and Q-5 interact: if posts can belong to multiple domains (Q-5), the series structure may need to accommodate cross-domain posts. This should be clarified before or alongside Q-3.

Q-9 (audience segmentation per series) is also open and may affect how series are named and scoped, but is not a blocker for Q-3.

---

## Related Documents

- [`docs/series-backlog.md`](../../series-backlog.md) — current series inventory
- [`docs/open-questions.md`](../../open-questions.md) — active tracker for future unresolved planning items
- [`docs/confirmed-decisions.md`](../../confirmed-decisions.md) — D-9, D-10, D-12, D-13

---

## Do Not Assume

- Do not assume topic domains map 1:1 to series — one domain may have multiple series, or multiple domains may share one.
- Do not assume series will have a fixed post count.
- Do not assume sub-series (e.g., "LLM internals" under AI/ML) will or will not be used.
- Do not select which series to develop first — that is a user content decision (D-12).
- Do not resolve Q-5 (single vs. multi-domain membership) as part of this task unless the user addresses it.

---

## Expected Output

A set of structural options for how to organize the four confirmed domains into navigable series, with tradeoffs for each approach. Options should address: naming format, granularity (coarse vs. fine series), and how Q-5 (multi-domain membership) might be handled. The output should be ready for a user decision discussion. Once decided, Q-3 is resolved and recorded; Q-5 may be resolved in the same session or deferred.
