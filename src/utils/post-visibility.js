export function visiblePostsForMode(posts, { isDev }) {
  if (isDev) return posts;
  return posts.filter((post) => post.data.status === 'published');
}

export function visiblePostsForCurrentBuild(posts) {
  return visiblePostsForMode(posts, { isDev: import.meta.env.DEV });
}
