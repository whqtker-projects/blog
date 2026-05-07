# Repository Guidelines

## Project Structure & Module Organization
`src/pages/` contains Astro routes: `index.astro` lists published posts and `posts/[slug].astro` renders each post. Shared page shells live in `src/layouts/`. Blog content and its schema live in `src/content/posts/` and `src/content.config.ts`. Static assets such as diagrams belong in `public/images/`. Conversion and validation utilities live in `scripts/`, and planning or ADR material stays under `docs/`.

## Build, Test, and Development Commands
Use `pnpm install` with Node `>=22.12.0` first. Key commands:

- `pnpm dev`: start the Astro dev server.
- `pnpm build`: produce the production site in Astro’s output directory.
- `pnpm preview`: serve the built site locally for a final check.
- `pnpm test:convert`: run the Node test suite for the Obsidian-to-Astro converter.
- `pnpm convert -- --input <vault-posts-dir> [--output <dir>] [--strict]`: convert Obsidian Markdown into `src/content/posts/`.

## Coding Style & Naming Conventions
Follow the existing style: ESM modules, 2-space indentation, semicolons, and concise comments only where logic is non-obvious. Keep Astro components small and push reusable layout concerns into `src/layouts/`. Markdown post filenames must be lowercase kebab-case English slugs such as `b-plus-tree-index.md`; the converter rejects uppercase, underscores, and non-ASCII names.

## Testing Guidelines
Tests currently use Node’s built-in runner in `scripts/obsidian-to-astro.test.mjs`. Add new converter coverage in the same file with `test('feature: case', ...)` names that describe the behavior under test. Run `pnpm test:convert` before opening a PR, and run `pnpm build` when changing content schema, routes, or layouts to catch Astro integration regressions.

## Commit & Pull Request Guidelines
Recent history favors short imperative subjects with issue references, for example `Validate internal link rendering across two fixture posts (#69)`. Keep commits scoped to one change and mention the affected pipeline or contract when relevant. PRs should include a concise summary, linked issue numbers, and screenshots or rendered-output notes for UI/content changes. Call out any fixture posts, schema updates, or conversion edge cases reviewers should verify.

## Content & Documentation Notes
Do not hand-edit generated output without updating the source or converter logic that produced it. When changing workflow assumptions or structure, update the relevant files in `docs/` alongside code so planning records stay aligned with implementation.
