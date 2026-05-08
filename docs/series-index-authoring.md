# Series Index Authoring

This document describes how to create and manage series index documents — the canonical entry point for each series.

---

## What Is a Series Index?

A series index document defines a series and drives two key behaviors:

- The homepage lists one entry per series index, linking to `/series/<series>`
- The `/series/[series]` route exists only when a matching series index document exists

Series index documents are distinct from posts and concepts. They are authored manually and committed directly to `src/content/series_indexes/` — they are not converted from Obsidian.

---

## File Location and Naming

```
src/content/series_indexes/
  database-internals.md
  network-protocols.md
```

File names follow the same kebab-case rule as posts (D-15). The file name is not the routing key — the `series` frontmatter field is. Keep them consistent to avoid confusion.

---

## Required Frontmatter

```yaml
---
title: "Database Internals"
series: database-internals
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Display name shown on the homepage and series page |
| `series` | Yes | Must exactly match the `series` value used in posts for this series |

---

## Optional Frontmatter

```yaml
description: "How relational databases store, index, and retrieve data."
```

| Field | Required | Notes |
|-------|----------|-------|
| `description` | No | One-line summary shown on the homepage and series page |

---

## Forbidden Fields

Do not add these fields to series index documents:

| Field | Reason |
|-------|--------|
| `order` | Series indexes are not ordered entries; they define the series |
| `status` | Series indexes are always rendered; there is no draft state |
| `aliases` | Concept-specific field |

---

## Operating Rules

**One index per series.** There must be exactly one series index document for each series slug. If two index documents share the same `series` value, Astro's `getStaticPaths` generates the same route twice — undefined behavior.

**The `series` field must exactly match posts.** The `series` field in the index document and in all posts for that series must be character-for-character identical. A mismatch silently drops those posts from the series page.

**A missing index means no route.** `/series/[series]` routes are generated from `series_indexes` only. If a series index document is missing, the route does not exist — posts in that series will have a breadcrumb link pointing to a 404.

**Create the index before the first post.** When starting a new series, create the series index document first. Without it, the series route cannot be generated and post breadcrumbs will be broken from day one.

---

## Adding a New Series: Minimum Steps

1. Create `src/content/series_indexes/<series-slug>.md` with the required fields
2. Run `pnpm build` to verify the route is generated at `/series/<series-slug>`
3. Run `pnpm check:content` to verify no structural violations
4. Commit the index file before writing any posts in the series

---

## Example

`src/content/series_indexes/database-internals.md`:

```markdown
---
title: "Database Internals"
series: database-internals
description: "How relational databases store, index, and retrieve data — from on-disk structures to query execution."
---
```

---

## Related Documents

- [`docs/content-model.md`](content-model.md) — role boundaries for all three content types
- [`docs/astro-bootstrap.md`](astro-bootstrap.md) — build commands and directory structure
- [`src/content.config.ts`](../src/content.config.ts) — Zod schema for `series_indexes`
