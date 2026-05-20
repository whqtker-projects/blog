---
title: foreach와 SQL 조각 재사용
series: mybatis-dynamic-sql
order: 3
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-dynamic-sql|MyBatis 동적 SQL]]
- 이전 글: [[mybatis-dynamic-sql-choose-where-set-trim|choose, where, set, trim]]

## foreach로 반복 SQL 구성하기

`foreach`는 컬렉션이나 배열을 순회하면서 SQL 조각을 반복해서 생성하는 동적 SQL 태그입니다. 여러 값을 SQL에 나열해야 할 때 사용합니다.

대표적으로 `IN` 조건처럼 값 목록을 괄호 안에 나열해야 하는 경우에 사용할 수 있습니다.

```xml
<foreach collection="ids" item="id" open="(" separator="," close=")">
    #{id}
</foreach>
```

`foreach`에서 자주 사용하는 속성은 다음과 같습니다.

| 속성 | 역할 |
| --- | --- |
| `collection` | 반복할 대상입니다. `List`, 배열, `Map` 등을 지정합니다. |
| `item` | 반복 중 현재 값을 가리키는 이름입니다. |
| `index` | 반복 중 현재 위치나 key를 가리키는 이름입니다. |
| `open` | 반복 결과 앞에 붙일 문자열입니다. |
| `separator` | 반복되는 항목 사이에 넣을 문자열입니다. |
| `close` | 반복 결과 뒤에 붙일 문자열입니다. |

각 값은 `#{id}`를 통해 `PreparedStatement` 파라미터로 바인딩됩니다. `foreach`는 값을 문자열로 직접 붙이는 것이 아니라, 반복되는 SQL 조각의 형태를 구성하고 각 값을 파라미터로 전달합니다.

## IN 조건 구성하기

여러 ID에 해당하는 사용자를 조회하는 기능을 예로 들 수 있습니다. Mapper 메서드는 ID 목록을 파라미터로 받습니다.

```java
public interface UserMapper {
    List<User> findByIds(@Param("ids") List<Long> ids);
}
```

XML Mapper에서는 `foreach`를 사용해 `IN` 조건을 구성합니다.

```xml
<select id="findByIds" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

`ids`에 `[1, 2, 3]`이 전달되면 SQL은 다음 형태로 실행됩니다.

```sql
SELECT id, name, status, created_at
FROM users
WHERE id IN (?, ?, ?)
```

`collection="ids"`는 Mapper 메서드에서 `@Param("ids")`로 지정한 이름과 연결됩니다. `item="id"`는 반복 중 현재 값을 `id`라는 이름으로 사용하겠다는 의미입니다. 내부의 `#{id}`는 각 값을 SQL 파라미터로 바인딩합니다.

`open`, `separator`, `close`를 사용하면 반복 결과 앞뒤의 괄호와 항목 사이의 쉼표를 MyBatis가 함께 구성합니다.

여러 값을 전달할 때는 `@Param`으로 이름을 지정하면 XML의 `collection` 값이 어떤 파라미터를 가리키는지 바로 드러납니다. 배열을 전달하는 경우에도 같은 방식으로 사용할 수 있습니다.

## SQL 조각 재사용하기

동적 SQL이 길어지면 여러 statement에서 같은 컬럼 목록이나 조건 조각이 반복될 수 있습니다. MyBatis는 `<sql>`과 `<include>`를 사용해 공통 SQL 조각을 분리할 수 있습니다.

예를 들어 여러 조회 SQL에서 같은 컬럼 목록을 사용한다면 다음처럼 공통 조각으로 정의할 수 있습니다.

```xml
<sql id="userColumns">
    id, name, status, created_at
</sql>
```

조회 SQL에서는 `<include>`로 해당 조각을 가져옵니다.

```xml
<select id="findById" resultType="com.example.domain.User">
    SELECT
    <include refid="userColumns" />
    FROM users
    WHERE id = #{id}
</select>
```

`<sql>`은 SQL 조각을 정의하고, `<include>`는 정의된 조각을 statement 안으로 가져옵니다. 이 기능은 `foreach`와 같은 반복 태그는 아니지만, 동적 SQL이 길어질 때 XML 안의 중복을 줄이는 데 사용됩니다.

`foreach`와 `<sql>`, `<include>`를 함께 사용할 수도 있습니다. 공통 컬럼 목록은 `<include>`로 가져오고, ID 목록 조건은 `foreach`로 구성합니다.

```xml
<sql id="userColumns">
    id, name, status, created_at
</sql>

<select id="findByIds" resultType="com.example.domain.User">
    SELECT
    <include refid="userColumns" />
    FROM users
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

이 구조에서 `<include>`는 반복되는 컬럼 목록을 가져오고, `foreach`는 전달된 컬렉션을 SQL 값 목록으로 확장합니다. 두 기능은 함께 사용할 수 있지만, 담당하는 역할은 다릅니다.

`<include>`를 사용할 때는 가져온 SQL 조각이 들어가는 위치를 기준으로 전체 SQL 문법이 맞는지 확인해야 합니다. 컬럼 목록, 조건절, 정렬 구문처럼 조각의 성격이 다르기 때문에, 공통 조각을 너무 넓게 만들면 실제 실행 SQL을 읽기 어려워질 수 있습니다.

## 컬렉션 파라미터와 SQL 조각 사용 시 주의점

`foreach`로 `IN` 조건을 만들 때는 빈 컬렉션을 먼저 고려해야 합니다. `ids`가 빈 리스트라면 `WHERE id IN`만 남거나 `IN ()`처럼 실행할 수 없는 SQL이 만들어질 수 있습니다.

빈 목록을 반환해야 하는 요구사항이라면 Mapper를 호출하기 전에 처리할 수 있습니다.

```java
if (ids == null || ids.isEmpty()) {
    return List.of();
}

return userMapper.findByIds(ids);
```

XML에서 조건을 감싸는 방식도 가능하지만, 조건이 빠졌을 때 전체 조회가 되는지 반드시 확인해야 합니다.

```xml
<select id="findByIds" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    <if test="ids != null and ids.size() > 0">
        WHERE id IN
        <foreach collection="ids" item="id" open="(" separator="," close=")">
            #{id}
        </foreach>
    </if>
</select>
```

이 방식에서는 `ids`가 비어 있을 때 `WHERE` 조건이 사라집니다. 의도한 동작이 빈 목록 반환이라면 애플리케이션 코드에서 Mapper 호출 전에 처리하는 편이 더 직접적입니다.

`separator`, `open`, `close`도 SQL 문법에 직접 영향을 줍니다.

```xml
<foreach collection="ids" item="id" open="(" separator="," close=")">
    #{id}
</foreach>
```

`IN` 조건에서는 보통 위처럼 괄호와 쉼표를 함께 지정합니다. `open`이나 `close`를 생략하면 괄호가 빠지고, `separator`를 생략하면 값들이 붙어서 SQL 문법이 깨질 수 있습니다.

`<sql>`과 `<include>`를 사용할 때는 SQL 조각의 단위를 너무 작게 나누지 않는 편이 낫습니다. 여러 statement에서 반복되는 컬럼 목록이나 조건 묶음은 분리할 수 있지만, 한 곳에서만 사용하는 짧은 조건까지 모두 조각으로 나누면 실제 SQL을 따라가기 어려워집니다.

`foreach`는 컬렉션을 SQL 조각으로 확장하고, `<sql>`과 `<include>`는 반복되는 SQL 조각을 재사용합니다. 컬렉션이 비어 있는 경우와 조각이 삽입되는 위치를 함께 봐야 실제 실행 SQL이 의도한 형태로 만들어집니다.