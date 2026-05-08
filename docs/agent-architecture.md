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

The following agents were active during the planning phase and were retired in May 2026.

### Decision Reviewer → absorbed into Documentation Curator

**Why retired:** The Decision Reviewer existed to validate that confirmed/unresolved decision boundaries were accurate while decisions were being actively made. By May 2026, all open questions (Q-1 through Q-9) were resolved and the decision documents (`confirmed-decisions.md`, `open-questions.md`, `decision-log.md`) were in a stable, post-planning state. The ongoing need is not active validation of new decisions but maintenance of existing stable documents — which is within the Documentation Curator's existing scope.

**What was absorbed:** Periodic stability checks — verifying that `decision-log.md` is not retroactively edited, that `confirmed-decisions.md` entries have corresponding log entries, and that `open-questions.md` items marked `decided` are correctly referenced. These are now listed in the Documentation Curator's role guide as the "Decision document stability" responsibility.

**What was not absorbed:** The Decision Reviewer's role in actively evaluating whether a new item should be confirmed or remain open. If new structural decisions arise, the user decides and the Documentation Curator records — no separate reviewer role is needed at the current repository size.

### Structure Planner → retired without absorption

**Why retired:** The Structure Planner's sole function was to prepare options and tradeoffs for the structural open questions (Q-1 through Q-9). All nine questions are now decided. The series organization, file naming conventions, publishing platform, conversion workflow, post template, and status lifecycle are all confirmed decisions. There is no remaining scope.

**If new structure questions arise:** New questions would be added to `docs/open-questions.md` and surfaced to the user by the Planning Lead. If they require options preparation, that work would be done inline — a dedicated agent is not justified unless questions accumulate again.

---

## Candidate Agents — Disposition

The following roles were evaluated during the May 2026 redesign. Each is explicitly marked with its disposition and the rationale.

### `technical-reviewer` — absorbed into Post Drafter

**Disposition:** Do not add as a separate agent.

**Rationale:** The technical accuracy review is already part of the Post Drafter's checklist responsibilities. `docs/review-checklist.md` includes a factual accuracy pass, and `docs/first-content-readiness.md` includes a technical accuracy section in the pre-publication self-review. At the current repository size (five posts, one author), a separate technical reviewer agent adds coordination overhead without adding capability — the Post Drafter handles the same checklist items.

**Condition for revisiting:** If the post volume grows significantly, if a multi-author workflow is introduced, or if factual accuracy errors become a recurring pattern that checklist-based review does not catch.

### `publish-verifier` — absorbed into Post Drafter

**Disposition:** Do not add as a separate agent.

**Rationale:** The publication verification sequence — `pnpm convert --strict`, `pnpm build`, HTML spot check — is a small, concrete, sequential procedure that the Post Drafter already owns as part of the Review → Published transition. Splitting it into a separate agent would divide a three-step linear workflow across an agent boundary with no benefit. The Post Drafter role guide documents the full verification sequence explicitly.

**Condition for revisiting:** If the verification workflow grows to include deployment targets, CDN invalidation, or multi-environment checks that are clearly outside the Post Drafter's content-creation scope.

### `platform-maintainer` — deferred

**Disposition:** Defer. Do not add now.

**Rationale:** The Astro build is stable (Astro 6.2.2, Shiki highlighting, static output). No active platform maintenance tasks exist. The conversion script is implemented and tested. There are no open infrastructure issues. A dedicated maintenance agent requires real ongoing work to justify its existence — if added now it would have nothing to do.

**Condition for revisiting:** If the platform work becomes significant — Astro major version upgrade requiring template changes, Shiki theme reconfiguration, new content collection schema changes, or a move to a different deployment target. At that point the scope would be concrete enough to define a role.

### Design-related role (`design-planner`, `ux-structure-planner`) — rejected

**Disposition:** Reject. Do not add.

**Rationale:** No visual design work exists in this repository. There are no design assets, no CSS files, no layout iteration tasks, and no design decisions tracked in any planning document. The blog renders with Astro's default PostLayout. Adding a design agent without any design work to do is premature and would create a role with no scope. This is not a deferral — the repository does not have a design layer to maintain yet.

**Condition for revisiting:** When the repository has explicit design work: a non-default layout, a design decision that needs tracking, or a visual direction the user has articulated.

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
