import test from 'node:test';
import assert from 'node:assert/strict';

import { buildSeriesHierarchy, requireParentIndex } from '../src/utils/series-hierarchy.ts';

function index(series, data = {}) {
  return {
    id: series,
    body: '',
    collection: 'series_indexes',
    data: {
      title: data.title ?? series,
      series,
      description: data.description,
      parent: data.parent,
      order: data.order,
    },
  };
}

test('buildSeriesHierarchy sorts child series by order ascending with title fallback', () => {
  const indexes = [
    index('database-systems', { title: 'Database Systems' }),
    index('database-internals', {
      title: 'Database Internals',
      parent: 'database-systems',
      order: 2,
    }),
    index('query-processing', {
      title: 'A Query Processing',
      parent: 'database-systems',
      order: 1,
    }),
    index('transactions', {
      title: 'Z Transactions',
      parent: 'database-systems',
      order: 2,
    }),
  ];

  const { childIndexes, childrenByParent } = buildSeriesHierarchy(indexes);

  assert.deepEqual(
    childIndexes.map((entry) => entry.data.series),
    ['query-processing', 'database-internals', 'transactions']
  );
  assert.deepEqual(
    childrenByParent.get('database-systems').map((entry) => entry.data.series),
    ['query-processing', 'database-internals', 'transactions']
  );
});

test('buildSeriesHierarchy keeps parent indexes separately and sorted by title', () => {
  const indexes = [
    index('database-systems', { title: 'Database Systems' }),
    index('computer-networks', { title: 'Computer Networks' }),
    index('network-protocols', {
      title: 'Network Protocols',
      parent: 'computer-networks',
      order: 1,
    }),
  ];

  const { parentIndexes, childIndexes } = buildSeriesHierarchy(indexes);

  assert.deepEqual(
    parentIndexes.map((entry) => entry.data.series),
    ['computer-networks', 'database-systems']
  );
  assert.deepEqual(childIndexes.map((entry) => entry.data.series), ['network-protocols']);
});

test('requireParentIndex rejects child-to-child parenting', () => {
  const parent = index('computer-networks', { title: 'Computer Networks' });
  const child = index('network-protocols', {
    title: 'Network Protocols',
    parent: 'computer-networks',
    order: 1,
  });
  const grandchild = index('http-deep-dive', {
    title: 'HTTP Deep Dive',
    parent: 'network-protocols',
    order: 1,
  });

  const seriesBySlug = new Map([
    [parent.data.series, parent],
    [child.data.series, child],
    [grandchild.data.series, grandchild],
  ]);

  assert.throws(
    () => requireParentIndex(grandchild, seriesBySlug),
    /references child series 'network-protocols' as its parent/
  );
});
