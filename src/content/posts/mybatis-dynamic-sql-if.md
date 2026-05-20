---
title: 동적 SQL의 필요성과 if
series: mybatis-dynamic-sql
order: 1
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-dynamic-sql|MyBatis 동적 SQL]]
- 다음 글: [[mybatis-dynamic-sql-choose-where-set-trim|choose·where·set·trim]]

## 동적 SQL이 필요한 이유

- 검색 조건 조합이 많아질 때 정적 SQL만으로 대응하기 어려운 이유를 설명한다.

## if 태그의 역할

- 조건에 따라 SQL 조각을 포함하거나 제외하는 기본 동작을 정리한다.

## 조건 검색 예시

- 이름, 상태, 기간 같은 선택적 필터 예시로 흐름을 잡는다.

## 남용 시 주의점

- XML 복잡도 증가와 가독성 저하를 어떻게 피할지 정리한다.
