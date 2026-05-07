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

1. Place the converted `.md` file in `src/content/posts/`
2. Ensure frontmatter has `title`, `series`, and `order`
3. Set `status: published` to include it in the production build
4. Run `pnpm build` to verify no schema errors

---

## Related Documents

- [`docs/post-metadata.md`](post-metadata.md) — frontmatter field definitions
- [`docs/status-lifecycle.md`](status-lifecycle.md) — status values and build policy
- [`docs/series-backlog.md`](series-backlog.md) — confirmed series slugs
