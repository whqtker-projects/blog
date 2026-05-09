## 2026-05-09 — Parent-level series operations docs

`docs/series/` is introduced as a parent-level operating layer, not a full child-by-child documentation tree. Each current real parent series gets one operating document that records child composition, child order, backlog posture, and next expansion points.

## 2026-05-09 — Computer networks structure prefers one added foundations child over a full textbook refactor

The `computer-networks` parent is refined by adding `network-foundations` and renaming the old naming/routing child to `internet-addressing-and-routing`, while keeping `transport-and-reliability` and `network-protocols` intact. This preserves existing draft work and improves the learning arc without exploding the child-series count.

## 2026-05-09 — Database systems keeps internals stable and adds sibling pre-internals layers

`database-systems` is refined by adding `database-foundations`, `data-modeling-and-design`, and `relational-queries-and-joins` before `database-internals`. Published internals content stays in place; the missing work was earlier curriculum layers, not an internals split.

## 2026-05-09 — Operating systems uses a moderate five-child course-style backlog split

`operating-systems` is refined into `operating-systems-overview`, `processes-and-threads`, `scheduling-and-synchronization`, `memory-management`, and `file-systems-and-storage`. This keeps the learning arc textbook-like without turning the parent into a large set of tiny sibling series.
## 2026-05-09 — Keep English identifiers and Korean display text separate

This repository keeps filenames, slugs, and `series` identifiers in English kebab-case while allowing reader-facing series titles and post titles to be Korean. English technical identifiers such as code, CLI commands, API names, and exact protocol terms may remain in their original form inside Korean-facing metadata or content when needed.

The rollout is migration-safe rather than retroactive: new and editable backlog content should follow the Korean display policy, but already published posts are not automatically rewritten unless explicitly requested.

## 2026-05-09 — Spring Framework and Spring Boot stay as separate parent directions

The repository treats `spring-framework` and `spring-boot` as separate parent series under backend/systems rather than placing Boot as one child inside a larger framework tree. This keeps framework runtime mechanics distinct from Boot startup, configuration, testing, and operations topics.
