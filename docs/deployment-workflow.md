# Deployment Workflow

**Status:** Active — first deployment configured 2026-05-08.  
**Last updated:** 2026-05-08

This document describes how the blog is deployed to production and staging, what validation gates apply, and how work moves between branches.

---

## Branches

| Branch | Role | Vercel target |
|--------|------|---------------|
| `master` | Production | Production deployment — live at `blog-seven-rho-24.vercel.app` |
| `develop` | Staging | Preview Deployment — unique URL per deploy, protected by Vercel auth |

These roles are confirmed decisions D-45 and D-46. `develop` is the default branch and the integration branch for all ongoing work; `master` is the public-facing production branch.

**All agent and automated work targets `develop`.** Direct commits to `master` are blocked by repository ruleset.

---

## Production Deployment

A push to `master` triggers an automatic Vercel production deployment.

**Pre-merge gate (D-47):** CI must pass before any merge to `master`. CI runs:

```
pnpm install --frozen-lockfile
pnpm test:convert
pnpm build
```

The CI workflow (`.github/workflows/ci.yml`) runs on every push and pull_request to `master` and `develop` (D-48). Do not merge to `master` while CI is red.

**Build contract:** Vercel runs `pnpm build` against the committed `src/content/` files. Conversion from Obsidian is not part of the CI or deployment — content must be converted and committed locally before pushing. See `docs/astro-bootstrap.md` for the full content workflow.

**Output:** `dist/` — 12 static HTML pages plus assets. `dist/` is gitignored; Vercel builds it fresh on every deployment.

---

## Staging Deployment (`develop`)

A push to `develop` triggers a Vercel Preview Deployment. The URL is unique per deployment (e.g., `blog-<hash>-whqtkers-projects.vercel.app`).

Preview Deployments are protected by Vercel's default deployment protection — they require a logged-in Vercel account to view. This is intentional: staging is for the author, not the public.

The same CI gate applies to `develop` (D-48). A staging deploy will still build even if CI is red, but do not treat a red-CI staging URL as a reliable preview.

---

## Promotion Flow

```
Obsidian vault
    │
    │  pnpm convert --strict
    ▼
src/content/  ←  commit here
    │
    │  push to develop
    ▼
Staging Preview Deployment  ←  verify here
    │
    │  PR: develop → master  (CI must pass)
    ▼
Production Deployment  ←  live site
```

The typical author workflow before publishing a post:

1. Convert and commit content to `src/content/`
2. Push to `develop` — verify the staging Preview Deployment looks correct
3. Open a PR from `develop` → `master` — wait for CI to pass
4. Merge — Vercel deploys to production automatically

**PR creation and merge to `master` are always the author's decision.** No tooling or automation creates or merges these PRs. The author decides when content is ready for production.

For minor fixes (typos, broken links, non-content changes), pushing directly to `master` is acceptable — CI still runs and the deploy gate holds.

---

## If a Deployment Fails

**Build failure (Vercel):** Check the deployment log in the Vercel dashboard or via:

```bash
npx vercel logs <deployment-url>
```

Common causes:
- Schema error in `vercel.json` — validate against the Vercel schema docs
- Astro build error — reproduce locally with `pnpm build` first
- Dependency install failure — check `pnpm-lock.yaml` is committed and up to date

**CI failure (GitHub Actions):** Check the failing step in the Actions tab. The two CI steps are `pnpm test:convert` and `pnpm build`. Both must pass before merging to `master`.

**Rollback:** Vercel keeps all previous production deployments. To roll back, go to the Vercel dashboard → Deployments → select the previous successful deployment → Promote to Production.

---

## Vercel Configuration

The repository-side configuration lives in `vercel.json`:

```json
{
  "framework": "astro",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

Project-level settings (Node.js version, production branch, GitHub integration) are managed in the Vercel dashboard under the `blog` project in `whqtkers-projects`.

---

## What Is Not in Scope

- Custom domain — deferred (D-49). The site runs on `*.vercel.app` URLs until a domain is configured.
- Analytics, monitoring, or error tracking — not configured.
- Environment variables — this site has no runtime env vars; all content is statically built.

---

## Related Documents

- [`docs/astro-bootstrap.md`](astro-bootstrap.md) — build commands, content workflow, and directory structure
- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-44 through D-49 (deployment decisions)
- [`docs/publishing-workflow.md`](publishing-workflow.md) — Obsidian-to-Astro conversion workflow
- `.github/workflows/ci.yml` — CI workflow definition
- `vercel.json` — Vercel build configuration
