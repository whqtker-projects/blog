---
title: 1차 캐시와 2차 캐시
series: mybatis-internals
order: 2
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-internals|MyBatis 내부 동작]]
- 이전 글: [[mybatis-executor|Executor와 명령 실행 흐름]]
- 다음 글: [[mybatis-plugin|플러그인(Interceptor)의 동작 원리]]

## 1차 캐시란

- 세션 단위 캐시가 어떤 범위에서 동작하는지 설명한다.

## 2차 캐시란

- Mapper 네임스페이스 단위 캐시와 활성화 조건을 정리한다.

## 캐시 동작 범위와 생명주기

- 조회 재사용, flush, commit 시점의 변화를 중심으로 설명한다.

## 캐시 사용 시 주의점

- 일관성, 메모리 사용, 부적절한 대상 쿼리 문제를 다룬다.
