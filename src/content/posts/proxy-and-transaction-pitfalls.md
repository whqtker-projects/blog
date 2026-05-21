---
title: "프록시와 트랜잭션의 흔한 함정"
series: spring-transactions
order: 3
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-transactions|스프링 트랜잭션]]
- 이전 글: [[transaction-propagation-and-isolation|트랜잭션 전파와 격리 수준]]

## @Transactional이 적용되는 조건

`@Transactional`은 스프링 AOP Proxy를 통해 적용됩니다. 스프링은 `@Transactional`이 붙은 메서드 호출을 가로채고, 대상 메서드 실행 전후에 트랜잭션 시작, 커밋, 롤백 처리를 수행합니다.

이때 중요한 점은 호출이 Proxy를 거쳐야 한다는 것입니다. 스프링 컨테이너가 관리하는 Bean을 다른 Bean에서 주입받아 호출하면, 보통 대상 객체가 아니라 Proxy 객체를 통해 메서드가 호출됩니다.

```text
클라이언트
    → 트랜잭션 Proxy
        → 트랜잭션 시작
        → 대상 메서드 호출
        → 커밋 또는 롤백
```

예를 들어 다음과 같이 다른 Bean에서 `OrderService`를 호출하면 트랜잭션 Proxy를 거칠 수 있습니다.

```java
@Service
@RequiredArgsConstructor
public class OrderFacade {

    private final OrderService orderService;

    public void create(OrderRequest request) {
        orderService.createOrder(request);
    }
}
```

```java
@Service
public class OrderService {

    @Transactional
    public void createOrder(OrderRequest request) {
        orderRepository.save(request.toEntity());
    }
}
```

이 구조에서 `OrderFacade`가 주입받는 `OrderService`는 실제 대상 객체가 아니라 트랜잭션 Proxy일 수 있습니다. `createOrder()` 호출이 Proxy로 들어가면 트랜잭션 Advice가 실행되고, 그 안에서 대상 메서드가 호출됩니다.

반대로 스프링 컨테이너가 관리하지 않는 객체에는 트랜잭션 AOP가 적용되지 않습니다.

```java
OrderService orderService = new OrderService();
orderService.createOrder(request);
```

이 객체는 스프링 Bean이 아니므로, 스프링이 트랜잭션 Proxy를 만들고 주입하는 흐름에 포함되지 않습니다. `@Transactional`이 동작하려면 대상 객체가 스프링 Bean으로 관리되고, 호출이 Proxy를 거쳐야 합니다.

## 자기 호출 문제

자기 호출은 같은 클래스 안에서 자신의 다른 메서드를 호출하는 상황입니다. 이 경우 호출이 Proxy를 거치지 않고 대상 객체 내부에서 바로 이어질 수 있습니다.

```java
@Service
public class OrderService {

    public void createOrder(OrderRequest request) {
        saveHistory(request);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveHistory(OrderRequest request) {
        historyRepository.save(request.toHistory());
    }
}
```

위 코드만 보면 `saveHistory()`는 `REQUIRES_NEW` 전파 옵션에 따라 새 트랜잭션으로 실행될 것처럼 보입니다. 하지만 `createOrder()` 내부에서 `saveHistory()`를 호출하면 같은 객체 내부 호출이 됩니다.

```text
외부 객체
    → OrderService Proxy
        → OrderService.createOrder()
            → this.saveHistory()
```

`createOrder()`까지는 Proxy를 거쳐 들어올 수 있지만, 그 안에서 호출되는 `saveHistory()`는 대상 객체 내부의 메서드 호출입니다. 이 호출은 다시 Proxy로 나가지 않습니다. 따라서 `saveHistory()`에 `@Transactional(propagation = Propagation.REQUIRES_NEW)`가 붙어 있어도 트랜잭션 Advice가 실행되지 않을 수 있습니다.

이 문제는 전파 옵션 자체의 문제가 아니라 호출 경로의 문제입니다. `@Transactional`이 붙은 메서드라도 Proxy가 해당 호출을 가로채지 못하면 트랜잭션 설정이 적용되지 않습니다.

## 자기 호출 문제를 피하는 방법

자기 호출 문제를 피하려면 트랜잭션이 필요한 메서드가 Proxy를 통해 호출되도록 구조를 잡아야 합니다.

가장 단순한 방법은 트랜잭션 경계를 외부에서 호출되는 메서드에 두는 것입니다.

```java
@Service
public class OrderService {

    @Transactional
    public void createOrder(OrderRequest request) {
        validate(request);
        saveOrder(request);
    }

    private void saveOrder(OrderRequest request) {
        orderRepository.save(request.toEntity());
    }
}
```

이 구조에서는 외부에서 호출하는 `createOrder()`에 트랜잭션을 둡니다. 내부의 `saveOrder()`는 트랜잭션 경계를 새로 만들 필요가 없고, 이미 시작된 트랜잭션 안에서 실행됩니다.

트랜잭션 경계를 분리해야 한다면 별도 Bean으로 나누는 방식도 사용할 수 있습니다.

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderHistoryService orderHistoryService;

    @Transactional
    public void createOrder(OrderRequest request) {
        orderRepository.save(request.toOrder());
        orderHistoryService.saveHistory(request);
    }
}
```

```java
@Service
public class OrderHistoryService {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveHistory(OrderRequest request) {
        historyRepository.save(request.toHistory());
    }
}
```

이 경우 `OrderService`에서 `OrderHistoryService`를 호출할 때 Bean 간 호출이 발생합니다. `OrderHistoryService`가 Proxy로 주입되어 있다면 `saveHistory()` 호출은 Proxy를 거치고, `REQUIRES_NEW` 전파 설정도 적용될 수 있습니다.

자기 자신을 주입받아 Proxy를 통해 호출하는 방법도 있지만, 순환 참조와 의존 구조 문제가 생길 수 있습니다. 트랜잭션 경계가 다른 책임이라면 별도 Bean으로 분리해 Bean 간 호출이 일어나도록 구성하는 편이 낫습니다.

## 메서드 접근 제어자와 트랜잭션 적용

`@Transactional`은 Proxy가 메서드 호출을 가로챌 수 있어야 적용됩니다. 따라서 트랜잭션 경계는 외부에서 호출되는 서비스 메서드에 두는 편이 일반적입니다.

`private` 메서드는 클래스 내부에서만 호출됩니다. 외부 객체가 `private` 메서드를 호출할 수 없으므로, Proxy가 해당 메서드 호출을 가로채는 구조를 만들 수 없습니다.

```java
@Service
public class OrderService {

    public void createOrder(OrderRequest request) {
        saveOrder(request);
    }

    @Transactional
    private void saveOrder(OrderRequest request) {
        orderRepository.save(request.toEntity());
    }
}
```

위 코드에서 `saveOrder()`는 `private` 메서드입니다. `createOrder()` 내부에서만 호출되며, 이 호출은 대상 객체 내부 호출입니다. 이 경우 `saveOrder()`에 붙은 `@Transactional`은 트랜잭션 경계로 동작하지 않습니다.

트랜잭션을 적용하려면 외부에서 Proxy를 통해 호출되는 메서드에 `@Transactional`을 두어야 합니다.

```java
@Service
public class OrderService {

    @Transactional
    public void createOrder(OrderRequest request) {
        saveOrder(request);
    }

    private void saveOrder(OrderRequest request) {
        orderRepository.save(request.toEntity());
    }
}
```

클래스 기반 Proxy를 사용할 때는 `final` 제약도 주의해야 합니다. CGLIB 기반 Proxy는 클래스를 상속하고 메서드를 오버라이딩하는 방식으로 호출을 가로챕니다. 따라서 `final` 클래스는 상속할 수 없고, `final` 메서드는 오버라이딩할 수 없습니다.

트랜잭션 경계로 사용할 메서드가 `final`이면 클래스 기반 Proxy가 해당 메서드를 오버라이딩해 호출을 가로챌 수 없습니다.

Spring 6부터 class-based Proxy에서는 `protected`나 package-visible 메서드도 트랜잭션 대상이 될 수 있습니다. 다만 interface-based Proxy에서는 인터페이스에 선언된 `public` 메서드 호출이 기준입니다. Proxy 방식에 따라 동작이 달라질 수 있으므로, 일반적인 서비스 코드에서는 트랜잭션 경계를 `public` 서비스 메서드에 두는 편이 예측하기 쉽습니다.

## 예외 롤백 규칙

`@Transactional`이 적용되었다고 해서 모든 예외에서 항상 롤백되는 것은 아닙니다. 스프링의 기본 선언적 트랜잭션은 `RuntimeException`과 `Error`가 발생했을 때 롤백합니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    orderRepository.save(request.toEntity());

    throw new IllegalStateException("주문 생성 실패");
}
```

`IllegalStateException`은 `RuntimeException`의 하위 타입입니다. 이 예외가 메서드 밖으로 던져지면 트랜잭션은 기본적으로 롤백됩니다.

반면 체크 예외는 기본 롤백 대상이 아닙니다.

```java
@Transactional
public void createOrder(OrderRequest request) throws IOException {
    orderRepository.save(request.toEntity());

    throw new IOException("외부 파일 처리 실패");
}
```

`IOException`은 체크 예외입니다. 기본 설정에서는 체크 예외가 발생해도 트랜잭션이 롤백되지 않을 수 있습니다. 체크 예외에서도 롤백해야 한다면 `rollbackFor`를 지정해야 합니다.

```java
@Transactional(rollbackFor = IOException.class)
public void createOrder(OrderRequest request) throws IOException {
    orderRepository.save(request.toEntity());

    throw new IOException("외부 파일 처리 실패");
}
```

여러 체크 예외를 포함해야 한다면 상위 타입을 지정할 수도 있습니다.

```java
@Transactional(rollbackFor = Exception.class)
public void createOrder(OrderRequest request) throws Exception {
    orderRepository.save(request.toEntity());

    throw new Exception("주문 생성 실패");
}
```

반대로 특정 예외에서는 롤백하지 않도록 설정할 수도 있습니다. `noRollbackFor`를 사용하면 지정한 예외가 메서드 밖으로 던져져도 트랜잭션을 롤백하지 않습니다.

```java
@Transactional(noRollbackFor = OrderWarningException.class)
public void createOrder(OrderRequest request) {
    orderRepository.save(request.toEntity());

    throw new OrderWarningException("경고성 예외");
}
```

예외를 메서드 안에서 잡고 밖으로 던지지 않는 경우도 주의해야 합니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    try {
        orderRepository.save(request.toEntity());
        paymentClient.pay(request);
    } catch (RuntimeException e) {
        log.warn("payment failed", e);
    }
}
```

이 코드에서는 `paymentClient.pay()`에서 `RuntimeException`이 발생해도 catch 블록에서 예외를 처리하고 메서드가 정상 종료됩니다. 트랜잭션 Proxy는 메서드가 정상 종료된 것으로 보고 커밋할 수 있습니다.

예외를 다시 던질 수 있다면 기본 롤백 규칙을 사용할 수 있습니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    try {
        orderRepository.save(request.toEntity());
        paymentClient.pay(request);
    } catch (RuntimeException e) {
        log.warn("payment failed", e);
        throw e;
    }
}
```

예외를 처리하고 메서드를 정상 종료해야 하지만 데이터 변경은 롤백해야 한다면, 현재 트랜잭션을 롤백 전용으로 표시할 수 있습니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    try {
        orderRepository.save(request.toEntity());
        paymentClient.pay(request);
    } catch (RuntimeException e) {
        log.warn("payment failed", e);
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    }
}
```

이 방식은 트랜잭션 처리 코드가 서비스 로직에 직접 드러납니다. 가능한 경우에는 예외를 메서드 밖으로 던지고, `rollbackFor` 같은 롤백 규칙으로 처리하는 편이 더 단순합니다.

예외 롤백 규칙은 트랜잭션 Advice가 실행된 뒤의 문제입니다. Proxy를 거치지 않아 트랜잭션이 시작되지 않은 문제와, 트랜잭션은 시작됐지만 어떤 예외에서 롤백할지의 문제를 구분해서 봐야 합니다.

## 전파 옵션과 함께 볼 때의 주의점

전파 옵션은 트랜잭션 메서드 호출이 Proxy를 거칠 때 적용됩니다. `REQUIRES_NEW`, `NESTED`, `MANDATORY` 같은 옵션을 지정해도, 호출이 Proxy를 거치지 않으면 해당 전파 설정이 적용되지 않을 수 있습니다.

이 문제는 전파 옵션 자체의 문제가 아니라 호출 경로의 문제입니다. 자기 호출, 직접 생성 객체, `private` 메서드 호출처럼 Proxy가 개입하지 않는 구조에서는 전파 설정이 실행 흐름에 반영되지 않을 수 있습니다.

트랜잭션 문제를 확인할 때는 먼저 적용 조건을 봅니다. 대상 객체가 스프링 Bean인지, 호출이 Proxy를 거치는지, `@Transactional`이 Proxy가 가로챌 수 있는 메서드에 붙어 있는지 확인합니다. 그다음 예외가 메서드 밖으로 던져지는지, 예외 타입이 롤백 대상인지, 전파 옵션이 커밋과 롤백 경계를 의도한 대로 나누는지 확인합니다.

`@Transactional` 문제는 보통 어노테이션 자체보다 적용 조건에서 발생합니다. Proxy를 거치지 않으면 트랜잭션 Advice가 실행되지 않고, 예외가 롤백 대상이 아니면 트랜잭션이 커밋될 수 있습니다. 전파 옵션은 트랜잭션이 실제로 시작된 뒤의 경계를 조정하는 설정이므로, 먼저 트랜잭션 적용 여부를 확인해야 합니다.
