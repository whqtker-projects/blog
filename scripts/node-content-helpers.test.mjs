import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  listMarkdownFilesRecursive,
  parseSimpleFrontmatter,
  readMarkdownFrontmatterRecords,
} from './node-content-helpers.mjs';

test('parseSimpleFrontmatter parses scalars, integers, and lists', () => {
  const content = `---
title: "Network Protocols"
series: network-protocols
order: 4
tags:
  - graph/child-series
aliases:
  - series:computer-networks/network-protocols
---
Body
`;

  assert.deepEqual(parseSimpleFrontmatter(content), {
    title: 'Network Protocols',
    series: 'network-protocols',
    order: 4,
    tags: ['graph/child-series'],
    aliases: ['series:computer-networks/network-protocols'],
  });
});

test('listMarkdownFilesRecursive finds only markdown files in nested directories', () => {
  const root = mkdtempSync(join(tmpdir(), 'node-content-helpers-files-'));
  mkdirSync(join(root, 'nested', 'child'), { recursive: true });

  writeFileSync(join(root, 'root.md'), '---\ntitle: Root\n---\n');
  writeFileSync(join(root, 'nested', 'child', 'note.md'), '---\ntitle: Note\n---\n');
  writeFileSync(join(root, 'nested', 'child', 'ignore.txt'), 'ignore');

  const files = listMarkdownFilesRecursive(root)
    .map((file) => file.replace(`${root}/`, ''))
    .sort();

  assert.deepEqual(files, ['nested/child/note.md', 'root.md']);
});

test('readMarkdownFrontmatterRecords returns normalized relative file records', () => {
  const root = mkdtempSync(join(tmpdir(), 'node-content-helpers-records-'));
  mkdirSync(join(root, 'computer-networks'), { recursive: true });

  writeFileSync(
    join(root, 'computer-networks', 'network-protocols.md'),
    `---
title: "Network Protocols"
series: network-protocols
parent: computer-networks
order: 4
tags:
  - graph/child-series
---
관련 링크:
- 상위 시리즈: [[series_indexes/computer-networks|Computer Networks]]
`
  );

  const records = readMarkdownFrontmatterRecords(root);

  assert.deepEqual(records, [
    {
      file: 'computer-networks/network-protocols.md',
      title: 'Network Protocols',
      series: 'network-protocols',
      parent: 'computer-networks',
      order: 4,
      tags: ['graph/child-series'],
    },
  ]);
});
