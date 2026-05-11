---
title: What Is a Database Index?
series: database-internals
order: 1
status: draft
tags:
  - graph/post
---

A database index is a separate data structure that stores a subset of a table's data in a way that makes lookups faster. Without an index, the database must scan every row to find matching records. With an index, it narrows the search to a small subset.

## How It Works

When you create an index on a column, the database builds an auxiliary structure — most commonly a B+Tree — ordered by the values in that column. A query filtering on that column walks the tree rather than scanning the table, reducing the number of rows examined from O(n) to O(log n).

Write operations (INSERT, UPDATE, DELETE) become slightly more expensive because the index must be updated alongside the table. This is the core tradeoff: indexes speed up reads at the cost of slower writes and additional storage.

To see what indexes a table currently has in PostgreSQL:

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users';
```

A simplified model of how a B+Tree lookup works in Python:

```python
import bisect

class BPlusTreeLeaf:
    def __init__(self, keys, values):
        self.keys = keys      # sorted list of indexed values
        self.values = values  # corresponding row pointers

    def find(self, target):
        pos = bisect.bisect_left(self.keys, target)
        if pos < len(self.keys) and self.keys[pos] == target:
            return self.values[pos]
        return None
```

## Example

![B+Tree structure](/images/btree-structure.svg)

Given a `users` table with one million rows, a query like:

```sql
SELECT * FROM users WHERE email = 'alice@example.com';
```

Without an index on `email`, the database reads all one million rows.
With a B+Tree index on `email`, it reads roughly 20 rows (the depth of the tree). For a detailed breakdown of how the B+Tree achieves this, see [B+Tree Index Structure](/posts/b-plus-tree-index).

A hash-based in-memory index in JavaScript follows the same idea — O(1) lookup by key, no range support:

```javascript
class HashIndex {
  constructor() {
    this.map = new Map(); // key → [rowPointer, ...]
  }

  insert(key, rowPointer) {
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key).push(rowPointer);
  }

  lookup(key) {
    return this.map.get(key) ?? [];
  }
}
```

## Quiz

**Q1.** What is the primary purpose of a database index?

- A) To reduce storage space used by the table
- B) To speed up read queries by narrowing the rows examined
- C) To enforce uniqueness across rows
- D) To compress column values automatically

<details>
<summary>Answer</summary>
B. An index exists to reduce the number of rows the database must examine when answering a query.
</details>

---

**Q2.** Which data structure is most commonly used inside a database index?

- A) Hash table
- B) Linked list
- C) B+Tree
- D) Binary heap

<details>
<summary>Answer</summary>
C. B+Tree is the default index structure in most relational databases because it supports both point lookups and range queries efficiently.
</details>

---

**Q3.** What is the main cost of adding an index to a table?

- A) Slower read queries
- B) Higher memory usage during SELECT
- C) Slower write operations and additional storage
- D) Reduced query parallelism

<details>
<summary>Answer</summary>
C. Every INSERT, UPDATE, or DELETE must also update the index structure, adding write overhead and consuming extra disk space.
</details>

---

**Q4.** A table has 1,000,000 rows and no index on the `email` column. A query filters by email. Approximately how many rows does the database examine?

- A) ~20
- B) ~1,000
- C) ~1,000,000
- D) ~500,000

<details>
<summary>Answer</summary>
C. Without an index, the database performs a full table scan and examines every row.
</details>

---

**Q5.** After adding a B+Tree index on `email` in the same 1,000,000-row table, approximately how many rows does the same query examine?

- A) ~20
- B) ~1,000
- C) ~1,000,000
- D) ~500,000

<details>
<summary>Answer</summary>
A. A B+Tree of depth ~20 covers 1,000,000 rows (log base 50 of 1,000,000 ≈ 20), so only about 20 nodes are read.
</details>
