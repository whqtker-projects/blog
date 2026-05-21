---
title: "놀라운사실) @Repository는 상황에 따라 붙이지 않아도 된다"
series: troubleshooting
order: 3
status: draft
tags:
  - "java"
  - "spring boot"
  - "mvc"
  - "repository"
  - "dispatcherservlet"
  - "jparepository"
  - "troubleshooting"
---
![놀라운사실) @Repository는 상황에 따라 붙이지 않아도 된다](../attachments/troubleshooting-repository-annotation.png)

## 📌 개요

`@Controller` , `@Service` , `@Repository` 모두 `@Component` 어노테이션을 상속하고 있다. `@Component` 는 해당 클래스를 Bean으로 등록하는 역할을 한다. 사실 어노테이션 이름만 다르지, 내부적으로 수행하는 동작은 모두 같다.

그렇다고 `@Controller` 대신 `@Component` 를 사용하면 제대로 동작하지 않는다. 그 이유는 `Spring MVC` 의 요청 처리 방식에 있다. 그 과정에 대해 한 번 살펴보자.

## 📌 Spring MVC 요청 처리 방식

1. 사용자의 HTTP 요청이 서버로 전송된다.
2. `DispatcherServlet` 이 요청을 받는다. 받은 요청을 직접 처리하지 않고 다른 요소에게 작업을 위임한다.
3.  `HandlerMapping` 이 요청 URL을 처리할 수 있는 컨트롤러를 찾고 `DispatcherServlet` 에게 리턴한다.
4. `DispatcherServlet` 은 `HandlerAdapter` 를 통해 컨트롤러 메서드를 호출한다. `HandlerAdapter` 는 내부적으로 요청 파라미터를 적절히 변환하여 컨트롤러 메서드에 전달한다. 단순히 특정 페이지를 보여주면 되는 경우 View의 논리적 이름을 리턴한다. 만약 비즈니스 로직을 수행해야 한다고 판단되면 `@Service` 계층에서 해당하는 메서드를 찾아 호출한다.
5. 비즈니스 로직을 처리하기 위해 DB 접근이 필요하다면 `@Repository` 계층에 작업을 요청한다.
6. `@Repository` 계층에서 CRUD 작업을 수행하고 결과를 서비스 계층에게 리턴한다.
7. 리턴된 데이터는 다시 컨트롤러 계층에게 전달되며, 컨트롤러는 받은 데이터를 Model 객체에 담는다. 이후 최종적으로 렌더링할 View의 논리적인 이름을 `DispatcherServlet` 에 전달한다.
8. 받은 View의 논리적인 이름을 `ViewResolver` 에게 전달한다. `ViewResolver` 는 논리적인 이름을 실제 물리적인 View 파일 경로로 변환한다.
9. View에 Model를 전달하여 최종적으로 렌더링하고, 동적인 HTML 페이지를 생성하고, 이 결과물이 HTTP 응답에 담겨 클라이언트에게 전송된다.

## 📌 그럼 항상 @Repository를 붙여야 하는 거 아닌가?

반은 맞고, 반은 틀렸다. 사실 틀렸다고 하기도 애매한게, 모든 Repository 계층에 `@Repository` 어노테이션을 붙여도 전혀 문제 없긴 하다.

다만, **`JpaRepositry` 를 상속하는 경우 이는 불필요한 설정이 된다.**

`JpaRepository` 는 다른 여러 Repository를 상속하고 있고, 이를 거슬러 올라가면 최상위에 `Repository` 인터페이스가 존재한다. **JPA는 이 인터페이스를 자동으로 인식하고, 개발자가 따로 구현 클래스를 만들지 않아도 런타임에 동적으로 프록시 객체를 생성하여 Bean으로 등록한다.**

`CrudRepository` 와 같이 `Repository` 인터페이스를 상속하는 Repository에는 `@NoRepositoryBean` 어노테이션이 붙어 있는데, 이 어노테이션이 붙으면 해당 인터페이스는 Bean으로 등록되지 않는다. 그 자체가 독립적인 레포지토리 빈이 아니기 때문이다.

`@Repository` 인터페이스는 순수 JDBC나 MyBatis를 통해 직접 인터페이스를 구현하는 경우 붙여주면 된다.

## 📌 참고

https://wooj-coding-fordeveloper.tistory.com/69#%40Component-1
