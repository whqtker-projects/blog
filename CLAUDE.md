# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project State

This repository is in the **early planning stage**. There is no build system, no publishing pipeline, and no blog posts yet. The current work is documentation of decisions and structure — article drafting has not begun.

## Repository Purpose

An Obsidian-based technical blog. Obsidian is the internal knowledge repository; the blog is the reader-facing output converted directly from Obsidian Markdown documents.

Content focus: concept explanation (definition level + operational principles), not troubleshooting. Target audience: beginner to practitioner.

## Authoritative Planning Documents

Start here when beginning a session:

```
docs/README.md                    # Document map — read first
docs/project-overview.md          # Purpose, scope, and current stage
docs/confirmed-decisions.md       # All confirmed project decisions
docs/open-questions.md            # All unresolved items — do not resolve by assumption
docs/decision-log.md              # Chronological record of planning discussions
docs/documentation-workflow.md    # How to update planning documents correctly
```

Supporting reference documents (read when relevant to the task):

```
docs/series-backlog.md            # Candidate series and topic domains
docs/post-template.md             # Post structure planning
docs/file-naming-conventions.md   # Naming convention options — unresolved
docs/publishing-workflow.md       # Publishing platform options — unresolved
docs/status-lifecycle.md          # Status definitions for notes, drafts, posts
docs/decisions/                   # ADR files for foundational decisions
```

## Planning Conventions

- **Confirmed decisions** live in `docs/confirmed-decisions.md` and individual ADR files under `docs/decisions/`.
- **Unresolved items** live in `docs/open-questions.md`. Do not assume answers — surface them to the user.
- When a decision is made: update `docs/confirmed-decisions.md`, log it in `docs/decision-log.md`, and resolve the entry in `docs/open-questions.md`.
- All documents are written in English (Obsidian Markdown format).

## Role Boundaries

The user decides: post content, topic selection, series structure, publication timing.  
Agents help with: document structure, decision records, series organization, open-question tracking, consistency cleanup.

Do not draft blog post content, select the first series, define post outlines, or set a publishing cadence unless the user explicitly initiates that discussion.
