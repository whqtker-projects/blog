---
title: Bean 컨테이너와 ApplicationContext
series: spring-core
order: 3
status: published
tags:
  - graph/post
---

관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 이전 글: [[ioc-and-di|IoC와 DI]]
- 다음 글: [[bean-lifecycle-and-scope|빈 생명주기와 스코프]]
- 예제: [[examples/bean-container-application-context-demo|Bean 컨테이너와 ApplicationContext 예제]]

## 스프링 빈이란

스프링 빈은 스프링 컨테이너가 생성하고 관리하는 객체입니다.

애플리케이션의 모든 객체가 스프링 빈이 되는 것은 아닙니다. **스프링 컨테이너에 등록된 객체만 스프링 빈**입니다. 보통 `@Component`, `@Service`, `@Repository`, `@Controller` 같은 어노테이션을 사용하거나, `@Bean` 메서드로 직접 등록합니다.

스프링 빈으로 등록된 객체는 스프링 컨테이너가 생성하고 관리합니다. 컨테이너는 빈을 만들기만 하는 것이 아니라, **필요한 의존관계를 주입하고 초기화와 종료 같은 생명주기도 함께 관리**합니다. 또한 빈이 어떤 범위에서 동작해야 하는지에 따라 scope를 적용해 관리합니다.

## BeanFactory와 ApplicationContext

스프링 컨테이너의 핵심 인터페이스는 `BeanFactory`와 `ApplicationContext`입니다.

`BeanFactory`는 스프링 컨테이너의 기본 인터페이스입니다. 빈을 생성하고 조회하는 가장 핵심적인 기능을 제공합니다.

`ApplicationContext`는 `BeanFactory`의 기능을 포함하면서, 실제 애플리케이션에서 자주 필요한 기능을 추가로 제공합니다.

실무에서는 보통 `BeanFactory`보다 `ApplicationContext`를 사용합니다.

### BeanFactory의 역할

`BeanFactory`는 빈을 관리하는 가장 기본적인 역할을 담당합니다.

주요 기능은 빈 생성, 빈 보관, 빈 조회, 의존관계 설정이 있습니다.

`BeanFactory`만으로도 IoC 컨테이너의 핵심 기능은 수행할 수 있습니다. 다만 `BeanFactory`는 이름 그대로 빈 관리 자체에 초점을 둔 인터페이스입니다.

### ApplicationContext의 추가 기능

`ApplicationContext`는 `BeanFactory` 기능에 더해 애플리케이션 개발에 필요한 여러 기능을 제공합니다.

국제화(i18n) 메시지를 처리하는 **메시지 소스** 기능, 애플리케이션 이벤트를 발행하고 리스너가 이를 처리할 수 있게 하는 **이벤트 발행** 기능, 프로파일, 프로퍼티, 환경 변수 같은 설정 정보를 관리하는 **환경 정보 관리** 기능, classpath, 파일 시스템, URL 등 다양한 위치의 리소스를 읽을 수 있게 하는 **리소스 조회** 기능이 있습니다.

## ApplicationContext 구현체

`ApplicationContext`는 인터페이스이므로 실제로는 구현체를 통해 사용합니다.

대표적인 구현체는 다음과 같습니다.

### AnnotationConfigApplicationContext

자바 설정 클래스와 어노테이션 기반 설정을 사용하는 구현체입니다. `@Configuration`, `@Bean`, `@ComponentScan` 같은 방식을 사용할 때 주로 사용합니다.

오늘날 스프링에서 가장 많이 사용하는 방식입니다.

### ClassPathXmlApplicationContext

classpath에 있는 XML 설정 파일을 읽어 컨테이너를 구성하는 구현체입니다. 과거 스프링 프로젝트에서 많이 사용되었고, XML 기반 설정을 다룰 때 사용합니다.

### GenericWebApplicationContext

웹 환경에서 사용할 수 있는 `ApplicationContext` 구현체입니다. 서블릿 기반 웹 애플리케이션에서는 웹 환경에 맞는 컨텍스트가 사용됩니다.

구현체마다 설정 방식과 실행 환경은 다르지만, 모두 스프링 빈을 생성하고 관리하며, 필요한 의존관계를 연결하는 컨테이너입니다.
