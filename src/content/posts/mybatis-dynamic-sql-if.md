---
title: 동적 SQL의 필요성과 if
series: mybatis-dynamic-sql
order: 1
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-dynamic-sql|MyBatis 동적 SQL]]
- 다음 글: [[mybatis-dynamic-sql-choose-where-set-trim|choose, where, set, trim]]

## 동적 SQL이 필요한 이유

검색 기능에서는 모든 조건이 항상 들어오지 않습니다. 사용자가 이름만 입력할 수도 있고, 상태만 선택할 수도 있으며, 이름, 상태, 기간을 함께 지정할 수도 있습니다.

정적 SQL만 사용하면 조건 조합마다 SQL을 따로 작성해야 합니다.

```xml
<select id="findByName" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    WHERE name = #{name}
</select>

<select id="findByStatus" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    WHERE status = #{status}
</select>

<select id="findByNameAndStatus" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    WHERE name = #{name}
      AND status = #{status}
</select>
```

조건이 두세 개일 때는 SQL을 나누어 작성할 수 있지만, 검색 조건이 늘어나면 SQL 개수도 함께 늘어납니다. 이름, 상태, 시작일, 종료일, 권한, 정렬 조건처럼 선택 가능한 필터가 많아질수록 모든 조합을 정적 SQL로 나누기 어렵습니다.

MyBatis의 동적 SQL은 조건에 따라 SQL 조각을 포함하거나 제외할 수 있게 해 줍니다. 하나의 SQL 안에서 값이 있는 조건만 추가하면, 검색 조건 조합마다 SQL을 따로 만들지 않아도 됩니다.

## if 태그의 기본 동작

`if` 태그는 `test` 조건식이 참일 때만 내부 SQL 조각을 포함합니다.

```xml
<select id="findUsers" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    WHERE 1 = 1
    <if test="name != null and name != ''">
        AND name = #{name}
    </if>
</select>
```

위 SQL에서 `name` 값이 있으면 다음 조건이 SQL에 포함됩니다.

```sql
AND name = ?
```

`name` 값이 `null`이거나 빈 문자열이면 `if` 태그 안의 SQL 조각은 제외됩니다.

`test`는 SQL에 해당 조각을 포함할지 결정하고, `#{name}`은 실제 SQL 실행 시 파라미터로 바인딩됩니다.

`if` 태그는 조건에 따라 SQL 조각을 포함할지 제외할지만 결정합니다. `WHERE` 키워드나 앞뒤의 `AND`를 자동으로 정리하지는 않습니다. 이 때문에 기본 `if`만 사용할 때는 `WHERE 1 = 1` 같은 형태로 조건이 이어질 자리를 만들어 두는 경우가 있습니다.

## 선택적 조건 검색 예시

이름, 상태, 기간을 선택적으로 받을 수 있는 검색 기능을 예로 들 수 있습니다.

```java
public interface UserMapper {
    List<User> search(UserSearchCondition condition);
}
```

```java
public class UserSearchCondition {
    private String name;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
```

XML Mapper는 다음과 같이 작성할 수 있습니다.

```xml
<select id="search" parameterType="com.example.domain.UserSearchCondition" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    WHERE 1 = 1
    <if test="name != null and name != ''">
        AND name = #{name}
    </if>
    <if test="status != null and status != ''">
        AND status = #{status}
    </if>
    <if test="startDate != null">
        AND created_at >= #{startDate}
    </if>
    <if test="endDate != null">
        AND created_at <= #{endDate}
    </if>
</select>
```

XML에서는 검색 조건 객체의 프로퍼티 이름을 `test` 조건식과 `#{}` 파라미터에서 사용할 수 있습니다. `name`만 전달되면 이름 조건만 포함됩니다.

```sql
SELECT id, name, status, created_at
FROM users
WHERE 1 = 1
  AND name = ?
```

`status`, `startDate`, `endDate`가 함께 전달되면 상태 조건과 기간 조건이 함께 포함됩니다. 검색 조건이 아무것도 전달되지 않으면 `if` 태그 안의 조건은 모두 제외됩니다.

```sql
SELECT id, name, status, created_at
FROM users
WHERE 1 = 1
```

이 방식은 하나의 Mapper 메서드와 하나의 SQL로 여러 검색 조건 조합을 처리합니다. 조건이 있는 값만 SQL에 포함되고, 값이 없는 조건은 SQL에서 빠집니다.

다만 `WHERE 1 = 1`은 기본 `if` 태그만 사용할 때 조건 연결을 단순하게 만들기 위한 방식입니다. 조건절을 더 정돈해서 작성하는 방법은 다음 글에서 `where`, `trim`과 함께 다룹니다.

## if 태그 사용 시 주의할 점

`if` 태그가 많아지면 XML 안에서 SQL 조건절을 읽기 어려워질 수 있습니다. 조건이 몇 개 없을 때는 단순하지만, 검색 조건이 늘어나면 `if` 태그와 `AND`가 섞여 조건의 시작과 연결 구조를 따라가야 합니다.

`if` 태그는 단순히 조건을 포함하거나 제외하는 데 사용합니다. 여러 조건 중 하나만 선택해야 하거나, `WHERE`, `AND`, `SET` 같은 SQL 문법을 함께 정리해야 하는 경우에는 `if`만으로 SQL을 구성하기 어려워집니다.

이런 경우에는 다음 글에서 다룰 `choose`, `where`, `set`, `trim` 같은 태그를 함께 사용합니다. `if` 태그는 조건이 참일 때 SQL 조각을 포함하는 기본 단위이고, 다른 동적 SQL 태그는 조건 분기나 SQL 문법 정리를 보완하는 역할을 합니다.