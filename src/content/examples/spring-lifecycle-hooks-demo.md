---
title: "Spring Lifecycle Hooks Demo"
post: bean-lifecycle-and-scope
order: 1
status: published
description: "A minimal project-style example that shows bean lifecycle callbacks with a small Spring Boot app."
---
관련 링크:

- 소속 시리즈: [[series_indexes/spring-framework/spring-core|스프링 코어]]
- 소속 게시글: [[posts/bean-lifecycle-and-scope|빈 생명주기와 스코프]]

This is a small pilot example page for the repository structure. It is intentionally short and exists to prove the `examples` content model, routing, and post attachment flow.

## Project Shape

- `src/main/java/.../LifecycleDemoApplication.java`
- `src/main/java/.../SampleBean.java`
- `src/test/java/.../SampleBeanTest.java`

## Focus

- bean creation and initialization
- `@PostConstruct` callback timing
- `@PreDestroy` callback timing
- verifying the expected lifecycle order through a focused test

## Run

```bash
./gradlew test
```
