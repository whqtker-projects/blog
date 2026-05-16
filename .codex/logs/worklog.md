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

## 2026-05-10 — Narrow graph-link rollout to series indexes only

Kept explicit `[[series:<parent>]]` and `[[series:<parent>/<child>]]` conversion support intact, but narrowed the repository policy so graph-friendly link usage is limited to parent-series and child-series index bodies. Updated `docs/content-model.md`, `docs/post-template.md`, `docs/first-content-readiness.md`, and `docs/series-index-authoring.md` to remove the post-stub related-links expectation.

Removed graph-connectivity backfill blocks from the recent operating-systems and Spring idea-stage post stubs, restoring them to minimal stub-safe bodies. Simplified the operating-systems, spring-framework, and spring-boot series index bodies so parent indexes link to child indexes and child indexes link back to their parent only.

## 2026-05-10 — Add Python series relationship printer

Added `scripts/print_series_relationships.py` to read `src/content/series_indexes/` and `src/content/posts/`, build the current parent-series / child-series / post hierarchy, and print it in `tree` or `json` format. The script derives post slugs from filenames, respects child/post ordering metadata, supports filtering by parent slug and post status, and delegates structural validation to `pnpm check:content` unless `--skip-validation` is passed.

Updated `package.json` with `pnpm print:series-tree` and `pnpm print:series-json` for direct execution.

## 2026-05-11 — Fix pasted image rendering path

Updated the Spring Framework draft so the IoC container pasted image uses standard Markdown image syntax and resolves from `src/content/attachments/`. Adjusted the Obsidian conversion script to percent-encode pasted image filenames and emit relative `../attachments/...` image paths, which keeps Obsidian-managed images inside the `src/content` vault without requiring a `public/images/` copy.

## 2026-05-11 — Push attachment workflow and all remaining local changes

### 완료한 작업
Obsidian pasted image workflow를 `src/content/attachments/` 기준으로 정리하고, 관련 변환기와 문서를 검증했다. 먼저 이미지 처리 인프라와 문서만 분리해서 `Support Obsidian attachments under src/content` 커밋으로 푸시했고, 이후 사용자 요청에 따라 남아 있던 draft post 수정, `src/content/.obsidian/` 설정과 플러그인 파일, `src/content/attachments/` 이미지 파일까지 전부 `Add in-progress content and Obsidian updates` 커밋으로 추가 푸시했다.

검증은 두 단계 모두에서 `pnpm check:content`와 `pnpm build`로 확인했고, 이미지 변환 관련 변경은 `pnpm test:convert`까지 통과했다. 최종 상태에서 로컬 작업 트리는 비워졌다.

### 미완료
없음

### 주요 결정
사용자가 명시적으로 요청하기 전까지는 대량의 draft post와 `.obsidian` 변경을 인프라 변경 커밋에 섞지 않고 분리한다. 사용자가 전체 푸시를 명시하면 그 시점에 남은 draft/Obsidian/attachment 변경까지 한 번에 커밋해 반영한다.

## 2026-05-11 — Add child series operating notes

`docs/series/README.md`를 추가해 parent note와 child note의 역할을 분리하고, `docs/series/<parent>/<child>.md` 경로 규약을 문서화했다. 각 child series마다 하나씩 운영 노트를 만들어 `Current focus`, `Next target`, 그리고 `Order | Slug | Working title | Status | Notes` 표를 넣어 Obsidian에서 다음 글을 별도 개요 문서로 확인할 수 있게 했다.

기존 parent 운영 문서도 함께 정리했다. child operating note 링크를 추가했고, stale 했던 `idea` 기준 posture를 현재 실제 `draft`/`published` 상태에 맞게 갱신했다. `docs/first-content-readiness.md`와 `docs/series-backlog.md`도 `docs/series/`가 parent-only 레이어가 아니라 parent+child 운영 레이어라는 현재 규약에 맞게 수정했다.

검증:
- `find docs/series -mindepth 2 -maxdepth 2 -type f | wc -l` = `28`
- `find src/content/series_indexes -mindepth 2 -maxdepth 2 -type f | wc -l` = `28`

## 2026-05-11 — Replace child notes with graph links in content files

사용자 목표를 `docs/series` child note가 아니라 Obsidian 그래프뷰 기준으로 다시 맞췄다. 잘못 추가했던 `docs/series/<parent>/<child>.md` child 운영 노트와 `docs/series/README.md`는 제거하고, 실제 그래프에 잡히는 콘텐츠 파일 쪽에 링크를 넣는 방식으로 정리했다.

`src/content/series_indexes/`는 parent index가 ordered child series 링크를, child index가 상위 시리즈 링크와 ordered post wikilink 목록을 갖도록 정규화했다. `src/content/posts/`의 editable `draft` 포스트들은 frontmatter 아래에 상위 시리즈, 소속 child series, 이전 글, 다음 글 링크 블록을 넣어 그래프에서 시리즈 관계와 순서를 함께 볼 수 있게 했다. `published` 포스트는 저장소 규칙에 따라 수정하지 않았다.

관련 문서도 새 방향에 맞춰 갱신했다. `docs/content-model.md`, `docs/post-template.md`, `docs/series-index-authoring.md`, `docs/first-content-readiness.md`, `docs/series-backlog.md`, `docs/confirmed-decisions.md`, `docs/decision-log.md`에서 series index body의 ordered post links와 post-level graph links를 허용하도록 설명을 바꿨다.

검증:
- `pnpm test:convert`

## 2026-05-11 — Add graph tags and Obsidian color groups

Obsidian 그래프에서 대시리즈, 소시리즈, 게시글 노드를 색으로 구분할 수 있도록 `src/content/series_indexes/`와 `src/content/posts/` frontmatter에 태그를 일괄 추가했다. parent series index에는 `graph/parent-series`, child series index에는 `graph/child-series`, post에는 `graph/post`를 넣었다.

`src/content/.obsidian/graph.json`에는 세 가지 색상 그룹을 추가했다. query는 `tag:#graph/parent-series`, `tag:#graph/child-series`, `tag:#graph/post`를 사용하고, 색상은 각각 파랑, 주황, 회색 계열로 설정했다. `showTags`는 그대로 `false`로 두어 태그 노드 자체는 보이지 않게 유지했다.

검증:
- `pnpm test:convert`
- `pnpm check:content`

## 2026-05-11 — Automate series graph aliases

`series:*` 링크가 Obsidian 그래프에서 실제 series index 노드로 resolve되도록 series index frontmatter에 `aliases`를 추가하되, 수동 관리 비용이 생기지 않도록 자동화했다.

추가한 작업:
- `scripts/sync-series-graph-metadata.mjs`: `series`와 `parent`에서 `aliases`와 graph `tags`를 파생해 `src/content/series_indexes/`에 반영
- `package.json`: `pnpm sync:series-graph` 명령 추가
- `scripts/check-content.mjs`: Check 10으로 series graph alias/tag가 파생값과 일치하는지 검증
- `scripts/check-content.test.mjs`: stale alias/tag 거부 테스트 추가
- `src/content.config.ts`: posts `tags`, series indexes `aliases`/`tags`를 schema에 명시

문서도 갱신했다. `docs/series-index-authoring.md`, `docs/content-model.md`, `docs/obsidian-conversion-contract.md`, `docs/post-metadata.md`, `docs/confirmed-decisions.md`, `docs/decision-log.md`에서 `aliases`와 graph tags를 사람이 직접 설계하는 필드가 아니라 파생 호환 메타데이터로 정의했다.

검증:
- `pnpm sync:series-graph`
- `pnpm test:convert`
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-11 — Use real file links for Obsidian graph wiring

Obsidian 그래프에서 parent series의 자식 노드가 child series 색상으로 보이지 않는 문제를 정리했다. 원인은 `[[series:<parent>/<child>]]`가 변환기에는 의미 있는 네임스페이스 링크지만, Obsidian 그래프에서는 콜론과 슬래시가 섞인 경로형 unresolved 링크로 남을 수 있다는 점이었다.

`pnpm sync:series-graph`를 확장해 graph-visible 링크를 실제 vault 파일 링크로 재생성하도록 바꿨다. Parent series index는 `[[series_indexes/<parent>/<child>]]`로 child series 파일을 직접 가리키고, child series index와 draft posts도 `[[series_indexes/<parent>]]`, `[[series_indexes/<parent>/<child>]]` 형태로 연결한다. `series:*` aliases는 변환기 호환 메타데이터로 유지하지만 그래프 연결선의 기준으로는 쓰지 않는다.

Obsidian graph color group query도 `tag:#graph/...` 형태로 조정했다.

검증:
- `pnpm sync:series-graph`
- `pnpm test:convert`
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-11 — Keep parent series nodes disconnected from post nodes

Obsidian 그래프에서 파란 parent series 노드가 회색 post 노드와 직접 연결되지 않도록 graph block 규칙을 조정했다. `scripts/sync-series-graph-metadata.mjs`가 draft post에 생성하는 `관련 링크` 블록에서 parent series 링크를 제거하고, post는 child series와 이전/다음 post에만 직접 연결되도록 했다.

결과 그래프 구조는 parent series → child series → post가 된다. Parent-child 연결은 series index 파일끼리, child-post 연결은 child series index의 ordered post list와 post의 소속 child link가 담당한다.

검증:
- `pnpm sync:series-graph`
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm test:convert`
- `pnpm build`

## 2026-05-11 — Restore Obsidian graph color groups through sync script

Obsidian 그래프 뷰를 닫고 다시 열 때 `src/content/.obsidian/graph.json`의 `colorGroups`가 빈 배열로 저장되어 색상 설정이 사라지는 문제를 확인했다. 단순 수동 설정은 Obsidian의 마지막 UI 상태 저장에 의해 지워질 수 있으므로, `pnpm sync:series-graph`가 graph metadata뿐 아니라 Obsidian graph color groups까지 복구하도록 확장했다.

색상 그룹은 `tag:#graph/parent-series`, `tag:#graph/child-series`, `tag:#graph/post` 세 query를 사용한다. `showTags`는 `false`로 유지해 태그 노드는 숨기고, 태그는 노드 색상 분류에만 사용한다.

검증:
- `pnpm sync:series-graph`
- `pnpm check:content`
- `pnpm test:repo`

## 2026-05-11 — Hide Obsidian graph link blocks from web rendering

Post 원본의 `관련 링크:` 블록은 Obsidian graph view에서 시리즈와 이전/다음 글 관계를 보기 위한 authoring metadata로 유지하되, 웹 페이지에는 노출되지 않도록 Markdown 렌더링 단계에서 제거했다.

`astro.config.mjs`에 `remarkHideObsidianRelatedLinks` plugin을 연결했다. 이 plugin은 top-level `관련 링크:` 문단 뒤에 `상위 시리즈:`, `소속 시리즈:`, `이전 글:`, `다음 글:` 라벨만 포함된 bullet list 또는 plain paragraph가 있을 때 해당 블록을 제거한다. 일반적인 reader-facing `관련 링크:` 섹션은 제거하지 않는다.

검증:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-16 — Add IoC/DI example outline stub

`src/content/examples/ioc-di-order-service-demo.md`를 추가해 `ioc-and-di` 게시글에 연결되는 draft example stub를 만들었다. 본문 설명은 쓰지 않고, project example로 확장할 때 채울 수 있도록 목차 수준의 heading만 넣었다.

검증:
- `pnpm check:content`
- `pnpm build`
- `pnpm test:convert`
- `rg -n "관련 링크" dist || true`

## 2026-05-14 — Render Obsidian image wikilinks directly in Astro

게시글 원문에 `![[Pasted image ...]]` 형식을 그대로 유지하면서도 Astro 웹 렌더링에서 이미지를 정상 처리하도록 remark plugin을 추가했다. 이 plugin은 Markdown AST의 text node 안에 있는 Obsidian 이미지 wikilink를 찾아 현재 파일 위치 기준 상대 `attachments/` 경로의 image node로 바꾼다.

이제 `src/content/posts/`와 `src/content/series_indexes/`에서 직접 작성한 `![[...]]`도 별도 수동 변환 없이 렌더링된다. Astro build는 이를 최적화 이미지로 처리하고, 기존 `관련 링크` 제거 plugin과 함께 동작한다.

검증:
- `pnpm test:repo`
- `pnpm build`
- `rg -n "!\\[\\[|_astro/" dist/posts/configuration-class-and-component-scan/index.html dist/posts/bean-lifecycle-and-scope/index.html`

## 2026-05-15 — Create repository-maintenance backlog issues for series tooling and rendering

코드베이스 레벨 개선 항목만 대상으로 기존 open issue 중복 여부를 먼저 확인한 뒤, 시리즈 그래프 동기화 정책 정렬, 문서 동기화, Python relationship printer 테스트, 타이틀 기반 필터 ambiguity 처리, post ordering 유틸 추출, SeriesList 컴포넌트 추출, `remark-hide-obsidian-related-links` 유지 여부 검토, script helper 통합, SEO metadata 개선, visibility 모드 문서화에 대한 GitHub issue 10건을 생성했다.

모호한 설계 선택은 issue 본문에서 모두 `Decision required`로 분리했고, 구현 범위와 acceptance criteria는 결정 이후 바로 작업 가능한 수준으로 구체화했다. 생성된 이슈는 `#184`부터 `#193`까지다.

## 2026-05-15 — Narrow series graph sync to series-index relationships only

`#184` 결정에 따라 `scripts/sync-series-graph-metadata.mjs`는 이제 series index frontmatter(`aliases`, `tags`), parent/child series index body links, `src/content/.obsidian/graph.json` color groups만 관리한다. child series index body에 들어가던 `게시글 순서` inventory 생성과 draft post 본문 `관련 링크:` 주입 로직은 제거했다.

동시에 `docs/content-model.md`와 `docs/series-index-authoring.md`의 직접 충돌 문구를 줄여 현재 정책과 스크립트 동작이 어긋나지 않도록 맞췄고, `scripts/sync-series-graph-metadata.test.mjs`를 추가해 child body가 parent link만 유지하고 post inventory를 다시 만들지 않음을 고정했다. `pnpm sync:series-graph` 실행으로 child series index 본문에 남아 있던 generated post inventory도 정리됐다.

검증:
- `pnpm sync:series-graph`
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-15 — Synchronize series authoring docs with series-index-only graph policy

`#185` 결정에 따라 series graph authoring 표준 예시는 `[[series_indexes/<parent>]]`, `[[series_indexes/<parent>/<child>]]` 형태의 실제 Obsidian file link로 통일했다. `docs/content-model.md`, `docs/series-index-authoring.md`, `docs/post-template.md`, `docs/first-content-readiness.md`에서 child series index의 ordered post wikilink 허용, post body graph block 기대, sibling child link를 기본처럼 읽히게 하는 문구를 제거하거나 축소했다.

문서 전반에서 현재 정책을 명시적으로 맞췄다: parent index는 child index를 링크할 수 있고, child index는 parent index를 링크할 수 있으며, sibling child link는 선택적이다. post stub은 frontmatter와 최소 본문만으로 유효하고 graph-link block이 필요하지 않다. `[[series:...]]` 표기는 converter-supported syntax로만 남기고 기본 graph wiring 예시에서는 제외했다.

## 2026-05-15 — Tighten idea-state stub guidance in first-content-readiness

`docs/first-content-readiness.md`의 `idea` 상태 안내에서 post body graph link를 선택적으로 허용하거나 권장하는 뉘앙스를 제거했다. 현재 정책에 맞게 `idea` 상태의 핵심은 required frontmatter 충족이며, frontmatter-only stub 또는 최소 본문 메모만으로도 유효하다고 다시 명시했다.

또한 `status`는 초기 작성 단계에서도 명시적으로 필요하고, `status: published`만 staged/production에 포함되므로 `idea` 글은 공개 사이트에 나오지 않는다는 설명만 남겼다.
## 2026-05-15 — Remove obsolete related-links remark plugin and extract Node content helpers

Removed `remark-hide-obsidian-related-links` from the Astro markdown pipeline, deleted its implementation and test, and updated `package.json` so repository tests no longer reference the retired plugin.

Added `scripts/node-content-helpers.mjs` as a shared Node-only helper for recursive Markdown traversal and simple frontmatter parsing. Migrated `scripts/check-content.mjs` and `scripts/sync-series-graph-metadata.mjs` to the shared helper, and updated `scripts/obsidian-to-astro.mjs` to reuse the shared recursive Markdown file listing while keeping its existing frontmatter-splitting behavior unchanged.

Verification:
- `pnpm test:repo`
- `pnpm test:convert`
- `pnpm check:content`
- `pnpm build`

## 2026-05-15 — Finish repository-maintenance backlog issues #186–#193

`scripts/print_series_relationships.py`에 대한 Python `unittest` 기반 테스트를 추가하고, 제목 기반 `TARGET` 해석이 parent/child/post 사이에서 모호할 때 slug 사용을 요구하는 명확한 에러를 내도록 바꿨다. 테스트 실행용 `pnpm test:python`도 `package.json`에 노출했다.

Astro 쪽에서는 post ordering을 `src/utils/post-ordering.ts`로 공통화하고, 홈/parent series 목록 UI를 `src/components/SeriesList.astro`로 추출했다. 동시에 `BaseLayout.astro`가 site-name suffix, `og:site_name`, configurable `og:type`을 관리하도록 정리하고, post pages는 `og:type=article`을 사용하도록 맞췄다. Visibility 문서는 `docs/astro-bootstrap.md`와 `src/utils/post-visibility.js` 기준으로 고정 동작을 명시했다.

검증:
- `pnpm test:python`
- `pnpm test:repo`
- `pnpm test:convert`
- `pnpm check:content`
- `pnpm build`

## 2026-05-15 — Add direct tests for shared Node content helpers

`scripts/node-content-helpers.mjs`가 repository validation과 sync script의 공통 기반이므로, helper 자체 계약을 직접 고정하는 `scripts/node-content-helpers.test.mjs`를 추가했다. 테스트는 frontmatter scalar/list parsing, nested markdown discovery, normalized relative record 반환을 temp directory 기반으로 검증한다.

`package.json`의 `pnpm test:repo`에도 이 테스트를 포함해 helper 변경이 다른 script 테스트에 간접적으로만 의존하지 않도록 했다.

## 2026-05-15 — Restore child-series post inventories for Obsidian visibility

사용자 요구에 맞춰 `pnpm sync:series-graph`가 child series index body의 ordered post wikilink 목록을 다시 생성하도록 복구했다. 이제 `src/content/series_indexes/spring-framework/spring-core.md` 같은 child index note 안에서 소속 게시글을 바로 볼 수 있고, Obsidian graph/authoring 흐름에서도 series membership이 드러난다.

`scripts/sync-series-graph-metadata.mjs`는 child series별 post를 `order`와 `title` 기준으로 정렬해 `게시글 순서:` 블록을 쓴다. 관련 문서(`docs/content-model.md`, `docs/series-index-authoring.md`, `docs/first-content-readiness.md`)도 child index의 ordered post links를 허용하는 현재 의도에 맞게 수정했다.

검증:
- `pnpm sync:series-graph`
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-15 — Add optional project-style examples as post-attached pages

`examples` collection과 `/posts/<slug>/examples/<example>` route를 추가해 긴 구현 예시를 post 본문 밖의 별도 페이지로 분리할 수 있게 했다. Inline snippet은 여전히 post body에 남고, project-style example만 `src/content/examples/<post-slug>/<example-slug>.md`에 수동 authoring하는 구조다.

Validation도 확장했다. 각 example은 정확히 하나의 post slug를 가리켜야 하고, file path의 상위 디렉터리도 그 post slug와 일치해야 하며, published example끼리는 같은 post 아래에서 `order`가 중복되면 안 된다. Visibility는 posts와 동일하게 local dev에서는 `idea`/`draft`/`published`, staged/production에서는 `published`만 노출되도록 맞췄다.

검증:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-16 — Remove standalone concept pages and concept collection support

`concepts` collection, `/concepts/[slug]` route, committed concept seed files, 그리고 `docs/concept-authoring-workflow.md`를 삭제했다. 활성 콘텐츠 타입은 이제 `posts`, `examples`, `series_indexes`만 남고, `[[concept:slug]]`는 더 이상 지원하지 않는다.

`scripts/obsidian-to-astro.mjs`도 `--concepts` / `--concepts-output` 옵션과 개념 링크 변환을 제거했다. 대신 legacy `[[concept:...]]`를 만나면 해당 파일 변환을 즉시 실패시키고, inline definition text나 normal post link로 바꾸라고 명시적으로 안내한다. 남아 있던 `/concepts/...` 실제 참조는 `src/content/posts/what-is-http.md`에서 최소 수정으로 제거했다.

검증:
- `pnpm test:convert`
- `pnpm check:content`
- `pnpm build`

## 2026-05-16 — Flatten example files and reduce example frontmatter

`examples`는 더 이상 `src/content/examples/<post-slug>/<example-slug>.md` 구조를 강제하지 않는다. 파일은 `src/content/examples/<example-slug>.md`에 바로 두고, post 소속 관계는 frontmatter의 `post` 필드만으로 표현하도록 단순화했다.

예제 frontmatter도 `title`, `post`, `order`, `status`를 기본으로 두고, optional은 `description`만 남겼다. `language`, `framework`, `sourcePath`는 schema, validation, example list UI, example layout에서 제거했고, pilot example도 평면 경로로 옮겼다.

검증:
- `pnpm test:repo`
- `pnpm check:content`
- `pnpm build`

## 2026-05-16 — Document reciprocal Obsidian links between posts and examples

`bean-container-and-application-context`용 example stub를 만들 때 post 본문에 Obsidian 예제 위키링크를 추가하는 규칙이 문서에 충분히 드러나지 않아 연결이 빠졌다. `ioc-and-di`와 같은 방식으로 owning post의 `관련 링크:`에 `[[examples/<example-slug>|...]]`를 넣고, example은 owning post로 되돌아가는 reciprocal link를 유지하도록 현재 authoring contract를 명시했다.

`docs/content-model.md`와 `docs/astro-bootstrap.md`에 이 규칙을 추가했고, 관련 링크 블록은 Obsidian 전용이며 웹 렌더에서는 숨겨진다는 점도 함께 적었다.

검증:
- `pnpm check:content`
- `pnpm build`
