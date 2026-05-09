# Computer Networks

## Purpose

`computer-networks` groups the networking backlog into a learning arc that starts with foundations, then moves through transport internals, internet-layer addressing/routing, and finally application-facing protocols.

## Child Series Composition

| Order | Child series | Current posture |
|---|---|---|
| 1 | `network-foundations` | 4 idea |
| 2 | `transport-and-reliability` | 1 draft, 4 idea |
| 3 | `internet-addressing-and-routing` | 6 idea |
| 4 | `network-protocols` | 1 draft, 3 idea |

Current child indexes:
- `src/content/series_indexes/computer-networks/network-foundations.md`
- `src/content/series_indexes/computer-networks/network-protocols.md`
- `src/content/series_indexes/computer-networks/transport-and-reliability.md`
- `src/content/series_indexes/computer-networks/internet-addressing-and-routing.md`

## Backlog Posture

This parent is mid-rollout:
- the former flat `network-protocols` backlog has now been rebuilt into a four-part arc
- explicit child ordering is in place
- post statuses are still mostly `idea` or `draft`, so this parent remains backlog-heavy rather than publication-complete
- the current structure now balances the repository's backend/web orientation against a more textbook-like networking progression

## Next Expansion Points

- Promote the existing `draft` posts before adding another large sibling child series.
- Keep internet-layer topics such as ARP, ICMP, NAT, and routing protocols inside `internet-addressing-and-routing` rather than mixing them back into `network-protocols`.
- Treat `network-foundations` as the entry point for future readers instead of putting overview and layering material into the application-protocol child.
