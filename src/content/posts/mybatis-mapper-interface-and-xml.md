---
title: Mapper 인터페이스와 XML
series: mybatis-mapping
order: 1
status: idea
---

관련 링크:

- 소속 시리즈: [[series_indexes/mybatis/mybatis-mapping|MyBatis 매핑]]
- 다음 글: [[mybatis-parameter-binding|파라미터 바인딩과 #{} 그리고 ${}]]

## Mapper란

Mapper는 애플리케이션 코드에서 SQL 실행을 메서드 호출 형태로 표현하게 해 주는 MyBatis 구성 요소입니다.

JDBC를 직접 사용하는 DAO에서는 SQL 실행을 위해 `Connection`, `PreparedStatement`, `ResultSet`을 직접 다룹니다. SQL을 실행한 뒤에는 `ResultSet`에서 컬럼 값을 꺼내 객체에 직접 옮겨야 합니다.

MyBatis에서는 데이터 접근 코드가 Mapper 인터페이스와 XML Mapper로 나뉩니다. Mapper 인터페이스에는 데이터 접근 메서드를 정의하고, XML Mapper에는 실제 실행할 SQL을 작성합니다. 애플리케이션 코드는 Mapper 메서드를 호출하고, MyBatis는 해당 메서드와 연결된 SQL을 찾아 실행합니다.

Mapper는 SQL 자체를 대체하지 않습니다. SQL은 XML Mapper나 어노테이션에 그대로 존재합니다. Mapper는 Java 메서드 호출과 SQL statement를 연결하는 역할을 합니다.

## Mapper 인터페이스와 XML 작성 방식

Mapper 인터페이스에는 데이터 접근 기능을 메서드로 정의합니다.

```java
public interface UserMapper {
    User findById(Long id);

    List<User> findAll();

    int insert(User user);
}
```

이 인터페이스에는 SQL 실행 코드가 없습니다. 각 메서드는 XML Mapper에 정의된 SQL statement와 연결됩니다.

XML Mapper에는 실제 실행할 SQL을 작성합니다.

```xml
<mapper namespace="com.example.mapper.UserMapper">
    <select id="findById" parameterType="long" resultType="com.example.domain.User">
        SELECT id, name, email
        FROM users
        WHERE id = #{id}
    </select>

    <select id="findAll" resultType="com.example.domain.User">
        SELECT id, name, email
        FROM users
    </select>

    <insert id="insert" parameterType="com.example.domain.User">
        INSERT INTO users (name, email)
        VALUES (#{name}, #{email})
    </insert>
</mapper>
```

`select`, `insert` 같은 태그는 실행할 SQL의 종류를 나타냅니다. 각 태그의 `id`는 Mapper 인터페이스의 메서드 이름과 연결됩니다.

애플리케이션 코드는 Mapper 인터페이스를 주입받거나 `SqlSession`에서 가져온 뒤 메서드를 호출합니다.

```java
User user = userMapper.findById(1L);
```

이 코드는 일반적인 Java 메서드 호출처럼 보이지만, MyBatis는 `findById` 메서드와 연결된 SQL statement를 찾아 실행합니다.

## 인터페이스와 XML의 연결 기준

앞의 예제에서 Mapper 인터페이스와 XML Mapper는 `namespace`, SQL 태그의 `id`, 메서드의 파라미터와 반환 타입을 기준으로 연결됩니다.

XML Mapper의 `namespace`는 Mapper 인터페이스의 전체 경로와 맞아야 합니다.

```xml
<mapper namespace="com.example.mapper.UserMapper">
```

이 설정은 `com.example.mapper.UserMapper` 인터페이스와 XML Mapper를 연결합니다.

SQL 태그의 `id`는 Mapper 인터페이스의 메서드 이름과 맞아야 합니다. 예를 들어 `UserMapper` 인터페이스의 `findById()` 메서드는 XML Mapper에서 `id="findById"`인 SQL statement와 연결됩니다.

메서드에 전달된 값은 SQL 파라미터로 전달됩니다. 앞의 예제에서는 `findById(1L)`로 전달한 값이 SQL의 `#{id}` 위치에 바인딩됩니다.

SQL 실행 결과는 메서드의 반환 타입에 맞춰 매핑됩니다. `findById()`의 반환 타입이 `User`이면 조회 결과는 `User` 객체로 반환됩니다. `findAll()`처럼 반환 타입이 `List<User>`이면 SQL 실행 결과의 각 row가 `User` 객체로 매핑되고, 전체 결과는 리스트로 반환됩니다.

## Mapper 메서드 호출 흐름

Mapper 메서드는 인터페이스에 선언되어 있지만, 개발자가 직접 구현 클래스를 작성하지 않습니다. MyBatis는 Mapper 인터페이스를 기반으로 프록시 객체를 만들고, 메서드 호출을 SQL statement 실행으로 연결합니다.

애플리케이션 코드에서 Mapper 메서드를 호출합니다.

```java
User user = userMapper.findById(1L);
```

이 호출이 발생하면 MyBatis는 호출된 Mapper 인터페이스의 전체 경로와 메서드 이름을 조합해 statement id를 만듭니다.

```text
com.example.mapper.UserMapper.findById
```

이 statement id는 XML Mapper의 `namespace`와 SQL 태그의 `id`를 조합한 값입니다. MyBatis는 이 값을 기준으로 등록된 SQL statement를 찾습니다.

Mapper 메서드 호출은 내부적으로 `SqlSession`의 SQL 실행 메서드 호출로 이어집니다. 단건 조회 메서드는 `selectOne` 흐름으로 이어지고, 목록 조회 메서드는 `selectList` 흐름으로 이어집니다.

```java
User user = sqlSession.selectOne("com.example.mapper.UserMapper.findById", 1L);
```

```java
List<User> users = sqlSession.selectList("com.example.mapper.UserMapper.findAll");
```

애플리케이션 코드에서 직접 `selectOne()`이나 `selectList()`를 호출하지 않아도, Mapper 프록시가 호출된 메서드에 맞는 statement id를 찾고 `SqlSession`에 SQL 실행을 위임합니다.

변경 작업도 같은 방식으로 연결됩니다. `insert()` 메서드를 호출하면 MyBatis는 `com.example.mapper.UserMapper.insert` statement를 찾고, 메서드에 전달된 `User` 객체의 값을 SQL 파라미터로 사용합니다. 실행 결과로는 영향을 받은 row 수를 반환할 수 있습니다.