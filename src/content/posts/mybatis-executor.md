---
title: Executor와 명령 실행 흐름
series: mybatis-internals
order: 1
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-internals|MyBatis 내부 동작]]
- 다음 글: [[mybatis-cache|1차 캐시와 2차 캐시]]

## Executor란

- Mapper 호출 뒤 실제 실행을 담당하는 내부 컴포넌트로 위치를 설명한다.

## 명령 실행 흐름

- `SqlSession`에서 `Executor`로 넘어가는 호출 단계를 잡는다.

## 주요 Executor 종류

- `SimpleExecutor`, `ReuseExecutor`, `BatchExecutor`의 차이를 정리한다.

## 실행 단계에서의 역할 분담

- Statement 처리기, 파라미터 처리기, 결과 처리기와의 관계를 설명한다.
