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
