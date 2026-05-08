# Post Review Checklist

**Status:** Active — confirmed on 2026-05-07.  
**Last updated:** 2026-05-07

Use this checklist before moving a post from `draft` to `review`, and again before moving from `review` to `published`.

---

## Draft → Review

All items below must pass before a post is considered ready for review.

### Content completeness

- [ ] Definition-level explanation is present and accessible to a beginner (D-6)
- [ ] Operational principles are present — mechanisms and internal behavior, not just surface description (D-6)
- [ ] Concrete examples are included inline — not replaced by external links (D-7)
- [ ] Quiz section is present and is the last section (D-8)
- [ ] Quiz has exactly 5 MCQ questions, each with 4 options and 1 correct answer (D-27)

### Content quality

- [ ] Factual accuracy: all claims are correct to the best of the author's knowledge
- [ ] Clarity: the post reads clearly for the target audience (beginner to practitioner, D-9/D-29)
- [ ] Quiz alignment: quiz questions test concepts covered in the post body, not tangential facts
- [ ] Examples are correct and directly illustrate the concept they accompany

### Metadata and formatting

- [ ] Frontmatter has `title`, `series`, and `order` (D-25)
- [ ] File name is all-lowercase kebab-case, English only (D-15, D-16)
- [ ] `series` value matches a confirmed series slug in `docs/series-backlog.md` (D-21)

---

## Review → Published

Before publishing, confirm:

- [ ] All draft → review checklist items still pass
- [ ] The post has been read through once as a reader (not as a writer)
- [ ] No placeholder text (`[Write here]`, `[Question text]`, etc.) remains
- [ ] Quiz answer explanations are complete
- [ ] `status` is set to `published` in frontmatter

### Staging Verification

After committing and pushing to `develop`, verify the Vercel Preview Deployment before promoting to `master`. See the full checklist in [`docs/deployment-workflow.md`](deployment-workflow.md#staging-verification-d-53).

---

## Related Documents

- [`docs/status-lifecycle.md`](status-lifecycle.md) — post status vocabulary and update policy
- [`docs/post-template.md`](post-template.md) — confirmed post structure rules
- [`docs/post-metadata.md`](post-metadata.md) — frontmatter field definitions
- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-6, D-7, D-8, D-25, D-27, D-29
