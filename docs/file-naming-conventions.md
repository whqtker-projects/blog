# File Naming Conventions

**Status:** Active reference — decision recorded in `confirmed-decisions.md` (D-15, D-16) and `decision-log.md` (DL-002).  
**Decided:** 2026-05-06

Markdown post filenames are stable identifiers. They become post slugs, drive Obsidian wikilink resolution, and must stay independent from reader-facing title language.

## Current Rule

Post filenames must be:

- all lowercase
- English only
- kebab-case
- free of date, domain, series, or order prefixes

Valid examples:

- `b-plus-tree-index.md`
- `binary-search-tree.md`
- `transaction-propagation-and-isolation.md`

Invalid examples:

- `B-Plus-Tree-Index.md`
- `b_plus_tree_index.md`
- `트랜잭션.md`
- `2026-05-06-b-plus-tree-index.md`
- `01-b-plus-tree-index.md`

## Title And Body Language

Filename language and reader-facing language are separate:

- filenames and slugs stay English-only identifiers
- post `title` values may be Korean
- post bodies are intended to be written in Korean
- exact code, CLI commands, API names, and other technical identifiers may remain in their original form

Numeric prefixes such as `01. ...` are allowed only in the `title` frontmatter. They do not affect the filename or slug. When a numeric title prefix is present, repository validation requires it to match the post's explicit `order`.

## Related Documents

- [`post-metadata.md`](post-metadata.md) — post frontmatter rules
- [`obsidian-conversion-contract.md`](obsidian-conversion-contract.md) — conversion behavior and filename validation
- [`confirmed-decisions.md`](confirmed-decisions.md) — D-15, D-16
- [`decision-log.md`](decision-log.md) — DL-002

