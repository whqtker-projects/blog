# Concept Authoring Workflow

This document describes how to create and link to concept pages — standalone reference entries that are separate from series posts.

---

## What Is a Concept Page?

A concept page is a short reference entry for a single technical term or protocol. Concepts differ from posts:

| | Post | Concept |
|---|---|---|
| URL | `/posts/<slug>` | `/concepts/<slug>` |
| Belongs to series | Yes (required) | No |
| Has order | Yes (required) | No |
| Purpose | In-depth explanation with examples and quiz | Concise reference definition |
| Linked from | Posts, homepage, series pages | Posts (via explicit concept links) |

---

## Vault Directory Layout

Concept files live in a separate `concepts/` directory inside the Obsidian vault, parallel to `posts/`:

```
<vault-root>/
  posts/          ← passed to pnpm convert via --input
  concepts/       ← passed to pnpm convert via --concepts
  attachments/
  templates/
```

Concept files must not be placed in `posts/`. They are processed separately.

---

## File Naming

Concept file names follow the same D-15 rule as posts: all-lowercase kebab-case, English only.

```
tcp.md
http.md
dns.md
tls.md
```

The file name without `.md` becomes the URL slug: `tcp.md` → `/concepts/tcp`.

---

## Minimum Frontmatter

```yaml
---
title: "Transmission Control Protocol"
aliases: [TCP]
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Full display name of the concept |
| `aliases` | No | YAML inline array of alternative names; all values are lowercased for lookup |

There is no `series`, `order`, or `status` field on concept files. Concept pages are always rendered and are not filtered by status.

---

## Writing Concept Body Content

A concept page body should be short — one to three sentences giving a concise definition. Longer explanations belong in posts.

Example:

```markdown
---
title: "Transmission Control Protocol"
aliases: [TCP]
---

TCP is a transport-layer protocol that provides reliable, ordered, and error-checked
delivery of data between applications over an IP network.
```

---

## Linking to Concepts from Posts

Use explicit concept-link syntax in Obsidian:

| Syntax | Rendered output |
|--------|----------------|
| `[[concept:tcp]]` | `[tcp](/concepts/tcp)` |
| `[[concept:tcp\|TCP]]` | `[TCP](/concepts/tcp)` |
| `[[concept:TCP]]` | `[TCP](/concepts/tcp)` (alias resolved) |

The `concept:` prefix distinguishes concept links from normal post wikilinks (`[[post-slug]]`). Normal wikilinks without the prefix continue to resolve to `/posts/<slug>`.

Alias resolution: the text after `concept:` is lowercased and looked up in the alias map built from all concept files. If found, it resolves to the canonical slug; otherwise the normalized text is used as-is.

---

## Conversion Workflow

1. Author concept files in the vault `concepts/` directory.
2. Run the conversion script with both `--input` and `--concepts`:

```bash
pnpm convert --input /path/to/vault/posts --concepts /path/to/vault/concepts
```

Use `--strict` before committing to catch unresolved concept links:

```bash
pnpm convert --input /path/to/vault/posts --concepts /path/to/vault/concepts --strict
```

3. Converted files are written to:
   - Posts → `src/content/posts/`
   - Concepts → `src/content/concepts/`

4. Commit both directories. Run `pnpm build` to verify.

---

## Committed Concept Seeds

The following concept seed files are committed to `src/content/concepts/`:

| File | Title | Aliases |
|------|-------|---------|
| `tcp.md` | Transmission Control Protocol | TCP |
| `http.md` | HyperText Transfer Protocol | HTTP |
| `dns.md` | Domain Name System | DNS |
| `tls.md` | Transport Layer Security | TLS, SSL |

These seeds are real concept pages, not validation fixtures. They render at `/concepts/<slug>`.

---

## Related Documents

- [`docs/obsidian-conversion-contract.md`](obsidian-conversion-contract.md) — full conversion pipeline contract
- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-15, D-16, D-25
- [`src/content.config.ts`](../src/content.config.ts) — Astro content collection schema for concepts
