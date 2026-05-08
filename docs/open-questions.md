# Open Questions

Items that are not yet finalized. Do not resolve these by assumption — bring them to a planning discussion.

**Rules for this document:**
- Every unresolved planning item lives here until explicitly decided.
- Do not answer open questions by assumption. Use `AskUserQuestion` to surface them.
- When a question is resolved, move the decision to `confirmed-decisions.md` and log the context in `decision-log.md`, then update or remove the entry here.

**Status values:** `open` | `under discussion` | `decided`

**Last updated:** 2026-05-08

---

## Publishing

| # | Status | Question | Notes |
|---|---|---|---|
| Q-1 | decided | Which platform will the blog be published on? | Astro (static site generator). See `confirmed-decisions.md` D-17 and `decision-log.md` DL-003. |
| Q-2 | decided | Will the Obsidian → blog conversion be manual or automated? | Automated script: wikilinks → standard links before Astro build. See `confirmed-decisions.md` D-18 and `decision-log.md` DL-003. |

---

## Structure and Organization

| # | Status | Question | Notes |
|---|---|---|---|
| Q-3 | decided | What are the series/category names and their groupings? | 12 series across 4 domains. See `confirmed-decisions.md` D-21 and `decision-log.md` DL-004. |
| Q-4 | decided | What are the Obsidian file naming conventions? | All-lowercase kebab-case, English only, no prefix. See `confirmed-decisions.md` D-15, D-16 and `decision-log.md` DL-002. |
| Q-5 | decided | Will series be strictly bounded, or can a post belong to multiple domains? | One post, one series — cross-series membership not allowed. See `confirmed-decisions.md` D-20 and `decision-log.md` DL-004. |

---

## Post Format

| # | Status | Question | Notes |
|---|---|---|---|
| Q-6 | decided | What is the exact template structure for a post? | Section titles and ordering are flexible per post; required content areas (D-6, D-7) must be present; Quiz is always last (D-8). See `confirmed-decisions.md` D-26 and `decision-log.md` DL-008. |
| Q-7 | decided | How many quiz items per post? What format (MCQ, short answer, etc.)? | 5 MCQ, 4 options each, one correct answer. See `confirmed-decisions.md` D-27 and `decision-log.md` DL-008. |
| Q-8 | decided | Are there length guidelines per post? | No word count limit; length is topic-driven. See `confirmed-decisions.md` D-28 and `decision-log.md` DL-008. |

---

## Audience

| # | Status | Question | Notes |
|---|---|---|---|
| Q-9 | decided | Does each series target a different audience segment, or is every post written for the full beginner-to-practitioner range? | All series target the same audience: beginner to practitioner (same as D-9). No per-series segmentation. See `confirmed-decisions.md` D-29 and `decision-log.md` DL-008. |

---

## Deployment

| # | Status | Question | Notes |
|---|---|---|---|
| OQ-Deploy-1 | decided | Which deployment platform? | Vercel. See D-44. |
| OQ-Deploy-2 | decided | Production and staging branch model? | `master` = production, `develop` = staging. See D-45. |
| OQ-Deploy-3 | decided | Single Vercel project or separate projects for prod/staging? | Single project; `master` → production, `develop` → Preview Deployment. See D-46. |
| OQ-Deploy-4 | decided | What checks must pass before deploying to production? | Full CI pass (`pnpm build` + `pnpm test:convert`). See D-47. |
| OQ-Deploy-5 | decided | Should `ci.yml` cover `develop` as well as `master`? | Yes — both branches included. See D-48. |
| OQ-Deploy-6 | decided | Is custom domain setup in scope for the first deployment phase? | Deferred. Initial deployment uses `*.vercel.app`. See D-49. |

---

## How to resolve an open question

1. Discuss with the user and reach an explicit decision.
2. Add the decision to `confirmed-decisions.md`.
3. Record the context and alternatives in `decision-log.md`.
4. Update the status here to `decided` and add a reference, then remove the entry in the next cleanup pass.

---

## Related documents

- [confirmed-decisions.md](confirmed-decisions.md) — destination for resolved items
- [decision-log.md](decision-log.md) — record of how decisions were reached
