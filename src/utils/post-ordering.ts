import type { CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'posts'>;

function bySeriesOrderAsc(a: PostEntry, b: PostEntry) {
  const orderDiff = a.data.order - b.data.order;
  return orderDiff || a.data.title.localeCompare(b.data.title);
}

export function sortPostsBySeriesOrder(posts: PostEntry[]) {
  return [...posts].sort(bySeriesOrderAsc);
}

export function postsForSeries(posts: PostEntry[], seriesSlug: string) {
  return sortPostsBySeriesOrder(posts.filter((post) => post.data.series === seriesSlug));
}

export function prevNextPosts(posts: PostEntry[], currentPostId: string) {
  const currentIndex = posts.findIndex((post) => post.id === currentPostId);

  return {
    prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  };
}
