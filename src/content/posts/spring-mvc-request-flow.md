---
title: "스프링 MVC 요청 흐름"
series: spring-web-mvc
order: 1
status: draft
tags:
  - graph/post
---

관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-web-mvc|스프링 웹 MVC]]
- 다음 글: [[controller-and-request-mapping|컨트롤러와 요청 매핑]]

## 스프링 MVC란

스프링 MVC는 스프링에서 웹 요청을 처리하기 위한 MVC 기반 웹 프레임워크입니다. 클라이언트의 HTTP 요청을 컨트롤러로 전달하고, 컨트롤러가 처리한 결과를 HTTP 응답으로 변환하는 구조를 제공합니다.

MVC는 역할을 세 부분으로 나눕니다.

- `Model`: 화면이나 응답에 필요한 데이터를 담습니다.
- `View`: 사용자에게 보여 줄 화면을 만듭니다.
- `Controller`: 요청을 받아 비즈니스 로직을 호출하고, 처리 결과를 반환합니다.

스프링 MVC에서는 요청이 컨트롤러에 바로 전달되지 않습니다. 먼저 `DispatcherServlet`이 요청을 받고, 요청을 처리할 컨트롤러를 찾은 뒤, 컨트롤러 실행과 응답 생성 흐름을 조율합니다.

## DispatcherServlet과 Front Controller 구조

`DispatcherServlet`은 스프링 MVC의 핵심 Servlet입니다. 클라이언트의 요청을 가장 먼저 받고, 요청 처리에 필요한 여러 구성 요소를 호출합니다.

웹 애플리케이션에서 모든 요청을 각각의 Servlet이 직접 처리하면 공통 처리 로직이 여러 곳에 흩어질 수 있습니다. 인증, 인코딩, 예외 처리, 요청 분기 같은 흐름이 각 Servlet에 반복해서 들어가기 때문입니다.

Front Controller 구조에서는 하나의 진입점이 요청을 먼저 받습니다. 스프링 MVC에서는 `DispatcherServlet`이 이 역할을 합니다.

화면 응답 기준의 기본 흐름은 다음과 같습니다.

![[Pasted image 20260521093121.png]]

`DispatcherServlet`이 직접 모든 로직을 처리하는 것은 아닙니다. 요청을 처리할 대상을 찾는 일은 `HandlerMapping`에 맡기고, 실제 Handler를 실행하는 일은 `HandlerAdapter`에 맡깁니다. 컨트롤러가 반환한 결과를 화면으로 만들 때는 `ViewResolver`와 `View`를 사용합니다.

## 스프링 MVC 요청 처리 흐름

여기서 Handler는 요청을 실제로 처리할 대상입니다. 일반적인 스프링 MVC 애플리케이션에서는 `@Controller`가 붙은 클래스의 메서드가 Handler 역할을 합니다.

컨트롤러가 View 이름을 반환하는 경우 요청 처리 흐름은 다음 순서로 진행됩니다.

1. 클라이언트가 HTTP 요청을 보냅니다.
2. `DispatcherServlet`이 요청을 받습니다.
3. `HandlerMapping`이 요청을 처리할 Handler를 찾습니다.
4. `HandlerAdapter`가 Handler를 실행합니다.
5. Controller가 비즈니스 로직을 호출하고 처리 결과를 반환합니다.
6. `ViewResolver`가 View 이름에 맞는 View를 찾습니다.
7. View가 Model 데이터를 사용해 화면을 렌더링합니다.
8. `DispatcherServlet`이 HTTP 응답을 반환합니다.

다음 컨트롤러는 `/orders` 요청을 처리하고, 주문 목록 화면에 필요한 데이터를 `Model`에 담은 뒤 View 이름을 반환합니다.

```java
@Controller
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        List<Order> orders = orderService.findOrders();
        model.addAttribute("orders", orders);
        return "orders";
    }
}
```

이 요청은 스프링 MVC 내부에서 `HandlerMapping`, `HandlerAdapter`, Controller 실행, `ViewResolver`, View 렌더링 흐름을 차례로 거칩니다.

## HandlerMapping

`HandlerMapping`은 HTTP 요청과 Handler를 매핑합니다. 요청 URL, HTTP 메서드, 요청 파라미터, 헤더 조건 등을 기준으로 어떤 컨트롤러 메서드가 요청을 처리할지 찾습니다.

예를 들어 다음 요청이 들어왔다고 가정합니다.

```
GET /orders
```

컨트롤러에는 다음 매핑 정보가 있습니다.

```
@GetMapping("/orders")
```

`HandlerMapping`은 `/orders` 경로와 `GET` 메서드 조건을 기준으로 이 컨트롤러 메서드를 Handler로 선택합니다.

스프링 MVC에서 어노테이션 기반 컨트롤러를 사용할 때는 `RequestMappingHandlerMapping`이 주로 사용됩니다. 이 객체는 `@RequestMapping`, `@GetMapping`, `@PostMapping` 같은 어노테이션 정보를 읽고 요청과 컨트롤러 메서드를 연결합니다.

`HandlerMapping`이 반환하는 것은 단순히 컨트롤러 메서드 하나만은 아닙니다. 내부적으로는 Handler와 함께 요청 처리 전후에 실행될 인터셉터 정보도 포함될 수 있습니다. 이 때문에 요청이 컨트롤러로 바로 이동하지 않고, 중간에 공통 처리 흐름을 거칠 수 있습니다.

## HandlerAdapter

`HandlerAdapter`는 `HandlerMapping`이 찾은 Handler를 실제로 호출합니다.

스프링 MVC에서 Handler의 형태는 하나로 고정되어 있지 않습니다. 과거 방식의 Controller 인터페이스를 구현한 객체도 Handler가 될 수 있고, 어노테이션 기반 컨트롤러 메서드도 Handler가 될 수 있습니다. `DispatcherServlet`이 모든 Handler 호출 방식을 직접 알고 있으면 Handler 종류가 늘어날 때마다 `DispatcherServlet`의 책임이 커집니다.

`HandlerAdapter`는 Handler 호출 방식을 어댑터로 분리합니다. `DispatcherServlet`은 Handler를 직접 실행하지 않고, 해당 Handler를 실행할 수 있는 `HandlerAdapter`를 찾아 호출합니다.

어노테이션 기반 컨트롤러에서는 보통 `RequestMappingHandlerAdapter`가 사용됩니다. 이 Adapter는 컨트롤러 메서드를 호출하기 전에 메서드에 전달할 값을 준비합니다.

예를 들어 다음 메서드를 실행하려면 `Model` 객체가 필요합니다.

```
public String orders(Model model)
```

`RequestMappingHandlerAdapter`는 `Model`, `@RequestParam`, `@PathVariable`, `@ModelAttribute`, `@RequestBody`처럼 컨트롤러 메서드에 필요한 값을 해석해 메서드 호출에 사용합니다.

메서드 실행이 끝나면 반환값도 처리합니다. 컨트롤러 메서드가 문자열을 반환하면 View 이름으로 해석될 수 있고, `@ResponseBody`가 적용된 반환값은 응답 본문으로 변환될 수 있습니다.

## Controller 실행

Controller는 요청을 처리하는 애플리케이션 코드입니다. 일반적으로 서비스 계층을 호출하고, 처리 결과를 응답에 필요한 형태로 구성합니다.

화면을 반환하는 컨트롤러는 보통 서비스 계층을 호출하고, 조회 결과를 `Model`에 담은 뒤 View 이름을 반환합니다.

```
List<Order> orders = orderService.findOrders();model.addAttribute("orders", orders);return "orders";
```

`orderService.findOrders()`는 주문 목록을 조회하는 비즈니스 로직을 호출합니다. 컨트롤러는 주문 목록을 직접 조회하지 않고, 실제 조회 로직을 서비스 계층에 맡깁니다.

`model.addAttribute("orders", orders)`는 View에서 사용할 데이터를 담는 코드입니다. 이후 View는 `orders`라는 이름으로 주문 목록 데이터에 접근할 수 있습니다.

`return "orders"`는 응답 화면의 논리적인 이름을 반환하는 코드입니다. 이 문자열은 HTML 파일 경로가 아니라 View 이름입니다. 실제 View 파일을 찾는 과정은 `ViewResolver`가 담당합니다.

## ViewResolver

`ViewResolver`는 컨트롤러가 반환한 View 이름을 바탕으로 렌더링에 사용할 View를 찾습니다.

컨트롤러가 다음과 같이 `"orders"`를 반환했다고 가정합니다.

```
return "orders";
```

이 값만으로는 실제 화면 파일의 위치를 알 수 없습니다. `ViewResolver`는 설정된 prefix, suffix 등을 사용해 View 이름을 실제 View 경로로 변환합니다.

예를 들어 JSP를 사용하고 다음 설정이 있다고 가정합니다.

```
spring.mvc.view.prefix=/WEB-INF/views/spring.mvc.view.suffix=.jsp
```

컨트롤러가 `"orders"`를 반환하면 `ViewResolver`는 다음 경로의 View를 찾습니다.

```
/WEB-INF/views/orders.jsp
```

이 과정에서 컨트롤러는 실제 View 파일의 전체 경로를 알 필요가 없습니다. 컨트롤러는 논리적인 View 이름만 반환하고, `ViewResolver`가 설정을 기준으로 실제 View를 찾습니다.

Thymeleaf를 사용하는 경우에도 흐름은 비슷합니다. 컨트롤러가 `"orders"`를 반환하면 스프링 MVC는 Thymeleaf 설정을 기준으로 `orders.html` 템플릿을 찾습니다.

## View 렌더링

View는 `Model`에 담긴 데이터를 사용해 최종 응답 화면을 만듭니다.

컨트롤러에서 다음과 같이 데이터를 담았다면,

```
model.addAttribute("orders", orders);
```

View에서는 `orders` 데이터를 사용해 화면을 구성합니다.

Thymeleaf 예시는 다음과 같습니다.

```html
<table>
    <tr th:each="order : ${orders}">
        <td th:text="${order.id}"></td>
        <td th:text="${order.name}"></td>
        <td th:text="${order.price}"></td>
    </tr>
</table>
```

View 렌더링이 끝나면 HTML 응답이 만들어집니다. `DispatcherServlet`은 이 결과를 HTTP 응답으로 클라이언트에게 반환합니다.

```
Controller    → Model에 데이터 저장    → View 이름 반환    → ViewResolver가 View 탐색    → View가 Model 데이터로 HTML 생성    → HTTP 응답 반환
```

이 흐름은 서버에서 HTML을 만들어 반환하는 방식입니다.

## REST API 요청 처리 흐름

REST API 요청도 `DispatcherServlet`, `HandlerMapping`, `HandlerAdapter`, Controller 실행 흐름을 거칩니다. 다만 컨트롤러가 View 이름을 반환하지 않으면 `ViewResolver`를 통해 화면을 찾지 않습니다.

`@RestController`를 사용하거나 메서드에 `@ResponseBody`를 붙이면 컨트롤러의 반환값이 HTTP 응답 본문으로 변환됩니다.

```
@RestControllerpublic class OrderApiController {    @GetMapping("/api/orders")    public List<OrderResponse> orders() {        return orderService.findOrderResponses();    }}
```

이 경우 컨트롤러가 반환한 객체는 View 이름이 아닙니다. 스프링 MVC는 반환 객체를 `HttpMessageConverter`를 사용해 JSON 같은 응답 본문으로 변환합니다.

```
클라이언트    → DispatcherServlet        → HandlerMapping        → HandlerAdapter        → Controller        → HttpMessageConverter    → JSON 응답
```

화면 응답과 API 응답 모두 `DispatcherServlet`, `HandlerMapping`, `HandlerAdapter`를 거쳐 컨트롤러를 실행합니다. `ViewResolver`와 View는 컨트롤러가 View 이름을 반환하는 화면 응답 흐름에서 사용됩니다.