import test from 'node:test';
import assert from 'node:assert/strict';

import {
  postsForSeries,
  prevNextPosts,
  sortPostsBySeriesOrder,
} from '../src/utils/post-ordering.ts';

function post(id, data = {}) {
  return {
    id,
    data: {
      title: data.title ?? id,
      series: data.series ?? 'database-internals',
      order: data.order ?? 1,
    },
  };
}

test('sortPostsBySeriesOrder sorts by order with title fallback', () => {
  const posts = [
    post('wal', { title: 'Write-Ahead Log', order: 2 }),
    post('acid', { title: 'ACID', order: 1 }),
    post('btree', { title: 'B+Tree Index', order: 2 }),
  ];

  const sorted = sortPostsBySeriesOrder(posts);

  assert.deepEqual(sorted.map((entry) => entry.id), ['acid', 'btree', 'wal']);
});

test('postsForSeries filters by child series before sorting', () => {
  const posts = [
    post('tcp-flow', { series: 'transport-and-reliability', order: 2 }),
    post('tcp-connection', { series: 'transport-and-reliability', order: 1 }),
    post('dns-resolution', { series: 'network-foundations', order: 1 }),
  ];

  const sorted = postsForSeries(posts, 'transport-and-reliability');

  assert.deepEqual(sorted.map((entry) => entry.id), ['tcp-connection', 'tcp-flow']);
});

test('prevNextPosts returns adjacent posts from an ordered series list', () => {
  const orderedPosts = [
    post('a', { order: 1 }),
    post('b', { order: 2 }),
    post('c', { order: 3 }),
  ];

  assert.deepEqual(prevNextPosts(orderedPosts, 'a'), {
    prev: null,
    next: orderedPosts[1],
  });
  assert.deepEqual(prevNextPosts(orderedPosts, 'b'), {
    prev: orderedPosts[0],
    next: orderedPosts[2],
  });
  assert.deepEqual(prevNextPosts(orderedPosts, 'c'), {
    prev: orderedPosts[1],
    next: null,
  });
});
