# Publishing Workflow

**Status:** Active reference — decisions recorded in `confirmed-decisions.md` (D-17, D-18).  
**Platform:** Astro static site.  
**Conversion:** automated Obsidian Markdown conversion script.

This document summarizes the current publishing model. Detailed command and deployment behavior lives in the related implementation documents.

## Current Model

Content is authored in the local Obsidian vault, converted into committed Markdown under `src/content/posts/`, then built by Astro.

```
Obsidian vault
  -> pnpm convert --input <vault/posts> --strict
  -> src/content/posts/
  -> pnpm build
  -> dist/
```

The Astro build does not read directly from the live vault. It builds whatever converted content is committed in the repository.

## Conversion Contract

The converter is implemented in `scripts/obsidian-to-astro.mjs`.

Current behavior includes:

- validates post filenames as lowercase English kebab-case
- preserves frontmatter
- converts post wikilinks to `/posts/<slug>` links
- converts supported series links
- converts Obsidian image wikilinks to content-relative Markdown image paths
- rejects deprecated `[[concept:...]]` links
- supports `--strict` to fail on unresolved links

## Publication Gate

Only posts with `status: published` are included in staged and production builds. Local development includes unpublished content for author review.

Before promoting content, run:

```bash
pnpm convert --input <vault/posts> --strict
pnpm test:convert
pnpm build
```

## Related Documents

- [`astro-bootstrap.md`](astro-bootstrap.md) — project commands, routes, and build contract
- [`obsidian-conversion-contract.md`](obsidian-conversion-contract.md) — converter input/output behavior
- [`deployment-workflow.md`](deployment-workflow.md) — staging and production flow
- [`confirmed-decisions.md`](confirmed-decisions.md) — D-17, D-18
- [`decision-log.md`](decision-log.md) — DL-003

