# ADR-001: Project Foundations

**Date:** 2026-05-06  
**Status:** Confirmed

---

## Context

This document records the foundational decisions established during the initial planning discussion. These decisions define the nature of the blog, its content approach, and the roles of each system involved.

---

## Decisions

### Content focus
The blog is primarily for concept explanation — not troubleshooting or step-by-step how-to content. Each post covers a topic at two depths: (1) definition-level explanation, (2) how it works internally (operational principles).

### Audience
The target audience spans from beginners to practitioners. Posts should be accessible to newcomers without losing depth for more experienced readers.

### Post structure elements
- Concrete examples must be included inside each post as much as possible.
- Each post ends with a quiz section.

### Topic domains
Confirmed domains: CS fundamentals and algorithms, AI/ML/LLM, backend and systems, software engineering. Additional domains may be added as the project grows.

### Obsidian as source of truth
Obsidian is the knowledge repository. All writing originates there. The blog is the reader-facing artifact derived from Obsidian documents.

### Conversion workflow
The path from Obsidian to blog is direct conversion. The document format is Obsidian Markdown, ensuring local readability within Obsidian regardless of the publishing platform chosen later.

### Content ownership
The user defines the detailed content of each post personally. The planning/documentation agent does not decide post content, series selection, or article outlines.

### Current stage
Documentation of structure, series organization, planning, and decisions comes before any article drafting.

---

## Consequences

- All planning documents must distinguish confirmed decisions from unresolved items.
- No assumptions about publishing platform, series names, or post templates are made until explicitly decided.
- The post template (definition → operational principle → examples → quiz) is the baseline structure, pending formalization.
