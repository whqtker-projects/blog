---
title: MyBatis란 무엇인가
series: mybatis-foundations
order: 1
status: idea
---

관련 링크:

- 소속 시리즈: [[series_indexes/mybatis/mybatis-foundations|MyBatis 기초]]
- 다음 글: [[mybatis-vs-jdbc|JDBC와 MyBatis 비교]]

## MyBatis란

애플리케이션에서 데이터베이스를 사용하려면 SQL을 실행하고, 실행 결과를 객체로 옮기는 과정이 필요합니다. Java에서는 JDBC만으로도 이 작업을 처리할 수 있지만, 실제 코드에서는 연결 수립, SQL 실행, 결과 처리, 자원 반납 같은 코드가 반복됩니다.

MyBatis는 이러한 반복적인 작업을 줄여 주는 SQL Mapper 프레임워크입니다. 개발자가 SQL을 직접 작성하면, MyBatis는 SQL 실행 과정, 파라미터 바인딩, 실행 결과 매핑을 처리합니다.

MyBatis는 JPA 같은 ORM 프레임워크와 접근 방식이 다릅니다. JPA는 객체와 테이블의 매핑을 중심으로 동작하고, 객체 상태 변화를 바탕으로 SQL을 생성합니다. 반면 MyBatis에서는 SQL을 개발자가 직접 작성하고, 애플리케이션 코드는 Mapper 메서드를 호출해 해당 SQL을 실행합니다.

## JDBC 사용 시 발생하는 반복 코드

JDBC를 사용하면 데이터베이스 접근 과정을 직접 제어할 수 있습니다. 다만 쿼리 하나를 작성하더라도 반복되는 코드가 많아지게 됩니다.

JDBC를 통해 쿼리를 작성하는 경우 동작 과정은 다음과 같습니다.

1. `Connection`을 획득합니다.
2. SQL을 작성하고 `PreparedStatement`를 생성합니다.
3. SQL에 필요한 값을 바인딩합니다.
4. 쿼리를 실행합니다.
5. `ResultSet`에서 값을 꺼냅니다.
6. 조회 결과를 객체에 직접 매핑합니다.
7. 예외를 처리합니다.
8. 사용한 자원을 반납합니다.

사용자 정보를 조회하는 JDBC 코드는 대략 다음과 같은 형태가 됩니다.

```java
String sql = "SELECT id, name, email FROM users WHERE id = ?";

try (
    Connection connection = dataSource.getConnection();
    PreparedStatement statement = connection.prepareStatement(sql)
) {
    statement.setLong(1, id);

    try (ResultSet resultSet = statement.executeQuery()) {
        if (resultSet.next()) {
            User user = new User(
                resultSet.getLong("id"),
                resultSet.getString("name"),
                resultSet.getString("email")
            );

            return user;
        }
    }
}
```

JDBC API를 사용하기 위한 코드인 연결을 얻고, SQL 실행 객체를 만들고, 결과를 읽고, 자원을 닫는 흐름은 다른 쿼리에서도 비슷한 형태로 반복됩니다.

조회 결과를 객체로 옮기는 작업도 계속 발생합니다. SQL 실행 결과는 `ResultSet`으로 반환되므로, 개발자가 각 컬럼 값을 꺼내 객체 필드에 직접 전달해야 합니다. 조회 대상이 많아질수록 비슷한 매핑 코드가 여러 레포지토리에 반복됩니다.

MyBatis는 이 반복적인 작업 중 SQL 실행 과정과 결과 매핑을 대신 처리합니다.

## MyBatis의 기본 동작 방식

MyBatis의 기본 동작은 Mapper 메서드 호출에서 시작됩니다. 애플리케이션 코드는 SQL을 직접 실행하지 않고 Mapper 인터페이스의 메서드를 호출합니다.

```java
User user = userMapper.findById(1L);
```

이 호출이 발생하면 MyBatis는 Mapper 메서드와 연결된 SQL을 찾습니다. XML 매핑 파일을 사용하는 경우, Mapper 인터페이스의 전체 경로는 XML의 `namespace`와 연결되고, 메서드 이름은 SQL 태그의 `id`와 연결됩니다.

```java
public interface UserMapper {
    User findById(Long id);
}
```

```xml
<mapper namespace="com.example.UserMapper">
    <select id="findById" parameterType="long" resultType="com.example.User">
        SELECT id, name, email
        FROM users
        WHERE id = #{id}
    </select>
</mapper>
```

위 예제에서 `UserMapper.findById()` 메서드는 XML 매핑 파일의 `findById` SQL과 연결됩니다. 메서드에 전달된 `1L` 값은 SQL의 `#{id}` 자리에 바인딩되고, 조회 결과는 `User` 객체로 매핑됩니다.

MyBatis 내부에서는 다음 흐름으로 SQL이 실행됩니다.

1. Mapper 메서드가 호출됩니다.
2. MyBatis가 호출된 메서드와 연결된 SQL을 찾습니다.
3. 메서드에 전달된 값을 SQL 파라미터에 바인딩합니다.
4. JDBC를 사용해 SQL을 실행합니다.
5. 실행 결과를 지정된 객체 타입으로 매핑합니다.
6. 매핑된 객체를 호출한 쪽에 반환합니다.

개발자는 Mapper 메서드를 호출하는 형태로 데이터베이스에 접근합니다. 실제 SQL은 XML 매핑 파일이나 어노테이션에 정의된 내용을 기준으로 실행됩니다.

이 구조에서는 SQL 작성 책임과 SQL 실행 반복 처리 책임이 분리됩니다. SQL의 내용은 개발자가 직접 관리하고, JDBC 사용 과정에서 반복되는 실행 코드는 MyBatis가 담당합니다.

## 핵심 구성 요소

MyBatis를 이해하려면 `SqlSessionFactory`, `SqlSession`, Mapper 인터페이스, XML 매핑 파일의 역할을 구분해야 합니다.

### SqlSessionFactory

`SqlSessionFactory`는 `SqlSession`을 생성하는 팩토리입니다. MyBatis 설정 정보를 바탕으로 생성되며, 애플리케이션에서 SQL 실행에 필요한 세션을 만들 때 사용됩니다.

`SqlSessionFactory`에는 데이터베이스 연결 정보, Mapper 설정, 타입 매핑 설정 등이 반영됩니다. 한 번 생성된 뒤에는 여러 `SqlSession`을 생성하는 데 사용됩니다.

이름 그대로 `SqlSession`을 직접 실행하는 객체라기보다, SQL 실행에 사용할 `SqlSession`을 생성하는 객체입니다.

### SqlSession

`SqlSession`은 MyBatis에서 SQL 실행을 담당하는 핵심 객체입니다. Mapper 객체를 가져오거나, SQL 구문을 직접 지정해 실행할 수 있습니다.

Mapper 인터페이스를 사용할 경우 `SqlSession`에서 Mapper 객체를 얻을 수 있습니다.

```java
try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
    User user = userMapper.findById(1L);
}
```

`SqlSession`은 내부적으로 JDBC 연결을 사용해 SQL을 실행합니다. 트랜잭션 처리와 자원 관리에도 관여하므로, 사용 후에는 적절히 닫아야 합니다.

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

MyBatis는 어노테이션으로 SQL을 정의하는 방식도 지원합니다. 다만 SQL이 길어지거나 조건에 따라 동적으로 바뀌는 경우에는 XML 매핑 파일에서 SQL 구조를 더 명확하게 확인할 수 있습니다.

## MyBatis를 사용하기 좋은 경우

MyBatis는 SQL을 직접 작성하고 관리해야 하는 상황에서 사용할 수 있습니다. 단순한 CRUD보다 복잡한 조회 조건, 조인, 집계, 성능 최적화가 중요한 기능에서는 실행할 SQL이 명확하게 드러나는 구조가 필요할 수 있습니다.

### 복잡한 SQL을 직접 제어해야 하는 경우

업무 시스템에서는 한 테이블만 조회하는 쿼리보다 여러 테이블을 조인하고, 조건에 따라 조회 범위가 달라지는 쿼리가 자주 등장합니다. 통계성 조회나 관리자 화면의 검색 기능처럼 SQL의 형태가 복잡한 경우도 많습니다.

MyBatis를 사용하면 실행할 SQL을 개발자가 직접 작성합니다. 필요한 조인, 서브쿼리, 집계 함수, 데이터베이스별 SQL 문법을 SQL에 명시할 수 있습니다.

SQL 튜닝이 필요한 경우에도 실행할 SQL을 직접 작성하고 수정할 수 있습니다. 실행 계획을 확인한 뒤 조인 구조, 조건절, 인덱스 사용 여부를 고려해 쿼리 형태를 조정할 수 있습니다.

### 레거시 데이터베이스나 기존 SQL을 활용해야 하는 경우

이미 운영 중인 데이터베이스 구조에 맞춰 개발해야 하는 경우도 있습니다. 테이블 설계가 객체 모델과 잘 맞지 않거나, 기존에 사용하던 SQL이 많은 시스템에서는 SQL을 기준으로 데이터 접근 코드를 구성해야 할 수 있습니다.

MyBatis는 기존 SQL을 매핑 파일에 정의해 사용할 수 있습니다. 저장 프로시저나 복잡한 레거시 쿼리도 Mapper 메서드와 연결해 호출할 수 있습니다.

이런 환경에서는 SQL을 새로 추상화하기보다, 기존 데이터베이스 구조와 SQL을 명시적으로 다루는 방식이 코드 변경 범위를 줄일 수 있습니다.

### 쿼리 최적화와 결과 매핑을 명시적으로 관리해야 하는 경우

성능이 중요한 기능에서는 어떤 SQL이 실행되는지 확인할 수 있어야 합니다. MyBatis는 실행할 SQL을 개발자가 직접 작성하므로, 애플리케이션에서 사용하는 쿼리 구조가 코드와 매핑 파일에 명시적으로 남습니다.

조회 결과를 객체에 어떻게 매핑할지도 지정할 수 있습니다. 컬럼명과 필드명이 다르거나, 여러 테이블을 조인한 결과를 하나의 객체 구조로 받아야 하는 경우에는 `resultMap`을 사용해 매핑 정보를 세밀하게 지정할 수 있습니다.

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

복잡한 조회 결과를 다뤄야 하는 경우에는 `resultMap`에 매핑 정보를 명시해 SQL 실행 결과가 객체 구조로 변환되는 방식을 제어할 수 있습니다.