---
title: "B+Tree Index Structure"
series: database-internals
order: 2
status: published
tags:
  - graph/post
---

A B+Tree is the data structure that most relational databases use to implement indexes. If you have read [What Is a Database Index?](/posts/what-is-a-database-index), you already know why indexes exist. This post explains how the B+Tree makes them fast.

## Structure

A B+Tree is a balanced tree where every value lives in a leaf node. Internal nodes store only keys — routing guides that direct a lookup to the right leaf. All leaf nodes are linked together in a doubly-linked list, which is what makes range queries efficient.

```
         [30]                   ← internal node (keys only)
        /     \
  [10|20]   [40|50]             ← leaf nodes (keys + row pointers)
```

A node that can hold up to `n` keys is called an order-`n` B+Tree. Real databases use orders in the hundreds, fitting many keys per disk page.

## Lookup

To find a row with key `k`:

1. Start at the root.
2. At each internal node, binary-search the keys to find the child pointer to follow.
3. Arrive at a leaf node; binary-search for `k` among the leaf's keys.
4. Return the row pointer (or `NULL` if not found).

The tree stays balanced by construction, so every lookup touches exactly `⌈log_n(N)⌉` nodes for `N` total rows.

## Range Query

A range query such as `WHERE age BETWEEN 25 AND 40` works in two steps:

1. Point-lookup to find the leaf containing the lower bound (25).
2. Scan right through the linked leaf list, collecting rows, until the upper bound (40) is passed.

This is the key advantage of B+Tree over a hash index — hash indexes cannot answer range queries at all (see [What Is a Database Index?](/posts/what-is-a-database-index#example) for a side-by-side comparison).

## Insert and Delete

Every insert and delete must keep the tree balanced. The two operations are **split** (when a node overflows) and **merge/rebalance** (when a node underflows after deletion).

```python
def insert_into_leaf(leaf, key, row_ptr):
    pos = bisect.bisect_left(leaf.keys, key)
    leaf.keys.insert(pos, key)
    leaf.values.insert(pos, row_ptr)
    if len(leaf.keys) > leaf.max_keys:
        split_leaf(leaf)  # propagate split upward if needed
```

Because every write must update the index structure as well as the table, write-heavy workloads pay a higher cost per row. Choosing which columns to index is a balance between read speed and write overhead.

## Quiz

**Q1.** In a B+Tree, where are actual row values (or row pointers) stored?

- A) In every node
- B) Only in internal nodes
- C) Only in leaf nodes
- D) In the root node only

<details>
<summary>Answer</summary>
C. B+Tree stores all values in leaf nodes. Internal nodes contain only keys used for routing.
</details>

---

**Q2.** Why can a B+Tree answer range queries efficiently while a hash index cannot?

- A) B+Tree uses less memory per key
- B) B+Tree leaf nodes are linked in a list, enabling sequential scan after the lower-bound lookup
- C) B+Tree compresses duplicate keys
- D) B+Tree stores values sorted by insertion order

<details>
<summary>Answer</summary>
B. The leaf-level linked list lets the database scan from the lower bound to the upper bound without returning to the root.
</details>

---

**Q3.** What happens to a B+Tree leaf node that exceeds its maximum key capacity after an insert?

- A) The tree is rebuilt from scratch
- B) The excess keys are moved to a sibling node without splitting
- C) The leaf is split and the middle key is promoted to the parent
- D) The insert is rejected until space is freed

<details>
<summary>Answer</summary>
C. An overflowing leaf is split into two nodes; the split key is promoted upward, potentially triggering further splits up to the root.
</details>

---

**Q4.** A B+Tree of order 500 stores 125,000,000 rows. How many nodes does a single point-lookup visit at most?

- A) 125,000,000
- B) 500
- C) 4
- D) 1

<details>
<summary>Answer</summary>
C. ⌈log₅₀₀(125,000,000)⌉ = ⌈3.6⌉ = 4. Even at this scale, only 4 nodes are read.
</details>

---

**Q5.** Which operation is more expensive on a table with a B+Tree index compared to a table with no index?

- A) Point lookup by indexed column
- B) Range scan by indexed column
- C) INSERT of a new row
- D) SELECT COUNT(*) with no WHERE clause

<details>
<summary>Answer</summary>
C. Every INSERT must update the B+Tree structure in addition to writing the row, making writes more expensive than on an unindexed table.
</details>
