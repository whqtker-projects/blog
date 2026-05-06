# Blog Project Planning

**Status:** Early planning stage — structure and decisions are being documented before any posts are drafted.  
**Last updated:** 2026-05-06

---

## 1. Project Overview

This project builds a technical blog backed by an Obsidian vault.

- **Obsidian** is the internal knowledge repository where notes, drafts, and reference materials live.
- **The blog** is the reader-facing output derived from those Obsidian documents.
- The conversion path is direct: Obsidian documents are the source of truth, and posts are published from them without maintaining a separate writing environment.

The blog is concept-driven — it explains how things work, from definition level through internal mechanisms. It is not primarily a troubleshooting or how-to reference.

The current planning stage is focused on establishing structure, series organization, planning documents, and decision records. No posts are being drafted yet.

---

## 2. Confirmed Decisions

See [`docs/decisions/`](docs/decisions/) for individual decision records. See [`docs/github-issue-workflow.md`](docs/github-issue-workflow.md) for the issue-driven development workflow.

| Decision | Status |
|---|---|
| Blog is concept-explanation focused, not troubleshooting | Confirmed |
| Target audience spans beginner to practitioner | Confirmed |
| Each post covers definition-level and operational-principle level | Confirmed |
| Examples are included inside posts as much as possible | Confirmed |
| Each post ends with a quiz | Confirmed |
| Obsidian is the knowledge repository | Confirmed |
| Blog is the reader-facing artifact | Confirmed |
| Obsidian → blog is a direct conversion workflow | Confirmed |
| Document format uses Obsidian Markdown | Confirmed |
| User defines the detailed content of each post personally | Confirmed |
| Documentation and structure come before article drafting | Confirmed |
| Topic domains: CS fundamentals, AI/ML/LLM, backend/systems, software engineering (extensible) | Confirmed |

---

## 3. Scope and Positioning

**What this blog produces:**
- Concept explanation posts at two depths: (1) what something is, (2) how it works internally
- Posts with concrete examples embedded in the body
- Posts with a quiz section at the end

**What this blog is not primarily focused on:**
- Troubleshooting guides or debugging walkthroughs
- Step-by-step how-to tutorials without conceptual grounding
- News or opinion pieces (not ruled out, but not the core format)

**Topic domains** (confirmed, extensible):
- CS fundamentals and algorithms
- AI / ML / LLM
- Backend and systems
- Software engineering

---

## 4. Role Separation

| Actor | Responsibility |
|---|---|
| Obsidian | Source vault — notes, drafts, reference material, internal links |
| Blog | Published output — reader-facing posts converted from Obsidian documents |
| User | Decides detailed content, topic selection, post structure, and publication timing |
| Planning/documentation agent | Helps with structure, series organization, planning documents, and decision tracking |

The planning agent does not decide post content, select the first series, or set a publication schedule unless the user initiates that discussion.

---

## 5. Current Planning Priorities

1. **Establish this planning document** — captures the project direction so every future conversation starts with shared context.
2. **Define series/category structure** — group topic domains into navigable series before drafting begins.
3. **Create post templates** — standardize the definition → operational-principle → examples → quiz format.
4. **Document open questions** — track what is still unresolved so nothing is silently assumed.

Documentation and structure come first because:
- Decisions made now shape the structure of every future post.
- A clear taxonomy prevents duplication and gaps across series.
- Planning records make the project maintainable when returning after a break.

---

## 6. Open Questions

See [`docs/open-questions.md`](docs/open-questions.md) for the full list.

| Topic | Status |
|---|---|
| Publishing platform | Unresolved — format is Obsidian Markdown; platform TBD |
| Series/category names and groupings | Not yet defined |
| Post template structure | Not yet defined |
| Naming conventions for Obsidian files | Not yet defined |
| Publishing workflow (manual vs. automated conversion) | Not yet defined |
| Audience segmentation per series | Not yet defined |
