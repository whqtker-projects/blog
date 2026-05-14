import { dirname, join, relative, sep } from 'node:path';

const IMAGE_WIKILINK_RE = /!\[\[([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g;
const CONTENT_ROOT = join(process.cwd(), 'src/content');
const ATTACHMENTS_DIR = join(CONTENT_ROOT, 'attachments');
const SKIP_NODE_TYPES = new Set([
  'code',
  'definition',
  'image',
  'imageReference',
  'inlineCode',
  'link',
  'linkReference',
]);

function attachmentsPathForFile(file) {
  const filePath = file?.path;
  if (!filePath) {
    return '../attachments';
  }

  const fromDir = dirname(filePath);
  const relativePath = relative(fromDir, ATTACHMENTS_DIR).split(sep).join('/');
  return relativePath || './attachments';
}

function imageNodesFromText(value, attachmentsPath) {
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = IMAGE_WIKILINK_RE.exec(value)) !== null) {
    const [raw, filename, alt] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push({ type: 'text', value: value.slice(lastIndex, start) });
    }

    const imageName = filename.trim();
    const altText = (alt ?? imageName).trim();
    nodes.push({
      type: 'image',
      url: `${attachmentsPath}/${encodeURI(imageName)}`,
      alt: altText,
      title: null,
    });

    lastIndex = start + raw.length;
  }

  if (lastIndex === 0) return null;
  if (lastIndex < value.length) {
    nodes.push({ type: 'text', value: value.slice(lastIndex) });
  }

  return nodes;
}

function transformNode(node, attachmentsPath) {
  if (!node || SKIP_NODE_TYPES.has(node.type) || !Array.isArray(node.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (child?.type === 'text') {
      const replacement = imageNodesFromText(child.value ?? '', attachmentsPath);
      if (!replacement) continue;

      node.children.splice(index, 1, ...replacement);
      index += replacement.length - 1;
      continue;
    }

    transformNode(child, attachmentsPath);
  }
}

function convertObsidianImageWikilinks(tree, file) {
  if (!Array.isArray(tree.children)) return;
  transformNode(tree, attachmentsPathForFile(file));
}

export default function remarkObsidianImageWikilinks() {
  return convertObsidianImageWikilinks;
}
