# MyBatis

## Purpose

`mybatis` is the parent direction for MyBatis SQL mapper fundamentals and Spring integration. It covers the full lifecycle from raw JDBC comparison through mapping, dynamic SQL, internal architecture, and Spring/Spring Boot wiring — without mixing in JPA or Spring Data.

## Child Series Composition

| Order | Child series slug | Display name | Current posture |
|---|---|---|---|
| 1 | `mybatis-foundations` | 마이바티스 기초 | 4 idea |
| 2 | `mybatis-mapping` | 마이바티스 매핑 | 4 idea |
| 3 | `mybatis-dynamic-sql` | 마이바티스 동적 SQL | 3 idea |
| 4 | `mybatis-internals` | 마이바티스 내부 동작 | 3 idea |
| 5 | `mybatis-spring` | 마이바티스와 스프링 연동 | 3 idea |

Current child indexes:
- `src/content/series_indexes/mybatis/mybatis-foundations.md`
- `src/content/series_indexes/mybatis/mybatis-mapping.md`
- `src/content/series_indexes/mybatis/mybatis-dynamic-sql.md`
- `src/content/series_indexes/mybatis/mybatis-internals.md`
- `src/content/series_indexes/mybatis/mybatis-spring.md`

## Backlog Posture

All 17 posts are currently at `idea` status. Recommended writing order follows the child series sequence: foundations → mapping → dynamic SQL → internals → Spring.

## Next Expansion Points

- Write `mybatis-foundations` in full before moving to mapping.
- `mybatis-internals` assumes the reader has already worked through mapping; keep that dependency in mind for cross-links.
- Spring integration (`mybatis-spring`) intentionally comes last — it depends on understanding the standalone session model.
