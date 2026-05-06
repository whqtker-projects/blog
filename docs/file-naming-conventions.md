# File Naming Conventions

**Status:** Resolved — decision recorded in `confirmed-decisions.md` (D-15, D-16) and `decision-log.md` (DL-002).  
**Decided:** 2026-05-06  
**Convention:** All-lowercase kebab-case, English only, no prefix. Example: `transformer-attention-mechanism.md`

Obsidian file names directly affect internal linking, search behavior, and the Obsidian-to-blog conversion path. This document lays out the decision points and available options. The user decides.

See the related open question in [`docs/open-questions.md`](open-questions.md).

---

## Why Naming Conventions Matter

In Obsidian, file names are the primary identifier for internal links (`[[file-name]]`). In the blog conversion path, file names typically become URL slugs. A naming convention chosen now affects:

- How Obsidian `[[wikilinks]]` resolve
- What blog post URLs look like
- Whether file names remain readable in the filesystem
- How easy it is to sort, search, and organize posts by series or date

Changing conventions after many files exist is expensive — all internal links must be updated. Settling on a convention early prevents that cost.

---

## Decision Points

### 1. Language: Korean vs. English Filenames

| Option | Example | Notes |
|---|---|---|
| English only | `transformer-attention.md` | URL-safe by default; most static site generators expect ASCII slugs |
| Korean allowed | `트랜스포머-어텐션.md` | Obsidian supports this; URLs require encoding, may break some tools |
| Korean titles, English filenames | title in frontmatter, filename in English | Separates display name from file identifier |

**Consideration:** The Obsidian-to-blog conversion tool (not yet decided) may or may not handle Korean filenames in URLs gracefully.

---

### 2. Slug Format

| Option | Example | Notes |
|---|---|---|
| kebab-case | `transformer-attention-mechanism.md` | Most common for web URLs; highly compatible |
| snake_case | `transformer_attention_mechanism.md` | Common in some ecosystems; less conventional for URLs |
| CamelCase | `TransformerAttentionMechanism.md` | Readable but URL-unfriendly without normalization |
| Spaces | `Transformer Attention Mechanism.md` | Natural in Obsidian; requires encoding in URLs |

---

### 3. Case: Lowercase vs. Title Case

| Option | Example | Notes |
|---|---|---|
| All lowercase | `transformer-attention.md` | Avoids case-sensitivity issues across OS (macOS is case-insensitive by default; Linux is not) |
| Title case | `Transformer-Attention.md` | More readable as a filename; can cause cross-OS issues |

---

### 4. Series Prefix

| Option | Example | Notes |
|---|---|---|
| No prefix | `attention-mechanism.md` | Clean; relies on folder structure for organization |
| Domain prefix | `ai-attention-mechanism.md` | Makes domain visible in filename; may conflict with numbered index |
| Numbered series prefix | `ai-01-attention-mechanism.md` | Encodes reading order; brittle when order changes |

---

### 5. Date Prefix

| Option | Example | Notes |
|---|---|---|
| No date | `attention-mechanism.md` | Timeless; better for evergreen concept posts |
| ISO date prefix | `2026-05-06-attention-mechanism.md` | Useful for time-ordered content (journals, changelogs); adds noise to concept posts |

---

## Proposals (Not Chosen)

These are illustrative options only. The user selects the actual convention.

**Option A — Simple kebab, no prefix:**  
`transformer-attention-mechanism.md`  
Clean, URL-safe, no coupling to series or date. Relies on folders for organization.

**Option B — Domain-prefixed kebab:**  
`ai-transformer-attention-mechanism.md`  
Domain is visible in the filename; no reading order encoded.

**Option C — Numbered series prefix:**  
`ai-03-transformer-attention-mechanism.md`  
Encodes domain and order; brittle when posts are inserted or reordered.

---

## Next Step

This document is an input to a user decision. When the convention is chosen, the decision will be recorded in [`docs/decisions/`](decisions/) and the related open question in `open-questions.md` will be resolved.
