---
title: 파라미터 바인딩과 #{}·${}
series: mybatis-mapping
order: 2
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-mapping|MyBatis 매핑]]
- 이전 글: [[mybatis-mapper-interface-and-xml|Mapper 인터페이스와 XML]]
- 다음 글: [[mybatis-result-mapping|결과 매핑(resultType·resultMap)]]

## 파라미터 전달 방식

- 단일 값, 객체, `Map`, 여러 파라미터 전달 방식을 구분한다.

## #{} 바인딩

- PreparedStatement 기반 안전한 바인딩이라는 점을 설명한다.

## ${} 치환

- 문자열 치환 방식과 그 사용 범위를 제한해야 하는 이유를 다룬다.

## 두 방식의 차이와 주의점

- SQL 인젝션 위험과 동적 컬럼명 처리 같은 예외 상황을 정리한다.
