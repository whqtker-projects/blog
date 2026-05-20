---
title: choose, where, set, trim
series: mybatis-dynamic-sql
order: 2
status: idea
---

관련 링크:

- 소속 시리즈: [[series_indexes/mybatis/mybatis-dynamic-sql|MyBatis 동적 SQL]]
- 이전 글: [[mybatis-dynamic-sql-if|동적 SQL의 필요성과 if]]
- 다음 글: [[mybatis-dynamic-sql-foreach|foreach와 SQL 조각 재사용]]

## choose로 조건 분기 처리하기

`choose`는 여러 조건 중 하나의 SQL 조각만 선택해야 할 때 사용합니다. `if` 태그를 여러 개 나열하면 조건이 여러 개 참일 때 SQL 조각도 여러 개 포함됩니다. 반면 `choose`는 조건을 순서대로 검사하고, 처음으로 참이 되는 `when` 하나만 SQL에 포함합니다.

예를 들어 검색어가 있을 때는 검색 조건을 적용하고, 검색어가 없을 때는 기본 상태 조건을 적용해야 한다고 가정합니다.

```xml
<select id="searchUsers" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    <where>
        <choose>
            <when test="keyword != null and keyword != ''">
                name LIKE CONCAT('%', #{keyword}, '%')
            </when>
            <otherwise>
                status = 'ACTIVE'
            </otherwise>
        </choose>
    </where>
</select>
```

`keyword` 값이 있으면 `name LIKE ...` 조건이 포함됩니다.

```sql
SELECT id, name, status, created_at
FROM users
WHERE name LIKE CONCAT('%', ?, '%')
```

`keyword` 값이 없으면 `otherwise` 조건이 포함되어 `WHERE status = 'ACTIVE'` 조건으로 실행됩니다.

`choose`는 Java의 `if, else if, else` 흐름과 비슷하게 사용할 수 있습니다. `when`은 조건 분기이고, `otherwise`는 앞의 `when` 조건이 모두 거짓일 때 포함되는 기본 SQL 조각입니다.

여러 조건이 동시에 참이더라도 하나의 조건만 SQL에 포함해야 한다면 `choose`를 사용합니다.

## where로 조건절 정리하기

`where`는 내부에 포함된 SQL 조각이 있을 때만 `WHERE` 키워드를 붙입니다. 또한 조건절 앞에 불필요하게 붙은 `AND`나 `OR`를 제거합니다.

이전 글에서는 기본 `if` 태그만 사용하기 위해 `WHERE 1 = 1` 형태를 사용했습니다.

```xml
<select id="searchUsers" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    WHERE 1 = 1
    <if test="name != null and name != ''">
        AND name = #{name}
    </if>
    <if test="status != null and status != ''">
        AND status = #{status}
    </if>
</select>
```

`where`를 사용하면 `WHERE 1 = 1`을 두지 않고 조건절을 구성할 수 있습니다.

```xml
<select id="searchUsers" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    <where>
        <if test="name != null and name != ''">
            AND name = #{name}
        </if>
        <if test="status != null and status != ''">
            AND status = #{status}
        </if>
    </where>
</select>
```

`name` 값만 있으면 `where`는 앞의 `AND`를 제거하고 `WHERE name = ?` 형태로 SQL을 만듭니다.

```sql
SELECT id, name, status, created_at
FROM users
WHERE name = ?
```

조건이 하나도 없으면 `where`는 `WHERE` 키워드를 붙이지 않습니다.

```sql
SELECT id, name, status, created_at
FROM users
```

`where`는 검색 조건처럼 `WHERE` 절이 동적으로 생기거나 없어지는 상황에서 사용합니다. 조건이 없을 때 빈 `WHERE`가 남는 문제와, 첫 조건 앞에 `AND`가 남는 문제를 함께 처리합니다.

## trim으로 접두사와 접미사 제어하기

`trim`은 SQL 조각 앞뒤의 문자열을 직접 제어할 때 사용합니다. `where`가 조건절에 맞춰진 태그라면, `trim`은 접두사와 접미사를 더 일반적으로 다룰 수 있는 태그입니다.

`where`와 비슷한 동작은 `trim`으로도 작성할 수 있습니다.

```xml
<select id="searchUsers" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    <trim prefix="WHERE" prefixOverrides="AND |OR ">
        <if test="name != null and name != ''">
            AND name = #{name}
        </if>
        <if test="status != null and status != ''">
            AND status = #{status}
        </if>
    </trim>
</select>
```

`prefix="WHERE"`는 내부 SQL 조각이 있을 때 앞에 `WHERE`를 붙입니다. `prefixOverrides="AND |OR "`는 내부 SQL 조각의 앞쪽에 `AND`나 `OR`가 있으면 제거합니다.

이 설정은 조건이 있을 때 `WHERE`를 붙이고, 앞쪽의 `AND`나 `OR`를 제거한다는 점에서 `where`와 같은 형태의 SQL을 만듭니다.

`trim`은 `prefix`, `suffix`, `prefixOverrides`, `suffixOverrides`로 SQL 조각의 앞뒤 문자열을 직접 지정합니다. 예를 들어 특정 조건이 있을 때만 괄호로 묶인 조건 그룹을 만들 수 있습니다.

```xml
<select id="searchUsers" resultType="com.example.domain.User">
    SELECT id, name, status, created_at
    FROM users
    <where>
        <trim prefix="(" suffix=")" prefixOverrides="OR ">
            <if test="name != null and name != ''">
                OR name = #{name}
            </if>
            <if test="email != null and email != ''">
                OR email = #{email}
            </if>
        </trim>
    </where>
</select>
```

`name`과 `email` 값이 모두 있으면 `WHERE (name = ? OR email = ?)` 형태의 조건 그룹이 만들어집니다.

## set으로 부분 업데이트 구성하기

`set`은 `UPDATE` 문에서 변경할 컬럼만 동적으로 포함할 때 사용합니다. 내부 SQL 조각이 있으면 `SET` 키워드를 붙이고, 마지막에 남는 불필요한 쉼표를 제거합니다.

사용자 정보를 부분 수정하는 기능을 예로 들 수 있습니다.

```java
public class UserUpdateRequest {
    private Long id;
    private String name;
    private String email;
    private String status;
}
```

수정할 값이 들어온 컬럼만 업데이트하려면 다음처럼 작성할 수 있습니다.

```xml
<update id="updateUser" parameterType="com.example.domain.UserUpdateRequest">
    UPDATE users
    <set>
        <if test="name != null and name != ''">
            name = #{name},
        </if>
        <if test="email != null and email != ''">
            email = #{email},
        </if>
        <if test="status != null and status != ''">
            status = #{status},
        </if>
    </set>
    WHERE id = #{id}
</update>
```

`name`과 `email`만 전달되면 SQL은 다음과 같은 형태가 됩니다.

```sql
UPDATE users
SET name = ?,
    email = ?
WHERE id = ?
```

XML 안에서는 각 컬럼 뒤에 쉼표가 붙어 있지만, `set`이 마지막 쉼표를 제거합니다.

`set`을 사용하지 않으면 마지막 쉼표 때문에 SQL 문법 오류가 발생할 수 있습니다.

```xml
<update id="updateUser" parameterType="com.example.domain.UserUpdateRequest">
    UPDATE users
    SET
    <if test="name != null and name != ''">
        name = #{name},
    </if>
    <if test="email != null and email != ''">
        email = #{email},
    </if>
    WHERE id = #{id}
</update>
```

`name`만 전달되면 `SET name = ?, WHERE id = ?`처럼 쉼표가 남을 수 있습니다. `set`은 이런 형태를 정리해 변경할 컬럼만 포함된 `UPDATE` 문을 구성합니다.

모든 수정 값이 비어 있으면 `set` 안에 포함될 컬럼이 없어집니다. 부분 업데이트를 사용할 때는 Mapper 호출 전에 수정할 값이 하나 이상 있는지 확인하는 처리가 필요합니다.

## 상황별 사용 기준

동적 SQL 태그는 SQL을 조립할 때 생기는 문제에 맞춰 선택합니다.

| 상황 | 사용할 태그 |
| --- | --- |
| 조건이 참일 때만 SQL 조각을 포함해야 하는 경우 | `if` |
| 여러 조건 중 하나만 선택해야 하는 경우 | `choose` |
| 검색 조건절에서 `WHERE`, `AND`, `OR`를 정리해야 하는 경우 | `where` |
| SQL 조각의 접두사, 접미사, 제거할 문자열을 직접 제어해야 하는 경우 | `trim` |
| 부분 업데이트에서 변경할 컬럼만 `SET` 절에 포함해야 하는 경우 | `set` |

단순 조건 포함은 `if`로 처리할 수 있습니다. 여러 조건 중 하나만 선택해야 하면 `choose`를 사용하고, 검색 조건절의 `WHERE`와 앞쪽 `AND`, `OR` 정리는 `where`로 처리합니다. `where`보다 더 직접적인 접두사나 접미사 제어가 필요하면 `trim`을 사용합니다. 부분 업데이트처럼 변경할 컬럼만 `SET` 절에 포함해야 하는 경우에는 `set`을 사용합니다.

동적 SQL을 작성할 때는 먼저 문제가 조건 포함인지, 조건 분기인지, SQL 문법 정리인지 구분해야 합니다. 그 구분에 따라 필요한 태그를 선택합니다.