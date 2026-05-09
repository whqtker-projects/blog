import test from 'node:test';
import assert from 'node:assert/strict';

import { parseNumericTitlePrefix, validateContent } from './check-content.mjs';

function post(file, data) {
  return {
    file,
    title: data.title,
    series: data.series,
    order: data.order,
    status: data.status,
  };
}

function index(file, data) {
  return {
    file,
    title: data.title ?? data.series,
    series: data.series,
    parent: data.parent,
    order: data.order,
  };
}

function validIndexes() {
  return [
    index('database-systems.md', { series: 'database-systems', title: 'Database Systems' }),
    index('database-systems/database-internals.md', {
      series: 'database-internals',
      title: 'Database Internals',
      parent: 'database-systems',
      order: 1,
    }),
  ];
}

function validPosts() {
  return [
    post('what-is-a-database-index.md', {
      title: 'What Is a Database Index?',
      series: 'database-internals',
      order: 1,
      status: 'published',
    }),
  ];
}

test('validateContent accepts a valid parent/child content set', () => {
  const { errors } = validateContent({ posts: validPosts(), indexes: validIndexes() });
  assert.deepEqual(errors, []);
});

test('validateContent rejects order on a parent series', () => {
  const indexes = validIndexes();
  indexes[0].order = 1;

  const { errors } = validateContent({ posts: validPosts(), indexes });

  assert.ok(
    errors.some((message) =>
      /parent series 'database-systems' must not declare an 'order' field/.test(message)
    )
  );
});

test('validateContent rejects duplicate child-series order under the same parent', () => {
  const indexes = [
    ...validIndexes(),
    index('database-systems/query-processing.md', {
      series: 'query-processing',
      title: 'Query Processing',
      parent: 'database-systems',
      order: 1,
    }),
  ];

  const { errors } = validateContent({ posts: validPosts(), indexes });

  assert.ok(
    errors.some((message) =>
      /child series order 1 under parent 'database-systems' is already used/.test(message)
    )
  );
});

test('validateContent rejects path/frontmatter mismatches for child indexes', () => {
  const indexes = [
    index('computer-networks.md', { series: 'computer-networks', title: 'Computer Networks' }),
    index('network-protocols.md', {
      series: 'network-protocols',
      title: 'Network Protocols',
      parent: 'computer-networks',
      order: 1,
    }),
  ];

  const { errors } = validateContent({ posts: [], indexes });

  assert.ok(
    errors.some((message) =>
      /child series 'network-protocols' must live at src\/content\/series_indexes\/computer-networks\/network-protocols\.md/.test(
        message
      )
    )
  );
});

test('validateContent rejects numeric title-prefix mismatch against post order', () => {
  const posts = [
    post('computer-basic-structure.md', {
      title: '02. 컴퓨터의 기본 구조',
      series: 'database-internals',
      order: 1,
      status: 'idea',
    }),
  ];

  const { errors } = validateContent({ posts, indexes: validIndexes() });

  assert.ok(
    errors.some((message) => /title prefix '02' does not match explicit order 1/.test(message))
  );
});

test('parseNumericTitlePrefix handles numbered and unnumbered titles', () => {
  assert.equal(parseNumericTitlePrefix('What Is HTTP?'), null);
  assert.equal(parseNumericTitlePrefix('03. 메모리 계층 구조'), 3);
});
