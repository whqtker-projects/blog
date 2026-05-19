function textFromNode(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  if (!Array.isArray(node.children)) return '';
  return node.children.map((child) => textFromNode(child)).join('');
}

export default function remarkHideObsidianRelatedLinks() {
  return function hideObsidianRelatedLinks(tree) {
    if (!tree || !Array.isArray(tree.children)) return;

    const [first, second] = tree.children;
    if (!first || first.type !== 'paragraph') return;
    if (textFromNode(first).trim() !== '관련 링크:') return;

    tree.children.splice(0, second?.type === 'list' ? 2 : 1);
  };
}
