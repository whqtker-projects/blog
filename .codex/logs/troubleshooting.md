
## 2026-05-07 — Astro 6 content collection file-detection issue

**Symptom**: `pnpm astro build` reported that the `posts` collection did not exist or was empty, and `/posts/[slug]` routes were not generated.
**Cause**: In Astro 6, the legacy `type: 'content'` API did not automatically scan the post directory as expected.
**Fix**: Switched `src/content.config.ts` to an explicit `glob` loader:
```ts
import { glob } from 'astro/loaders';
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({...}),
});
```

## 2026-05-08 — `gh` CLI unavailable for GitHub issue creation

**Symptom**: `gh auth status` reported that the default token for `whqtker` was invalid, and `gh issue list --repo whqtker-projects/blog` failed to connect from the sandboxed environment.
**Cause**: The local `gh` CLI session was not usable for authenticated GitHub API operations in this workspace session.
**Fix**: Used the installed GitHub app connector tools instead of the local CLI to create repository issues directly. This avoided local re-authentication work and still allowed issue creation in `whqtker-projects/blog`.

## 2026-05-09 — Local Astro dev server could not bind in sandbox

**Symptom**: `pnpm dev --host 127.0.0.1 --port 4321` failed during verification with `listen EPERM: operation not permitted 127.0.0.1:4321`.
**Cause**: The current sandbox environment does not allow the process to bind a local listening port for ad hoc dev-server verification.
**Fix**: Verified the visibility change with `pnpm build` and static route output instead. Local-development route behavior still needs browser verification outside the sandbox if exact runtime confirmation is required.

## 2026-05-09 — Merge conflict while reconciling hierarchical-series work with `master`

**Symptom**: Merging `origin/master` into `develop` after PR #160 work produced conflicts across hierarchy docs, validation, post metadata, route files, and the deleted flat route `src/pages/series/[series].astro`.
**Cause**: `master` had advanced with the earlier status/visibility/content work while `develop` had subsequently replaced the flat series model with parent-child hierarchy changes touching many of the same files.
**Fix**: Resolved the merge by restoring the intended hierarchy-aware versions from the latest `develop` implementation commit, removing the retired flat route, and then re-running `pnpm test:repo`, `pnpm check:content`, and `pnpm build` before concluding the merge.

## 2026-05-11 — `git restore --staged` failed with sandboxed index lock error

**Symptom**: `git restore --staged ...` failed with `fatal: Unable to create '.git/index.lock': Operation not permitted` while trying to narrow the staged set before commit.
**Cause**: The sandboxed command could not update the git index in that attempt, even though no persistent `.git/index.lock` file remained afterward.
**Fix**: Re-ran the unstage step with escalated permissions, then confirmed the staged set contained only the intended files before proceeding with commit and push.
