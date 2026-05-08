/**
 * check-content.mjs — validates content-structure invariants.
 * Run via: pnpm check:content
 *
 * Checks:
 *   1. No two series_indexes documents share the same series value
 *   2. Every series value in posts/ has a matching series_indexes document
 *   3. No two explicitly published posts in the same series share the same order value
 *   4. Warn when a post omits status, because omitted status is excluded from production
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

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ! ${msg}`);
  warnings++;
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
      `series '${idx.series}' is declared in both '${indexesBySeries.get(idx.series)}' and '${idx.file}'`
    );
  } else {
    indexesBySeries.set(idx.series, idx.file);
  }
}
if (!errors) console.log('  ✓ passed');
const errorsAfterCheck1 = errors;

// --- Check 2: every post series has a matching series index ---
console.log('Check 2: every post series has a matching series index');
const postSeriesValues = new Set(posts.map((p) => p.series).filter(Boolean));
for (const s of postSeriesValues) {
  if (!indexesBySeries.has(s)) {
    fail(
      `series '${s}' has posts but no series index document in src/content/series_indexes/`
    );
  }
}
if (errors === errorsAfterCheck1) console.log('  ✓ passed');
const errorsAfterCheck2 = errors;

// --- Check 3: no duplicate order within a series (published posts only) ---
console.log('Check 3: no duplicate order values within a series (explicitly published posts)');
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
if (errors === errorsAfterCheck2) console.log('  ✓ passed');

// --- Check 4: warn on missing status ---
console.log('Check 4: warn on posts with missing status');
const statuslessPosts = posts.filter((post) => post.status === undefined);
if (statuslessPosts.length === 0) {
  console.log('  ✓ passed');
} else {
  for (const post of statuslessPosts) {
    warn(
      `${post.file}: missing 'status' field — omitted status is excluded from production output`
    );
  }
}

// --- Result ---
if (errors > 0) {
  console.error(`\n${errors} violation(s) found. Fix before committing.`);
  process.exit(1);
} else {
  console.log(
    warnings > 0
      ? `\nAll checks passed with ${warnings} warning(s).`
      : '\nAll checks passed.'
  );
}
