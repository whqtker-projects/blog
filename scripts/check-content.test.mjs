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
    aliases: data.aliases,
    tags: data.tags,
  };
}

function validIndexes() {
  return [
    index('database-systems.md', {
      series: 'database-systems',
      title: 'Database Systems',
      aliases: ['series:database-systems'],
      tags: ['graph/parent-series'],
    }),
    index('database-systems/database-internals.md', {
      series: 'database-internals',
      title: 'Database Internals',
      parent: 'database-systems',
      order: 1,
      aliases: ['series:database-systems/database-internals'],
      tags: ['graph/child-series'],
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

function example(file, data) {
  return {
    file,
    title: data.title,
    post: data.post,
    order: data.order,
    status: data.status,
  };
}

function validExamples() {
  return [
    example('index-basics-demo.md', {
      title: 'Database Index Basics Demo',
      post: 'what-is-a-database-index',
      order: 1,
      status: 'published',
    }),
  ];
}

test('validateContent accepts a valid parent/child content set', () => {
  const { errors } = validateContent({
    posts: validPosts(),
    examples: validExamples(),
    indexes: validIndexes(),
  });
  assert.deepEqual(errors, []);
});

test('validateContent rejects order on a parent series', () => {
  const indexes = validIndexes();
  indexes[0].order = 1;

  const { errors } = validateContent({ posts: validPosts(), examples: validExamples(), indexes });

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
      aliases: ['series:database-systems/query-processing'],
      tags: ['graph/child-series'],
    }),
  ];

  const { errors } = validateContent({ posts: validPosts(), examples: validExamples(), indexes });

  assert.ok(
    errors.some((message) =>
      /child series order 1 under parent 'database-systems' is already used/.test(message)
    )
  );
});

test('validateContent rejects path/frontmatter mismatches for child indexes', () => {
  const indexes = [
    index('computer-networks.md', {
      series: 'computer-networks',
      title: 'Computer Networks',
      aliases: ['series:computer-networks'],
      tags: ['graph/parent-series'],
    }),
    index('network-protocols.md', {
      series: 'network-protocols',
      title: 'Network Protocols',
      parent: 'computer-networks',
      order: 1,
      aliases: ['series:computer-networks/network-protocols'],
      tags: ['graph/child-series'],
    }),
  ];

  const { errors } = validateContent({ posts: [], examples: [], indexes });

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

  const { errors } = validateContent({ posts, examples: validExamples(), indexes: validIndexes() });

  assert.ok(
    errors.some((message) => /title prefix '02' does not match explicit order 1/.test(message))
  );
});

test('parseNumericTitlePrefix handles numbered and unnumbered titles', () => {
  assert.equal(parseNumericTitlePrefix('What Is HTTP?'), null);
  assert.equal(parseNumericTitlePrefix('03. 메모리 계층 구조'), 3);
});

test('validateContent rejects stale series graph alias', () => {
  const indexes = validIndexes();
  indexes[1].aliases = ['series:database-internals'];

  const { errors } = validateContent({ posts: validPosts(), examples: validExamples(), indexes });

  assert.ok(
    errors.some((message) =>
      /aliases must be exactly \['series:database-systems\/database-internals'\]/.test(message)
    )
  );
});

test('validateContent rejects stale series graph tag', () => {
  const indexes = validIndexes();
  indexes[0].tags = ['graph/child-series'];

  const { errors } = validateContent({ posts: validPosts(), examples: validExamples(), indexes });

  assert.ok(
    errors.some((message) =>
      /tags must be exactly \['graph\/parent-series'\]/.test(message)
    )
  );
});

test('validateContent rejects examples that reference missing posts', () => {
  const examples = [
    example('missing-post-demo.md', {
      title: 'Missing Post Demo',
      post: 'missing-post',
      order: 1,
      status: 'draft',
    }),
  ];

  const { errors } = validateContent({ posts: validPosts(), examples, indexes: validIndexes() });

  assert.ok(
    errors.some((message) =>
      /example references missing post 'missing-post'/.test(message)
    )
  );
});

test('validateContent rejects nested example paths', () => {
  const examples = [
    example('what-is-a-database-index/demo.md', {
      title: 'Nested Path Demo',
      post: 'what-is-a-database-index',
      order: 1,
      status: 'draft',
    }),
  ];

  const { errors } = validateContent({ posts: validPosts(), examples, indexes: validIndexes() });

  assert.ok(
    errors.some((message) =>
      /examples must live at src\/content\/examples\/<example-slug>\.md/.test(message)
    )
  );
});

test('validateContent rejects duplicate published example order for the same post', () => {
  const examples = [
    ...validExamples(),
    example('second-demo.md', {
      title: 'Second Demo',
      post: 'what-is-a-database-index',
      order: 1,
      status: 'published',
    }),
  ];

  const { errors } = validateContent({ posts: validPosts(), examples, indexes: validIndexes() });

  assert.ok(
    errors.some((message) =>
      /example order 1 for post 'what-is-a-database-index' is used by both/.test(message)
    )
  );
});

test('validateContent rejects missing example status', () => {
  const examples = [
    example('demo.md', {
      title: 'Missing Status Demo',
      post: 'what-is-a-database-index',
      order: 1,
      status: undefined,
    }),
  ];

  const { errors } = validateContent({ posts: validPosts(), examples, indexes: validIndexes() });

  assert.ok(
    errors.some((message) =>
      /missing required 'status' field — committed examples must set/.test(message)
    )
  );
});
