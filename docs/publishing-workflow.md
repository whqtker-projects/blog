# Publishing Workflow

**Status:** Resolved — decisions recorded in `confirmed-decisions.md` (D-17, D-18) and `decision-log.md` (DL-003).  
**Decided:** 2026-05-06  
**Platform:** Astro (static site generator). **Conversion:** automated script (wikilinks → standard links).

The publishing workflow covers two decisions: (1) which platform the blog is hosted on, and (2) how Obsidian documents are converted into publishable posts. Both are open. This document frames the constraints and evaluation criteria for a future decision discussion.

See the related open question in [`docs/open-questions.md`](open-questions.md).

---

## Known Constraints

These are confirmed facts that any platform or conversion approach must satisfy:

- **Source format is Obsidian Markdown.** Documents must render correctly inside Obsidian during the writing and review phase.
- **The conversion path is Obsidian → blog.** Obsidian is the source of truth; there is no separate writing environment for the blog.
- **Post format includes code blocks, embedded examples, and a quiz section.** The platform must render these elements correctly.
- **No platform has been decided.** This is an open question.

---

## Open Decisions

### Decision 1: Publishing Platform

The platform where the blog is hosted. Not chosen.

**Candidate approaches:**

| Approach | Examples | Notes |
|---|---|---|
| Static site generator | Hugo, Astro, Jekyll, 11ty | Markdown-native; high control; requires build pipeline |
| Obsidian-native publishing | Obsidian Publish | Tight integration; limited customization; subscription cost |
| Hosted platform | Ghost, Hashnode, dev.to | Lower maintenance; less control over rendering |
| Custom setup | Self-hosted SSG + VPS | Maximum control; highest maintenance |

---

### Decision 2: Conversion Method

How Obsidian documents become published posts. Not chosen.

| Method | Description | Notes |
|---|---|---|
| Manual copy-paste | Copy content from Obsidian into the publishing platform by hand | No tooling required; error-prone at scale |
| Script-based conversion | Custom script transforms Obsidian Markdown to the platform's format | Flexible; requires maintenance |
| Plugin-based export | Obsidian plugin exports to target format | Depends on plugin ecosystem; variable quality |
| Direct sync | Platform reads from the Obsidian vault directory | Requires platform support or middleware |

---

## Evaluation Criteria

When the platform and conversion method are under discussion, evaluate against these criteria:

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

## Next Step

This document is an input to a future platform and workflow decision discussion initiated by the user. When decisions are made, they will be recorded in [`docs/decisions/`](decisions/) and the related open questions in `open-questions.md` will be resolved.
