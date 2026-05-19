---
title: Bean 컨테이너와 ApplicationContext 예제
post: bean-container-and-application-context
order: 1
status: published
---

관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 소속 게시글: [[posts/bean-container-and-application-context|Bean 컨테이너와 ApplicationContext]]

## 예제 목표

`BeanFactory`는 스프링 빈을 조회하고 관리하는 기본 인터페이스입니다. `ApplicationContext`는 `BeanFactory`의 빈 관리 기능을 포함하면서, 메시지 소스, 환경 정보, 이벤트 발행, 리소스 조회 같은 애플리케이션 기능을 함께 제공합니다.

이 예제에서는 `AnnotationConfigApplicationContext`, `ClassPathXmlApplicationContext`, `GenericWebApplicationContext`로 컨테이너를 구성하고, 각 구현체가 어떤 설정 방식과 실행 환경에 맞는지 코드로 비교합니다.

## 프로젝트 구조

예제 프로젝트는 다음 구조로 구성되어 있습니다.  

```text  
example.beancontainer  
├── config  
│ ├── AppConfig  
│ └── DuplicateBeanConfig  
├── domain  
│ ├── DiscountPolicy  
│ ├── FixedDiscountPolicy
│ ├── MemberRepository
│ ├── MemberRepositoryImpl
│ └── OrderService  
├── event  
│ ├── OrderCreatedEvent  
│ └── OrderCreatedEventListener  
├── step1.beanfactory  
├── step2.applicationcontext  
├── step3.sametype  
├── step4.messagesource  
├── step5.environment  
├── step6.event  
├── step7.resource
├── step8.xmlcontext
└── step9.webcontext
```  

- `config`: 빈 등록과 의존관계 설정에 사용하는 설정 클래스가 있는 패키지입니다.
- `domain`: 컨테이너에 빈으로 등록할 예제 도메인 클래스가 있는 패키지입니다.
- `event`: 이벤트 객체와 이벤트 리스너 클래스가 있는 패키지입니다.
- `step1`~`step7`: 빈 조회와 `ApplicationContext`의 주요 기능을 확인하는 실행 예제 패키지입니다.
- `step8`: XML 설정 파일을 읽는 `ClassPathXmlApplicationContext` 예제 패키지입니다.
- `step9`: 웹 환경에서 사용할 수 있는 `GenericWebApplicationContext` 예제 패키지입니다.

## 설정

`AppConfig`는 `@Configuration` 설정 클래스이며, 예제에서 사용할 `MemberRepository`, `DiscountPolicy`, `OrderService` 등을 빈으로 등록합니다.

```java  
@Configuration  
@PropertySource("classpath:application.properties")  
public class AppConfig {  
  
    @Bean  
    public MemberRepository memberRepository() {  
        return new MemberRepositoryImpl();  
    }  
  
    @Bean  
    public DiscountPolicy discountPolicy() {  
        return new FixedDiscountPolicy(1_000);  
    }  
  
    @Bean  
    public OrderService orderService() {  
        return new OrderService(memberRepository(), discountPolicy());  
    }  
  
    @Bean  
    public MessageSource messageSource() {  
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();  
        messageSource.setBasenames("messages");  
        messageSource.setDefaultEncoding("UTF-8");  
        messageSource.setFallbackToSystemLocale(false);  
        return messageSource;  
    }  
  
    @Bean  
    public OrderCreatedEventListener orderCreatedEventListener() {  
        return new OrderCreatedEventListener();  
    }  
}
```  

## BeanFactory와 빈 조회

`AnnotationConfigApplicationContext`는 자바 설정 클래스를 기반으로 스프링 컨테이너를 구성하는 `ApplicationContext` 구현체입니다. `AppConfig.class`를 전달하면 설정 클래스의 `@Bean` 메서드를 읽고, 메서드가 반환한 객체를 스프링 빈으로 등록합니다.

`AnnotationConfigApplicationContext`에서 `getBeanFactory()`를 호출하면, 컨테이너 내부의 `BeanFactory`를 가져올 수 있습니다.

```java
public static void run() {  
    AnnotationConfigApplicationContext context =  
            new AnnotationConfigApplicationContext(AppConfig.class);  
    BeanFactory beanFactory = context.getBeanFactory();
  
    OrderService orderService = beanFactory.getBean("orderService", OrderService.class);
    String createdOrder = orderService.createOrder("member-1", "keyboard", 20_000);
    
    // false
    boolean supportsMessageSource = beanFactory instanceof MessageSource; 
    context.close();
}
```

`BeanFactory`는 `getBean()`으로 컨테이너에 등록된 빈을 이름과 타입 기준으로 조회합니다.

`BeanFactory` 인터페이스는 빈 생성과 조회에 초점을 둡니다. `MessageSource`를 상속하지 않기 때문에, 위 코드의 `supportsMessageSource` 값은 `false`가 됩니다.

## ApplicationContext와 빈 조회

같은 `AnnotationConfigApplicationContext`를 `ApplicationContext`로 사용하면 빈 조회뿐 아니라 메시지, 환경 정보, 이벤트, 리소스 관련 API도 사용할 수 있습니다.

```java
public static void run() {  
    AnnotationConfigApplicationContext context =  
            new AnnotationConfigApplicationContext(AppConfig.class);
  
    OrderService orderService = context.getBean(OrderService.class);  
    String createdOrder = orderService.createOrder("member-1", "monitor", 50_000);  

    // true
    boolean supportsMessageSource = context instanceof MessageSource;
    boolean supportsEnvironment = context.getEnvironment() instanceof Environment;  
    boolean supportsEventPublisher = context.getBean(ApplicationEventMulticaster.class) != null;
    boolean supportsResourceLoader = context instanceof ResourceLoader;

    context.close();
}
```

`ApplicationContext`도 `getBean()`으로 빈을 조회할 수 있습니다. 또한 `MessageSource`, `ApplicationEventPublisher`, `ResourceLoader` 계열 기능을 제공하므로 메시지 조회, 이벤트 발행, 리소스 조회 API를 함께 사용할 수 있습니다.

## 동일한 타입의 빈 조회

동일한 타입의 빈을 조회하는 경우 어떻게 동작하는지 확인해봅시다.

`DuplicateBeanConfig`는 `DiscountPolicy` 타입 빈을 두 개 등록합니다.  

```java  
@Configuration  
public class DuplicateBeanConfig {  
  
    @Bean  
    public DiscountPolicy fixedDiscountPolicy() {  
        return new FixedDiscountPolicy(1_000);  
    }  
  
    @Bean  
    public DiscountPolicy specialDiscountPolicy() {  
        return new FixedDiscountPolicy(2_000);  
    }  
}
```  

이 상태에서 `context.getBean(DiscountPolicy.class)`를 호출하면 `NoUniqueBeanDefinitionException`이 발생합니다.

```java  
DiscountPolicy discountPolicy = context.getBean(DiscountPolicy.class);  
```  

컨테이너에는 `DiscountPolicy` 타입의 빈이 두 개 등록되어 있기 때문에, 타입만으로는 어떤 빈을 선택해야 할지 결정할 수 없습니다.

같은 타입의 빈이 여러 개 있을 때는 빈 이름을 지정하여 조회하거나, `getBeansOfType()`으로 지정한 타입의 빈을 모두 조회할 수 있습니다.

```java
Map<String, DiscountPolicy> beans = context.getBeansOfType(DiscountPolicy.class);
int fixedDiscountAmount =
        context.getBean("fixedDiscountPolicy", DiscountPolicy.class).discount("VIP", 10_000);
```

`getBeansOfType()`은 해당 타입의 빈을 이름과 인스턴스 쌍으로 반환합니다. 특정 빈 하나만 필요하다면 `getBean(String, Class)` 형태로 빈 이름과 타입을 함께 지정합니다.

## ApplicationContext의 주요 기능  

`ApplicationContext`는 빈 조회 기능에 더해 메시지, 환경 정보, 이벤트, 리소스 관련 API를 제공합니다.

### 메시지 소스

같은 메시지 코드를 서로 다른 로케일로 조회합니다.

```java  
String englishMessage = context.getMessage(  
"order.created", new Object[]{"desk", 12_000}, Locale.ENGLISH);  
  
String koreanMessage = context.getMessage(  
"order.created", new Object[]{"desk", 12_000}, Locale.KOREAN);  
```  

`AppConfig`에서 `ResourceBundleMessageSource`를 `messageSource` 빈으로 등록합니다. `ApplicationContext`는 메시지를 조회할 때 이 `MessageSource`를 사용합니다.

메시지는 `messages.properties`와 `messages_ko.properties`에 저장되어 있습니다. `messages.properties`는 기본 메시지 파일로 사용되고, `messages_ko.properties`는 한국어 로케일에 해당하는 메시지 파일로 사용됩니다.

`context.getMessage()`는 메시지 코드, 인자, 로케일을 받아 해당 로케일에 맞는 메시지를 반환합니다. 위 코드에서 같은 `"order.created"` 메시지 코드지만 `Locale.ENGLISH`와 `Locale.KOREAN`에 따라 서로 다른 메시지가 조회됩니다.

### 환경 정보와 프로퍼티

`ApplicationContext`는 `Environment`를 통해 프로파일과 프로퍼티를 조회할 수 있습니다.

`Environment`는 프로파일, 프로퍼티 파일, 시스템 프로퍼티처럼 실행 환경에 따라 달라질 수 있는 값을 일관된 방식으로 조회할 수 있게 합니다.

```java  
Environment environment = context.getEnvironment();

String activeProfiles = Arrays.toString(environment.getActiveProfiles());
String defaultProfiles = Arrays.toString(environment.getDefaultProfiles());

String appName = environment.getProperty("app.name");
String appRegion = environment.getProperty("app.region");
String javaVersion = environment.getProperty("java.version");
```  

`getActiveProfiles()`는 현재 활성화된 프로파일을 반환하고, `getDefaultProfiles()`는 활성 프로파일이 지정되지 않았을 때 사용할 기본 프로파일을 반환합니다.

`getProperty()`는 프로퍼티 값을 조회할 때 사용합니다. `app.name`과 `app.region`은 `application.properties`에서 조회하고, `java.version`은 JVM이 제공하는 시스템 프로퍼티에서 조회합니다.

### 이벤트 발행과 리스너  

`ApplicationContext`는 애플리케이션 이벤트를 발행하고, 해당 이벤트를 처리할 수 있는 리스너에게 전달합니다.

```java  
OrderCreatedEventListener listener = context.getBean(OrderCreatedEventListener.class);

context.publishEvent(new OrderCreatedEvent("order-1", "lamp", 32_000));
OrderCreatedEvent receivedEvent = listener.getLastEvent();
```  

`OrderCreatedEvent`는 주문이 생성되었다는 사실을 나타내는 이벤트 객체입니다. `OrderCreatedEventListener`는 해당 이벤트를 처리하는 리스너입니다.

여기서 주문 생성 이후의 처리는 이벤트를 기준으로 분리됩니다. 이벤트를 발행하는 쪽은 어떤 리스너가 실행되는지 직접 알 필요가 없고, 리스너는 자신이 처리할 이벤트 타입에 맞춰 호출됩니다.

`ApplicationContext`는 이 사이에서 이벤트를 전달하는 역할을 합니다. publisher는 리스너를 직접 호출하지 않고 이벤트만 발행하며, 컨테이너는 등록된 리스너 중 해당 이벤트를 처리할 수 있는 리스너를 찾아 실행합니다.

### 리소스 조회  

`ResourceLoader`를 통해 외부 리소스을 `Resource`로 다룰 수 있습니다. classpath, 파일 시스템, URL와 같은 리소스도 같은 `Resource` 인터페이스로 접근할 수 있습니다.

```java  
Resource resource = context.getResource("classpath:greeting.txt");

boolean exists = resource.exists();
String description = resource.getDescription();
String content = read(resource);
```  

`classpath:greeting.txt`는 classpath에 있는 `greeting.txt`를 의미합니다.`getResource()`는 문자열로 작성된 경로를 해석해 `Resource` 객체를 반환합니다.

## ClassPathXmlApplicationContext로 XML 설정 읽기

`ClassPathXmlApplicationContext`는 classpath에 있는 XML 설정 파일을 읽어 스프링 컨테이너를 구성하는 구현체입니다.

여기서는 `src/main/resources/bean-container-context.xml` 파일에 빈 정의 파일을 생성했습니다.

```xml
<bean id="memberRepository" class="example.beancontainer.domain.MemberRepositoryImpl"/>

<bean id="discountPolicy" class="example.beancontainer.domain.FixedDiscountPolicy">
    <constructor-arg value="1000"/>
</bean>

<bean id="orderService" class="example.beancontainer.domain.OrderService">
    <constructor-arg ref="memberRepository"/>
    <constructor-arg ref="discountPolicy"/>
</bean>
```

`<bean id="..." class="...">` 에 빈 이름과 구현 클래스를 지정합니다. 자바 설정에서 `@Bean` 메서드로 빈을 등록하는 것과 비슷한 역할을 합니다.

`<constructor-arg value="...">`는 생성자에 전달할 값을 지정합니다.

`<constructor-arg ref="...">` 는 다른 빈을 참조해 생성자 파라미터로 전달합니다. `ref` 값은 같은 XML 파일에 정의된 다른 `<bean>`의 `id`를 참조합니다.

```java
ClassPathXmlApplicationContext context =
        new ClassPathXmlApplicationContext("bean-container-context.xml");

OrderService orderService = context.getBean("orderService", OrderService.class);

String createdOrder = orderService.createOrder("member-1", "mouse", 15_000);
```

## GenericWebApplicationContext로 웹 컨텍스트 구성하기

`GenericWebApplicationContext`는 웹 환경에서 사용할 수 있는 `ApplicationContext` 구현체입니다. 일반 `ApplicationContext`와 달리 `ServletContext`를 함께 사용할 수 있으며, 웹 애플리케이션 리소스를 웹 경로 기준으로 조회할 수 있습니다.

이 예제에서는 `MockServletContext`를 사용해 간단한 웹 환경을 구성하고, 이를 기반으로 `GenericWebApplicationContext`를 생성합니다.

```java
MockServletContext servletContext = new MockServletContext("src/main/webapp");
GenericWebApplicationContext context =
        new GenericWebApplicationContext(new DefaultListableBeanFactory(), servletContext);
AnnotatedBeanDefinitionReader reader = new AnnotatedBeanDefinitionReader(context);
reader.register(AppConfig.class);
context.refresh();
```

마찬가지로 컨테이너에 등록된 빈을 조회할 수 있고, 웹 애플리케이션 경로 기준으로 리소스도 조회할 수 있습니다.

```java
OrderService orderService = context.getBean(OrderService.class);
Resource resource = context.getResource("/WEB-INF/templates/order-summary.txt");
boolean hasServletContext = context.getServletContext() != null;
```