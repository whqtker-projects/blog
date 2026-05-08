
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
