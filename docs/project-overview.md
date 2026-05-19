# Project Overview

**Last updated:** 2026-05-08  
**Current stage:** Active content creation — nine posts published across two child series, full workflow in place.

---

## What this project is

This project builds a technical blog backed by an Obsidian vault.

**Obsidian** is the internal knowledge repository. All writing originates there. Notes, drafts, and reference materials are maintained as Obsidian Markdown documents.

**The blog** is the reader-facing artifact. Posts are derived directly from Obsidian documents through a conversion process. There is no separate writing environment — the Obsidian vault is the source of truth.

---

## What the blog is about

The blog explains how things work. It is concept-driven, not troubleshooting-driven.

Each post covers a topic at two depths:

1. **Definition level** — what something is
2. **Operational level** — how it works internally

Concrete examples are included inside posts as much as possible. Self-check or quiz sections are optional and used only when they materially help the post.

---

## What the blog is not

- Not a troubleshooting reference
- Not a step-by-step how-to guide without conceptual grounding
- Not a news or opinion publication (not ruled out, but not the core format)

---

## Target audience

The audience ranges from beginners to practitioners. Posts should remain accessible to newcomers without losing depth for readers with more experience.

---

## Topic domains

The following domains are confirmed. Additional domains may be added as the project grows.

- CS fundamentals and algorithms
- AI / ML / LLM
- Backend and systems
- Software engineering

---

## Current stage

All structural decisions are finalized (series structure, file naming, publishing workflow, post format, status lifecycle). The Astro build and Obsidian-to-Astro conversion script are implemented and tested. Nine posts are currently published: four in `database-internals` and five in `spring-core`.

The current work is writing and publishing posts. The content drafting and review workflow is fully documented in `docs/first-content-readiness.md` and `docs/review-checklist.md`.

---

## Role boundaries

| Actor | Responsibility |
|---|---|
| Obsidian | Source vault — notes, drafts, reference material |
| Blog | Published output — reader-facing posts |
| User | Decides post content, topic selection, series order, publication timing |
| Planning Lead | Routes incoming tasks to the right agent |
| Documentation Curator | Maintains document consistency and decision document stability |
| Post Drafter | Guides posts through the idea → published lifecycle; runs checklist and build verification |

See `docs/agent-architecture.md` for the full agent model and role boundaries.

---

## Related documents

- [README.md](README.md) — full document map
- [agent-architecture.md](agent-architecture.md) — agent model and role boundaries
- [first-content-readiness.md](first-content-readiness.md) — content creation workflow
- [confirmed-decisions.md](confirmed-decisions.md) — all confirmed decisions
- [open-questions.md](open-questions.md) — active tracker for future unresolved planning items
