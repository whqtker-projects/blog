---
title: "Spring Lifecycle Hooks Demo"
post: bean-lifecycle-and-scope
order: 1
status: published
description: "A minimal project-style example that shows bean lifecycle callbacks with a small Spring Boot app."
language: java
framework: spring-boot
sourcePath: examples/bean-lifecycle-and-scope/spring-lifecycle-hooks-demo
---
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
