# First-Post Outline Template

**Purpose:** Reusable starting point for a new blog post in Obsidian.  
**Format rules:** See [`docs/post-template.md`](post-template.md).  
**Metadata rules:** See [`docs/post-metadata.md`](post-metadata.md).

Copy this file into your Obsidian vault when starting a new post. Replace all `[placeholder]` values.

---

## Obsidian File

**File name:** `[topic-slug].md` — all-lowercase kebab-case, English only (D-15, D-16).  
Example: `b-plus-tree-index.md`, `tcp-three-way-handshake.md`

---

## Frontmatter

```yaml
---
title: "[Post title — Korean or English]"
series: [series-slug]
order: [integer, position in series starting from 1]
status: draft   # optional — omit if not tracking status in Obsidian
---
```

**Example:**

```yaml
---
title: "B+Tree 인덱스 구조"
series: database-internals
order: 1
status: draft
---
```

---

## Post Body

Section titles and ordering are chosen per post (D-26). The three content areas below must be present in some form; their titles and sequence adapt to the topic's natural flow. The Quiz section is always last (D-8).

---

### [Section 1 title — definition-level explanation]

*(Required: D-6. What the topic is. Accessible to a reader encountering it for the first time.)*

[Write here]

---

### [Section 2 title — operational principles]

*(Required: D-6. How it works internally — mechanisms, processes, underlying behavior.)*

[Write here]

---

### [Section 3 title — examples]

*(Required: D-7. Concrete examples inline. Do not link to external resources as a substitute.)*

[Write here]

---

## Quiz

*(Required, always last: D-8. Exactly 5 MCQ. 4 options per question, 1 correct answer: D-27.)*

**Q1.** [Question text]

- A) [Option]
- B) [Option]
- C) [Option]
- D) [Option]

<details>
<summary>Answer</summary>
[Correct option letter]. [Brief explanation]
</details>

---

**Q2.** [Question text]

- A) [Option]
- B) [Option]
- C) [Option]
- D) [Option]

<details>
<summary>Answer</summary>
[Correct option letter]. [Brief explanation]
</details>

---

**Q3.** [Question text]

- A) [Option]
- B) [Option]
- C) [Option]
- D) [Option]

<details>
<summary>Answer</summary>
[Correct option letter]. [Brief explanation]
</details>

---

**Q4.** [Question text]

- A) [Option]
- B) [Option]
- C) [Option]
- D) [Option]

<details>
<summary>Answer</summary>
[Correct option letter]. [Brief explanation]
</details>

---

**Q5.** [Question text]

- A) [Option]
- B) [Option]
- C) [Option]
- D) [Option]

<details>
<summary>Answer</summary>
[Correct option letter]. [Brief explanation]
</details>

---

## Notes for Authors

- Section count is not fixed. Add more sections if the topic requires it — definition and operational principles can each span multiple sections.
- Examples can be inline code blocks, diagrams (as Obsidian embeds), or step-by-step walkthroughs — whatever makes the concept clearest.
- The quiz answer is hidden in Obsidian using `<details>` / `<summary>`. The Astro build step will convert this to an interactive component.
- Do not add `domain` to the frontmatter — it is inferred from `series` at build time.
