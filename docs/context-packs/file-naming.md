# Context Pack: File Naming Convention

**Scope:** Prepare options and tradeoffs for deciding the Obsidian file naming convention (Q-4).  
**Related open question(s):** Q-4  
**Last updated:** 2026-05-06

---

## Confirmed Inputs

| ID | Decision |
|---|---|
| D-1 | Obsidian is the internal knowledge repository. All writing originates there. |
| D-3 | The conversion path is direct: Obsidian → blog. Document format is Obsidian Markdown. |
| D-4 | Local readability within Obsidian is a hard requirement. |
| D-10 | Topic domains: CS fundamentals, AI/ML/LLM, backend and systems, software engineering. |

Key constraint from D-3 and D-4: file names must work inside Obsidian (for wikilinks and search) and survive the conversion path to the blog (for URL slugs). Any convention that breaks either path is not viable.

---

## Unresolved Questions

| ID | Question |
|---|---|
| Q-4 | What are the Obsidian file naming conventions? |

Decision dimensions within Q-4 (all unresolved):
- Korean vs. English filenames
- Slug format: kebab-case, snake_case, CamelCase, or spaces
- Case: all lowercase vs. title case
- Series prefix: none, domain prefix, numbered prefix
- Date prefix: none vs. ISO date

Q-3 (series structure) is also unresolved and may interact with the series-prefix dimension of Q-4. If a series prefix is desired, series names must be decided first.

---

## Related Documents

- [`docs/file-naming-conventions.md`](../file-naming-conventions.md) — full options breakdown with examples
- [`docs/open-questions.md`](../open-questions.md) — Q-4 entry
- [`docs/confirmed-decisions.md`](../confirmed-decisions.md) — D-1, D-3, D-4, D-10

---

## Do Not Assume

- Do not assume English filenames are required — this is an open dimension.
- Do not assume a series prefix is wanted — series structure (Q-3) is not yet decided.
- Do not assume the blog platform is known — the conversion tool may impose constraints (Q-1, Q-2).
- Do not choose a convention and present it as a recommendation without user input.

---

## Expected Output

A structured comparison of the open naming dimensions, with tradeoffs for each option. The output should be ready for a user decision discussion — not a recommendation, but a clear set of choices with their consequences. Once the user decides, the decision goes to `confirmed-decisions.md` and `decision-log.md`.
