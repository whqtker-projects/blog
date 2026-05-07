
## 2026-05-07 — Astro 6 content collection 파일 미인식 문제

**증상**: `pnpm astro build` 실행 시 "The collection 'posts' does not exist or is empty" 경고 발생, /posts/[slug] 라우트 미생성
**원인**: Astro 6에서 `type: 'content'` 레거시 API 사용 시 glob 디렉터리 자동 스캔이 작동하지 않음
**해결**: `src/content.config.ts`에서 `type: 'content'` 제거 후 `glob` loader 명시적 사용:
```ts
import { glob } from 'astro/loaders';
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({...}),
});
```
