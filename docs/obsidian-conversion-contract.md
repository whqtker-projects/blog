# Obsidian → Astro Conversion Contract

This document defines the rules the conversion script (`scripts/obsidian-to-astro.mjs`) enforces when transforming Obsidian vault posts into Astro-compatible content (D-18).

---

## Source Input Contract

### Expected vault directory structure

The script accepts a single flat directory of `.md` post files. The recommended vault layout is:

```
<vault-root>/
  posts/            ← pass this path as --input
    database-index.md
    b-plus-tree-index.md
    ...
  attachments/      ← image files referenced from posts
  templates/        ← Obsidian templates; not passed to the script
```

Non-post files (templates, notes, attachments) must live outside the `--input` directory. The script processes every `.md` file in the given directory; it does not recurse into subdirectories.

Repository policy separates real content from validation fixtures:

- Real publishable content candidates are converted into `src/content/posts/` and committed.
- Validation fixtures live in `test/fixtures/obsidian-vault/`.
- Converted output from validation fixtures must not remain in `src/content/posts/`; if conversion is needed for a rendering check, write it to a temporary or test-only location instead.

### File selection rules

| File type | Behaviour |
|-----------|-----------|
| `.md` file with valid D-15 name | Processed and written to output |
| `.md` file with invalid name (uppercase, Korean, underscore, etc.) | Skipped; error logged; exit code 1 |
| `.md` file with no frontmatter fence | Aborted with error; remaining files continue |
| Non-`.md` file (`.png`, `.pdf`, etc.) | Silently ignored |
| Subdirectory | Silently ignored (no recursion) |

### File format requirements

Every processed `.md` file must satisfy all of the following:

1. **Filename** — all-lowercase kebab-case, English only (D-15, D-16). Example: `database-index.md`.
2. **Encoding** — UTF-8. Files with other encodings produce undefined behaviour.
3. **Line endings** — LF (`\n`). CRLF is not normalised by the script; CRLF files may cause frontmatter parsing to fail.
4. **Frontmatter fence** — the file must open with `---\n`, contain a YAML block, and close with `\n---\n`. Frontmatter must appear at byte offset 0.
5. **Required frontmatter fields** — `title` (string), `series` (series slug string), `order` (integer), as per D-25. The script does not validate these; Astro's content schema enforces them at build time.
6. **Required status field** — must be one of `idea`, `draft`, `published` (D-30, D-32). Missing or unknown values will be rejected by repository validation and Astro's schema.

---

## Frontmatter Mapping

The conversion script passes the entire frontmatter block through to the output file unchanged — no field is renamed, reformatted, or removed. Mapping is 1:1.

| Obsidian field | Type | Astro field | Transformation |
|----------------|------|-------------|----------------|
| `title` | string | `title` | None |
| `series` | series slug string | `series` | None |
| `order` | integer | `order` | None |
| `status` | enum string (required) | `status` | None |
| Any other field | any | same name | Passed through as-is; Astro's Zod schema strips unknown fields at build time |

**Astro schema consistency:** The Astro content collection schema (`src/content.config.ts`) defines `title`, `series`, `order`, and `status` as required. Fields not listed in the schema are silently dropped by Zod during the build — they do not cause errors but do not appear in `post.data`.

**No Obsidian-only fields are added by the script.** If Obsidian generates metadata fields (e.g., `aliases`, `tags`, `cssclass`), they will be passed through by the script and silently dropped by Astro. They do not affect the build or the rendered output.

---

## File-Name-to-Slug Mapping

The Astro slug for a post equals the source filename without the `.md` extension.

| Source file                      | Astro slug              | Post URL                    |
|----------------------------------|-------------------------|-----------------------------|
| `database-index.md`              | `database-index`        | `/posts/database-index`     |
| `what-is-a-b-tree.md`            | `what-is-a-b-tree`      | `/posts/what-is-a-b-tree`   |

Because D-15 mandates lowercase kebab-case filenames, slugs require no further transformation.

---

## Wikilink Conversion Rules

All `[[wikilink]]` patterns in the post body are converted to standard Markdown links before writing to the output directory.

| Obsidian syntax                      | Converted Markdown                          |
|--------------------------------------|---------------------------------------------|
| `[[page-name]]`                      | `[page-name](/posts/page-name)`             |
| `[[page-name\|alias text]]`          | `[alias text](/posts/page-name)`            |
| `[[page-name#Heading Text]]`         | `[page-name](/posts/page-name#heading-text)`|
| `[[page-name#Heading Text\|alias]]`  | `[alias](/posts/page-name#heading-text)`    |

Page names in wikilinks are normalised to slug form: lowercased, spaces replaced with hyphens, non-word characters stripped. This means `[[Database Index]]` and `[[database-index]]` both resolve to `/posts/database-index`.

Heading anchors follow the same normalisation (lowercase, spaces → hyphens).

---

## Internal Link Resolution

The script collects the filenames of all `.md` files in the input directory before conversion begins. This set forms the **known slugs** registry.

A wikilink is **resolved** if its normalised slug appears in the known slugs registry. A wikilink is **unresolved** if the target slug has no corresponding source file.

Unresolved links are still converted (the URL is written as-is). They do not produce broken link syntax.

---

## Unresolved Link Behaviour

| Mode | Behaviour |
|------|-----------|
| Default | Convert the link; print a warning to stderr. Exit code 0. |
| `--strict` | Convert the link; print a warning to stderr. Exit code 1 after processing all files. |

This allows CI pipelines to enforce strict link integrity without blocking local workflows.

---

## Image Validation

When the script encounters `![[image.ext]]`, it converts the reference to standard Markdown syntax and checks whether the referenced file exists under `./src/content/attachments/` on disk.

Image filenames are preserved on disk. If a pasted image filename contains spaces, the generated Markdown URL percent-encodes the path, such as `../attachments/Pasted%20image%2020260511171546.png`.

| Mode | Behaviour |
|------|-----------|
| Default | Convert the image reference; print a warning to stderr if the file is missing. Exit code 0. |
| `--strict` | Convert the image reference; print a warning to stderr if the file is missing. Exit code 1 after processing all files. |

Warning format: `Warn: <file> — missing image src/content/attachments/<filename>`

Each missing filename is reported once per file, even if the same image is referenced multiple times.

The check runs against `./src/content/attachments/` relative to the working directory where the script is invoked (the project root). Image files stay inside the Obsidian vault rooted at `src/content`.

### Recommended image workflow

1. Configure Obsidian to store pasted images in `attachments/` under the `src/content` vault
2. Run `pnpm convert --input <vault/posts> --strict` — any missing images are reported as errors
3. Commit both the converted post and the image file under `src/content/attachments/`

This workflow keeps Obsidian-managed images in the vault and lets Astro process them as content-adjacent assets.

---

## Script Integration Point

The script is a one-shot Node.js process, not an Astro integration. Conversion is **manual and explicit** — there is no prebuild hook or watch mode.

**Trigger:** run by the author whenever Obsidian vault content has changed.

```bash
# Standard sync (warn on unresolved links)
pnpm convert --input /path/to/obsidian-vault/posts

# Strict sync — required before committing (fail on unresolved links)
pnpm convert --input /path/to/obsidian-vault/posts --strict
```

**Conversion is not part of `pnpm build`.** The Astro build reads from the already-committed `src/content/posts/` and requires no vault access. CI runs `pnpm build` only.

`pnpm build` guarantees the committed artifact is built correctly. It does not guarantee that `src/content/posts/` is current with the author's vault — that is the author's responsibility before committing. See the build contract in `docs/astro-bootstrap.md`.

Rationale for manual trigger:
- The vault path is machine-specific and cannot be hardcoded in a CI script.
- Converted files are committed to git, so CI has no need to run conversion.
- Explicit conversion makes every content change a deliberate, reviewable commit.

---

## Output Directory Structure

### Default output path

Output files are written to `./src/content/posts/` by default — the Astro content collection directory defined by D-37. The directory is created if it does not exist. Output filenames match source filenames exactly.

A custom output path can be specified with `--output <dir>`.

Use the default output path only for real publishable posts. Validation fixtures should be converted with `--output` pointing to a temporary or test-only directory so they do not re-enter the public content set by accident.

### Commit policy — generated-but-committed

`src/content/posts/` is **committed to git**. It is not gitignored.

Rationale:
- The Obsidian vault is a local, author-owned directory not available in CI or to collaborators. If converted output were gitignored, the repository could not build without the vault present.
- Committing converted content makes the repository self-contained: `pnpm build` works from any checkout without requiring the vault.
- Git diff on `src/content/posts/` provides a human-readable review of every content change before it is published — wikilink rewrites and frontmatter edits are visible in PR diffs.

The relationship between the three layers is:

```
Obsidian vault (posts/)        ← authoritative source; not in this repo
       │
       │  pnpm convert --input <vault/posts>
       ▼
src/content/posts/             ← committed converted artifact
       │
       │  pnpm build
       ▼
dist/                          ← gitignored build output
```

### What is committed vs. ignored

| Path | Policy | Reason |
|------|--------|--------|
| `src/content/posts/*.md` | **Committed** | Converted artifact; repo must be self-contained |
| `dist/` | Gitignored | Ephemeral build output |
| `.astro/` | Gitignored | Dev-server cache |
| `node_modules/` | Gitignored | Installed dependencies |

The `.gitignore` already reflects this policy and requires no changes.

---

## Related Decisions

- D-3: Obsidian Markdown is the source format; conversion is direct.
- D-15, D-16: File naming rules that constrain slug mapping.
- D-18: Conversion is automated; wikilinks are the minimum required transformation.
- D-25: Required frontmatter fields (`title`, `series`, `order`).
- D-33: Production build inclusion policy enforced by Astro route-generation filters, not by this script.
- D-36, D-37: URL structure and content collection location.
