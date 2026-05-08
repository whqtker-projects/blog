import test from 'node:test';
import assert from 'node:assert/strict';

import { visiblePostsForMode } from '../src/utils/post-visibility.js';

function post(id, status) {
  return {
    id,
    data: {
      status,
    },
  };
}

test('visiblePostsForMode returns all posts in local development', () => {
  const posts = [
    post('draft-post', 'draft'),
    post('idea-post', 'idea'),
    post('published-post', 'published'),
  ];

  const visible = visiblePostsForMode(posts, { isDev: true });

  assert.deepEqual(visible.map((entry) => entry.id), [
    'draft-post',
    'idea-post',
    'published-post',
  ]);
});

test('visiblePostsForMode returns only published posts outside local development', () => {
  const posts = [
    post('draft-post', 'draft'),
    post('idea-post', 'idea'),
    post('published-post', 'published'),
  ];

  const visible = visiblePostsForMode(posts, { isDev: false });

  assert.deepEqual(visible.map((entry) => entry.id), ['published-post']);
});
