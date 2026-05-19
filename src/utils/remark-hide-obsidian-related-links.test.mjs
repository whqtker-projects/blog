import assert from 'node:assert/strict';
import test from 'node:test';
import remarkHideObsidianRelatedLinks from './remark-hide-obsidian-related-links.mjs';

function text(value) {
  return { type: 'text', value };
}

function paragraph(children) {
  return { type: 'paragraph', children };
}

function list(items) {
  return {
    type: 'list',
    ordered: false,
    start: null,
    spread: false,
    children: items.map((item) => ({
      type: 'listItem',
      spread: false,
      checked: null,
      children: [paragraph([text(item)])],
    })),
  };
}

function runPlugin(children) {
  const tree = { type: 'root', children };
  remarkHideObsidianRelatedLinks()(tree);
  return tree.children;
}

test('remarkHideObsidianRelatedLinks removes leading related-links paragraph and list', () => {
  const result = runPlugin([
    paragraph([text('관련 링크:')]),
    list(['소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]']),
    paragraph([text('본문')]),
  ]);

  assert.deepEqual(result, [paragraph([text('본문')])]);
});

test('remarkHideObsidianRelatedLinks leaves non-leading related-links text untouched', () => {
  const result = runPlugin([
    paragraph([text('본문')]),
    paragraph([text('관련 링크:')]),
    list(['다음 글: [[next-post]]']),
  ]);

  assert.equal(result.length, 3);
});
