// Local development shows every post so draft and idea routes can be inspected.
// Any non-dev build includes only explicitly published posts.
export function visibleEntriesForMode(entries, { isDev }) {
  if (isDev) return entries;
  return entries.filter((entry) => entry.data.status === 'published');
}

export function visiblePostsForMode(posts, { isDev }) {
  return visibleEntriesForMode(posts, { isDev });
}

export function visibleExamplesForMode(examples, { isDev }) {
  return visibleEntriesForMode(examples, { isDev });
}

export function visiblePostsForCurrentBuild(posts) {
  return visiblePostsForMode(posts, { isDev: import.meta.env.DEV });
}

export function visibleExamplesForCurrentBuild(examples) {
  return visibleExamplesForMode(examples, { isDev: import.meta.env.DEV });
}
