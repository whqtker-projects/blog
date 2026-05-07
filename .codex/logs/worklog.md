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
