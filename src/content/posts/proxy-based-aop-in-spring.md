---
title: "스프링의 프록시 기반 AOP"
series: spring-aop-and-transactions
order: 2
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-aop-and-transactions|스프링 AOP와 트랜잭션]]
- 이전 글: [[what-is-spring-aop|스프링 AOP란 무엇인가]]
- 다음 글: [[transaction-abstraction-in-spring|스프링의 트랜잭션 추상화]]

## 스프링 AOP가 프록시를 사용하는 이유

스프링 AOP는 런타임에 대상 객체 앞에 프록시 객체를 두고 부가 기능을 적용합니다. 클라이언트가 대상 객체를 직접 호출하는 것이 아니라, 스프링 컨테이너가 등록한 프록시 빈을 호출하는 구조입니다.

예를 들어 `OrderService`에 실행 시간 측정 `Advice`를 적용한다고 가정합니다.

```java
public class OrderService {

    public void createOrder(OrderRequest request) {
        validate(request);
        orderRepository.save(request.toEntity());
    }
}
```

서비스 메서드 안에는 실행 시간 측정 코드가 없습니다. 스프링은 클라이언트가 주입받는 빈 참조가 대상 객체가 아니라 프록시 객체를 가리키도록 구성할 수 있습니다.

![[Pasted image 20260520182259.png]]

프록시는 대상 메서드를 호출하기 전이나 후에 `Advice`를 실행합니다. 이 구조를 사용하면 대상 클래스의 코드를 직접 수정하지 않고도 로깅, 권한 검사, 트랜잭션 처리 같은 부가 기능을 메서드 호출 흐름에 끼워 넣을 수 있습니다.

스프링 AOP는 이 프록시를 스프링 빈으로 등록합니다. 따라서 다른 빈이 `OrderService`를 주입받을 때 실제 대상 객체가 아니라 프록시 객체를 주입받을 수 있습니다. 클라이언트는 평소처럼 메서드를 호출하지만, 호출은 프록시를 먼저 지나갑니다.

## 프록시 기반 AOP의 호출 흐름

프록시 기반 AOP에서 중요한 부분은 호출이 대상 객체로 바로 가지 않고 프록시를 거친다는 점입니다.

![[Pasted image 20260520182511.png]]

예를 들어 다음과 같은 `@Around` Advice가 있다고 가정합니다.

```java
@Aspect
@Component
public class LoggingAspect {

    @Around("execution(* com.example.order..*(..))")
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

클라이언트가 프록시 객체의 메서드를 호출하면, 프록시는 `logExecutionTime()` Advice를 실행합니다. `joinPoint.proceed()`가 호출되는 시점에 실제 대상 객체의 메서드가 실행됩니다.

```java
orderService.createOrder(request);
```

이 호출이 프록시를 거치면 다음 순서로 처리됩니다.

1. 클라이언트가 `orderService.createOrder()`를 호출합니다.
2. 호출이 `OrderService` 프록시로 들어갑니다.
3. 프록시가 `@Around` Advice를 실행합니다.
4. `joinPoint.proceed()`에서 실제 `OrderService.createOrder()`가 호출됩니다.
5. 대상 메서드 실행 후 다시 Advice로 돌아옵니다.
6. 프록시가 호출 결과를 클라이언트에 반환합니다.

`@Transactional`도 프록시 기반 AOP로 적용됩니다. 트랜잭션 처리 자체의 추상화 구조는 다음 글에서 다룹니다.

프록시 기반 AOP에서는 호출이 프록시를 지나야 `Advice`가 적용됩니다. 같은 클래스 내부 호출처럼 프록시를 거치지 않는 경우는 마지막 섹션에서 다룹니다.

## JDK 동적 프록시

JDK 동적 프록시는 인터페이스를 기준으로 프록시 객체를 생성하는 방식입니다. 대상 클래스가 인터페이스를 구현하고 있으면, 프록시 객체도 같은 인터페이스를 구현합니다.

예를 들어 다음과 같은 인터페이스가 있다고 가정합니다.

```java
public interface OrderService {
    void createOrder(OrderRequest request);
}
```

구현 클래스는 이 인터페이스를 구현합니다.

```java
@Service
public class OrderServiceImpl implements OrderService {

    @Override
    public void createOrder(OrderRequest request) {
        validate(request);
        orderRepository.save(request.toEntity());
    }
}
```

JDK 동적 프록시는 `OrderService` 인터페이스를 구현한 프록시 객체를 만듭니다. 클라이언트가 `OrderService` 타입으로 빈을 주입받으면 실제 호출은 프록시 객체로 들어갑니다.

```java
@RequiredArgsConstructor
@Service
public class OrderFacade {

    private final OrderService orderService;

    public void order(OrderRequest request) {
        orderService.createOrder(request);
    }
}
```

이 구조에서 `OrderFacade`는 `OrderServiceImpl`을 직접 호출하지 않습니다. `OrderService` 인터페이스를 구현한 프록시 객체를 호출하고, 프록시는 `Advice`를 실행한 뒤 대상 객체의 메서드를 호출합니다.

JDK 동적 프록시로 만들어진 객체는 인터페이스 타입으로 사용됩니다. 따라서 클라이언트가 인터페이스에 선언된 메서드를 호출하면 그 호출이 프록시로 들어갑니다. 인터페이스가 없는 클래스에는 JDK 동적 프록시를 적용할 수 없습니다.

## CGLIB 프록시

CGLIB 프록시는 클래스를 상속해서 프록시 객체를 생성하는 방식입니다. 인터페이스가 없어도 대상 클래스를 기반으로 프록시를 만들 수 있습니다.

예를 들어 다음처럼 인터페이스 없이 서비스 클래스를 작성할 수 있습니다.

```java
@Service
public class OrderService {

    public void createOrder(OrderRequest request) {
        validate(request);
        orderRepository.save(request.toEntity());
    }
}
```

CGLIB은 `OrderService`를 상속한 프록시 클래스를 만듭니다. 클라이언트가 `OrderService` 타입으로 빈을 주입받으면, 실제로는 `OrderService`를 상속한 프록시 객체를 호출하게 됩니다.

```text
OrderService 프록시 extends OrderService
```

프록시 객체는 메서드 호출을 가로채고, `Advice`를 실행한 뒤 대상 메서드 호출로 이어집니다.

```text
클라이언트
    → OrderService를 상속한 프록시
        → Advice
        → OrderService.createOrder() 호출
```

CGLIB은 상속을 사용하므로 상속과 오버라이딩이 막힌 경우에는 제약이 생깁니다. `final` 클래스는 상속할 수 없고, `final` 메서드는 오버라이딩할 수 없습니다. 이 경우 클래스 기반 프록시가 메서드 호출을 가로채기 어렵습니다.

```java
public final class OrderService {
    public void createOrder(OrderRequest request) {
        ...
    }
}
```

또는 다음처럼 메서드가 `final`이면 프록시가 해당 메서드를 오버라이딩할 수 없습니다.

```java
public class OrderService {

    public final void createOrder(OrderRequest request) {
        ...
    }
}
```

클래스 기반 프록시를 사용할 때는 대상 클래스와 메서드가 프록시 생성 방식과 충돌하지 않는지 봐야 합니다.

## JDK 동적 프록시와 CGLIB의 선택 기준

JDK 동적 프록시와 CGLIB은 프록시를 만드는 기준이 다릅니다.

| 구분 | JDK 동적 프록시 | CGLIB 프록시 |
| --- | --- | --- |
| 프록시 생성 기준 | 인터페이스 | 클래스 |
| 대상 조건 | 대상 클래스가 인터페이스를 구현해야 합니다. | 인터페이스가 없어도 클래스 기준으로 생성할 수 있습니다. |
| 프록시 타입 | 인터페이스를 구현한 프록시 | 대상 클래스를 상속한 프록시 |
| 주요 제약 | 프록시가 인터페이스 타입으로 만들어지므로, 인터페이스에 선언되지 않은 메서드는 인터페이스 프록시를 통해 호출할 수 없습니다. | `final` 클래스나 `final` 메서드에 제약이 있습니다. |

JDK 동적 프록시는 인터페이스를 구현한 프록시를 만들고, CGLIB은 대상 클래스를 상속한 프록시를 만듭니다. 따라서 같은 이름의 타입처럼 보여도, 그 타입이 인터페이스인지 클래스인지에 따라 프록시 생성 방식이 달라질 수 있습니다.

스프링에서는 설정에 따라 어떤 프록시 방식을 사용할지 달라질 수 있습니다. 어떤 방식이 선택되든 AOP 적용 여부에서 중요한 기준은 클라이언트 호출이 스프링이 등록한 프록시 빈을 거치는지입니다.

호출이 프록시를 거치면 `Advice`가 적용될 수 있고, 프록시를 거치지 않으면 AOP가 적용되지 않습니다. 이 때문에 프록시 방식 자체보다 호출 경로가 더 직접적인 확인 대상이 되는 경우가 많습니다.

## 프록시 기반 AOP의 주의점

프록시 기반 AOP에서는 호출 경로가 중요합니다. 스프링 AOP는 스프링 컨테이너가 관리하는 프록시 빈을 통해 들어오는 메서드 호출에 부가 기능을 적용합니다.

같은 클래스 내부에서 메서드를 호출하면 프록시를 거치지 않을 수 있습니다.

```java
@Service
public class OrderService {

    public void createOrder(OrderRequest request) {
        saveOrder(request);
    }

    @Transactional
    public void saveOrder(OrderRequest request) {
        orderRepository.save(request.toEntity());
    }
}
```

외부 객체가 `orderService.saveOrder()`를 호출하면 프록시를 거칠 수 있습니다. 하지만 `createOrder()` 내부에서 `saveOrder()`를 호출하면 같은 객체 내부 호출입니다. 이 호출은 프록시 객체를 거치지 않고 대상 객체의 메서드로 바로 이어질 수 있습니다.

이 구조에서는 `saveOrder()`에 붙은 `@Transactional`이 기대한 대로 동작하지 않을 수 있습니다. 프록시가 메서드 호출을 가로채야 트랜잭션 `Advice`를 적용할 수 있기 때문입니다.

스프링 빈이 아닌 객체에도 스프링 AOP가 적용되지 않습니다.

```java
OrderService orderService = new OrderService();
orderService.createOrder(request);
```

이 객체는 스프링 컨테이너가 관리하는 빈이 아니므로, 스프링이 프록시를 만들고 주입하는 흐름에 포함되지 않습니다. 스프링 AOP를 적용하려면 스프링 컨테이너가 관리하는 빈을 통해 호출되어야 합니다.

스프링 AOP는 메서드 실행 중심으로 동작합니다. 필드 접근이나 생성자 호출 같은 지점까지 일반적으로 다루는 AspectJ와 달리, 스프링 AOP는 스프링 빈의 메서드 호출 흐름에 부가 기능을 적용합니다.

프록시 기반 AOP를 사용할 때는 어떤 프록시 방식이 선택되었는가와 함께 이 호출이 프록시를 거치는가를 봐야 합니다. 트랜잭션이 적용되지 않거나 로깅 Advice가 실행되지 않는 문제는 프록시 방식 자체보다 호출 경로에서 발생하는 경우가 많습니다.