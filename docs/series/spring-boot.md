# 스프링 부트

## Purpose

`spring-boot` is the parent direction for application bootstrap, configuration ergonomics, testing workflow, and operational tooling. It keeps Boot-specific convenience and deployment-facing topics distinct from Spring Framework's container and MVC mechanics.

## Child Series Composition

| Order | Child series slug | Display name | Current posture |
|---|---|---|---|
| 1 | `spring-boot-basics` | 스프링 부트 기초 | 5 draft |
| 2 | `spring-boot-configuration` | 스프링 부트 설정 | 4 draft |
| 3 | `spring-boot-testing-and-operations` | 스프링 부트 테스트와 운영 | 5 draft |

Current child indexes:
- `src/content/series_indexes/spring-boot/spring-boot-basics.md`
- `src/content/series_indexes/spring-boot/spring-boot-configuration.md`
- `src/content/series_indexes/spring-boot/spring-boot-testing-and-operations.md`

## Backlog Posture

This parent also starts as a backlog-first rollout:
- every current post in the parent is `status: draft`
- child ordering is explicit across startup basics, configuration behavior, and test/operations concerns
- the parent boundary intentionally excludes IoC/DI, bean lifecycle internals, and framework-level MVC dispatch mechanics

## Next Expansion Points

- Promote the basics and configuration children before widening into specialized siblings such as cloud or native-image topics.
- Keep auto-configuration and configuration binding inside `spring-boot-configuration` rather than scattering them across multiple children too early.
- Keep Boot testing and Actuator/observability concerns grouped until the backlog becomes large enough to justify a dedicated operations child.
