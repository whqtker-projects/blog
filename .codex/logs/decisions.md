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

## 2026-05-09 — Explicit series links are namespaced and generic wikilinks stay post-only

Graph-friendly repository authoring treats `[[series:<parent>]]` and `[[series:<parent>/<child>]]` as the explicit series-link namespace, keeps `[[concept:slug]]` for concepts, and reserves generic `[[wikilinks]]` for post targets. Series-link usage is intentionally narrow: parent and child series index bodies may link to each other for graph-friendly navigation context, while idea-stage post stubs remain valid without explicit graph links.

## 2026-05-10 — Relationship printer reuses repository validation instead of cloning it

The Python relationship-printer script should not reimplement the repository's full hierarchy validator. It runs `pnpm check:content` before printing and only builds the parent/child/post structure after the existing validation workflow passes, keeping one structural source of truth.

## 2026-05-11 — Series operations docs now include child-level writing queues

`docs/series/` is no longer parent-only. Parent notes stay responsible for child composition, ordering, and expansion guidance, while child notes at `docs/series/<parent>/<child>.md` carry the per-series writing queue with explicit current/next targets.

This operating layer does not replace structural metadata. `posts.order` remains the only sequencing source of truth for site sorting and prev/next behavior, and generic `[[wikilinks]]` are not repurposed as sequence metadata.

## 2026-05-11 — Graph view uses content links while order stays canonical

Obsidian graph visibility should come from actual content links, not from a parallel child-note layer under `docs/series/`. Parent series indexes link to child series, child series indexes may list posts in order, and editable posts may link to their parent series, child series, and adjacent posts.

These links are graph aids, not sorting metadata. `posts.order` remains the canonical sequence for rendering and prev/next behavior, and published posts are not retrofitted when repository rules forbid editing them.

## 2026-05-11 — Graph node colors are driven by dedicated frontmatter tags

Obsidian graph color separation should use explicit frontmatter tags rather than path-based queries. The repository now uses `graph/parent-series`, `graph/child-series`, and `graph/post` so color grouping stays stable even if files move or routing conventions evolve.

## 2026-05-11 — Series graph aliases are generated metadata

`series:*` links remain the canonical syntax for distinguishing series links from post wikilinks, but Obsidian resolves them through generated `aliases` on series index notes. Those aliases are not manually curated; they are derived from `series` and `parent` by `pnpm sync:series-graph` and enforced by `pnpm check:content`.

## 2026-05-11 — Obsidian graph wiring uses actual series index file links

`series:*` remains supported converter syntax, but graph-visible content should use actual vault file links such as `[[series_indexes/<parent>]]` and `[[series_indexes/<parent>/<child>]]`. This avoids unresolved Obsidian graph nodes caused by colon/slash namespace links and lets graph color groups apply to the real parent and child series notes.

## 2026-05-11 — Posts link to child series, not parent series

For graph readability, post notes should not link directly to parent series notes. Parent series nodes connect to child series nodes, and child series nodes connect to their posts. Draft post graph blocks therefore include the child series and adjacent posts only.
