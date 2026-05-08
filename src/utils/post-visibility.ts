import type { CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'posts'>;

export function visiblePostsForCurrentBuild(posts: PostEntry[]): PostEntry[] {
  if (import.meta.env.DEV) return posts;
  return posts.filter((post) => post.data.status === 'published');
}
