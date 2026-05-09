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

## 2026-05-09 — Physically nest child series indexes under parent directories

Reorganized `src/content/series_indexes/` so the filesystem now mirrors the existing two-level series model: parent indexes remain at the root, and child indexes now live at `src/content/series_indexes/<parent-slug>/<child-slug>.md`.

Updated `scripts/check-content.mjs` to read `series_indexes` recursively and to enforce the new path contract without replacing frontmatter as the source of truth. Parent indexes must stay at `src/content/series_indexes/<parent>.md`, child indexes must live under the directory named by their `parent`, and file names must match `series`.

Synchronized `docs/content-model.md`, `docs/series-index-authoring.md`, and `docs/astro-bootstrap.md` so the physical directory layout is now documented as part of the repository contract.

## 2026-05-09 — Add computer-architecture parent and child series backlog

Added the `computer-architecture` parent series in repository style and created eight child series under it: `architecture-overview`, `cpu-and-instruction-execution`, `computer-arithmetic`, `control-unit`, `memory-systems`, `storage-systems`, `bus-io-and-interrupts`, and `parallel-and-high-performance-architecture`.

Populated those child series with 55 new idea-stage backlog posts under `src/content/posts/`. Every post uses explicit `title`, `series`, `order`, and `status: idea`, with contiguous ordering inside each child series and a minimal body stub.

Repository-specific adjustment:
- Reused an existing untracked local file at `src/content/series_indexes/computer-architecture.md` as the requested parent series index, normalizing its title and description to match the current repository conventions instead of creating a duplicate slug.

Formalized the `network-protocols` series as the first pilot batch for the simplified status model in `docs/first-content-readiness.md`. The batch uses five already-committed posts with explicit `order` and `status`, covering both non-public states now in use: `draft` and `idea`.

To make the local-vs-production visibility rule directly testable, replaced the TypeScript-only visibility helper with `src/utils/post-visibility.js`, added a pure `visiblePostsForMode` function, and added `scripts/post-visibility.test.mjs` plus the `pnpm test:repo` script. This verifies that local development includes all posts while staged and production builds keep only `published` posts public.

Verification:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-09 — Refine the database-systems parent with sibling pre-internals layers

### 완료한 작업
`database-systems` parent를 `database-foundations`, `data-modeling-and-design`, `relational-queries-and-joins`, `database-internals`의 4-child 구조로 정리했다.

다음 파일들을 실제로 갱신했다.
- `docs/series/database-systems.md`
- `docs/series-backlog.md`
- `docs/first-content-readiness.md`
- `docs/post-metadata.md`
- `docs/confirmed-decisions.md`
- `docs/decision-log.md`
- `src/content/series_indexes/database-systems/database-internals.md`

다음 child series index를 새로 만들었다.
- `src/content/series_indexes/database-systems/database-foundations.md`
- `src/content/series_indexes/database-systems/data-modeling-and-design.md`
- `src/content/series_indexes/database-systems/relational-queries-and-joins.md`

새 child들 아래에 13개의 idea-stage post stub을 추가했다.

검증을 완료했다.
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

변경은 커밋 `158a721` (`Refine database systems series structure`)로 `origin/develop`에 푸시했다.

### 미완료
없음

### 주요 결정
`database-internals`는 published anchor로 유지하고, foundations/modeling/query-semantics 층은 sibling child series로 앞단에 추가한다.

## 2026-05-09 — Roll out the operating-systems parent as a backlog-first hierarchy

### 완료한 작업
`operating-systems` parent를 새로 만들고 `operating-systems-overview`, `processes-and-threads`, `scheduling-and-synchronization`, `memory-management`, `file-systems-and-storage`의 5-child 구조를 추가했다.

다음 파일들을 실제로 만들거나 갱신했다.
- `src/content/series_indexes/operating-systems.md`
- `src/content/series_indexes/operating-systems/*.md`
- `docs/series/operating-systems.md`
- `docs/series-backlog.md`
- `docs/first-content-readiness.md`
- `docs/post-metadata.md`
- `docs/confirmed-decisions.md`
- `docs/decision-log.md`

운영체제 parent 아래에 23개의 idea-stage post stub을 추가했다.

검증을 완료했다.
- `pnpm check:content`
- `pnpm build`

### 미완료
없음

### 주요 결정
운영체제는 초기 backlog 단계이므로 child series를 과도하게 잘게 쪼개지 않고, deadlock은 `scheduling-and-synchronization`, 파일시스템과 저장장치는 `file-systems-and-storage`로 묶는다.

## 2026-05-09 — Roll out numeric title prefixes to the Computer Architecture backlog

Applied optional numeric title prefixes to the idea-stage `computer-architecture` backlog posts only. File names and explicit `order` fields were left unchanged; the visible prefixes now mirror the existing `order` values within each child series.

Cleaned up the remaining directly affected docs:
- `docs/file-naming-conventions.md` now distinguishes filename prefixes from visible title prefixes
- `docs/first-content-readiness.md` now uses the current nested child-series index paths

## 2026-05-09 — Forbid agent edits to published posts

Added a repository operating rule in `AGENTS.md` that agents must not modify any post already marked `status: published` under `src/content/posts/`.

Mirrored the same restriction into `.codex/agents/post-drafter.md` and `.claude/agents/post-drafter.md` so content-writing agents treat published posts as author-only content unless the repository rule itself is explicitly changed later.

## 2026-05-09 — Implement child-series order metadata and ordering validation

Implemented the repository follow-up for issues `#162` through `#165` after the AskUserQuestion policy was resolved in `D-68` through `D-71`.

Added optional schema support for `series_indexes.order` in `src/content.config.ts`, then updated all existing child series indexes under `computer-architecture`, `computer-networks`, `database-systems`, and `data-structures-and-algorithms` to declare explicit `order` values. Parent series remain unordered.

Updated sorting so child series are ordered by `order ASC`, with `title ASC` only as a fallback in `src/utils/series-hierarchy.ts`. Updated child-page post lists and post prev/next derivation to use `order ASC`, `title ASC` as the deterministic fallback.

Extended `scripts/check-content.mjs` to enforce the new contract:
- parent series must not declare `order`
- child series must declare a positive integer `order`
- child-series `order` must be unique within each parent
- numeric post title prefixes, when present, must match explicit post `order`

Synchronized the directly affected contract docs:
- `docs/content-model.md`
- `docs/series-index-authoring.md`
- `docs/post-metadata.md`
- `docs/astro-bootstrap.md`

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

## 2026-05-09 — Stabilize series operations after hierarchy and ordering rollout

Implemented the practical follow-up for the stabilization phase:
- created `docs/series/` with one maintained parent-level operating document for each current real parent series
- removed the post-page breadcrumb `#order` cue so title prefixes remain the only visible numbering on numbered posts
- refactored `scripts/check-content.mjs` into reusable validation exports while preserving the existing CLI checks
- added repository regression tests for series hierarchy ordering and content-validation invariants
- aligned backlog/readiness/bootstrap/content-model docs with the new `docs/series/` operating layer and the finalized numbering presentation rule

Verification:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-09 — Refine the computer-networks parent around a course-style learning arc

Reworked `computer-networks` so the child-series layout now starts with `network-foundations`, keeps `transport-and-reliability`, renames the old naming/routing child to `internet-addressing-and-routing`, and moves `network-protocols` to the last application-facing position.

Added new idea-stage backlog files for foundations, TCP internals, and internet-layer topics; reassigned `dns-resolution.md` into `network-protocols`; and replaced the old broad `ip-addressing-and-routing.md` stub with `ip-addressing-and-subnetting.md` plus narrower sibling stubs.

Synchronized the directly affected operating and decision docs: `docs/series/computer-networks.md`, `docs/series-backlog.md`, `docs/first-content-readiness.md`, `docs/post-metadata.md`, `docs/confirmed-decisions.md`, and `docs/decision-log.md`.

## 2026-05-09 — Refine the database-systems parent around a course-style learning arc

Expanded `database-systems` with three new sibling child series ahead of the existing published `database-internals` anchor:
- `database-foundations`
- `data-modeling-and-design`
- `relational-queries-and-joins`

Kept all published `database-internals` posts unchanged, moved only the child-series order metadata, and added idea-stage post stubs for the new child series.

Updated the directly affected docs and decision records so the repository now describes `database-systems` as a full parent-level arc instead of a one-child shell.

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

## 2026-05-09 — Resolve `develop` vs `master` merge conflicts after hierarchical-series PR work

Merged `origin/master` back into `develop` after the hierarchical series migration diverged from the earlier flat-series/status work now present on `master`.

Resolved conflicts by preserving the hierarchy-aware `develop` implementation for:
- parent/child series documentation
- hierarchy-aware validation in `scripts/check-content.mjs`
- parent/child route structure and post breadcrumb context
- child-series content assignments such as `transport-and-reliability`

Dropped the retired flat route `src/pages/series/[series].astro` during the merge and kept the homepage parent listing without the child-count metadata.

Verification:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`
## 2026-05-09 — Roll out Korean display policy for operating-systems metadata

Locked the repository's language/display split more explicitly in docs so English filenames and slugs remain identifier-only fields while Korean is the intended display language for new and editable series titles, post titles, and future post bodies.

Synchronized the `operating-systems` parent rollout across `docs/series-backlog.md`, `docs/first-content-readiness.md`, `docs/series/operating-systems.md`, `src/content/series_indexes/operating-systems*.md`, and the OS idea-stage post stubs under `src/content/posts/`. Only reader-facing `title` values changed; filenames, slugs, `series`, `order`, `status`, and stub bodies were preserved.

Verification target:
- `pnpm check:content`
- `pnpm build`

## 2026-05-09 — Add separate Spring Framework and Spring Boot parents

Added two distinct Spring parent directions instead of collapsing them into one mixed tree. Created parent operating docs, parent and child series indexes, and idea-stage post stubs for `spring-framework` and `spring-boot`.

Synchronized the repository-facing docs so the new slugs, child ordering, and backend-systems mapping are reflected consistently in `docs/series-backlog.md`, `docs/first-content-readiness.md`, `docs/post-metadata.md`, and the decision records.

Verification target:
- `pnpm check:content`
- `pnpm build`

## 2026-05-09 — Add graph-friendly series links and backlog backfill

Extended `scripts/obsidian-to-astro.mjs` with explicit `[[series:<parent>]]` and `[[series:<parent>/<child>]]` link conversion, added unresolved-series warning coverage, and expanded `scripts/obsidian-to-astro.test.mjs` accordingly.

Updated graph-link authoring policy across `docs/content-model.md`, `docs/post-template.md`, `docs/first-content-readiness.md`, and `docs/series-index-authoring.md`. Backfilled the `operating-systems`, `spring-framework`, and `spring-boot` parent/child indexes plus their idea-stage post stubs with minimal internal links so graph connectivity no longer depends on frontmatter alone.

Verification:
- `pnpm test:convert`
- `pnpm check:content`
- `pnpm build`
