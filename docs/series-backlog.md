# Series Backlog

**Status:** Confirmed — series structure decided on 2026-05-07; current hierarchy migration plus `computer-networks`, `database-systems`, and `operating-systems` backlog rebuilds are reflected here. See `confirmed-decisions.md` D-19–D-22, D-57–D-67, and D-75–D-80.  
**Last updated:** 2026-05-09

This document is the authoritative list of confirmed series. The original 12-series flat plan remains the historical baseline, and the active child-series inventory may expand where a parent-direction rebuild requires a more coherent hierarchy. Parent-level operating context now lives under `docs/series/`; use those documents for current child composition, ordering, backlog posture, and likely next expansion points.

Display-language note:
- slugs remain English kebab-case identifiers
- reader-facing series display names are allowed to be Korean
- reader-facing display-name migration happens per parent rollout; older parents may still keep legacy English display names until their own migration work

---

## What Is a Series?

Under the current hierarchy model, a child series is the named grouping of posts that share a topic focus and a learning arc within a domain. Each post belongs to exactly one child series (D-20). Parent series group related child series and do not own posts directly.

---

## Current Hierarchy

The repository now uses the parent-child structure in committed content. The real child series currently present in `src/content/series_indexes/` are mapped as follows:

| Parent series slug | Parent display name | Child series slug | Child display name |
|---|---|---|---|
| `database-systems` | Database Systems | `database-foundations` | Database Foundations |
| `database-systems` | Database Systems | `data-modeling-and-design` | Data Modeling and Design |
| `database-systems` | Database Systems | `relational-queries-and-joins` | Relational Queries and Joins |
| `database-systems` | Database Systems | `database-internals` | Database Internals |
| `computer-architecture` | 컴퓨터구조론 | `architecture-overview` | Architecture Overview |
| `computer-architecture` | 컴퓨터구조론 | `cpu-and-instruction-execution` | CPU and Instruction Execution |
| `computer-architecture` | 컴퓨터구조론 | `computer-arithmetic` | Computer Arithmetic |
| `computer-architecture` | 컴퓨터구조론 | `control-unit` | Control Unit |
| `computer-architecture` | 컴퓨터구조론 | `memory-systems` | Memory Systems |
| `computer-architecture` | 컴퓨터구조론 | `storage-systems` | Storage Systems |
| `computer-architecture` | 컴퓨터구조론 | `bus-io-and-interrupts` | Bus, I/O, and Interrupts |
| `computer-architecture` | 컴퓨터구조론 | `parallel-and-high-performance-architecture` | Parallel and High-Performance Architecture |
| `computer-networks` | Computer Networks | `network-foundations` | Network Foundations |
| `computer-networks` | Computer Networks | `transport-and-reliability` | Transport and Reliability |
| `computer-networks` | Computer Networks | `internet-addressing-and-routing` | Internet Addressing and Routing |
| `computer-networks` | Computer Networks | `network-protocols` | Network Protocols |
| `operating-systems` | 운영체제 | `operating-systems-overview` | 운영체제 개요 |
| `operating-systems` | 운영체제 | `processes-and-threads` | 프로세스와 스레드 |
| `operating-systems` | 운영체제 | `scheduling-and-synchronization` | 스케줄링과 동기화 |
| `operating-systems` | 운영체제 | `memory-management` | 메모리 관리 |
| `operating-systems` | 운영체제 | `file-systems-and-storage` | 파일 시스템과 저장장치 |
| `spring-framework` | 스프링 프레임워크 | `spring-core` | 스프링 코어 |
| `spring-framework` | 스프링 프레임워크 | `spring-aop-and-transactions` | 스프링 AOP와 트랜잭션 |
| `spring-framework` | 스프링 프레임워크 | `spring-web-mvc` | 스프링 웹 MVC |
| `spring-boot` | 스프링 부트 | `spring-boot-basics` | 스프링 부트 기초 |
| `spring-boot` | 스프링 부트 | `spring-boot-configuration` | 스프링 부트 설정 |
| `spring-boot` | 스프링 부트 | `spring-boot-testing-and-operations` | 스프링 부트 테스트와 운영 |
| `mybatis` | MyBatis | `mybatis-foundations` | 마이바티스 기초 |
| `mybatis` | MyBatis | `mybatis-mapping` | 마이바티스 매핑 |
| `mybatis` | MyBatis | `mybatis-dynamic-sql` | 마이바티스 동적 SQL |
| `mybatis` | MyBatis | `mybatis-internals` | 마이바티스 내부 동작 |
| `mybatis` | MyBatis | `mybatis-spring` | 마이바티스와 스프링 연동 |
| `data-structures-and-algorithms` | Data Structures and Algorithms | `data-structures` | Data Structures |

Existing child slugs are preserved during migration, including `network-protocols`.

Series operating documents:
- [`docs/series/computer-architecture.md`](series/computer-architecture.md)
- [`docs/series/computer-networks.md`](series/computer-networks.md)
- [`docs/series/database-systems.md`](series/database-systems.md)
- [`docs/series/data-structures-and-algorithms.md`](series/data-structures-and-algorithms.md)
- [`docs/series/operating-systems.md`](series/operating-systems.md)
- [`docs/series/spring-framework.md`](series/spring-framework.md)
- [`docs/series/spring-boot.md`](series/spring-boot.md)
- [`docs/series/mybatis.md`](series/mybatis.md)

---

## Confirmed Child Series

### Backend and Systems (domain slug: `backend-systems`)

| Series slug | Display Name | Status | Notes |
|---|---|---|---|
| `database-foundations` | Database Foundations | Database Systems backlog | Database basics, schema vocabulary, keys, and relational vs. NoSQL overview |
| `data-modeling-and-design` | Data Modeling and Design | Database Systems backlog | ERD, integrity constraints, functional dependency, and normalization |
| `relational-queries-and-joins` | Relational Queries and Joins | Database Systems backlog | Relational operations, join types, grouping, and subquery structure |
| `database-internals` | Database Internals | **First series** (D-22) | Storage engines, indexing, transactions, query execution |
| `distributed-systems` | Distributed Systems | Confirmed | Consensus, replication, consistency models |
| `network-foundations` | Network Foundations | Computer Networks backlog | Introductory network overview, layering, encapsulation, and networking technology |
| `transport-and-reliability` | Transport and Reliability | Computer Networks backlog | TCP, UDP, QUIC, flow control, congestion, delivery guarantees |
| `internet-addressing-and-routing` | Internet Addressing and Routing | Computer Networks backlog | IP addressing, subnetting, ARP, ICMP, NAT, fragmentation, and routing protocols |
| `network-protocols` | Network Protocols | **In progress** | DNS, HTTP, TLS, HTTP/2, HTTP/3, and application/web protocol behavior |
| `spring-core` | 스프링 코어 | Spring Framework backlog | Spring overview, IoC/DI, bean container, bean lifecycle/scope, and configuration/component scanning |
| `spring-aop-and-transactions` | 스프링 AOP와 트랜잭션 | Spring Framework backlog | AOP basics, proxies, transaction abstraction, propagation/isolation, and common proxy pitfalls |
| `spring-web-mvc` | 스프링 웹 MVC | Spring Framework backlog | DispatcherServlet, controller model, binding, validation, exception handling, filters/interceptors, and argument resolvers |
| `spring-boot-basics` | 스프링 부트 기초 | Spring Boot backlog | Boot overview, Boot vs Spring, startup flow, starters, and embedded server behavior |
| `spring-boot-configuration` | 스프링 부트 설정 | Spring Boot backlog | Auto-configuration, externalized configuration, profiles, `application.yml`, and `@ConfigurationProperties` |
| `spring-boot-testing-and-operations` | 스프링 부트 테스트와 운영 | Spring Boot backlog | `@SpringBootTest`, test slices, MockMvc, Testcontainers integration, Actuator, logging, and metrics |
| `mybatis-foundations` | 마이바티스 기초 | MyBatis backlog | MyBatis 정의·등장 배경·핵심 컴포넌트·환경 설정 |
| `mybatis-mapping` | 마이바티스 매핑 | MyBatis backlog | Mapper 인터페이스, 파라미터·결과 매핑, 연관 관계 |
| `mybatis-dynamic-sql` | 마이바티스 동적 SQL | MyBatis backlog | 조건·반복·재사용 태그(if, choose, where, foreach 등) |
| `mybatis-internals` | 마이바티스 내부 동작 | MyBatis backlog | Executor, 1·2차 캐시, 플러그인(Interceptor) |
| `mybatis-spring` | 마이바티스와 스프링 연동 | MyBatis backlog | mybatis-spring, 매퍼 스캔, Spring Boot Starter |
| `backend-design` | Backend Design | Confirmed | API design, concurrency patterns, service architecture |

### CS Fundamentals (domain slug: `cs-fundamentals`)

| Series slug | Display Name | Status | Notes |
|---|---|---|---|
| `data-structures` | Data Structures | Confirmed | Arrays, trees, graphs, hash tables |
| `algorithms` | Algorithms | Confirmed | Sorting, search, dynamic programming, complexity |
| `operating-systems-overview` | 운영체제 개요 | Operating Systems backlog | Introductory OS role, computer-system structure, kernel structure, and system-call boundary |
| `processes-and-threads` | 프로세스와 스레드 | Operating Systems backlog | Process model, context switching, threads, and IPC |
| `scheduling-and-synchronization` | 스케줄링과 동기화 | Operating Systems backlog | CPU scheduling, synchronization primitives, and deadlock/resource waits |
| `memory-management` | 메모리 관리 | Operating Systems backlog | Address binding, allocation, paging, virtual memory, and replacement policy |
| `file-systems-and-storage` | 파일 시스템과 저장장치 | Operating Systems backlog | File-system interface, implementation, directories, storage, and disk scheduling |
| `computer-architecture` | Computer Architecture | Confirmed | CPU pipeline, cache, memory hierarchy |
| `computer-security` | Computer Security | Confirmed | Cryptography, authentication, common attack models |

### AI / ML / LLM (domain slug: `ai-ml-llm`)

| Series slug | Display Name | Status | Notes |
|---|---|---|---|
| `llm-internals` | LLM Internals | Confirmed | Transformer architecture, attention, tokenization, inference |
| `ml-fundamentals` | ML Fundamentals | Confirmed | Statistical learning, training, evaluation, classical models |

### Software Engineering (domain slug: `software-engineering`)

| Series slug | Display Name | Status | Notes |
|---|---|---|---|
| `design-principles` | Design Principles | Confirmed | SOLID, design patterns, coupling, abstraction |

---

## Structure Rules

- **One post, one series:** Cross-series membership is not allowed (D-20).
- **Posts attach to terminal series only:** Parent series are grouping and navigation units when they have child series. A parent with no child series may directly own posts.
- **Multiple series per domain:** Domains are not collapsed into single series (D-19).
- **Two levels only:** Parent series → child series → posts. No third hierarchy layer is allowed.
- **Slug format:** all-lowercase kebab-case, English only (D-15, D-16).
- **Display-name policy:** visible series titles may be Korean while slug identifiers remain English.
- **Series naming policy** (slug ↔ display name mapping): tracked in issue #33.
- **Post metadata structure** (how a post declares its series): tracked in issue #34.

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-19, D-20, D-21, D-22
- [`docs/decision-log.md`](decision-log.md) — DL-004 (series structure), DL-005 (first series)
- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — resolved Q-3 and Q-5 outcomes
