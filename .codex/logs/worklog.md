## 2026-05-07 — Add contributor guide

Created root `AGENTS.md` as a repository-specific contributor guide. Documented the Astro project layout, `pnpm` development and conversion commands, naming constraints enforced by `scripts/obsidian-to-astro.mjs`, the current Node test workflow, and commit/PR conventions inferred from recent git history.

## 2026-05-07 — Separate validation fixtures from public content

Removed `src/content/posts/e2e-rendering-validation.md` from the public content set because it exists only to exercise rendering validation. Kept the Obsidian source fixture under `test/fixtures/obsidian-vault/` and updated the bootstrap and conversion docs to state that validation fixtures stay under `test/fixtures/` and should not leave committed converted artifacts in `src/content/posts/`.
