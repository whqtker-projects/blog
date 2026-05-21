---
title: "스프링 MVC의 예외 처리"
series: spring-web-mvc
order: 5
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-web-mvc|스프링 웹 MVC]]
- 이전 글: [[validation-and-binding-in-spring-mvc|스프링 MVC의 검증과 바인딩]]
- 다음 글: [[filter-interceptor-and-argument-resolver|필터·인터셉터·ArgumentResolver]]

## 예외 처리가 필요한 이유

컨트롤러에서 요청을 처리하는 도중 예외가 발생할 수 있습니다. 요청한 리소스가 없거나, 요청 값이 애플리케이션 규칙을 만족하지 않거나, HTTP 요청 본문을 객체로 변환하지 못하는 경우가 대표적입니다.

예외가 컨트롤러 밖으로 그대로 전파되면 스프링 MVC는 해당 예외를 처리할 방법을 찾습니다. 처리할 방법이 없으면 서버 오류 응답으로 처리될 수 있습니다. 이 경우 클라이언트는 어떤 오류가 발생했는지, 어떤 값을 수정해야 하는지 알기 어렵습니다.

API에서는 오류 응답 형식을 일정하게 맞추는 일이 필요합니다.

```
{  "code": "ORDER_NOT_FOUND",  "message": "주문을 찾을 수 없습니다."}
```

컨트롤러에서 `try-catch`로 직접 오류 응답을 만들 수도 있습니다.

```
@GetMapping("/api/orders/{orderId}")public ResponseEntity<?> order(@PathVariable("orderId") Long orderId) {    try {        OrderResponse response = orderService.findOrder(orderId);        return ResponseEntity.ok(response);    } catch (OrderNotFoundException e) {        ErrorResponse errorResponse = ErrorResponse.of(                "ORDER_NOT_FOUND",                "주문을 찾을 수 없습니다."        );        return ResponseEntity                .status(HttpStatus.NOT_FOUND)                .body(errorResponse);    }}
```

이 방식은 예외 처리 코드가 컨트롤러 메서드 안에 섞입니다. 같은 예외를 여러 컨트롤러에서 처리해야 하면 `try-catch`, 상태 코드 지정, 오류 응답 생성 코드가 반복됩니다.

스프링 MVC는 `@ExceptionHandler`와 `@RestControllerAdvice`를 사용해 예외를 응답으로 변환하는 흐름을 제공합니다. 내부적으로는 `HandlerExceptionResolver`가 컨트롤러 실행 중 발생한 예외를 처리할 방법을 찾습니다.

예제에서 사용할 예외와 오류 응답은 다음과 같습니다.

```
public class OrderNotFoundException extends RuntimeException {    public OrderNotFoundException(Long orderId) {        super("주문을 찾을 수 없습니다. orderId=" + orderId);    }}
```

```
public record ErrorResponse(        String code,        String message,        List<FieldErrorResponse> fieldErrors) {    public static ErrorResponse of(String code, String message) {        return new ErrorResponse(code, message, List.of());    }    public static ErrorResponse of(            String code,            String message,            List<FieldErrorResponse> fieldErrors    ) {        return new ErrorResponse(code, message, fieldErrors);    }    public record FieldErrorResponse(            String field,            String message    ) {    }}
```

## @ExceptionHandler

`@ExceptionHandler`는 특정 예외가 발생했을 때 실행할 메서드를 지정하는 어노테이션입니다. 컨트롤러 안에 선언하면 해당 컨트롤러에서 발생한 예외를 처리할 수 있습니다.

다음 컨트롤러는 주문 상세 조회 API를 제공합니다.

```
@RestController@RequestMapping("/api/orders")public class OrderApiController {    private final OrderService orderService;    public OrderApiController(OrderService orderService) {        this.orderService = orderService;    }    @GetMapping("/{orderId}")    public OrderResponse order(@PathVariable("orderId") Long orderId) {        return orderService.findOrder(orderId);    }}
```

`orderService.findOrder(orderId)`에서 `OrderNotFoundException`이 발생하면 컨트롤러 밖으로 예외가 전파됩니다. 같은 컨트롤러 안에 `@ExceptionHandler` 메서드를 두면 해당 예외를 응답으로 바꿀 수 있습니다.

### 컨트롤러에서 예외 처리하기

컨트롤러 내부의 `@ExceptionHandler`는 해당 컨트롤러에서 발생한 예외를 처리합니다.

```
@ExceptionHandler(OrderNotFoundException.class)public ResponseEntity<ErrorResponse> handleOrderNotFound(OrderNotFoundException e) {    ErrorResponse response = ErrorResponse.of(            "ORDER_NOT_FOUND",            "주문을 찾을 수 없습니다."    );    return ResponseEntity            .status(HttpStatus.NOT_FOUND)            .body(response);}
```

`OrderNotFoundException`이 발생하면 `handleOrderNotFound()` 메서드가 실행됩니다. 이 메서드는 오류 응답 객체를 만들고, HTTP 상태 코드를 `404 Not Found`로 지정합니다.

응답은 다음과 같은 형태가 됩니다.

```
HTTP/1.1 404 Not FoundContent-Type: application/json{  "code": "ORDER_NOT_FOUND",  "message": "주문을 찾을 수 없습니다.",  "fieldErrors": []}
```

`@ExceptionHandler`에는 처리할 예외 타입을 지정합니다. 메서드 파라미터로 예외 객체를 받을 수 있고, 반환값으로 응답 본문이나 `ResponseEntity`를 사용할 수 있습니다.

예외 타입을 어노테이션에 명시하지 않고, 메서드 파라미터 타입으로 처리 대상을 판단하게 할 수도 있습니다.

```
@ExceptionHandlerpublic ResponseEntity<ErrorResponse> handleOrderNotFound(OrderNotFoundException e) {    ErrorResponse response = ErrorResponse.of(            "ORDER_NOT_FOUND",            "주문을 찾을 수 없습니다."    );    return ResponseEntity            .status(HttpStatus.NOT_FOUND)            .body(response);}
```

처리 대상 예외가 코드에서 바로 보이도록 하려면 `@ExceptionHandler(OrderNotFoundException.class)`처럼 예외 타입을 명시할 수 있습니다.

### ResponseEntity로 상태 코드와 응답 본문 반환하기

API 예외 처리에서는 HTTP 상태 코드와 응답 본문을 함께 지정해야 합니다. `ResponseEntity`를 사용하면 상태 코드, 헤더, 본문을 함께 구성할 수 있습니다.

```
@ExceptionHandler(OrderNotFoundException.class)public ResponseEntity<ErrorResponse> handleOrderNotFound(OrderNotFoundException e) {    ErrorResponse response = ErrorResponse.of(            "ORDER_NOT_FOUND",            "주문을 찾을 수 없습니다."    );    return ResponseEntity            .status(HttpStatus.NOT_FOUND)            .body(response);}
```

`HttpStatus.NOT_FOUND`는 404 상태 코드를 의미합니다. `body(response)`에는 클라이언트에게 반환할 오류 응답 객체를 전달합니다.

요청 값이 애플리케이션 규칙을 만족하지 않는 경우에는 400 상태 코드를 사용할 수 있습니다.

```
@ExceptionHandler(IllegalArgumentException.class)public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {    ErrorResponse response = ErrorResponse.of(            "BAD_REQUEST",            e.getMessage()    );    return ResponseEntity            .badRequest()            .body(response);}
```

`@ResponseStatus`를 사용해 상태 코드를 고정할 수도 있습니다.

```
@ResponseStatus(HttpStatus.NOT_FOUND)@ExceptionHandler(OrderNotFoundException.class)public ErrorResponse handleOrderNotFound(OrderNotFoundException e) {    return ErrorResponse.of(            "ORDER_NOT_FOUND",            "주문을 찾을 수 없습니다."    );}
```

`@ResponseStatus`는 상태 코드를 고정해서 지정할 때 사용할 수 있습니다. 응답 상태를 예외 상황에 따라 다르게 구성하거나, 헤더와 응답 본문을 함께 제어해야 한다면 `ResponseEntity`를 반환하는 방식이 더 직접적입니다.

## @RestControllerAdvice를 사용한 전역 예외 처리

컨트롤러 내부의 `@ExceptionHandler`는 해당 컨트롤러에만 적용됩니다. 여러 컨트롤러에서 같은 예외 응답 형식을 사용하려면 예외 처리 메서드를 별도 클래스로 분리할 수 있습니다.

`@RestControllerAdvice`는 여러 컨트롤러에 공통으로 적용되는 예외 처리 클래스를 만들 때 사용합니다.

```
@RestControllerAdvicepublic class GlobalExceptionHandler {    @ExceptionHandler(OrderNotFoundException.class)    public ResponseEntity<ErrorResponse> handleOrderNotFound(OrderNotFoundException e) {        ErrorResponse response = ErrorResponse.of(                "ORDER_NOT_FOUND",                "주문을 찾을 수 없습니다."        );        return ResponseEntity                .status(HttpStatus.NOT_FOUND)                .body(response);    }    @ExceptionHandler(IllegalArgumentException.class)    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {        ErrorResponse response = ErrorResponse.of(                "BAD_REQUEST",                e.getMessage()        );        return ResponseEntity                .badRequest()                .body(response);    }}
```

이제 컨트롤러는 예외 응답을 직접 만들지 않고, 요청 처리 흐름만 담을 수 있습니다.

```
@GetMapping("/{orderId}")public OrderResponse order(@PathVariable("orderId") Long orderId) {    return orderService.findOrder(orderId);}
```

`orderService.findOrder(orderId)`에서 `OrderNotFoundException`이 발생하면 `GlobalExceptionHandler`의 `handleOrderNotFound()`가 실행됩니다.

### 컨트롤러별 예외 처리의 중복 제거

전역 예외 처리를 사용하면 컨트롤러마다 같은 예외 처리 코드를 반복하지 않아도 됩니다. 컨트롤러는 요청 값을 받고 서비스 계층을 호출하며, 예외를 어떤 상태 코드와 응답 본문으로 바꿀지는 `GlobalExceptionHandler`가 담당합니다.

```
@RestControllerAdvicepublic class GlobalExceptionHandler {    @ExceptionHandler(OrderNotFoundException.class)    public ResponseEntity<ErrorResponse> handleOrderNotFound(OrderNotFoundException e) {        ErrorResponse response = ErrorResponse.of(                "ORDER_NOT_FOUND",                "주문을 찾을 수 없습니다."        );        return ResponseEntity                .status(HttpStatus.NOT_FOUND)                .body(response);    }}
```

이렇게 분리하면 같은 예외에 대해 여러 컨트롤러가 같은 응답 형식을 사용합니다.

### 공통 오류 응답 형식

API 오류 응답은 일정한 형식으로 반환할 수 있습니다. 앞에서 사용한 `ErrorResponse`는 오류 코드, 메시지, 필드 오류 목록을 담습니다.

```
{  "code": "VALIDATION_FAILED",  "message": "요청 값이 올바르지 않습니다.",  "fieldErrors": [    {      "field": "itemName",      "message": "비어 있을 수 없습니다."    },    {      "field": "quantity",      "message": "1 이상이어야 합니다."    }  ]}
```

이전 글에서 다룬 `@RequestBody` 검증 실패는 예외 처리 흐름과 연결됩니다. `@Valid @RequestBody` 검증에 실패하면 스프링 MVC는 `MethodArgumentNotValidException`을 발생시킬 수 있습니다. 전역 예외 처리에서는 이 예외를 공통 오류 응답으로 변환할 수 있습니다.

```
@ExceptionHandler(MethodArgumentNotValidException.class)public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(        MethodArgumentNotValidException e) {    List<ErrorResponse.FieldErrorResponse> fieldErrors = e.getBindingResult()            .getFieldErrors()            .stream()            .map(fieldError -> new ErrorResponse.FieldErrorResponse(                    fieldError.getField(),                    fieldError.getDefaultMessage()            ))            .toList();    ErrorResponse response = ErrorResponse.of(            "VALIDATION_FAILED",            "요청 값이 올바르지 않습니다.",            fieldErrors    );    return ResponseEntity            .badRequest()            .body(response);}
```

JSON 문법이 잘못되었거나 요청 본문을 객체로 변환할 수 없는 경우에는 검증 단계까지 가지 못합니다. 이 경우에는 `HttpMessageConverter`의 변환 과정에서 예외가 발생합니다. 전역 예외 처리에서는 본문 변환 실패를 검증 실패와 구분해 응답할 수 있습니다.

```
@ExceptionHandler(HttpMessageNotReadableException.class)public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(        HttpMessageNotReadableException e) {    ErrorResponse response = ErrorResponse.of(            "INVALID_REQUEST_BODY",            "요청 본문을 읽을 수 없습니다."    );    return ResponseEntity            .badRequest()            .body(response);}
```

`MethodArgumentNotValidException`은 객체 생성 이후 검증 실패를 처리하는 흐름이고, `HttpMessageNotReadableException`은 요청 본문을 객체로 만들기 전에 실패한 흐름입니다.

## @ControllerAdvice와 @RestControllerAdvice의 차이

`@ControllerAdvice`는 여러 컨트롤러에 공통 기능을 적용할 때 사용하는 어노테이션입니다. 예외 처리뿐 아니라 `@InitBinder`, `@ModelAttribute` 같은 컨트롤러 보조 기능도 전역으로 적용할 수 있습니다.

화면 기반 MVC에서는 예외가 발생했을 때 오류 View로 이동할 수 있습니다.

```
@ControllerAdvicepublic class GlobalControllerAdvice {    @ExceptionHandler(OrderNotFoundException.class)    public String handleOrderNotFound(OrderNotFoundException e) {        return "error/404";    }}
```

위 메서드가 반환한 `"error/404"`는 View 이름으로 처리될 수 있습니다.

API에서는 예외 응답을 View가 아니라 HTTP 응답 본문으로 반환해야 하는 경우가 많습니다. 이때는 `@RestControllerAdvice`를 사용할 수 있습니다.

```
@RestControllerAdvicepublic class GlobalExceptionHandler {    @ExceptionHandler(OrderNotFoundException.class)    public ResponseEntity<ErrorResponse> handleOrderNotFound(OrderNotFoundException e) {        ErrorResponse response = ErrorResponse.of(                "ORDER_NOT_FOUND",                "주문을 찾을 수 없습니다."        );        return ResponseEntity                .status(HttpStatus.NOT_FOUND)                .body(response);    }}
```

`@RestControllerAdvice`는 `@ControllerAdvice`에 `@ResponseBody`가 적용된 형태로 볼 수 있습니다. 따라서 `@ExceptionHandler` 메서드가 반환한 객체는 View 이름이 아니라 응답 본문으로 처리됩니다.

`@ControllerAdvice`의 `@ExceptionHandler` 메서드가 문자열을 반환하면 View 이름으로 처리될 수 있습니다. `@RestControllerAdvice`에서는 반환 객체가 응답 본문으로 처리됩니다.

## HandlerExceptionResolver

`HandlerExceptionResolver`는 컨트롤러 실행 중 발생한 예외를 처리하고, 이를 응답으로 변환하는 스프링 MVC의 확장 지점입니다.

컨트롤러에서 예외가 발생하면 `DispatcherServlet`은 예외를 처리할 수 있는 `HandlerExceptionResolver`를 찾습니다. Resolver가 예외를 처리하면 스프링 MVC는 그 결과를 바탕으로 응답을 만듭니다.

```
요청    → DispatcherServlet        → HandlerMapping        → HandlerAdapter        → Controller 실행 중 예외 발생        → HandlerExceptionResolver        → 오류 응답 반환
```

`@ExceptionHandler`와 `@RestControllerAdvice`도 이 예외 처리 흐름 안에서 동작합니다. 개발자는 보통 `HandlerExceptionResolver`를 직접 구현하기보다, `@ExceptionHandler`와 Advice 기반 예외 처리를 사용합니다.

### 예외를 응답으로 변환하는 흐름

컨트롤러에서 `OrderNotFoundException`이 발생했다고 가정합니다.

```
@GetMapping("/{orderId}")public OrderResponse order(@PathVariable("orderId") Long orderId) {    return orderService.findOrder(orderId);}
```

예외가 컨트롤러 밖으로 전파되면 `DispatcherServlet`은 등록된 `HandlerExceptionResolver`를 사용해 이 예외를 처리하려고 합니다. 이때 `@RestControllerAdvice`에 `OrderNotFoundException`을 처리하는 `@ExceptionHandler` 메서드가 있으면 해당 메서드가 실행됩니다.

```
OrderNotFoundException 발생    → DispatcherServlet으로 예외 전파    → HandlerExceptionResolver가 처리 방법 탐색    → @ExceptionHandler 메서드 실행    → ResponseEntity를 기준으로 HTTP 응답 생성
```

이 흐름에서는 개발자가 컨트롤러 메서드마다 `try-catch`를 작성하지 않아도 됩니다. 컨트롤러 밖으로 전파된 예외는 스프링 MVC 예외 처리 흐름에서 응답으로 변환됩니다.

### 기본 예외 처리와 커스텀 예외 처리

스프링 MVC에는 기본적으로 여러 예외 처리 Resolver가 등록됩니다. 예를 들어 `@ExceptionHandler` 메서드를 처리하는 Resolver, `@ResponseStatus`가 붙은 예외를 처리하는 Resolver, 스프링 MVC 내부 예외를 상태 코드로 변환하는 Resolver가 사용될 수 있습니다.

`@ExceptionHandler` 기반 처리는 컨트롤러나 Advice에 선언한 메서드로 예외를 처리합니다.

```
@ExceptionHandler(OrderNotFoundException.class)public ResponseEntity<ErrorResponse> handleOrderNotFound(OrderNotFoundException e) {    ErrorResponse response = ErrorResponse.of(            "ORDER_NOT_FOUND",            "주문을 찾을 수 없습니다."    );    return ResponseEntity            .status(HttpStatus.NOT_FOUND)            .body(response);}
```

`@ResponseStatus`가 붙은 예외는 예외 클래스에 지정된 상태 코드로 처리될 수 있습니다.

```
@ResponseStatus(HttpStatus.NOT_FOUND)public class OrderNotFoundException extends RuntimeException {    public OrderNotFoundException(Long orderId) {        super("주문을 찾을 수 없습니다. orderId=" + orderId);    }}
```

이 방식은 간단하지만, 응답 본문을 공통 형식으로 구성하기에는 제한이 있습니다. API에서 오류 코드와 메시지, 필드 오류 목록을 함께 반환해야 한다면 `@RestControllerAdvice`에서 `ResponseEntity`를 반환하는 흐름을 사용할 수 있습니다.

`HandlerExceptionResolver`를 직접 구현할 수도 있지만 일반적인 API 예외 처리에서 먼저 선택할 방식은 아닙니다. 직접 구현은 `@ExceptionHandler`나 `@RestControllerAdvice`로 다루기 어려운 예외 처리 요구사항이 있을 때 검토합니다. 예를 들어 스프링 MVC의 기본 예외 처리 흐름보다 더 낮은 수준에서 응답 상태나 View를 직접 제어해야 하는 경우가 여기에 해당합니다.
