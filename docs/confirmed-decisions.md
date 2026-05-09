# Confirmed Decisions

This document is the stable reference for decisions that have been explicitly agreed upon.

**Rules for this document:**
- Add only confirmed decisions. Do not add proposals or guesses.
- Do not resolve any item from `open-questions.md` by assumption.
- When a new decision is confirmed, add it here and remove it from `open-questions.md`.
- For the full decision record with context and rationale, see `decision-log.md`.

**Last updated:** 2026-05-09 (D-75–D-76 added: refined `computer-networks` child-series breakdown)

---

## System Design

| # | Decision |
|---|---|
| D-1 | Obsidian is the internal knowledge repository. All writing originates there. |
| D-2 | The blog is the reader-facing artifact derived from Obsidian documents. |
| D-3 | The conversion path from Obsidian to blog is direct. The document format is Obsidian Markdown. |
| D-4 | Local readability within Obsidian is a hard requirement for any publishing approach chosen later. |

---

## Content Direction

| # | Decision |
|---|---|
| D-5 | The blog focuses on concept explanation, not troubleshooting or step-by-step how-to content. |
| D-6 | Each post covers a topic at two depths: (1) definition-level explanation, (2) operational principles. |
| D-7 | Concrete examples must be included inside posts as much as possible. |
| D-8 | Each post ends with a quiz section. |

---

## Audience

| # | Decision |
|---|---|
| D-9 | The target audience ranges from beginners to practitioners. |

---

## Topic Domains

| # | Decision |
|---|---|
| D-10 | Confirmed topic domains: CS fundamentals and algorithms, AI/ML/LLM, backend and systems, software engineering. |

---

## Content Ownership

| # | Decision |
|---|---|
| D-12 | The user decides the detailed content of each post personally. |
| D-13 | Planning agents support documentation, structure, decision tracking, and planning workflows, but do not decide detailed post content on behalf of the user. |

---

## Current Stage

| # | Decision |
|---|---|
| D-14 | Planning documents, structure, and decision records must be established before article drafting begins. |

---

## File Naming

| # | Decision |
|---|---|
| D-15 | Obsidian file names use all-lowercase kebab-case with no prefix (no series prefix, no date prefix). Example: `transformer-attention-mechanism.md`. |
| D-16 | File names are English only. Korean content is expressed in post titles and body text, not in file names. |

---

## Publishing

| # | Decision |
|---|---|
| D-17 | The blog is published using Astro as the static site generator. |
| D-18 | The Obsidian → blog conversion is automated via a script that converts wikilinks to standard Markdown links before the Astro build step. |

---

## Series Structure

| # | Decision |
|---|---|
| D-19 | Each topic domain contains multiple series. Domains and series are not 1:1. |
| D-20 | Each post belongs to exactly one series. Cross-series membership is not allowed. |
| D-21 | Confirmed series (12 total): **Backend/Systems** — `database-internals`, `distributed-systems`, `network-protocols`, `backend-design`; **CS Fundamentals** — `data-structures`, `algorithms`, `operating-systems`, `computer-architecture`, `computer-security`; **AI/ML/LLM** — `llm-internals`, `ml-fundamentals`; **Software Engineering** — `design-principles`. |
| D-22 | The first series to be written is `database-internals` (Backend/Systems domain). |
| D-39 | The second series to be written is `network-protocols` (Backend/Systems domain). |

---

## Reading UI

| # | Decision |
|---|---|
| D-40 | Content width: `max-width: 65ch` applied to all page types. |
| D-41 | Font stack: system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif`). No web font import. |
| D-42 | Site-level header with a home link is added to `BaseLayout.astro`, making it visible on all pages. |
| D-43 | Inline concept links (`/concepts/<slug>`) are styled identically to normal post links. No distinct visual treatment. |

---

## Series Naming and Display

| # | Decision |
|---|---|
| D-23 | Series display names are derived from slugs by Title Case conversion. Hyphen-separated words are capitalized; known acronyms (LLM, ML, CS, API, HTTP, DNS, TLS, TCP, IP, CPU) are fully uppercased. Example: `llm-internals` → "LLM Internals", `database-internals` → "Database Internals". |
| D-24 | "Category" is not a separate concept. The blog hierarchy is **domain > series > post**. Domains serve as categories. Domain slugs: `backend-systems`, `cs-fundamentals`, `ai-ml-llm`, `software-engineering`. |

---

## Post Metadata

| # | Decision |
|---|---|
| D-25 | Post frontmatter has three required fields: `title` (string), `series` (series slug, string), `order` (integer, position within the series). Domain is inferred from `series` and is not a separate frontmatter field. |

---

## Post Format

| # | Decision |
|---|---|
| D-26 | Post section titles and ordering are flexible and decided per post. The required content areas (definition-level explanation, operational principles, examples — D-6, D-7) can appear in any order under any heading. The Quiz section must always be last (D-8). |
| D-27 | Each post ends with exactly 5 multiple-choice questions (MCQ). Each question has 4 answer options with one correct answer. |
| D-28 | There is no word count limit. Post length is determined by the topic's requirements — long enough to cover it fully, no longer. |
| D-29 | All series target the same audience: beginner to practitioner (D-9). No per-series audience segmentation. |

---

## Status Lifecycle

| # | Decision |
|---|---|
| D-30 | Post status vocabulary is simplified to 3 values: `idea`, `draft`, `published`. Legacy `outline` and `review` both map to `draft`. |
| D-31 | Published-post update policy: typo, link, and factual-error fixes keep `published` status. Section additions or substantial rewrites return the post to `draft`. |
| D-32 | `status` must be set explicitly on every committed post. Missing `status` is treated as a repository error under the simplified model. |
| D-33 | Production build inclusion policy: only posts explicitly marked `status: published` are included. Posts with `status: idea` or `status: draft` are excluded. |

---

## Astro Project Setup

| # | Decision |
|---|---|
| D-34 | Package manager: pnpm. Node requirement: >=22.12.0. |
| D-35 | Astro project is initialized at the repository root. Planning docs (`docs/`) and Astro source (`src/`) coexist at the same level. |
| D-36 | Post URL structure: `/posts/[slug]`. Slug is derived from the Markdown file name. |
| D-37 | Posts are loaded from `src/content/posts/` via Astro glob loader. Content collection name: `posts`. |
| D-38 | Image copying from vault attachments to `public/images/` is manual. No `--attachments` auto-copy flag is added to the conversion script. Rationale: vault path is machine-specific; copying is a deliberate step with a reviewable git diff; `--strict` image validation catches missing images before they produce broken HTML. |

---

## Deployment

| # | Decision |
|---|---|
| D-44 | Deployment platform: Vercel. |
| D-45 | Production branch: `master`. Staging branch: `develop`. |
| D-46 | Single Vercel project with branch-based routing. `master` maps to the production deployment; `develop` maps to a Vercel Preview Deployment. |
| D-47 | Deploy gate for merging to `master`: full CI pass required (`pnpm build` + `pnpm test:convert` via `ci.yml`). |
| D-48 | `ci.yml` is extended to run on `push` and `pull_request` for both `master` and `develop`. |
| D-49 | ~~Custom domain setup is deferred to a later phase.~~ Superseded by D-50. |

---

## Public-Site Quality

| # | Decision |
|---|---|
| D-50 | Custom domain: `blog.whqtker.com`. |
| D-51 | Post `description` frontmatter field remains optional. `BaseLayout` uses a site-level fallback description when the field is absent. |
| D-52 | OG meta tags (`og:title`, `og:description`, `og:url`, `og:type`) and Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`) are added to all page templates. |
| D-53 | Staging review (develop Preview Deployment) uses a lightweight checklist: homepage/series/post page rendering, prev/next navigation links, quiz `<details>` toggle. |

---

## Bulk Idea Intake

| # | Decision |
|---|---|
| D-54 | Local development should show all posts regardless of status. |
| D-55 | Vercel Preview / staging should follow production visibility, not local-development visibility. Only explicitly published posts should be reader-visible there. |
| D-56 | The first bulk idea-stage batch is not limited to already-confirmed series. New series may be included if they fit the repository's existing content model and series-index requirements. |

---

## Hierarchical Series Architecture

| # | Decision |
|---|---|
| D-57 | Parent-child series hierarchy uses the existing `series_indexes` content type. A `parent` field (series slug string) is added to the schema. Child series carry a `parent` field; parent series omit it. No new content type is introduced. |
| D-58 | URL structure: parent series → `/series/<parent-slug>`, child series → `/series/<parent-slug>/<child-slug>`. Two levels only — no third level is permitted. |
| D-59 | The homepage lists parent series only. Child series and their posts are accessible through the parent series page, not directly from the homepage. |
| D-60 | Existing flat series slugs are preserved as child series slugs during migration. The `network-protocols` slug is retained unchanged when placed under a parent. The old flat URL `/series/network-protocols` will no longer be generated after migration; no redirect is added. |
| D-61 | A parent series is a navigation and information-architecture container for child series. It may have title/description metadata and its own landing page, but it does not own posts directly. |
| D-62 | A child series belongs to exactly one parent series and is the terminal ordered content container. Posts attach directly to child series only. |
| D-63 | The parent series page is responsible for introducing the parent direction and listing its child series. It does not render a mixed flat list of all descendant posts. |
| D-64 | The child series page is responsible for listing visible posts in that child series and providing the series context used by post navigation and breadcrumbs. |
| D-65 | The `computer-networks` parent direction is currently split into three child series: `network-protocols`, `transport-and-reliability`, and `naming-and-routing`. |
| D-66 | During the first backlog rebuild under `computer-networks`, the existing `network-protocols` child slug is retained and narrowed to the HTTP/TLS/HTTP2+/application-protocol portion of the backlog. Transport-focused and naming/routing-focused backlog items move into sibling child series. |
| D-67 | The original 12-series flat inventory in D-21 remains the historical baseline, but the active child-series inventory may expand when a parent direction is rebuilt into multiple child series. |

---

## Child-Series Ordering and Post Title-Prefix Policy

| # | Decision |
|---|---|
| D-68 | Numeric post title prefixes (e.g. `01. TCP란 무엇인가`) are globally optional. No series requires them; no series forbids them. Authors may add them as a display aid at their discretion. |
| D-69 | When a post title includes a numeric prefix in the source file, the prefix is rendered as-is in the public HTML. No stripping or transformation is applied at build time. |
| D-70 | Child-series `order` is introduced as an immediately required field for all existing child series. Every child series index must declare an explicit `order` value; missing `order` is a repository validation error. |
| D-71 | The first rollout of child-series `order` covers all parent series simultaneously, not a staged per-series migration. All child series indexes are updated in the same phase. |
| D-75 | The `computer-networks` parent direction is refined into four child series: `network-foundations`, `transport-and-reliability`, `internet-addressing-and-routing`, and `network-protocols`. This adds an explicit introductory layer and separates internet-layer addressing/routing from application-facing protocols. |
| D-76 | Within the refined `computer-networks` structure, `network-protocols` covers DNS, HTTP, TLS, and later HTTP versions; `internet-addressing-and-routing` covers IP addressing, subnetting, ARP, ICMP, NAT, fragmentation, and routing protocols. |

---

## Reader-Facing Numbering Presentation

| # | Decision |
|---|---|
| D-72 | Parent series pages list child series sorted by `order`, but display no visible numeric label. Readers see only the child series title and optional description; the sort order is structural, not presented as a number. |
| D-73 | Child series pages render post titles exactly as stored in source. When a post title includes a numeric prefix (e.g. `01. TCP란 무엇인가`), that prefix is shown to readers unchanged. No normalization or stripping is applied in the post listing. |
| D-74 | Post pages remove the `#order` breadcrumb cue. When a post title already carries a numeric prefix, the `#order` indicator in the breadcrumb is redundant and is omitted. Breadcrumbs show the series path and post title only. |

---

## Future Decisions

The following areas are not yet decided. See `open-questions.md` for the current status.

- No remaining pre-drafting planning decisions are open.

---

## Related documents

- [open-questions.md](open-questions.md) — unresolved planning items
- [decision-log.md](decision-log.md) — chronological record of how decisions were reached
- [decisions/ADR-001-project-foundations.md](decisions/ADR-001-project-foundations.md) — foundational decision record
