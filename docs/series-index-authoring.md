# Series Index Authoring

This document describes how to create and manage series index documents — the canonical entry point for each parent series and child series.

---

## What Is a Series Index?

A series index document defines either a parent series or a child series and drives two key behaviors:

- Parent series appear on the homepage at `/`
- Series routes are generated from the parent/child index structure

Series index documents are distinct from posts and concepts. They are authored manually and committed under `src/content/series_indexes/` — they are not converted from Obsidian.

---

## File Location and Naming

```
src/content/series_indexes/
  database-systems.md
  database-systems/
    database-internals.md
  computer-networks.md
  computer-networks/
    network-protocols.md
```

Path rules:
- Parent series index: `src/content/series_indexes/<parent-slug>.md`
- Child series index: `src/content/series_indexes/<parent-slug>/<child-slug>.md`
- Parent indexes must stay at the root of `series_indexes/`
- Child indexes must live inside their parent's directory

File names follow the same kebab-case rule as posts (D-15). Frontmatter remains required, and repository validation enforces that the path, the `series` field, and the `parent` field do not contradict each other.

---

## Required Frontmatter

```yaml
---
title: "Database Internals"
series: database-internals
parent: database-systems
order: 1
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
order: 1
description: "How relational databases store, index, and retrieve data."
```

| Field | Required | Notes |
|-------|----------|-------|
| `parent` | No for parent series; Yes for child series | Omit on parent series. Set to the parent series slug on child series. |
| `order` | No for parent series; Yes for child series | Omit on parent series. Set the child series position within its parent, starting at 1. |
| `description` | No | One-line summary shown on the homepage and series page |

---

## Forbidden Fields

Do not add these fields to series index documents:

| Field | Reason |
|-------|--------|
| `status` | Series indexes are always rendered; there is no draft state |
| `aliases` | Concept-specific field |

Clarification:
- `order` is forbidden on parent series indexes.
- `order` is required on child series indexes.

---

## Operating Rules

**One index per series slug.** There must be exactly one series index document for each parent or child slug. If two index documents share the same `series` value, Astro generates duplicate routes.

**Path and frontmatter must agree.** The file layout expresses the hierarchy physically, but it does not replace frontmatter. A child index under `src/content/series_indexes/computer-networks/network-protocols.md` must still declare `series: network-protocols` and `parent: computer-networks`.

**Child series are explicitly ordered.** Parent pages sort child series by `order` ascending. `title` is only a deterministic fallback when comparing items that otherwise tie.

**Posts attach only to child series.** The `series` field in post frontmatter must exactly match a child series slug, not a parent series slug.

**A missing parent or child index breaks routes.** Parent pages come from parent indexes. Child pages come from child indexes with valid `parent` references. If either side is missing, the intended route cannot be generated correctly.

**Create the parent and child indexes before the first post.** Without them, the child-series route and post breadcrumb context cannot be generated correctly from day one.

---

## Adding a New Child Series: Minimum Steps

1. Create `src/content/series_indexes/<parent-slug>.md` for the parent series if it does not already exist
2. Create `src/content/series_indexes/<parent-slug>/<child-slug>.md` with `parent: <parent-slug>`
3. Run `pnpm build` to verify `/series/<parent-slug>` and `/series/<parent-slug>/<child-slug>` are generated
4. Run `pnpm check:content` to verify no structural violations
5. Commit the parent and child index files before writing posts in the child series

---

## Example

Parent example: `src/content/series_indexes/database-systems.md`

```markdown
---
title: "Database Systems"
series: database-systems
description: "Storage engines, query processing, and the structures that make databases durable and fast."
---
```

Child example: `src/content/series_indexes/database-systems/database-internals.md`

```markdown
---
title: "Database Internals"
series: database-internals
parent: database-systems
order: 1
description: "How relational databases store, index, and retrieve data — from on-disk structures to query execution."
---
```

---

## Related Documents

- [`docs/content-model.md`](content-model.md) — role boundaries for all three content types
- [`docs/astro-bootstrap.md`](astro-bootstrap.md) — build commands and directory structure
- [`src/content.config.ts`](../src/content.config.ts) — Zod schema for `series_indexes`
