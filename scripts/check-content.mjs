/**
 * check-content.mjs — validates content-structure invariants.
 * Run via: pnpm check:content
 *
 * Checks:
 *   1. No two series_indexes documents share the same series value
 *   2. Parent-child hierarchy is structurally valid
 *   3. Every series value in posts/ has a matching child series index
 *   4. Series index file paths match the parent-child layout contract
 *   5. Child-series ordering metadata is valid and parent series stay unordered
 *   6. No two explicitly published posts in the same child series share the same order value
 *   7. Fail when a post omits status, because committed posts must set status explicitly
 *   8. Fail when a post uses a status outside the simplified vocabulary
 *   9. Numeric post title prefixes, when present, must match post order
 *   10. Series graph aliases and graph tags match derived parent/child metadata
 *   11. Every example attaches to an existing post
 *   12. Example files live directly under src/content/examples/
 *   13. No two explicitly published examples attached to the same post share the same order value
 *   14. Example status values are explicit and use the simplified vocabulary
 */

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMarkdownFrontmatterRecords } from './node-content-helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ALLOWED_POST_STATUSES = new Set(['idea', 'draft', 'published']);

function splitIndexPath(index) {
  return index.file.replace(/\.md$/, '').split('/');
}

export function parseNumericTitlePrefix(title) {
  const match = title.match(/^(\d+)\.\s+/);
  return match ? Number(match[1]) : null;
}

function expectedSeriesAlias(index) {
  return index.parent ? `series:${index.parent}/${index.series}` : `series:${index.series}`;
}

function expectedSeriesGraphTag(index) {
  return index.parent ? 'graph/child-series' : 'graph/parent-series';
}

export function validateContent({ posts, examples = [], indexes }) {
  const errors = [];
  const indexesBySeries = new Map();
  const postsBySlug = new Map(posts.map((post) => [post.file.replace(/\.md$/, ''), post]));
  const checks = [];

  function runCheck(label, fn) {
    const checkErrors = [];

    function fail(message) {
      errors.push(message);
      checkErrors.push(message);
    }

    fn(fail);
    checks.push({ label, errors: checkErrors });
  }

  runCheck('Check 1: no duplicate series_indexes for the same series', (fail) => {
    for (const idx of indexes) {
      if (!idx.series) {
        fail(`${idx.file}: missing required 'series' field`);
        continue;
      }

      if (indexesBySeries.has(idx.series)) {
        fail(
          `series '${idx.series}' is declared in both '${indexesBySeries.get(idx.series).file}' and '${idx.file}'`
        );
        continue;
      }

      indexesBySeries.set(idx.series, idx);
    }
  });

  runCheck('Check 2: parent-child series hierarchy is structurally valid', (fail) => {
    for (const idx of indexes) {
      if (!idx.parent) continue;

      if (idx.parent === idx.series) {
        fail(`${idx.file}: series '${idx.series}' cannot reference itself as parent`);
        continue;
      }

      const parentIndex = indexesBySeries.get(idx.parent);
      if (!parentIndex) {
        fail(
          `${idx.file}: child series '${idx.series}' references missing parent series '${idx.parent}'`
        );
        continue;
      }

      if (parentIndex.parent) {
        fail(
          `${idx.file}: child series '${idx.series}' references child series '${idx.parent}' as parent; only two levels are allowed`
        );
      }
    }
  });

  runCheck('Check 3: every post series has a matching child series index', (fail) => {
    const postSeriesValues = new Set(posts.map((post) => post.series).filter(Boolean));
    for (const series of postSeriesValues) {
      const index = indexesBySeries.get(series);
      if (!index) {
        fail(
          `series '${series}' has posts but no series index document in src/content/series_indexes/`
        );
        continue;
      }

      if (!index.parent) {
        fail(
          `series '${series}' is a parent series; posts must attach to a child series instead`
        );
      }
    }
  });

  runCheck('Check 4: series index file paths match the parent-child layout contract', (fail) => {
    for (const idx of indexes) {
      const pathParts = splitIndexPath(idx);

      if (!idx.parent) {
        if (pathParts.length !== 1) {
          fail(
            `${idx.file}: parent series '${idx.series}' must live at src/content/series_indexes/${idx.series}.md`
          );
          continue;
        }

        if (pathParts[0] !== idx.series) {
          fail(
            `${idx.file}: parent series file name must match its series field '${idx.series}'`
          );
        }
        continue;
      }

      if (pathParts.length !== 2) {
        fail(
          `${idx.file}: child series '${idx.series}' must live at src/content/series_indexes/${idx.parent}/${idx.series}.md`
        );
        continue;
      }

      const [parentDir, childFile] = pathParts;
      if (parentDir !== idx.parent) {
        fail(
          `${idx.file}: child series '${idx.series}' must be placed under parent directory '${idx.parent}'`
        );
      }

      if (childFile !== idx.series) {
        fail(
          `${idx.file}: child series file name must match its series field '${idx.series}'`
        );
      }
    }
  });

  runCheck('Check 5: child-series order metadata is valid', (fail) => {
    const childOrderKeys = new Map();

    for (const idx of indexes) {
      if (!idx.parent) {
        if (idx.order !== undefined) {
          fail(`${idx.file}: parent series '${idx.series}' must not declare an 'order' field`);
        }
        continue;
      }

      if (!Number.isInteger(idx.order) || idx.order < 1) {
        fail(
          `${idx.file}: child series '${idx.series}' must declare a positive integer 'order' field`
        );
        continue;
      }

      const key = `${idx.parent}::${idx.order}`;
      if (childOrderKeys.has(key)) {
        fail(
          `${idx.file}: child series order ${idx.order} under parent '${idx.parent}' is already used by '${childOrderKeys.get(key)}'`
        );
      } else {
        childOrderKeys.set(key, idx.file);
      }
    }
  });

  runCheck(
    'Check 6: no duplicate order values within a child series (explicitly published posts)',
    (fail) => {
      const publishedPosts = posts.filter((post) => post.status === 'published');
      const orderKeys = new Map();

      for (const post of publishedPosts) {
        if (!post.series || post.order === undefined) continue;

        const key = `${post.series}::${post.order}`;
        if (orderKeys.has(key)) {
          fail(
            `order ${post.order} in series '${post.series}' is used by both '${orderKeys.get(key)}' and '${post.file}'`
          );
        } else {
          orderKeys.set(key, post.file);
        }
      }
    }
  );

  runCheck('Check 7: no posts may omit status', (fail) => {
    for (const post of posts) {
      if (post.status === undefined) {
        fail(
          `${post.file}: missing required 'status' field — committed posts must set one of ${Array.from(ALLOWED_POST_STATUSES).join(', ')}`
        );
      }
    }
  });

  runCheck('Check 8: status values use the simplified vocabulary', (fail) => {
    for (const post of posts) {
      if (post.status !== undefined && !ALLOWED_POST_STATUSES.has(post.status)) {
        fail(
          `${post.file}: invalid status '${post.status}' — allowed values are ${Array.from(ALLOWED_POST_STATUSES).join(', ')}`
        );
      }
    }
  });

  runCheck('Check 9: numeric post title prefixes match explicit order when present', (fail) => {
    for (const post of posts) {
      if (!post.title || !Number.isInteger(post.order)) continue;

      const prefixOrder = parseNumericTitlePrefix(post.title);
      if (prefixOrder === null) continue;

      if (prefixOrder !== post.order) {
        fail(
          `${post.file}: title prefix '${String(prefixOrder).padStart(2, '0')}' does not match explicit order ${post.order}`
        );
      }
    }
  });

  runCheck('Check 10: series graph aliases and tags match derived metadata', (fail) => {
    for (const idx of indexes) {
      if (!idx.series) continue;

      const expectedAlias = expectedSeriesAlias(idx);
      if (!Array.isArray(idx.aliases) || idx.aliases.length !== 1 || idx.aliases[0] !== expectedAlias) {
        fail(
          `${idx.file}: aliases must be exactly ['${expectedAlias}']; run pnpm sync:series-graph`
        );
      }

      const expectedTag = expectedSeriesGraphTag(idx);
      if (!Array.isArray(idx.tags) || idx.tags.length !== 1 || idx.tags[0] !== expectedTag) {
        fail(
          `${idx.file}: tags must be exactly ['${expectedTag}']; run pnpm sync:series-graph`
        );
      }
    }
  });

  runCheck('Check 11: every example attaches to an existing post', (fail) => {
    for (const example of examples) {
      if (!example.post) {
        fail(`${example.file}: missing required 'post' field`);
        continue;
      }

      if (!postsBySlug.has(example.post)) {
        fail(
          `${example.file}: example references missing post '${example.post}' in src/content/posts/`
        );
      }
    }
  });

  runCheck('Check 12: example files live directly under src/content/examples/', (fail) => {
    for (const example of examples) {
      const pathParts = example.file.replace(/\.md$/, '').split('/');
      if (pathParts.length !== 1) {
        fail(
          `${example.file}: examples must live at src/content/examples/<example-slug>.md`
        );
      }
    }
  });

  runCheck(
    'Check 13: no duplicate order values within a post for explicitly published examples',
    (fail) => {
      const publishedExamples = examples.filter((example) => example.status === 'published');
      const orderKeys = new Map();

      for (const example of publishedExamples) {
        if (!example.post || example.order === undefined) continue;

        const key = `${example.post}::${example.order}`;
        if (orderKeys.has(key)) {
          fail(
            `example order ${example.order} for post '${example.post}' is used by both '${orderKeys.get(key)}' and '${example.file}'`
          );
        } else {
          orderKeys.set(key, example.file);
        }
      }
    }
  );

  runCheck('Check 14: example status values are explicit and use the simplified vocabulary', (fail) => {
    for (const example of examples) {
      if (example.status === undefined) {
        fail(
          `${example.file}: missing required 'status' field — committed examples must set one of ${Array.from(ALLOWED_POST_STATUSES).join(', ')}`
        );
        continue;
      }

      if (!ALLOWED_POST_STATUSES.has(example.status)) {
        fail(
          `${example.file}: invalid status '${example.status}' — allowed values are ${Array.from(ALLOWED_POST_STATUSES).join(', ')}`
        );
      }
    }
  });

  return { errors, checks };
}

export function loadRepositoryContent() {
  const postsDir = join(ROOT, 'src/content/posts');
  const examplesDir = join(ROOT, 'src/content/examples');
  const indexesDir = join(ROOT, 'src/content/series_indexes');

  return {
    posts: readMarkdownFrontmatterRecords(postsDir),
    examples: readMarkdownFrontmatterRecords(examplesDir),
    indexes: readMarkdownFrontmatterRecords(indexesDir),
  };
}

function runCheck(label, startIndex, errors) {
  console.log(label);
  const nextErrors = errors.slice(startIndex);
  if (nextErrors.length === 0) {
    console.log('  ✓ passed');
    return errors.length;
  }

  for (const error of nextErrors) {
    console.error(`  ✗ ${error}`);
  }

  return errors.length;
}

export function runContentCheck({ posts, examples, indexes } = loadRepositoryContent()) {
  const { errors, checks } = validateContent({ posts, examples, indexes });

  for (const check of checks) {
    runCheck(check.label, 0, check.errors);
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} violation(s) found. Fix before committing.`);
  } else {
    console.log('\nAll checks passed.');
  }

  return { errors };
}

function main() {
  const { errors } = runContentCheck();
  if (errors.length > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
