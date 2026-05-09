# Operating Systems

## Purpose

`operating-systems` is the textbook-derived parent for core OS learning. It starts with system structure, then moves through execution units, scheduling/concurrency, memory, and persistent storage so the backlog reads like a coherent fundamentals track instead of a mixed systems bucket.

## Child Series Composition

| Order | Child series | Current posture |
|---|---|---|
| 1 | `operating-systems-overview` | 4 idea |
| 2 | `processes-and-threads` | 4 idea |
| 3 | `scheduling-and-synchronization` | 5 idea |
| 4 | `memory-management` | 5 idea |
| 5 | `file-systems-and-storage` | 5 idea |

Current child indexes:
- `src/content/series_indexes/operating-systems/operating-systems-overview.md`
- `src/content/series_indexes/operating-systems/processes-and-threads.md`
- `src/content/series_indexes/operating-systems/scheduling-and-synchronization.md`
- `src/content/series_indexes/operating-systems/memory-management.md`
- `src/content/series_indexes/operating-systems/file-systems-and-storage.md`

## Backlog Posture

This parent is an early backlog-first rollout:
- every current post in the parent is `status: idea`
- child ordering is explicit across the full five-child structure
- the current split is meant to keep a university-style OS learning arc reviewable without exploding into too many narrow sibling series

## Next Expansion Points

- Promote overview and process-level posts first before widening the parent with another sibling child series.
- Keep deadlock inside `scheduling-and-synchronization` unless the backlog grows enough to justify a dedicated resource-management child.
- Keep file-system interface, implementation, and storage coordination together until the storage side becomes large enough to stand on its own.
