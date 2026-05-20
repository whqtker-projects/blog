---
title: mybatis-spring 개요와 SqlSessionFactoryBean
series: mybatis-spring
order: 1
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-spring|MyBatis와 스프링 연동]]
- 다음 글: [[mybatis-mapper-scan|매퍼 스캔과 @MapperScan]]

## mybatis-spring이 필요한 이유

- 순수 MyBatis 자원 관리와 스프링 컨테이너를 연결해야 하는 배경을 설명한다.

## SqlSessionFactoryBean

- 스프링 빈으로 `SqlSessionFactory`를 만들 때의 역할을 정리한다.

## 스프링과 세션 관리 통합

- 트랜잭션 연동과 템플릿 기반 세션 처리 흐름을 설명한다.

## 기본 구성 흐름

- DataSource, 팩토리 빈, 매퍼 등록으로 이어지는 최소 구성을 잡는다.
