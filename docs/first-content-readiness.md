# First-Content Readiness

**Status:** Active — produced by Issue #30.  
**Last updated:** 2026-05-15

This document defines the artifacts and criteria needed to move from planning into active content creation. It covers the candidate post set for the first series, the process for starting a post, the drafting checklist, the quality bar for publication, and the pre-publication self-review checklist.

Parent-level operating context now lives under `docs/series/`. Use those documents for current child-series composition, ordering, backlog posture, and next expansion points; use this document for readiness criteria and writing workflow.

Language-policy note:
- filenames and slugs remain English identifiers
- post titles and planned post bodies are intended to be Korean for new and editable backlog content
- backlog title synchronization happens per rollout; already published content is left unchanged unless a task explicitly targets it

Graph-link note:
- generic `[[wikilinks]]` are reserved for post links
- Obsidian graph links to series use `[[series_indexes/<parent>]]` or `[[series_indexes/<parent>/<child>]]`
- series graph wiring is limited to parent/child series index relationships
- child series indexes must not become manual post inventories
- post stubs remain valid without graph-link blocks
- `order` remains canonical for post sequencing

Current operating documents:
- [`docs/series/database-systems.md`](series/database-systems.md)
- [`docs/series/computer-networks.md`](series/computer-networks.md)
- [`docs/series/data-structures-and-algorithms.md`](series/data-structures-and-algorithms.md)
- [`docs/series/computer-architecture.md`](series/computer-architecture.md)
- [`docs/series/operating-systems.md`](series/operating-systems.md)
- [`docs/series/spring-framework.md`](series/spring-framework.md)
- [`docs/series/spring-boot.md`](series/spring-boot.md)

---

## Candidate Posts — `database-internals` Child Series

The first series is `database-internals` (D-22). Under the current hierarchy model, it is now a child series under the parent `database-systems`. The five candidate posts below cover its core topic areas: indexing structures, transaction guarantees, durability mechanisms, and query execution.

| Order | File name | Title | Scope |
|-------|-----------|-------|-------|
| 1 | `what-is-a-database-index.md` | What Is a Database Index? | What an index is, why it exists, and the core read/write tradeoff; B+Tree as the dominant structure |
| 2 | `b-plus-tree-index.md` | B+Tree Index Structure | Internal node layout, leaf-level linked list, insert/delete mechanics, and range query traversal |
| 3 | `transaction-and-acid.md` | Transactions and ACID | What a transaction guarantees, how each ACID property is implemented, and where isolation levels fit |
| 4 | `write-ahead-log.md` | Write-Ahead Log and Durability | How WAL separates write ordering from page writes, crash recovery flow, and checkpoint mechanics |
| 5 | `query-execution-plan.md` | Query Execution and the Optimizer | How the query planner turns SQL into a plan, cost estimation, and when/why index scans beat table scans |

The full initial `database-internals` post set is now committed as real content in the repository: `what-is-a-database-index.md`, `b-plus-tree-index.md`, `transaction-and-acid.md`, `write-ahead-log.md`, and `query-execution-plan.md`. Validation fixtures such as `e2e-rendering-validation.md` remain tracked separately under `test/fixtures/obsidian-vault/` and do not count as real series candidates.

The author may adjust order, add topics, or split a post — this list is a starting point, not a commitment. Any changes to the confirmed candidate set should be reflected here.

## Candidate Backlog — `database-systems` Parent Series

The parent `database-systems` is no longer only a shell around `database-internals`. It now has earlier-stage sibling child series so database learning can begin with fundamentals and relational design before engine internals.

### Child Series — `database-foundations`

This child series covers the missing introductory database layer.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `what-is-a-database-system.md` | What Is a Database System? | Why DBMSs exist, how they differ from file-based storage, and what problems they solve | `idea` |
| 2 | `entities-relations-and-attributes.md` | Entities, Relations, and Attributes | Core database vocabulary: entity, relation, attribute, tuple, record, and field | `idea` |
| 3 | `keys-and-schema-design.md` | Keys and Schema Design | Candidate key, primary key, foreign key, and why schema decisions shape data integrity | `idea` |
| 4 | `relational-databases-and-nosql.md` | Relational Databases and NoSQL | High-level comparison between relational systems and NoSQL families, with use-case framing | `idea` |

### Child Series — `data-modeling-and-design`

This child series introduces conceptual modeling and normalization-oriented relational design.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `what-is-an-erd.md` | What Is an ERD? | Entity-relationship modeling, cardinality, and why ERD exists before table creation | `idea` |
| 2 | `mapping-erd-to-relational-schema.md` | Mapping ERD to a Relational Schema | Turning entities and relationships into tables, keys, and foreign keys | `idea` |
| 3 | `integrity-constraints-in-relational-design.md` | Integrity Constraints in Relational Design | Entity integrity, referential integrity, and domain constraints from a design point of view | `idea` |
| 4 | `functional-dependency.md` | Functional Dependency | Functional dependency as the basis for redundancy analysis and normalization | `idea` |
| 5 | `normalization-and-normal-forms.md` | Normalization and Normal Forms | 1NF, 2NF, 3NF, and BCNF with tradeoffs and practical examples | `idea` |

### Child Series — `relational-queries-and-joins`

This child series covers relational operations and join semantics before readers move into optimizer internals.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `relational-operations-and-result-sets.md` | Relational Operations and Result Sets | Selection, projection, join, and how relational operations transform result sets | `idea` |
| 2 | `join-types-and-join-results.md` | Join Types and Join Results | Inner, outer, cross joins and how result shapes differ | `idea` |
| 3 | `grouping-aggregation-and-having.md` | Grouping, Aggregation, and HAVING | Grouping semantics, aggregate functions, and post-group filtering | `idea` |
| 4 | `subqueries-and-common-table-expressions.md` | Subqueries and Common Table Expressions | Subquery structure, CTE usage, and how they affect query readability and composition | `idea` |

### Child Series — `database-internals`

This existing child remains the mature published anchor for engine behavior and storage/query internals.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `what-is-a-database-index.md` | What Is a Database Index? | What an index is, why it exists, and the core read/write tradeoff | `published` |
| 2 | `b-plus-tree-index.md` | B+Tree Index Structure | B+Tree layout, lookup path, range scans, and write tradeoffs | `published` |
| 3 | `transaction-and-acid.md` | Transactions and ACID | Atomicity, consistency, isolation, durability, and transaction guarantees | `published` |
| 4 | `write-ahead-log.md` | Write-Ahead Log and Durability | WAL ordering, checkpoints, and durability behavior after crashes | `published` |
| 5 | `query-execution-plan.md` | Query Execution and the Optimizer | Execution planning, cost estimation, and scan/join strategy selection | `published` |

### Pilot Batch — Simplified Status Model

The original pilot batch for large-scale idea intake was the committed `network-protocols` child series under the parent `computer-networks`. That pilot is still important historically because it proved the simplified-status and visibility rules on real non-public content before the broader `computer-networks` backlog was split into multiple child series.

Why the original pilot was suitable:

- A real child series index exists at `src/content/series_indexes/computer-networks/network-protocols.md`
- The child series now has an explicit parent mapping to `computer-networks`
- All five posts already have explicit `series`, `order`, and `status`
- The batch exercises both non-public lifecycle states now in use: `draft` and `idea`
- The `order` range is contiguous (`1` through `5`), so ordering and listing behavior can be checked without introducing new numbering rules

Current pilot statuses:

| Order | File name | Status |
|-------|-----------|--------|
| 1 | `what-is-http.md` | `draft` |
| 2 | `tcp-connection-and-reliability.md` | `draft` |
| 3 | `dns-resolution.md` | `idea` |
| 4 | `tls-and-https.md` | `idea` |
| 5 | `http2-and-http3.md` | `idea` |

Original pilot verification goals:

- Local development should show all five `network-protocols` posts
- Staged and production builds should keep all five posts off public post routes until each post is explicitly changed to `status: published`
- `pnpm check:content` and `pnpm build` should continue to pass with the batch in place

### First Bulk Batch — `data-structures`

The first larger idea-stage batch is grouped as one new confirmed child series: `data-structures` under the parent `data-structures-and-algorithms`. This keeps the intake reviewable because the batch has a single child series index, a contiguous ordering block, and a consistent all-`idea` status set.

Series indexes:
- `src/content/series_indexes/data-structures-and-algorithms.md`
- `src/content/series_indexes/data-structures-and-algorithms/data-structures.md`

Initial bulk batch:

| Order | File name | Title | Status |
|-------|-----------|-------|--------|
| 1 | `what-is-an-array.md` | What Is an Array? | `idea` |
| 2 | `linked-list.md` | Linked List Structure | `idea` |
| 3 | `stack-and-queue.md` | Stack and Queue Basics | `idea` |
| 4 | `hash-table.md` | Hash Table Basics | `idea` |
| 5 | `binary-search-tree.md` | Binary Search Tree | `idea` |

Why this batch is suitable:

- `data-structures` is already a confirmed series in `docs/series-backlog.md`
- The repository now has both parent and child series indexes before posts in that child series
- All posts use explicit `status: idea`
- The batch is reviewable as one coherent series-level diff instead of many unrelated one-off stubs

---

## Candidate Backlog — `computer-networks` Parent Series

The second major direction is now the parent `computer-networks`. The original `network-protocols` flat backlog has now been rebuilt into four child series so future intake can grow in coherent slices instead of one mixed list and so the learning order can start with real networking foundations.

### Child Series — `network-foundations`

This new entry child series covers the missing introductory layer that the current repository did not previously express.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `overview-of-computer-networks.md` | Overview of Computer Networks | Why networks exist, host/link/router roles, packet switching, and the shape of the internet as a system | `idea` |
| 2 | `osi-and-tcp-ip-models.md` | OSI and TCP/IP Models | Layering purpose, OSI vs. TCP/IP correspondence, and what each layer is responsible for | `idea` |
| 3 | `encapsulation-and-network-path.md` | Encapsulation and the Network Path | How data is encapsulated across layers and what happens along a real host-to-host path | `idea` |
| 4 | `networking-technologies-and-media.md` | Networking Technologies and Media | Ethernet, wireless links, switching, access networks, and the physical/link baseline | `idea` |

### Child Series — `network-protocols`

This retained child slug now covers the application/web-protocol portion of the backlog, including DNS as the name-to-service entry point above the internet layer.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `dns-resolution.md` | DNS and Name Resolution | Domain hierarchy, resolver flow, caching, and record types | `idea` |
| 2 | `what-is-http.md` | What Is HTTP? | HTTP request/response model, methods, status codes, statelessness, and the role of HTTP in the web stack | `draft` |
| 3 | `tls-and-https.md` | TLS and HTTPS | TLS handshake, certificate chain, key exchange, and how HTTPS wraps HTTP | `idea` |
| 4 | `http2-and-http3.md` | HTTP/2 and HTTP/3 | Multiplexing, HPACK, QUIC transport use, and protocol evolution | `idea` |

### Child Series — `transport-and-reliability`

This child series still groups transport-layer delivery guarantees and latency/reliability tradeoffs, but now breaks TCP internals into smaller post-sized units.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `tcp-connection-and-reliability.md` | TCP and Reliable Transmission | Handshake, sequencing, acknowledgments, flow control, congestion control, retransmission | `draft` |
| 2 | `tcp-flow-control.md` | TCP Flow Control | Advertised window, receiver protection, throughput limits, and why flow control differs from congestion control | `idea` |
| 3 | `tcp-congestion-control.md` | TCP Congestion Control | Congestion window, slow start, avoidance, and what packet loss tells the sender about the path | `idea` |
| 4 | `tcp-header-options.md` | TCP Header Options and Performance | MSS, window scaling, SACK, timestamps, and why options change transport behavior | `idea` |
| 5 | `udp-and-quic.md` | UDP, QUIC, and Delivery Tradeoffs | Connectionless delivery, latency tradeoffs, reliability moved to higher layers, and QUIC design motivation | `idea` |

### Child Series — `internet-addressing-and-routing`

This renamed child series groups the internet-layer addressing, local resolution, control messaging, and path-selection part of the stack.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `ip-addressing-and-subnetting.md` | IP Addressing, Subnetting, and CIDR | IPv4 address structure, subnet boundaries, CIDR notation, and why subnetting changes forwarding decisions | `idea` |
| 2 | `arp-and-local-address-resolution.md` | ARP and Local Address Resolution | IP-to-MAC resolution, same-subnet delivery, and next-hop discovery on a LAN | `idea` |
| 3 | `icmp-and-network-control-messages.md` | ICMP and Network Control Messages | Ping, error reporting, TTL exceeded, and why control messages matter for diagnosis and delivery | `idea` |
| 4 | `nat-and-private-addressing.md` | NAT and Private Addressing | Private/public address roles, port translation, and why NAT became common in real networks | `idea` |
| 5 | `ip-fragmentation-and-mtu.md` | IP Fragmentation and MTU | Fragmentation, reassembly, MTU mismatches, and why fragmentation is expensive | `idea` |
| 6 | `routing-and-routing-protocols.md` | Routing and Routing Protocols | Static vs. dynamic routing, routing-table selection, and an introduction to routing protocols | `idea` |

The author may still adjust order, add topics, or split a post, but the backlog is now intentionally grouped by child series under `computer-networks`.

---

## Candidate Backlog — `operating-systems` Parent Series

The `operating-systems` parent is now expressed as a textbook-style backlog parent with explicit child series for introduction, execution units, concurrency, memory, and persistence/storage.

### Child Series — `operating-systems-overview`

This entry child series covers the opening OS layer before process and memory mechanics begin.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `what-is-an-operating-system.md` | 운영체제란 무엇인가 | Why operating systems exist, what abstractions they provide, and how they sit between hardware and programs | `idea` |
| 2 | `computer-system-structure.md` | 컴퓨터 시스템 구조 | CPU, memory, devices, interrupts, and the basic machine environment an OS manages | `idea` |
| 3 | `operating-system-structure.md` | 운영체제 구조 | Kernel responsibilities, service layering, and the difference between monolithic, modular, and layered views | `idea` |
| 4 | `system-calls-and-user-kernel-boundary.md` | 시스템 콜과 사용자-커널 경계 | User mode vs. kernel mode, traps, and how software crosses the protection boundary | `idea` |

### Child Series — `processes-and-threads`

This child series introduces the main execution units managed by an OS.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `process-concept-and-state.md` | 프로세스 개념과 상태 | Process abstraction, lifecycle, process control block, and state transitions | `idea` |
| 2 | `context-switching.md` | 문맥 교환 | What is saved and restored during a switch, and why switching has a runtime cost | `idea` |
| 3 | `threads-and-multithreading.md` | 스레드와 멀티스레딩 | Process vs. thread distinction, shared address space, and why multithreading exists | `idea` |
| 4 | `interprocess-communication.md` | 프로세스 간 통신 | Pipes, message passing, shared memory, and coordination between isolated execution contexts | `idea` |

### Child Series — `scheduling-and-synchronization`

This child series groups CPU sharing, concurrent coordination, and deadlock as one resource-control arc.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `cpu-scheduling-basics.md` | CPU 스케줄링 기초 | Scheduling goals, turnaround/response metrics, and why policy matters | `idea` |
| 2 | `scheduling-algorithms-and-tradeoffs.md` | 스케줄링 알고리즘과 트레이드오프 | FCFS, SJF, priority, round-robin, and the tradeoffs behind each | `idea` |
| 3 | `process-synchronization.md` | 프로세스 동기화 | Critical sections, races, mutual exclusion, and the need for coordination primitives | `idea` |
| 4 | `semaphores-and-monitors.md` | 세마포어와 모니터 | Semaphores, monitors, condition variables, and structured synchronization patterns | `idea` |
| 5 | `deadlock-and-resource-allocation.md` | 교착 상태와 자원 할당 | Deadlock conditions, resource-allocation framing, and avoidance/detection/recovery overview | `idea` |

### Child Series — `memory-management`

This child series covers physical allocation, address translation, and virtual-memory policy.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `address-binding-and-memory-layout.md` | 주소 바인딩과 메모리 배치 | Logical vs. physical addresses, relocation, and the baseline memory layout seen by programs | `idea` |
| 2 | `contiguous-allocation-and-fragmentation.md` | 연속 할당과 단편화 | Fixed/variable partitions, fragmentation, and why contiguous allocation scales poorly | `idea` |
| 3 | `paging-and-segmentation.md` | 페이징과 세그멘테이션 | Two classic address-translation models and their tradeoffs | `idea` |
| 4 | `virtual-memory-and-demand-paging.md` | 가상 메모리와 요구 페이징 | Virtual address spaces, lazy loading, page faults, and why demand paging exists | `idea` |
| 5 | `page-replacement-policies.md` | 페이지 교체 정책 | FIFO, LRU, locality, and what replacement policy tries to optimize | `idea` |

### Child Series — `file-systems-and-storage`

This child series keeps persistent data structures and storage-device coordination in one reviewable slice.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `file-system-interface.md` | 파일 시스템 인터페이스 | Files, directories, metadata, and the abstractions applications expect from a file system | `idea` |
| 2 | `directory-structure-and-allocation.md` | 디렉터리 구조와 할당 | Directory organization, block allocation, and how file layout affects access patterns | `idea` |
| 3 | `file-system-implementation.md` | 파일 시스템 구현 | On-disk structures, free-space tracking, and how file systems map names to blocks | `idea` |
| 4 | `storage-layer-and-io-basics.md` | 저장장치 계층과 I/O 기초 | Device controllers, buffering, caching, and the OS path from request to device interaction | `idea` |
| 5 | `mass-storage-and-disk-scheduling.md` | 대용량 저장장치와 디스크 스케줄링 | Disk structure, seek/rotation costs, and why storage scheduling policies exist | `idea` |

---

## Candidate Backlog — `spring-framework` Parent Series

The `spring-framework` parent isolates framework fundamentals and runtime mechanics from Boot-specific application ergonomics. Its child series are meant to keep IoC/container internals, AOP/transaction boundaries, and MVC request flow distinct from Spring Boot startup and operational topics.

### Child Series — `spring-core`

This entry child series covers the conceptual and container-level baseline for the framework itself.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `what-is-spring-framework.md` | 스프링 프레임워크란 무엇인가 | What Spring Framework is, what problems it solves, and why the container model matters | `idea` |
| 2 | `ioc-and-di.md` | IoC와 DI | Inversion of Control, dependency injection, and why object creation moves into the container | `idea` |
| 3 | `bean-container-and-application-context.md` | 빈 컨테이너와 ApplicationContext | BeanFactory/ApplicationContext roles, bean lookup, and container responsibilities | `idea` |
| 4 | `bean-lifecycle-and-scope.md` | 빈 생명주기와 스코프 | Bean creation lifecycle, initialization/destruction hooks, and singleton/prototype/request scope | `idea` |
| 5 | `configuration-class-and-component-scan.md` | 구성 클래스와 컴포넌트 스캔 | `@Configuration`, `@Bean`, stereotype annotations, and component scanning mechanics | `idea` |

### Child Series — `spring-aop-and-transactions`

This child series keeps cross-cutting concerns and transaction behavior inside the framework boundary rather than mixing them into Boot usage.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `what-is-spring-aop.md` | 스프링 AOP란 무엇인가 | Why Spring uses AOP, join points, advice, and the practical shape of proxy-based AOP | `idea` |
| 2 | `proxy-based-aop-in-spring.md` | 스프링의 프록시 기반 AOP | JDK dynamic proxy vs CGLIB, proxy creation, and what actually gets intercepted | `idea` |
| 3 | `transaction-abstraction-in-spring.md` | 스프링의 트랜잭션 추상화 | PlatformTransactionManager, declarative transaction boundaries, and why Spring abstracts transaction handling | `idea` |
| 4 | `transaction-propagation-and-isolation.md` | 트랜잭션 전파와 격리 수준 | Propagation modes, isolation levels, and how transaction boundaries interact across method calls | `idea` |
| 5 | `proxy-and-transaction-pitfalls.md` | 프록시와 트랜잭션의 흔한 함정 | Self-invocation, visibility/final-method issues, and common surprises in transactional code | `idea` |

### Child Series — `spring-web-mvc`

This child series keeps the web request lifecycle under the framework parent instead of treating MVC as a Boot-only convenience layer.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `spring-mvc-request-flow.md` | 스프링 MVC 요청 흐름 | DispatcherServlet, handler mapping, adapter dispatch, and the end-to-end request lifecycle | `idea` |
| 2 | `controller-and-request-mapping.md` | 컨트롤러와 요청 매핑 | Controller method model, `@RequestMapping` variants, and route-to-handler resolution | `idea` |
| 3 | `request-body-and-message-converter.md` | 요청 본문과 HttpMessageConverter | Request/response body binding, message conversion, and JSON serialization flow | `idea` |
| 4 | `validation-and-binding-in-spring-mvc.md` | 스프링 MVC의 검증과 바인딩 | Data binding, validation flow, `BindingResult`, and request-model error handling | `idea` |
| 5 | `exception-handling-in-spring-mvc.md` | 스프링 MVC의 예외 처리 | `@ExceptionHandler`, `@ControllerAdvice`, and consistent HTTP error response handling | `idea` |
| 6 | `filter-interceptor-and-argument-resolver.md` | 필터·인터셉터·ArgumentResolver | Servlet filter vs interceptor vs argument resolver responsibilities and ordering | `idea` |

## Candidate Backlog — `spring-boot` Parent Series

The `spring-boot` parent isolates application assembly, configuration ergonomics, testing workflow, and operational tooling from the framework's container and MVC internals.

### Child Series — `spring-boot-basics`

This entry child series covers what Boot adds on top of the framework and how a Boot application actually starts.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `what-is-spring-boot.md` | 스프링 부트란 무엇인가 | What Spring Boot is, what it automates, and why it exists separately from the core framework | `idea` |
| 2 | `spring-framework-vs-spring-boot.md` | 스프링 프레임워크와 스프링 부트의 차이 | Conceptual boundary between framework fundamentals and Boot application ergonomics | `idea` |
| 3 | `spring-boot-startup-flow.md` | 스프링 부트 시작 흐름 | `SpringApplication`, environment preparation, context creation, and startup phases | `idea` |
| 4 | `spring-boot-starters.md` | 스프링 부트 스타터 | What starters do, how dependency curation works, and why starter selection shapes application setup | `idea` |
| 5 | `embedded-server-in-spring-boot.md` | 스프링 부트의 내장 서버 | Embedded Tomcat/Jetty/Undertow roles and how Boot packages a runnable web application | `idea` |

### Child Series — `spring-boot-configuration`

This child series owns Boot-specific configuration behavior such as auto-configuration, externalized config, and environment/profile handling.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `auto-configuration-in-spring-boot.md` | 스프링 부트의 자동 구성 | Conditional auto-configuration, classpath-driven setup, and how Boot decides what to register | `idea` |
| 2 | `externalized-configuration-in-spring-boot.md` | 스프링 부트의 외부 설정 | Property sources, override order, and separating configuration from packaged code | `idea` |
| 3 | `profiles-and-environment-in-spring-boot.md` | 스프링 부트의 프로필과 환경 | Active profiles, environment-specific behavior, and profile-driven bean or property selection | `idea` |
| 4 | `application-yml-and-configuration-properties.md` | `application.yml`과 `@ConfigurationProperties` | YAML structure, hierarchical binding, and type-safe configuration objects | `idea` |

### Child Series — `spring-boot-testing-and-operations`

This child series owns Boot-specific testing slices and operational tooling rather than framework internals.

| Order | File name | Title | Scope | Status |
|-------|-----------|-------|-------|--------|
| 1 | `spring-boot-testing-overview.md` | 스프링 부트 테스트 개요 | The Boot testing model, context loading tradeoffs, and when to choose full-context vs narrower tests | `idea` |
| 2 | `spring-boot-test-slices.md` | 스프링 부트 테스트 슬라이스 | `@WebMvcTest`, `@DataJpaTest`, and other focused test-slice boundaries | `idea` |
| 3 | `mockmvc-testing.md` | MockMvc 테스트 | Request/response testing without a full external server and where MockMvc fits in the test pyramid | `idea` |
| 4 | `testcontainers-with-spring-boot.md` | 스프링 부트와 Testcontainers | Containerized dependency testing, integration setup, and realistic infrastructure tests | `idea` |
| 5 | `spring-boot-actuator-and-observability.md` | 스프링 부트 Actuator와 관측성 | Actuator endpoints, health/metrics exposure, and operational visibility concerns | `idea` |

---

## Starting a Post: `idea` → `draft` Process

### Vault directory location

New post files are created inside the vault's dedicated posts directory — the same directory passed as `--input` to the conversion script. Keep all post `.md` files in this one flat directory; do not nest them in subdirectories.

Recommended vault layout:

```
<vault-root>/
  posts/            ← create new post files here
    what-is-a-database-index.md
    b-plus-tree-index.md       ← new file goes here
  attachments/      ← images and other assets referenced from posts
  templates/        ← Obsidian templates (not processed by the script)
```

### Step 1 — Create the file in the Obsidian vault

Create a new `.md` file in the vault `posts/` directory. File name must follow D-15/D-16: all-lowercase kebab-case, English only.

```
b-plus-tree-index.md
transaction-and-acid.md
write-ahead-log.md
```

### Step 2 — Write the minimum frontmatter for `idea` state

A post in `idea` state must set the required frontmatter. Frontmatter-only stubs or minimal-body notes remain valid. All three D-25 required fields must be set even at `idea` state, because the conversion script and Astro schema both require them.

```yaml
---
title: "B+Tree Index Structure"
series: database-internals
order: 2
status: idea
---
```

Recommended minimal body for an idea stub:

```md
아이디어 단계 메모.
```

Minimum fields at `idea` state:

| Field | Required | Value at `idea` state |
|-------|----------|-----------------------|
| `title` | Yes (D-25) | The intended post title |
| `series` | Yes (D-25) | Confirmed series slug (e.g., `database-internals`) |
| `order` | Yes (D-25) | Intended position in the series (integer) |
| `status` | Yes (D-32) | `idea` — marks the post as not yet written |

No other frontmatter fields are required at `idea` state. `status` must still be set explicitly even for early drafts so lifecycle and visibility remain unambiguous. Under D-33, only `status: published` is included in staged and production output, so `idea` posts stay off the public site.

### Step 3 — Advance to `draft`

When ready to work on the post, change status to `draft`. This single working state now covers both outline-only documents and prose drafts.

Change status to `draft`:

```yaml
status: draft
```

A `draft`-state post body may still be outline-only:

```markdown
## What B+Tree Is
- balanced tree; all values in leaf nodes
- internal nodes store keys only
- ...

## How It Works
- insert/delete: splits and rotations
- range query: leaf-level linked list
- ...

## Example
- concrete lookup trace: root → internal → leaf
- show key comparisons at each level

## Quiz
Topic: properties of B+Tree vs. binary search tree
```

Begin writing prose when ready. The post does not need to be complete — `draft` means active work is in progress, whether that work is structural or prose-level.

The conversion script (`pnpm convert`) is not needed during Obsidian writing. Run it before previewing with Astro.

---

## First-Post Drafting Checklist

Use this while writing a post in `draft` state. Each item maps to a confirmed decision.

### Required content areas (D-6, D-7, D-8)

- [ ] Definition-level explanation written — what the topic is; accessible without prior knowledge
- [ ] Operational principles written — how it works internally; not just surface behavior
- [ ] At least one concrete example included inline (not a link to an external resource)
- [ ] Quiz section present and placed last

### Quiz (D-27)

- [ ] Exactly 5 MCQ questions
- [ ] Each question has exactly 4 answer options
- [ ] Each question has exactly 1 correct answer
- [ ] Each answer includes a brief explanation inside `<details>`

### File and metadata (D-15, D-16, D-25)

- [ ] File name is all-lowercase kebab-case, English only
- [ ] `title`, `series`, `order` are set in frontmatter
- [ ] `series` value is `database-internals` (or another confirmed slug from `docs/series-backlog.md`)
- [ ] `order` is an integer that does not conflict with existing posts in the same series

### Writing quality (D-9, D-29)

- [ ] The definition-level section is readable without prior technical knowledge
- [ ] No unexplained jargon introduced without a definition nearby
- [ ] Examples are correct and directly illustrate the point they accompany

---

## Quality Bar — What "Good Enough to Publish" Means

A post is ready to move from `draft` to `published` when all of the following are true:

**Content**
- Every required content area (definition, operational principles, examples, quiz) is complete — no `[Write here]` placeholders or stubs remain.
- Technical claims are accurate to the best of the author's knowledge.
- The post covers the topic at the two required depths (definition-level and operational-principles-level) without significant gaps.

**Quiz**
- All 5 questions test concepts that appear in the post body. No quiz question tests a fact not covered in the post.
- All 4 answer options per question are plausible distractors or correct; no obviously throwaway options.
- Answer explanations are complete sentences — not just "correct" or "see above."

**Readability**
- Reading the post end-to-end as a reader (not as the author) produces no confusion about the main argument or sequence.
- The post would make sense to a reader who has not read any other post in the series.

**Format**
- The file name and frontmatter are valid (see drafting checklist above).
- The Obsidian-to-Astro conversion runs without errors on this file (`pnpm convert --strict`).
- `pnpm build` completes without errors after conversion.
- The post becomes reader-visible only after frontmatter is explicitly changed to `status: published`.

This quality bar applies to the first post and to all subsequent posts. The bar does not lower for early posts.

---

## Pre-Publication Self-Review Checklist

Run through this checklist in a single sitting after the `docs/review-checklist.md` draft-readiness items all pass.

### Read-through pass

- [ ] Read the entire post as a reader — start to finish, no editing
- [ ] The opening paragraph answers "what is this topic" for a reader who knows nothing about it
- [ ] The operational principles section explains the mechanism, not just the outcome
- [ ] The transition between sections is logical — the post does not jump without context
- [ ] The final paragraph before the quiz leaves the reader with a clear takeaway

### Quiz pass

- [ ] Each question is unambiguous — a careful reader knows exactly what is being asked
- [ ] The correct answer cannot be guessed by elimination alone (distractors are plausible)
- [ ] Answer explanations add information beyond restating the question

### Technical accuracy pass

- [ ] Every claim that could be fact-checked has been verified
- [ ] No overgeneralizations that would be misleading to a practitioner audience
- [ ] Code examples (if any) are correct and would run as written

### Rendering pass

- [ ] Run `pnpm convert --input <vault-dir> --strict` — no errors or unresolved wikilinks
- [ ] Run `pnpm build` — no build errors
- [ ] Check the rendered post at `/posts/<slug>`: code blocks highlighted, images load, quiz `<details>` toggle correctly

### Final gate

- [ ] All items in this checklist pass
- [ ] All items in `docs/review-checklist.md` pass
- [ ] Change `status` to `published` in frontmatter
- [ ] Run conversion and build one final time before deploying

---

## Related Documents

- [`docs/post-template.md`](post-template.md) — confirmed post structure rules (D-6, D-7, D-8, D-26–D-28)
- [`docs/first-post-outline-template.md`](first-post-outline-template.md) — fill-in-the-blank Obsidian template
- [`docs/review-checklist.md`](review-checklist.md) — draft-readiness and publish checks
- [`docs/status-lifecycle.md`](status-lifecycle.md) — status vocabulary and update policy (D-30–D-33)
- [`docs/series-backlog.md`](series-backlog.md) — confirmed series list (D-21, D-22)
- [`docs/obsidian-conversion-contract.md`](obsidian-conversion-contract.md) — conversion script input contract
- [`docs/rendering-compatibility.md`](rendering-compatibility.md) — validated Markdown construct support
