---
title: "요청 본문과 HttpMessageConverter"
series: spring-web-mvc
order: 3
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-web-mvc|스프링 웹 MVC]]
- 이전 글: [[controller-and-request-mapping|컨트롤러와 요청 매핑]]
- 다음 글: [[validation-and-binding-in-spring-mvc|스프링 MVC의 검증과 바인딩]]

## 요청 본문과 응답 본문

HTTP 요청은 시작 줄, 헤더, 본문으로 구성됩니다. 이전 글에서 다룬 `@PathVariable`과 `@RequestParam`은 URI 경로 변수나 요청 파라미터를 컨트롤러 메서드 파라미터로 전달할 때 사용합니다.

JSON처럼 HTTP 메시지 본문에 담긴 데이터는 `@RequestBody`로 읽습니다.

```
POST /ordersContent-Type: application/json{  "itemName": "keyboard",  "quantity": 2}
```

이 요청에서 `itemName`, `quantity`는 URI 경로나 쿼리 스트링에 있는 값이 아닙니다. HTTP 요청 본문에 들어 있는 JSON 데이터입니다. 스프링 MVC는 이 본문을 읽어 컨트롤러 메서드의 객체 파라미터로 변환할 수 있습니다.

응답도 같은 흐름으로 처리할 수 있습니다. 컨트롤러가 객체를 반환하면 스프링 MVC는 이 객체를 JSON 같은 응답 본문으로 변환해 클라이언트에게 반환할 수 있습니다.

```
HTTP/1.1 200 OKContent-Type: application/json{  "id": 1,  "itemName": "keyboard",  "quantity": 2}
```

요청 본문을 객체로 읽거나, 객체를 응답 본문으로 쓸 때 `HttpMessageConverter`가 사용됩니다.

`@RequestBody`는 HTTP 메시지 본문을 Converter로 읽어 객체를 만듭니다. 반면 `@ModelAttribute`는 요청 파라미터를 객체 프로퍼티에 바인딩합니다. 객체 생성 이후 검증을 적용하는 흐름은 다음 글에서 다룹니다.

## @RequestBody와 @ResponseBody

`@RequestBody`와 `@ResponseBody`는 HTTP 메시지 본문을 컨트롤러 메서드와 연결합니다. `@RequestBody`는 요청 본문을 읽을 때 사용하고, `@ResponseBody`는 메서드 반환값을 응답 본문으로 쓸 때 사용합니다.

```
@PostMapping("/orders")@ResponseBodypublic OrderResponse create(@RequestBody OrderCreateRequest request) {    return orderService.create(request);}
```

위 메서드는 요청 본문에 담긴 JSON 데이터를 `OrderCreateRequest` 객체로 받습니다. 메서드가 반환한 `OrderResponse` 객체는 HTTP 응답 본문으로 변환됩니다.

컨트롤러 메서드가 실행될 때 스프링 MVC는 요청 본문을 직접 문자열로만 전달하지 않습니다. 요청의 `Content-Type`, 컨트롤러 메서드 파라미터 타입, 등록된 `HttpMessageConverter` 목록을 보고 요청 본문을 읽을 Converter를 선택합니다.

반환값을 응답 본문으로 쓸 때도 Converter가 사용됩니다. 이때는 반환 타입, 클라이언트가 요청한 응답 형식, 등록된 Converter 목록을 기준으로 응답 본문을 작성합니다.

### @RequestBody

`@RequestBody`는 HTTP 요청 본문을 컨트롤러 메서드 파라미터로 받을 때 사용합니다.

```
public class OrderCreateRequest {    private String itemName;    private int quantity;    // getter, setter 생략}
```

```
@PostMapping("/orders")public String create(@RequestBody OrderCreateRequest request) {    orderService.create(request);    return "redirect:/orders";}
```

클라이언트가 다음 요청을 보내면,

```
POST /ordersContent-Type: application/json{  "itemName": "keyboard",  "quantity": 2}
```

스프링 MVC는 JSON 요청 본문을 읽어 `OrderCreateRequest` 객체를 만듭니다.

```
@RequestBody OrderCreateRequest request
```

이 과정에서 JSON의 `itemName` 값은 `OrderCreateRequest`의 `itemName` 필드에, `quantity` 값은 `quantity` 필드에 매핑됩니다.

`@RequestBody`는 요청 파라미터를 읽는 어노테이션이 아닙니다. 다음 요청처럼 쿼리 스트링으로 전달된 값은 `@RequestParam`으로 받는 대상입니다.

```
GET /orders?status=READY&page=1
```

반면 다음 요청처럼 JSON 본문에 담긴 값은 `@RequestBody`로 받는 대상입니다.

```
POST /ordersContent-Type: application/json{  "status": "READY",  "page": 1}
```

### @ResponseBody와 @RestController

`@ResponseBody`는 컨트롤러 메서드 반환값을 View 이름으로 해석하지 않고 HTTP 응답 본문으로 처리합니다.

```
@Controllerpublic class OrderApiController {    @GetMapping("/api/orders/{orderId}")    @ResponseBody    public OrderResponse order(@PathVariable("orderId") Long orderId) {        return orderService.findOrder(orderId);    }}
```

위 메서드는 `OrderResponse` 객체를 반환합니다. `@ResponseBody`가 없으면 스프링 MVC는 반환값을 View 이름으로 처리하려고 합니다. 하지만 `@ResponseBody`가 적용되어 있으므로 반환 객체를 응답 본문으로 변환합니다.

`@RestController`는 `@Controller`와 `@ResponseBody`가 함께 적용된 형태로 볼 수 있습니다. 클래스에 `@RestController`를 붙이면 각 메서드에 `@ResponseBody`를 반복해서 붙이지 않아도 됩니다.

```
@RestControllerpublic class OrderApiController {    @GetMapping("/api/orders/{orderId}")    public OrderResponse order(@PathVariable("orderId") Long orderId) {        return orderService.findOrder(orderId);    }}
```

이 컨트롤러의 메서드 반환값은 기본적으로 응답 본문으로 처리됩니다.

문자열을 반환할 때도 컨트롤러 종류와 어노테이션에 따라 의미가 달라집니다. `@Controller`에서 `@ResponseBody` 없이 문자열을 반환하면 View 이름으로 해석될 수 있습니다. `@ResponseBody` 또는 `@RestController`가 적용된 상태에서 문자열을 반환하면 응답 본문으로 처리됩니다.

문자열 본문을 읽거나 쓰는 Converter는 뒤에서 `StringHttpMessageConverter`로 다룹니다.

## HttpMessageConverter란

`HttpMessageConverter`는 HTTP 메시지 본문과 Java 객체 사이의 변환을 담당하는 스프링 MVC 구성 요소입니다. 요청 본문을 읽어 컨트롤러 메서드 파라미터로 전달하거나, 컨트롤러 반환값을 HTTP 응답 본문으로 작성할 때 사용됩니다.

역할은 크게 두 가지입니다.

```
요청 본문 → Java 객체Java 객체 → 응답 본문
```

예를 들어 다음 컨트롤러 메서드에서 `OrderCreateRequest`를 만드는 과정과 `OrderResponse`를 응답 본문으로 쓰는 과정에 `HttpMessageConverter`가 사용됩니다.

```
@PostMapping("/orders")@ResponseBodypublic OrderResponse create(@RequestBody OrderCreateRequest request) {    return orderService.create(request);}
```

스프링 MVC는 하나의 Converter만 사용하는 것이 아니라 여러 `HttpMessageConverter`를 등록해 두고, 요청이나 응답 상황에 맞는 Converter를 선택합니다. JSON을 처리할 때는 `MappingJackson2HttpMessageConverter`, 문자열을 처리할 때는 `StringHttpMessageConverter`가 사용될 수 있습니다.

## HttpMessageConverter 동작 원리

`HttpMessageConverter`는 컨트롤러 메서드 호출 전후에 동작합니다. 요청 본문을 읽는 과정은 컨트롤러 메서드 호출 전에 실행되고, 응답 본문을 쓰는 과정은 컨트롤러 메서드가 값을 반환한 뒤 실행됩니다.

```
요청    → DispatcherServlet        → HandlerMapping        → HandlerAdapter            → HttpMessageConverter로 요청 본문 읽기            → Controller 메서드 호출            → HttpMessageConverter로 응답 본문 쓰기    → 응답
```

모든 컨트롤러 요청에서 항상 `HttpMessageConverter`가 사용되는 것은 아닙니다. `@RequestBody`로 요청 본문을 읽거나, `@ResponseBody` 또는 `@RestController`로 응답 본문을 쓸 때 사용됩니다.

화면을 반환하는 컨트롤러에서 View 이름을 반환하는 경우에는 `ViewResolver`와 View 렌더링 흐름이 사용됩니다.

```
@Controllerpublic class OrderPageController {    @GetMapping("/orders")    public String orders(Model model) {        model.addAttribute("orders", orderService.findOrders());        return "orders";    }}
```

이 경우 `"orders"`는 응답 본문이 아니라 View 이름입니다. `HttpMessageConverter`가 `"orders"` 문자열을 응답 본문으로 쓰는 흐름이 아닙니다.

요청 본문을 읽을 때는 요청의 `Content-Type`, 컨트롤러 메서드 파라미터 타입, 등록된 Converter 목록이 사용됩니다.

응답 본문을 쓸 때는 컨트롤러 반환 타입, 요청의 `Accept`, 매핑의 `produces`, 등록된 Converter 목록이 사용됩니다.

### 요청 본문 변환

요청 본문 변환은 `@RequestBody`가 붙은 파라미터를 처리할 때 발생합니다.

```
@PostMapping("/orders")@ResponseBodypublic OrderResponse create(@RequestBody OrderCreateRequest request) {    return orderService.create(request);}
```

클라이언트가 JSON 요청 본문을 보내면 스프링 MVC는 `Content-Type`을 확인합니다.

```
POST /ordersContent-Type: application/json
```

`Content-Type`이 `application/json`이면 요청 본문이 JSON 형식임을 나타냅니다. 스프링 MVC는 등록된 Converter 중에서 JSON 본문을 읽고 `OrderCreateRequest` 타입으로 변환할 수 있는 Converter를 찾습니다.

JSON 요청 본문을 Java 객체로 변환할 때는 보통 `MappingJackson2HttpMessageConverter`가 사용됩니다. 이 Converter는 내부적으로 Jackson을 사용해 JSON 데이터를 Java 객체로 변환합니다.

변환이 끝나면 컨트롤러 메서드는 이미 만들어진 객체를 파라미터로 받습니다.

```
public OrderResponse create(OrderCreateRequest request)
```

컨트롤러 메서드 내부에서는 HTTP 본문을 직접 파싱하지 않습니다. 컨트롤러는 변환된 객체를 사용해 서비스 계층을 호출합니다.

### 응답 본문 변환

응답 본문 변환은 `@ResponseBody`가 적용된 메서드의 반환값을 처리할 때 발생합니다. `@RestController`를 사용한 경우에도 같은 흐름이 적용됩니다.

```
@RestControllerpublic class OrderApiController {    @GetMapping("/api/orders/{orderId}")    public OrderResponse order(@PathVariable("orderId") Long orderId) {        return orderService.findOrder(orderId);    }}
```

컨트롤러 메서드가 `OrderResponse` 객체를 반환하면 스프링 MVC는 이 객체를 HTTP 응답 본문으로 작성합니다.

클라이언트가 JSON 응답을 받을 수 있다면, 스프링 MVC는 객체를 JSON으로 쓸 수 있는 Converter를 선택합니다. 이때도 보통 `MappingJackson2HttpMessageConverter`가 사용됩니다.

```
HTTP/1.1 200 OKContent-Type: application/json{  "id": 1,  "itemName": "keyboard",  "quantity": 2}
```

응답 본문 변환에서는 컨트롤러 반환값의 타입과 응답으로 사용할 미디어 타입이 함께 고려됩니다. `OrderResponse` 객체를 JSON으로 쓸 수 있는 Converter가 선택되면, 해당 Converter가 객체를 JSON 문자열로 변환해 응답 본문에 씁니다.

### Content-Type과 Accept 헤더

`Content-Type`은 HTTP 메시지 본문의 형식을 나타냅니다. 요청에서 `Content-Type`은 클라이언트가 서버로 보내는 요청 본문의 형식을 알려 줍니다.

```
POST /ordersContent-Type: application/json
```

이 요청은 본문이 JSON 형식임을 나타냅니다. 스프링 MVC는 요청 본문을 읽을 때 `Content-Type`을 보고 어떤 Converter가 본문을 읽을 수 있는지 판단합니다.

`@PostMapping`의 `consumes` 속성을 사용하면 해당 메서드가 처리할 요청 본문 형식을 제한할 수 있습니다.

```
@PostMapping(value = "/orders", consumes = "application/json")@ResponseBodypublic OrderResponse create(@RequestBody OrderCreateRequest request) {    return orderService.create(request);}
```

위 메서드는 `Content-Type: application/json` 요청을 처리 대상으로 삼습니다.

`Accept`는 클라이언트가 받을 수 있는 응답 형식을 나타냅니다.

```
GET /api/orders/1Accept: application/json
```

이 요청은 클라이언트가 JSON 응답을 받을 수 있음을 나타냅니다. 스프링 MVC는 응답 본문을 쓸 때 `Accept` 헤더와 컨트롤러 반환값 타입을 바탕으로 응답에 사용할 미디어 타입과 Converter를 선택합니다.

`@GetMapping`의 `produces` 속성을 사용하면 컨트롤러 메서드가 생성할 응답 미디어 타입을 지정할 수 있습니다.

```
@GetMapping(value = "/api/orders/{orderId}", produces = "application/json")public OrderResponse order(@PathVariable("orderId") Long orderId) {    return orderService.findOrder(orderId);}
```

`produces`는 해당 메서드가 생성할 응답 미디어 타입을 나타내며, 요청의 `Accept` 조건과도 함께 사용됩니다.

요청 본문을 읽을 때는 주로 `Content-Type`이 사용되고, 응답 본문을 쓸 때는 `Accept`가 사용됩니다. 두 헤더는 모두 미디어 타입을 다루지만, 적용되는 방향이 다릅니다.

```
Content-Type: 현재 메시지 본문의 형식Accept: 클라이언트가 받을 수 있는 응답 형식
```

요청에서는 클라이언트가 보내는 본문의 형식을 `Content-Type`으로 알립니다. 응답에서는 서버가 실제로 보낸 본문의 형식을 `Content-Type`으로 표시합니다. `Accept`는 클라이언트가 원하는 응답 형식을 서버에 전달하는 요청 헤더입니다.

## 주요 구현체

스프링 MVC에는 여러 `HttpMessageConverter` 구현체가 등록될 수 있습니다. 이 글에서는 JSON 객체 변환과 문자열 변환에서 자주 사용되는 두 구현체를 다룹니다.

`MappingJackson2HttpMessageConverter`는 JSON과 Java 객체 사이의 변환을 처리합니다. `StringHttpMessageConverter`는 문자열 본문을 읽거나 쓸 때 사용됩니다.

### MappingJackson2HttpMessageConverter

`MappingJackson2HttpMessageConverter`는 `application/json` 본문과 Java 객체 사이의 변환을 처리합니다. 요청을 읽을 때는 JSON 본문을 컨트롤러 메서드 파라미터 타입의 객체로 만들고, 응답을 쓸 때는 컨트롤러 반환 객체를 JSON 본문으로 변환합니다.

내부적으로 Jackson의 `ObjectMapper`를 사용합니다.

```
JSON 요청 본문 → Java 객체Java 객체 → JSON 응답 본문
```

다음과 같은 메서드에서 요청 본문을 읽을 때 이 Converter가 사용될 수 있습니다.

```
@PostMapping("/orders")@ResponseBodypublic OrderResponse create(@RequestBody OrderCreateRequest request) {    return orderService.create(request);}
```

`Content-Type`이 `application/json`이고, 요청 본문을 `OrderCreateRequest` 타입으로 변환할 수 있으면 JSON 본문이 Java 객체로 변환됩니다.

응답을 쓸 때는 컨트롤러 반환 객체가 JSON 응답 본문으로 변환됩니다.

```
@RestControllerpublic class OrderApiController {    @GetMapping("/api/orders/{orderId}")    public OrderResponse order(@PathVariable("orderId") Long orderId) {        return orderService.findOrder(orderId);    }}
```

컨트롤러가 `OrderResponse` 객체를 반환하면 `MappingJackson2HttpMessageConverter`는 객체를 JSON 응답 본문으로 쓸 수 있습니다.

이 Converter가 동작하려면 JSON을 처리할 수 있는 Jackson 라이브러리가 필요합니다. Spring Boot에서 `spring-boot-starter-web`을 사용하면 일반적으로 Jackson 기반 JSON 변환 구성이 함께 준비됩니다.

JSON 필드 이름과 Java 객체의 프로퍼티 이름이 맞지 않으면 원하는 형태로 매핑되지 않을 수 있습니다. 이 경우 Jackson 어노테이션이나 별도의 설정을 사용해 필드 이름, 날짜 형식, null 처리 방식 등을 조정할 수 있습니다.

### StringHttpMessageConverter

`StringHttpMessageConverter`는 문자열 본문을 읽거나 쓸 때 사용됩니다. `text/plain` 같은 문자열 기반 본문을 처리할 수 있습니다.

```
문자열 요청 본문 → StringString → 문자열 응답 본문
```

컨트롤러에서 문자열을 응답 본문으로 반환하면 이 Converter가 사용될 수 있습니다.

```
@RestControllerpublic class HealthController {    @GetMapping("/health")    public String health() {        return "OK";    }}
```

위 메서드의 반환값은 View 이름이 아닙니다. `@RestController`가 적용되어 있으므로 `"OK"` 문자열이 HTTP 응답 본문으로 쓰입니다.

```
HTTP/1.1 200 OKContent-Type: text/plainOK
```

`@Controller`에서도 메서드에 `@ResponseBody`를 붙이면 문자열을 응답 본문으로 반환할 수 있습니다.

```
@Controllerpublic class HealthController {    @GetMapping("/health")    @ResponseBody    public String health() {        return "OK";    }}
```

반대로 `@Controller`에서 `@ResponseBody` 없이 문자열을 반환하면 View 이름으로 해석될 수 있습니다.

```
@Controllerpublic class OrderPageController {    @GetMapping("/orders")    public String orders() {        return "orders";    }}
```

위 코드에서 `"orders"`는 응답 본문이 아니라 View 이름입니다. 이 경우 `StringHttpMessageConverter`가 `"orders"` 문자열을 응답 본문으로 쓰는 흐름이 아닙니다.

문자열 요청 본문을 직접 받을 수도 있습니다.

```
@PostMapping("/messages")@ResponseBodypublic String echo(@RequestBody String message) {    return message;}
```

클라이언트가 다음 요청을 보내면,

```
POST /messagesContent-Type: text/plainhello
```

`StringHttpMessageConverter`는 요청 본문인 `hello`를 `String` 파라미터로 전달할 수 있습니다. 메서드가 반환한 문자열도 응답 본문으로 쓰입니다.

```
HTTP/1.1 200 OKContent-Type: text/plainhello
```

문자열 반환값은 컨트롤러 종류와 어노테이션에 따라 의미가 달라집니다. `@Controller`에서 `@ResponseBody` 없이 반환한 문자열은 View 이름으로 처리될 수 있고, `@ResponseBody` 또는 `@RestController`가 적용된 문자열은 HTTP 응답 본문으로 처리됩니다.