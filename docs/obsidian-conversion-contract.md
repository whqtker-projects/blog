# Obsidian → Astro Conversion Contract

This document defines the rules the conversion script (`scripts/obsidian-to-astro.mjs`) enforces when transforming Obsidian vault posts into Astro-compatible content (D-18).

---

## Source Input Contract

The script reads `.md` files from a caller-specified directory (the Obsidian vault posts folder).

**Every source file must:**

1. Follow D-15: filename is all-lowercase kebab-case, English only (e.g., `database-index.md`).
2. Open with a YAML frontmatter block fenced by `---`.
3. Include the three required frontmatter fields from D-25: `title` (string), `series` (series slug), `order` (integer).
4. Use `status` only if desired; valid values are `idea`, `outline`, `draft`, `review`, `published` (D-30, D-32).

Files that violate rule 1 are skipped with an error. Files that violate rule 2 are aborted with an error. Rules 3–4 are validated downstream by Astro's content schema; the script does not re-validate them.

---

## Frontmatter Mapping

Frontmatter is passed through to the output file unchanged. No field is renamed, added, or removed by the script.

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

## Script Integration Point

The script is a one-shot Node.js process, not an Astro integration. It runs before the Astro build step.

**Manual invocation:**
```
pnpm convert --input /path/to/obsidian-vault/posts
```

**Pre-build workflow (recommended for CI):**
```
pnpm convert --input /path/to/obsidian-vault/posts --strict && pnpm build
```

The script is intentionally decoupled from `astro build` so local development and content editing can proceed independently.

---

## Output Directory Structure

Output files are written to `./src/content/posts/` by default (the Astro content collection location from D-37). The directory is created if it does not exist. Output filenames match source filenames exactly.

A custom output path can be specified with `--output <dir>`.

---

## Related Decisions

- D-3: Obsidian Markdown is the source format; conversion is direct.
- D-15, D-16: File naming rules that constrain slug mapping.
- D-18: Conversion is automated; wikilinks are the minimum required transformation.
- D-25: Required frontmatter fields (`title`, `series`, `order`).
- D-33: Production build inclusion policy enforced by Astro's content schema, not by this script.
- D-36, D-37: URL structure and content collection location.
