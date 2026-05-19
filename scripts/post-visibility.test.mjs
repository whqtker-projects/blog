import test from 'node:test';
import assert from 'node:assert/strict';

import {
  visibleEntriesForMode,
  visiblePostsForMode,
  visibleExamplesForMode,
} from '../src/utils/post-visibility.js';

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

test('visibleEntriesForMode returns only published entries outside local development', () => {
  const entries = [
    post('draft-example', 'draft'),
    post('idea-example', 'idea'),
    post('published-example', 'published'),
  ];

  const visible = visibleEntriesForMode(entries, { isDev: false });

  assert.deepEqual(visible.map((entry) => entry.id), ['published-example']);
});

test('visibleExamplesForMode follows the same visibility contract as posts', () => {
  const examples = [
    post('draft-example', 'draft'),
    post('published-example', 'published'),
  ];

  const visible = visibleExamplesForMode(examples, { isDev: true });

  assert.deepEqual(visible.map((entry) => entry.id), ['draft-example', 'published-example']);
});
