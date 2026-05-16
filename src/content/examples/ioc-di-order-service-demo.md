---
title: IoC와 DI 예제
post: ioc-and-di
order: 1
status: draft
---
관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 소속 게시글: [[posts/ioc-and-di|IoC와 DI, 그리고 Bean]]


## 예제 목표

- `OrderService`와 `OrderRepository` 예제로 IoC와 DI가 왜 필요한지 코드 변화로 확인합니다.
- 인터페이스를 도입하는 것만으로는 왜 충분하지 않은지 살펴봅니다.
- 생성자 주입으로 객체 생성 책임을 바깥으로 분리하는 과정을 확인합니다.
- 스프링에서 빈을 등록하는 두 가지 방식인 `@Bean` 등록과 컴포넌트 스캔을 비교합니다.

## 프로젝트 구조

예제는 단계별로 패키지를 나눠 두었습니다.

```text
example.iocdi
├── IocDiExampleApplication
├── step1.manual
├── step2.abstraction
├── step3.manualdi
├── step4.springconfig
└── step5.componentscan
```

- `step1.manual`: 서비스가 저장소 구현체를 직접 생성합니다.
- `step2.abstraction`: 인터페이스는 도입했지만 구현 선택은 여전히 서비스 안에 있습니다.
- `step3.manualdi`: 생성자 주입으로 객체 생성과 연결 책임을 외부로 분리합니다.
- `step4.springconfig`: `@Configuration`과 `@Bean`으로 빈을 명시적으로 등록합니다.
- `step5.componentscan`: 컴포넌트 스캔과 생성자 주입으로 빈 등록과 연결을 자동화합니다.

## DI 없이 직접 생성하는 구조

가장 먼저 `OrderService`가 `MemoryOrderRepository`를 직접 생성하는 구조를 봅니다.

```java
public class OrderService {

    private final MemoryOrderRepository orderRepository = new MemoryOrderRepository();

    public void placeOrder(String itemName) {
        orderRepository.save(itemName);
    }
}
```

이 구조에서는 `OrderService`가 두 가지 책임을 함께 가집니다.

- 주문 비즈니스 로직을 수행하는 책임
- 어떤 저장소 구현체를 만들고 연결할지 결정하는 책임

처음에는 단순해 보이지만, 저장소 구현을 바꾸거나 테스트에서 다른 구현체를 넣고 싶어질 때 바로 제약이 생깁니다. 사용하는 쪽이 생성과 연결까지 모두 담당하기 때문입니다.

## 인터페이스 분리

다음으로 저장소 역할을 인터페이스로 분리합니다.

```java
public interface OrderRepository {

    void save(String itemName);
}
```

그리고 `OrderService`는 인터페이스 타입에 의존하도록 바꿉니다.

```java
public class OrderService {

    private final OrderRepository orderRepository = new MemoryOrderRepository();

    public void placeOrder(String itemName) {
        orderRepository.save(itemName);
    }
}
```

이전보다는 나아졌지만 아직 핵심 문제가 남아 있습니다. `OrderService`는 타입 선언에서는 `OrderRepository`에 의존하지만, 실제 구현 선택은 여전히 `new MemoryOrderRepository()`로 직접 하고 있습니다.

즉, 역할과 구현을 구분했을 뿐이고 제어권은 아직 서비스 내부에 있습니다. 인터페이스 도입만으로 곧바로 DI가 되는 것은 아닙니다.

## 생성자 주입으로 바꾸기

이제 객체가 필요한 의존성을 직접 만들지 않고 외부에서 받도록 바꿉니다.

```java
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public void placeOrder(String itemName) {
        orderRepository.save(itemName);
    }
}
```

그리고 객체 생성과 연결은 별도의 조립기 역할 클래스가 담당합니다.

```java
public class OrderApp {

    public OrderService orderService() {
        OrderRepository orderRepository = new MemoryOrderRepository();
        return new OrderService(orderRepository);
    }
}
```

여기서 중요한 점은 `OrderService`가 더 이상 구현체를 직접 생성하지 않는다는 것입니다. 필요한 것은 `OrderRepository`라는 사실만 알고, 실제 구현체는 외부에서 전달받습니다.

이 지점이 DI의 핵심입니다. 또한 제어권이 서비스 내부에서 바깥으로 이동했다는 점에서 IoC를 함께 설명하기 좋습니다.

- `OrderService`는 객체를 사용하는 역할에 집중합니다.
- `OrderApp`은 객체를 생성하고 연결하는 역할을 맡습니다.

스프링이 없어도 DI는 가능합니다. 스프링은 이 조립 과정을 더 편리하고 일관되게 처리해 주는 도구입니다.

## 스프링 빈 등록 방식 비교

### `@Configuration`과 `@Bean`으로 명시적으로 등록

먼저 설정 클래스로 객체 생성과 연결을 드러내는 방식입니다.

```java
@Configuration
public class AppConfig {

    @Bean
    public OrderRepository orderRepository() {
        return new MemoryOrderRepository();
    }

    @Bean
    public OrderService orderService() {
        return new OrderService(orderRepository());
    }
}
```

이 방식에서는 어떤 객체를 빈으로 등록하는지, 어떤 객체가 어떤 의존성을 받는지 설정 코드에서 바로 확인할 수 있습니다. 외부 라이브러리 클래스처럼 소스에 애너테이션을 붙일 수 없는 경우에도 이 방식이 유용합니다.

### 컴포넌트 스캔으로 자동 등록

다음은 클래스에 애너테이션을 붙여 스프링이 자동으로 찾아 등록하게 하는 방식입니다.

```java
@Repository
public class MemoryOrderRepository implements OrderRepository {
}
```

```java
@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

```java
@Configuration
@ComponentScan(basePackageClasses = AutoConfig.class)
public class AutoConfig {
}
```

이 방식은 설정 코드가 줄어드는 장점이 있습니다. 대신 빈 등록 위치가 여러 클래스에 흩어질 수 있어서, 객체 생성과 연결 구조를 한눈에 보려면 코드를 따라가야 합니다.

정리하면 다음과 같습니다.

- 명시적 등록은 생성과 연결 과정이 분명하게 드러납니다.
- 자동 등록은 작성할 설정이 줄어들지만 구조가 분산될 수 있습니다.

## 실행 흐름 확인

루트 실행 클래스는 각 단계를 순서대로 실행합니다.

```java
public class IocDiExampleApplication {

    public static void main(String[] args) {
        Step1ManualDemo.run();
        Step2AbstractionDemo.run();
        Step3ManualDiDemo.run();
        Step4SpringConfigDemo.run();
        Step5ComponentScanDemo.run();
    }
}
```

이 예제는 콘솔 출력으로 설명하지 않고, 각 단계의 클래스 구조와 주석으로 의도를 드러내도록 구성했습니다. 따라서 코드를 읽을 때는 다음 질문을 기준으로 보면 됩니다.

1. 누가 구현체를 생성하는가
2. 누가 객체를 연결하는가
3. `OrderService`가 아는 것은 역할인가, 구현인가
4. 스프링 컨테이너는 어느 단계부터 개입하는가

핵심 흐름만 다시 정리하면 이렇습니다.

- `step1`: 사용자가 직접 생성하고 직접 연결합니다.
- `step2`: 역할은 분리했지만 구현 선택 책임은 남아 있습니다.
- `step3`: 생성자 주입으로 객체 생성 책임을 외부로 분리합니다.
- `step4`: 그 외부 조립기를 스프링 설정 클래스로 옮깁니다.
- `step5`: 빈 등록과 연결 일부를 스프링이 자동으로 처리합니다.

이 순서대로 보면 IoC, DI, Bean이 각각 따로 떨어진 개념이 아니라, 객체 생성과 연결 책임을 어떻게 다룰 것인가라는 하나의 흐름 안에서 이해된다는 점을 확인할 수 있습니다.
