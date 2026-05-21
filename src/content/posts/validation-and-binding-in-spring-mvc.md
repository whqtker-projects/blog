---
title: "스프링 MVC의 검증과 바인딩"
series: spring-web-mvc
order: 4
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-web-mvc|스프링 웹 MVC]]
- 이전 글: [[request-body-and-message-converter|요청 본문과 HttpMessageConverter]]
- 다음 글: [[exception-handling-in-spring-mvc|스프링 MVC의 예외 처리]]

## 데이터 바인딩이란

데이터 바인딩은 요청으로 전달된 값을 객체의 프로퍼티에 채우는 과정입니다. 스프링 MVC에서 `@ModelAttribute` 바인딩은 요청 파라미터나 Form 데이터를 객체 프로퍼티에 채우는 흐름을 담당합니다.

이전 글에서는 `@RequestBody`가 HTTP 메시지 본문을 `HttpMessageConverter`로 읽어 객체를 만드는 흐름을 다뤘습니다. 이번 글에서는 요청 파라미터를 객체에 채우는 `@ModelAttribute` 바인딩과, 바인딩 이후 검증 오류를 처리하는 흐름을 다룹니다.

예를 들어 HTML Form에서 다음 요청을 보낸다고 가정합니다.

```
POST /ordersContent-Type: application/x-www-form-urlencodeditemName=keyboard&quantity=2
```

이 요청의 `itemName`, `quantity` 값은 요청 파라미터입니다. 스프링 MVC는 이 값을 다음 객체의 프로퍼티에 채울 수 있습니다.

```
public class OrderForm {    private String itemName;    private Integer quantity;    // getter, setter 생략}
```

요청 파라미터 이름과 객체의 프로퍼티 이름이 같으면 스프링 MVC가 값을 찾아 객체에 넣습니다. `itemName=keyboard`는 `itemName` 프로퍼티에 바인딩되고, `quantity=2`는 타입 변환을 거쳐 `quantity` 프로퍼티에 바인딩됩니다.

```
요청 파라미터    → 객체 생성    → 프로퍼티 이름 매칭    → 타입 변환 후 값 바인딩
```

이 흐름이 `@ModelAttribute` 바인딩의 기본 동작입니다.

## @ModelAttribute와 바인딩 과정

`@ModelAttribute`는 요청 파라미터를 객체에 바인딩할 때 사용합니다. 컨트롤러 메서드 파라미터에 `@ModelAttribute`를 붙이면 스프링 MVC는 해당 타입의 객체를 만들고, 요청 파라미터 값을 객체의 프로퍼티에 채웁니다.

```
@PostMapping("/orders")public String create(@ModelAttribute OrderForm form) {    orderService.create(form);    return "redirect:/orders";}
```

위 메서드는 요청 파라미터를 `OrderForm` 객체에 바인딩합니다. 컨트롤러 메서드 안에서는 개별 요청 파라미터를 하나씩 꺼내지 않고, 값이 채워진 `OrderForm` 객체를 사용할 수 있습니다.

`@ModelAttribute`는 생략할 수도 있습니다. 스프링 MVC는 단순 타입이 아닌 객체 파라미터를 모델 속성으로 처리할 수 있습니다.

```
@PostMapping("/orders")public String create(OrderForm form) {    orderService.create(form);    return "redirect:/orders";}
```

다만 예제에서는 요청 파라미터를 객체에 바인딩한다는 의도를 드러내기 위해 `@ModelAttribute`를 명시하겠습니다.

### 요청 파라미터와 객체 프로퍼티

`@ModelAttribute` 바인딩은 요청 파라미터 이름과 객체 프로퍼티 이름을 기준으로 동작합니다.

다음 Form은 `itemName`, `quantity`라는 이름으로 값을 전송합니다.

```
<form action="/orders" method="post">    <input type="text" name="itemName">    <input type="number" name="quantity">    <button type="submit">주문</button></form>
```

이 Form을 제출하면 다음과 같은 요청 파라미터가 전달됩니다.

```
POST /ordersContent-Type: application/x-www-form-urlencodeditemName=keyboard&quantity=2
```

컨트롤러는 이 값을 `OrderForm` 객체로 받을 수 있습니다.

```
@PostMapping("/orders")public String create(@ModelAttribute OrderForm form) {    orderService.create(form);    return "redirect:/orders";}
```

스프링 MVC는 `itemName` 요청 파라미터를 `itemName` 프로퍼티에, `quantity` 요청 파라미터를 `quantity` 프로퍼티에 바인딩합니다.

```
itemName=keyboard → itemName 프로퍼티에 바인딩quantity=2        → quantity 프로퍼티에 바인딩
```

GET 요청의 쿼리 파라미터도 같은 방식으로 바인딩할 수 있습니다.

```
GET /orders/search?itemName=keyboard&quantity=2
```

```
@GetMapping("/orders/search")public String search(@ModelAttribute OrderSearchCondition condition, Model model) {    List<Order> orders = orderService.search(condition);    model.addAttribute("orders", orders);    return "orders";}
```

`@ModelAttribute`로 바인딩된 객체는 View 렌더링에 사용할 모델 속성으로도 다뤄집니다. 이 때문에 검증 오류가 발생해 Form 화면을 다시 반환할 때, 사용자가 입력한 값을 화면에 다시 보여줄 수 있습니다.

```
@PostMapping("/orders")public String create(@ModelAttribute OrderForm form) {    return "order-form";}
```

위 경우 `OrderForm` 객체는 기본적으로 `orderForm`이라는 이름으로 Model에 담길 수 있습니다. 이름을 직접 지정할 수도 있습니다.

```
@PostMapping("/orders")public String create(@ModelAttribute("order") OrderForm form) {    return "order-form";}
```

### 타입 변환

HTTP 요청으로 전달되는 값은 기본적으로 문자열입니다. `@ModelAttribute` 바인딩 과정에서는 문자열 요청 값이 객체 프로퍼티 타입에 맞게 변환됩니다.

```
POST /ordersContent-Type: application/x-www-form-urlencodeditemName=keyboard&quantity=2
```

`quantity=2`는 요청에서는 문자열입니다. 하지만 `OrderForm`의 `quantity` 프로퍼티 타입이 `Integer`라면 스프링 MVC가 `"2"`를 `Integer` 타입의 `2`로 변환합니다.

```
public class OrderForm {    private String itemName;    private Integer quantity;    // getter, setter 생략}
```

이 변환에는 스프링의 타입 변환 기능이 사용됩니다. `Integer`, `Long`, `Boolean`, `Enum` 같은 타입은 기본 변환 대상이 될 수 있습니다.

날짜 타입은 형식 정보를 지정해야 하는 경우가 많습니다.

```
public class OrderSearchCondition {    @DateTimeFormat(pattern = "yyyy-MM-dd")    private LocalDate orderedDate;    // getter, setter 생략}
```

다음 요청이 들어오면,

```
GET /orders/search?orderedDate=2026-05-21
```

스프링 MVC는 `"2026-05-21"` 문자열을 `LocalDate`로 변환해 `orderedDate` 프로퍼티에 바인딩할 수 있습니다.

타입 변환은 프로퍼티에 값을 넣는 과정에서 수행됩니다. 변환할 수 없는 값이 들어오면 바인딩 오류가 발생합니다.

```
POST /ordersContent-Type: application/x-www-form-urlencodeditemName=keyboard&quantity=abc
```

`quantity` 프로퍼티가 `Integer` 타입이라면 `"abc"`는 숫자로 변환할 수 없습니다. 이 경우 컨트롤러 메서드에서 `BindingResult`를 받을 수 있도록 선언하면, 스프링 MVC는 타입 변환 실패 정보를 `BindingResult`에 담습니다.

### 바인딩 오류

바인딩 오류는 요청 값을 객체 프로퍼티에 채우는 과정에서 발생한 오류입니다. 대표적인 예는 타입 변환 실패입니다.

다음 요청에서는 `quantity` 값이 숫자가 아닙니다.

```
POST /ordersContent-Type: application/x-www-form-urlencodeditemName=keyboard&quantity=abc
```

스프링 MVC는 `"abc"`를 `Integer`로 변환할 수 없기 때문에 `quantity` 필드에 대한 바인딩 오류를 만듭니다.

```
@PostMapping("/orders")public String create(        @ModelAttribute OrderForm form,        BindingResult bindingResult) {    if (bindingResult.hasErrors()) {        return "order-form";    }    orderService.create(form);    return "redirect:/orders";}
```

`BindingResult`는 바인딩 대상 바로 뒤에 선언해야 합니다. 위 코드에서는 `OrderForm form`이 바인딩 대상이고, 그 바로 뒤에 `BindingResult bindingResult`가 있습니다.

```
@ModelAttribute OrderForm form,BindingResult bindingResult
```

`BindingResult`가 있으면 바인딩 오류가 발생해도 컨트롤러 메서드 안에서 오류를 직접 처리할 수 있습니다. 바인딩 오류가 있으면 다시 Form 화면을 반환할 수 있습니다.

```
if (bindingResult.hasErrors()) {    return "order-form";}
```

이 경우 `@ModelAttribute`로 바인딩된 객체와 오류 정보가 View 렌더링에 함께 사용됩니다. View에서는 사용자가 입력한 값과 오류 메시지를 함께 보여줄 수 있습니다.

바인딩은 검증보다 먼저 일어납니다. 요청 파라미터 이름을 객체 프로퍼티와 매칭하고, 타입 변환을 거쳐 값을 넣는 과정에서 오류가 발생하면 해당 오류가 `BindingResult`에 기록됩니다.

```
요청 파라미터 수집    → 객체 생성    → 프로퍼티 이름 매칭    → 타입 변환 후 값 바인딩    → 바인딩 오류 기록    → 검증
```

## 검증 흐름

검증은 바인딩이 끝난 객체의 값이 애플리케이션 규칙을 만족하는지 검사하는 단계입니다. 바인딩이 요청 값을 객체에 채우는 과정이라면, 검증은 채워진 값이 사용할 수 있는 값인지 검사하는 과정입니다.

예를 들어 주문 생성 Form 객체에 다음 규칙을 적용한다고 가정합니다.

```
public class OrderForm {    @NotBlank    private String itemName;    @NotNull    @Min(1)    private Integer quantity;    // getter, setter 생략}
```

`itemName`은 비어 있으면 안 되고, `quantity`는 `null`이 아니면서 1 이상이어야 합니다.

컨트롤러 메서드에서 `@Valid`를 붙이면 바인딩 이후 검증이 실행됩니다.

```
@PostMapping("/orders")public String create(        @Valid @ModelAttribute OrderForm form,        BindingResult bindingResult) {    if (bindingResult.hasErrors()) {        return "order-form";    }    orderService.create(form);    return "redirect:/orders";}
```

요청 처리 흐름은 다음과 같습니다.

```
요청 파라미터 수집    → OrderForm 객체 생성    → 프로퍼티 이름 매칭    → 타입 변환 후 값 바인딩    → Bean Validation 검증    → BindingResult에 오류 저장    → 컨트롤러 메서드 본문 실행
```

검증 오류가 있으면 `bindingResult.hasErrors()`가 `true`를 반환합니다. 이 경우 서비스 계층을 호출하지 않고 다시 Form 화면을 반환할 수 있습니다.

### @Valid와 @Validated

`@Valid`는 Bean Validation 표준 어노테이션입니다. 스프링 MVC 컨트롤러 메서드 파라미터에 붙이면, 바인딩된 객체에 대해 Bean Validation이 실행됩니다.

```
@PostMapping("/orders")public String create(        @Valid @ModelAttribute OrderForm form,        BindingResult bindingResult) {    if (bindingResult.hasErrors()) {        return "order-form";    }    orderService.create(form);    return "redirect:/orders";}
```

검증 규칙은 객체의 필드에 선언합니다.

```
public class OrderForm {    @NotBlank    private String itemName;    @NotNull    @Min(1)    private Integer quantity;    // getter, setter 생략}
```

각 어노테이션은 필드 값에 대한 검증 규칙을 나타냅니다.

```
@NotBlank: null, 빈 문자열, 공백 문자열을 허용하지 않습니다.@NotNull: null을 허용하지 않습니다.@Min(1): 숫자 값이 1 이상이어야 합니다.
```

`@Validated`는 스프링이 제공하는 검증 어노테이션입니다. 기본 검증 흐름에서는 `@Valid`와 비슷하게 사용할 수 있고, 검증 그룹을 지정할 수 있습니다.

```
@PostMapping("/orders")public String create(        @Validated @ModelAttribute OrderForm form,        BindingResult bindingResult) {    if (bindingResult.hasErrors()) {        return "order-form";    }    orderService.create(form);    return "redirect:/orders";}
```

검증 그룹은 같은 객체를 생성과 수정에서 함께 사용하면서, 상황별로 검증 규칙을 나눠야 할 때 사용할 수 있습니다. 일반적인 요청 검증에서는 `@Valid`만으로도 충분한 경우가 많습니다.

### BindingResult 활용

`BindingResult`는 바인딩 오류와 검증 오류를 담는 객체입니다. 타입 변환 실패처럼 바인딩 과정에서 발생한 오류와, `@NotBlank`, `@Min` 같은 검증 규칙 위반을 함께 다룰 수 있습니다.

```
@PostMapping("/orders")public String create(        @Valid @ModelAttribute OrderForm form,        BindingResult bindingResult) {    if (bindingResult.hasErrors()) {        return "order-form";    }    orderService.create(form);    return "redirect:/orders";}
```

`BindingResult`는 검증 대상 바로 뒤에 와야 합니다.

```
@Valid @ModelAttribute OrderForm form,BindingResult bindingResult
```

다음처럼 중간에 다른 파라미터가 들어가면 `OrderForm`의 바인딩 결과로 연결되지 않습니다.

```
@PostMapping("/orders")public String create(        @Valid @ModelAttribute OrderForm form,        Model model,        BindingResult bindingResult) {    return "order-form";}
```

`BindingResult`는 바로 앞의 바인딩 대상과 한 쌍으로 처리됩니다. 중간에 `Model` 같은 다른 파라미터가 들어가면 `OrderForm`의 바인딩 결과로 연결되지 않습니다.

검증 오류가 있으면 `bindingResult.hasErrors()`로 분기할 수 있습니다.

```
if (bindingResult.hasErrors()) {    return "order-form";}
```

필드별 오류는 `getFieldErrors()`로 확인할 수 있습니다.

```
for (FieldError fieldError : bindingResult.getFieldErrors()) {    String field = fieldError.getField();    String message = fieldError.getDefaultMessage();}
```

특정 필드에 오류를 직접 추가할 수도 있습니다.

```
@PostMapping("/orders")public String create(        @Valid @ModelAttribute OrderForm form,        BindingResult bindingResult) {    if (form.getQuantity() != null && form.getQuantity() > 100) {        bindingResult.rejectValue("quantity", "max", "한 번에 주문할 수 있는 수량은 100개까지입니다.");    }    if (bindingResult.hasErrors()) {        return "order-form";    }    orderService.create(form);    return "redirect:/orders";}
```

`rejectValue()`는 특정 필드에 오류를 추가합니다. 첫 번째 값은 필드 이름이고, 두 번째 값은 오류 코드이며, 세 번째 값은 기본 메시지입니다.

필드 하나가 아니라 객체 전체에 대한 오류는 `reject()`로 추가할 수 있습니다.

```
if (form.getQuantity() != null && form.getItemName() != null) {    if (form.getItemName().equals("sample") && form.getQuantity() > 10) {        bindingResult.reject("order.invalid", "sample 상품은 10개를 초과해 주문할 수 없습니다.");    }}
```

`reject()`로 추가한 오류는 특정 필드가 아니라 객체 전체에 대한 글로벌 오류로 처리됩니다. 여러 필드의 조합을 봐야 하는 규칙을 다룰 때 사용할 수 있습니다.

## @RequestBody 검증과의 차이

`@ModelAttribute`와 `@RequestBody`는 모두 객체를 만들고 검증을 적용할 수 있지만, 객체를 만드는 방식이 다릅니다.

`@ModelAttribute`는 요청 파라미터를 객체 프로퍼티에 바인딩합니다.

```
@PostMapping("/orders")public String create(        @Valid @ModelAttribute OrderForm form,        BindingResult bindingResult) {    if (bindingResult.hasErrors()) {        return "order-form";    }    orderService.create(form);    return "redirect:/orders";}
```

이 방식은 HTML Form 요청을 처리할 때 자주 사용됩니다.

```
POST /ordersContent-Type: application/x-www-form-urlencodeditemName=keyboard&quantity=2
```

반면 `@RequestBody`는 HTTP 메시지 본문을 `HttpMessageConverter`로 읽어 객체를 만듭니다.

```
@PostMapping("/api/orders")public OrderResponse create(@Valid @RequestBody OrderCreateRequest request) {    return orderService.create(request);}
```

이 방식은 JSON 요청 본문을 처리할 때 자주 사용됩니다.

```
POST /api/ordersContent-Type: application/json{  "itemName": "keyboard",  "quantity": 2}
```

`@RequestBody`에서도 검증을 적용할 수 있습니다. 검증 대상 바로 뒤에 `BindingResult`를 선언하면 컨트롤러 메서드 안에서 오류를 직접 처리할 수 있습니다.

```
@PostMapping("/api/orders")public ResponseEntity<?> create(        @Valid @RequestBody OrderCreateRequest request,        BindingResult bindingResult) {    if (bindingResult.hasErrors()) {        return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());    }    OrderResponse response = orderService.create(request);    return ResponseEntity.ok(response);}
```

다만 JSON 문법이 잘못되었거나 요청 본문을 객체로 변환할 수 없는 경우에는 검증 단계까지 가지 못합니다. 이 경우 `HttpMessageConverter`의 변환 과정에서 예외가 발생하며, `BindingResult`에 검증 오류로 담기는 흐름과 구분됩니다.

```
@RequestBody 요청 처리    → HttpMessageConverter로 요청 본문 읽기    → 객체 생성    → 검증
```

본문 변환이 실패하면 검증 대상 객체가 만들어지지 않습니다. 따라서 `@RequestBody` 검증 실패와 본문 변환 실패는 다른 흐름으로 처리됩니다.

API에서는 검증 실패나 본문 변환 실패를 컨트롤러마다 직접 처리하기보다, 예외 처리 흐름으로 모아 공통 응답 형식으로 변환하는 경우가 많습니다. 이 내용은 다음 글의 예외 처리 흐름과 연결됩니다.

`@ModelAttribute`는 바인딩된 객체와 오류 정보를 다시 View에 전달해 Form 화면을 렌더링하는 흐름과 잘 맞습니다. `@RequestBody`는 JSON 요청 본문을 객체로 변환하고, 검증 실패 시 오류 응답을 반환하는 흐름과 자주 함께 사용됩니다.

```
@ModelAttribute    → 요청 파라미터 바인딩    → 검증    → 오류가 있으면 Form 화면 반환@RequestBody    → HttpMessageConverter로 요청 본문 변환    → 검증    → 오류가 있으면 오류 응답 반환
```

## 커스텀 Validator

Bean Validation 어노테이션만으로 표현하기 어려운 검증 규칙은 커스텀 Validator로 분리할 수 있습니다. 스프링의 `Validator` 인터페이스를 구현하면 특정 객체에 대한 검증 로직을 직접 작성할 수 있습니다.

예를 들어 주문 수량이 상품별 정책에 따라 달라지는 경우를 가정합니다. 단순히 `@Min`, `@Max`만으로 처리하기 어렵다면 Validator에서 직접 검사할 수 있습니다.

```
@Componentpublic class OrderFormValidator implements Validator {    @Override    public boolean supports(Class<?> clazz) {        return OrderForm.class.isAssignableFrom(clazz);    }    @Override    public void validate(Object target, Errors errors) {        OrderForm form = (OrderForm) target;        if (form.getItemName() == null || form.getQuantity() == null) {            return;        }        if (form.getItemName().equals("sample") && form.getQuantity() > 10) {            errors.rejectValue("quantity", "max.sample", "sample 상품은 10개를 초과해 주문할 수 없습니다.");        }    }}
```

`supports()`는 이 Validator가 어떤 타입을 검증할 수 있는지 나타냅니다. `validate()`는 실제 검증 로직을 실행하고, 오류가 있으면 `Errors`에 기록합니다.

컨트롤러에서는 Validator를 주입받아 직접 호출할 수 있습니다.

```
@Controllerpublic class OrderController {    private final OrderFormValidator orderFormValidator;    public OrderController(OrderFormValidator orderFormValidator) {        this.orderFormValidator = orderFormValidator;    }    @PostMapping("/orders")    public String create(            @Valid @ModelAttribute OrderForm form,            BindingResult bindingResult    ) {        orderFormValidator.validate(form, bindingResult);        if (bindingResult.hasErrors()) {            return "order-form";        }        orderService.create(form);        return "redirect:/orders";    }}
```

이 흐름에서는 먼저 Bean Validation이 실행되고, 컨트롤러 메서드 안에서 커스텀 Validator가 추가 검증을 수행합니다. 두 검증에서 발생한 오류는 같은 `BindingResult`에 쌓입니다.

Validator를 특정 컨트롤러의 바인딩 과정에 등록하려면 `@InitBinder`를 사용할 수 있습니다. 이 방식은 같은 Form 객체를 여러 메서드에서 반복해서 검증해야 할 때 사용합니다.

```
@InitBinder("orderForm")public void init(WebDataBinder binder) {    binder.addValidators(orderFormValidator);}
```

`@InitBinder`는 컨트롤러에서 사용할 `WebDataBinder`를 설정할 때 사용합니다. `binder.addValidators(orderFormValidator)`를 호출하면 `orderForm` 모델 속성에 대한 검증 과정에서 `OrderFormValidator`가 함께 실행됩니다.