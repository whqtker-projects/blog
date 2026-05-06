# Agent Workflow Pilot Record — Q-4 File Naming Convention

**Date:** 2026-05-06  
**Open question:** Q-4 — What are the Obsidian file naming conventions?  
**Status:** Pilot complete. Decision not finalized — user input required.

This document records a full pass of the four-agent workflow on Q-4. It serves two purposes: (1) the Structure Planner output is the decision-ready tradeoff summary the user acts on; (2) the friction log at the end feeds back into workflow improvement.

---

## Phase 1 — Planning Lead

**Role:** Classify the task and route to the appropriate agent.

**Documents read:**
1. `CLAUDE.md` — project state and role boundaries
2. `docs/README.md` — document map; confirmed Q-4 has a reference doc and a context pack
3. `docs/documentation-workflow.md` — confirmed update process
4. `docs/context-packs/file-naming.md` — context pack exists; loaded in place of broader doc set

**Classification:** Structure work. Q-4 is an open question about Obsidian file naming, which affects wikilinks, search, and URL conversion. A context pack exists. Route to Structure Planner with the context pack as the primary input.

**Files read this phase:** 4

---

## Phase 2 — Structure Planner

**Role:** Prepare options and tradeoffs for Q-4. Output is decision-ready material, not a recommendation.

**Additional documents read:**
5. `docs/file-naming-conventions.md` — full options breakdown

**Confirmed inputs from context pack:**

| ID | Decision | Constraint it creates |
|---|---|---|
| D-1 | Obsidian is the knowledge repository | File names must work inside Obsidian |
| D-3 | Conversion path is Obsidian → blog, Obsidian Markdown format | File names become URL slugs; must survive conversion |
| D-4 | Local readability in Obsidian is a hard requirement | Filenames that break Obsidian wikilinks are not viable |
| D-10 | Four confirmed topic domains | Domain prefix options are constrained to these four names until Q-3 is resolved |

**Blocking dependency:** Q-1 and Q-2 (publishing platform and conversion tooling) are unresolved. The conversion tool may impose its own constraints on filename characters or encoding. Options that depend on conversion-tool behavior (notably Korean filenames) carry unknown risk until Q-1/Q-2 are decided.

---

### Tradeoff Summary by Dimension

#### Dimension 1 — Language (Korean vs. English)

| Option | Obsidian (D-4) | URL conversion (D-3) | Risk |
|---|---|---|---|
| English only | Works fully | ASCII slugs — universally compatible | Low |
| Korean allowed | Works fully | Requires URL encoding; tool support varies | Depends on Q-1/Q-2 |
| Korean title, English filename | Works fully | ASCII slug | Low; adds frontmatter complexity |

**Constraint-driven note:** D-3 requires surviving the conversion path. Until Q-1/Q-2 are decided, Korean filenames carry conditional risk. English-only or the split approach (Korean title, English filename) are safe regardless of platform.

---

#### Dimension 2 — Slug Format

| Option | Example | Obsidian | URL | Cross-tool |
|---|---|---|---|---|
| kebab-case | `transformer-attention.md` | Works | Standard; widely expected | Highest compatibility |
| snake_case | `transformer_attention.md` | Works | Works; less conventional | Good compatibility |
| CamelCase | `TransformerAttention.md` | Works | Requires normalization for URLs | Adds conversion complexity |
| Spaces | `Transformer Attention.md` | Natural | Requires URL encoding | Adds conversion complexity |

**Constraint-driven note:** D-3 (conversion must work) rules out spaces and CamelCase unless the conversion tool handles normalization — which is unknown until Q-1/Q-2 resolve. Kebab-case is safe on all confirmed constraints.

---

#### Dimension 3 — Case

| Option | Example | Risk |
|---|---|---|
| All lowercase | `transformer-attention.md` | No cross-OS issues; Linux and macOS consistent |
| Title case | `Transformer-Attention.md` | macOS is case-insensitive; Linux is not — inconsistency risk if the repo or server runs Linux |

**Constraint-driven note:** No confirmed platform (Q-1 open), so OS case sensitivity is unknown. All lowercase is safer.

---

#### Dimension 4 — Series Prefix

| Option | Example | Notes |
|---|---|---|
| No prefix | `transformer-attention.md` | Clean; relies on folder structure |
| Domain prefix | `ai-transformer-attention.md` | Domain visible in filename; requires Q-3 to settle series names first |
| Numbered prefix | `ai-01-transformer-attention.md` | Encodes order; brittle when posts are inserted or reordered |

**Constraint-driven note:** Series names are not confirmed (Q-3 open). Any series-prefix option depends on Q-3 resolving first. Numbered prefix is structurally fragile regardless of other choices.

---

#### Dimension 5 — Date Prefix

| Option | Example | Notes |
|---|---|---|
| No date | `transformer-attention.md` | Suits evergreen concept posts (consistent with D-5, D-6) |
| ISO date prefix | `2026-05-06-transformer-attention.md` | Suits time-ordered content; adds noise to concept posts |

**Constraint-driven note:** D-5 (concept explanation, not time-sensitive) and D-6 (definition + operational principle depth) describe evergreen content. A date prefix fits time-ordered content better than concept posts. No prefix aligns with confirmed content direction.

---

### Dimensions Partially Constrained by Confirmed Decisions

| Dimension | Confirmed constraints rule out | Remaining choice |
|---|---|---|
| Slug format | Spaces and CamelCase (conditional on Q-1/Q-2) | kebab-case vs. snake_case |
| Case | Title case (cross-OS risk, unknown platform) | All lowercase preferred |
| Date prefix | ISO date prefix (evergreen content) | No prefix preferred |
| Language | Korean (conditional risk until Q-1/Q-2) | English vs. split approach |
| Series prefix | Numbered prefix (structurally fragile) | None vs. domain prefix (after Q-3) |

**Files read this phase:** 1 additional (total so far: 5)

---

## Phase 3 — Decision Reviewer

**Role:** Validate that the Structure Planner output does not overstate confirmed inputs or resolve open questions.

**Documents read:**
6. `docs/confirmed-decisions.md`
7. `docs/open-questions.md`

**Findings:**

| Check | Result |
|---|---|
| Confirmed inputs (D-1, D-3, D-4, D-10) correctly sourced | Pass |
| No unresolved items presented as decided | Pass |
| Q-4 status remains `open` | Pass |
| Q-3 dependency correctly noted as unresolved | Pass |
| Q-1/Q-2 dependency correctly flagged as risk, not assumed | Pass |
| "Constraint-driven" language used for ruled-out options, not "decided" language | Pass |
| Date prefix guidance attributed to D-5/D-6, not stated as confirmed convention | Pass |

**Flag:** None. The tradeoff summary is within confirmed/unresolved boundaries.

**Files read this phase:** 2 (total so far: 7)

---

## Phase 4 — Documentation Curator

**Role:** Update documents if anything changed. Assess scope.

No document was updated in this pilot because no decision was made. Q-4 status remains `open`. The tradeoff summary exists in this pilot record and is ready for a user decision session.

**If the user confirms a decision from the tradeoff summary:**
- Update `docs/confirmed-decisions.md` with the new decision
- Append an entry to `docs/decision-log.md`
- Update Q-4 status in `docs/open-questions.md` to `decided`
- Update `docs/file-naming-conventions.md` status field if appropriate

**Files read this phase:** 0 (total: 7)

---

## Pilot Summary

| Metric | Value |
|---|---|
| Total files read | 7 |
| Agents involved | 4 (Planning Lead, Structure Planner, Decision Reviewer, Documentation Curator) |
| Open question resolved | No — Q-4 remains open |
| Decision ready for user | Yes — tradeoff summary above |
| Pilot passed acceptance criteria | Yes |

---

## Friction Log

Issues observed during the pilot that may inform workflow improvements.

**F-1: Q-1/Q-2 dependency creates forward-blocking**  
The file naming decision (Q-4) depends partly on the publishing platform (Q-1) and conversion tool (Q-2), because those determine URL encoding behavior. This was handled by flagging the dependency rather than blocking. However, a user starting Q-4 without having considered Q-1/Q-2 may be surprised by the conditional risk on Korean filenames.  
*Possible improvement:* context packs could explicitly list blocking vs. non-blocking dependencies.

**F-2: Series prefix dimension blocked by Q-3**  
The series-prefix dimension of Q-4 cannot be fully evaluated until series names are decided (Q-3). The pilot handled this correctly by noting the dependency, but the user must resolve Q-3 before Q-4 can be fully closed.  
*Possible improvement:* the Q-4 context pack could note Q-3 as a prerequisite for the series-prefix dimension specifically.

**F-3: Decision Reviewer adds value mainly as a validation gate, not a discovery role**  
In this pilot, the Decision Reviewer found no problems. Its value is in catching boundary violations that occurred during Structure Planner work — not in discovering new issues. For clean Structure Planner output, the review pass is fast.  
*Possible improvement:* Decision Reviewer could be triggered conditionally (when boundary language is uncertain) rather than always.

**F-4: Documentation Curator had no work in a no-decision pilot**  
The Curator role is only active when a decision is confirmed. In a decision-prep pilot, it is a no-op. This is expected behavior, not a problem.

---

## Next Step

Present the tradeoff summary (Phase 2 above) to the user for a decision on Q-4. Once the user decides, re-engage the workflow starting from Documentation Curator to record the decision.
