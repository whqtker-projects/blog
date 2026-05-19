---
title: SqlSessionFactory와 SqlSession
series: mybatis-foundations
order: 3
status: idea
---
## SqlSessionFactory란

- MyBatis 실행 환경을 초기화하고 세션 생성을 담당하는 객체로 설명한다.

## SqlSession의 역할

- 실제 SQL 실행과 트랜잭션 경계 안에서 어떤 책임을 가지는지 정리한다.

## 생성부터 실행까지의 흐름

- 설정 로딩부터 Mapper 호출까지 이어지는 호출 흐름을 단계별로 잡는다.

## 트랜잭션과 자원 관리

- 세션 종료, 커밋, 롤백이 왜 중요한지와 실수 포인트를 다룬다.
