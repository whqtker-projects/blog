---
title: "스프링 AOP란 무엇인가"
series: spring-aop-and-transactions
order: 1
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-aop-and-transactions|스프링 AOP와 트랜잭션]]
- 다음 글: [[proxy-based-aop-in-spring|스프링의 프록시 기반 AOP]]

## AOP가 필요한 이유

애플리케이션 코드는 보통 핵심 기능과 부가 기능이 함께 실행됩니다. 주문을 생성하는 기능을 예로 들면, 핵심 기능은 주문을 검증하고 저장하는 로직입니다. 여기에 실행 시간 측정, 로깅, 권한 검사, 트랜잭션 처리 같은 부가 기능이 함께 들어갈 수 있습니다.

문제는 이런 부가 기능이 여러 서비스 메서드에 반복될 수 있다는 점입니다.

```java
public void createOrder(OrderRequest request) {
    long startTime = System.currentTimeMillis();

    try {
        validate(request);
        orderRepository.save(request.toEntity());
    } finally {
        log.info("createOrder execution time = {}", System.currentTimeMillis() - startTime);
    }
}

public void cancelOrder(Long orderId) {
    long startTime = System.currentTimeMillis();

    try {
        Order order = orderRepository.findById(orderId);
        order.cancel();
    } finally {
        log.info("cancelOrder execution time = {}", System.currentTimeMillis() - startTime);
    }
}
```

이 코드에서 주문 생성과 주문 취소는 서로 다른 비즈니스 로직을 가집니다. 하지만 실행 시간 측정 코드는 두 메서드에 같은 형태로 들어갑니다.

서비스 메서드마다 실행 시간 측정 코드가 들어가면 핵심 로직과 부가 기능이 섞입니다. 실행 시간 측정뿐 아니라 로깅, 권한 검사, 트랜잭션 처리도 여러 기능의 실행 흐름에 반복해서 들어갈 수 있습니다.

이처럼 여러 기능의 실행 흐름에 반복해서 끼어드는 부가 기능을 횡단 관심사라고 부릅니다. 횡단 관심사는 특정 비즈니스 기능 하나에만 속하지 않고, 여러 기능에 걸쳐 적용됩니다. AOP는 이런 횡단 관심사를 핵심 로직 밖으로 분리해서 적용하는 방식입니다.

## AOP란

AOP는 Aspect Oriented Programming의 약자로, 관점 지향 프로그래밍이라고 부릅니다. AOP는 핵심 비즈니스 로직과 여러 곳에 반복해서 적용되는 부가 기능을 분리하는 프로그래밍 방식입니다.

객체 지향 프로그래밍에서는 보통 도메인, 서비스, 레포지토리 같은 역할을 기준으로 코드를 나눕니다. 하지만 로깅, 권한 검사, 트랜잭션 처리 같은 기능은 여러 객체의 메서드 실행 흐름에 걸쳐 들어갑니다. 이런 기능은 특정 클래스 하나의 책임으로만 묶기 어렵습니다.

AOP는 부가 기능을 별도의 모듈로 분리하고, 필요한 실행 지점에 적용합니다. 서비스 코드는 주문 생성이나 회원 조회 같은 핵심 로직을 담고, 실행 시간 측정이나 트랜잭션 처리 같은 부가 기능은 AOP를 통해 적용할 수 있습니다.

스프링에서 사용하는 트랜잭션 처리도 AOP 기반으로 동작합니다. `@Transactional`이 붙은 메서드를 호출하면, 스프링은 메서드 실행 전후로 트랜잭션 시작, 커밋, 롤백 처리를 적용합니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    validate(request);
    orderRepository.save(request.toEntity());
}
```

이 메서드에는 트랜잭션 시작, 커밋, 롤백 코드가 직접 보이지 않습니다. 개발자는 서비스 메서드 안에서 트랜잭션 경계 처리 코드를 직접 작성하지 않고, 어노테이션으로 트랜잭션 적용 지점을 표시합니다.

## AOP 핵심 개념

AOP를 이해하려면 `JoinPoint`, `Pointcut`, `Advice`, `Aspect`, `Weaving`의 역할을 구분해야 합니다.

### JoinPoint와 Pointcut

`JoinPoint`는 부가 기능을 적용할 수 있는 실행 지점입니다. 메서드 호출, 생성자 호출, 필드 접근 같은 지점이 `JoinPoint`가 될 수 있습니다.

스프링 AOP에서는 주로 스프링 빈의 메서드 실행 지점이 `JoinPoint`가 됩니다. 예를 들어 `OrderService.createOrder()` 메서드 실행 지점은 스프링 AOP에서 부가 기능을 적용할 수 있는 지점입니다.

`Pointcut`은 여러 `JoinPoint` 중에서 실제로 부가 기능을 적용할 대상을 고르는 조건입니다. 모든 메서드에 부가 기능을 적용하는 것이 아니라, 특정 패키지, 특정 클래스, 특정 어노테이션, 특정 메서드 이름에만 적용할 수 있습니다.

예를 들어 다음 `Pointcut`은 `com.example.order` 패키지 아래의 모든 메서드 실행을 대상으로 삼습니다.

```java
@Pointcut("execution(* com.example.order..*(..))")
public void orderServiceMethods() {
}
```

`execution(* com.example.order..*(..))`는 메서드 실행 지점을 기준으로 대상을 선택하는 표현식입니다. 이 `Pointcut`에 선택된 메서드가 호출될 때 `Advice`가 실행될 수 있습니다.

`JoinPoint`가 부가 기능을 적용할 수 있는 후보 지점이라면, `Pointcut`은 그중 실제 적용 대상을 고르는 조건입니다.

### Advice

`Advice`는 `Pointcut`으로 선택된 지점에서 실행할 부가 기능입니다. 로깅, 실행 시간 측정, 트랜잭션 처리, 권한 검사 같은 코드가 `Advice`가 될 수 있습니다.

스프링 AOP에서는 `Advice`를 메서드 실행 시점에 따라 나눌 수 있습니다. `@Before`는 대상 메서드 실행 전에 동작합니다. `@AfterReturning`은 대상 메서드가 정상적으로 반환된 뒤 실행됩니다. `@AfterThrowing`은 대상 메서드에서 예외가 발생했을 때 실행됩니다.

메서드 실행 전체를 감싸야 할 때는 `@Around`를 사용할 수 있습니다. `@Around` Advice에서는 `ProceedingJoinPoint`를 사용해 대상 메서드 실행 전후에 부가 기능을 배치합니다.

```java
@Around("orderServiceMethods()")
public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
    long startTime = System.currentTimeMillis();

    try {
        return joinPoint.proceed();
    } finally {
        long endTime = System.currentTimeMillis();
        log.info("{} execution time = {}", joinPoint.getSignature(), endTime - startTime);
    }
}
```

`joinPoint.proceed()`를 호출해야 실제 대상 메서드가 실행됩니다. `proceed()` 호출 전에는 대상 메서드 실행 전 로직을 둘 수 있고, 호출 후에는 대상 메서드 실행 후 로직을 둘 수 있습니다.

### Aspect

`Aspect`는 `Pointcut`과 `Advice`를 함께 묶은 단위입니다. 어떤 실행 지점에 어떤 부가 기능을 적용할지를 하나의 모듈로 표현합니다.

스프링에서는 `@Aspect`를 사용해 `Aspect` 클래스를 작성할 수 있습니다.

```java
@Aspect
@Component
public class LoggingAspect {

    @Pointcut("execution(* com.example.order..*(..))")
    public void orderServiceMethods() {
    }

    @Around("orderServiceMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        try {
            return joinPoint.proceed();
        } finally {
            long endTime = System.currentTimeMillis();
            log.info("{} execution time = {}", joinPoint.getSignature(), endTime - startTime);
        }
    }
}
```

이 클래스에서 `orderServiceMethods()`는 부가 기능을 적용할 대상을 고르는 `Pointcut`입니다. `logExecutionTime()`은 선택된 메서드 실행을 감싸는 `Advice`입니다.

`Aspect`에는 `Pointcut`과 `Advice`가 함께 들어가므로, 적용 대상과 실행할 부가 기능을 한 클래스에서 정의할 수 있습니다. 서비스 클래스는 주문 생성이나 주문 취소 같은 비즈니스 로직을 유지하고, 실행 시간 측정은 `LoggingAspect`에서 처리합니다.

### Weaving

`Weaving`은 `Aspect`를 실제 대상 코드에 적용하는 과정입니다. `Pointcut`으로 선택한 실행 지점에 `Advice`가 연결되어야 부가 기능이 실행됩니다.

AOP에서는 `Weaving`이 일어나는 시점에 따라 방식이 나뉩니다. 컴파일 시점에 적용할 수도 있고, 클래스 로딩 시점에 적용할 수도 있으며, 런타임에 적용할 수도 있습니다.

스프링 AOP는 런타임에 프록시를 사용해 `Aspect`를 적용합니다. 프록시가 어떤 방식으로 만들어지고 어떤 호출에서 AOP가 적용되지 않는지는 다음 글에서 다룹니다.

## 스프링 AOP의 특징

스프링 AOP는 스프링 빈을 대상으로 동작합니다. 스프링 컨테이너가 관리하는 객체에 프록시를 적용하고, 그 프록시를 통해 메서드 호출을 가로챕니다.

스프링 AOP는 프록시 기반입니다. 대상 객체의 바이트코드를 직접 수정하는 방식이 아니라, 대상 객체 앞에 프록시 객체를 두고 메서드 호출을 중간에서 처리합니다. 이 때문에 스프링 빈 외부에서 직접 생성한 객체에는 스프링 AOP가 적용되지 않습니다.

스프링 AOP는 메서드 실행 중심으로 동작합니다. AspectJ는 더 넓은 `JoinPoint` 모델을 제공하지만, 스프링 AOP는 주로 스프링 빈의 메서드 실행 지점에 부가 기능을 적용합니다.

스프링에서 AOP는 트랜잭션, 로깅, 보안 같은 부가 기능을 서비스 코드와 분리해서 적용할 때 사용됩니다. 프록시 기반 동작 방식, 내부 호출에서 AOP가 적용되지 않는 이유, JDK 동적 프록시와 CGLIB 차이는 다음 글에서 다룹니다.