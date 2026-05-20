---
title: "스프링의 트랜잭션 추상화"
series: spring-aop-and-transactions
order: 3
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-aop-and-transactions|스프링 AOP와 트랜잭션]]
- 이전 글: [[proxy-based-aop-in-spring|스프링의 프록시 기반 AOP]]
- 다음 글: [[transaction-propagation-and-isolation|트랜잭션 전파와 격리 수준]]

## 트랜잭션 추상화가 필요한 이유

트랜잭션은 여러 데이터 변경 작업을 하나의 작업 단위로 묶는 기능입니다. 작업이 모두 정상적으로 끝나면 커밋하고, 중간에 문제가 발생하면 롤백해서 이전 상태로 되돌립니다.

데이터 접근 기술마다 트랜잭션을 다루는 방식은 다릅니다. JDBC를 직접 사용할 때는 `Connection`을 기준으로 자동 커밋을 끄고, 작업이 끝난 뒤 `commit()`이나 `rollback()`을 호출합니다.

```java
Connection connection = dataSource.getConnection();

try {
    connection.setAutoCommit(false);

    // SQL 실행

    connection.commit();
} catch (Exception e) {
    connection.rollback();
    throw e;
} finally {
    connection.close();
}
```

스프링 없이 JPA를 직접 사용할 때는 `EntityTransaction`을 기준으로 트랜잭션을 시작하고 종료할 수 있습니다.

```java
EntityTransaction transaction = entityManager.getTransaction();

try {
    transaction.begin();

    // 엔티티 변경

    transaction.commit();
} catch (Exception e) {
    transaction.rollback();
    throw e;
}
```

두 방식 모두 트랜잭션 경계를 다루지만, 사용하는 API가 다릅니다. 애플리케이션 코드가 JDBC의 `Connection`이나 JPA의 `EntityTransaction`에 직접 의존하면, 데이터 접근 기술이 바뀔 때 트랜잭션 처리 코드도 함께 바뀝니다.

스프링은 트랜잭션 처리 방식을 공통 인터페이스로 추상화합니다. 애플리케이션은 구체적인 트랜잭션 API에 직접 의존하지 않고, 스프링의 트랜잭션 추상화를 통해 트랜잭션 경계를 처리할 수 있습니다.

## PlatformTransactionManager

`PlatformTransactionManager`는 스프링의 명령형 트랜잭션 관리에서 사용하는 핵심 인터페이스입니다. 트랜잭션을 시작하고, 정상 종료 시 커밋하고, 실패 시 롤백하는 작업을 공통 메서드로 제공합니다.

```java
public interface PlatformTransactionManager extends TransactionManager {

    TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException;

    void commit(TransactionStatus status) throws TransactionException;

    void rollback(TransactionStatus status) throws TransactionException;
}
```

`getTransaction()`은 트랜잭션을 시작하거나, 이미 존재하는 트랜잭션이 있다면 그 트랜잭션에 참여합니다. 이때 `TransactionDefinition`에는 전파 방식, 격리 수준, 타임아웃, 읽기 전용 여부 같은 트랜잭션 설정이 들어갑니다.

`commit()`은 트랜잭션을 정상 종료할 때 호출됩니다. `rollback()`은 작업 중 문제가 발생했을 때 트랜잭션을 되돌릴 때 호출됩니다.

스프링이 트랜잭션을 추상화한다는 말은 애플리케이션이 항상 같은 트랜잭션 구현체를 사용한다는 뜻이 아닙니다. 데이터 접근 기술에 따라 실제 구현체는 달라질 수 있습니다. 다만 스프링이 바라보는 트랜잭션 경계는 `PlatformTransactionManager` 인터페이스로 통일됩니다.

## 트랜잭션 매니저 구현체

`PlatformTransactionManager`는 인터페이스입니다. 실제 트랜잭션 처리는 사용하는 데이터 접근 기술에 맞는 구현체가 담당합니다.

JDBC 기반 트랜잭션에서는 `DataSourceTransactionManager`를 사용할 수 있습니다. 이 구현체는 `DataSource`에서 가져온 JDBC `Connection`을 기준으로 트랜잭션을 관리합니다.

```java
@Bean
PlatformTransactionManager transactionManager(DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}
```

JPA 기반 트랜잭션에서는 `JpaTransactionManager`를 사용할 수 있습니다. 이 구현체는 JPA의 `EntityManagerFactory`를 기준으로 트랜잭션을 관리합니다.

```java
@Bean
PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
    return new JpaTransactionManager(entityManagerFactory);
}
```

두 구현체는 내부에서 다루는 자원이 다릅니다. `DataSourceTransactionManager`는 JDBC `Connection`을 기준으로 동작하고, `JpaTransactionManager`는 JPA `EntityManager`와 연결된 트랜잭션을 기준으로 동작합니다.

하지만 스프링의 트랜잭션 처리 흐름에서는 둘 다 `PlatformTransactionManager`로 다뤄집니다. 이 때문에 트랜잭션을 시작하고 커밋하거나 롤백하는 상위 흐름은 동일한 인터페이스를 기준으로 구성할 수 있습니다.

Spring Boot를 사용하면 데이터 접근 기술과 설정에 따라 적절한 트랜잭션 매니저가 자동 구성될 수 있습니다. 여기서는 트랜잭션 매니저 구현체가 어떤 자원을 기준으로 동작하는지에 초점을 둡니다.

## @Transactional 동작 흐름

`@Transactional`은 선언적 트랜잭션을 적용할 때 사용하는 어노테이션입니다. 서비스 메서드에 `@Transactional`을 붙이면 메서드 안에서 트랜잭션 시작, 커밋, 롤백 코드를 직접 작성하지 않아도 됩니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    validate(request);
    orderRepository.save(request.toEntity());
}
```

이 메서드에는 트랜잭션 처리 코드가 직접 보이지 않습니다. 스프링은 AOP 프록시를 사용해 메서드 실행 전후에 트랜잭션 처리를 적용합니다.

호출 흐름은 다음과 같습니다.

1. 클라이언트가 `@Transactional`이 적용된 메서드를 호출합니다.
2. 호출이 대상 객체로 바로 가지 않고 트랜잭션 프록시로 들어갑니다.
3. 프록시는 `PlatformTransactionManager`를 사용해 트랜잭션을 시작합니다.
4. 프록시는 대상 메서드를 호출합니다.
5. 대상 메서드가 정상 종료되면 트랜잭션을 커밋합니다.
6. 대상 메서드 실행 중 롤백 대상 예외가 발생하면 트랜잭션을 롤백합니다.

이를 코드 흐름으로 단순화하면 다음과 비슷합니다.

```java
TransactionStatus status = transactionManager.getTransaction(transactionDefinition);

try {
    Object result = targetMethod.invoke();
    transactionManager.commit(status);
    return result;
} catch (Throwable e) {
    if (isRollbackTarget(e)) {
        transactionManager.rollback(status);
    } else {
        transactionManager.commit(status);
    }

    throw e;
}
```

여기서 `isRollbackTarget(e)`는 예외가 롤백 대상인지 판단하는 과정을 단순화한 표현입니다. 실제 스프링 내부 구현은 더 복잡하지만, 핵심 흐름은 같습니다. 프록시가 대상 메서드 호출 전 트랜잭션을 시작하고, 대상 메서드 실행 결과에 따라 커밋이나 롤백을 수행합니다.

기본적으로 스프링의 선언적 트랜잭션은 `RuntimeException`과 `Error`가 발생했을 때 롤백합니다. 체크 예외까지 롤백 대상으로 삼아야 한다면 `rollbackFor` 같은 설정을 별도로 지정해야 합니다.

```java
@Transactional(rollbackFor = Exception.class)
public void createOrder(OrderRequest request) {
    validate(request);
    orderRepository.save(request.toEntity());
}
```

`@Transactional`은 트랜잭션 경계를 코드 밖으로 분리합니다. 서비스 메서드는 비즈니스 로직을 작성하고, 트랜잭션 시작과 종료는 프록시와 `PlatformTransactionManager`가 처리합니다.

## AOP 프록시와 트랜잭션 적용 범위

`@Transactional`은 스프링 AOP 프록시를 통해 적용됩니다. 따라서 트랜잭션이 적용되려면 호출이 스프링 컨테이너가 등록한 프록시 빈을 거쳐야 합니다.

```text
클라이언트
    → 트랜잭션 프록시
        → 트랜잭션 시작
        → 대상 메서드 호출
        → 커밋 또는 롤백
```

외부 객체가 스프링 빈을 주입받아 `@Transactional` 메서드를 호출하면 일반적으로 프록시를 거칩니다. 반대로 같은 클래스 내부에서 `@Transactional` 메서드를 호출하면 프록시를 거치지 않을 수 있습니다. 이 경우 트랜잭션 Advice가 실행되지 않으므로, 트랜잭션이 기대한 대로 적용되지 않을 수 있습니다.

스프링 빈이 아닌 객체를 직접 생성해 호출하는 경우에도 트랜잭션 AOP가 적용되지 않습니다.

```java
OrderService orderService = new OrderService();
orderService.createOrder(request);
```

이 객체는 스프링 컨테이너가 관리하는 빈이 아니므로, 스프링이 트랜잭션 프록시를 만들고 주입하는 흐름에 포함되지 않습니다.

트랜잭션이 적용되지 않는 문제를 확인할 때는 해당 객체가 스프링 빈으로 관리되는지, 호출이 프록시를 거치는지 먼저 봐야 합니다. `@Transactional`의 전파 방식과 격리 수준은 다음 글에서 다룹니다.