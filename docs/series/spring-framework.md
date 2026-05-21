# Spring Framework

## Purpose

`spring-framework` is the parent direction for framework fundamentals and runtime mechanics. It keeps container concepts, proxy-based cross-cutting behavior, and MVC request handling together without mixing them with Spring Boot's startup ergonomics or operational tooling.

## Child Series Composition

| Order | Child series slug | Display name | Current posture |
|---|---|---|---|
| 1 | `spring-core` | 스프링 코어 | 5 published |
| 2 | `spring-aop` | 스프링 AOP | 2 draft |
| 3 | `spring-transactions` | 스프링 트랜잭션 | 3 draft |
| 4 | `spring-web-mvc` | 스프링 웹 MVC | 6 draft |

Current child indexes:
- `src/content/series_indexes/spring-framework/spring-core.md`
- `src/content/series_indexes/spring-framework/spring-aop.md`
- `src/content/series_indexes/spring-framework/spring-transactions.md`
- `src/content/series_indexes/spring-framework/spring-web-mvc.md`

## Backlog Posture

This parent is now a mixed-maturity framework track:
- `spring-core` is the second published child series in the repository, with five `published` posts
- `spring-aop`, `spring-transactions`, and `spring-web-mvc` remain `draft` backlog children
- child ordering is explicit across container fundamentals, cross-cutting runtime behavior, transaction mechanics, and MVC request flow
- the parent boundary intentionally excludes Spring Boot startup, auto-configuration, and operational tooling

## Next Expansion Points

- Grow `spring-core` first before splitting bean registration or configuration topics into narrower children.
- Keep transaction mechanics inside `spring-transactions`; cross-link to `spring-aop` where proxy behavior explains transaction application.
- Keep servlet MVC request flow here; do not move it under Boot unless a future repository decision changes the framework/Boot boundary.
