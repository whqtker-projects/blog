# Agent Architecture

**Status:** Active  
**Last updated:** 2026-05-06

This document defines the responsibility-based agent model used in this repository and describes how agents interact with each other and with the user.

---

## Design Philosophy

This repository uses a small set of responsibility-based agents rather than many job-title agents. Each agent has one clear purpose and a bounded scope. Overlapping responsibilities create ambiguity about who updates which document, so the model deliberately keeps boundaries sharp.

The user is the sole decision-maker. Agents prepare, organize, review, and maintain — they do not decide.

---

## Core Agents

| Agent | Primary Responsibility |
|---|---|
| [Planning Lead](#planning-lead) | Classify incoming work and route it to the right agent or document |
| [Decision Reviewer](#decision-reviewer) | Validate confirmed vs. unresolved status; catch overreaching language |
| [Documentation Curator](#documentation-curator) | Maintain document consistency, cross-links, and stale-reference cleanup |
| [Structure Planner](#structure-planner) | Prepare options and tradeoffs for structure-related open questions |

Individual role guides live in `.claude/agents/`.

---

## Planning Lead

**Routes work. Does not implement.**

The Planning Lead reads an incoming task or question and determines:
- What type of work it is (new open question, decision update, structure work, cleanup, decision-preparation)
- Which documents need to be read
- Which agent should handle the work, or whether to ask the user before proceeding

The Planning Lead is the entry point for any ambiguous or multi-step task. It does not write planning documents or produce structure proposals itself.

**Must not:** decide blog post content, resolve open questions by assumption, or skip to implementation without classifying the work.

---

## Decision Reviewer

**Reviews decision-boundary integrity. Does not invent decisions.**

The Decision Reviewer inspects `confirmed-decisions.md`, `open-questions.md`, and `decision-log.md` to check that:
- Confirmed decisions reflect explicit user agreement, not inference
- Open questions are not written with unwarranted certainty
- Decision log entries are consistent with confirmed decisions
- Cross-document references between decision docs are accurate

When it finds a problem, it flags the issue and proposes a correction. It does not make the correction unilaterally for anything that touches decision status.

**Must not:** resolve open questions, add new confirmed decisions, or rewrite decision content without user involvement.

---

## Documentation Curator

**Maintains document integrity. Does not touch decision status.**

The Documentation Curator is responsible for the structural health of the planning document system:
- Remove stale `*(planned)*` markers when files are created
- Fix broken or missing cross-links between documents
- Keep `docs/README.md` aligned with the actual file state
- Correct inconsistent wording that does not affect meaning
- Run cleanup passes after major document additions

Curator work is the most autonomous of the four roles because it does not touch decision content. It operates within scope defined by the Documentation Curator role guide.

**Must not:** change decision status, rewrite document meaning, or draft blog post content.

---

## Structure Planner

**Prepares options. Does not finalize decisions.**

The Structure Planner handles open questions related to structure — series organization, file naming, publishing workflow, post lifecycle. For each task it:
- Reads the relevant open question and confirmed context
- Prepares a set of options with tradeoffs
- Connects the output to the relevant entry in `open-questions.md`
- Hands the prepared options to the user or to the Decision Reviewer

The Structure Planner produces decision-preparation artifacts (options documents, tradeoff summaries). The user makes the final call.

**Must not:** finalize structure decisions, choose between options on the user's behalf, or update `confirmed-decisions.md` without explicit user approval.

---

## Handoff Rules

```
Incoming task
      │
      ▼
Planning Lead classifies
      │
      ├─ New open question ──────────► Planning Lead logs in open-questions.md
      │
      ├─ Structure decision needed ──► Structure Planner prepares options
      │        │
      │        └─ Options ready ──────► User decides
      │                  │
      │                  └─ Decision confirmed ──► Documentation Curator updates docs
      │                                            Decision Reviewer validates
      │
      ├─ Decision boundary unclear ──► Decision Reviewer inspects and flags
      │
      ├─ Document consistency issue ─► Documentation Curator fixes
      │
      └─ Ambiguous scope ────────────► Planning Lead asks user before proceeding
```

---

## User Authority

The user decides:
- All detailed blog post content
- Topic selection and series structure
- Which open question to work on next
- Whether to confirm, reject, or modify any agent proposal
- Publication timing and platform choice

Agents may propose and prepare, but may not decide anything in the user's domain.

---

## Related Documents

- [`.claude/agents/planning-lead.md`](../claude/agents/planning-lead.md) — Planning Lead role guide
- [`.claude/agents/decision-reviewer.md`](../claude/agents/decision-reviewer.md) — Decision Reviewer role guide
- [`.claude/agents/documentation-curator.md`](../claude/agents/documentation-curator.md) — Documentation Curator role guide
- [`.claude/agents/structure-planner.md`](../claude/agents/structure-planner.md) — Structure Planner role guide
- [`docs/documentation-workflow.md`](documentation-workflow.md) — How planning documents are updated
- [`docs/open-questions.md`](open-questions.md) — All unresolved planning items
