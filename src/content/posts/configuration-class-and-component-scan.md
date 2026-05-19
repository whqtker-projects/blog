---
title: 구성 클래스와 컴포넌트 스캔
series: spring-core
order: 5
status: published
tags:
  - graph/post
---

관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 이전 글: [[bean-lifecycle-and-scope|빈 생명주기와 스코프]]
- 예제: [[examples/configuration-class-and-component-scan-demo|구성 클래스와 컴포넌트 스캔 예제]]

## @Configuration이란

`@Configuration`은 스프링 설정 클래스에 설정하는 어노테이션입니다.

스프링 설정 클래스는 스프링 컨테이너가 등록할 빈 정보과 의존관계 정보를 담는 클래스입니다. 개발자는 이 클래스 안에서 `@Bean` 메서드를 작성해 어떤 객체를 스프링 빈으로 등록할지 직접 지정할 수 있습니다.

```java
@Configuration
public class AppConfig {

    @Bean
    public OrderService orderService(OrderRepository orderRepository) {
        return new OrderService(orderRepository);
    }

    @Bean
    public OrderRepository orderRepository() {
        return new JdbcOrderRepository();
    }
}
```

위 코드에서 `AppConfig`는 스프링 설정 클래스입니다. `orderService()`와 `orderRepository()` 메서드는 각각 스프링 빈을 등록합니다. 스프링 컨테이너는 이 설정 정보를 읽고, **메서드가 반환하는 객체를 빈으로 관리합니다.**

`@Configuration` 클래스 또한 스프링 빈으로 등록됩니다. 스프링은 이 클래스를 프록시로 감싸서, **`@Bean` 메서드가 여러 번 호출되더라도 싱글톤 빈이 중복 생성되지 않도록** 처리합니다.

```java
@Configuration
public class AppConfig {

    @Bean
    public OrderService orderService() {
        return new OrderService(orderRepository());
    }

    @Bean
    public OrderRepository orderRepository() {
        return new JdbcOrderRepository();
    }
}
```

같은 설정 클래스 안에서 `@Bean` 메서드를 직접 호출하는 코드입니다.

코드만 보면 `orderService()`가 `orderRepository()`를 직접 호출하므로, 호출할 때마다 새로운 `JdbcOrderRepository` 객체가 만들어질 것처럼 보일 수 있습니다. 그러나 `@Configuration`이 적용된 설정 클래스에서는 스프링이 설정 클래스를 프록시로 감싸고, 이미 컨테이너에 등록된 빈이 있으면 해당 빈을 반환하도록 처리합니다.

따라서 싱글톤 스코프의 빈은 설정 클래스 내부에서 여러 번 호출되더라도 컨테이너가 관리하는 동일한 인스턴스로 유지됩니다.

## @Bean을 이용한 빈 수동 등록

![[Pasted image 20260514231320.png]]

`@Bean`은 **메서드가 반환하는 객체를 스프링 빈으로 등록하는 어노테이션**입니다.

`@Component` 계열 어노테이션은 클래스 자체를 스캔해서 빈으로 등록하지만, `@Bean`은 설정 클래스 안의 메서드를 통해 빈을 등록합니다. 객체 생성 과정을 코드로 직접 작성할 수 있습니다.

```java
@Configuration
public class AppConfig {

    @Bean
    public OrderRepository orderRepository() {
        return new JdbcOrderRepository();
    }
}
```

위 코드에서 `orderRepository()` 메서드가 반환하는 `JdbcOrderRepository` 객체는 스프링 빈으로 등록됩니다. 기본 빈 이름은 메서드 이름인 `orderRepository`가 됩니다.

또한 `name` 속성으로 빈 이름을 직접 지정할 수도 있습니다.

```java
@Configuration
public class AppConfig {

    @Bean(name = "jdbcOrderRepository")
    public OrderRepository orderRepository() {
        return new JdbcOrderRepository();
    }
}
```

`@Bean`을 사용하면 외부 라이브러리 객체도 스프링 빈으로 등록할 수 있습니다. **외부 라이브러리 클래스에는 직접 `@Component`를 붙일 수 없기 때문에**, 설정 클래스에서 객체를 생성해 빈으로 등록합니다.

```java
@Configuration
public class ExternalConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

`@Bean` 을 사용하면 어떤 구현체를 사용할지, 생성자에 어떤 값을 넣을지, 초기 설정을 어떻게 적용할지 직접 작성할 수 있고, 이를 명시적으로 보여줄 수 있으나, 등록해야 할 빈이 많아지면 설정 코드도 함께 늘어납니다.

## 컴포넌트 스캔

![[Pasted image 20260514231915.png]]

컴포넌트 스캔은 스프링이 지정된 패키지 범위에서 빈 등록 대상 클래스를 찾아 스프링 빈으로 등록하는 방식입니다.

클래스에 `@Component` 또는 그 하위 어노테이션을 붙이면 컴포넌트 스캔 대상이 됩니다.

```java
@Component
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

위 클래스가 컴포넌트 스캔 범위에 포함되어 있다면, 스프링은 `OrderService`를 빈으로 등록합니다. 생성자에 필요한 `OrderRepository`가 있으면 컨테이너에서 해당 빈을 찾아 주입합니다.

컴포넌트 스캔을 사용하면 개발자가 설정 클래스에 모든 빈을 하나씩 작성하지 않아도 됩니다. 애플리케이션 내부에서 작성한 클래스는 보통 어노테이션을 붙여 자동으로 등록합니다.

스프링 부트에서는 `@SpringBootApplication` 안에 `@ComponentScan`이 포함되어 있습니다. 따라서 메인 애플리케이션 클래스가 있는 패키지와 그 하위 패키지는 기본적으로 스캔 대상이 됩니다.

```java
@SpringBootApplication
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}
```

이 구조에서는 `OrderApplication`이 위치한 패키지와 그 하위 패키지 아래에 있는 `@Component`, `@Service`, `@Repository`, `@Controller` 클래스가 자동으로 빈 등록 대상이 됩니다.

### @ComponentScan 동작 원리

`@ComponentScan`은 스캔할 패키지 범위를 지정하고, 그 범위 안에서 빈 등록 대상 클래스를 찾습니다.

```java
@Configuration
@ComponentScan(basePackages = "com.example.order")
public class AppConfig {
}
```

위 설정은 `com.example.order` 패키지와 그 하위 패키지를 스캔합니다. 스프링은 해당 범위에서 `@Component`가 붙은 클래스를 찾고, 빈으로 등록합니다.

컴포넌트 스캔 대상이 되는 대표적인 어노테이션은 다음과 같습니다.

```java
@Component
@Service
@Repository
@Controller
```

`@Service`, `@Repository`, `@Controller`는 내부적으로 `@Component`를 포함하므로, 스프링은 이 어노테이션들이 붙은 클래스도 빈 등록 대상으로 인식합니다.

컴포넌트 스캔으로 빈이 등록되면, 빈 이름은 기본적으로 클래스 이름을 기준으로 정해집니다. 클래스 이름의 첫 글자를 소문자로 바꾼 이름이 기본 빈 이름이 됩니다.

```java
@Service
public class OrderService {
}
```

예를 들어 위 클래스의 기본 빈 이름은 `orderService`입니다.

빈 이름을 직접 지정할 수도 있습니다.

```java
@Service("orderServiceV1")
public class OrderService {
}
```

컴포넌트 스캔은 편리하지만, 스캔 범위가 넓어질수록 의도하지 않은 클래스가 빈으로 등록될 수 있습니다. 따라서 보통 메인 애플리케이션 클래스는 프로젝트의 최상위 패키지에 두고, 그 하위 패키지 안에 컴포넌트를 배치합니다.

### @Component, @Service, @Repository, @Controller

`@Component`는 컴포넌트 스캔을 통해 스프링 빈으로 등록할 수 있는 일반적인 어노테이션입니다.

```java
@Component
public class PasswordEncoder {
}
```

`@Service`는 서비스 계층의 클래스에 사용합니다. 비즈니스 로직을 처리하는 클래스라는 의미를 코드에 드러냅니다.

```java
@Service
public class OrderService {
}
```

`@Repository`는 데이터 접근 계층의 클래스에 사용합니다. 데이터베이스나 외부 저장소와 통신하는 객체에 붙입니다.

```java
@Repository
public class JdbcOrderRepository implements OrderRepository {
}
```

`@Controller`는 웹 요청을 처리하는 컨트롤러 클래스에 사용합니다. 스프링 MVC에서 요청 매핑과 함께 사용됩니다.

```java
@Controller
public class OrderController {
}
```

`@Component` 를 사용하지 않은 이유는 클래스의 역할을 코드에 드러내기 위해서입니다. `@Service`는 서비스 계층, `@Repository`는 데이터 접근 계층, `@Controller`는 웹 계층을 나타냅니다. 물론 `@Service`, `@Repository`, `@Controller` 대신 `@Component` 를 사용해도 됩니다.

`@Repository`는 데이터 접근 예외 변환과도 관련이 있습니다. 스프링은 `@Repository`가 붙은 클래스에서 발생한 데이터 접근 예외를 스프링의 `DataAccessException` 계층으로 변환할 수 있습니다.

## @Bean과 @ComponentScan의 선택 기준

`@Bean`과 `@ComponentScan`은 모두 스프링 빈을 등록하는 방법입니다. `@Bean`은 설정 클래스에서 메서드가 반환하는 객체를 빈으로 등록하고, `@ComponentScan`은 어노테이션이 붙은 클래스를 찾아 빈으로 등록합니다.

애플리케이션 내부에서 직접 작성한 서비스, 레포지토리, 컨트롤러는 보통 `@ComponentScan`으로 등록합니다. 클래스의 역할이 `@Service`, `@Repository`, `@Controller` 같은 어노테이션으로 드러나고, 설정 클래스에 빈 등록 코드를 따로 작성하지 않아도 됩니다.

```java
@Service
public class OrderService {
}
```

외부 라이브러리 객체나 생성 과정이 복잡한 객체는 `@Bean`으로 등록하는 편이 적절합니다. 소스 코드를 수정할 수 없는 클래스에는 `@Component`를 붙일 수 없고, 생성 과정에서 별도 설정값이나 초기화 코드가 필요할 수 있기 때문입니다.

```java
@Configuration
public class JsonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

같은 타입의 구현체가 여러 개 있고, 어떤 구현체를 사용할지 명확하게 지정해야 하는 경우에도 `@Bean`을 사용할 수 있습니다.

```java
@Configuration
public class RepositoryConfig {

    @Bean
    public OrderRepository orderRepository() {
        return new JdbcOrderRepository();
    }
}
```

`@ComponentScan`은 애플리케이션 내부 클래스처럼 반복적으로 등록해야 하는 빈에 사용하기 좋습니다. `@Bean`은 외부 라이브러리 객체, 생성 설정이 필요한 객체, 특정 구현체를 명시적으로 선택해야 하는 객체를 등록할 때 사용합니다.
