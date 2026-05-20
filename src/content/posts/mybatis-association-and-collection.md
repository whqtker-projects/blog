---
title: 연관 매핑(association, collection)
series: mybatis-mapping
order: 4
status: idea
---
관련 링크:
- 소속 시리즈: [[series_indexes/mybatis/mybatis-mapping|MyBatis 매핑]]
- 이전 글: [[mybatis-result-mapping|결과 매핑(resultType과 resultMap)]]

## 연관 매핑이 필요한 이유

SQL 조인 결과는 row 단위로 반환됩니다. 반면 자바 객체는 객체 안에 다른 객체를 참조하거나, 여러 객체를 컬렉션으로 가질 수 있습니다.

예를 들어 주문과 회원을 함께 조회하는 SQL은 다음과 같은 형태가 될 수 있습니다.

```sql
SELECT
    o.id AS order_id,
    o.order_date AS order_date,
    u.id AS user_id,
    u.name AS user_name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.id = #{id}
```

이 SQL의 결과는 하나의 row입니다. 하지만 자바 객체에서는 주문 객체 안에 회원 객체가 들어가는 구조로 표현할 수 있습니다.

```java
public class Order {
    private Long id;
    private LocalDateTime orderDate;
    private User user;
}
```

```java
public class User {
    private Long id;
    private String name;
}
```

단순한 `resultType`은 컬럼명과 객체의 프로퍼티 이름을 기준으로 값을 매핑합니다. `order_id`, `order_date`, `user_id`, `user_name`처럼 여러 객체의 컬럼이 섞여 있으면, 어떤 컬럼을 `Order`에 넣고 어떤 컬럼을 `User`에 넣을지 직접 지정해야 합니다.

이때 `resultMap`의 `association`과 `collection`을 사용합니다. `association`은 하나의 연관 객체를 매핑할 때 사용하고, `collection`은 여러 객체를 컬렉션으로 매핑할 때 사용합니다.

## association으로 단일 객체 매핑하기

`association`은 하나의 객체 안에 포함된 단일 연관 객체를 매핑할 때 사용합니다. 1:1 관계나 N:1 관계에서 사용할 수 있습니다.

주문 하나가 회원 하나를 참조하는 구조를 예로 들 수 있습니다.

```java
public class Order {
    private Long id;
    private LocalDateTime orderDate;
    private User user;
}
```

```java
public class User {
    private Long id;
    private String name;
}
```

Mapper 메서드는 주문 하나를 조회하도록 작성합니다.

```java
public interface OrderMapper {
    Order findById(Long id);
}
```

XML Mapper에서는 조인 SQL과 함께 `resultMap`을 정의합니다.

```xml
<resultMap id="orderResultMap" type="com.example.domain.Order">
    <id property="id" column="order_id" />
    <result property="orderDate" column="order_date" />

    <association property="user" javaType="com.example.domain.User">
        <id property="id" column="user_id" />
        <result property="name" column="user_name" />
    </association>
</resultMap>

<select id="findById" resultMap="orderResultMap">
    SELECT
        o.id AS order_id,
        o.order_date AS order_date,
        u.id AS user_id,
        u.name AS user_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = #{id}
</select>
```

`Order` 객체의 기본 컬럼은 `resultMap`의 바깥쪽에서 매핑합니다.

```xml
<id property="id" column="order_id" />
<result property="orderDate" column="order_date" />
```

`Order` 안에 들어갈 `User` 객체는 `association`으로 매핑합니다.

```xml
<association property="user" javaType="com.example.domain.User">
    <id property="id" column="user_id" />
    <result property="name" column="user_name" />
</association>
```

`property="user"`는 `Order` 객체의 `user` 프로퍼티를 의미합니다. `javaType`에는 해당 프로퍼티에 들어갈 객체 타입을 지정합니다. 내부의 `id`, `result`는 `User` 객체의 프로퍼티와 SQL 컬럼을 연결합니다.

이 설정을 사용하면 하나의 조인 결과에서 `Order` 객체와 그 안의 `User` 객체가 함께 구성됩니다.

## collection으로 목록 매핑하기

`collection`은 하나의 객체가 여러 하위 객체를 가질 때 사용합니다. 1:N 관계를 객체의 컬렉션으로 표현할 때 사용합니다.

예를 들어 회원 하나가 여러 주문을 가지는 구조를 생각할 수 있습니다.

```java
public class User {
    private Long id;
    private String name;
    private List<Order> orders;
}
```

```java
public class Order {
    private Long id;
    private LocalDateTime orderDate;
}
```

회원과 주문을 함께 조회하는 SQL은 다음과 같이 작성할 수 있습니다.

```sql
SELECT
    u.id AS user_id,
    u.name AS user_name,
    o.id AS order_id,
    o.order_date AS order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.id = #{id}
```

이 SQL은 회원 한 명에 주문이 여러 개 있으면 여러 row를 반환합니다. 각 row에는 같은 회원 정보가 반복되고, 주문 정보만 달라집니다.

이 결과를 `User` 객체 하나와 `orders` 컬렉션으로 묶으려면 `collection`을 사용합니다.

```xml
<resultMap id="userWithOrdersResultMap" type="com.example.domain.User">
    <id property="id" column="user_id" />
    <result property="name" column="user_name" />

    <collection property="orders" ofType="com.example.domain.Order">
        <id property="id" column="order_id" />
        <result property="orderDate" column="order_date" />
    </collection>
</resultMap>

<select id="findUserWithOrders" resultMap="userWithOrdersResultMap">
    SELECT
        u.id AS user_id,
        u.name AS user_name,
        o.id AS order_id,
        o.order_date AS order_date
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id = #{id}
</select>
```

`collection`의 `property`는 컬렉션이 들어갈 프로퍼티 이름입니다. 위 예제에서는 `User` 객체의 `orders` 프로퍼티에 주문 목록이 들어갑니다.

```xml
<collection property="orders" ofType="com.example.domain.Order">
```

`ofType`에는 컬렉션 안에 들어갈 요소 타입을 지정합니다. `List<Order>`라면 `ofType`에는 `Order` 타입을 지정합니다.

`collection` 내부에서는 주문 객체의 컬럼과 프로퍼티를 매핑합니다.

```xml
<id property="id" column="order_id" />
<result property="orderDate" column="order_date" />
```

조인 결과가 여러 row로 반환되더라도, MyBatis는 `id` 매핑을 기준으로 같은 상위 객체인지 판단하고 하위 객체를 컬렉션에 추가합니다.

## 연관 매핑에서 주의할 점

조인 기반 연관 매핑에서는 하나의 객체를 만들기 위해 여러 row를 읽을 수 있습니다. 특히 1:N 관계에서는 상위 객체의 컬럼이 row마다 반복됩니다.

예를 들어 회원 한 명에게 주문이 세 개 있다면 조인 결과는 세 row가 됩니다. 각 row에는 같은 회원 정보가 반복되고, 주문 정보만 달라집니다. MyBatis는 `resultMap`의 `id` 매핑을 기준으로 같은 상위 객체인지 판단하고, 하위 객체를 컬렉션에 추가합니다.

이때 `id` 매핑이 빠지거나 잘못 지정되면 같은 상위 객체가 중복으로 만들어지거나, 컬렉션 매핑이 기대한 형태로 동작하지 않을 수 있습니다.

연관 매핑에는 중첩 select 방식도 있습니다. `association`이나 `collection`에서 별도 select를 지정하면, 상위 객체를 조회한 뒤 해당 객체의 식별 값을 사용해 연관 객체를 다시 조회합니다.

```xml
<collection property="orders" column="id" select="findOrdersByUserId" />
```

이 방식은 SQL을 분리해서 관리할 수 있지만, 여러 상위 객체를 조회하는 경우 각 객체마다 연관 객체 조회 SQL이 추가로 실행될 수 있습니다. 조회 대상이 많아지면 SQL 실행 횟수가 늘어나는 N+1 형태의 문제가 생길 수 있습니다.

조인 결과 매핑은 한 번의 SQL 결과를 객체 구조로 묶는 방식입니다. 중첩 select 방식은 상위 객체를 조회한 뒤 연관 객체 조회 SQL을 추가로 실행합니다. 두 방식은 SQL 실행 횟수와 조회 범위가 달라지므로, 연관 데이터를 항상 함께 사용할지부터 확인해야 합니다.