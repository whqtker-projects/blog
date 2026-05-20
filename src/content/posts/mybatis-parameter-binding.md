---
title: "파라미터 바인딩과 #{}, ${}"
series: mybatis-mapping
order: 2
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-mapping|MyBatis 매핑]]
- 이전 글: [[mybatis-mapper-interface-and-xml|Mapper 인터페이스와 XML]]
- 다음 글: [[mybatis-result-mapping|결과 매핑(resultType과 resultMap)]]

## 파라미터 전달 방식

Mapper 메서드는 Java 코드에서 전달받은 값을 SQL로 넘기는 진입점입니다. MyBatis는 Mapper 메서드에 전달된 값을 SQL 파라미터로 사용할 수 있게 처리합니다.

가장 단순한 형태는 하나의 값을 전달하는 방식입니다.

```java
public interface UserMapper {
    User findById(Long id);
}
```

```xml
<select id="findById" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    WHERE id = #{id}
</select>
```

단일 값을 전달하는 경우에는 SQL 조건에 필요한 값을 메서드 파라미터로 넘길 수 있습니다.

객체를 전달할 수도 있습니다.

```java
public interface UserMapper {
    int insert(User user);
}
```

```xml
<insert id="insert" parameterType="com.example.domain.User">
    INSERT INTO users (name, email)
    VALUES (#{name}, #{email})
</insert>
```

객체를 파라미터로 전달하면 SQL에서 객체의 프로퍼티 이름을 기준으로 값을 사용할 수 있습니다. 위 예제에서 `#{name}`은 `User` 객체의 `name` 프로퍼티를 참조하고, `#{email}`은 `email` 프로퍼티를 참조합니다.

`Map`을 전달하는 방식도 있습니다.

```java
public interface UserMapper {
    List<User> findByCondition(Map<String, Object> condition);
}
```

```xml
<select id="findByCondition" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    WHERE name = #{name}
      AND email = #{email}
</select>
```

`Map`을 전달하면 SQL에서는 key 이름을 기준으로 값을 꺼냅니다. 위 예제에서는 `condition`에 들어 있는 `name`, `email` key가 SQL 파라미터로 사용됩니다.

여러 값을 나누어 전달할 때는 `@Param`을 사용할 수 있습니다.

```java
public interface UserMapper {
    List<User> findByNameAndEmail(
        @Param("name") String name,
        @Param("email") String email
    );
}
```

```xml
<select id="findByNameAndEmail" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    WHERE name = #{name}
      AND email = #{email}
</select>
```

`@Param("name")`으로 지정한 이름은 SQL에서 `#{name}`으로 사용할 수 있습니다. 여러 파라미터를 전달할 때 `@Param`을 사용하지 않으면 SQL에서 `param1`, `param2` 같은 기본 이름으로 접근해야 할 수 있습니다.

## #{} 바인딩

`#{}`는 값을 SQL 파라미터로 바인딩할 때 사용합니다. MyBatis는 `#{}` 위치를 JDBC `PreparedStatement`의 `?` 자리로 바꾸고, Mapper 메서드에 전달된 값을 별도로 바인딩합니다.

예를 들어 다음 SQL이 있다고 가정합니다.

```xml
<select id="findById" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    WHERE id = #{id}
</select>
```

Mapper 메서드를 호출하면 전달된 값이 `#{id}` 위치에 바인딩됩니다.

```java
User user = userMapper.findById(1L);
```

MyBatis는 내부적으로 다음과 같은 PreparedStatement 기반 흐름으로 SQL을 실행합니다.

```sql
SELECT id, name, email
FROM users
WHERE id = ?
```

`1L` 값은 SQL 문자열에 직접 붙지 않고, `?` 위치에 파라미터로 전달됩니다. 이 방식은 값과 SQL 구조를 분리합니다. 문자열 값이 전달되더라도 SQL 문법의 일부로 해석되는 것이 아니라 하나의 값으로 처리됩니다.

문자열 값도 같은 방식으로 처리됩니다. 개발자가 직접 따옴표를 붙이거나 문자열을 이스케이프하는 코드를 작성하지 않아도, MyBatis가 `PreparedStatement` 파라미터로 값을 전달합니다.

일반적인 조건 값에는 `#{}`를 사용합니다. 사용자 ID, 이름, 이메일, 상태값, 날짜 범위처럼 SQL의 값으로 들어가는 데이터는 `#{}`로 바인딩하는 방식이 맞습니다.

## ${} 문자열 치환

`${}`는 SQL 문자열을 그대로 치환할 때 사용합니다. `#{}`처럼 PreparedStatement 파라미터로 바인딩되는 것이 아니라, SQL이 만들어지기 전에 문자열이 SQL 안에 직접 삽입됩니다.

예를 들어 다음과 같이 정렬 컬럼을 전달한다고 가정합니다.

```java
public interface UserMapper {
    List<User> findAllOrderBy(@Param("column") String column);
}
```

```xml
<select id="findAllOrderBy" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    ORDER BY ${column}
</select>
```

`column`에 `"name"`이 전달되면 SQL은 다음과 같은 형태가 됩니다.

```sql
SELECT id, name, email
FROM users
ORDER BY name
```

이 방식은 컬럼명이나 정렬 방향처럼 PreparedStatement 파라미터로 처리할 수 없는 SQL 구조를 바꿀 때 사용할 수 있습니다. `ORDER BY #{column}`처럼 작성하면 컬럼명이 아니라 문자열 값으로 바인딩되기 때문에 원하는 정렬 컬럼으로 동작하지 않습니다.

다만 `${}`는 전달된 문자열이 SQL에 그대로 들어갑니다. `column` 값이 외부 요청값 그대로 들어온다면, 사용자가 의도하지 않은 SQL 조각을 전달할 수 있습니다. 따라서 `${}`는 사용자 입력을 그대로 넣는 용도로 사용하면 안 됩니다.

컬럼명이나 정렬 방향을 동적으로 바꿔야 한다면, 허용할 값을 애플리케이션 코드에서 제한해야 합니다.

```java
public enum UserSortColumn {
    ID("id"),
    NAME("name"),
    EMAIL("email");

    private final String columnName;

    UserSortColumn(String columnName) {
        this.columnName = columnName;
    }

    public String columnName() {
        return columnName;
    }
}
```

```java
List<User> users = userMapper.findAllOrderBy(UserSortColumn.NAME.columnName());
```

이 방식은 외부 요청값을 SQL에 바로 넣지 않고, 애플리케이션에서 허용한 컬럼명만 Mapper로 전달하는 구조입니다.

## #{}와 ${}의 선택 기준

Mapper로 전달하는 값이 SQL 조건의 데이터 값이라면 `#{}`를 사용합니다. ID, 이름, 이메일, 상태값, 날짜 범위처럼 비교 대상이 되는 값은 PreparedStatement 파라미터로 바인딩해야 합니다.

`${}`는 SQL 구조 자체를 바꿔야 할 때만 제한적으로 사용합니다. 컬럼명, 테이블명, 정렬 방향처럼 PreparedStatement 파라미터로 대체할 수 없는 부분이 여기에 해당합니다.

이 경우에도 외부 입력을 그대로 사용하지 않아야 합니다. 애플리케이션 코드에서 허용된 컬럼명과 정렬 방향만 선택하도록 제한한 뒤, 그 값만 Mapper로 전달해야 합니다.

잘못된 사용 예는 다음과 같습니다.

```xml
<select id="findByName" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    WHERE name = '${name}'
</select>
```

이 SQL은 문자열 값을 `${}`로 직접 치환합니다. `name` 값이 SQL 문자열에 그대로 들어가기 때문에 SQL 인젝션 위험이 생깁니다. 조건 값은 다음처럼 `#{}`로 바인딩해야 합니다.

```xml
<select id="findByName" resultType="com.example.domain.User">
    SELECT id, name, email
    FROM users
    WHERE name = #{name}
</select>
```

파라미터를 전달할 때는 먼저 값인지 SQL 구조인지 구분해야 합니다. 조건에 들어가는 데이터 값이면 `#{}`를 사용하고, 컬럼명이나 정렬 방향처럼 SQL 문장 구조를 바꿔야 하는 경우에만 `${}` 사용을 검토합니다.