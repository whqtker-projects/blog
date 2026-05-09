# Database Systems

## Purpose

`database-systems` now groups the database learning arc from foundations and relational design to execution and storage internals, while keeping the mature `database-internals` child as the stable reader-facing anchor.

## Child Series Composition

| Order | Child series | Current posture |
|---|---|---|
| 1 | `database-foundations` | 4 idea |
| 2 | `data-modeling-and-design` | 5 idea |
| 3 | `relational-queries-and-joins` | 4 idea |
| 4 | `database-internals` | 5 published posts |

Current child indexes:
- `src/content/series_indexes/database-systems/database-foundations.md`
- `src/content/series_indexes/database-systems/data-modeling-and-design.md`
- `src/content/series_indexes/database-systems/relational-queries-and-joins.md`
- `src/content/series_indexes/database-systems/database-internals.md`

## Backlog Posture

This parent now has two distinct layers:
- three new sibling child series cover foundations, relational modeling, and query semantics in `idea` state
- `database-internals` remains the most mature child series in the repository, with five `published` posts and occupied post orders `1` through `5`
- the parent therefore functions as both a stable reader-facing anchor and a controlled growth area for earlier-stage database material

## Next Expansion Points

- Keep `database-internals` stable while any future additions there remain clearly internals-oriented.
- Grow the new sibling child series first before considering another database child; the current gap was foundations/design/query semantics, not another storage-engine split.
- Keep join algorithms, WAL, indexing, and optimizer behavior in `database-internals`; use `relational-queries-and-joins` for join types and relational query semantics instead.
