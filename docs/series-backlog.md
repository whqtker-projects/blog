# Series Backlog

**Status:** Confirmed — series structure decided on 2026-05-07. See `confirmed-decisions.md` D-19–D-22 and `decision-log.md` DL-004.  
**Last updated:** 2026-05-07

This document is the authoritative list of confirmed series. The structure is no longer a candidate list — all 12 series below have been decided. Individual series descriptions, post lists, and ordering are defined in their respective series files under `docs/series/` (not yet created; tracked in issue #35 and later issues).

---

## What Is a Series?

A series is a named grouping of posts that share a topic focus and a learning arc within a domain. Each post belongs to exactly one series (D-20). Series are not 1:1 with domains — each domain contains multiple series (D-19).

---

## Confirmed Series

### Backend and Systems

| Series slug | Status | Notes |
|---|---|---|
| `database-internals` | **First series** (D-22) | Storage engines, indexing, transactions, query execution |
| `distributed-systems` | Confirmed | Consensus, replication, consistency models |
| `network-protocols` | Confirmed | TCP/IP, HTTP, DNS, TLS internals |
| `backend-design` | Confirmed | API design, concurrency patterns, service architecture |

### CS Fundamentals

| Series slug | Status | Notes |
|---|---|---|
| `data-structures` | Confirmed | Arrays, trees, graphs, hash tables |
| `algorithms` | Confirmed | Sorting, search, dynamic programming, complexity |
| `operating-systems` | Confirmed | Processes, scheduling, memory management, I/O |
| `computer-architecture` | Confirmed | CPU pipeline, cache, memory hierarchy |
| `computer-security` | Confirmed | Cryptography, authentication, common attack models |

### AI / ML / LLM

| Series slug | Status | Notes |
|---|---|---|
| `llm-internals` | Confirmed | Transformer architecture, attention, tokenization, inference |
| `ml-fundamentals` | Confirmed | Statistical learning, training, evaluation, classical models |

### Software Engineering

| Series slug | Status | Notes |
|---|---|---|
| `design-principles` | Confirmed | SOLID, design patterns, coupling, abstraction |

---

## Structure Rules

- **One post, one series:** Cross-series membership is not allowed (D-20).
- **Multiple series per domain:** Domains are not collapsed into single series (D-19).
- **Slug format:** all-lowercase kebab-case, English only (D-15, D-16).
- **Series naming policy** (slug ↔ display name mapping): tracked in issue #33.
- **Post metadata structure** (how a post declares its series): tracked in issue #34.

---

## Related Documents

- [`docs/confirmed-decisions.md`](confirmed-decisions.md) — D-19, D-20, D-21, D-22
- [`docs/decision-log.md`](decision-log.md) — DL-004 (series structure), DL-005 (first series)
- [`docs/open-questions.md`](open-questions.md) — Q-3, Q-5 (both resolved)
