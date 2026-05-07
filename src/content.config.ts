import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    // Required fields (D-25)
    title: z.string(),
    series: z.string(),
    order: z.number(),
    // Optional field (D-32); confirmed values from D-30
    status: z.enum(['idea', 'outline', 'draft', 'review', 'published']).optional(),
  }),
});

export const collections = { posts };
