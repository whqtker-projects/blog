# Rendering Compatibility

Validation results for Astro's rendering of Obsidian Markdown constructs. Validated against the sample fixture `src/content/posts/what-is-a-database-index.md` using `pnpm build`.

Validation-only source fixtures now live under `test/fixtures/obsidian-vault/`. If a rendering check needs a dedicated fixture such as `e2e-rendering-validation.md`, keep the Obsidian source there and avoid leaving its converted output in `src/content/posts/` after the check is complete.

---

## End-to-End Validation Result

**Status: PASS** — `pnpm build` completes without errors. Both `/index.html` and `/posts/what-is-a-database-index/index.html` are generated correctly.

Image rendering validated: `public/images/btree-structure.svg` is committed and referenced in the sample fixture. The build produces `<img src="/images/btree-structure.svg" alt="B+Tree structure">` in the rendered HTML, confirming that images served from `public/images/` load correctly after wikilink conversion.

---

## Obsidian Construct Inventory

| Construct | Obsidian syntax | Output | Status |
|-----------|----------------|--------|--------|
| Fenced code block (with language) | ` ```sql ... ``` ` | Shiki (`github-dark`) `<pre>` block; `sql`, `python`, `javascript` validated (#66, #67) | Supported |
| Inline code | `` `code` `` | `<code>` element | Supported |
| Headings (H1-H3) | `# ## ###` | `<h1>`-`<h3>` with auto-generated `id` anchors | Supported |
| Bold / italic | `**bold**` / `*italic*` | `<strong>` / `<em>` | Supported |
| Unordered lists | `- item` | `<ul><li>` | Supported |
| Horizontal rule | `---` | `<hr>` | Supported |
| HTML blocks (`<details>`) | `<details><summary>…</summary>…</details>` | Passed through as raw HTML | Supported |
| Post wikilink | `[[page-name]]` | `[page-name](/posts/page-name)` via conversion script; routes validated (#69) | Supported via script |
| Post wikilink with alias | `[[page-name\|alias]]` | `[alias](/posts/page-name)` via conversion script | Supported via script |
| Post wikilink with heading | `[[page-name#heading]]` | `[page-name](/posts/page-name#heading)`; anchor validated (#69) | Supported via script |
| Image wikilink | `![[image.png]]` | Markdown image with relative path `../attachments/image.png` via conversion script | Supported via script |
| Image wikilink with alt | `![[image.png\|alt]]` | Markdown image with alt text and relative path `../attachments/image.png` via conversion script | Supported via script |
| Callouts / admonitions | `> [!NOTE]` | Not natively rendered | Not used; avoid |
| Embedded queries (Dataview) | ` ```dataview ... ``` ` | Rendered as plain text | Not used; avoid |
| Obsidian tags | `#tag` in body | Rendered as `<h1>tag` (Markdown heading) | Not used; use frontmatter only |

---

## Code Block Rendering (Issue #66)

### Validation result: PASS

Fenced code blocks in the sample fixture render correctly after `pnpm build`. No raw Markdown fence text (```` ``` ````) appears in the HTML output. See Issue #67 section below for per-language highlighting evidence.

---

## Syntax Highlighting (Issue #67)

### Highlighter and theme

| Property | Value |
|----------|-------|
| Highlighter | **Shiki** (Astro built-in; no extra package required) |
| Theme | **`github-dark`** — pinned in `astro.config.mjs` for reproducibility |
| Execution | Build-time only; zero client-side JavaScript |

Configuration in `astro.config.mjs`:
```javascript
markdown: {
  shikiConfig: { theme: 'github-dark' },
},
```

### Validation result: PASS — three languages

Validated against `src/content/posts/what-is-a-database-index.md` using `pnpm build`. All three language tags produce Shiki-highlighted output; no raw ` ``` ` fence text appears in the HTML.

| Language | Blocks | Colored `<span>` tokens | Raw fence in HTML |
|----------|--------|------------------------|-------------------|
| `sql` | 2 | 9 (sample: `SELECT`, `FROM`, `WHERE`) | None |
| `python` | 1 | 43 (sample: `import`, `class`, `def`) | None |
| `javascript` | 1 | 50 (sample: `class`, `constructor`, `new`) | None |

**Output structure per block:**

```
<pre class="astro-code github-dark"
     style="background-color:#24292e;color:#e1e4e8;overflow-x:auto"
     tabindex="0"
     data-language="<lang>">
  <code>
    <span class="line">
      <span style="color:#<hex>">token</span> …
    </span>
  </code>
</pre>
```

The `data-language` attribute carries the language label. No visible language badge is rendered by the current layout — the attribute is available for CSS or JS to display if styling is added later.

---

## Heading Anchor Format

Astro generates heading `id` attributes using the following normalisation, which matches the conversion script's `toSlug()` function:

- Lowercase
- Spaces → hyphens
- Non-word characters removed

Example: `## How It Works` -> `id="how-it-works"` -> wikilink `[[post#How It Works]]` resolves to `/posts/post#how-it-works`.

---

## Internal Link Rendering (Issue #69)

### Validation result: PASS — three links across two posts

Two committed sample fixtures cross-link each other. The table below traces each link from its Obsidian wikilink source form through conversion to the rendered HTML href, and confirms the destination route is built.

| Source post | Obsidian source (vault) | Converted Markdown | Rendered `href` | Destination exists |
|---|---|---|---|---|
| `what-is-a-database-index.md` | `[[b-plus-tree-index]]` | `[B+Tree Index Structure](/posts/b-plus-tree-index)` | `/posts/b-plus-tree-index` | Yes |
| `b-plus-tree-index.md` | `[[what-is-a-database-index]]` | `[What Is a Database Index?](/posts/what-is-a-database-index)` | `/posts/what-is-a-database-index` | Yes |
| `b-plus-tree-index.md` | `[[what-is-a-database-index#Example]]` | `[…](/posts/what-is-a-database-index#example)` | `/posts/what-is-a-database-index#example` | Yes |

All three links are `<a href="…">` elements in the rendered HTML. No broken links (`404`) remain in the validated fixture set.

**Heading anchor validation:** `#Example` in the wikilink normalises to `#example` in the href (lowercase, matching Astro's auto-generated heading `id`). This confirms the conversion script's heading-anchor normalisation is consistent with the rendered output.

---

## Image Path Convention

Image files referenced via `![[filename.ext]]` in Obsidian should live under `src/content/attachments/`, because `src/content` is the Obsidian vault root. The conversion script rewrites the reference to `../attachments/filename.ext`.

Pasted image filenames may keep their Obsidian-generated names. Spaces are percent-encoded in the rendered Markdown URL while the file itself remains under `src/content/attachments/` with its original name.

Astro processes the relative image reference during build; no `public/images/` copy is needed for these pasted content images.

---

## Quiz Section Rendering

Quiz sections use the `<details>`/`<summary>` HTML pattern. This renders correctly as a native disclosure widget with no client-side JavaScript.

Astro's Markdown renderer passes raw HTML blocks through unchanged. MDX is not required.

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
