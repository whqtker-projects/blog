# Database Systems

## Purpose

`database-systems` is the current production-ready parent direction. It groups storage-engine and execution topics that explain how databases persist, organize, and retrieve data.

## Child Series Composition

| Order | Child series | Current posture |
|---|---|---|
| 1 | `database-internals` | 5 published posts |

Current child index:
- `src/content/series_indexes/database-systems/database-internals.md`

## Backlog Posture

`database-internals` is the most mature child series in the repository:
- all five current posts are `status: published`
- orders `1` through `5` are already filled
- this parent currently functions as a stable reader-facing anchor, not a backlog-only shell

## Next Expansion Points

- Keep `database-internals` stable while new published-post additions follow the existing explicit `order` contract.
- If the parent expands, add new sibling child series deliberately rather than overloading `database-internals` with unrelated topics.
- Reflect any new child-series addition in both `src/content/series_indexes/database-systems/` and this operating document.
