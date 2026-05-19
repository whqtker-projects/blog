---
title: 플러그인(Interceptor)의 동작 원리
series: mybatis-internals
order: 3
status: idea
---
## 플러그인이란

- MyBatis 내부 동작을 가로채 확장하는 메커니즘으로 정의한다.

## Interceptor 동작 지점

- `Executor`, `StatementHandler`, `ParameterHandler`, `ResultSetHandler`를 구분한다.

## 플러그인 적용 흐름

- 인터셉터 등록부터 프록시 체인 생성까지의 흐름을 정리한다.

## 과도한 개입의 위험

- 디버깅 난도, 성능 비용, 예측 가능성 저하 문제를 다룬다.
