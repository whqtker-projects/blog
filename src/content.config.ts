import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    // Required fields (D-25)
    title: z.string(),
    series: z.string(),
    order: z.number(),
    // Required field (D-32); confirmed values from D-30
    status: z.enum(['idea', 'draft', 'published']),
    // Optional field (D-51); used for meta description and OG tags
    description: z.string().optional(),
  }),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/concepts' }),
  schema: z.object({
    title: z.string(),
    aliases: z.array(z.string()).optional(),
  }),
});

const series_indexes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series_indexes' }),
  schema: z.object({
    title: z.string(),
    series: z.string(),
    parent: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, concepts, series_indexes };
