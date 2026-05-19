# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project State

The repository is in the **active content-creation stage**. The Astro build is set up, the Obsidian-to-Astro conversion script is implemented, parent/child series routes are in place, and published content exists in `src/content/posts/`. The content drafting and review workflow is fully documented.

All structural and platform decisions are finalized (Q-1 through Q-9 resolved). The primary ongoing work is writing and publishing posts.

Current published-content posture: nine posts are published in the live repository — four in `database-internals` and five in `spring-core`. Treat frontmatter in `src/content/posts/` as the source of truth for counts.

## Repository Purpose

An Obsidian-based technical blog. Obsidian is the internal knowledge repository; the blog is the reader-facing output converted directly from Obsidian Markdown documents.

Content focus: concept explanation (definition level + operational principles), not troubleshooting. Target audience: beginner to practitioner.

## Authoritative Documents

Start here when beginning a session:

```
docs/README.md                    # Document map — read first
docs/agent-architecture.md        # Agent model and role boundaries
docs/confirmed-decisions.md       # All confirmed project decisions
docs/open-questions.md            # Active tracker for future unresolved planning items
docs/documentation-workflow.md    # How to update planning documents correctly
```

Content creation workflow (read when working on posts):

```
docs/first-content-readiness.md   # Status transitions, drafting checklist, quality bar
docs/review-checklist.md          # Draft → review and review → published criteria
docs/obsidian-conversion-contract.md  # Conversion script input requirements
docs/status-lifecycle.md          # Post status vocabulary and production build behavior
```

Supporting reference (read when relevant):

```
docs/series-backlog.md            # Confirmed series and topic domains
docs/post-template.md             # Post structure rules
docs/post-metadata.md             # Frontmatter field definitions
docs/decisions/                   # ADR files for foundational decisions
```

## Planning Conventions

- **Confirmed decisions** live in `docs/confirmed-decisions.md` and individual ADR files under `docs/decisions/`.
- No planning questions are currently open. If a new structural question arises, add it to `docs/open-questions.md` and surface it to the user — do not resolve by assumption.
- When a decision is made: update `docs/confirmed-decisions.md`, log it in `docs/decision-log.md`, and update `docs/open-questions.md`.
- Agent-facing documents are written in English by default. `docs/codebase-manual.html` is the separate Korean standalone HTML manual exception requested by the user.
- Reader-facing blog posts should be written in Korean, while identifiers such as filenames, slugs, and `series` values remain English kebab-case.

## Role Boundaries

The user decides: post content, topic selection, series structure, publication timing.  
Agents help with: routing tasks (Planning Lead), document consistency and decision doc stability (Documentation Curator), post lifecycle and build verification (Post Drafter).

See `docs/agent-architecture.md` for the full agent model.

Do not draft blog post content, advance a post's status, or make publication decisions unless the user explicitly requests it.
