# GitHub Issue Workflow — Claude Code

This manual covers how to create GitHub issues and proceed with work using Claude Code, based on official best practices.

---

## Prerequisites

Install the `gh` CLI. Claude Code knows how to use `gh` natively — without it, Claude falls back to unauthenticated GitHub API calls that hit rate limits.

```bash
brew install gh
gh auth login
```

Verify:

```bash
gh auth status
```

---

## 1. Creating a GitHub Issue

### Ask Claude directly

The most straightforward approach is to tell Claude what you want to track and let it compose and create the issue.

```text
create a github issue for adding prev/next navigation to post pages.
write a clear description of the current state, what needs to change, and acceptance criteria.
labels: enhancement
```

Claude runs `gh issue create` with the right flags. You can also let Claude write the body:

```text
create a github issue for adding image existence validation to the conversion script.
explain the current gap and what the expected new behavior should be.
```

### Manual `gh` command (reference)

```bash
gh issue create \
  --title "Add prev/next navigation to post pages" \
  --body "$(cat <<'EOF'
## Purpose
Post pages have no navigation between adjacent posts in the same series.

## Tasks
- [ ] Calculate prev/next post within the same series by order
- [ ] Pass prev/next as props to PostLayout.astro
- [ ] Render navigation links in the layout

## Acceptance criteria
- [ ] Each post page renders prev/next links within its series
- [ ] First post has no prev; last post has no next
- [ ] pnpm build passes without errors
EOF
)" \
  --label "enhancement"
```

---

## 2. Issue Structure Convention

Each issue should contain:

| Field | What to put |
|---|---|
| **Title** | `[Domain] Short action phrase` — e.g., `[Planning] Finalize post template` |
| **Context** | Why this needs to be resolved; link to relevant planning docs |
| **Acceptance criteria** | Checkboxes that define "done" concretely |
| **Labels** | `content`, `enhancement`, `workflow`, `documentation`, `decision` |

Vague acceptance criteria force you to become the only feedback loop. Concrete checkboxes let Claude verify its own work.

---

## 3. Working an Issue: The Recommended Flow

Claude Code best practices recommend separating exploration, planning, and implementation into distinct phases.

### Step 1 — Read the issue

```text
use `gh issue view 3` to read issue #3 and understand what needs to be done.
```

### Step 2 — Explore (plan mode)

Enter plan mode so Claude reads files without making changes.

```bash
# Toggle plan mode
Shift+Tab
```

```text
read CLAUDE.md and docs/README.md.
understand the current repository stage and which files are relevant to this issue.
```

### Step 3 — Plan

```text
propose a concrete plan to resolve this issue.
what files need to change? what decisions need to be made?
```

Review the plan. If it looks right, exit plan mode and proceed.

### Step 4 — Implement

```text
implement the plan. update the relevant planning docs and decision records.
```

### Step 5 — Commit and link to the issue

```text
commit with a descriptive message that references issue #3.
```

Claude will produce a commit message like:

```
docs: define series structure for AI/ML domain

Resolves #3
```

### Step 6 — Create a PR

```text
create a pr for these changes.
```

Claude runs `gh pr create`. Once created, the session is automatically linked to the PR. To resume later:

```bash
claude --from-pr <pr-number>
```

---

## 4. Using a `fix-issue` Skill (Recommended for Repeated Use)

For tasks you run frequently, define a skill so Claude follows the same steps every time.

Create `.claude/skills/fix-issue/SKILL.md`:

```markdown
---
name: fix-issue
description: GitHub 이슈를 읽는 단계부터 PR까지 처리
disable-model-invocation: true
---
Analyze and resolve GitHub issue: $ARGUMENTS

1. Run `gh issue view $ARGUMENTS` to read the issue
2. Understand the problem and acceptance criteria
3. Read the relevant planning documents
4. Implement the necessary changes
5. Verify against each acceptance criterion
6. Commit with a message that includes `Resolves #$ARGUMENTS`
7. Push and create a PR with `gh pr create`
```

Invoke with:

```text
/fix-issue 3
```

`disable-model-invocation: true` means the skill only runs when you explicitly call it, not automatically.

---

## 5. Viewing and Managing Issues

```bash
# List open issues
gh issue list

# List by label
gh issue list --label planning

# View a specific issue
gh issue view 3

# Close an issue (Claude can do this too)
gh issue close 3 --comment "Resolved in PR #7"
```

Ask Claude:

```text
list all open issues labeled "planning" and summarize what's still unresolved.
```

---

## 6. GitHub Actions Integration (Optional)

If the repo has Claude Code GitHub Actions configured, you can mention `@claude` in any issue or PR comment to trigger automated work:

```text
@claude implement the post template structure described in this issue
```

Setup:

```bash
# Run inside Claude Code
/install-github-app
```

This requires repo admin access and an `ANTHROPIC_API_KEY` repository secret.

---

## 7. Key Principles from Claude Code Best Practices

- **Give Claude a way to verify its work.** Write acceptance criteria as checkboxes. Claude checks them off as it works.
- **Explore first, then plan, then implement.** Never skip to coding without reading the context.
- **Keep context clean.** Run `/clear` between unrelated issues. Each issue gets its own session when possible.
- **Install `gh`.** It is the most context-efficient way for Claude to interact with GitHub.
- **Reference files with `@`.** Instead of describing where a document lives, use `@CLAUDE.md` or `@docs/first-content-readiness.md` directly in your prompt.

---

## 8. Recommended Label Set for This Project

| Label | Meaning |
|---|---|
| `content` | Post drafting, series preparation, content-related tasks |
| `enhancement` | New site features (routing, navigation, layout) |
| `workflow` | CI, conversion pipeline, build process |
| `documentation` | Planning docs, workflow docs, guide updates |
| `decision` | Items that require a decision recorded in `docs/confirmed-decisions.md` |
| `planning` | Series planning, candidate post selection |
| `bug` | Something broken in the build or conversion pipeline |
