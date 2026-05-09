/**
 * check-content.mjs — validates content-structure invariants.
 * Run via: pnpm check:content
 *
 * Checks:
 *   1. No two series_indexes documents share the same series value
 *   2. Parent-child hierarchy is structurally valid
 *   3. Every series value in posts/ has a matching child series index
 *   4. No post attaches directly to a parent series
 *   5. No two explicitly published posts in the same child series share the same order value
 *   6. Fail when a post omits status, because committed posts must set status explicitly
 *   7. Fail when a post uses a status outside the simplified vocabulary
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.+)/);
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  if (fm.order !== undefined) fm.order = Number(fm.order);
  return fm;
}

function readMdFiles(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const content = readFileSync(join(dir, file), 'utf-8');
      return { file, ...parseFrontmatter(content) };
    });
}

const postsDir = join(ROOT, 'src/content/posts');
const indexesDir = join(ROOT, 'src/content/series_indexes');

const posts = readMdFiles(postsDir);
const indexes = readMdFiles(indexesDir);
const ALLOWED_POST_STATUSES = new Set(['idea', 'draft', 'published']);

let errors = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

// --- Check 1: no duplicate series values in series_indexes ---
console.log('Check 1: no duplicate series_indexes for the same series');
const indexesBySeries = new Map();
for (const idx of indexes) {
  if (!idx.series) {
    fail(`${idx.file}: missing required 'series' field`);
    continue;
  }
  if (indexesBySeries.has(idx.series)) {
    fail(
      `series '${idx.series}' is declared in both '${indexesBySeries.get(idx.series).file}' and '${idx.file}'`
    );
  } else {
    indexesBySeries.set(idx.series, idx);
  }
}
if (!errors) console.log('  ✓ passed');
const errorsAfterCheck1 = errors;

// --- Check 2: parent-child hierarchy is structurally valid ---
console.log('Check 2: parent-child series hierarchy is structurally valid');
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
if (errors === errorsAfterCheck1) console.log('  ✓ passed');
const errorsAfterCheck2 = errors;

// --- Check 3: every post series has a matching child series index ---
console.log('Check 3: every post series has a matching child series index');
const postSeriesValues = new Set(posts.map((p) => p.series).filter(Boolean));
for (const s of postSeriesValues) {
  const index = indexesBySeries.get(s);
  if (!index) {
    fail(
      `series '${s}' has posts but no series index document in src/content/series_indexes/`
    );
    continue;
  }

  if (!index.parent) {
    fail(
      `series '${s}' is a parent series; posts must attach to a child series instead`
    );
  }
}
if (errors === errorsAfterCheck2) console.log('  ✓ passed');
const errorsAfterCheck3 = errors;

// --- Check 4: no published-order collision within a child series ---
console.log(
  'Check 4: no duplicate order values within a child series (explicitly published posts)'
);
const publishedPosts = posts.filter((p) => p.status === 'published');
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
if (errors === errorsAfterCheck3) console.log('  ✓ passed');
const errorsAfterCheck4 = errors;

// --- Check 5: fail on missing status ---
console.log('Check 5: no posts may omit status');
const statuslessPosts = posts.filter((post) => post.status === undefined);
if (statuslessPosts.length === 0) {
  console.log('  ✓ passed');
} else {
  for (const post of statuslessPosts) {
    fail(
      `${post.file}: missing required 'status' field — committed posts must set one of ${Array.from(ALLOWED_POST_STATUSES).join(', ')}`
    );
  }
}
const errorsAfterCheck5 = errors;

// --- Check 6: fail on invalid status values ---
console.log('Check 6: status values use the simplified vocabulary');
for (const post of posts) {
  if (post.status !== undefined && !ALLOWED_POST_STATUSES.has(post.status)) {
    fail(
      `${post.file}: invalid status '${post.status}' — allowed values are ${Array.from(ALLOWED_POST_STATUSES).join(', ')}`
    );
  }
}
if (errors === errorsAfterCheck5) console.log('  ✓ passed');

// --- Result ---
if (errors > 0) {
  console.error(`\n${errors} violation(s) found. Fix before committing.`);
  process.exit(1);
} else {
  console.log('\nAll checks passed.');
}
