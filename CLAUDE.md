# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project State

This repository is in the **early planning stage**. There is no build system, no publishing pipeline, and no blog posts yet. The current work is documentation of decisions and structure — article drafting has not begun.

## Repository Purpose

An Obsidian-based technical blog system. Obsidian is the internal knowledge repository; the blog is the reader-facing output converted directly from Obsidian Markdown documents.

Content focus: concept explanation (definition level + operational principles), not troubleshooting. Target audience: beginner to practitioner.

## Document Structure

```
PLANNING.md                        # Main project overview — start here
docs/
  open-questions.md                # Unresolved items; do not resolve by assumption
  decisions/
    ADR-001-project-foundations.md # Confirmed foundational decisions
.claude/logs/worklog.md            # Session log
```

## Planning Conventions

- **Confirmed decisions** live in `docs/decisions/` as ADR files.
- **Unresolved items** live in `docs/open-questions.md`. Do not assume answers to open questions — surface them to the user.
- `PLANNING.md` is the single source of truth for current project direction. Keep it in sync when decisions are made or open questions are resolved.
- All documents are written in English (Obsidian Markdown format).

## Role Boundaries

The user decides: post content, topic selection, series structure, publication timing.  
The planning agent helps with: document structure, decision records, series organization, open-question tracking.

Do not draft blog post content, select the first series, define post outlines, or set a publishing cadence unless the user explicitly initiates that discussion.
