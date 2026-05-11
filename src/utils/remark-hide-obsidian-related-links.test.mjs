import assert from 'node:assert/strict';
import test from 'node:test';
import remarkHideObsidianRelatedLinks from './remark-hide-obsidian-related-links.mjs';

function text(value) {
  return { type: 'text', value };
}

function paragraph(value) {
  return { type: 'paragraph', children: [text(value)] };
}

function listItem(value) {
  return {
    type: 'listItem',
    children: [paragraph(value)],
  };
}

function runPlugin(children) {
  const tree = { type: 'root', children };
  remarkHideObsidianRelatedLinks()(tree);
  return tree.children;
}

test('remarkHideObsidianRelatedLinks removes Obsidian graph link bullet block', () => {
  const children = runPlugin([
    paragraph('관련 링크:'),
    {
      type: 'list',
      ordered: false,
      children: [
        listItem('소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]'),
        listItem('다음 글: [[ioc-and-di|IoC와 DI]]'),
      ],
    },
    paragraph('본문'),
  ]);

  assert.deepEqual(children, [paragraph('본문')]);
});

test('remarkHideObsidianRelatedLinks removes plain Obsidian graph link block', () => {
  const children = runPlugin([
    paragraph('관련 링크:'),
    paragraph(
      [
        '상위 시리즈: [[series:spring-framework|스프링 프레임워크]]',
        '소속 시리즈: [[series:spring-framework/spring-core|스프링 코어]]',
        '다음 글: [[ioc-and-di|IoC와 DI]]',
      ].join('\n')
    ),
    paragraph('본문'),
  ]);

  assert.deepEqual(children, [paragraph('본문')]);
});

test('remarkHideObsidianRelatedLinks keeps normal related links content', () => {
  const children = runPlugin([
    paragraph('관련 링크:'),
    paragraph('외부 자료: https://example.com'),
    paragraph('본문'),
  ]);

  assert.deepEqual(children, [
    paragraph('관련 링크:'),
    paragraph('외부 자료: https://example.com'),
    paragraph('본문'),
  ]);
});
