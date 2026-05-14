import assert from 'node:assert/strict';
import { join } from 'node:path';
import test from 'node:test';
import remarkObsidianImageWikilinks from './remark-obsidian-image-wikilinks.mjs';

function text(value) {
  return { type: 'text', value };
}

function paragraph(children) {
  return { type: 'paragraph', children };
}

function runPlugin(children, path) {
  const tree = { type: 'root', children };
  remarkObsidianImageWikilinks()(tree, { path });
  return tree.children;
}

test('remarkObsidianImageWikilinks converts a pasted image wikilink in a post', () => {
  const result = runPlugin(
    [paragraph([text('![[Pasted image 20260514231320.png]]')])],
    join(process.cwd(), 'src/content/posts/configuration-class-and-component-scan.md')
  );

  assert.deepEqual(result, [
    paragraph([
      {
        type: 'image',
        url: '../attachments/Pasted%20image%2020260514231320.png',
        alt: 'Pasted image 20260514231320.png',
        title: null,
      },
    ]),
  ]);
});

test('remarkObsidianImageWikilinks keeps surrounding text and uses explicit alt text', () => {
  const result = runPlugin(
    [paragraph([text('설명 앞 ![[diagram.png|설명용 다이어그램]] 설명 뒤')])],
    join(process.cwd(), 'src/content/posts/example.md')
  );

  assert.deepEqual(result, [
    paragraph([
      text('설명 앞 '),
      {
        type: 'image',
        url: '../attachments/diagram.png',
        alt: '설명용 다이어그램',
        title: null,
      },
      text(' 설명 뒤'),
    ]),
  ]);
});

test('remarkObsidianImageWikilinks computes child series relative attachment path', () => {
  const result = runPlugin(
    [paragraph([text('![[nested.png]]')])],
    join(process.cwd(), 'src/content/series_indexes/spring-framework/spring-core.md')
  );

  assert.deepEqual(result, [
    paragraph([
      {
        type: 'image',
        url: '../../attachments/nested.png',
        alt: 'nested.png',
        title: null,
      },
    ]),
  ]);
});
