import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

function normalizeScalar(value) {
  const trimmed = value.replace(/^["']|["']$/g, '').trim();
  return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
}

export function parseSimpleFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return {};

  const data = {};
  const lines = match[1].split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const scalar = line.match(/^(\w+):\s*(.+)$/);
    if (scalar) {
      data[scalar[1]] = normalizeScalar(scalar[2]);
      continue;
    }

    const list = line.match(/^(\w+):\s*$/);
    if (!list) continue;

    const values = [];
    while (index + 1 < lines.length) {
      const item = lines[index + 1].match(/^\s+-\s*(.+)$/);
      if (!item) break;
      values.push(normalizeScalar(item[1]));
      index += 1;
    }
    data[list[1]] = values;
  }

  return data;
}

export function listMarkdownFilesRecursive(dir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const absolutePath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(absolutePath);
      }
    }
  }

  walk(dir);
  return files;
}

export function readMarkdownFrontmatterRecords(dir) {
  return listMarkdownFilesRecursive(dir).map((absolutePath) => ({
    file: relative(dir, absolutePath).split(sep).join('/'),
    ...parseSimpleFrontmatter(readFileSync(absolutePath, 'utf-8')),
  }));
}
