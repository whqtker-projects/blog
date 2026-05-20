---
title: MyBatis란 무엇인가
series: mybatis-foundations
order: 1
status: draft
---

관련 링크:

- 소속 시리즈: [[series_indexes/mybatis/mybatis-foundations|MyBatis 기초]]
- 다음 글: [[mybatis-vs-jdbc|JDBC와 MyBatis 비교]]

## MyBatis란

MyBatis는 개발자가 작성한 SQL과 Java 객체를 연결해 주는 Persistence Framework입니다. SQL 실행 결과를 객체에 매핑하고, 객체의 값을 SQL 파라미터로 바인딩하는 역할을 하므로 SQL Mapper 프레임워크라고도 부릅니다.

애플리케이션에서 데이터베이스를 사용하려면 SQL을 실행하고, 실행 결과를 객체로 옮기는 과정이 필요합니다. Java에서는 JDBC만으로도 이 작업을 처리할 수 있지만, 연결 수립, SQL 실행, 결과 처리, 자원 반납 같은 코드가 반복됩니다.

MyBatis는 이러한 반복적인 작업 중 SQL 실행 과정, 파라미터 바인딩, 실행 결과 매핑을 처리합니다. 개발자는 실행할 SQL을 직접 작성하고, 애플리케이션 코드는 Mapper 메서드를 호출해 해당 SQL을 실행합니다.

JPA 같은 ORM 프레임워크는 객체와 테이블의 매핑을 중심으로 동작합니다. 반면 MyBatis는 SQL을 중심으로 동작합니다. SQL은 XML 매핑 파일이나 어노테이션에 정의되고, MyBatis는 해당 SQL을 실행한 뒤 결과를 객체에 매핑합니다.

## MyBatis의 기본 동작 방식

MyBatis의 기본 동작은 Mapper 메서드 호출에서 시작됩니다. 애플리케이션 코드는 SQL 실행 코드를 직접 작성하지 않고 Mapper 인터페이스의 메서드를 호출합니다.

```java
User user = userMapper.findById(1L);
```

Mapper 인터페이스에는 SQL을 호출할 메서드를 정의합니다.

```java
public interface UserMapper {
    User findById(Long id);
}
```

XML 매핑 파일에는 Mapper 메서드와 연결될 SQL을 작성합니다.

```xml
<mapper namespace="com.example.UserMapper">
    <select id="findById" parameterType="long" resultType="com.example.User">
        SELECT id, name, email
        FROM users
        WHERE id = #{id}
    </select>
</mapper>
```

여기서 `namespace`는 Mapper 인터페이스의 전체 경로이며, SQL 태그의 `id`는 Mapper 인터페이스의 메서드 이름으로 설정해야 합니다.

위 예제에서 `UserMapper.findById()` 메서드는 `id`가 `findById` 인 쿼리와 연결됩니다. 메서드에 전달된 `1L` 값은 SQL의 `#{id}` 자리에 바인딩되고, 조회 결과는 `User` 객체로 매핑됩니다.

MyBatis는 내부적으로 `PreparedStatement`를 사용해 SQL을 실행합니다. 개발자가 `PreparedStatement`를 직접 생성하거나 `setLong()`, `setString()` 같은 메서드로 파라미터를 직접 설정하지 않아도, Mapper 메서드에 전달된 값이 SQL의 `#{}` 위치에 바인딩됩니다.

![[Pasted image 20260520102211.png]]

MyBatis 내부에서는 다음 흐름으로 SQL이 실행됩니다.

1. Mapper 메서드가 호출됩니다.
2. MyBatis가 호출된 메서드와 연결된 SQL을 찾습니다.
3. 메서드에 전달된 값을 SQL 파라미터에 바인딩합니다.
4. JDBC를 사용해 SQL을 실행합니다.
5. 실행 결과를 지정된 객체 타입으로 매핑합니다.
6. 매핑된 객체를 호출한 쪽에 반환합니다.

Mapper 메서드에 전달되는 값은 DTO, `Map`, `List`, 기본형, `String` 같은 형태가 될 수 있습니다. 실행 결과도 DTO, `Map`, 기본형, `String` 같은 형태로 받을 수 있으며, 컬럼과 필드의 대응 관계가 필요한 경우에는 XML 매핑 파일에 결과 매핑 정보를 지정합니다.

## 핵심 구성 요소

MyBatis의 주요 구성 요소는 `SqlSessionFactory`, `SqlSession`, Mapper 인터페이스, XML 매핑 파일입니다.

### SqlSessionFactory

`SqlSessionFactory`는 `SqlSession`을 생성하는 팩토리입니다. MyBatis 설정 정보를 바탕으로 생성되며, 애플리케이션에서 SQL 실행에 필요한 세션을 만들 때 사용됩니다.

`SqlSessionFactory`에는 데이터베이스 연결 정보, Mapper 설정, 타입 매핑 설정 등이 반영됩니다. 한 번 생성된 뒤에는 여러 `SqlSession`을 생성하는 데 사용됩니다.

`SqlSessionFactory`는 SQL을 직접 실행하지 않습니다. SQL 실행에 사용할 `SqlSession`을 생성하는 역할을 맡습니다.

Spring Boot와 함께 사용할 때는 `mybatis-config.xml`을 직접 작성하기보다 `application.properties`나 `application.yml`에서 Mapper 위치, 설정 파일 위치, 타입 별칭 같은 값을 지정하는 경우가 많습니다.

### SqlSession

`SqlSession`은 MyBatis에서 SQL 실행을 담당하는 객체입니다. Mapper 객체를 가져오거나, SQL 구문을 직접 지정해 실행할 수 있습니다.

Mapper 인터페이스를 사용할 경우 `SqlSession`에서 Mapper 객체를 얻을 수 있습니다.

```java
try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
    User user = userMapper.findById(1L);
}
```

`SqlSession`은 내부적으로 JDBC 연결을 사용해 SQL을 실행합니다. 트랜잭션 처리와 자원 관리에도 관여하므로, 사용 후에는 닫아야 합니다.

Spring과 함께 사용할 때는 `SqlSessionTemplate`이나 Mapper 스캔 설정을 사용하는 경우가 많습니다. 이 경우 애플리케이션 코드에서 `SqlSession`을 직접 다루는 일은 줄어듭니다. 다만 MyBatis 내부에서 SQL 실행 단위를 담당한다는 점은 동일합니다.

### Mapper 인터페이스

Mapper 인터페이스는 애플리케이션 코드에서 SQL을 메서드 형태로 호출할 수 있게 해 줍니다.

```java
public interface UserMapper {
    User findById(Long id);

    List<User> findAll();

    void save(User user);
}
```

이 인터페이스 자체에는 SQL 실행 코드가 없습니다. 각 메서드는 XML 매핑 파일이나 어노테이션에 정의된 SQL과 연결됩니다.

Mapper 인터페이스를 사용하면 애플리케이션 코드는 데이터 접근 기능을 메서드 호출로 표현할 수 있습니다. SQL은 매핑 정보에서 관리되고, Java 코드는 Mapper 메서드를 호출하는 형태로 데이터베이스 작업을 요청합니다.

### XML 매핑 파일

XML 매핑 파일은 Mapper 메서드와 실제 SQL을 연결하는 설정 파일입니다. `select`, `insert`, `update`, `delete` 같은 태그를 사용해 SQL을 정의합니다.

```xml
<mapper namespace="com.example.UserMapper">
    <select id="findAll" resultType="com.example.User">
        SELECT id, name, email
        FROM users
    </select>

    <insert id="save" parameterType="com.example.User">
        INSERT INTO users (name, email)
        VALUES (#{name}, #{email})
    </insert>
</mapper>
```

`namespace`는 연결할 Mapper 인터페이스를 나타냅니다. 각 SQL 태그의 `id`는 Mapper 인터페이스의 메서드 이름과 대응됩니다.

XML 매핑 파일을 사용하면 SQL을 Java 코드 밖에서 관리할 수 있습니다. 복잡한 조인, 동적 SQL, 세밀한 결과 매핑이 필요한 경우에는 XML에 SQL과 매핑 정보를 분리해 둘 수 있습니다.

MyBatis는 어노테이션으로 SQL을 정의하는 방식도 지원합니다. SQL이 짧고 단순한 경우에는 어노테이션으로 Mapper 메서드에 SQL을 직접 작성할 수 있습니다.

```java
public interface UserMapper {

    @Select("SELECT id, name, email FROM users WHERE id = #{id}")
    User findById(Long id);
}
```

다만 SQL이 길어지거나 조건에 따라 동적으로 바뀌는 경우에는 Java 코드 안에서 SQL 구조를 읽고 수정하기가 번거로워질 수 있습니다. 이 경우 XML 매핑 파일에 SQL을 분리해 두면 SQL과 매핑 정보를 별도로 관리할 수 있습니다.

## SQL 매핑과 결과 매핑

MyBatis는 SQL 실행 결과를 객체에 매핑합니다. JDBC를 직접 사용할 때는 `ResultSet`에서 컬럼 값을 꺼내 DTO나 도메인 객체에 직접 전달해야 하지만, MyBatis는 매핑 규칙에 따라 실행 결과를 객체로 변환합니다.

컬럼명과 필드명이 같으면 기본 매핑으로 처리할 수 있습니다. 컬럼명과 필드명이 다르거나 여러 테이블을 조인한 결과를 객체로 받아야 하는 경우에는 `resultMap`을 사용할 수 있습니다.

```xml
<resultMap id="userResultMap" type="com.example.User">
    <id property="id" column="user_id" />
    <result property="name" column="user_name" />
    <result property="email" column="email" />
</resultMap>

<select id="findById" resultMap="userResultMap">
    SELECT user_id, user_name, email
    FROM users
    WHERE user_id = #{id}
</select>
```

이 설정에서는 `user_id` 컬럼이 `User` 객체의 `id` 필드에 매핑되고, `user_name` 컬럼이 `name` 필드에 매핑됩니다. SQL 결과 컬럼과 객체 필드의 대응 관계를 XML에서 직접 지정하는 구조입니다.

`resultMap`을 사용하면 SQL 실행 결과가 객체 구조로 변환되는 방식을 직접 지정할 수 있습니다. 조인 결과처럼 단순한 필드명 매칭만으로 처리하기 어려운 경우에는 매핑 정보를 별도로 작성해 결과 객체를 구성합니다.

## 동적 SQL

MyBatis는 조건에 따라 SQL 일부를 조립하는 동적 SQL을 지원합니다. 검색 조건이 있을 때만 `WHERE` 절에 조건을 추가하거나, 전달된 값에 따라 정렬 조건을 바꾸는 식으로 사용할 수 있습니다.

```xml
<select id="findUsers" resultType="com.example.User">
    SELECT id, name, email
    FROM users
    <where>
        <if test="name != null">
            name = #{name}
        </if>
        <if test="email != null">
            AND email = #{email}
        </if>
    </where>
</select>
```

위 예제에서는 `name` 값이 있을 때만 `name = #{name}` 조건이 추가됩니다. `email` 값이 있을 때는 `email = #{email}` 조건이 함께 추가됩니다.

MyBatis는 SQL을 직접 작성하는 구조를 유지하면서도, 조건에 따라 SQL 일부를 조합할 수 있는 기능을 제공합니다.