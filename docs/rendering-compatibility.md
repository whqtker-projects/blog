# Rendering Compatibility

Validation results for Astro's rendering of Obsidian Markdown constructs. Validated against the sample fixture `src/content/posts/what-is-a-database-index.md` using `pnpm build`.

---

## End-to-End Validation Result

**Status: PASS** — `pnpm build` completes without errors. Both `/index.html` and `/posts/what-is-a-database-index/index.html` are generated correctly.

Image rendering validated: `public/images/btree-structure.svg` is committed and referenced in the sample fixture. The build produces `<img src="/images/btree-structure.svg" alt="B+Tree structure">` in the rendered HTML, confirming that images served from `public/images/` load correctly after wikilink conversion.

---

## Obsidian Construct Inventory

| Construct | Obsidian syntax | Output | Status |
|-----------|----------------|--------|--------|
| Fenced code block (with language) | ` ```sql ... ``` ` | Shiki-highlighted `<pre>` block; `sql` and `python` validated (#66) | ✅ Supported |
| Inline code | `` `code` `` | `<code>` element | ✅ Supported |
| Headings (H1–H3) | `# ## ###` | `<h1>`–`<h3>` with auto-generated `id` anchors | ✅ Supported |
| Bold / italic | `**bold**` / `*italic*` | `<strong>` / `<em>` | ✅ Supported |
| Unordered lists | `- item` | `<ul><li>` | ✅ Supported |
| Horizontal rule | `---` | `<hr>` | ✅ Supported |
| HTML blocks (`<details>`) | `<details><summary>…</summary>…</details>` | Passed through as raw HTML | ✅ Supported |
| Post wikilink | `[[page-name]]` | `[page-name](/posts/page-name)` via conversion script | ✅ Supported (via script) |
| Post wikilink with alias | `[[page-name\|alias]]` | `[alias](/posts/page-name)` via conversion script | ✅ Supported (via script) |
| Post wikilink with heading | `[[page-name#heading]]` | `[page-name](/posts/page-name#heading)` | ✅ Supported (via script) |
| Image wikilink | `![[image.png]]` | `![image.png](/images/image.png)` via conversion script | ✅ Supported (via script) |
| Image wikilink with alt | `![[image.png\|alt]]` | `![alt](/images/image.png)` via conversion script | ✅ Supported (via script) |
| Callouts / admonitions | `> [!NOTE]` | Not natively rendered | ⛔ Not used — avoid |
| Embedded queries (Dataview) | ` ```dataview ... ``` ` | Rendered as plain text | ⛔ Not used — avoid |
| Obsidian tags | `#tag` in body | Rendered as `<h1>tag` (Markdown heading) | ⛔ Not used — use frontmatter only |

---

## Code Block Rendering (Issue #66)

### Validation result: PASS

Fenced code blocks in the sample fixture render correctly after `pnpm build`. No raw Markdown fence text (```` ``` ````) appears in the HTML output.

**Languages validated in `src/content/posts/what-is-a-database-index.md`:**

| Language tag | Block count | Rendered as | Raw fence in HTML |
|---|---|---|---|
| `sql` | 2 | `<pre class="astro-code …" data-language="sql">` | None |
| `python` | 1 | `<pre class="astro-code …" data-language="python">` | None |

Each block is wrapped in a `<pre>` element with Shiki-generated inline `color` styles on individual `<span>` elements per token. The `data-language` attribute on `<pre>` carries the language label; no visible language badge is rendered by the current layout (unstyled, not a gap).

### Syntax highlighting

Astro uses **Shiki** as its built-in highlighter. Theme is pinned to `github-dark` in `astro.config.mjs`.

Shiki runs at build time; no client-side JavaScript is required. All languages supported by Shiki are available.

---

## Heading Anchor Format

Astro generates heading `id` attributes using the following normalisation, which matches the conversion script's `toSlug()` function:

- Lowercase
- Spaces → hyphens
- Non-word characters removed

Example: `## How It Works` → `id="how-it-works"` → wikilink `[[post#How It Works]]` resolves to `/posts/post#how-it-works`. ✅

---

## Image Path Convention

Image files referenced via `![[filename.ext]]` in Obsidian must be placed in `public/images/` before the Astro build runs. The conversion script rewrites the reference to `/images/filename.ext`.

Copying image files from the vault to `public/images/` is a manual step until a dedicated copy script is added.

---

## Quiz Section Rendering

Quiz sections use the `<details>`/`<summary>` HTML pattern. This renders correctly as a native disclosure widget with no client-side JavaScript.

Astro's Markdown renderer passes raw HTML blocks through unchanged. MDX is not required. ✅

---

## MDX Decision

**MDX is not adopted at this stage.**

Rationale: all current content constructs (code blocks, quiz `<details>`, standard Markdown) render correctly with plain `.md` files. MDX would add build complexity and migration overhead without providing a benefit given the current post format.

This decision is revisited if interactive components or component composition become required.

---

## Related Decisions

- D-17: Astro is the static site generator.
- D-18: Conversion is automated via script; wikilinks are the minimum required transformation.
- D-26–D-28: Post format (flexible sections, quiz last, 5 MCQ, no length limit).
- D-27: Quiz section uses `<details>` HTML — no MDX required.
