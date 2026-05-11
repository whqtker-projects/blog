/**
 * Synchronizes Obsidian graph metadata that is derived from canonical series fields.
 *
 * The script manages:
 * - aliases: series:<parent> or series:<parent>/<child>
 * - tags: graph/parent-series or graph/child-series
 * - series index graph links that Obsidian resolves to real files
 * - Obsidian graph color groups for parent series, child series, and posts
 *
 * Run via: pnpm sync:series-graph
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SERIES_INDEXES_DIR = join(ROOT, 'src/content/series_indexes');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const OBSIDIAN_GRAPH_FILE = join(ROOT, 'src/content/.obsidian/graph.json');
const GRAPH_COLOR_GROUPS = [
  {
    query: 'tag:#graph/parent-series',
    color: {
      a: 1,
      rgb: 1920728,
    },
  },
  {
    query: 'tag:#graph/child-series',
    color: {
      a: 1,
      rgb: 16096779,
    },
  },
  {
    query: 'tag:#graph/post',
    color: {
      a: 1,
      rgb: 7041664,
    },
  },
];

function readMdFilesRecursive(dir) {
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

function parseFrontmatter(content) {
  const match = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n?)([\s\S]*)$/);
  if (!match) {
    throw new Error('missing frontmatter');
  }

  const data = {};
  const lines = match[2].split(/\r?\n/);
  for (const line of lines) {
    const scalar = line.match(/^(\w+):\s*(.+)$/);
    if (!scalar) continue;
    const value = scalar[2].replace(/^["']|["']$/g, '').trim();
    data[scalar[1]] = /^\d+$/.test(value) ? Number(value) : value;
  }

  return {
    open: match[1],
    frontmatter: match[2],
    close: match[3],
    body: match[4],
    data,
  };
}

function expectedAlias(data) {
  return data.parent ? `series:${data.parent}/${data.series}` : `series:${data.series}`;
}

function expectedGraphTag(data) {
  return data.parent ? 'graph/child-series' : 'graph/parent-series';
}

function seriesIndexLink(index, title = index.data.title) {
  const target = index.data.parent
    ? `series_indexes/${index.data.parent}/${index.data.series}`
    : `series_indexes/${index.data.series}`;
  return `[[${target}|${title}]]`;
}

function postLink(post) {
  return `[[${post.slug}|${post.data.title}]]`;
}

function replaceYamlList(frontmatter, key, values) {
  const lines = frontmatter.split(/\r?\n/);
  const output = [];
  let replaced = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line !== `${key}:`) {
      output.push(line);
      continue;
    }

    replaced = true;
    output.push(`${key}:`);
    for (const value of values) {
      output.push(`  - ${value}`);
    }

    while (i + 1 < lines.length && /^  - /.test(lines[i + 1])) {
      i += 1;
    }
  }

  if (!replaced) {
    output.push(`${key}:`);
    for (const value of values) {
      output.push(`  - ${value}`);
    }
  }

  return output.join('\n');
}

export function syncSeriesGraphMetadata(content, body = null) {
  const parsed = parseFrontmatter(content);
  if (!parsed.data.series) {
    throw new Error('missing series field');
  }

  const alias = expectedAlias(parsed.data);
  const graphTag = expectedGraphTag(parsed.data);
  let frontmatter = replaceYamlList(parsed.frontmatter, 'aliases', [alias]);
  frontmatter = replaceYamlList(frontmatter, 'tags', [graphTag]);

  return `${parsed.open}${frontmatter}${parsed.close}${body ?? parsed.body}`;
}

function buildSeriesIndexBody(index, children, parent, posts) {
  if (!index.data.parent) {
    const lines = ['관련 시리즈:'];
    children.forEach((child, childIndex) => {
      lines.push(`${childIndex + 1}. ${seriesIndexLink(child)}`);
    });
    return `${lines.join('\n')}\n`;
  }

  const lines = [
    '관련 링크:',
    `- 상위 시리즈: ${seriesIndexLink(parent)}`,
    '',
    '게시글 순서:',
  ];
  posts.forEach((post, postIndex) => {
    lines.push(`${postIndex + 1}. ${postLink(post)}`);
  });
  return `${lines.join('\n')}\n`;
}

function buildPostBody(post, child, parent, seriesPosts) {
  if (post.data.status !== 'draft') return post.body;

  const index = seriesPosts.findIndex((candidate) => candidate.slug === post.slug);
  const prev = index > 0 ? seriesPosts[index - 1] : null;
  const next = index >= 0 && index < seriesPosts.length - 1 ? seriesPosts[index + 1] : null;
  let body = post.body.replace(/^\s+/, '');
  while (body.startsWith('관련 링크:')) {
    body = body.replace(/^관련 링크:\r?\n(?:- [^\r\n]*(?:\r?\n|$))+\r?\n*/, '').replace(/^\s+/, '');
  }
  const lines = [
    '관련 링크:',
    `- 소속 시리즈: ${seriesIndexLink(child)}`,
  ];
  if (prev) lines.push(`- 이전 글: ${postLink(prev)}`);
  if (next) lines.push(`- 다음 글: ${postLink(next)}`);

  return `${lines.join('\n')}\n\n${body.replace(/^\s+/, '')}`;
}

function syncGraphSettings() {
  const original = readFileSync(OBSIDIAN_GRAPH_FILE, 'utf8');
  const graph = JSON.parse(original);
  graph.colorGroups = GRAPH_COLOR_GROUPS;
  const next = `${JSON.stringify(graph, null, 2)}\n`;
  if (next === original) return false;

  writeFileSync(OBSIDIAN_GRAPH_FILE, next);
  return true;
}

function main() {
  let changed = 0;
  const indexFiles = readMdFilesRecursive(SERIES_INDEXES_DIR);
  const postFiles = readMdFilesRecursive(POSTS_DIR);
  const indexes = indexFiles.map((file) => ({
    file,
    ...parseFrontmatter(readFileSync(file, 'utf8')),
  }));
  const posts = postFiles.map((file) => ({
    file,
    slug: relative(POSTS_DIR, file).replace(/\.md$/, '').split(sep).join('/'),
    ...parseFrontmatter(readFileSync(file, 'utf8')),
  }));
  const parents = indexes
    .filter((index) => !index.data.parent)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
  const children = indexes
    .filter((index) => index.data.parent)
    .sort((a, b) => a.data.parent.localeCompare(b.data.parent) || a.data.order - b.data.order);
  const indexBySeries = new Map(indexes.map((index) => [index.data.series, index]));
  const childrenByParent = new Map();
  const postsBySeries = new Map();

  for (const child of children) {
    const list = childrenByParent.get(child.data.parent) ?? [];
    list.push(child);
    childrenByParent.set(child.data.parent, list);
  }

  for (const post of posts) {
    const list = postsBySeries.get(post.data.series) ?? [];
    list.push(post);
    postsBySeries.set(post.data.series, list);
  }

  for (const list of childrenByParent.values()) {
    list.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
  }

  for (const list of postsBySeries.values()) {
    list.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
  }

  for (const index of [...parents, ...children]) {
    const original = readFileSync(index.file, 'utf8');
    const parent = index.data.parent ? indexBySeries.get(index.data.parent) : null;
    const body = buildSeriesIndexBody(
      index,
      childrenByParent.get(index.data.series) ?? [],
      parent,
      postsBySeries.get(index.data.series) ?? []
    );
    const next = syncSeriesGraphMetadata(original, body);
    if (next === original) continue;

    writeFileSync(index.file, next);
    changed += 1;
    console.log(`updated ${relative(ROOT, index.file).split(sep).join('/')}`);
  }

  for (const post of posts) {
    if (post.data.status !== 'draft') continue;

    const child = indexBySeries.get(post.data.series);
    if (!child) continue;
    const parent = indexBySeries.get(child.data.parent);
    const body = buildPostBody(post, child, parent, postsBySeries.get(post.data.series) ?? []);
    const next = `${post.open}${post.frontmatter}${post.close}${body}`;
    const original = readFileSync(post.file, 'utf8');
    if (next === original) continue;

    writeFileSync(post.file, next);
    changed += 1;
    console.log(`updated ${relative(ROOT, post.file).split(sep).join('/')}`);
  }

  if (syncGraphSettings()) {
    changed += 1;
    console.log(`updated ${relative(ROOT, OBSIDIAN_GRAPH_FILE).split(sep).join('/')}`);
  }

  console.log(`Series graph metadata synchronized (${changed} file(s) updated).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
