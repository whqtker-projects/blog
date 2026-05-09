# Series Backlog

**Status:** Confirmed — series structure decided on 2026-05-07; current hierarchy migration reflected here. See `confirmed-decisions.md` D-19–D-22 and D-57–D-64.  
**Last updated:** 2026-05-09

This document is the authoritative list of confirmed series. The structure is no longer a candidate list — all 12 series below have been decided. Individual series descriptions, post lists, and ordering are defined in their respective series files under `docs/series/` (not yet created; tracked in issue #35 and later issues).

---

## What Is a Series?

Under the current hierarchy model, a child series is the named grouping of posts that share a topic focus and a learning arc within a domain. Each post belongs to exactly one child series (D-20). Parent series group related child series and do not own posts directly.

---

## Current Hierarchy

The repository is now migrating the current real flat series into parent-child structure. The three real child series already present in `src/content/series_indexes/` are mapped as follows:

| Parent series slug | Parent display name | Child series slug | Child display name |
|---|---|---|---|
| `database-systems` | Database Systems | `database-internals` | Database Internals |
| `computer-networks` | Computer Networks | `network-protocols` | Network Protocols |
| `data-structures-and-algorithms` | Data Structures and Algorithms | `data-structures` | Data Structures |

Existing child slugs are preserved during migration, including `network-protocols`.

---

## Confirmed Child Series

### Backend and Systems (domain slug: `backend-systems`)

| Series slug | Display Name | Status | Notes |
|---|---|---|---|
| `database-internals` | Database Internals | **First series** (D-22) | Storage engines, indexing, transactions, query execution |
| `distributed-systems` | Distributed Systems | Confirmed | Consensus, replication, consistency models |
| `network-protocols` | Network Protocols | **In progress** | TCP/IP, HTTP, DNS, TLS internals |
| `backend-design` | Backend Design | Confirmed | API design, concurrency patterns, service architecture |

### CS Fundamentals (domain slug: `cs-fundamentals`)

| Series slug | Display Name | Status | Notes |
|---|---|---|---|
| `data-structures` | Data Structures | Confirmed | Arrays, trees, graphs, hash tables |
| `algorithms` | Algorithms | Confirmed | Sorting, search, dynamic programming, complexity |
| `operating-systems` | Operating Systems | Confirmed | Processes, scheduling, memory management, I/O |
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
- **Posts attach to child series only:** Parent series are grouping and navigation units, not post owners.
- **Multiple series per domain:** Domains are not collapsed into single series (D-19).
- **Two levels only:** Parent series → child series → posts. No third hierarchy layer is allowed.
- **Slug format:** all-lowercase kebab-case, English only (D-15, D-16).
- **Series naming policy** (slug ↔ display name mapping): tracked in issue #33.
- **Post metadata structure** (how a post declares its series): tracked in issue #34.

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-19, D-20, D-21, D-22
- [`docs/decision-log.md`](decision-log.md) — DL-004 (series structure), DL-005 (first series)
- [`docs/open-questions.md`](open-questions.md) — Q-3, Q-5 (both resolved)
