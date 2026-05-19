---
title: IoC와 DI 예제
post: ioc-and-di
order: 1
status: published
---

관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 소속 게시글: [[posts/ioc-and-di|IoC와 DI, 그리고 Bean]]

## 예제 목표  

`OrderService`와 `OrderRepository` 구조를 단계별로 변경하면서 IoC와 DI가 필요한 이유를 살펴봅니다.

## 프로젝트 구조  

프로젝트 구조는 아래와 같습니다.

```text  
example.iocdi  
├── IocDiExampleApplication  
├── step1.manual  
├── step2.abstraction  
├── step3.manualdi  
├── step4.springconfig  
└── step5.componentscan  
```  

- `step1.manual`: 클래스 내부에서 필요한 의존 객체를 직접 생성합니다.  
- `step2.abstraction`: 의존 대상의 역할을 인터페이스로 분리하고 구현 클래스를 작성합니다.  
- `step3.manualdi`: 생성자를 통해 의존 객체를 외부에서 전달받도록 변경합니다.  
- `step4.springconfig`: 설정 클래스의 `@Bean` 메서드로 빈을 생성하고 등록합니다.  
- `step5.componentscan`: 컴포넌트 어노테이션과 스캔 설정으로 빈 등록 대상을 탐색합니다.

## DI 없이 직접 객체를 생성

먼저 `OrderService`가 레포지토리 구현체를 직접 생성하는 로직입니다.

```java  
public class OrderService {  
  
    private final OrderRepository orderRepository = new OrderRepository();  
  
    public void placeOrder(String itemName) {  
        orderRepository.save(itemName);  
    }  
}
```  

여기서 `OrderService`는 비즈니스 로직을 처리할 뿐만 아니라, 어떤 레포지토리 구현체를 사용할지 결정하고 직접 생성합니다.

  

레포지토리 구현체를 바꿔야 하는 상황을 가정해봅시다.  구현체를 바꾸는 일은 `OrderService`의 책임이 아닌데도, `OrderService` 코드를 수정해야 합니다.

  

의존 객체를 사용하는 클래스가 객체 생성과 연결까지 직접 담당하면, 비즈니스 로직과 객체 구성 코드가 한 클래스 안에 섞여 책임이 모호해집니다. 또한 테스트에서도 원하는 구현체를 외부에서 주입하기 어렵습니다.

## 인터페이스 분리

이전에는 `OrderService`가 `OrderRepository` 구현체를 직접 생성했습니다. 이번에는 인터페이스를 도입해 `OrderService`가 `OrderRepository`라는 인터페이스에 의존하도록 작성해봅시다.

```java  
public interface OrderRepository {  
  
    void save(String itemName);  
}
```  

`OrderService`를 구현체가 아니라 인터페이스에 의존하도록 수정합니다.

```java  
public class OrderService {  
  
    private final OrderRepository orderRepository = new OrderRepositoryImpl();  
  
    public void placeOrder(String itemName) {  
        orderRepository.save(itemName);  
    }  
}
```  

위 코드 또한 실제 사용할 구현체는 여전히 `OrderService` 에서 결정하고 있습니다. 필드 초기화 시점에 `new OrderRepositoryImpl()`를 직접적으로 호출하기 때문에, `OrderService`는 특정 구현체에 대한 생성 책임을 그대로 가지고 있습니다.

결국 레포지토리 구현체를 바꾸려면 `OrderService` 코드를 수정해야 합니다. 인터페이스를 도입해 역할과 구현을 나누었더라도, 구현체 생성 책임이 서비스 내부에 남아 있는 것입니다.

## 생성자 주입

이제 `OrderService`가 레포지토리 구현체를 직접 생성하지 않고, 생성자를 통해 외부에서 전달받도록 수정해봅시다.

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

`OrderService`는 이제 `OrderRepository` 인터페이스에만 의존합니다. 서비스 코드 안에는 `OrderRepositoryImpl`을 직접 생성하는 코드가 없고, 실제 구현체는 외부에서 생성되어 생성자로 전달됩니다.

`OrderApp`에서 레포지토리 구현체를 생성하고 `OrderService`에 전달합니다.

```java
public class OrderApp {  
  
    public OrderService orderService() {  
        OrderRepository orderRepository = new OrderRepositoryImpl();  
        return new OrderService(orderRepository);  
    }  
}
```

여기서는 레포지토리 구현체를 바꿔도 `OrderService` 코드를 수정하지 않아도 됩니다. 예를 들어 `OrderRepositoryImpl` 대신 다른 구현체를 사용하려면, `OrderApp`에서 생성하는 객체만 바꾸면 됩니다.

테스트에서도 같은 방식으로 테스트용 구현체를 전달할 수 있습니다. `OrderService`는 전달받은 `OrderRepository`를 사용할 뿐이므로, 실제 구현체를 넣을지 테스트용 구현체를 넣을지는 객체를 생성하는 쪽에서 결정할 수 있습니다.

이와 같이 의존 객체를 클래스 내부에서 직접 생성하지 않고 외부에서 전달받는 구조가 DI입니다. `OrderService`가 레포지토리 구현체를 직접 생성하지 않고, `OrderApp`이 생성한 객체를 생성자로 전달받습니다.

## 스프링 빈 등록 방식 비교  

### @Configuration과 @Bean

먼저 `@Configuration`과 `@Bean`을 사용하여 객체 생성과 의존관계 연결을 작성하는 방식입니다.  

```java  
@Configuration  
public class AppConfig {  
  
    @Bean  
    public OrderRepository orderRepository() {  
        return new OrderRepositoryImpl();  
    }  
  
    @Bean  
    public OrderService orderService() {  
        return new OrderService(orderRepository());  
    }  
}
```  

이 방식에서는 어떤 객체를 빈으로 등록하는지, 어떤 빈이 어떤 의존성을 받는지 설정 코드에서 확인할 수 있습니다. 외부 라이브러리 클래스 또한 `@Bean`으로 등록할 수 있습니다.

### 컴포넌트 스캔

클래스에 어노테이션을 붙이고, 스프링이 스캔 범위에서 해당 클래스를 찾아 빈으로 등록하는 방식입니다.

```java  
@Repository  
public class OrderRepositoryImpl implements OrderRepository {  
  
    @Override  
    public void save(String itemName) {
    }  
}
```  

```java  
@Service  
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

```java  
@Configuration  
@ComponentScan(basePackageClasses = AppConfig.class)  
public class AppConfig {
}
```  

이 방식에서는 설정 클래스에 빈 등록 메서드를 하나씩 작성하지 않아도 됩니다. 대신 빈 등록 정보가 각 클래스의 어노테이션에 나뉘어 있으므로, 객체 생성과 연결 구조를 확인하려면 관련 클래스를 함께 살펴봐야 합니다.
