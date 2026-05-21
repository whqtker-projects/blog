---
title: "컨트롤러와 요청 매핑"
series: spring-web-mvc
order: 2
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-web-mvc|스프링 웹 MVC]]
- 이전 글: [[spring-mvc-request-flow|스프링 MVC 요청 흐름]]
- 다음 글: [[request-body-and-message-converter|요청 본문과 HttpMessageConverter]]

## 컨트롤러란

컨트롤러는 HTTP 요청을 애플리케이션 코드로 연결하는 객체입니다. 스프링 MVC에서 `@Controller` 또는 `@RestController`가 붙은 클래스의 메서드는 요청을 처리하는 Handler로 사용될 수 있습니다.

이전 글에서 살펴본 요청 흐름에서 `HandlerMapping`은 요청을 처리할 Handler를 찾고, `HandlerAdapter`는 해당 Handler를 실행했습니다. 이번 글에서는 Handler가 되는 컨트롤러 메서드를 어떻게 선언하고, 요청 값을 어떻게 받는지 다룹니다.

```java
@Controller
public class OrderController {

    @GetMapping("/orders")
    public String orders(Model model) {
        return "orders";
    }
}
```

위 코드에서 `/orders` 요청을 처리하는 Handler는 `orders()` 메서드입니다. `@GetMapping("/orders")`는 `GET /orders` 요청을 이 메서드에 연결합니다.

컨트롤러는 보통 요청 값을 받고, 서비스 계층을 호출한 뒤, 처리 결과를 응답에 필요한 형태로 반환합니다. 화면을 반환하는 컨트롤러는 `Model`에 데이터를 담고 View 이름을 반환합니다. API 응답을 반환하는 컨트롤러는 객체를 반환하고, 스프링 MVC가 이를 HTTP 응답 본문으로 처리합니다.

### @Controller

`@Controller`는 해당 클래스가 스프링 MVC 컨트롤러임을 나타내는 어노테이션입니다. 스프링은 이 어노테이션이 붙은 클래스를 컴포넌트 스캔 대상으로 인식하고 빈으로 등록할 수 있습니다.

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

`orders()` 메서드는 주문 목록을 조회한 뒤 `Model`에 데이터를 담고 `"orders"`를 반환합니다. 이 문자열은 응답 본문이 아니라 View 이름으로 해석됩니다.

```
model.addAttribute("orders", orders);return "orders";
```

`model.addAttribute("orders", orders)`는 View에서 사용할 데이터를 저장합니다. `return "orders"`는 렌더링할 View의 논리적인 이름을 반환합니다. 이후 `ViewResolver`가 `"orders"`라는 View 이름을 실제 View로 찾고, View가 `Model` 데이터를 사용해 HTML 응답을 만듭니다.

### @RestController

`@RestController`는 API 응답을 반환하는 컨트롤러에서 사용합니다. 이 어노테이션이 붙은 컨트롤러는 메서드 반환값을 View 이름으로 처리하지 않고 HTTP 응답 본문으로 처리합니다.

```java
@RestController
public class OrderApiController {

    private final OrderService orderService;

    public OrderApiController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/api/orders")
    public List<OrderResponse> orders() {
        return orderService.findOrderResponses();
    }
}
```

위 코드에서 `orders()` 메서드는 `List<OrderResponse>`를 반환합니다. 이 반환값은 View 이름이 아닙니다. 스프링 MVC는 반환 객체를 HTTP 응답 본문에 담아 클라이언트에게 반환합니다.

단순화하면 `@RestController`는 `@Controller`와 `@ResponseBody`가 함께 적용된 형태로 볼 수 있습니다. 요청을 컨트롤러 메서드에 매핑하고 실행하는 흐름은 `@Controller`와 `@RestController` 모두 동일합니다. 차이는 메서드 반환값을 View 이름으로 볼지, 응답 본문으로 볼지에 있습니다.

응답 본문 변환 과정은 다음 글에서 `HttpMessageConverter`와 함께 다룹니다.

## 요청 매핑

요청 매핑은 HTTP 요청을 어떤 컨트롤러 메서드가 처리할지 연결하는 과정입니다. 스프링 MVC에서는 `@RequestMapping`, `@GetMapping`, `@PostMapping` 같은 어노테이션으로 요청 경로와 HTTP 메서드 조건을 지정합니다.

```java
@Controllerpublic class OrderController {    @GetMapping("/orders")    public String orders() {        return "orders";    }}
```

위 메서드는 `GET /orders` 요청을 처리합니다. 클라이언트가 `/orders` 경로로 GET 요청을 보내면 `HandlerMapping`이 이 메서드를 Handler로 선택합니다.

요청 매핑은 URL 경로만 비교하지 않습니다. HTTP 메서드, 요청 파라미터, 헤더, Content-Type, Accept 조건도 매핑 조건에 포함할 수 있습니다. 가장 자주 사용하는 조건은 요청 경로와 HTTP 메서드입니다.

### @RequestMapping

`@RequestMapping`은 요청 경로와 여러 조건을 지정할 수 있는 기본 매핑 어노테이션입니다. 클래스 레벨과 메서드 레벨에 모두 사용할 수 있습니다.

```java
@Controller@RequestMapping("/orders")public class OrderController {    @RequestMapping(method = RequestMethod.GET)    public String orders() {        return "orders";    }    @RequestMapping(value = "/new", method = RequestMethod.GET)    public String newOrderForm() {        return "order-form";    }}
```

클래스에 선언한 `@RequestMapping("/orders")`는 해당 컨트롤러의 공통 경로가 됩니다. 메서드에 선언한 경로는 클래스 레벨 경로 뒤에 이어집니다.

위 코드에서 `orders()` 메서드는 다음 요청과 매핑됩니다.

```
GET /orders
```

`newOrderForm()` 메서드는 다음 요청과 매핑됩니다.

```
GET /orders/new
```

클래스 레벨 매핑을 사용하면 같은 도메인에 속한 요청 경로를 한 컨트롤러 안에서 묶을 수 있습니다. 예를 들어 주문 목록, 주문 상세, 주문 생성 화면을 모두 `/orders` 하위 경로로 구성할 수 있습니다.

### @GetMapping, @PostMapping 등

`@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping`은 `@RequestMapping`에 HTTP 메서드 조건을 미리 지정한 파생 어노테이션입니다.

```java
@GetMapping("/orders")public String orders() {    return "orders";}@PostMapping("/orders")public String createOrder() {    return "redirect:/orders";}
```

`@GetMapping("/orders")`는 다음 코드와 같은 의미입니다.

```
@RequestMapping(value = "/orders", method = RequestMethod.GET)
```

`@PostMapping("/orders")`는 다음 코드와 같은 의미입니다.

```
@RequestMapping(value = "/orders", method = RequestMethod.POST)
```

주문 목록 조회와 주문 생성은 같은 `/orders` 경로를 사용하더라도 HTTP 메서드가 다르면 서로 다른 컨트롤러 메서드로 매핑할 수 있습니다.

```java
@Controller@RequestMapping("/orders")public class OrderController {    @GetMapping    public String orders(Model model) {        return "orders";    }    @PostMapping    public String createOrder() {        return "redirect:/orders";    }}
```

위 코드에서 `GET /orders` 요청은 주문 목록 화면을 반환하고, `POST /orders` 요청은 주문 생성 로직으로 이어집니다. 같은 URI를 사용하더라도 HTTP 메서드 조건이 다르기 때문에 서로 다른 Handler로 선택됩니다.

주로 사용하는 HTTP 메서드 매핑은 다음과 같습니다.

|어노테이션|HTTP 메서드|주로 사용하는 흐름|
|---|---|---|
|`@GetMapping`|GET|조회 화면, 조회 API|
|`@PostMapping`|POST|생성 요청, 폼 제출|
|`@PutMapping`|PUT|전체 수정|
|`@PatchMapping`|PATCH|일부 수정|
|`@DeleteMapping`|DELETE|삭제|

## URI 패턴과 경로 변수

URI 패턴은 요청 경로를 어떤 형태로 매핑할지 지정합니다. 고정된 경로를 그대로 매핑할 수도 있고, 경로 일부를 변수처럼 받을 수도 있습니다.

주문 목록 조회처럼 특정 경로가 하나로 고정된 요청은 다음처럼 매핑할 수 있습니다.

```
@GetMapping("/orders")public String orders() {    return "orders";}
```

특정 주문 하나를 조회하는 요청은 주문 식별자가 경로에 포함되는 경우가 많습니다.

```
GET /orders/1GET /orders/2GET /orders/3
```

이 요청을 각각 등록하지 않고 `/orders/{orderId}` 같은 URI 템플릿으로 표현할 수 있습니다. `{orderId}`에 들어온 값을 메서드 파라미터로 받을 때는 `@PathVariable`을 사용합니다.

### 고정 경로 매핑

고정 경로 매핑은 요청 경로가 정해져 있는 경우 사용합니다.

```
@GetMapping("/orders")public String orders() {    return "orders";}@GetMapping("/orders/new")public String newOrderForm() {    return "order-form";}
```

`GET /orders` 요청은 `orders()` 메서드로 매핑됩니다.

```
GET /orders
```

`GET /orders/new` 요청은 `newOrderForm()` 메서드로 매핑됩니다.

```
GET /orders/new
```

고정 경로는 목록 조회, 생성 폼 조회, 특정 기능 화면처럼 경로 자체가 하나의 의미를 가지는 경우에 사용합니다.

### @PathVariable

`@PathVariable`은 URI 템플릿 변수 값을 컨트롤러 메서드 파라미터로 받을 때 사용합니다.

```
@GetMapping("/orders/{orderId}")public String orderDetail(@PathVariable("orderId") Long orderId, Model model) {    Order order = orderService.findOrder(orderId);    model.addAttribute("order", order);    return "order-detail";}
```

클라이언트가 다음 요청을 보내면,

```
GET /orders/10
```

`orderId`에는 `10`이 전달됩니다.

```
@PathVariable("orderId") Long orderId
```

경로 변수 이름과 메서드 파라미터 이름이 같고, 컴파일된 클래스에 파라미터 이름 정보가 남아 있으면 `@PathVariable`의 이름을 생략할 수 있습니다.

```
@GetMapping("/orders/{orderId}")public String orderDetail(@PathVariable Long orderId) {    return "order-detail";}
```

환경 차이를 줄이려면 이름을 명시할 수 있습니다.

```
@GetMapping("/orders/{orderId}")public String orderDetail(@PathVariable("orderId") Long orderId) {    return "order-detail";}
```

경로 변수 이름과 파라미터 이름이 다르면 이름을 직접 지정해야 합니다.

```
@GetMapping("/orders/{id}")public String orderDetail(@PathVariable("id") Long orderId) {    return "order-detail";}
```

위 코드에서 URI 패턴의 변수 이름은 `{id}`이고, 메서드 파라미터 이름은 `orderId`입니다. 이 경우 `@PathVariable("id")`를 사용해 어떤 경로 변수 값을 받을지 지정합니다.

경로 변수는 보통 리소스 식별자를 표현할 때 사용합니다. 주문 상세 조회, 회원 상세 조회, 게시글 상세 조회처럼 특정 대상을 URI 경로로 식별하는 요청에서 사용됩니다.

```
@GetMapping("/members/{memberId}")public String memberDetail(@PathVariable("memberId") Long memberId) {    return "member-detail";}@GetMapping("/posts/{postId}")public String postDetail(@PathVariable("postId") Long postId) {    return "post-detail";}
```

## 요청 파라미터 처리

요청 파라미터는 URL 쿼리 스트링이나 HTML Form 전송으로 전달되는 값입니다. 스프링 MVC에서는 `@RequestParam`을 사용해 요청 파라미터 값을 컨트롤러 메서드 파라미터로 받을 수 있습니다.

쿼리 스트링은 URL 뒤에 `?key=value` 형태로 붙는 값입니다.

```
GET /orders?status=READY&page=1
```

위 요청에는 `status`와 `page`라는 요청 파라미터가 포함되어 있습니다.

HTML Form을 `application/x-www-form-urlencoded` 방식으로 제출할 때도 요청 파라미터 형태로 값이 전달됩니다.

```
<form action="/orders" method="post">    <input type="text" name="itemName">    <input type="number" name="quantity">    <button type="submit">주문</button></form>
```

이 폼을 제출하면 `itemName`, `quantity` 값이 요청 파라미터로 전달됩니다. `application/x-www-form-urlencoded` Form 전송은 요청 본문을 사용하지만, 스프링 MVC에서는 이 값을 요청 파라미터로 다룰 수 있습니다. JSON 요청 본문을 객체로 변환하는 흐름은 다음 글에서 다룹니다.

### @RequestParam

`@RequestParam`은 요청 파라미터 값을 컨트롤러 메서드에서 받을 때 사용합니다.

```
@GetMapping("/orders")public String orders(@RequestParam("status") String status, Model model) {    List<Order> orders = orderService.findOrdersByStatus(status);    model.addAttribute("orders", orders);    return "orders";}
```

클라이언트가 다음 요청을 보내면,

```
GET /orders?status=READY
```

`status` 파라미터에는 `"READY"` 값이 전달됩니다.

```
@RequestParam("status") String status
```

요청 파라미터 이름과 메서드 파라미터 이름이 같고, 컴파일된 클래스에 파라미터 이름 정보가 남아 있으면 `@RequestParam`의 이름을 생략할 수 있습니다.

```
@GetMapping("/orders")public String orders(@RequestParam String status) {    return "orders";}
```

환경 차이를 줄이려면 이름을 명시할 수 있습니다.

```
@GetMapping("/orders")public String orders(@RequestParam("status") String orderStatus) {    return "orders";}
```

여러 요청 파라미터를 함께 받을 수도 있습니다.

```
@GetMapping("/orders")public String orders(        @RequestParam("status") String status,        @RequestParam("page") int page,        Model model) {    List<Order> orders = orderService.findOrders(status, page);    model.addAttribute("orders", orders);    return "orders";}
```

다음 요청이 들어오면 `status`에는 `"READY"`, `page`에는 `1`이 전달됩니다.

```
GET /orders?status=READY&page=1
```

`@RequestParam`은 경로 자체에 포함된 값이 아니라 요청 파라미터 영역에 포함된 값을 읽습니다. 이 점에서 URI 경로 일부를 읽는 `@PathVariable`과 구분됩니다.

```
@GetMapping("/orders/{orderId}")public String orderDetail(        @PathVariable("orderId") Long orderId,        @RequestParam(value = "tab", required = false) String tab) {    return "order-detail";}
```

위 메서드는 다음 요청을 처리할 수 있습니다.

```
GET /orders/10?tab=payment
```

`orderId`는 URI 경로에서 가져오고, `tab`은 쿼리 파라미터에서 가져옵니다.

```
@PathVariable("orderId") Long orderId@RequestParam(value = "tab", required = false) String tab
```

### required와 defaultValue

`@RequestParam`은 기본적으로 해당 요청 파라미터가 반드시 있어야 한다고 처리합니다.

```
@GetMapping("/orders")public String orders(@RequestParam("status") String status) {    return "orders";}
```

이 메서드는 `status` 요청 파라미터를 필요로 합니다.

```
GET /orders?status=READY
```

다음처럼 `status` 없이 요청하면 요청 파라미터가 없기 때문에 예외가 발생합니다.

```
GET /orders
```

요청 파라미터가 없어도 처리해야 한다면 `required = false`를 지정할 수 있습니다.

```
@GetMapping("/orders")public String orders(@RequestParam(value = "status", required = false) String status) {    return "orders";}
```

이 경우 `status` 요청 파라미터가 없으면 `status`에는 `null`이 전달됩니다.

기본값을 지정하려면 `defaultValue`를 사용합니다.

```
@GetMapping("/orders")public String orders(        @RequestParam(value = "status", defaultValue = "READY") String status,        @RequestParam(value = "page", defaultValue = "1") int page) {    return "orders";}
```

다음 요청처럼 파라미터가 생략되면,

```
GET /orders
```

`status`에는 `"READY"`, `page`에는 `1`이 전달됩니다.

`defaultValue`를 지정하면 요청 파라미터가 없거나 빈 값으로 들어왔을 때 기본값이 사용됩니다. 이 경우 `required`를 별도로 지정하지 않아도 필수 파라미터처럼 처리되지 않습니다.

선택 파라미터를 기본형 타입으로 받을 때는 주의해야 합니다. `int` 같은 기본형 타입은 `null`을 담을 수 없습니다. 값이 생략될 수 있다면 `Integer` 같은 래퍼 타입을 사용하거나 `defaultValue`를 지정해야 합니다.

```
@GetMapping("/orders")public String orders(        @RequestParam(value = "status", required = false) String status,        @RequestParam(value = "page", defaultValue = "1") int page,        @RequestParam(value = "sort", defaultValue = "createdAt") String sort) {    return "orders";}
```

이 메서드는 다음 요청을 모두 처리할 수 있습니다.

```
GET /ordersGET /orders?status=READYGET /orders?status=READY&page=2&sort=price
```

### 타입 변환

HTTP 요청으로 전달되는 값은 기본적으로 문자열입니다. 스프링 MVC는 컨트롤러 메서드 파라미터 타입에 맞게 문자열 값을 변환합니다.

```
@GetMapping("/orders")public String orders(@RequestParam("page") int page) {    return "orders";}
```

다음 요청에서 `page` 값은 URL에 문자열 형태로 들어옵니다.

```
GET /orders?page=1
```

스프링 MVC는 `"1"` 값을 `int` 타입으로 변환해 `page` 파라미터에 전달합니다.

```
@RequestParam("page") int page
```

`Long`, `Integer`, `Boolean`, `Enum` 같은 타입도 변환 대상이 될 수 있습니다.

```
@GetMapping("/orders/{orderId}")public String orderDetail(        @PathVariable("orderId") Long orderId,        @RequestParam("includeItems") Boolean includeItems) {    return "order-detail";}
```

다음 요청이 들어오면,

```
GET /orders/10?includeItems=true
```

`orderId`에는 `Long` 타입의 `10`이 전달되고, `includeItems`에는 `Boolean` 타입의 `true`가 전달됩니다.

Enum 타입은 요청 값이 Enum 상수 이름과 일치할 때 변환됩니다. 기본 변환에서는 대소문자도 맞아야 합니다.

```
public enum OrderStatus {    READY,    COMPLETED,    CANCELED}
```

```
@GetMapping("/orders")public String orders(@RequestParam("status") OrderStatus status) {    return "orders";}
```

다음 요청에서는 `status`에 `OrderStatus.READY`가 전달됩니다.

```
GET /orders?status=READY
```

요청 값이 파라미터 타입으로 변환될 수 없으면 타입 변환 예외가 발생합니다. 예를 들어 `int page`를 받는 메서드에 숫자가 아닌 값이 들어오면 정상적으로 변환할 수 없습니다.

```
GET /orders?page=abc
```

이 요청에서 `"abc"`는 `int`로 변환할 수 없기 때문에 컨트롤러 메서드가 정상적으로 호출되지 않습니다.

`@PathVariable`과 `@RequestParam`은 모두 문자열로 들어온 요청 값을 메서드 파라미터 타입에 맞게 변환합니다. 차이는 값을 읽는 위치입니다. `@PathVariable`은 URI 경로 일부를 읽고, `@RequestParam`은 쿼리 스트링이나 Form 파라미터 값을 읽습니다.