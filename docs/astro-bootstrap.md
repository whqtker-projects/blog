# Astro Bootstrap Documentation

**Status:** Active — Astro skeleton initialized 2026-05-07.  
**Last updated:** 2026-05-07

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
pnpm test:convert                                    # Run conversion script unit tests
```

> `pnpm build` does **not** auto-run conversion. It builds from whatever `.md` files are currently committed in `src/content/posts/`. Run `pnpm convert` first whenever vault content has changed, then commit the updated files.

---

## Content Workflow

Content moves from the Obsidian vault to the published site in three explicit steps:

```
Obsidian vault (posts/)
       │
       │  1. pnpm convert --input <vault/posts> [--strict]
       ▼
src/content/posts/          ← committed to git; review diff before committing
       │
       │  2. git add src/content/posts/ && git commit
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
| Starting the dev server with fresh content | `pnpm convert` first, then `pnpm dev` |
| Production build in CI | Not needed — `src/content/posts/` is already committed |
| Previewing changes without committing | `pnpm convert` then `pnpm dev` (don't commit yet) |

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

# Before committing
pnpm convert --input ~/my-vault/posts --strict   # fail on broken links
git diff src/content/posts/                      # review converted output
git add src/content/posts/ && git commit

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
│   │   └── posts/               # Converted Markdown posts go here
│   ├── content.config.ts        # Content collection schema
│   ├── layouts/
│   │   ├── BaseLayout.astro     # HTML shell (head, body)
│   │   └── PostLayout.astro     # Post page wrapper (title, series, content)
│   └── pages/
│       ├── index.astro          # Home — lists published posts
│       └── posts/
│           └── [slug].astro     # Post route — /posts/<slug>
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

**Production build inclusion (D-33):** Posts with `status` absent or set to `published` are included. All other status values are excluded from the build output.

---

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Lists all published posts |
| `/posts/[slug]` | `src/pages/posts/[slug].astro` | Individual post page |

Slug is derived from the Markdown file name (e.g., `b-plus-tree.md` → `/posts/b-plus-tree`).

---

## Adding a Post

1. Write the post in the Obsidian vault (`posts/` directory in the vault)
2. Run `pnpm convert --input <vault/posts> --strict` to sync to `src/content/posts/`
3. Review the diff in `src/content/posts/` — verify wikilinks converted correctly
4. Set `status: published` in frontmatter when the post is ready to go live
5. Run `pnpm build` to verify no schema errors
6. Commit `src/content/posts/<filename>.md`

---

## Related Documents

- [`docs/post-metadata.md`](post-metadata.md) — frontmatter field definitions
- [`docs/status-lifecycle.md`](status-lifecycle.md) — status values and build policy
- [`docs/series-backlog.md`](series-backlog.md) — confirmed series slugs
