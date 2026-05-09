# Content Model

This document defines the role boundaries for the three content types in this repository: `posts`, `concepts`, and `series_indexes`.

It also serves as the authoritative information-architecture contract for the current parent-child series model.

Structural policy comes from `D-57` through `D-60`; page-role and attachment rules come from `D-61` through `D-64`.

---

## Content Types at a Glance

| | `posts` | `concepts` | `series_indexes` |
|---|---|---|---|
| URL | `/posts/<slug>` | `/concepts/<slug>` | Parent: `/series/<parent>`; Child: `/series/<parent>/<child>` |
| Location | `src/content/posts/` | `src/content/concepts/` | `src/content/series_indexes/` |
| Belongs to series | Yes (required; child series only) | No | Defines either a parent series or a child series |
| Has `order` | Yes (required) | No | No |
| Has `status` | Yes (required) | No | No |
| Created via | `pnpm convert` from Obsidian | `pnpm convert` from Obsidian | Manual authoring |
| Appears on homepage | No | No | Parent series only |
| Prev/next navigation | Yes | No | No |

---

## Hierarchy Contract

The hierarchy is exactly:

1. Parent series
2. Child series
3. Posts attached to child series

This repository does not allow a third level such as parent → middle → child. Parent series do not directly own posts. Child series are the only direct attachment point for posts.

`concepts` remain outside this hierarchy. They continue to render as standalone reference pages and do not belong to any series level.

---

## `posts`

Posts are in-depth explanations of a topic within a child series. Each post belongs to exactly one child series and holds an `order` position within that child series.

**Create a post when** you want to explain a concept in depth with examples and progression, as part of a named series.

**Do not use a post for** one-paragraph reference definitions (use a concept) or series introductions (use a series index).

**Required frontmatter:**
```yaml
title: string
series: string   # must match a child series_indexes document's series field
order: number    # position within the child series, starting at 1
status: string   # one of idea, draft, published
```

Post attachment rules:
- A post's `series` value must resolve to a child series, not a parent series.
- A post does not attach to multiple child series.
- A post page keeps its own `/posts/<slug>` URL, but it is understood in the context of one child series for breadcrumbs, prev/next navigation, and series back-links.

---

## `concepts`

Concepts are short reference definitions for individual technical terms. They are linked from posts using `[[concept:slug]]` syntax and render at `/concepts/<slug>`.

**Create a concept when** a term recurs across posts and would benefit from a one-paragraph definition at a stable URL.

**Do not use a concept for** multi-section explanations or series-specific content (use a post).

**Required frontmatter:**
```yaml
title: string
```

Concepts remain outside the parent-child series hierarchy. They are not parent series, not child series, and not attached to either one.

---

## `series_indexes`

Series index documents define both parent series and child series. They control which series pages exist and what appears on the homepage.

**Create a series index when** you are starting either:
- a new parent series that groups related child series
- a new child series that will directly own posts

This must happen before writing posts in that child series.

**Do not use a series index for** post content, ordered explanations, or concept definitions. The post list on the series page is auto-generated — you do not write links inside the index body.

Confirmed target metadata contract:
```yaml
title: string
series: string   # slug for this parent or child series
parent: string?  # omitted for parent series; required for child series
```

Physical path contract:
- Parent series index: `src/content/series_indexes/<parent-slug>.md`
- Child series index: `src/content/series_indexes/<parent-slug>/<child-slug>.md`
- File path and frontmatter must agree. Path structure is enforced by repository validation; it does not replace the required `series` and `parent` fields.

Role rules:
- A parent series omits `parent`.
- A child series sets `parent` to the slug of exactly one parent series.
- Existing flat series slugs migrate into child-series slugs unchanged.
- `network-protocols` remains the child-series slug during migration.
- No third level is allowed. A child series cannot itself be the parent of another child series.

---

## Homepage

The homepage (`/`) lists parent series only. It does not list individual posts and it does not directly list child series as top-level peers.

Homepage responsibilities:
- show one entry per parent series
- link each entry to `/series/<parent>`
- provide the top-level directory for navigating into child series

This differs from the current flat model, where every `series_indexes` document is listed directly on the homepage.

---

## Parent Series Pages

`/series/<parent>` is generated from parent `series_indexes` documents. A parent page renders:

1. The parent series title and optional description
2. A listing of its child series

Parent page responsibilities:
- introduce the broader direction represented by the parent series
- list child series that belong to that parent
- link each child series to `/series/<parent>/<child>`
- avoid flattening all descendant posts into one mixed ordered list

The parent page is a navigation layer, not the direct owner of posts.

---

## Child Series Pages

`/series/<parent>/<child>` is generated from child `series_indexes` documents. A child page renders:

1. The child series title and optional description
2. An automatically generated ordered list of visible posts in that child series

Child page responsibilities:
- act as the terminal ordered content container
- list posts for that child series only
- sort posts by `order` ascending within that child series
- apply the existing visibility rules: local development shows all posts; staged and production builds show only posts with `status: published`
- provide the series context used by post breadcrumbs, prev/next navigation, and series back-links

You do not write post links manually in the series index body.

---

## Previous Flat Model vs Current Hierarchy

Previous flat implementation:
- `src/pages/index.astro` listed every `series_indexes` document directly
- `src/pages/series/[series].astro` treated each series slug as a terminal post-owning page
- `src/content.config.ts` and `series_indexes` documents had no `parent` field

Current hierarchy contract:
- homepage lists parent series only
- parent pages list child series
- child pages list posts
- post pages remain `/posts/<slug>` but derive their series context from one child series

This distinction matters during migration work because existing content and older decision records may still reference the flat model.

---

## Minimum Setup for a New Child Series

1. Create the parent series index in `src/content/series_indexes/` if it does not already exist
2. Create the child series index in `src/content/series_indexes/<parent-slug>/` (see [series-index-authoring.md](series-index-authoring.md))
3. Run `pnpm build` — verify `/series/<parent-slug>` and `/series/<parent-slug>/<child-slug>` are generated
4. Run `pnpm check:content` — verify no structural violations
5. Commit the parent/child index files
6. Write posts with `series: <child-slug>` in their frontmatter

Do not commit posts in a child series before both the parent and child series indexes exist.

---

## Related Documents

- [`docs/series-index-authoring.md`](series-index-authoring.md) — rules and workflow for series index documents
- [`docs/concept-authoring-workflow.md`](concept-authoring-workflow.md) — rules and workflow for concept pages
- [`docs/astro-bootstrap.md`](astro-bootstrap.md) — build commands, routes, and directory structure
- [`docs/post-metadata.md`](post-metadata.md) — full post frontmatter field definitions
