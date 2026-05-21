---
title: 필터, 인터셉터, ArgumentResolver
series: spring-web-mvc
order: 6
status: draft
tags:
  - graph/post
---
관련 링크:
- 소속 시리즈: [[series_indexes/spring-framework/spring-web-mvc|스프링 웹 MVC]]
- 이전 글: [[exception-handling-in-spring-mvc|스프링 MVC의 예외 처리]]

## 요청 처리 흐름의 확장 지점

Spring MVC는 요청을 바로 Controller에 전달하지 않습니다. 요청은 서블릿 컨테이너, `DispatcherServlet`, `HandlerMapping`, `HandlerAdapter`를 거쳐 Controller 메서드까지 도달합니다.

이 과정에서 요청 처리 흐름을 확장할 수 있는 지점이 여러 개 있습니다.

```
클라이언트  -> 서블릿 컨테이너  -> Filter  -> DispatcherServlet  -> HandlerMapping에서 Handler와 인터셉터 체인 조회  -> HandlerInterceptor의 preHandle()  -> HandlerAdapter  -> ArgumentResolver  -> Controller  -> HandlerInterceptor의 postHandle(), afterCompletion()
```

필터는 Spring MVC에 요청이 들어오기 전, 서블릿 컨테이너 레벨에서 동작합니다. 인터셉터는 Spring MVC 내부에서 Handler가 정해진 뒤 Controller 호출 전후에 동작합니다. ArgumentResolver는 Controller 메서드에 전달할 값을 만들어 줍니다.

## 필터

필터는 서블릿 컨테이너에서 제공하는 요청, 응답 처리 확장 지점입니다.

Spring MVC의 `DispatcherServlet`도 서블릿이기 때문에, 필터는 요청이 `DispatcherServlet`에 도달하기 전과 응답이 클라이언트로 나가기 전에 실행될 수 있습니다.

### 서블릿 컨테이너에서 동작하는 필터

필터는 Spring MVC 바깥에서 동작합니다.

```
클라이언트  -> 서블릿 컨테이너  -> Filter  -> DispatcherServlet  -> Controller
```

이 위치 때문에 필터는 Spring MVC의 Controller 정보나 HandlerMethod 정보를 알 수 없습니다. 아직 `HandlerMapping`이 요청을 어떤 Controller 메서드에 매핑할지 결정하기 전이기 때문입니다.

대신 필터는 더 앞단에서 요청과 응답을 감쌀 수 있습니다. 예를 들어 요청 로깅, 인코딩 처리, CORS 처리, 인증 토큰 검사처럼 Controller에 도달하기 전 공통으로 처리해야 하는 작업에 사용할 수 있습니다.

필터는 서블릿 API의 `Filter` 인터페이스를 구현해서 작성합니다.

```
import jakarta.servlet.Filter;import jakarta.servlet.FilterChain;import jakarta.servlet.ServletException;import jakarta.servlet.ServletRequest;import jakarta.servlet.ServletResponse;import java.io.IOException;public class RequestLoggingFilter implements Filter {    @Override    public void doFilter(            ServletRequest request,            ServletResponse response,            FilterChain chain    ) throws IOException, ServletException {        System.out.println("요청이 필터에 도달했습니다.");        chain.doFilter(request, response);        System.out.println("응답이 필터를 다시 통과합니다.");    }}
```

`chain.doFilter(request, response)`를 호출하면 다음 필터 또는 `DispatcherServlet`으로 요청이 전달됩니다. 이 호출을 하지 않으면 요청은 더 이상 다음 단계로 진행되지 않습니다.

### FilterChain과 주요 용도

여러 필터가 등록되어 있으면 필터 체인을 따라 순서대로 실행됩니다.

```
클라이언트  -> Filter 1  -> Filter 2  -> Filter 3  -> DispatcherServlet
```

각 필터는 `chain.doFilter()` 호출 전후에 로직을 넣을 수 있습니다.

```
public class TimingFilter implements Filter {    @Override    public void doFilter(            ServletRequest request,            ServletResponse response,            FilterChain chain    ) throws IOException, ServletException {        long start = System.currentTimeMillis();        try {            chain.doFilter(request, response);        } finally {            long end = System.currentTimeMillis();            System.out.println("요청 처리 시간: " + (end - start) + "ms");        }    }}
```

위 예제에서 `chain.doFilter()` 이전 코드는 다음 단계로 요청이 전달되기 전에 실행됩니다. `finally` 블록은 Controller 처리와 응답 생성 흐름이 끝난 뒤 실행됩니다.

처리 시간 측정은 인터셉터에서도 작성할 수 있습니다. 필터에서 측정하면 Spring MVC에 도달하기 전의 필터 체인과 `DispatcherServlet` 처리 시간까지 함께 포함됩니다.

Spring Boot에서는 `FilterRegistrationBean`을 사용해 필터의 URL 패턴과 실행 순서를 지정할 수 있습니다.

```
import org.springframework.boot.web.servlet.FilterRegistrationBean;import org.springframework.context.annotation.Bean;import org.springframework.context.annotation.Configuration;@Configurationpublic class FilterConfig {    @Bean    public FilterRegistrationBean<TimingFilter> timingFilter() {        FilterRegistrationBean<TimingFilter> registrationBean = new FilterRegistrationBean<>();        registrationBean.setFilter(new TimingFilter());        registrationBean.addUrlPatterns("/*");        registrationBean.setOrder(1);        return registrationBean;    }}
```

필터는 Spring MVC 바깥에서 동작하므로 요청이 어떤 Controller 메서드에 매핑되는지 알 필요가 없는 공통 처리에 사용합니다.

## 인터셉터

인터셉터는 Spring MVC 내부에서 Handler 실행 전후에 호출됩니다.

여기서 Handler는 요청을 처리할 Controller 메서드 또는 핸들러 객체를 의미합니다. 일반적인 어노테이션 기반 Controller에서는 `@RequestMapping`, `@GetMapping`, `@PostMapping`이 붙은 메서드가 Handler로 선택됩니다.

### Spring MVC 내부에서 동작하는 인터셉터

인터셉터는 `DispatcherServlet`이 요청을 받은 뒤, `HandlerMapping`이 요청을 처리할 Handler와 인터셉터 체인을 찾은 다음 실행됩니다.

```
DispatcherServlet  -> HandlerMapping에서 Handler와 인터셉터 체인 조회  -> HandlerInterceptor의 preHandle()  -> HandlerAdapter  -> Controller  -> HandlerInterceptor의 postHandle()  -> View 렌더링  -> HandlerInterceptor의 afterCompletion()
```

이 위치 때문에 인터셉터는 필터보다 Spring MVC에 더 가까운 정보를 다룰 수 있습니다. 예를 들어 요청을 처리할 Handler가 무엇인지 확인하거나, 특정 Controller에만 적용되는 로직을 작성할 수 있습니다.

인터셉터는 로그인 검사, 권한 검사, Controller 공통 로깅, 요청별 공통 모델 처리 같은 작업에 사용할 수 있습니다.

### HandlerInterceptor와 등록 방식

Spring MVC에서 인터셉터는 `HandlerInterceptor` 인터페이스를 구현해서 작성합니다.

```
import jakarta.servlet.http.HttpServletRequest;import jakarta.servlet.http.HttpServletResponse;import org.springframework.web.servlet.HandlerInterceptor;import org.springframework.web.servlet.ModelAndView;public class LoginCheckInterceptor implements HandlerInterceptor {    @Override    public boolean preHandle(            HttpServletRequest request,            HttpServletResponse response,            Object handler    ) throws Exception {        Object loginMember = request.getSession()                .getAttribute("loginMember");        if (loginMember == null) {            response.sendRedirect("/login");            return false;        }        return true;    }    @Override    public void postHandle(            HttpServletRequest request,            HttpServletResponse response,            Object handler,            ModelAndView modelAndView    ) {        System.out.println("Controller 호출 이후 실행됩니다.");    }    @Override    public void afterCompletion(            HttpServletRequest request,            HttpServletResponse response,            Object handler,            Exception ex    ) {        System.out.println("요청 처리가 완료된 뒤 실행됩니다.");    }}
```

`preHandle()`은 Controller 호출 전에 실행됩니다. 반환값이 `true`이면 다음 단계로 진행하고, `false`이면 Controller를 호출하지 않습니다.

`postHandle()`은 Controller가 정상적으로 실행된 뒤 호출됩니다. View를 렌더링하는 MVC 흐름에서는 View 렌더링 전에 실행됩니다. Controller 실행 중 예외가 발생하면 `postHandle()`은 호출되지 않고, 예외 처리 흐름 이후 `afterCompletion()`이 호출될 수 있습니다.

`afterCompletion()`은 요청 처리가 끝난 뒤 호출됩니다. Controller 실행 중 예외가 발생해도 `preHandle()`이 `true`를 반환했다면 `afterCompletion()`은 호출됩니다. 이 메서드는 요청 처리 후 자원 정리나 공통 로그 기록에 사용할 수 있습니다.

인터셉터는 구현만으로 적용되지 않습니다. `WebMvcConfigurer#addInterceptors()`에서 등록해야 합니다.

```
import org.springframework.context.annotation.Configuration;import org.springframework.web.method.support.HandlerMethodArgumentResolver;import org.springframework.web.servlet.config.annotation.InterceptorRegistry;import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;import java.util.List;@Configurationpublic class WebConfig implements WebMvcConfigurer {    @Override    public void addInterceptors(InterceptorRegistry registry) {        registry.addInterceptor(new LoginCheckInterceptor())                .order(1)                .addPathPatterns("/**")                .excludePathPatterns(                        "/",                        "/login",                        "/logout",                        "/css/**",                        "/js/**"                );    }    @Override    public void addArgumentResolvers(            List<HandlerMethodArgumentResolver> resolvers    ) {        resolvers.add(new LoginMemberArgumentResolver());    }}
```

`addPathPatterns()`는 인터셉터를 적용할 경로를 지정합니다. `excludePathPatterns()`는 인터셉터 적용에서 제외할 경로를 지정합니다.

위 설정에서는 대부분의 요청에 로그인 검사를 적용하되, 로그인 페이지와 정적 리소스 요청은 제외합니다. 같은 설정 클래스에서 커스텀 ArgumentResolver도 함께 등록할 수 있습니다. ArgumentResolver 구현은 뒤에서 다룹니다.

### 필터와 인터셉터의 차이

필터와 인터셉터는 모두 요청 처리 흐름에 끼어들 수 있지만, 동작 위치가 다릅니다.

|구분|필터|인터셉터|
|---|---|---|
|동작 위치|서블릿 컨테이너|Spring MVC 내부|
|실행 시점|`DispatcherServlet` 호출 전후|Handler 선택 이후, Controller 호출 전후|
|기반 API|Servlet API|Spring MVC API|
|Handler 정보 접근|어렵습니다|가능합니다|
|등록 방식|서블릿 필터 등록|`WebMvcConfigurer#addInterceptors()`|
|주요 용도|인코딩, CORS, 요청 로깅, 인증 토큰 검사|로그인 검사, 권한 검사, Controller 기준 공통 처리|

Controller와 무관하게 모든 요청에 적용할 처리라면 필터에 둡니다. 요청이 어떤 Controller 메서드로 매핑되는지에 따라 다르게 처리해야 한다면 인터셉터에 둡니다.

예를 들어 요청 ID 부여, 인코딩 처리, CORS 처리는 필터에서 처리할 수 있습니다. 로그인 여부 검사처럼 특정 경로를 제외하거나 Handler 정보를 기준으로 판단해야 하는 처리는 인터셉터에서 처리할 수 있습니다.

## ArgumentResolver

ArgumentResolver는 Controller 메서드에 전달할 값을 만드는 확장 지점입니다. 요청을 다음 단계로 보낼지 결정하지 않고, `HandlerAdapter`가 Controller 메서드를 호출하기 전에 각 파라미터에 들어갈 값을 준비합니다.

### Controller 메서드 인자 처리 흐름

Spring MVC에서 Controller 메서드는 다양한 형태의 파라미터를 받을 수 있습니다.

```
@GetMapping("/members/{id}")public MemberResponse getMember(        @PathVariable Long id,        @RequestParam String type) {    return memberService.getMember(id, type);}
```

`@PathVariable`, `@RequestParam`, `@ModelAttribute`, `@RequestBody`처럼 파라미터를 처리하는 방식은 모두 Spring MVC 내부의 인자 해석 과정을 거칩니다.

요청이 Controller 메서드까지 도달하면 `HandlerAdapter`는 메서드를 바로 호출하지 않습니다. 먼저 Controller 메서드의 파라미터마다 어떤 값을 전달할지 결정합니다.

```
HandlerAdapter  -> Controller 메서드 파라미터 분석  -> ArgumentResolver 선택  -> 파라미터 값 생성  -> Controller 메서드 호출
```

이 과정에서 특정 파라미터를 처리할 수 있는 ArgumentResolver가 선택됩니다. 선택된 ArgumentResolver는 요청, 세션, 헤더, 파라미터, 바디 등의 정보를 사용해 Controller 메서드에 전달할 값을 만듭니다.

### HandlerMethodArgumentResolver 구현과 등록

커스텀 ArgumentResolver를 사용하면 반복되는 파라미터 처리 코드를 Controller 밖으로 분리할 수 있습니다.

예를 들어 세션에 저장된 로그인 회원 객체를 Controller 메서드에 전달한다고 가정하겠습니다. 먼저 파라미터에 붙일 어노테이션을 정의합니다.

```
import java.lang.annotation.ElementType;import java.lang.annotation.Retention;import java.lang.annotation.RetentionPolicy;import java.lang.annotation.Target;@Target(ElementType.PARAMETER)@Retention(RetentionPolicy.RUNTIME)public @interface LoginMember {}
```

Controller에서는 세션을 직접 다루지 않고, 필요한 파라미터에 `@LoginMember`를 붙입니다.

```
@GetMapping("/my-page")public String myPage(@LoginMember Member member) {    return "member/my-page";}
```

이 파라미터를 처리하려면 `HandlerMethodArgumentResolver`를 구현해야 합니다.

```
import jakarta.servlet.http.HttpServletRequest;import jakarta.servlet.http.HttpSession;import org.springframework.core.MethodParameter;import org.springframework.web.bind.support.WebDataBinderFactory;import org.springframework.web.context.request.NativeWebRequest;import org.springframework.web.method.support.HandlerMethodArgumentResolver;import org.springframework.web.method.support.ModelAndViewContainer;public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {    @Override    public boolean supportsParameter(MethodParameter parameter) {        boolean hasAnnotation = parameter.hasParameterAnnotation(LoginMember.class);        boolean isMemberType = Member.class.isAssignableFrom(parameter.getParameterType());        return hasAnnotation && isMemberType;    }    @Override    public Object resolveArgument(            MethodParameter parameter,            ModelAndViewContainer mavContainer,            NativeWebRequest webRequest,            WebDataBinderFactory binderFactory    ) {        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);        if (request == null) {            return null;        }        HttpSession session = request.getSession(false);        if (session == null) {            return null;        }        Object loginMember = session.getAttribute("loginMember");        if (!(loginMember instanceof Member member)) {            return null;        }        return member;    }}
```

`supportsParameter()`는 이 ArgumentResolver가 해당 파라미터를 처리할 수 있는지 판단합니다. 위 예제에서는 `@LoginMember` 어노테이션이 붙어 있고, 파라미터 타입이 `Member`일 때만 처리합니다.

`resolveArgument()`는 Controller 메서드에 실제로 전달할 값을 반환합니다. 위 예제에서는 세션에서 `loginMember` 값을 꺼내고, `Member` 타입인 경우에만 반환합니다.

커스텀 ArgumentResolver도 구현만으로 적용되지 않습니다. 앞에서 본 `WebConfig`처럼 `WebMvcConfigurer#addArgumentResolvers()`에서 등록해야 합니다.

```
@Overridepublic void addArgumentResolvers(        List<HandlerMethodArgumentResolver> resolvers) {    resolvers.add(new LoginMemberArgumentResolver());}
```

이 설정을 사용하면 Spring MVC는 Controller 메서드 파라미터를 처리할 때 `LoginMemberArgumentResolver`도 함께 사용합니다.

`@LoginMember`를 사용하면 각 Controller에서 세션을 직접 조회하지 않아도 됩니다. `HandlerAdapter`가 Controller 메서드를 호출하기 전에 `LoginMemberArgumentResolver`를 실행하고, 세션에 저장된 로그인 회원 객체를 메서드 파라미터로 전달합니다.
