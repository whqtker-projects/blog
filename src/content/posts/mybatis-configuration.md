---
title: MyBatis 환경 설정
series: mybatis-foundations
order: 4
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-foundations|MyBatis 기초]]
- 이전 글: [[sql-session-factory-and-sql-session|SqlSessionFactory와 SqlSession]]

## MyBatis 설정의 역할

MyBatis 설정은 `SqlSessionFactory`를 생성할 때 사용됩니다. 설정에는 데이터베이스 연결 정보, 트랜잭션 처리 방식, Mapper 등록 정보, 타입 별칭, MyBatis 동작 옵션 등이 포함됩니다.

SQL 자체는 Mapper XML에 작성하고, `mybatis-config.xml`은 MyBatis가 어떤 환경에서 동작할지, 어떤 Mapper를 읽을지, 어떤 방식으로 매핑할지를 지정합니다.

기본 설정 파일은 보통 `mybatis-config.xml` 형태로 작성합니다.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
    PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
    "https://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <!-- MyBatis 설정 요소가 이 안에 들어갑니다. -->
</configuration>
```

이 설정 파일을 바탕으로 `SqlSessionFactory`가 생성되고, 이후 SQL 실행에 필요한 `SqlSession`이 만들어집니다.

## 기본 설정 구조

MyBatis 설정 파일은 `configuration`을 루트 요소로 사용합니다. 그 아래에 MyBatis의 동작을 조정하는 설정 요소를 배치합니다.

자주 사용하는 설정 요소는 다음과 같습니다.

```xml
<configuration>
    <settings>
        <!-- MyBatis 동작 옵션 -->
    </settings>

    <typeAliases>
        <!-- Java 타입 별칭 -->
    </typeAliases>

    <environments default="development">
        <!-- 실행 환경과 데이터소스 -->
    </environments>

    <mappers>
        <!-- Mapper XML 등록 -->
    </mappers>
</configuration>
```

`settings`는 MyBatis의 기본 동작을 조정합니다. 예를 들어 컬럼명의 언더스코어를 Java 필드명의 카멜 케이스로 매핑할지 같은 옵션을 지정할 수 있습니다.

`typeAliases`는 긴 패키지명을 가진 Java 타입에 짧은 이름을 붙입니다. Mapper XML에서 `com.example.domain.User`처럼 전체 클래스명을 반복해서 쓰지 않고 `User` 같은 별칭을 사용할 수 있습니다.

`environments`는 데이터베이스 접속 환경을 정의합니다. 트랜잭션 매니저와 데이터소스 설정이 이 안에 들어갑니다.

`mappers`는 MyBatis가 읽을 Mapper XML을 등록합니다. Mapper XML에는 실제 SQL과 파라미터, 결과 매핑 정보가 작성됩니다.

## 환경 설정과 데이터소스

`environments`는 MyBatis가 사용할 데이터베이스 환경을 정의합니다. 하나의 설정 파일 안에 여러 환경을 둘 수 있고, `default` 속성으로 사용할 환경을 지정할 수 있습니다.

```xml
<environments default="development">
    <environment id="development">
        <transactionManager type="JDBC" />

        <dataSource type="POOLED">
            <property name="driver" value="com.mysql.cj.jdbc.Driver" />
            <property name="url" value="jdbc:mysql://localhost:3306/example" />
            <property name="username" value="root" />
            <property name="password" value="password" />
        </dataSource>
    </environment>
</environments>
```

`environment`는 하나의 실행 환경을 나타냅니다. `id`는 환경을 구분하는 이름입니다. 위 예제에서는 `development`라는 환경을 정의하고, `environments`의 `default` 속성에서 이 환경을 기본값으로 지정합니다.

`transactionManager`는 트랜잭션 처리 방식을 지정합니다. `JDBC`를 사용하면 MyBatis가 JDBC의 커밋과 롤백 기능을 사용합니다.

`dataSource`는 데이터베이스 연결 정보를 담습니다. `driver`, `url`, `username`, `password` 같은 값이 여기에 포함됩니다. `type="POOLED"`는 MyBatis가 제공하는 기본 커넥션 풀을 사용한다는 의미입니다.

개발 환경과 운영 환경을 나누고 싶다면 여러 `environment`를 정의하고, `default` 속성으로 사용할 환경을 선택할 수 있습니다.

Spring Boot와 함께 사용할 때는 데이터소스와 트랜잭션 관리를 Spring 설정에서 처리하는 경우가 많습니다. 이 경우 `environments`보다 `application.yml`의 데이터소스 설정과 MyBatis 연동 설정이 중심이 됩니다.

## Mapper 등록 방식

Mapper XML은 MyBatis가 실행할 SQL을 담고 있는 파일입니다. MyBatis가 Mapper XML을 읽으려면 설정 파일에 Mapper 위치를 등록해야 합니다.

리소스 경로를 직접 지정하는 방식은 다음과 같습니다.

```xml
<mappers>
    <mapper resource="mappers/UserMapper.xml" />
</mappers>
```

이 설정은 classpath 기준으로 `mappers/UserMapper.xml` 파일을 찾습니다. Mapper XML 파일이 `src/main/resources/mappers/UserMapper.xml`에 있다면 위와 같은 경로로 등록할 수 있습니다.

Mapper XML의 `namespace`와 Mapper 인터페이스 연결 방식은 이전 글에서 다룬 Mapper 호출 흐름과 같습니다. 이 글에서는 Mapper XML을 MyBatis 설정에 어떻게 등록하는지에 초점을 둡니다.

Mapper 파일이 많아지면 하나씩 등록하는 방식이 번거로울 수 있습니다. 이 경우 패키지 단위로 Mapper 인터페이스를 등록할 수 있습니다.

```xml
<mappers>
    <package name="com.example.mapper" />
</mappers>
```

이 방식은 지정한 패키지 아래의 Mapper 인터페이스를 대상으로 합니다. XML Mapper와 함께 사용할 때는 Mapper 인터페이스의 전체 경로와 XML의 `namespace`가 맞아야 합니다.

Spring Boot에서는 XML 파일 위치를 설정 값으로 지정하는 경우가 많습니다.

```yaml
mybatis:
  mapper-locations: classpath:mappers/**/*.xml
```

이 설정은 `classpath:mappers/` 아래의 XML Mapper 파일을 읽도록 지정합니다. Mapper 등록에서 중요한 점은 MyBatis가 SQL을 담은 Mapper XML을 읽을 수 있어야 한다는 것입니다. Mapper 인터페이스를 호출하더라도, 연결된 SQL을 찾지 못하면 실행할 구문을 찾을 수 없다는 오류가 발생합니다.

## 타입 별칭과 기본 동작 설정

`typeAliases`는 Java 타입에 짧은 이름을 붙이는 설정입니다. Mapper XML에서 매번 전체 패키지명을 작성하지 않아도 되도록 합니다.

예를 들어 다음과 같이 타입 별칭을 지정할 수 있습니다.

```xml
<typeAliases>
    <typeAlias alias="User" type="com.example.domain.User" />
</typeAliases>
```

이 설정을 사용하면 Mapper XML에서 `com.example.domain.User` 대신 `User`를 사용할 수 있습니다.

```xml
<select id="findById" resultType="User">
    SELECT id, name, email
    FROM users
    WHERE id = #{id}
</select>
```

도메인 객체가 많다면 패키지 단위로 별칭을 등록할 수도 있습니다.

```xml
<typeAliases>
    <package name="com.example.domain" />
</typeAliases>
```

이 경우 해당 패키지의 클래스들을 별칭으로 사용할 수 있습니다. 별칭은 Mapper XML에서 `parameterType`, `resultType` 같은 속성에 자주 사용됩니다.

`settings`는 MyBatis의 기본 동작을 조정합니다. 예를 들어 데이터베이스 컬럼명은 `user_name`처럼 언더스코어를 사용하고, Java 필드는 `userName`처럼 카멜 케이스를 사용하는 경우가 많습니다.

이때 `mapUnderscoreToCamelCase` 설정을 사용할 수 있습니다.

```xml
<settings>
    <setting name="mapUnderscoreToCamelCase" value="true" />
</settings>
```

이 설정을 사용하면 `user_name` 컬럼을 `userName` 필드에 매핑할 수 있습니다. 모든 매핑을 자동으로 해결하는 것은 아니지만, 컬럼명과 필드명 규칙이 일정한 경우 반복적인 매핑 설정을 줄일 수 있습니다.