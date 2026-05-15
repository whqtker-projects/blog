// Local development shows every post so draft and idea routes can be inspected.
// Any non-dev build includes only explicitly published posts.
export function visiblePostsForMode(posts, { isDev }) {
  if (isDev) return posts;
  return posts.filter((post) => post.data.status === 'published');
}

export function visiblePostsForCurrentBuild(posts) {
  return visiblePostsForMode(posts, { isDev: import.meta.env.DEV });
}
