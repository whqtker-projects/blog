# Content Model

This document defines the role boundaries for the three active content types in this repository: `posts`, `examples`, and `series_indexes`.

It also serves as the authoritative information-architecture contract for the current parent-child series model.

Structural policy comes from `D-57` through `D-60`; page-role and attachment rules come from `D-61` through `D-64`; ordering and title-prefix rules come from `D-68` through `D-71`.

---

## Content Types at a Glance

| | `posts` | `examples` | `series_indexes` |
|---|---|---|---|
| URL | `/posts/<slug>` | `/posts/<slug>/examples/<example>` | Parent: `/series/<parent>`; Child: `/series/<parent>/<child>` |
| Location | `src/content/posts/` | `src/content/examples/` | `src/content/series_indexes/` |
| Belongs to series | Yes (required; terminal series only) | No | Defines either a parent series or a child series |
| Attaches to post | No | Yes (required; exactly one post) | No |
| Has `order` | Yes (required) | Yes (required) | Child only |
| Has `status` | Yes (required) | Yes (required) | No |
| Created via | `pnpm convert` from Obsidian | Manual authoring | Manual authoring |
| Appears on homepage | No | No | Parent series only |
| Prev/next navigation | Yes | No | No |

---

## Hierarchy Contract

The hierarchy supports two valid shapes:

1. Parent series → child series → posts
2. Parent series → posts

A parent series may directly own posts only when it has no child series. Once a parent has one or more child series, posts must attach to those child series instead. This keeps each parent page in one mode: either a navigation layer over child series, or a terminal ordered content container.

This repository does not allow a third level such as parent → middle → child.

`examples` are auxiliary pages attached to posts. They do not create a new series hierarchy level and do not change the parent → child → post structure.

---

## `posts`

Posts are in-depth explanations of a topic within a terminal series. Each post belongs to exactly one series and holds an `order` position within that series.

**Create a post when** you want to explain a concept in depth with examples and progression, as part of a named series.

**Do not use a post for** series introductions (use a series index). Short term definitions stay inline inside post bodies. If a term needs a full standalone explanation, write it as a normal post in the relevant child series.

**Required frontmatter:**
```yaml
title: string
series: string   # must match a terminal series_indexes document's series field
order: number    # position within the terminal series, starting at 1
status: string   # one of idea, draft, published
```

Post attachment rules:
- A post's `series` value must resolve to either a child series or a parent series with no child series.
- A post must not attach directly to a parent series that already has child series.
- A post does not attach to multiple series.
- A post page keeps its own `/posts/<slug>` URL, but it is understood in the context of one terminal series for breadcrumbs, prev/next navigation, and series back-links.
- A post may have zero or more attached project-style examples.

Post language policy:
- filenames and slugs stay English-only identifiers
- the post `title` is reader-facing display text and may be Korean without changing metadata structure
- new and editable backlog posts are intended to use Korean titles and Korean body content
- already published posts are not retroactively changed by this policy unless the user explicitly asks for that migration
- exact code, CLI commands, API names, and other technical identifiers may remain in their original form when needed

Graph-friendly internal-link policy:
- generic `[[wikilinks]]` remain post-only and resolve to `/posts/<slug>`
- Obsidian graph links to series use actual vault paths such as `[[series_indexes/<parent>]]` and `[[series_indexes/<parent>/<child>]]`
- `[[series:<parent>]]` and `[[series:<parent>/<child>]]` remain supported converter syntax, but they are not used for graph wiring because Obsidian may treat them as unresolved path-like links
- `[[concept:slug]]` is no longer supported
- use `|display text` when the reader-facing label should differ from the slug target
- series graph wiring primarily lives in series index bodies
- post bodies are not required to carry graph-link blocks
- `order` remains the structural source of truth for post sequencing

Definition policy:
- short definitions stay inline inside post bodies
- if a term needs a full explanation, create a normal post in the relevant terminal series instead of a standalone glossary page

Example policy:
- short code snippets remain inline inside post bodies
- longer implementation walkthroughs may move into separate `examples` pages
- project-style examples are optional and do not affect whether a post is valid

---

## `examples`

Examples are optional project-style implementation pages attached to exactly one post. They exist for longer demonstrations that may need project structure, multiple files, commands, tests, or outputs without expanding the main post body into a full walkthrough.

**Create an example when** the implementation artifact is large enough that it would distract from the explanatory flow of the post.

**Do not use an example for** short inline snippets that directly support a paragraph or section inside the post.

**Required frontmatter:**
```yaml
title: string
post: string     # must match a post slug in src/content/posts/
order: number    # position among examples attached to that post
status: string   # one of idea, draft, published
```

**Optional frontmatter:**
```yaml
description: string
```

Example attachment rules:
- each example attaches to exactly one post through `post`
- a post may have zero or more examples
- examples do not attach directly to parent series or child series
- example files live directly under `src/content/examples/`
- local development shows `idea`, `draft`, and `published` examples
- staged and production builds show only `published` examples
- example pages are routed under their owning post as `/posts/<slug>/examples/<example>`
- when an example exists, the owning post should add an Obsidian-facing `관련 링크:` entry such as `[[examples/<example-slug>|...]]`
- example pages should include reciprocal Obsidian-facing links back to their owning post
- these Obsidian-only related-link blocks are hidden in the web render

---

## `series_indexes`

Series index documents define both parent series and child series. They control which series pages exist and what appears on the homepage.

**Create a series index when** you are starting either:
- a new parent series that groups related child series
- a new child series that will directly own posts
- a new parent series that will directly own posts without child series

This must happen before writing posts in that child series.

**Do not use a series index for** post content, ordered explanations, or concept definitions. The post list on the series page is auto-generated — you do not write links inside the index body.

Confirmed target metadata contract:
```yaml
title: string
series: string   # slug for this parent or child series
parent: string?  # omitted for parent series; required for child series
order: number?   # omitted for parent series; required for child series
aliases: string[] # generated Obsidian graph aliases; managed by pnpm sync:series-graph
tags: string[]    # generated graph color tags; managed by pnpm sync:series-graph
```

Physical path contract:
- Parent series index: `src/content/series_indexes/<parent-slug>.md`
- Child series index: `src/content/series_indexes/<parent-slug>/<child-slug>.md`
- File path and frontmatter must agree. Path structure is enforced by repository validation; it does not replace the required `series` and `parent` fields.

Role rules:
- A parent series omits `parent`.
- A parent series omits `order`.
- A child series sets `parent` to the slug of exactly one parent series.
- A child series sets `order` to its position within that parent, starting at 1.
- Graph aliases and graph tags are derived from `series` and `parent`, then enforced by repository validation.
- Existing flat series slugs migrate into child-series slugs unchanged.
- `network-protocols` remains the child-series slug during migration.
- No third level is allowed. A child series cannot itself be the parent of another child series.

Series display policy:
- `series` and `parent` remain English kebab-case identifiers
- `title` and `description` are reader-facing display text and may be Korean
- identifier fields and display text must not be conflated

Series index body-link policy:
- parent series index bodies may include actual child-series file links for graph-friendly navigation context
- child series index bodies may link to their parent series file
- sibling child-series links are optional, not the default pattern
- child series index bodies may include an ordered post wikilink list so Obsidian authoring and graph view reveal which posts belong to that series
- the site still auto-generates the real post list; index-body links are an Obsidian-facing authoring aid, not the rendering source of truth

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
- list child series that belong to that parent when child series exist
- list posts directly when the parent has no child series
- sort child series by `order` ascending, with `title` ascending only as a deterministic fallback
- sort direct posts by `order` ascending, with `title` ascending only as a deterministic fallback
- link each child series to `/series/<parent>/<child>`
- avoid flattening descendant posts into one mixed ordered list when child series exist

The parent page is either a navigation layer or a terminal ordered content container. It must not be both for the same parent series.

---

## Child Series Pages

`/series/<parent>/<child>` is generated from child `series_indexes` documents. A child page renders:

1. The child series title and optional description
2. An automatically generated ordered list of visible posts in that child series

Child page responsibilities:
- act as the terminal ordered content container
- list posts for that child series only
- sort posts by `order` ascending within that child series, with `title` ascending only as a deterministic fallback
- apply the existing visibility rules: local development shows all posts; staged and production builds show only posts with `status: published`
- provide the series context used by post breadcrumbs, prev/next navigation, and series back-links

Post title-prefix rule:
- Numeric title prefixes such as `01. ...` are optional display aids only.
- They do not replace `order` as the structural source of truth.
- When a numeric prefix is present, repository validation requires it to match the post's explicit `order`.
- Post pages do not add a second visible `#order` breadcrumb cue on top of the title.

Series pages still rely on generated listings rather than the links written in the index body.

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
- [`docs/astro-bootstrap.md`](astro-bootstrap.md) — build commands, routes, and directory structure
- [`docs/post-metadata.md`](post-metadata.md) — full post frontmatter field definitions
