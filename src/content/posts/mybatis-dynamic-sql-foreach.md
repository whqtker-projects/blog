---
title: foreach와 SQL 조각 재사용
series: mybatis-dynamic-sql
order: 3
status: idea
---
## foreach의 역할

- 반복 가능한 데이터를 SQL 조각으로 확장하는 태그로 정의한다.

## IN 조건 구성

- 컬렉션을 받아 `IN (...)` 구문을 만드는 대표 사례를 설명한다.

## SQL 조각 재사용

- 공통 조건이나 컬럼 묶음을 재사용하는 구조와 연결해 본다.

## 컬렉션 파라미터 처리 시 주의점

- 빈 컬렉션, 구분자 처리, 과도한 동적 SQL 복잡도를 다룬다.
