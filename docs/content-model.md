# Content Model

This document defines the role boundaries for the three content types in this repository: `posts`, `concepts`, and `series_indexes`. Read this before adding content to the repository.

---

## Content Types at a Glance

| | `posts` | `concepts` | `series_indexes` |
|---|---|---|---|
| URL | `/posts/<slug>` | `/concepts/<slug>` | `/series/<series>` |
| Location | `src/content/posts/` | `src/content/concepts/` | `src/content/series_indexes/` |
| Belongs to series | Yes (required) | No | Defines the series |
| Has `order` | Yes (required) | No | No |
| Has `status` | Yes (required) | No | No |
| Created via | `pnpm convert` from Obsidian | `pnpm convert` from Obsidian | Manual authoring |
| Appears on homepage | No | No | Yes |
| Prev/next navigation | Yes | No | No |

---

## `posts`

Posts are in-depth explanations of a topic within a series. Each post belongs to exactly one series and holds an `order` position within it.

**Create a post when** you want to explain a concept in depth with examples and progression, as part of a named series.

**Do not use a post for** one-paragraph reference definitions (use a concept) or series introductions (use a series index).

**Required frontmatter:**
```yaml
title: string
series: string   # must match a series_indexes document's series field
order: number    # position within the series, starting at 1
status: string   # one of idea, draft, published
```

---

## `concepts`

Concepts are short reference definitions for individual technical terms. They are linked from posts using `[[concept:slug]]` syntax and render at `/concepts/<slug>`.

**Create a concept when** a term recurs across posts and would benefit from a one-paragraph definition at a stable URL.

**Do not use a concept for** multi-section explanations or series-specific content (use a post).

**Required frontmatter:**
```yaml
title: string
```

---

## `series_indexes`

Series index documents define a series. They control which series pages exist and what appears on the homepage.

**Create a series index when** you are starting a new series. This must happen before writing any posts in that series.

**Do not use a series index for** post content, ordered explanations, or concept definitions. The post list on the series page is auto-generated — you do not write links inside the index body.

**Required frontmatter:**
```yaml
title: string
series: string   # must match the series value used in posts
```

---

## Homepage

The homepage (`/`) lists one entry per `series_indexes` document. It does not list individual posts. Each entry shows the series title and optional description, linking to `/series/<series>`.

---

## Series Pages

`/series/[series]` is generated exclusively from `series_indexes`. Each series page renders:

1. The series title and optional description from the index document
2. An automatically generated ordered list of all published posts in that series

The post list is sorted by `order` ascending. In local development, all posts in the series are shown so unpublished work can be reviewed. In staged and production builds, only posts explicitly marked `status: published` are shown. You do not write post links in the series index body.

A series page route exists only when a matching series index document exists. If an index is missing, the route is not generated and post breadcrumbs for that series will 404.

---

## Minimum Setup for a New Series

1. Create `src/content/series_indexes/<series-slug>.md` (see [series-index-authoring.md](series-index-authoring.md))
2. Run `pnpm build` — verify `/series/<series-slug>` is generated
3. Run `pnpm check:content` — verify no structural violations
4. Commit the index file
5. Write posts with `series: <series-slug>` in their frontmatter

Do not commit posts in a series before the series index exists.

---

## Related Documents

- [`docs/series-index-authoring.md`](series-index-authoring.md) — rules and workflow for series index documents
- [`docs/concept-authoring-workflow.md`](concept-authoring-workflow.md) — rules and workflow for concept pages
- [`docs/astro-bootstrap.md`](astro-bootstrap.md) — build commands, routes, and directory structure
- [`docs/post-metadata.md`](post-metadata.md) — full post frontmatter field definitions
