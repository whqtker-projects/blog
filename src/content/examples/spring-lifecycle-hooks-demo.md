---
title: 빈 생명주기와 스코프 예제
post: bean-lifecycle-and-scope
order: 1
status: published
---

관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 소속 게시글: [[posts/bean-lifecycle-and-scope|빈 생명주기와 스코프]]

## 예제 목표

빈 생명주기 콜백과 스코프의 차이를 코드로 확인합니다.

먼저 빈 초기화와 종료 시점에 실행되는 콜백 메서드를 설정하는 방식을 살펴봅니다. 이어서 싱글톤과 프로토타입 스코프에 따라 빈 조회 결과가 어떻게 달라지는지 확인합니다.

## 프로젝트 구조

프로젝트 구조는 아래와 같습니다.

```text
example.lifecycle
├── config
│   └── LifecycleConfig
├── domain
│   ├── AnnotationLifecycleClient
│   ├── ApplicationCounter
│   ├── ConnectionManager
│   ├── InterfaceLifecycleClient
│   ├── MethodLifecycleClient
│   ├── OrderProcessingService
│   ├── PrototypeCounter
│   ├── RequestTracker
│   ├── SessionLogger
│   └── SingletonCounter
├── step1.lifecycleinterface
├── step2.initdestroy
├── step3.postconstruct
├── step4.scope
└── step5.webscope
```

- `config`: 생명주기 콜백과 스코프 예제에서 사용할 빈 설정 클래스가 있는 패키지입니다.
- `domain`: 연결 상태와 카운터를 다루는 예제 클래스가 있는 패키지입니다.
- `step1`~`step3`: 생명주기 콜백 방식을 비교하는 실행 예제입니다.
- `step4`: 싱글톤과 프로토타입 스코프의 차이를 확인하는 실행 예제입니다.
- `step5`: request, session, application, websocket 스코프의 동작을 확인하는 실행 예제입니다.

## 설정

`LifecycleConfig`는 사용할 빈을 등록하는 설정 클래스입니다.

```java
@Configuration
public class LifecycleConfig {

    @Bean
    public ConnectionManager connectionManager() {
        return new ConnectionManager("tcp://inventory-service");
    }

    @Bean
    public InterfaceLifecycleClient interfaceLifecycleClient() {
        return new InterfaceLifecycleClient(connectionManager());
    }

    @Bean(initMethod = "init", destroyMethod = "close")
    public MethodLifecycleClient methodLifecycleClient() {
        return new MethodLifecycleClient(connectionManager());
    }

    @Bean
    public AnnotationLifecycleClient annotationLifecycleClient() {
        return new AnnotationLifecycleClient(connectionManager());
    }

    @Bean
    public SingletonCounter singletonCounter() {
        return new SingletonCounter();
    }

    @Bean
    @Scope("prototype")
    public PrototypeCounter prototypeCounter() {
        return new PrototypeCounter();
    }

    @Bean
    @Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
    public RequestTracker requestTracker() {
        return new RequestTracker();
    }

    @Bean
    public OrderProcessingService orderProcessingService() {
        return new OrderProcessingService(requestTracker());
    }

    @Bean
    @Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
    public SessionLogger sessionLogger() {
        return new SessionLogger();
    }

    @Bean
    @Scope(value = "application", proxyMode = ScopedProxyMode.TARGET_CLASS)
    public ApplicationCounter applicationCounter() {
        return new ApplicationCounter();
    }
}
```

`prototypeCounter()`에는 `@Scope("prototype")`을 지정해 컨테이너에서 조회할 때마다 새 빈 인스턴스를 생성하도록 합니다.

웹 스코프 빈은 요청이나 세션처럼 웹 환경의 범위에 맞춰 생성됩니다. 예를 들어 request 스코프 빈은 HTTP 요청이 있을 때마다 해당 요청에 맞는 인스턴스가 사용됩니다.

반면 싱글톤 빈은 컨테이너 초기화 시점에 한 번 생성됩니다. 이때 request 스코프 빈을 그대로 주입하려고 하면, 아직 특정 HTTP 요청이 없는 상태이므로 어떤 request 스코프 빈을 넣어야 할지 결정할 수 없습니다.

이 문제를 해결하기 위해 웹 스코프 빈에는 `proxyMode = ScopedProxyMode.TARGET_CLASS`를 지정합니다. 이렇게 작성하면 싱글톤 빈에는 실제 웹 스코프 빈이 아니라 프록시가 주입됩니다. 이후 메서드가 호출되면 프록시가 현재 요청이나 세션에 맞는 실제 빈을 찾아 호출을 위임합니다.

## InitializingBean과 DisposableBean

`InitializingBean`은 초기화 콜백을 정의하는 인터페이스이고, `DisposableBean`은 종료 콜백을 정의하는 인터페이스입니다. 빈 클래스가 이 인터페이스를 구현하면 컨테이너는 정해진 시점에 콜백 메서드를 호출합니다.

```java
public class InterfaceLifecycleClient implements InitializingBean, DisposableBean {

    @Override
    public void afterPropertiesSet() {
        connectionManager.connect();
        status = connectionManager.status();
    }

    @Override
    public void destroy() {
        connectionManager.disconnect();
    }
}
```

컨테이너는 빈 생성과 의존관계 주입을 마친 뒤 `afterPropertiesSet()`을 호출하고, 컨텍스트가 종료될 때 `destroy()`를 호출합니다.

이 방식은 빈 클래스가 스프링의 생명주기 인터페이스를 직접 구현해야 한다는 한계가 있습니다.

## @Bean의 initMethod와 destroyMethod

`@Bean` 옵션을 통해 초기화 메서드와 종료 메서드를 지정할 수 있습니다.

```java
@Bean(initMethod = "init", destroyMethod = "close")
public MethodLifecycleClient methodLifecycleClient() {
    return new MethodLifecycleClient(connectionManager());
}
```

`initMethod`와 `destroyMethod`에 지정한 이름은 `MethodLifecycleClient`에 선언된 메서드명입니다.

```java
public class MethodLifecycleClient {

    public void init() {
        connectionManager.connect();
        status = connectionManager.status();
    }

    public void close() {
        connectionManager.disconnect();
    }
}
```

`initMethod`에는 빈 생성과 의존관계 주입이 끝난 뒤 호출할 메서드를 지정하고, `destroyMethod`에는 컨텍스트가 종료될 때 호출할 메서드를 지정합니다.

이 방식을 사용하면 외부 라이브러리 클래스처럼 소스 코드를 수정하기 어려운 객체에도 초기화와 종료 메서드를 연결할 수 있습니다.

## @PostConstruct와 @PreDestroy

`@PostConstruct`와 `@PreDestroy`를 사용해 초기화 메서드와 종료 메서드를 지정할 수 있습니다.

```java
public class AnnotationLifecycleClient {

    @PostConstruct
    public void init() {
        connectionManager.connect();
        status = connectionManager.status();
    }

    @PreDestroy
    public void close() {
        connectionManager.disconnect();
    }
}
```

컨테이너는 빈 생성과 의존관계 주입을 마친 뒤 `@PostConstruct`가 붙은 메서드를 호출합니다. 컨텍스트가 종료될 때는 `@PreDestroy`가 붙은 메서드를 호출합니다.

이 방식은 빈 클래스가 스프링 인터페이스를 구현하지 않아도 됩니다. 초기화와 종료 작업을 수행하는 메서드에 어노테이션을 직접 붙이기 때문에, 생명주기 콜백이 필요한 일반 애플리케이션 코드에서 자주 사용됩니다.

다만 외부 라이브러리 클래스처럼 소스 코드를 수정하기 어려운 객체에는 어노테이션을 직접 붙일 수 없습니다. 이런 경우에는 `@Bean(initMethod, destroyMethod)` 방식이 더 적합합니다.

## 싱글톤과 프로토타입 스코프

스코프에 따라 빈을 조회할 때 반환되는 인스턴스가 달라집니다. 싱글톤 빈은 같은 인스턴스를 재사용하고, 프로토타입 빈은 조회할 때마다 새 빈 인스턴스를 생성합니다.

```java
SingletonCounter singletonCounter1 = context.getBean(SingletonCounter.class);
SingletonCounter singletonCounter2 = context.getBean(SingletonCounter.class);
int singletonFirst = singletonCounter1.incrementAndGet();
int singletonSecond = singletonCounter2.incrementAndGet();

PrototypeCounter prototypeCounter1 = context.getBean(PrototypeCounter.class);
PrototypeCounter prototypeCounter2 = context.getBean(PrototypeCounter.class);
int prototypeFirst = prototypeCounter1.incrementAndGet();
int prototypeSecond = prototypeCounter2.incrementAndGet();

boolean singletonSameInstance = singletonCounter1 == singletonCounter2;
boolean prototypeSameInstance = prototypeCounter1 == prototypeCounter2;
// singletonSameInstance = true
// prototypeSameInstance = false
// singletonFirst = 1, singletonSecond = 2
// prototypeFirst = 1, prototypeSecond = 1
```

싱글톤 빈은 여러 번 조회해도 같은 인스턴스가 반환됩니다. 위 결과를 통해 `singletonCounter1`과 `singletonCounter2`가 같은 객체를 참조하며, 상태도 함께 공유한다는 점을 확인할 수 있습니다.

프로토타입 빈은 조회할 때마다 새로운 인스턴스가 생성됩니다. 위 결과를 통해 `prototypeCounter1`과 `prototypeCounter2`가 서로 다른 객체를 참조하며, 각 인스턴스가 독립적인 상태를 가진다는 점을 확인할 수 있습니다.

## 웹 스코프와 프록시

웹 스코프는 웹 환경을 기준으로 빈의 유지 범위를 결정합니다. request, session, application, websocket 스코프는 각각 요청, 세션, 서블릿 컨텍스트, 웹소켓 세션을 기준으로 동작합니다.

이 예제에서는 `AnnotationConfigWebApplicationContext`와 `MockServletContext`를 사용해 웹 컨텍스트를 구성합니다. `MockServletContext`를 사용하면 실제 서버를 띄우지 않고도 웹 스코프 예제에 필요한 서블릿 컨텍스트를 구성할 수 있습니다.

```java
AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
context.setServletContext(new MockServletContext());
context.register(LifecycleConfig.class);
context.refresh();
```

### request 스코프

`RequestTracker`는 request 스코프 빈입니다. 생성될 때 추적 ID를 하나 만들고, 이후 같은 인스턴스에서는 같은 ID를 반환합니다.

```java
public class RequestTracker {
    private final String trackerId = UUID.randomUUID().toString().substring(0, 8);

    public String getTrackerId() {
        return trackerId;
    }
}
```

`OrderProcessingService`는 싱글톤 빈으로, `RequestTracker`를 생성자로 주입받습니다.

```java
public class OrderProcessingService {
    private final RequestTracker requestTracker;

    public OrderProcessingService(RequestTracker requestTracker) {
        this.requestTracker = requestTracker;
    }

    public String getTrackerId() {
        return requestTracker.getTrackerId();
    }

    public boolean isProxy() {
        return !requestTracker.getClass().equals(RequestTracker.class);
    }
}
```

`RequestTracker`는 request 스코프이지만, `OrderProcessingService`는 싱글톤 빈입니다. 싱글톤 빈은 컨테이너 초기화 시점에 생성되므로, 특정 HTTP 요청에 속한 `RequestTracker`를 바로 주입할 수 없습니다.

이때 `proxyMode = ScopedProxyMode.TARGET_CLASS` 설정에 의해 실제 `RequestTracker` 대신 프록시가 주입됩니다. `OrderProcessingService`가 `getTrackerId()`를 호출하면, 프록시가 현재 요청에 해당하는 `RequestTracker`를 찾아 호출을 위임합니다.

`isProxy()`는 주입된 객체가 실제 `RequestTracker` 인스턴스인지, 프록시인지 확인하기 위한 예제 메서드입니다. 클래스 기반 프록시가 주입되면 런타임 클래스가 `RequestTracker.class`와 다르므로 `true`를 반환합니다.

아래 코드는 `MockHttpServletRequest`와 `RequestContextHolder`를 사용해 서로 다른 HTTP 요청을 시뮬레이션합니다.

```java
OrderProcessingService service = context.getBean(OrderProcessingService.class);

// 첫 번째 요청
MockHttpServletRequest request1 = new MockHttpServletRequest();
RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request1));
String trackerId1a = service.getTrackerId();
String trackerId1b = service.getTrackerId();

// 두 번째 요청
MockHttpServletRequest request2 = new MockHttpServletRequest();
RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request2));
String trackerId2 = service.getTrackerId();

boolean isSameInSameRequest = trackerId1a.equals(trackerId1b); // true
boolean isDifferentAcrossRequests = !trackerId1a.equals(trackerId2); // true
boolean isProxy = service.isProxy(); // true
```

실행 결과를 통해 같은 요청 안에서는 같은 `RequestTracker`가 사용되고, 요청이 바뀌면 새로운 `RequestTracker`가 사용됨을 확인할 수 있습니다. 또한 싱글톤 빈에는 실제 request 스코프 빈이 아니라 프록시가 주입된다는 점도 함께 확인할 수 있습니다.

### session 스코프

`SessionLogger`는 session 스코프 빈입니다. `SessionLogger` 인스턴스가 생성될 때 식별용 ID를 하나 만듭니다.

```java
public class SessionLogger {
    private final String sessionId = UUID.randomUUID().toString().substring(0, 8);

    public String getSessionId() {
        return sessionId;
    }
}
```

session 스코프는 HTTP 세션을 기준으로 빈을 유지합니다. 이 예제에서는 `MockHttpSession`을 요청에 연결하고, `RequestContextHolder`에 요청 정보를 등록해 세션 범위를 시뮬레이션합니다.

```java
SessionLogger sessionLogger = context.getBean(SessionLogger.class);

MockHttpSession session = new MockHttpSession();

// 같은 세션, 다른 요청
MockHttpServletRequest req1 = new MockHttpServletRequest();
req1.setSession(session);
RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(req1));
String sessionId1 = sessionLogger.getSessionId();

MockHttpServletRequest req2 = new MockHttpServletRequest();
req2.setSession(session);
RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(req2));
String sessionId2 = sessionLogger.getSessionId();

// 새 세션
MockHttpSession newSession = new MockHttpSession();
MockHttpServletRequest req3 = new MockHttpServletRequest();
req3.setSession(newSession);
RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(req3));
String sessionId3 = sessionLogger.getSessionId();

boolean isSameWithinSession = sessionId1.equals(sessionId2); // true
boolean isDifferentAcrossSessions = !sessionId1.equals(sessionId3); // true
```

실행 결과를 통해 같은 세션에 연결된 요청에서는 같은 `SessionLogger`가 사용되고, 세션이 바뀌면 다른 `SessionLogger`가 사용됨을 확인할 수 있습니다.

### application 스코프

`ApplicationCounter`는 application 스코프 빈입니다. application 스코프는 `ServletContext`를 기준으로 빈 인스턴스를 유지합니다.

```java
public class ApplicationCounter {
    private int count = 0;

    public int increment() {
        return ++count;
    }

    public int getCount() {
        return count;
    }
}
```

이 예제에서는 `ApplicationCounter`에도 scoped proxy를 적용했습니다. 따라서 `context.getBean(ApplicationCounter.class)`로 조회되는 객체는 실제 `ApplicationCounter` 인스턴스가 아니라 프록시입니다.

```java
ApplicationCounter counter1 = context.getBean(ApplicationCounter.class);
int count1 = counter1.increment(); // 1
int count2 = counter1.increment(); // 2

// 다시 조회해도 같은 인스턴스
ApplicationCounter counter2 = context.getBean(ApplicationCounter.class);
int count3 = counter2.increment(); // 3

boolean isSameInstance = counter1 == counter2; // true (같은 프록시 싱글톤)
boolean isSameState = counter2.getCount() == 3; // true (상태 공유)
```

실행 결과를 통해 `counter1`과 `counter2`가 같은 프록시 객체임을 확인할 수 있습니다. 메서드 호출은 프록시를 거쳐 `ServletContext`에 바인딩된 실제 `ApplicationCounter`로 위임됩니다.

이 때문에 여러 번 조회하더라도 같은 application 스코프 빈의 상태가 사용됩니다. 싱글톤 스코프가 스프링 컨테이너를 기준으로 하나의 인스턴스를 유지한다면, application 스코프는 `ServletContext`를 기준으로 인스턴스를 유지합니다. `ServletContext`가 새로 만들어지면 application 스코프 빈도 새로 생성됩니다.

### websocket 스코프

websocket 스코프는 WebSocket 세션을 기준으로 빈 인스턴스를 유지합니다. 같은 WebSocket 세션 안에서는 같은 인스턴스가 사용되고, 세션이 달라지면 다른 인스턴스가 사용됩니다.

```java
@Bean
@Scope(value = "websocket", proxyMode = ScopedProxyMode.TARGET_CLASS)
public WebSocketTracker webSocketTracker() {
    return new WebSocketTracker();
}
```

websocket 스코프를 직접 구성하는 예제에서는 웹 컨텍스트 초기화 시점에 `WebSocketScope`를 등록합니다.

```java
ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
beanFactory.registerScope("websocket", new WebSocketScope());
```

websocket 스코프 빈은 현재 WebSocket 세션 정보가 설정된 상태에서 사용할 수 있습니다. 이 예제에서는 `SimpAttributesContextHolder`를 사용해 세션 컨텍스트를 설정한 뒤 빈을 조회합니다.

같은 WebSocket 세션 컨텍스트에서 접근하면 같은 `WebSocketTracker` 인스턴스가 사용됩니다. 세션 컨텍스트가 바뀌면 다른 `WebSocketTracker` 인스턴스가 사용됩니다.
