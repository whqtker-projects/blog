---
title: "트랜잭션 전파와 격리 수준"
series: spring-transactions
order: 2
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-transactions|스프링 트랜잭션]]
- 이전 글: [[transaction-abstraction-in-spring|스프링의 트랜잭션 추상화]]
- 다음 글: [[proxy-and-transaction-pitfalls|프록시와 트랜잭션의 흔한 함정]]

## 트랜잭션 전파란

트랜잭션 전파는 이미 트랜잭션이 진행 중일 때 다른 `@Transactional` 메서드를 호출하면 기존 트랜잭션에 참여할지, 새 트랜잭션을 시작할지, 또는 트랜잭션 없이 실행할지 정하는 설정입니다.

예를 들어 주문 생성 과정에서 주문 저장과 결제 이력 저장이 함께 실행된다고 가정합니다.

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final PaymentHistoryService paymentHistoryService;

    @Transactional
    public void createOrder(OrderRequest request) {
        // 주문 저장
        paymentHistoryService.saveHistory(request);
    }
}
```

```java
@Service
public class PaymentHistoryService {

    @Transactional
    public void saveHistory(OrderRequest request) {
        // 결제 이력 저장
    }
}
```

`OrderService.createOrder()`가 이미 트랜잭션 안에서 실행되고 있을 때 `PaymentHistoryService.saveHistory()`를 호출하면, 내부 메서드의 트랜잭션을 어떻게 처리할지 결정해야 합니다.

내부 메서드가 외부 트랜잭션에 참여할 수도 있고, 외부 트랜잭션과 별도의 새 트랜잭션으로 실행될 수도 있습니다. 이 규칙을 정하는 설정이 전파 옵션입니다.

전파 옵션은 같은 `@Transactional` 메서드라도 커밋과 롤백 범위가 달라지게 만듭니다. 따라서 전파 옵션은 메서드 호출 관계에서 트랜잭션 경계를 어떻게 이어갈지 정하는 설정으로 볼 수 있습니다.

## 주요 전파 옵션

스프링의 기본 전파 옵션은 `REQUIRED`입니다. 별도로 지정하지 않으면 `@Transactional`은 `Propagation.REQUIRED`로 동작합니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    // 기본값은 Propagation.REQUIRED
}
```

### REQUIRED

`REQUIRED`는 기존 트랜잭션이 있으면 그 트랜잭션에 참여하고, 기존 트랜잭션이 없으면 새 트랜잭션을 시작합니다.

```java
@Transactional(propagation = Propagation.REQUIRED)
public void saveHistory(OrderRequest request) {
    // 기존 트랜잭션이 있으면 참여
    // 없으면 새로 시작
}
```

외부 메서드와 내부 메서드가 모두 `REQUIRED`라면 보통 하나의 트랜잭션으로 묶입니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    orderRepository.save(request.toOrder());
    paymentHistoryService.saveHistory(request);
}
```

```java
@Transactional(propagation = Propagation.REQUIRED)
public void saveHistory(OrderRequest request) {
    paymentHistoryRepository.save(request.toHistory());
}
```

이 경우 `createOrder()` 안에서 주문 저장과 결제 이력 저장이 같은 트랜잭션에 참여합니다. 내부 메서드에서 예외가 발생해 롤백 대상이 되면 전체 작업이 함께 롤백될 수 있습니다.

`REQUIRED`는 여러 작업을 하나의 업무 단위로 묶어 처리할 때 사용됩니다.

### REQUIRES_NEW

`REQUIRES_NEW`는 항상 새 트랜잭션을 시작합니다. 이미 진행 중인 트랜잭션이 있다면 기존 트랜잭션을 잠시 중단하고, 새 트랜잭션을 만들어 내부 메서드를 실행합니다.

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveHistory(OrderRequest request) {
    historyRepository.save(request.toHistory());
}
```

예를 들어 주문 생성이 실패하더라도 로그나 이력은 별도로 남겨야 하는 경우가 있습니다.

```java
@Transactional
public void createOrder(OrderRequest request) {
    orderRepository.save(request.toOrder());
    historyService.saveHistory(request);

    throw new RuntimeException("주문 생성 실패");
}
```

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveHistory(OrderRequest request) {
    historyRepository.save(request.toHistory());
}
```

`saveHistory()`가 `REQUIRES_NEW`로 실행되면 주문 생성 트랜잭션과 이력 저장 트랜잭션의 경계가 분리됩니다. 내부 트랜잭션이 먼저 커밋되면, 이후 외부 트랜잭션이 롤백되더라도 내부 트랜잭션의 결과는 별도로 남을 수 있습니다.

이 방식은 커밋과 롤백 경계를 의도적으로 분리할 때 사용합니다. 다만 외부 트랜잭션과 별도의 트랜잭션을 시작하므로, 반복적으로 사용하면 커넥션 사용량이 늘어날 수 있습니다.

### NESTED

`NESTED`는 기존 트랜잭션이 있으면 그 안에 저장점을 만들고, 내부 작업을 중첩 트랜잭션처럼 실행합니다. 내부 작업에서 문제가 발생하면 저장점까지 롤백할 수 있습니다.

```java
@Transactional(propagation = Propagation.NESTED)
public void saveHistory(OrderRequest request) {
    historyRepository.save(request.toHistory());
}
```

`NESTED`는 외부 트랜잭션과 완전히 분리된 새 트랜잭션을 만드는 방식이 아닙니다. 기존 트랜잭션 안에서 저장점을 사용합니다.

```text
외부 트랜잭션 시작
    주문 저장
    저장점 생성
        이력 저장
        내부 작업 실패 시 저장점까지 롤백
외부 트랜잭션 커밋 또는 롤백
```

내부 작업만 되돌리고 외부 트랜잭션은 계속 진행해야 하는 경우에 사용할 수 있습니다. 다만 저장점 기반으로 동작하므로 사용하는 트랜잭션 매니저와 데이터베이스가 이를 지원해야 합니다.

기존 트랜잭션이 없는 상태에서 `NESTED`가 호출되면 새 트랜잭션을 시작한다는 점에서 `REQUIRED`와 비슷하게 동작합니다.

### 그 외 전파 옵션

`REQUIRED`, `REQUIRES_NEW`, `NESTED` 외에도 트랜잭션 참여 여부를 더 명시적으로 제어하는 옵션이 있습니다.

| 옵션 | 동작 |
| --- | --- |
| `SUPPORTS` | 기존 트랜잭션이 있으면 참여하고, 없으면 트랜잭션 없이 실행합니다. |
| `MANDATORY` | 기존 트랜잭션이 반드시 있어야 하며, 없으면 예외가 발생합니다. |
| `NOT_SUPPORTED` | 기존 트랜잭션이 있으면 중단하고, 트랜잭션 없이 실행합니다. |
| `NEVER` | 트랜잭션이 있으면 예외가 발생하고, 트랜잭션이 없는 상태에서만 실행합니다. |

자주 사용하는 옵션은 `REQUIRED`, `REQUIRES_NEW`, `NESTED`입니다. 나머지 옵션은 트랜잭션이 없어야 하거나, 반드시 있어야 하는 실행 조건을 명시할 때 사용합니다.

## 전파 옵션 선택 시 주의할 점

전파 옵션은 메서드 호출 관계에서 커밋과 롤백 경계를 바꿉니다. 따라서 옵션 이름만 보고 선택하기보다, 외부 트랜잭션과 내부 트랜잭션의 실패가 서로 어떤 영향을 주어야 하는지 먼저 봐야 합니다.

`REQUIRED`는 기존 트랜잭션에 참여합니다. 내부 작업이 실패하면 외부 트랜잭션 전체가 롤백될 수 있으므로, 함께 성공하거나 함께 실패해야 하는 작업에 사용합니다.

`REQUIRES_NEW`는 외부 트랜잭션과 내부 트랜잭션의 경계를 분리합니다. 내부 트랜잭션이 커밋된 뒤 외부 트랜잭션이 롤백되면, 내부 트랜잭션의 결과는 남을 수 있습니다. 실패 로그처럼 외부 작업이 롤백되어도 남겨야 하는 데이터에는 사용할 수 있지만, 반드시 함께 롤백되어야 하는 데이터에 사용하면 데이터 정합성이 깨질 수 있습니다.

`NESTED`는 저장점 기반으로 일부 작업만 롤백할 때 사용합니다. 모든 환경에서 같은 방식으로 동작한다고 가정하면 안 됩니다. 사용하는 트랜잭션 매니저와 데이터베이스가 저장점을 지원하는지 확인해야 합니다.

전파 옵션은 스프링 AOP 프록시를 통해 적용됩니다. 같은 클래스 내부에서 `@Transactional` 메서드를 호출하면 프록시를 거치지 않아 전파 설정이 적용되지 않을 수 있습니다. 이 문제는 다음 글에서 프록시와 트랜잭션의 흔한 함정으로 다룹니다.

## 트랜잭션 격리 수준이란

트랜잭션 격리 수준은 동시에 실행되는 트랜잭션이 서로의 변경 내용을 어느 시점에 볼 수 있는지 정하는 설정입니다.

전파가 트랜잭션 경계를 어떻게 이어갈지 정하는 설정이라면, 격리 수준은 동시에 실행되는 트랜잭션 사이에서 읽기 일관성을 어느 정도 보장할지 정하는 설정입니다.

예를 들어 하나의 트랜잭션이 사용자 정보를 수정하는 동안, 다른 트랜잭션이 같은 사용자 정보를 조회할 수 있습니다.

```text
트랜잭션 A: 사용자 이름 변경
트랜잭션 B: 같은 사용자 조회
```

이때 트랜잭션 B가 트랜잭션 A의 커밋되지 않은 변경을 볼 수 있는지, 같은 데이터를 반복 조회했을 때 같은 값을 볼 수 있는지, 조건 조회에서 새로 추가된 row를 볼 수 있는지는 격리 수준에 따라 달라집니다.

격리 수준과 관련된 대표적인 현상은 다음과 같습니다.

| 현상 | 설명 |
| --- | --- |
| Dirty Read | 다른 트랜잭션이 아직 커밋하지 않은 변경 내용을 읽는 현상입니다. |
| Non-repeatable Read | 같은 트랜잭션 안에서 같은 row를 다시 읽었을 때 값이 달라지는 현상입니다. |
| Phantom Read | 같은 조건으로 다시 조회했을 때 처음에는 없던 row가 나타나는 현상입니다. |

격리 수준이 높아지면 허용되는 읽기 현상이 줄어들고, 동시에 실행되는 트랜잭션 사이의 대기나 잠금 비용이 늘어날 수 있습니다. 실제 동작은 데이터베이스의 구현 방식과 기본 설정에도 영향을 받습니다.

## 주요 격리 수준

스프링에서는 `@Transactional`의 `isolation` 속성으로 격리 수준을 지정할 수 있습니다.

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public User findUser(Long id) {
    return userRepository.findById(id);
}
```

별도로 지정하지 않으면 `Isolation.DEFAULT`가 사용됩니다. 이 경우 실제 격리 수준은 사용하는 데이터베이스의 기본 설정을 따릅니다.

같은 격리 수준 이름을 사용하더라도 실제 동작은 데이터베이스 구현 방식에 따라 달라질 수 있습니다. 따라서 `Isolation.DEFAULT`를 사용한다면 사용하는 데이터베이스의 기본 격리 수준을 확인해야 합니다.

| 격리 수준 | 동작 |
| --- | --- |
| `READ_UNCOMMITTED` | 다른 트랜잭션이 아직 커밋하지 않은 변경 내용도 읽을 수 있습니다. |
| `READ_COMMITTED` | 커밋된 데이터만 읽습니다. |
| `REPEATABLE_READ` | 같은 트랜잭션 안에서 같은 row를 반복해서 읽을 때 같은 값을 읽도록 보장합니다. |
| `SERIALIZABLE` | 여러 트랜잭션이 동시에 실행되더라도 직렬로 실행된 것처럼 보이도록 격리합니다. |

### READ_UNCOMMITTED

`READ_UNCOMMITTED`는 다른 트랜잭션이 아직 커밋하지 않은 변경 내용도 읽을 수 있는 격리 수준입니다.

이 수준에서는 Dirty Read가 발생할 수 있습니다. 다른 트랜잭션이 나중에 롤백할 데이터를 먼저 읽을 수 있으므로, 실제로 확정되지 않은 값을 기준으로 로직이 실행될 수 있습니다.

### READ_COMMITTED

`READ_COMMITTED`는 커밋된 데이터만 읽는 격리 수준입니다.

Dirty Read는 방지됩니다. 다만 같은 트랜잭션 안에서 같은 row를 두 번 읽는 동안 다른 트랜잭션이 그 row를 수정하고 커밋하면, 두 번째 조회에서 다른 값을 읽을 수 있습니다. 이 경우 Non-repeatable Read가 발생할 수 있습니다.

데이터베이스마다 기본 격리 수준은 다를 수 있습니다. `READ_COMMITTED`를 기본값으로 사용하는 데이터베이스도 있고, 다른 격리 수준을 기본값으로 사용하는 데이터베이스도 있습니다.

### REPEATABLE_READ

`REPEATABLE_READ`는 같은 트랜잭션 안에서 같은 row를 반복해서 읽을 때 같은 값을 읽도록 보장하는 격리 수준입니다.

Dirty Read와 Non-repeatable Read를 방지할 수 있습니다. 다만 조건 조회에서 새 row가 추가되는 Phantom Read 처리 방식은 데이터베이스 구현에 따라 달라질 수 있습니다.

예를 들어 같은 트랜잭션 안에서 `status = 'ACTIVE'` 조건으로 사용자 목록을 조회하는 동안, 다른 트랜잭션이 새로운 ACTIVE 사용자를 추가하고 커밋할 수 있습니다. 이 새 row가 같은 트랜잭션의 다음 조회에서 보이는지는 데이터베이스의 격리 수준 구현 방식에 따라 달라집니다.

### SERIALIZABLE

`SERIALIZABLE`은 가장 강한 격리 수준입니다. 여러 트랜잭션이 동시에 실행되더라도 직렬로 실행된 것처럼 보이도록 격리합니다.

Dirty Read, Non-repeatable Read, Phantom Read를 방지하는 방향으로 동작합니다. 대신 동시 실행되는 트랜잭션 사이에서 잠금과 대기가 늘어날 수 있습니다.

일관성이 매우 중요한 작업에서는 사용할 수 있지만, 모든 조회나 변경 작업에 무조건 적용하면 처리량이 줄어들 수 있습니다.

## 전파와 격리 수준의 차이

전파와 격리 수준은 모두 `@Transactional`에서 설정할 수 있지만, 다루는 문제가 다릅니다.

```java
@Transactional(
    propagation = Propagation.REQUIRED,
    isolation = Isolation.READ_COMMITTED
)
public void createOrder(OrderRequest request) {
    orderRepository.save(request.toOrder());
}
```

`propagation`은 이미 트랜잭션이 있을 때 기존 트랜잭션에 참여할지, 새 트랜잭션을 시작할지 결정합니다. 메서드 호출 관계에서 트랜잭션 경계를 어떻게 이어갈지 정하는 설정입니다.

`isolation`은 동시에 실행되는 다른 트랜잭션의 변경을 어느 수준까지 볼 수 있는지 결정합니다. 여러 트랜잭션이 같은 데이터를 읽고 수정할 때 읽기 일관성을 어떻게 보장할지 정하는 설정입니다.

전파는 호출 관계의 문제이고, 격리 수준은 동시성 읽기 문제입니다. 두 설정은 함께 사용할 수 있지만, 해결하려는 문제가 다릅니다.
