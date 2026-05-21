import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildSeriesIndexBody,
  syncSeriesGraphMetadata,
} from './sync-series-graph-metadata.mjs';

function seriesIndex(data) {
  return { data };
}

test('syncSeriesGraphMetadata rewrites aliases and tags without changing body by default', () => {
  const content = `---
title: "Network Protocols"
series: network-protocols
parent: computer-networks
aliases:
  - stale
tags:
  - stale
---
본문
`;

  const next = syncSeriesGraphMetadata(content);

  assert.match(next, /aliases:\n  - series:computer-networks\/network-protocols/);
  assert.match(next, /tags:\n  - graph\/child-series/);
  assert.match(next, /\n---\n본문\n$/);
});

test('buildSeriesIndexBody renders parent series links only for parent indexes', () => {
  const body = buildSeriesIndexBody(
    seriesIndex({ series: 'computer-networks', title: '컴퓨터 네트워크' }),
    [
      seriesIndex({
        series: 'network-foundations',
        parent: 'computer-networks',
        title: '네트워크 기초',
      }),
      seriesIndex({
        series: 'network-protocols',
        parent: 'computer-networks',
        title: '네트워크 프로토콜',
      }),
    ],
    null
  );

  assert.equal(
    body,
    [
      '관련 시리즈:',
      '1. [[series_indexes/computer-networks/network-foundations|네트워크 기초]]',
      '2. [[series_indexes/computer-networks/network-protocols|네트워크 프로토콜]]',
      '',
    ].join('\n')
  );
});

test('buildSeriesIndexBody includes ordered post inventory for parent indexes without children', () => {
  const body = buildSeriesIndexBody(
    seriesIndex({ series: 'troubleshooting', title: '트러블슈팅' }),
    [],
    null,
    [
      {
        slug: 'flyway-validation-at-build-time',
        data: { title: 'Flyway 검증을 빌드 시점에 수행하기' },
      },
    ]
  );

  assert.equal(
    body,
    [
      '게시글 순서:',
      '1. [[flyway-validation-at-build-time|Flyway 검증을 빌드 시점에 수행하기]]',
      '',
    ].join('\n')
  );
});

test('buildSeriesIndexBody includes ordered post inventory for child indexes', () => {
  const body = buildSeriesIndexBody(
    seriesIndex({
      series: 'network-protocols',
      parent: 'computer-networks',
      title: '네트워크 프로토콜',
    }),
    [],
    seriesIndex({ series: 'computer-networks', title: '컴퓨터 네트워크' }),
    [
      {
        slug: 'dns-resolution',
        data: { title: 'DNS and Name Resolution' },
      },
      {
        slug: 'what-is-http',
        data: { title: 'What Is HTTP?' },
      },
    ]
  );

  assert.equal(
    body,
    [
      '관련 링크:',
      '- 상위 시리즈: [[series_indexes/computer-networks|컴퓨터 네트워크]]',
      '',
      '게시글 순서:',
      '1. [[dns-resolution|DNS and Name Resolution]]',
      '2. [[what-is-http|What Is HTTP?]]',
      '',
    ].join('\n')
  );
});

test('buildSeriesIndexBody rejects a child index without a parent document', () => {
  assert.throws(
    () =>
      buildSeriesIndexBody(
        seriesIndex({
          series: 'network-protocols',
          parent: 'computer-networks',
          title: '네트워크 프로토콜',
        }),
        [],
        null,
        []
      ),
    /missing parent index/
  );
});
