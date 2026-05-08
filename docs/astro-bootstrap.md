# Astro Bootstrap Documentation

**Status:** Active — Astro skeleton initialized 2026-05-07.  
**Last updated:** 2026-05-08

Quick reference for working with the Astro project in this repository.

---

## Environment

| Item | Value |
|---|---|
| Package manager | pnpm |
| Node requirement | >=22.12.0 |
| Astro version | ^6.2.2 |
| Project root | Repository root (`new_blog/`) |

---

## Commands

```bash
pnpm install      # Install dependencies (first time or after package changes)
pnpm dev          # Start local dev server at http://localhost:4321
pnpm build        # Production build → dist/
pnpm preview      # Preview the production build locally

# Content conversion (requires Obsidian vault to be available locally)
pnpm convert --input <path/to/vault/posts>           # Sync vault posts → src/content/posts/
pnpm convert --input <path/to/vault/posts> --strict  # Same; exit 1 on unresolved wikilinks
pnpm convert --input <path/to/vault/posts> --concepts <path/to/vault/concepts>
                                                    # Sync vault posts + concepts
pnpm test:convert                                    # Run conversion script unit tests
```

> `pnpm build` does **not** auto-run conversion. It builds from whatever `.md` files are currently committed in `src/content/posts/`. Run `pnpm convert` first whenever vault content has changed, then commit the updated files.

> `src/content/posts/` is reserved for real publishable content candidates. Validation fixtures belong under `test/fixtures/obsidian-vault/` and should be converted only into a temporary or test-only output location when rendering checks are needed.

---

## Content Workflow

Content moves from the Obsidian vault to the published site in three explicit steps:

```
Obsidian vault (posts/, concepts/)
       │
       │  1. pnpm convert --input <vault/posts> [--concepts <vault/concepts>] [--strict]
       ▼
src/content/posts/          ← committed to git; review diff before committing
src/content/concepts/       ← committed to git when concept files change
       │
       │  2. git add src/content/posts/ src/content/concepts/ && git commit
       ▼
git repository
       │
       │  3. pnpm build
       ▼
dist/                       ← gitignored; deploy this
```

### When to run `pnpm convert`

| Situation | Action |
|-----------|--------|
| Wrote or edited a post in Obsidian | `pnpm convert --input <vault/posts>` then commit |
| Wrote or edited a concept in Obsidian | `pnpm convert --input <vault/posts> --concepts <vault/concepts>` then commit |
| Starting the dev server with fresh content | `pnpm convert` first, then `pnpm dev` |
| Production build in CI | Not needed — `src/content/posts/` is already committed |
| Previewing changes without committing | `pnpm convert` then `pnpm dev` (don't commit yet) |

### Build contract

There are two distinct freshness layers in this model:

| Layer | What it means | Who controls it |
|-------|---------------|-----------------|
| **Vault freshness** | The author's Obsidian vault reflects the latest intent | Author (local machine) |
| **Repository freshness** | `src/content/posts/` contains the latest intentionally synced, committed conversion | Author (via `pnpm convert` + commit) |

**`pnpm build` is the official repository build entrypoint.** It guarantees that the committed converted artifact is built correctly — it does not guarantee that `src/content/posts/` reflects the author's current vault state.

"Up-to-date converted content" in this repository means: the latest converted Markdown that has been intentionally synced from the vault and committed to git. CI does not and cannot validate against the author's live vault; it builds the committed artifact by design.

The required author workflow before publishing is:
1. `pnpm convert --input <vault/posts> --concepts <vault/concepts> --strict` — sync and fail on broken links
2. `git diff src/content/posts/ src/content/concepts/` — review the converted output
3. `git add src/content/posts/ src/content/concepts/ && git commit` — commit the converted artifact
4. `pnpm build` — verify the committed content builds without errors

### Conversion trigger

Conversion is **manual and explicit**. There is no prebuild hook and no automatic watch mode. Reasons:

- The Obsidian vault path is machine-specific and not available in CI.
- Committing converted files means CI only runs `pnpm build` with no vault dependency.
- Explicit conversion keeps the git diff readable: every content change is a deliberate commit.

### Dev workflow

```bash
# Day-to-day: after editing posts in Obsidian
pnpm convert --input ~/my-vault/posts
pnpm dev              # or review diff and commit first

# When concept pages changed too
pnpm convert --input ~/my-vault/posts --concepts ~/my-vault/concepts

# Before committing
pnpm convert --input ~/my-vault/posts --concepts ~/my-vault/concepts --strict
git diff src/content/posts/ src/content/concepts/
git add src/content/posts/ src/content/concepts/ && git commit

# Production build (no vault needed)
pnpm build
```

---

## Directory Structure

```
new_blog/
├── docs/                        # Planning documents (not part of Astro build)
├── src/
│   ├── content/
│   │   ├── concepts/            # Converted Markdown for concept reference pages
│   │   ├── posts/               # Converted Markdown for real publishable posts
│   │   └── series_indexes/      # One index document per series (manually authored)
│   ├── content.config.ts        # Content collection schema
│   ├── layouts/
│   │   ├── BaseLayout.astro     # HTML shell (head, body)
│   │   └── PostLayout.astro     # Post page wrapper (title, series, content)
│   └── pages/
│       ├── index.astro          # Home — series directory (one entry per series index)
│       ├── concepts/
│       │   └── [slug].astro     # Concept route — /concepts/<slug>
│       ├── posts/
│       │   └── [slug].astro     # Post route — /posts/<slug>
│       └── series/
│           └── [series].astro   # Series route — /series/<series>
├── test/
│   └── fixtures/
│       └── obsidian-vault/      # Validation-only Obsidian source fixtures
├── public/                      # Static assets
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## Content Collection

Posts are loaded from `src/content/posts/` via a glob loader. Each `.md` file must have valid frontmatter matching the schema:

**Required fields (D-25):**
```yaml
title: string
series: string   # must match a confirmed slug from docs/series-backlog.md
order: number    # position within the series, starting at 1
```

**Optional field (D-32):**
```yaml
status: idea | outline | draft | review | published
```

**Production build inclusion (D-33):** Only posts with `status: published` are included. Posts with `status` absent or set to `idea`, `outline`, `draft`, or `review` are excluded from the build output.

Concepts are loaded separately from `src/content/concepts/`. They require `title` and may include `aliases`; they do not use `series`, `order`, or `status`.

Series index documents are loaded from `src/content/series_indexes/`. There must be exactly one per series. They are authored manually (not converted from Obsidian).

**Required fields:**
```yaml
title: string    # display name for the series
series: string   # slug matching the series value used in posts
```

**Optional field:**
```yaml
description: string   # one-line summary shown on the homepage and series page
```

Series index documents do not use `order`, `status`, or any post-specific fields.

---

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Series directory — one entry per series index document |
| `/series/[series]` | `src/pages/series/[series].astro` | Series index title + description + ordered list of published posts |
| `/posts/[slug]` | `src/pages/posts/[slug].astro` | Individual post page |
| `/concepts/[slug]` | `src/pages/concepts/[slug].astro` | Individual concept reference page |

Slug is derived from the Markdown file name (e.g., `b-plus-tree.md` → `/posts/b-plus-tree`).

A `/series/[series]` route is only generated if a matching series index document exists in `src/content/series_indexes/`. Adding a new series requires creating the index document first.

---

## Adding a Post

1. Write the post in the Obsidian vault (`posts/` directory in the vault)
2. Run `pnpm convert --input <vault/posts> --concepts <vault/concepts> --strict` when posts or concept links changed
3. Review the diff in `src/content/posts/` and `src/content/concepts/` — verify wikilinks converted correctly
4. Set `status: published` in frontmatter when the post is ready to go live
5. Run `pnpm build` to verify no schema errors
6. Commit `src/content/posts/<filename>.md`

Validation-only fixtures follow a different rule: keep the Obsidian source under `test/fixtures/obsidian-vault/`, do not leave its converted output in `src/content/posts/`, and use `--output <temp-dir>` when a one-off rendering check needs converted artifacts.

---

## Related Documents

- [`docs/deployment-workflow.md`](deployment-workflow.md) — how the built output is deployed to Vercel (production and staging)
- [`docs/content-model.md`](content-model.md) — role boundaries for all three content types
- [`docs/series-index-authoring.md`](series-index-authoring.md) — series index document rules
- [`docs/post-metadata.md`](post-metadata.md) — frontmatter field definitions
- [`docs/status-lifecycle.md`](status-lifecycle.md) — status values and build policy
- [`docs/series-backlog.md`](series-backlog.md) — confirmed series slugs
