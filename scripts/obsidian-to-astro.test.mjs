import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  validateFileName,
  fileNameToSlug,
  convertWikilinks,
  convertImageWikilinks,
  extractImageFilenames,
  parseFrontmatter,
  convertFile,
  convertConceptLinks,
  buildConceptAliasMap,
  convertSeriesLinks,
  buildSeriesTargetSet,
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
  assert.equal(result, 'See ![diagram.png](../attachments/diagram.png) below.');
});

test('convertImageWikilinks: ![[image.png|alt text]]', () => {
  const result = convertImageWikilinks('![[btree-structure.png|B+Tree structure]]');
  assert.equal(result, '![B+Tree structure](../attachments/btree-structure.png)');
});

test('convertImageWikilinks: encodes pasted image filenames with spaces', () => {
  const result = convertImageWikilinks('![[Pasted image 20260511171546.png|IoC 컨테이너]]');
  assert.equal(
    result,
    '![IoC 컨테이너](../attachments/Pasted%20image%2020260511171546.png)'
  );
});

test('convertImageWikilinks: multiple images', () => {
  const result = convertImageWikilinks('![[a.png]] and ![[b.png|B image]]');
  assert.equal(result, '![a.png](../attachments/a.png) and ![B image](../attachments/b.png)');
});

test('convertImageWikilinks: does not affect regular wikilinks', () => {
  const result = convertImageWikilinks('See [[database-index]] and ![[diagram.png]].');
  assert.equal(result, 'See [[database-index]] and ![diagram.png](../attachments/diagram.png).');
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
  assert.ok(content.includes('![B+Tree](../attachments/btree.png)'));
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
  assert.ok(content.includes('![diagram.png](../attachments/diagram.png)'));
  assert.ok(content.includes('[database-index](/posts/database-index)'));
});

// ── extractImageFilenames ────────────────────────────────────────────────────

test('extractImageFilenames: returns filename from ![[image.png]]', () => {
  assert.deepEqual(extractImageFilenames('See ![[diagram.png]] below.'), ['diagram.png']);
});

test('extractImageFilenames: returns filename from ![[image.png|alt]]', () => {
  assert.deepEqual(extractImageFilenames('![[btree.svg|B+Tree]]'), ['btree.svg']);
});

test('extractImageFilenames: returns multiple filenames', () => {
  const result = extractImageFilenames('![[a.png]] and ![[b.svg]]');
  assert.deepEqual(result, ['a.png', 'b.svg']);
});

test('extractImageFilenames: deduplicates repeated references', () => {
  const result = extractImageFilenames('![[a.png]] then ![[a.png]] again');
  assert.deepEqual(result, ['a.png']);
});

test('extractImageFilenames: returns empty array when no image wikilinks', () => {
  assert.deepEqual(extractImageFilenames('Plain text with [[link]] only.'), []);
});

test('extractImageFilenames: does not capture regular wikilinks', () => {
  assert.deepEqual(extractImageFilenames('See [[database-index]] here.'), []);
});

// ── image validation in convertFile ─────────────────────────────────────────

test('convertFile: no publicImagesDir → empty imageWarnings', () => {
  const input = `---
title: Test
series: database-internals
order: 1
---

![[missing.png]]`;

  const { imageWarnings } = convertFile(input, 'test.md');
  assert.deepEqual(imageWarnings, []);
});

test('convertFile: present image produces no imageWarning', () => {
  const imagesDir = mkdtempSync(join(tmpdir(), 'test-images-'));
  try {
    writeFileSync(join(imagesDir, 'present.png'), '');
    const input = `---
title: Test
series: database-internals
order: 1
---

![[present.png]]`;

    const { imageWarnings } = convertFile(input, 'test.md', null, imagesDir);
    assert.deepEqual(imageWarnings, []);
  } finally {
    rmSync(imagesDir, { recursive: true });
  }
});

test('convertFile: attachments image produces no imageWarning', () => {
  const imagesDir = mkdtempSync(join(tmpdir(), 'test-images-'));
  try {
    writeFileSync(join(imagesDir, 'present.png'), '');
    const input = `---
title: Test
series: database-internals
order: 1
---

![[present.png]]`;
    const { imageWarnings } = convertFile(input, 'test.md', null, imagesDir);
    assert.deepEqual(imageWarnings, []);
  } finally {
    rmSync(imagesDir, { recursive: true });
  }
});

test('convertFile: missing image produces imageWarning with filename', () => {
  const imagesDir = mkdtempSync(join(tmpdir(), 'test-images-'));
  try {
    const input = `---
title: Test
series: database-internals
order: 1
---

![[missing.png]]`;

    const { imageWarnings } = convertFile(input, 'test.md', null, imagesDir);
    assert.deepEqual(imageWarnings, ['missing.png']);
  } finally {
    rmSync(imagesDir, { recursive: true });
  }
});

test('convertFile: mixed present and missing images reports only missing', () => {
  const imagesDir = mkdtempSync(join(tmpdir(), 'test-images-'));
  try {
    writeFileSync(join(imagesDir, 'present.png'), '');
    const input = `---
title: Test
series: database-internals
order: 1
---

![[present.png]] and ![[missing.svg]]`;

    const { imageWarnings } = convertFile(input, 'test.md', null, imagesDir);
    assert.deepEqual(imageWarnings, ['missing.svg']);
  } finally {
    rmSync(imagesDir, { recursive: true });
  }
});

test('convertFile: duplicate image reference warns once', () => {
  const imagesDir = mkdtempSync(join(tmpdir(), 'test-images-'));
  try {
    const input = `---
title: Test
series: database-internals
order: 1
---

![[missing.png]] and again ![[missing.png]]`;

    const { imageWarnings } = convertFile(input, 'test.md', null, imagesDir);
    assert.deepEqual(imageWarnings, ['missing.png']);
  } finally {
    rmSync(imagesDir, { recursive: true });
  }
});

// ── convertConceptLinks ──────────────────────────────────────────────────────

test('convertConceptLinks: [[concept:tcp]]', () => {
  const { result } = convertConceptLinks('See [[concept:tcp]] for details.');
  assert.equal(result, 'See [tcp](/concepts/tcp) for details.');
});

test('convertConceptLinks: [[concept:tcp|TCP]]', () => {
  const { result } = convertConceptLinks('Read [[concept:tcp|TCP]] here.');
  assert.equal(result, 'Read [TCP](/concepts/tcp) here.');
});

test('convertConceptLinks: alias resolves to canonical slug', () => {
  const aliasMap = new Map([['tcp', 'tcp'], ['transmission-control-protocol', 'tcp']]);
  const { result } = convertConceptLinks('See [[concept:transmission-control-protocol]].', aliasMap);
  assert.equal(result, 'See [transmission-control-protocol](/concepts/tcp).');
});

test('convertConceptLinks: uppercase alias resolves via lowercased lookup', () => {
  const aliasMap = new Map([['tcp', 'tcp'], ['tcp', 'tcp']]);
  const { result } = convertConceptLinks('See [[concept:TCP]].', aliasMap);
  assert.equal(result, 'See [TCP](/concepts/tcp).');
});

test('convertConceptLinks: warns on unresolved concept when knownConceptSlugs provided', () => {
  const known = new Set(['tcp']);
  const { warnings } = convertConceptLinks('See [[concept:unknown]].', null, known);
  assert.deepEqual(warnings, ['unknown']);
});

test('convertConceptLinks: no warning for resolved concept', () => {
  const known = new Set(['tcp']);
  const { warnings } = convertConceptLinks('See [[concept:tcp]].', null, known);
  assert.deepEqual(warnings, []);
});

test('convertConceptLinks: no resolution check when knownConceptSlugs is null', () => {
  const { warnings } = convertConceptLinks('See [[concept:anything]].', null, null);
  assert.deepEqual(warnings, []);
});

test('convertConceptLinks: does not affect normal wikilinks', () => {
  const input = 'See [[database-index]] and [[concept:tcp]].';
  const { result } = convertConceptLinks(input);
  assert.ok(result.includes('[[database-index]]'));
  assert.ok(result.includes('[tcp](/concepts/tcp)'));
});

test('convertConceptLinks: no concept links passes content through unchanged', () => {
  const input = 'Plain text with [[link]] only.';
  const { result, warnings } = convertConceptLinks(input);
  assert.equal(result, input);
  assert.deepEqual(warnings, []);
});

// ── convertSeriesLinks ───────────────────────────────────────────────────────

test('convertSeriesLinks: [[series:parent]]', () => {
  const { result } = convertSeriesLinks('See [[series:operating-systems]].');
  assert.equal(result, 'See [operating-systems](/series/operating-systems).');
});

test('convertSeriesLinks: [[series:parent|alias]]', () => {
  const { result } = convertSeriesLinks('See [[series:operating-systems|운영체제]].');
  assert.equal(result, 'See [운영체제](/series/operating-systems).');
});

test('convertSeriesLinks: [[series:parent/child|alias]]', () => {
  const { result } = convertSeriesLinks(
    'See [[series:operating-systems/processes-and-threads|프로세스와 스레드]].'
  );
  assert.equal(
    result,
    'See [프로세스와 스레드](/series/operating-systems/processes-and-threads).'
  );
});

test('convertSeriesLinks: warns on unresolved series target when knownSeriesTargets provided', () => {
  const known = new Set(['operating-systems', 'operating-systems/processes-and-threads']);
  const { warnings } = convertSeriesLinks('See [[series:operating-systems/missing-child]].', known);
  assert.deepEqual(warnings, ['operating-systems/missing-child']);
});

test('convertSeriesLinks: no warning for resolved series target', () => {
  const known = new Set(['operating-systems', 'operating-systems/processes-and-threads']);
  const { warnings } = convertSeriesLinks(
    'See [[series:operating-systems/processes-and-threads]].', known
  );
  assert.deepEqual(warnings, []);
});

test('convertSeriesLinks: does not affect normal wikilinks', () => {
  const input = 'See [[database-index]] and [[series:operating-systems]].';
  const { result } = convertSeriesLinks(input);
  assert.ok(result.includes('[[database-index]]'));
  assert.ok(result.includes('[operating-systems](/series/operating-systems)'));
});

// ── buildConceptAliasMap ─────────────────────────────────────────────────────

test('buildConceptAliasMap: returns empty map for nonexistent dir', () => {
  const map = buildConceptAliasMap('/nonexistent/path/xyz');
  assert.equal(map.size, 0);
});

test('buildConceptAliasMap: slug maps to itself', () => {
  const dir = mkdtempSync(join(tmpdir(), 'test-concepts-'));
  try {
    writeFileSync(join(dir, 'tcp.md'), '---\ntitle: TCP\n---\n');
    const map = buildConceptAliasMap(dir);
    assert.equal(map.get('tcp'), 'tcp');
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('buildConceptAliasMap: aliases map to canonical slug', () => {
  const dir = mkdtempSync(join(tmpdir(), 'test-concepts-'));
  try {
    writeFileSync(join(dir, 'tcp.md'), '---\ntitle: TCP\naliases: [TCP, tcp]\n---\n');
    const map = buildConceptAliasMap(dir);
    assert.equal(map.get('tcp'), 'tcp');
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('buildConceptAliasMap: alias lookup is case-insensitive', () => {
  const dir = mkdtempSync(join(tmpdir(), 'test-concepts-'));
  try {
    writeFileSync(join(dir, 'tcp.md'), '---\ntitle: TCP\naliases: [TCP]\n---\n');
    const map = buildConceptAliasMap(dir);
    assert.equal(map.get('tcp'), 'tcp');
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('buildSeriesTargetSet: collects parent and child targets from series indexes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'test-series-indexes-'));
  try {
    writeFileSync(join(dir, 'operating-systems.md'), '---\ntitle: 운영체제\nseries: operating-systems\n---\n');
    writeFileSync(join(dir, 'ignore.txt'), 'not markdown');
    const childDir = join(dir, 'operating-systems');
    mkdirSync(childDir);
    writeFileSync(join(childDir, 'processes-and-threads.md'), '---\ntitle: 프로세스와 스레드\nseries: processes-and-threads\nparent: operating-systems\norder: 2\n---\n');
    const targets = buildSeriesTargetSet(dir);
    assert.ok(targets.has('operating-systems'));
    assert.ok(targets.has('operating-systems/processes-and-threads'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ── concept links in convertFile ─────────────────────────────────────────────

test('convertFile: concept links in body are converted', () => {
  const input = `---
title: Test
series: network-protocols
order: 1
---

See [[concept:tcp]] for details.`;

  const { content } = convertFile(input, 'test.md');
  assert.ok(content.includes('[tcp](/concepts/tcp)'));
  assert.ok(!content.includes('[[concept:tcp]]'));
});

test('convertFile: concept links convert before post wikilinks', () => {
  const input = `---
title: Test
series: network-protocols
order: 1
---

[[concept:tcp]] and [[what-is-http]].`;

  const { content } = convertFile(input, 'test.md');
  assert.ok(content.includes('[tcp](/concepts/tcp)'));
  assert.ok(content.includes('[what-is-http](/posts/what-is-http)'));
});

test('convertFile: series links convert before post wikilinks', () => {
  const input = `---
title: Test
series: network-protocols
order: 1
---

[[series:computer-networks/network-protocols|네트워크 프로토콜]] and [[what-is-http]].`;

  const knownPosts = new Set(['what-is-http']);
  const knownSeries = new Set(['computer-networks/network-protocols']);
  const { content, seriesWarnings, warnings } = convertFile(
    input,
    'test.md',
    knownPosts,
    null,
    null,
    null,
    knownSeries,
  );

  assert.ok(content.includes('[네트워크 프로토콜](/series/computer-networks/network-protocols)'));
  assert.ok(content.includes('[what-is-http](/posts/what-is-http)'));
  assert.deepEqual(seriesWarnings, []);
  assert.deepEqual(warnings, []);
});

test('convertFile: returns seriesWarnings for unresolved series links', () => {
  const input = `---
title: Test
series: network-protocols
order: 1
---

See [[series:computer-networks/missing-child]].`;

  const knownSeries = new Set(['computer-networks', 'computer-networks/network-protocols']);
  const { seriesWarnings } = convertFile(
    input,
    'test.md',
    null,
    null,
    null,
    null,
    knownSeries,
  );
  assert.deepEqual(seriesWarnings, ['computer-networks/missing-child']);
});

test('convertFile: returns conceptWarnings for unresolved concept links', () => {
  const input = `---
title: Test
series: network-protocols
order: 1
---

See [[concept:unknown-concept]].`;

  const known = new Set(['tcp']);
  const { conceptWarnings } = convertFile(input, 'test.md', null, null, null, known);
  assert.deepEqual(conceptWarnings, ['unknown-concept']);
});
