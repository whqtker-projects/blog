---
title: 결과 매핑(resultType, resultMap)
series: mybatis-mapping
order: 3
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-mapping|MyBatis 매핑]]
- 이전 글: [[mybatis-parameter-binding|파라미터 바인딩과 #{} 그리고 ${}]]
- 다음 글: [[mybatis-association-and-collection|연관 매핑 association과 collection]]

## 결과 매핑이란

결과 매핑은 SQL 실행 결과를 자바 객체로 변환하는 과정입니다. 데이터베이스에서 조회한 결과는 컬럼 단위의 값으로 반환되고, MyBatis는 이 값을 Mapper 메서드의 반환 타입에 맞춰 객체에 담습니다.

예를 들어 다음과 같은 Mapper 메서드가 있다고 가정합니다.

```java
public interface UserMapper {
    User findById(Long id);
}
```

이 메서드의 반환 타입은 `User`입니다. MyBatis는 SQL 실행 결과에서 컬럼 값을 읽고, `User` 객체의 프로퍼티에 값을 채워 반환합니다.

```xml
<select id="findById" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    WHERE id = #{id}
</select>
```

위 SQL의 결과에는 `id`, `name`, `email` 컬럼이 포함됩니다. `User` 객체에도 `id`, `name`, `email`에 대응되는 프로퍼티가 있다면 MyBatis는 컬럼명과 프로퍼티 이름을 기준으로 값을 매핑합니다.

```java
public class User {
    private Long id;
    private String name;
    private String email;
}
```

결과 매핑에서 중요한 부분은 SQL 결과 컬럼과 자바 객체의 프로퍼티가 어떻게 대응되는지입니다. 컬럼명과 프로퍼티 이름이 맞으면 MyBatis가 기본 규칙으로 매핑할 수 있습니다. 반대로 컬럼명과 프로퍼티 이름이 다르거나, 하나의 SQL 결과를 객체 구조에 맞게 나누어 담아야 한다면 매핑 정보를 직접 지정해야 합니다.

## resultType으로 매핑하는 경우

`resultType`은 SQL 실행 결과를 어떤 타입의 객체로 변환할지 지정합니다. 단순한 조회에서는 `resultType`만으로 결과 매핑을 처리할 수 있습니다.

```xml
<select id="findById" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    WHERE id = #{id}
</select>
```

이 설정에서는 SQL 결과의 각 컬럼이 `User` 객체의 프로퍼티와 이름을 기준으로 매핑됩니다. `id` 컬럼은 `id` 프로퍼티에, `name` 컬럼은 `name` 프로퍼티에, `email` 컬럼은 `email` 프로퍼티에 매핑됩니다.

목록 조회에서도 같은 방식으로 `resultType`을 사용할 수 있습니다.

```java
public interface UserMapper {
    List<User> findAll();
}
```

```xml
<select id="findAll" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
</select>
```

Mapper 메서드의 반환 타입은 `List<User>`이지만, XML의 `resultType`에는 리스트가 아니라 각 row를 담을 객체 타입인 `User`를 지정합니다. MyBatis는 SQL 결과의 각 row를 `User` 객체로 변환하고, 전체 결과를 리스트로 반환합니다.

컬럼명과 프로퍼티 이름이 완전히 같지 않아도 설정으로 대응할 수 있는 경우가 있습니다. 예를 들어 데이터베이스 컬럼은 `user_name`이고 자바 프로퍼티는 `userName`이라면 `mapUnderscoreToCamelCase` 설정을 사용할 수 있습니다.

```xml
<settings>
    <setting name="mapUnderscoreToCamelCase" value="true" />
</settings>
```

이 설정을 사용하면 `user_name` 컬럼을 `userName` 프로퍼티에 매핑할 수 있습니다.

```xml
<select id="findById" resultType="com.example.domain.User">
    SELECT id, user_name, email
    FROM users
    WHERE id = #{id}
</select>
```

이처럼 컬럼명과 프로퍼티 이름이 규칙적으로 대응된다면 `resultType`만으로도 조회 결과를 객체에 담을 수 있습니다.

## resultMap으로 매핑하는 경우

`resultMap`은 SQL 결과 컬럼과 객체 프로퍼티의 대응 관계를 직접 지정할 때 사용합니다. 컬럼명과 프로퍼티 이름이 다르거나, 여러 SQL에서 같은 매핑 규칙을 재사용해야 하거나, 조인 결과를 객체 구조에 맞게 나누어 담아야 할 때 사용할 수 있습니다.

예를 들어 테이블 컬럼명이 다음과 같다고 가정합니다.

```sql
SELECT user_id, user_name, user_email
FROM users
WHERE user_id = #{id}
```

자바 객체는 다음과 같이 작성되어 있습니다.

```java
public class User {
    private Long id;
    private String name;
    private String email;
}
```

이 경우 컬럼명은 `user_id`, `user_name`, `user_email`이고 객체 프로퍼티는 `id`, `name`, `email`입니다. 기본 매핑만으로는 어떤 컬럼이 어떤 프로퍼티에 들어가야 하는지 바로 맞지 않습니다.

이때 `resultMap`으로 대응 관계를 지정할 수 있습니다.

```xml
<resultMap id="userResultMap" type="com.example.domain.User">
    <id property="id" column="user_id" />
    <result property="name" column="user_name" />
    <result property="email" column="user_email" />
</resultMap>

<select id="findById" resultMap="userResultMap">
    SELECT user_id, user_name, user_email
    FROM users
    WHERE user_id = #{id}
</select>
```

`resultMap`의 `type`에는 결과를 담을 객체 타입을 지정합니다. `id`와 `result` 태그는 컬럼과 프로퍼티의 대응 관계를 지정합니다.

`id` 태그는 객체를 식별하는 값에 사용합니다.

```xml
<id property="id" column="user_id" />
```

이 설정은 `user_id` 컬럼 값을 `User` 객체의 `id` 프로퍼티에 매핑합니다.

일반 컬럼은 `result` 태그로 지정합니다.

```xml
<result property="name" column="user_name" />
<result property="email" column="user_email" />
```

이 설정은 `user_name` 컬럼을 `name` 프로퍼티에, `user_email` 컬럼을 `email` 프로퍼티에 매핑합니다.

`resultMap`을 사용하면 SQL 컬럼명과 자바 객체의 프로퍼티 이름이 달라도 매핑 관계를 XML에서 직접 지정할 수 있습니다.

컬럼 별칭을 사용해 `resultType`으로 처리할 수도 있습니다.

```xml
<select id="findById" resultType="com.example.domain.User">
    SELECT
        user_id AS id,
        user_name AS name,
        user_email AS email
    FROM users
    WHERE user_id = #{id}
</select>
```

이 방식은 SQL에서 컬럼 별칭을 프로퍼티 이름에 맞추는 방식입니다. 반면 `resultMap`은 SQL 결과 컬럼과 객체 프로퍼티의 대응 관계를 매핑 설정으로 분리합니다. 같은 매핑 구조를 여러 SQL에서 재사용해야 한다면 `resultMap`을 사용할 수 있습니다.

## resultType과 resultMap의 선택 기준

SQL 결과 컬럼명과 객체 프로퍼티 이름이 같거나, `mapUnderscoreToCamelCase` 설정으로 대응 가능한 경우에는 `resultType`을 사용할 수 있습니다. 별도 매핑 정보를 작성하지 않아도 MyBatis가 컬럼명과 프로퍼티 이름을 기준으로 값을 채웁니다.

컬럼과 프로퍼티의 대응 관계를 직접 지정해야 한다면 `resultMap`을 사용합니다. 컬럼명이 객체 프로퍼티와 다르거나, SQL 별칭만으로 처리하기 어렵거나, 여러 SQL에서 같은 매핑 규칙을 재사용해야 하는 경우가 여기에 해당합니다.

조인 결과를 객체 하나에 단순히 담는 수준을 넘어, 중첩 객체나 컬렉션으로 나누어 매핑해야 하는 경우에는 `association`, `collection`을 사용합니다. 이 내용은 다음 글에서 별도로 다룹니다.