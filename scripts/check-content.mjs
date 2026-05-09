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
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
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

function readMdFilesRecursive(dir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const absolutePath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

      const content = readFileSync(absolutePath, 'utf-8');
      files.push({
        file: relative(dir, absolutePath).split(sep).join('/'),
        ...parseFrontmatter(content),
      });
    }
  }

  walk(dir);
  return files;
}

const postsDir = join(ROOT, 'src/content/posts');
const indexesDir = join(ROOT, 'src/content/series_indexes');

const posts = readMdFilesRecursive(postsDir);
const indexes = readMdFilesRecursive(indexesDir);
const ALLOWED_POST_STATUSES = new Set(['idea', 'draft', 'published']);

let errors = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function splitIndexPath(index) {
  return index.file.replace(/\.md$/, '').split('/');
}

function parseNumericTitlePrefix(title) {
  const match = title.match(/^(\d+)\.\s+/);
  return match ? Number(match[1]) : null;
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

// --- Check 4: physical series index paths match the hierarchy contract ---
console.log('Check 4: series index file paths match the parent-child layout contract');
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
if (errors === errorsAfterCheck3) console.log('  ✓ passed');
const errorsAfterCheck4 = errors;

// --- Check 5: child-series ordering metadata is valid ---
console.log('Check 5: child-series order metadata is valid');
const childOrderKeys = new Map();
for (const idx of indexes) {
  if (!idx.parent) {
    if (idx.order !== undefined) {
      fail(
        `${idx.file}: parent series '${idx.series}' must not declare an 'order' field`
      );
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
if (errors === errorsAfterCheck4) console.log('  ✓ passed');
const errorsAfterCheck5 = errors;

// --- Check 6: no published-order collision within a child series ---
console.log(
  'Check 6: no duplicate order values within a child series (explicitly published posts)'
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
if (errors === errorsAfterCheck5) console.log('  ✓ passed');
const errorsAfterCheck6 = errors;

// --- Check 7: fail on missing status ---
console.log('Check 7: no posts may omit status');
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
const errorsAfterCheck7 = errors;

// --- Check 8: fail on invalid status values ---
console.log('Check 8: status values use the simplified vocabulary');
for (const post of posts) {
  if (post.status !== undefined && !ALLOWED_POST_STATUSES.has(post.status)) {
    fail(
      `${post.file}: invalid status '${post.status}' — allowed values are ${Array.from(ALLOWED_POST_STATUSES).join(', ')}`
    );
  }
}
if (errors === errorsAfterCheck7) console.log('  ✓ passed');
const errorsAfterCheck8 = errors;

// --- Check 9: title prefixes must match post order when present ---
console.log('Check 9: numeric post title prefixes match explicit order when present');
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
if (errors === errorsAfterCheck8) console.log('  ✓ passed');

// --- Result ---
if (errors > 0) {
  console.error(`\n${errors} violation(s) found. Fix before committing.`);
  process.exit(1);
} else {
  console.log('\nAll checks passed.');
}
