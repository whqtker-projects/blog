---
title: JDBC와 MyBatis 비교
series: mybatis-foundations
order: 2
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-foundations|MyBatis 기초]]
- 이전 글: [[what-is-mybatis|MyBatis란 무엇인가]]
- 다음 글: [[sql-session-factory-and-sql-session|SqlSessionFactory와 SqlSession]]

## JDBC로 데이터베이스에 접근하는 방식

JDBC를 사용하면 Java 코드에서 데이터베이스 연결, SQL 실행, 결과 처리 과정을 직접 다룹니다. SQL을 문자열로 작성하고, `Connection`과 `PreparedStatement`를 사용해 데이터베이스에 전달한 뒤, 실행 결과를 `ResultSet`에서 꺼내 객체에 옮깁니다.

사용자 정보를 ID로 조회하는 코드는 다음과 같은 형태가 됩니다.

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

이 코드에서 개발자가 직접 처리하는 내용은 SQL 작성에만 머물지 않고, 데이터베이스 연결을 얻고, SQL 실행 객체를 만들고, 파라미터를 바인딩하고, 실행 결과를 읽고, 사용한 자원을 닫는 코드까지 함께 작성합니다.

조회 대상이 달라지면 SQL과 매핑 대상 객체는 바뀌지만, `Connection`, `PreparedStatement`, `ResultSet`을 다루는 구조는 비슷한 형태로 반복됩니다.

## 같은 기능을 MyBatis로 작성하면 달라지는 점

MyBatis를 사용해도 실행할 SQL은 개발자가 직접 작성합니다. 달라지는 부분은 SQL 실행 전후에 필요한 JDBC API 사용 코드입니다. 애플리케이션 코드는 Mapper 메서드를 호출하고, MyBatis는 해당 메서드와 연결된 SQL을 실행합니다.

같은 사용자 조회 기능은 Mapper 인터페이스와 XML 매핑 파일로 나누어 작성할 수 있습니다.

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

애플리케이션 코드는 Mapper 메서드를 호출합니다.

```java
User user = userMapper.findById(1L);
```

JDBC 코드에서는 `PreparedStatement`를 생성하고, `setLong()`으로 값을 바인딩하고, `ResultSet`에서 컬럼 값을 꺼내 `User` 객체를 직접 생성했습니다. MyBatis에서는 Mapper 메서드에 전달된 값이 SQL 파라미터로 바인딩되고, SQL 실행 결과가 `User` 객체로 매핑되어 반환됩니다.

이 차이 때문에 애플리케이션 코드에는 JDBC API 호출보다 Mapper 메서드 호출이 남습니다.

## JDBC와 MyBatis의 비교 기준

JDBC와 MyBatis의 차이는 SQL을 직접 작성하느냐가 아닙니다. 두 방식 모두 개발자가 실행할 SQL을 작성할 수 있습니다. 차이는 SQL 실행 전후의 반복적인 작업을 어디에서 처리하느냐에 있습니다.

| 비교 기준 | JDBC | MyBatis |
| --- | --- | --- |
| SQL 작성 위치 | Java 코드 안에 SQL 문자열을 작성합니다. | XML 매핑 파일이나 Mapper 어노테이션에 SQL을 작성합니다. |
| 파라미터 바인딩 | `PreparedStatement`의 `setLong()`, `setString()` 같은 메서드를 직접 호출합니다. | Mapper 메서드에 전달된 값이 SQL의 `#{}` 위치에 바인딩됩니다. |
| 결과 처리 | `ResultSet`에서 컬럼 값을 꺼내 객체에 직접 전달합니다. | 매핑 규칙에 따라 SQL 실행 결과가 객체로 변환됩니다. |
| 자원 처리 | `Connection`, `PreparedStatement`, `ResultSet`의 사용 범위를 직접 구성합니다. | SQL 실행에 필요한 `PreparedStatement`와 `ResultSet` 처리를 MyBatis가 담당합니다. |
| 코드에서 드러나는 관심사 | SQL 실행 절차가 Java 코드에 그대로 드러납니다. | 애플리케이션 코드는 Mapper 메서드 호출과 SQL 매핑 정보 중심으로 구성됩니다. |

표에서 보듯이 두 방식의 차이는 SQL 자체보다 SQL 실행을 둘러싼 코드의 위치에 있습니다. JDBC는 실행 절차가 Java 코드에 남고, MyBatis는 Mapper 메서드와 매핑 정보가 애플리케이션 코드의 중심이 됩니다.

## 어떤 상황에서 선택할 수 있는가

JDBC를 직접 사용할 때는 SQL 실행 과정 자체를 Java 코드에서 세밀하게 다뤄야 하는지 먼저 봐야 합니다. 테스트용 코드, 학습 예제, 프레임워크 없이 JDBC 동작을 직접 다뤄야 하는 코드에서는 JDBC API를 그대로 사용할 수 있습니다.

MyBatis는 SQL을 직접 관리해야 하지만, `Connection`, `PreparedStatement`, `ResultSet`을 다루는 코드까지 매번 작성하고 싶지 않을 때 사용할 수 있습니다. 복잡한 조회 SQL, 기존 SQL 활용, 명시적인 결과 매핑이 필요한 경우에는 Mapper와 XML 매핑 파일을 기준으로 데이터 접근 코드를 구성할 수 있습니다.

SQL 실행 절차를 Java 코드에 그대로 두어야 한다면 JDBC를 직접 사용할 수 있습니다. 실행할 SQL은 직접 관리하되 파라미터 바인딩, 결과 매핑, JDBC 자원 처리를 줄이고 싶다면 MyBatis를 사용할 수 있습니다.