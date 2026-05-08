
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
