## 2026-05-07 — Add contributor guide

Created root `AGENTS.md` as a repository-specific contributor guide. Documented the Astro project layout, `pnpm` development and conversion commands, naming constraints enforced by `scripts/obsidian-to-astro.mjs`, the current Node test workflow, and commit/PR conventions inferred from recent git history.

## 2026-05-07 — Separate validation fixtures from public content

Removed `src/content/posts/e2e-rendering-validation.md` from the public content set because it exists only to exercise rendering validation. Kept the Obsidian source fixture under `test/fixtures/obsidian-vault/` and updated the bootstrap and conversion docs to state that validation fixtures stay under `test/fixtures/` and should not leave committed converted artifacts in `src/content/posts/`.

## 2026-05-07 — Add Transactions and ACID post

Added `src/content/posts/transaction-and-acid.md` as the third real `database-internals` series post. Wrote a publishable draft covering transaction guarantees, ACID enforcement, isolation levels, a concrete bank-transfer example, and a five-question quiz, then prepared it for build verification.

## 2026-05-07 — Add Write-Ahead Log and Durability post

Added `src/content/posts/write-ahead-log.md` as the fourth real `database-internals` series post. Wrote a publishable draft explaining WAL ordering, crash recovery flow, checkpoint mechanics, a commit-path example, and a five-question quiz, then prepared it for build verification.

## 2026-05-07 — Add Query Execution and the Optimizer post

Added `src/content/posts/query-execution-plan.md` as the fifth real `database-internals` series post. Wrote a publishable draft covering how the planner turns SQL into a plan, how cost estimation works, why index scans can beat table scans, and a five-question quiz, then prepared it for build verification.

## 2026-05-07 — Sync first-content readiness document

Updated `docs/first-content-readiness.md` so its committed-content note reflects the full real `database-internals` post set now present in `src/content/posts/`. Kept validation fixtures explicitly separated under `test/fixtures/obsidian-vault/`.

## 2026-05-08 — Mirror agent guidance into .codex

Added `.codex/agents/` role guides for planning-lead, documentation-curator, and post-drafter so the Codex-side repository metadata matches the existing `.claude/agents/` structure. Also added `.codex/logs/troubleshooting.md` and updated `AGENTS.md` to state that `.claude` and `.codex` should stay in sync for agent and logging guidance.

## 2026-05-08 — Start network-protocols production phase

Synced `docs/astro-bootstrap.md` with the implemented concept routes and dual posts/concepts conversion workflow, and marked `docs/reading-ui-direction.md` as a resolved design record rather than a live description of the current UI. Promoted `src/content/posts/what-is-http.md` from `idea` to a full `review` draft with real concept links to DNS, TCP, and TLS, and advanced `src/content/posts/tcp-connection-and-reliability.md` to `outline` so the next post is ready for the repeatable production loop.

## 2026-05-08 — Enforce explicit published-only visibility

Changed Astro route generation so only posts explicitly marked `status: published` are exposed through `/posts/[slug]` and series pages. Updated the lifecycle, review, readiness, metadata, bootstrap, conversion-contract, and decision documents to match the stricter D-33 rule, and extended `scripts/check-content.mjs` to warn when a committed post omits `status` because omission now always excludes the post from production output.

## 2026-05-08 — Checkpoint after publish-only visibility change

### 완료한 작업
- `status: published`만 production route에 포함되도록 `src/pages/posts/[slug].astro`와 `src/pages/series/[series].astro`를 수정했다.
- `docs/status-lifecycle.md`, `docs/review-checklist.md`, `docs/first-content-readiness.md`, `docs/confirmed-decisions.md`, `docs/decision-log.md`, `docs/post-metadata.md`, `docs/astro-bootstrap.md`, `docs/obsidian-conversion-contract.md`를 새 D-33 규칙에 맞게 동기화했다.
- `scripts/check-content.mjs`에 `status` 누락 경고를 추가했다.
- `pnpm check:content`, `pnpm test:convert`, `pnpm build`를 실행해 검증했고, build 결과에서 `review`/`outline` 상태 글이 public route에 노출되지 않음을 확인했다.
- 변경을 `291c805` (`Require explicit published status for public posts`)로 커밋하고 `origin/develop`에 푸시했다.

### 미완료
- `src/content/.obsidian/workspace.json` 로컬 변경 1건은 이번 작업 범위 밖이라 남겨두었다.

### 주요 결정
- D-33은 이제 “`status: published`만 production 포함”으로 해석한다.
- `status`는 스키마상 optional로 유지하지만, 운영 규칙상 누락은 항상 비공개로 간주하고 검사 스크립트에서 경고한다.

## 2026-05-08 — Create GitHub issue hierarchy for simplified status model phase

Inspected the required repository files before issue creation: `docs/status-lifecycle.md`, `docs/review-checklist.md`, `docs/first-content-readiness.md`, `docs/confirmed-decisions.md`, `docs/decision-log.md`, `docs/content-model.md`, `src/pages/posts/[slug].astro`, `src/pages/series/[series].astro`, `src/content/posts/`, `scripts/check-content.mjs`, and `package.json`.

Created a new issue hierarchy in `whqtker-projects/blog` for the next repository phase:
- `#149` parent umbrella issue for simplifying the post status model and preparing bulk idea-stage intake
- `#143` AskUserQuestion issue for unresolved policy decisions
- `#144` environment-aware visibility implementation
- `#145` existing-content status migration
- `#146` validation and documentation alignment
- `#147` pilot idea-stage batch
- `#148` first larger bulk batch

Repository-grounded findings that shaped the issue set:
- The five-state model is still active in docs and schema.
- Production visibility is already explicit-published-only in both post and series routes.
- Local development currently follows the same hard-coded published-only filtering.
- `docs/content-model.md` still contains stale omitted-status language that no longer matches D-33 or the route code.
- Current committed posts already span `published`, `review`, `outline`, and `idea`, which makes migration work explicit rather than theoretical.

## 2026-05-08 — Confirm simplified status-model policy from Issue #143

Recorded the policy outcome for Issue `#143` in `docs/confirmed-decisions.md` and `docs/decision-log.md` without changing implementation yet.

Confirmed policy:
- Status model is reduced to `idea`, `draft`, `published`.
- Legacy `outline` and `review` both map to `draft`.
- Local development should show all posts.
- Vercel Preview / staging should follow production-style visibility.
- Missing `status` should be treated as an error under the new model.
- The first bulk idea-stage batch may include new series if the existing content-model and series-index rules are satisfied.

## 2026-05-09 — Implement environment-aware post visibility

Added `src/utils/post-visibility.ts` so post visibility is decided in one place. Updated `src/pages/posts/[slug].astro` and `src/pages/series/[series].astro` to show all posts during local development while keeping staged and production builds limited to `status: published`.

Updated `docs/content-model.md`, `docs/astro-bootstrap.md`, and `docs/deployment-workflow.md` so they describe the new split correctly: local dev shows all posts, but the `develop` Vercel Preview Deployment still mirrors production visibility.

Verification:
- `pnpm build`
- Confirmed generated static routes still include only published post pages in build output

Constraint encountered:
- Local `pnpm dev --host 127.0.0.1 --port 4321` verification could not complete in this sandbox because binding the local port failed with `listen EPERM`.

## 2026-05-09 — Migrate existing posts to simplified status values

Updated the two remaining legacy-status posts under `src/content/posts/` to match the simplified model:
- `what-is-http.md`: `review` → `draft`
- `tcp-connection-and-reliability.md`: `outline` → `draft`

This keeps all in-progress `network-protocols` work under a single non-public state while leaving all currently published `database-internals` posts explicitly `published`.

Verification:
- `pnpm build`
- Confirmed generated static routes still include only published post pages in build output

## 2026-05-09 — Align validation with the simplified status model

Updated `src/content.config.ts` so `status` is required and limited to `idea`, `draft`, `published`. Updated `scripts/check-content.mjs` so missing `status` now fails instead of warning, and so invalid status values fail explicitly against the simplified vocabulary.

Synchronized the status/validation docs that directly describe the contract: `docs/status-lifecycle.md`, `docs/post-metadata.md`, `docs/review-checklist.md`, `docs/first-content-readiness.md`, `docs/obsidian-conversion-contract.md`, `docs/astro-bootstrap.md`, and `docs/content-model.md`.

Verification:
- `pnpm check:content`
- `pnpm build`

## 2026-05-09 — Run pilot batch for idea-stage posts

Formalized the `network-protocols` series as the first pilot batch for the simplified status model in `docs/first-content-readiness.md`. The batch uses five already-committed posts with explicit `order` and `status`, covering both non-public states now in use: `draft` and `idea`.

To make the local-vs-production visibility rule directly testable, replaced the TypeScript-only visibility helper with `src/utils/post-visibility.js`, added a pure `visiblePostsForMode` function, and added `scripts/post-visibility.test.mjs` plus the `pnpm test:repo` script. This verifies that local development includes all posts while staged and production builds keep only `published` posts public.

Verification:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-09 — Add first bulk batch of idea-stage posts

Added the first larger intake batch as one coherent new confirmed series: `data-structures`. Created `src/content/series_indexes/data-structures.md` first, then added five explicit `status: idea` posts with contiguous ordering:
- `what-is-an-array.md`
- `linked-list.md`
- `stack-and-queue.md`
- `hash-table.md`
- `binary-search-tree.md`

Documented the batch in `docs/first-content-readiness.md` so the grouping rule is explicit: one series index, one contiguous order block, all idea-stage, one reviewable series-level diff.

Verification:
- `pnpm check:content`
- `pnpm build`
- Confirmed `/series/data-structures` is generated while no new public post routes are created for the idea-stage files

## 2026-05-09 — Audit hierarchical-series issue structure for completeness

Inspected the current hierarchical-series planning issues and the flat-series assumptions still present in repository docs and code.

Confirmed that the previously missing structural issues already exist and are still open:
- `#159` umbrella parent issue for the full parent-child migration phase
- `#157` dedicated `Computer Networks` backlog restructuring issue
- `#158` dedicated series-documentation refactor issue

Also re-verified the repository state those issues are grounded in:
- `docs/content-model.md`, `docs/astro-bootstrap.md`, `src/content.config.ts`, `scripts/check-content.mjs`, `src/pages/index.astro`, and `src/pages/series/[series].astro` still describe and implement a flat series model
- `src/content/series_indexes/network-protocols.md` and `src/content/series_indexes/data-structures.md` are real current flat series
- the simplified post status model and local-vs-production visibility split remain in place and should not be reopened by the hierarchy work

Result:
- No new GitHub issues were created in this audit because creating duplicates would have made the structure worse
- No existing issue text needed edits; the current `#151`–`#159` set already forms a complete dependency chain for the migration

## 2026-05-09 — Record parent-child series IA contract for Issue #152

Used the decisions already confirmed in issue `#151` to define the actual information-architecture contract for the hierarchical-series migration.

Documented in `docs/confirmed-decisions.md` and `docs/decision-log.md` that:
- parent series are navigation containers and do not own posts directly
- child series belong to exactly one parent and are the terminal ordered content containers
- the homepage remains parent-only
- parent pages list child series, while child pages list posts and provide breadcrumb/navigation context

This keeps issue `#152` narrowly focused on IA responsibilities before schema, routing, validation, and migration implementation begin.

## 2026-05-09 — Make hierarchical-series IA explicit in content docs

Updated `docs/content-model.md` to become the authoritative parent-child series IA contract for the migration phase instead of leaving the target model implicit in decision records only.

Made the following implementation-facing rules explicit:
- the hierarchy is exactly parent series -> child series -> posts
- no third hierarchy level is allowed
- parent series do not own posts directly
- posts attach to child series only
- concepts remain outside the hierarchy
- homepage lists parent series only
- parent pages list child series
- child pages list posts and provide the series context used by breadcrumbs and prev/next navigation

Also updated `docs/astro-bootstrap.md` to distinguish the current flat implementation from the confirmed target hierarchy so route docs do not silently contradict the new IA contract.

## 2026-05-09 — Implement hierarchical series schema and routing for Issues #153 and #154

Extended `src/content.config.ts` so `series_indexes` can represent both parent and child series with an optional `parent` field. Added parent series index documents for:
- `computer-networks`
- `database-systems`
- `data-structures-and-algorithms`

Migrated the current real series index documents into child series by adding `parent`:
- `network-protocols` -> `computer-networks`
- `database-internals` -> `database-systems`
- `data-structures` -> `data-structures-and-algorithms`

Implemented the route split required by the IA contract:
- homepage now lists parent series only
- `src/pages/series/[parent].astro` renders parent pages with child-series listings
- `src/pages/series/[parent]/[child].astro` renders child pages with ordered visible posts
- `src/pages/posts/[slug].astro` and `src/layouts/PostLayout.astro` now resolve breadcrumb and series context through the parent/child hierarchy

Added `src/utils/series-hierarchy.ts` so hierarchy lookup and route-path construction are shared instead of duplicated across routes.

Updated the directly affected docs:
- `docs/content-model.md`
- `docs/astro-bootstrap.md`
- `docs/series-index-authoring.md`

Verification:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`
- confirmed static routes for `/series/computer-networks`, `/series/computer-networks/network-protocols`, `/series/database-systems/database-internals`, and `/series/data-structures-and-algorithms/data-structures`

## 2026-05-09 — Finish hierarchical-series validation and content migration for Issues #155 and #156

Extended `scripts/check-content.mjs` so repository validation now understands the parent-child series structure instead of only flat series membership.

Added hierarchy-specific checks for:
- invalid or self-referential parent links
- children pointing at other children as parents
- posts attaching directly to parent series instead of child series
- preservation of the existing published-order and explicit-status invariants under the new structure

Completed the migration-facing documentation so the current real child series are explicitly mapped under their new parents:
- `database-internals` -> `database-systems`
- `network-protocols` -> `computer-networks`
- `data-structures` -> `data-structures-and-algorithms`

Updated the directly affected docs:
- `docs/series-backlog.md`
- `docs/first-content-readiness.md`

Verification:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-09 — Remove child-series count from homepage parent listing

Removed the homepage `n child series` metadata from `src/pages/index.astro` so the parent-series directory stays focused on title and description only.

## 2026-05-09 — Rebuild Computer Networks backlog and finish hierarchy doc refactor for Issues #157, #158, and #159

Rebuilt the `computer-networks` parent backlog into three child series while keeping the confirmed `network-protocols` slug:
- `network-protocols`
- `transport-and-reliability`
- `naming-and-routing`

Moved the existing backlog items into those child series and added two minimal idea-stage backlog files so the new sibling series are coherent:
- `tcp-connection-and-reliability.md` -> `transport-and-reliability`
- `dns-resolution.md` -> `naming-and-routing`
- added `udp-and-quic.md`
- added `ip-addressing-and-routing.md`

Kept `what-is-http.md`, `tls-and-https.md`, and `http2-and-http3.md` under the retained `network-protocols` child slug, with adjusted ordering for the narrowed scope.

Completed the series-documentation refactor around the new backlog shape by updating:
- `docs/confirmed-decisions.md`
- `docs/decision-log.md`
- `docs/series-backlog.md`
- `docs/first-content-readiness.md`
- `docs/post-metadata.md`
- `docs/reading-ui-direction.md`

Verification:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`
- confirmed static routes for `/series/computer-networks/network-protocols`, `/series/computer-networks/transport-and-reliability`, and `/series/computer-networks/naming-and-routing`
