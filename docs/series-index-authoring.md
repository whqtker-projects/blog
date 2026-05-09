# Series Index Authoring

This document describes how to create and manage series index documents — the canonical entry point for each parent series and child series.

---

## What Is a Series Index?

A series index document defines either a parent series or a child series and drives two key behaviors:

- Parent series appear on the homepage at `/`
- Series routes are generated from the parent/child index structure

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
parent: database-systems
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Display name shown on the homepage or series page |
| `series` | Yes | Slug for this parent or child series |

---

## Optional Frontmatter

```yaml
parent: database-systems
description: "How relational databases store, index, and retrieve data."
```

| Field | Required | Notes |
|-------|----------|-------|
| `parent` | No for parent series; Yes for child series | Omit on parent series. Set to the parent series slug on child series. |
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

**One index per series slug.** There must be exactly one series index document for each parent or child slug. If two index documents share the same `series` value, Astro generates duplicate routes.

**Posts attach only to child series.** The `series` field in post frontmatter must exactly match a child series slug, not a parent series slug.

**A missing parent or child index breaks routes.** Parent pages come from parent indexes. Child pages come from child indexes with valid `parent` references. If either side is missing, the intended route cannot be generated correctly.

**Create the parent and child indexes before the first post.** Without them, the child-series route and post breadcrumb context cannot be generated correctly from day one.

---

## Adding a New Child Series: Minimum Steps

1. Create `src/content/series_indexes/<parent-slug>.md` for the parent series if it does not already exist
2. Create `src/content/series_indexes/<child-slug>.md` with `parent: <parent-slug>`
3. Run `pnpm build` to verify `/series/<parent-slug>` and `/series/<parent-slug>/<child-slug>` are generated
4. Run `pnpm check:content` to verify no structural violations
5. Commit the parent and child index files before writing posts in the child series

---

## Example

`src/content/series_indexes/database-internals.md`:

```markdown
---
title: "Database Internals"
series: database-internals
parent: database-systems
description: "How relational databases store, index, and retrieve data — from on-disk structures to query execution."
---
```

---

## Related Documents

- [`docs/content-model.md`](content-model.md) — role boundaries for all three content types
- [`docs/astro-bootstrap.md`](astro-bootstrap.md) — build commands and directory structure
- [`src/content.config.ts`](../src/content.config.ts) — Zod schema for `series_indexes`
