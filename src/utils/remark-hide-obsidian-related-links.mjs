const RELATED_LINKS_HEADING = '관련 링크:';
const RELATED_LINK_LABELS = [
  '상위 시리즈:',
  '소속 시리즈:',
  '이전 글:',
  '다음 글:',
];

function nodeText(node) {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
  if (!Array.isArray(node.children)) return '';
  return node.children.map(nodeText).join('');
}

function isRelatedLinksHeading(node) {
  return node?.type === 'paragraph' && nodeText(node).trim() === RELATED_LINKS_HEADING;
}

function isRelatedLinkLine(line) {
  const trimmed = line.trim();
  return RELATED_LINK_LABELS.some((label) => trimmed.startsWith(label));
}

function isRelatedLinksParagraph(node) {
  if (node?.type !== 'paragraph') return false;

  const lines = nodeText(node).split(/\r?\n/).filter((line) => line.trim() !== '');
  return lines.length > 0 && lines.every(isRelatedLinkLine);
}

function isRelatedLinksList(node) {
  if (node?.type !== 'list') return false;

  return node.children.every((item) => {
    const text = nodeText(item);
    return text.split(/\r?\n/).filter((line) => line.trim() !== '').every(isRelatedLinkLine);
  });
}

function hideObsidianRelatedLinks(tree) {
  if (!Array.isArray(tree.children)) return;

  for (let index = 0; index < tree.children.length; index += 1) {
    if (!isRelatedLinksHeading(tree.children[index])) continue;

    const nextNode = tree.children[index + 1];
    if (!isRelatedLinksList(nextNode) && !isRelatedLinksParagraph(nextNode)) {
      continue;
    }

    tree.children.splice(index, 2);
    index -= 1;
  }
}

export default function remarkHideObsidianRelatedLinks() {
  return hideObsidianRelatedLinks;
}
