---
title: SqlSessionFactory와 SqlSession
series: mybatis-foundations
order: 3
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-foundations|MyBatis 기초]]
- 이전 글: [[mybatis-vs-jdbc|JDBC와 MyBatis 비교]]
- 다음 글: [[mybatis-configuration|MyBatis 환경 설정]]

## SqlSessionFactory란

`SqlSessionFactory`는 MyBatis 설정 정보를 바탕으로 생성되며, `SqlSession`을 만드는 역할을 담당합니다.

MyBatis에서 SQL을 실행하려면 먼저 설정 정보가 로딩되어야 합니다. 데이터베이스 연결 정보, Mapper XML 위치, 타입 별칭, 설정 옵션 같은 정보가 MyBatis 설정에 포함됩니다. `SqlSessionFactory`는 이 설정 정보를 기반으로 만들어지고, SQL 실행에 사용할 `SqlSession`을 생성합니다.

`SqlSessionFactory`는 SQL을 직접 실행하지 않습니다. SQL 실행에 필요한 `SqlSession`을 생성하는 객체입니다. 생성된 `SqlSessionFactory`는 애플리케이션 실행 중 여러 `SqlSession`을 만들 때 사용됩니다.

`SqlSessionFactoryBuilder`는 설정 정보를 읽어 `SqlSessionFactory`를 생성합니다. 일반적으로 애플리케이션 시작 시점에 `SqlSessionFactory`를 만들고, 이후 SQL 실행이 필요할 때마다 `SqlSessionFactory`에서 `SqlSession`을 엽니다.

## SqlSession의 역할

`SqlSession`은 MyBatis에서 SQL 실행 단위를 담당하는 객체입니다. Mapper 객체를 가져오거나, SQL 구문의 식별자를 직접 지정해 실행할 수 있습니다.

Mapper 인터페이스를 사용하는 경우 `SqlSession`에서 Mapper 객체를 가져온 뒤 메서드를 호출합니다.

```java
UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
User user = userMapper.findById(1L);
```

`sqlSession.getMapper(UserMapper.class)`는 `UserMapper` 인터페이스에 대한 Mapper 객체를 반환합니다. 애플리케이션 코드는 Mapper 메서드를 호출하고, MyBatis는 해당 메서드와 연결된 SQL을 실행합니다.

`SqlSession`은 Mapper를 거치지 않고 SQL 구문의 식별자를 직접 전달해 실행할 수도 있습니다.

```java
User user = sqlSession.selectOne("com.example.UserMapper.findById", 1L);
```

이 방식에서는 Mapper 인터페이스 대신 SQL 구문의 식별자를 직접 전달합니다. `"com.example.UserMapper.findById"`는 Mapper XML의 `namespace`와 SQL 태그의 `id`를 조합한 값입니다.

Mapper 인터페이스를 사용하면 문자열로 SQL 구문 식별자를 직접 전달하지 않고, 메서드 호출로 데이터 접근 기능을 표현할 수 있습니다.

`SqlSession`은 SQL 실행뿐 아니라 트랜잭션 처리와 자원 관리에도 관여합니다. 직접 `SqlSession`을 사용할 때는 작업이 끝난 뒤 세션을 닫아야 하며, 변경 작업을 실행한 경우에는 커밋이나 롤백도 함께 처리해야 합니다.

## SqlSessionFactory 생성부터 Mapper 호출까지의 흐름

MyBatis에서 Mapper 메서드 호출이 SQL 실행으로 이어지기까지의 흐름은 `SqlSessionFactory` 생성, `SqlSession` 생성, Mapper 획득, Mapper 메서드 호출 순서로 이어집니다.

먼저 MyBatis 설정 정보를 읽어 `SqlSessionFactory`를 생성합니다.

```java
String resource = "mybatis-config.xml";

try (InputStream inputStream = Resources.getResourceAsStream(resource)) {
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
}
```

`mybatis-config.xml`에는 MyBatis 실행에 필요한 설정 정보가 들어갑니다. 이 글에서는 설정 파일의 세부 항목보다, 해당 설정을 바탕으로 `SqlSessionFactory`가 생성된다는 흐름만 다룹니다.

`SqlSessionFactory`가 준비되면 `openSession()`을 호출해 `SqlSession`을 엽니다. 열린 `SqlSession`에서 Mapper 객체를 가져오고, Mapper 메서드를 호출합니다.

```java
try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
    User user = userMapper.findById(1L);
}
```

Mapper 인터페이스는 다음과 같이 작성할 수 있습니다.

```java
public interface UserMapper {
    User findById(Long id);
}
```

`userMapper.findById(1L)` 호출은 단순한 Java 메서드 호출처럼 보이지만, MyBatis 내부에서는 Mapper 메서드와 연결된 SQL을 찾고 실행합니다. Mapper XML의 `namespace`와 SQL 태그의 `id`가 Mapper 메서드와 연결되는 방식은 앞 글에서 다룬 흐름과 같습니다.

호출 흐름을 단계로 보면 다음과 같습니다.

1. MyBatis 설정 정보를 읽어 `SqlSessionFactory`를 생성합니다.
2. `SqlSessionFactory.openSession()`으로 `SqlSession`을 엽니다.
3. `SqlSession.getMapper()`로 Mapper 객체를 가져옵니다.
4. Mapper 메서드를 호출합니다.
5. MyBatis가 Mapper 메서드와 연결된 SQL을 찾습니다.
6. 메서드에 전달된 값을 SQL 파라미터로 바인딩합니다.
7. SQL을 실행하고 결과를 객체로 매핑합니다.
8. 호출한 쪽에 결과 객체를 반환합니다.
9. 작업이 끝나면 `SqlSession`을 닫습니다.

`SqlSessionFactory`는 세션을 생성하는 출발점이고, `SqlSession`은 SQL 실행 단위를 다루는 객체입니다. Mapper 메서드는 애플리케이션 코드에서 SQL 실행을 요청하는 진입점으로 사용됩니다.

## 트랜잭션과 세션 생명주기

`SqlSession`을 직접 사용할 때는 세션을 여는 시점과 닫는 시점을 관리해야 합니다. `SqlSession`은 SQL 실행에 필요한 데이터베이스 연결과 관련되므로, 사용이 끝난 뒤 닫지 않으면 자원이 반환되지 않을 수 있습니다.

조회 작업만 수행하는 경우에는 `try-with-resources`로 세션을 열고 닫을 수 있습니다. 변경 작업을 실행하는 경우에는 커밋과 롤백을 함께 고려해야 합니다.

```java
SqlSession sqlSession = sqlSessionFactory.openSession();

try {
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

    userMapper.save(new User("kim", "kim@example.com"));

    sqlSession.commit();
} catch (Exception e) {
    sqlSession.rollback();
    throw e;
} finally {
    sqlSession.close();
}
```

이 코드에서는 변경 작업이 정상적으로 끝나면 `commit()`을 호출하고, 예외가 발생하면 `rollback()`을 호출합니다. 마지막에는 `close()`를 호출해 세션을 닫습니다.

`openSession()`으로 연 세션은 기본적으로 자동 커밋이 아닙니다. `insert`, `update`, `delete` 같은 변경 작업을 실행한 뒤에는 `commit()`을 호출해야 데이터베이스에 반영됩니다.

`SqlSession`을 직접 다룰 때 주의할 점은 다음과 같습니다.

- 변경 작업 실행 후 `commit()`을 누락하면 데이터베이스에 반영되지 않을 수 있습니다.
- 예외가 발생했는데 `rollback()`을 처리하지 않으면 트랜잭션 상태를 의도대로 되돌리지 못할 수 있습니다.
- `close()`를 호출하지 않으면 세션과 관련된 자원이 반환되지 않을 수 있습니다.
- `SqlSession`은 요청이나 작업 단위로 사용하고 닫아야 하며, 여러 요청에서 공유하는 방식으로 사용하지 않아야 합니다.

Spring과 함께 MyBatis를 사용할 때는 `SqlSessionTemplate`과 Spring 트랜잭션 관리가 세션 사용, 커밋, 롤백 흐름을 처리합니다. 이 경우 애플리케이션 코드에서 `SqlSession`을 직접 열고 닫는 일은 줄어듭니다.