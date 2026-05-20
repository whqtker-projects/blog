---
title: 연관 매핑(association·collection)
series: mybatis-mapping
order: 4
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-mapping|MyBatis 매핑]]
- 이전 글: [[mybatis-result-mapping|결과 매핑(resultType·resultMap)]]

## 연관 매핑이 필요한 이유

- 객체 그래프와 조인 결과를 1:1로 대응하기 어려운 이유를 설명한다.

## association

- 단일 연관 객체를 매핑하는 기본 방식과 사용 예를 정리한다.

## collection

- 1:N 관계를 컬렉션으로 매핑할 때의 구조를 설명한다.

## 중첩 결과 매핑 시 주의점

- 중복 행, 성능 비용, N+1 유사 문제를 어떻게 인식할지 다룬다.
