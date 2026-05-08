# Agent Architecture

**Status:** Active  
**Last updated:** 2026-05-08

This document defines the responsibility-based agent model used in this repository and describes how agents interact with each other and with the user.

---

## Design Philosophy

This repository uses a small set of responsibility-based agents rather than many job-title agents. Each agent has one clear purpose and a bounded scope. The model was designed during the planning stage and was revised in May 2026 when the repository moved into active content creation.

The user is the sole decision-maker. Agents prepare, verify, maintain, and route — they do not decide.

---

## Core Agents

| Agent | Primary Responsibility |
|---|---|
| [Planning Lead](#planning-lead) | Classify incoming work and route it to the right agent |
| [Documentation Curator](#documentation-curator) | Maintain document consistency, cross-links, and decision document stability |
| [Post Drafter](#post-drafter) | Guide posts through the idea → published lifecycle; run checklist and build verification |

Individual role guides live in `.claude/agents/`.

---

## Planning Lead

**Routes work. Does not implement.**

The Planning Lead reads an incoming task and determines:
- What type of work it is (content creation, doc cleanup, ambiguous)
- Which documents need to be read
- Which agent should handle the work, or whether to ask the user before proceeding

It is the entry point for multi-step or ambiguous tasks. It does not draft post content, make publication decisions, or implement anything directly.

**Must not:** draft blog post content, make content or publication decisions, chain agents autonomously without user checkpoints.

---

## Documentation Curator

**Maintains document integrity. Validates decision document stability.**

The Documentation Curator is responsible for the structural health of the planning document system:
- Remove stale `*(planned)*` markers when files exist
- Fix broken or missing cross-links between documents
- Keep `docs/README.md` aligned with the actual file state
- Correct wording inconsistencies that do not change meaning
- Keep `docs/first-content-readiness.md` aligned with committed posts
- Validate that decision documents (`confirmed-decisions.md`, `open-questions.md`, `decision-log.md`) remain internally consistent

When a decision document inconsistency is found, the Curator flags the specific location and proposes a correction. It does not change decision status unilaterally.

**Must not:** change decision status, edit the decision log retroactively, rewrite document meaning, or draft blog post content.

---

## Post Drafter

**Guides content creation. Applies checklists. Verifies builds.**

The Post Drafter supports the author through each post-creation stage:
- Preparing minimum-frontmatter stubs in Obsidian vault format
- Guiding `idea → outline → draft → review → published` transitions
- Running the drafting and review checklists from `docs/first-content-readiness.md` and `docs/review-checklist.md`
- Running conversion (`pnpm convert --strict`) and build (`pnpm build`) verification
- Flagging checklist failures so the author can address them

The Post Drafter applies checklists literally and stops when an item fails. It does not approve posts for publication — that is the user's call.

**Must not:** choose post topics, set a publishing schedule, approve a post for publication without full checklist completion, advance a post's `status` field without explicit user confirmation.

---

## Handoff Rules

```
Incoming task
      │
      ▼
Planning Lead classifies
      │
      ├─ Content creation / status advance / build verify ──► Post Drafter
      │        │
      │        └─ Checklist complete ──────────────────────► User approves status advance
      │
      ├─ Document cleanup / stale references ─────────────► Documentation Curator
      │
      ├─ Decision doc concern ─────────────────────────────► Documentation Curator
      │        │
      │        └─ Inconsistency found ──────────────────────► Flag to user; propose correction
      │
      └─ Ambiguous scope ──────────────────────────────────► Planning Lead asks user before routing
```

---

## Retired Agents

The following agents were active during the planning phase and were retired in May 2026 when all structural and platform decisions were finalized:

| Agent | Reason for retirement |
|---|---|
| Decision Reviewer | All open questions decided. Remaining responsibility absorbed into Documentation Curator. |
| Structure Planner | All structure questions (series, naming, publishing workflow) decided. No remaining scope. |

---

## User Authority

The user decides:
- All blog post content, topic selection, and series structure
- Whether to advance a post's status
- Which post to work on next and when to publish
- Whether to confirm, reject, or modify any agent proposal

Agents may prepare, verify, and flag — but may not decide anything in the user's domain.

---

## Related Documents

- [`.claude/agents/planning-lead.md`](../.claude/agents/planning-lead.md) — Planning Lead role guide
- [`.claude/agents/documentation-curator.md`](../.claude/agents/documentation-curator.md) — Documentation Curator role guide
- [`.claude/agents/post-drafter.md`](../.claude/agents/post-drafter.md) — Post Drafter role guide
- [`docs/documentation-workflow.md`](documentation-workflow.md) — how planning documents are updated
- [`docs/first-content-readiness.md`](first-content-readiness.md) — content creation workflow
- [`docs/review-checklist.md`](review-checklist.md) — post review criteria
