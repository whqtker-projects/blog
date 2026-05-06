# Publishing Workflow

**Status:** Resolved — decisions recorded in `confirmed-decisions.md` (D-17, D-18) and `decision-log.md` (DL-003).  
**Decided:** 2026-05-06  
**Platform:** Astro (static site generator). **Conversion:** automated script (wikilinks → standard links).

Both decisions are now resolved. This document is a reference record of the constraints, candidate approaches, and evaluation criteria that informed the decision. See `confirmed-decisions.md` (D-17, D-18) and `decision-log.md` (DL-003) for the full decision record.

---

## Constraints That Drove the Decision

These confirmed facts shaped which approaches were viable:

- **Source format is Obsidian Markdown.** Documents must render correctly inside Obsidian during the writing and review phase.
- **The conversion path is Obsidian → blog.** Obsidian is the source of truth; there is no separate writing environment for the blog.
- **Post format includes code blocks, embedded examples, and a quiz section.** The platform must render these elements correctly.

---

## Decided Approach

### Platform (Q-1): Astro

Astro was selected as the static site generator. It supports content collections for post management, MDX for component-based quiz implementation, and built-in code highlighting.

**Candidate approaches reviewed:**

| Approach | Examples | Notes |
|---|---|---|
| **Static site generator** ✓ | **Astro** | Markdown-native; high control; requires build pipeline |
| Obsidian-native publishing | Obsidian Publish | Tight integration; limited customization; subscription cost |
| Hosted platform | Ghost, Hashnode, dev.to | Lower maintenance; less control over rendering |
| Custom setup | Self-hosted SSG + VPS | Maximum control; highest maintenance |

---

### Conversion Method (Q-2): Automated script

Conversion is handled by an automated script that transforms Obsidian wikilinks into standard Markdown links before the Astro build step. Specific script design details (language, trigger mechanism, edge cases) are not yet defined and will be addressed during implementation.

**Conversion methods reviewed:**

| Method | Description | Notes |
|---|---|---|
| Manual copy-paste | Copy content from Obsidian into the publishing platform by hand | No tooling required; error-prone at scale |
| **Script-based conversion** ✓ | **Custom script transforms wikilinks before build** | Flexible; requires maintenance |
| Plugin-based export | Obsidian plugin exports to target format | Depends on plugin ecosystem; variable quality |
| Direct sync | Platform reads from the Obsidian vault directory | Requires platform support or middleware |

---

## Evaluation Criteria

Criteria used to evaluate the candidates:

| Criterion | Why It Matters |
|---|---|
| Markdown compatibility | Obsidian-flavored Markdown includes wikilinks and callouts; standard Markdown renderers may not support these |
| Internal link handling | `[[wikilinks]]` must either be converted to standard links or the platform must support them |
| Code block rendering | Syntax highlighting and copy-button behavior affects reader experience |
| Image handling | Images stored in the Obsidian vault must be accessible from the published post |
| Quiz rendering | The quiz section at the end of each post requires at least basic interactivity or styled formatting |
| Maintainability | How much ongoing effort is required to publish a new post |
| Automation complexity | Whether automation is worth building given the expected publishing frequency |

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-17 (Astro), D-18 (automated script)
- [`docs/decision-log.md`](decision-log.md) — DL-003 (context and alternatives)
- [`docs/open-questions.md`](open-questions.md) — Q-1 and Q-2 (both resolved)
