---
title: choose·where·set·trim
series: mybatis-dynamic-sql
order: 2
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-dynamic-sql|MyBatis 동적 SQL]]
- 이전 글: [[mybatis-dynamic-sql-if|동적 SQL의 필요성과 if]]
- 다음 글: [[mybatis-dynamic-sql-foreach|foreach와 SQL 조각 재사용]]

## choose의 분기 처리

- 여러 조건 중 하나만 선택해야 할 때의 흐름을 설명한다.

## where와 trim

- 불필요한 `AND`, `OR`를 정리해 주는 역할 차이를 비교한다.

## set을 통한 업데이트 구성

- 부분 업데이트 SQL을 안전하게 조립하는 패턴을 정리한다.

## 상황별 사용 기준

- `if`만으로 충분한 경우와 별도 태그가 필요한 경우를 구분한다.
