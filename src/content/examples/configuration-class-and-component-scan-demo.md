---
title: 구성 클래스와 컴포넌트 스캔 예제
post: configuration-class-and-component-scan
order: 1
status: published
---

관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 소속 게시글: [[posts/configuration-class-and-component-scan|구성 클래스와 컴포넌트 스캔]]

## 예제 목표

이 예제는 `@Configuration`, `@Bean`, `@ComponentScan`을 기준으로 빈 등록 방식과 의존관계 구성을 비교합니다.

먼저 `@Configuration` 클래스가 프록시로 등록되는 이유를 살펴봅니다. 이어서 `@Bean`을 사용한 수동 등록과 `@ComponentScan`을 사용한 방식을 비교하며, 각 방식에서 빈이 어떻게 등록되고 연결되는지 정리합니다.

## 프로젝트 구조

프로젝트 구조는 아래와 같습니다.

```text
example.configscan
├── config
│   └── ScanConfig
├── domain
│   ├── DiscountPolicy
│   ├── FixedDiscountPolicy
│   ├── MemoryOrderRepository
│   ├── OrderRepository
│   └── OrderService
├── manual
│   └── AppConfig
├── scan
│   ├── ScanDiscountPolicy
│   ├── ScanOrderRepository
│   └── ScanOrderService
├── step1.configuration
├── step2.beanregistration
└── step3.componentscan
```

- `manual`: `@Configuration`과 `@Bean`을 사용한 수동 등록 예제 패키지입니다.
- `scan`: 컴포넌트 스캔으로 등록할 클래스가 있는 패키지입니다.
- `step1`~`step3`: 설정 클래스 프록시, `@Bean` 수동 등록, 컴포넌트 스캔을 단계별로 확인하는 실행 예제 패키지입니다.

## @Configuration 클래스

`@Configuration` 클래스는 기본 설정에서 스프링이 생성한 프록시 클래스로 등록됩니다. 이 프록시는 같은 설정 클래스 안에서 `@Bean` 메서드를 직접 호출하더라도, 매번 새 객체를 생성하지 않고 컨테이너에 등록된 빈을 반환하도록 동작합니다.

```java
AppConfig appConfigBean = context.getBean(AppConfig.class);

boolean isProxy = appConfigBean.getClass().getName().contains("SpringCGLIB"); // true
boolean sameRepositoryInstance = orderService.getOrderRepository() == orderRepository; // true
```

`AppConfig`는 원본 클래스 그대로 등록되지 않고, 스프링이 생성한 프록시 클래스 형태로 등록됩니다.

또한 `orderService()` 안에서 `orderRepository()`를 직접 호출하더라도, 최종적으로 같은 `OrderRepository` 빈 인스턴스가 사용됩니다.

`@Configuration` 프록시는 `@Bean` 메서드 호출을 가로채 컨테이너가 관리하는 싱글톤 빈을 반환합니다. 이 때문에 설정 클래스 내부에서 `@Bean` 메서드를 호출해 의존 객체를 전달하더라도, 이미 등록된 빈 인스턴스가 재사용됩니다.

## @Bean으로 수동 등록하기

`@Bean` 메서드는 반환한 객체를 스프링 빈으로 등록합니다. 메서드 이름은 기본 빈 이름으로 사용됩니다.

```java
@Configuration
public class AppConfig {

    @Bean
    public OrderRepository orderRepository() {
        return new MemoryOrderRepository();
    }

    @Bean
    public DiscountPolicy discountPolicy() {
        return new FixedDiscountPolicy(1_000);
    }

    @Bean
    public OrderService orderService() {
        return new OrderService(orderRepository(), discountPolicy());
    }
}
```

이 방식에서는 어떤 구현체를 빈으로 등록하는지, 생성자에 어떤 값을 전달하는지 설정 코드에 직접 드러납니다. 예제의 `orderRepository`, `discountPolicy`, `orderService`는 각각 `@Bean` 메서드 이름을 기본 빈 이름으로 사용합니다.

`@Bean`을 사용한 수동 등록은 구현체 선택과 의존관계 조립을 설정 코드에서 명시적으로 관리할 때 적합합니다.

## @ComponentScan으로 자동 등록하기

`@ComponentScan`은 지정한 패키지 아래에서 컴포넌트 후보를 찾아 빈으로 등록합니다.

```java
@Configuration
@ComponentScan(basePackages = "example.configscan.scan")
public class ScanConfig {
}
```

스캔 대상 패키지에는 `@Repository`, `@Component`, `@Service`가 붙은 클래스가 있습니다. `@Repository`와 `@Service`는 `@Component`를 기반으로 한 어노테이션이므로, 컴포넌트 스캔 대상에 포함됩니다.

```java
@Repository
public class ScanOrderRepository implements OrderRepository {
}

@Component
public class ScanDiscountPolicy implements DiscountPolicy {
}

@Service
public class ScanOrderService {

    private final OrderRepository orderRepository;
    private final DiscountPolicy discountPolicy;

    public ScanOrderService(OrderRepository orderRepository, DiscountPolicy discountPolicy) {
        this.orderRepository = orderRepository;
        this.discountPolicy = discountPolicy;
    }
}
```

이 방식에서는 설정 클래스에 `@Bean` 메서드를 하나씩 작성하지 않아도 됩니다. 스프링은 스캔 대상 패키지에서 컴포넌트 후보를 찾고, 클래스 이름을 기반으로 기본 빈 이름을 생성합니다.

예제의 `ScanOrderService`, `ScanOrderRepository`, `ScanDiscountPolicy`는 각각 `scanOrderService`, `scanOrderRepository`, `scanDiscountPolicy`라는 이름으로 등록됩니다.

`ScanOrderService`는 생성자를 통해 `OrderRepository`와 `DiscountPolicy`를 주입받습니다. 이처럼 컴포넌트 스캔 방식에서는 빈 등록은 어노테이션과 스캔 설정으로 처리되고, 의존관계는 생성자 주입을 통해 구성됩니다.