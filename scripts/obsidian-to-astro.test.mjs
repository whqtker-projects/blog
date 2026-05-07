import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateFileName,
  fileNameToSlug,
  convertWikilinks,
  convertImageWikilinks,
  parseFrontmatter,
  convertFile,
} from './obsidian-to-astro.mjs';

// ── validateFileName ─────────────────────────────────────────────────────────

test('validateFileName: accepts valid kebab-case names', () => {
  assert.ok(validateFileName('database-index.md'));
  assert.ok(validateFileName('what-is-a-b-tree.md'));
  assert.ok(validateFileName('lsm.md'));
  assert.ok(validateFileName('b2-tree.md'));
});

test('validateFileName: rejects uppercase', () => {
  assert.ok(!validateFileName('Database-Index.md'));
  assert.ok(!validateFileName('databaseIndex.md'));
});

test('validateFileName: rejects Korean characters', () => {
  assert.ok(!validateFileName('데이터베이스.md'));
});

test('validateFileName: rejects underscores', () => {
  assert.ok(!validateFileName('database_index.md'));
});

test('validateFileName: rejects leading or trailing hyphens', () => {
  assert.ok(!validateFileName('-database.md'));
  assert.ok(!validateFileName('database-.md'));
});

// ── fileNameToSlug ───────────────────────────────────────────────────────────

test('fileNameToSlug: strips .md extension', () => {
  assert.equal(fileNameToSlug('database-index.md'), 'database-index');
  assert.equal(fileNameToSlug('what-is-a-b-tree.md'), 'what-is-a-b-tree');
});

// ── convertWikilinks ─────────────────────────────────────────────────────────

test('convertWikilinks: [[page]]', () => {
  const { result } = convertWikilinks('See [[database-index]] for details.');
  assert.equal(result, 'See [database-index](/posts/database-index) for details.');
});

test('convertWikilinks: [[page|alias]]', () => {
  const { result } = convertWikilinks('Read [[database-index|the index post]].');
  assert.equal(result, 'Read [the index post](/posts/database-index).');
});

test('convertWikilinks: [[page#heading]]', () => {
  const { result } = convertWikilinks('See [[database-index#How It Works]].');
  assert.equal(result, 'See [database-index](/posts/database-index#how-it-works).');
});

test('convertWikilinks: [[page#heading|alias]]', () => {
  const { result } = convertWikilinks('See [[database-index#How It Works|internals]].');
  assert.equal(result, 'See [internals](/posts/database-index#how-it-works).');
});

test('convertWikilinks: display-name style page ref', () => {
  // Obsidian may use display names; script normalises to slug form
  const { result } = convertWikilinks('See [[Database Index]].');
  assert.equal(result, 'See [Database Index](/posts/database-index).');
});

test('convertWikilinks: multiple wikilinks in one file', () => {
  const { result } = convertWikilinks('A [[b-tree]] and a [[hash-index|hash index]].');
  assert.equal(result, 'A [b-tree](/posts/b-tree) and a [hash index](/posts/hash-index).');
});

test('convertWikilinks: no wikilinks passes content through unchanged', () => {
  const input = 'Plain Markdown with [standard](https://example.com) links.';
  const { result, warnings } = convertWikilinks(input);
  assert.equal(result, input);
  assert.deepEqual(warnings, []);
});

// ── unresolved link behaviour ────────────────────────────────────────────────

test('convertWikilinks: warns on unresolved link when knownSlugs provided', () => {
  const known = new Set(['database-index']);
  const { warnings } = convertWikilinks('See [[unknown-post]].', known);
  assert.deepEqual(warnings, ['unknown-post']);
});

test('convertWikilinks: no warning for resolved link', () => {
  const known = new Set(['database-index']);
  const { warnings } = convertWikilinks('See [[database-index]].', known);
  assert.deepEqual(warnings, []);
});

test('convertWikilinks: no resolution check when knownSlugs is null', () => {
  const { warnings } = convertWikilinks('See [[anything]].', null);
  assert.deepEqual(warnings, []);
});

// ── parseFrontmatter ─────────────────────────────────────────────────────────

test('parseFrontmatter: splits frontmatter and body', () => {
  const input = '---\ntitle: Test\n---\nBody here.';
  const { frontmatter, body } = parseFrontmatter(input);
  assert.equal(frontmatter, 'title: Test');
  assert.equal(body, 'Body here.');
});

test('parseFrontmatter: returns null frontmatter when no fence', () => {
  const { frontmatter, body } = parseFrontmatter('No fence here.');
  assert.equal(frontmatter, null);
  assert.equal(body, 'No fence here.');
});

// ── convertFile ──────────────────────────────────────────────────────────────

test('convertFile: frontmatter passes through unchanged', () => {
  const input = `---
title: "What Is a Database Index?"
series: database-internals
order: 1
status: published
---

Body with [[b-tree]] link.`;

  const { content } = convertFile(input, 'test.md');
  assert.ok(content.includes('title: "What Is a Database Index?"'));
  assert.ok(content.includes('series: database-internals'));
  assert.ok(content.includes('order: 1'));
  assert.ok(content.includes('status: published'));
});

test('convertFile: wikilinks in body are converted', () => {
  const input = `---
title: Test
series: database-internals
order: 1
---

See [[b-tree]] for details.`;

  const { content } = convertFile(input, 'test.md');
  assert.ok(content.includes('[b-tree](/posts/b-tree)'));
  assert.ok(!content.includes('[[b-tree]]'));
});

test('convertFile: throws on missing frontmatter', () => {
  assert.throws(
    () => convertFile('No frontmatter here.', 'test.md'),
    /missing frontmatter/
  );
});

test('convertFile: returns warnings for unresolved wikilinks', () => {
  const input = `---
title: Test
series: database-internals
order: 1
---

See [[nonexistent-post]].`;

  const known = new Set(['database-index']);
  const { warnings } = convertFile(input, 'test.md', known);
  assert.deepEqual(warnings, ['nonexistent-post']);
});

// ── convertImageWikilinks ────────────────────────────────────────────────────

test('convertImageWikilinks: ![[image.png]]', () => {
  const result = convertImageWikilinks('See ![[diagram.png]] below.');
  assert.equal(result, 'See ![diagram.png](/images/diagram.png) below.');
});

test('convertImageWikilinks: ![[image.png|alt text]]', () => {
  const result = convertImageWikilinks('![[btree-structure.png|B+Tree structure]]');
  assert.equal(result, '![B+Tree structure](/images/btree-structure.png)');
});

test('convertImageWikilinks: multiple images', () => {
  const result = convertImageWikilinks('![[a.png]] and ![[b.png|B image]]');
  assert.equal(result, '![a.png](/images/a.png) and ![B image](/images/b.png)');
});

test('convertImageWikilinks: does not affect regular wikilinks', () => {
  const result = convertImageWikilinks('See [[database-index]] and ![[diagram.png]].');
  assert.equal(result, 'See [[database-index]] and ![diagram.png](/images/diagram.png).');
});

test('convertImageWikilinks: no image wikilinks passes content through unchanged', () => {
  const input = 'Plain text with [[link]] only.';
  assert.equal(convertImageWikilinks(input), input);
});

test('convertFile: image wikilinks in body are converted', () => {
  const input = `---
title: Test
series: database-internals
order: 1
---

See ![[btree.png|B+Tree]] for the structure.`;

  const { content } = convertFile(input, 'test.md');
  assert.ok(content.includes('![B+Tree](/images/btree.png)'));
  assert.ok(!content.includes('![[btree.png'));
});

test('convertFile: image conversion runs before link conversion', () => {
  // Ensures ![[...]] is not accidentally matched by the link wikilink regex
  const input = `---
title: Test
series: database-internals
order: 1
---

![[diagram.png]] and [[database-index]].`;

  const { content } = convertFile(input, 'test.md');
  assert.ok(content.includes('![diagram.png](/images/diagram.png)'));
  assert.ok(content.includes('[database-index](/posts/database-index)'));
});
