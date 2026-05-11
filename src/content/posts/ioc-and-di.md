---
title: "IoC와 DI"
series: spring-core
order: 2
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 이전 글: [[what-is-spring-framework|스프링 프레임워크란 무엇인가]]
- 다음 글: [[bean-container-and-application-context|빈 컨테이너와 ApplicationContext]]

## IoC란

IoC는 Inversion of Control의 약자입니다. 보통 **제어의 역전**이라고 부릅니다.

객체지향 코드를 단순하게 작성할 때는 필요한 객체를 직접 만들고, 필요한 곳에 직접 연결하는 방식이 흔합니다. 예를 들어 서비스가 저장소를 써야 하면 서비스 내부에서 저장소 구현 객체를 직접 생성하는 식입니다. 이런 구조에서는 객체 생성, 연결, 사용의 흐름을 애플리케이션 코드가 직접 책임집니다.

스프링은 객체를 만들고 관리하고 연결하는 일을 개발자가 일일이 처리하는 대신, 스프링 컨테이너가 맡습니다. 개발자는 객체를 어떻게 조립할지보다, 어떤 역할의 객체가 필요한지와 비즈니스 로직 자체에 더 집중할 수 있습니다.

즉, IoC의 핵심은 객체를 다루는 주도권의 일부를 애플리케이션 코드 밖으로 넘기는 데 있습니다. 스프링에서는 그 역할을 컨테이너가 담당합니다.

## DI란

DI는 `Dependency Injection`의 약자입니다. 보통 **의존성 주입**이라고 부릅니다.

여기서 의존성이란 어떤 객체가 자신의 일을 처리하기 위해 다른 객체를 필요로 하는 관계를 뜻합니다. 예를 들어 `OrderService`가 주문 정보를 저장하기 위해 `OrderRepository`를 사용한다면, `OrderService`는 `OrderRepository`에 의존합니다.

문제는 이 의존성을 객체 내부에서 직접 만들어 버릴 때 생깁니다. 서비스 클래스 안에서 저장소 구현체를 직접 생성하면, 서비스는 특정 구현에 강하게 연결됩니다. 저장소 구현을 바꾸기 어려워지고, 테스트할 때 가짜 객체를 넣기도 번거로워집니다.

DI는 이런 문제를 줄이기 위한 방법입니다. 객체가 필요한 의존성을 스스로 만들지 않고, 외부에서 받아 사용하도록 하는 방식입니다. 스프링에서는 이 주입 과정을 컨테이너가 처리합니다.

정리하면, IoC는 객체 관리의 주도권을 외부로 넘기는 큰 개념이고, DI는 이를 실제 코드 수준에서 풀어내는 대표적인 방법입니다.

## DI 방식

스프링에서 의존성을 주입하는 방식은 크게 생성자 주입, 세터 주입, 필드 주입으로 나눌 수 있습니다. 셋 다 외부에서 의존성을 넣어 준다는 점은 같지만, 객체가 만들어지는 방식과 코드의 안정성은 꽤 다릅니다.

### 생성자 주입

생성자 주입은 객체를 만들 때 생성자를 통해 의존성을 받는 방식입니다.

객체를 생성하는 순간 필요한 의존성이 함께 전달되기 때문에, 어떤 값이 반드시 필요한지 코드만 봐도 알 수 있습니다. 또한 필드를 `final`로 둘 수 있어, 객체가 만들어진 뒤 의존성이 바뀌지 않도록 만들기 쉽습니다.

스프링에서는 생성자가 하나뿐이면 `@Autowired`를 생략해도 자동으로 주입합니다.

```java
@Component
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

### 세터 주입

세터 주입은 setter 메서드를 통해 의존성을 받는 방식입니다.

이 방식은 객체를 먼저 만든 뒤, 필요한 값을 나중에 넣을 수 있습니다. 그래서 없어도 객체 자체는 만들 수 있는 선택적 의존성에 비교적 잘 맞습니다.

다만 객체가 생성될 때 필요한 값이 모두 준비된다는 보장이 약합니다. 세터 호출이 빠지면 의존성이 비어 있는 상태로 객체가 만들어질 수 있고, 그 상태로 실행되면 오류가 날 수 있습니다.

```java
@Component
public class OrderService {

    private OrderRepository orderRepository;

    @Autowired
    public void setOrderRepository(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

### 필드 주입

필드 주입은 필드에 직접 의존성을 넣는 방식입니다.

코드는 짧아 보이지만, 실무에서는 보통 권장하지 않습니다. 어떤 의존성이 필요한지 생성자만 보고는 알 수 없고, 스프링 컨테이너 없이 객체를 직접 만들어 테스트하기도 불편합니다. 또한 `final`을 사용할 수 없어 객체 상태를 더 단단하게 고정하기 어렵습니다.

```java
@Component
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
}
```

## 생성자 주입을 권장하는 이유

스프링에서 생성자 주입을 권장하는 이유는 분명합니다. 코드가 더 명확해지고, 객체를 더 안전하게 만들 수 있으며, 테스트도 쉬워지기 때문입니다.

첫째, 필수 의존성이 분명하게 드러납니다. 생성자 파라미터를 보면 이 객체가 어떤 객체 없이는 동작할 수 없는지 바로 알 수 있습니다.

둘째, 불완전한 객체가 만들어질 가능성이 줄어듭니다. 생성자 주입은 필요한 의존성이 없으면 객체를 만들 수 없습니다. 반면 세터 주입은 주입이 빠진 채로 객체가 먼저 만들어질 수 있습니다.

셋째, `final`을 사용할 수 있습니다. 생성 이후 의존성이 바뀌지 않는 구조는 상태를 예측하기 쉽고, 코드도 더 안정적으로 유지할 수 있습니다.

넷째, 테스트가 쉽습니다. 스프링 컨테이너를 띄우지 않아도 테스트 코드에서 직접 객체를 만들고, 원하는 구현체를 넣어 검증할 수 있습니다.

다섯째, 순환 참조 같은 설계 문제를 더 빨리 드러냅니다. 서로가 서로를 필요로 하는 구조가 있으면 애플리케이션 시작 단계에서 바로 문제가 보이기 때문에, 숨겨진 설계 문제를 늦게 발견하는 일을 줄일 수 있습니다.

이런 이유로 특별한 사정이 없다면 생성자 주입을 기본 선택으로 두는 편이 가장 안정적입니다.

## 예시

먼저 서비스가 저장소 구현체를 직접 생성하는 코드를 보겠습니다.

```java
public class OrderService {

    private final OrderRepository orderRepository = new JdbcOrderRepository();

    public void order() {
        System.out.println("주문 처리");
    }
}
```

이 코드는 `OrderService`가 `JdbcOrderRepository`에 직접 묶여 있습니다. 저장소 구현이 바뀌면 서비스 코드도 함께 수정해야 하고, 테스트에서 다른 구현을 넣기도 어렵습니다.

생성자 주입으로 바꾸면 구조가 달라집니다.

```java
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public void order() {
        System.out.println("주문 처리");
    }
}
```

이제 `OrderService`는 구체적인 구현체가 아니라 `OrderRepository`라는 역할에 의존합니다. 어떤 구현을 쓸지는 외부에서 정하면 됩니다.

테스트 코드도 훨씬 단순해집니다.

```java
class FakeOrderRepository implements OrderRepository {
}

@Test
void 주문_서비스를_테스트한다() {
    OrderRepository fakeRepository = new FakeOrderRepository();
    OrderService orderService = new OrderService(fakeRepository);

    orderService.order();
}
```

이처럼 생성자 주입은 구현 교체와 테스트를 쉽게 만들어 줍니다.

## Quiz

1. IoC와 DI는 어떻게 다르며, 어떤 관계를 가집니까?

2. 서비스 클래스 안에서 의존 객체를 직접 생성하면 어떤 문제가 생깁니까?

3. 세터 주입은 어떤 경우에 사용할 수 있으며, 어떤 한계가 있습니까?

4. 필드 주입이 간단해 보여도 실무에서 잘 권장되지 않는 이유는 무엇입니까?

5. 생성자 주입이 테스트 작성에 유리한 이유를 설명해 보세요.