# 스프링 프레임워크

## Purpose

`spring-framework` is the parent direction for framework fundamentals and runtime mechanics. It keeps container concepts, proxy-based cross-cutting behavior, and MVC request handling together without mixing them with Spring Boot's startup ergonomics or operational tooling.

## Child Series Composition

| Order | Child series slug | Display name | Current posture |
|---|---|---|---|
| 1 | `spring-core` | 스프링 코어 | 5 draft |
| 2 | `spring-aop-and-transactions` | 스프링 AOP와 트랜잭션 | 5 draft |
| 3 | `spring-web-mvc` | 스프링 웹 MVC | 6 draft |

Current child indexes:
- `src/content/series_indexes/spring-framework/spring-core.md`
- `src/content/series_indexes/spring-framework/spring-aop-and-transactions.md`
- `src/content/series_indexes/spring-framework/spring-web-mvc.md`

## Backlog Posture

This parent starts as a backlog-first framework track:
- every current post in the parent is `status: draft`
- child ordering is explicit across container fundamentals, cross-cutting runtime behavior, and MVC request flow
- the parent boundary intentionally excludes Spring Boot startup, auto-configuration, and operational tooling

## Next Expansion Points

- Grow `spring-core` first before splitting bean registration or configuration topics into narrower children.
- Keep transaction mechanics inside `spring-aop-and-transactions` unless the backlog becomes large enough to justify a dedicated data-access child.
- Keep servlet MVC request flow here; do not move it under Boot unless a future repository decision changes the framework/Boot boundary.
