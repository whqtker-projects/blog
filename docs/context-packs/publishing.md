# Context Pack: Publishing Platform and Conversion Workflow

**Scope:** Prepare options and tradeoffs for choosing a publishing platform (Q-1) and an Obsidian-to-blog conversion approach (Q-2).  
**Related open question(s):** Q-1, Q-2  
**Last updated:** 2026-05-06

---

## Confirmed Inputs

| ID | Decision |
|---|---|
| D-1 | Obsidian is the internal knowledge repository. |
| D-2 | The blog is the reader-facing artifact derived from Obsidian documents. |
| D-3 | The conversion path is direct: Obsidian → blog. Document format is Obsidian Markdown. |
| D-4 | Local readability within Obsidian is a hard requirement for any publishing approach. |
| D-5 | Blog content is concept explanation, not troubleshooting. |
| D-6 | Each post covers definition-level and operational-principle-level content. |
| D-7 | Concrete examples are embedded in posts. |
| D-8 | Each post ends with a quiz section. |

Key constraints from confirmed decisions:
- The platform must render Obsidian Markdown correctly, or the conversion tool must handle the transformation.
- Code blocks, embedded examples, and a quiz section are required rendering features.
- Obsidian wikilinks (`[[...]]`) need either native platform support or conversion to standard links.

---

## Unresolved Questions

| ID | Question |
|---|---|
| Q-1 | Which platform will the blog be published on? |
| Q-2 | Will the Obsidian → blog conversion be manual or automated? |

Q-1 and Q-2 are coupled: the right conversion approach depends on the platform, and some platforms make conversion unnecessary. They should be discussed together.

---

## Related Documents

- [`docs/publishing-workflow.md`](../publishing-workflow.md) — platform candidates, conversion methods, and evaluation criteria
- [`docs/open-questions.md`](../open-questions.md) — Q-1 and Q-2 entries
- [`docs/confirmed-decisions.md`](../confirmed-decisions.md) — D-1 through D-8

---

## Do Not Assume

- Do not assume any specific platform (Hugo, Ghost, Obsidian Publish, etc.) is the intended choice.
- Do not assume automated conversion is preferred over manual — Q-2 is open.
- Do not assume wikilink handling has been decided.
- Do not assume quiz rendering requirements are resolved — Q-7 (quiz format) is also open and may affect platform choice.
- Do not treat the evaluation criteria in `publishing-workflow.md` as a decision — they are a preparation artifact.

---

## Expected Output

A decision-ready comparison of publishing platform options and conversion approaches, evaluated against the confirmed constraints (D-3, D-4, rendering requirements from D-6–D-8). The output should surface which combinations are feasible and which tradeoffs the user needs to resolve. Once the user decides, both Q-1 and Q-2 are resolved and recorded.
