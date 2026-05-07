---
title: "E2E Rendering Validation"
series: database-internals
order: 3
status: published
---

This post exercises all four rendering requirements in a single fixture: code blocks, images, internal links, and a quiz section.

## Code Blocks

SQL query for creating an index:

```sql
CREATE INDEX idx_users_email ON users(email);
```

Python snippet showing bisect-based lookup:

```python
import bisect

def lookup(keys, target):
    pos = bisect.bisect_left(keys, target)
    if pos < len(keys) and keys[pos] == target:
        return pos
    return -1
```

JavaScript hash index:

```javascript
const index = new Map();
index.set('alice@example.com', 42);
console.log(index.get('alice@example.com')); // 42
```

## Image

![[btree-structure.svg|B+Tree structure diagram]]

## Internal Links

For background on why indexes exist, see [[what-is-a-database-index|What Is a Database Index?]].
For a detailed explanation of the tree structure, see [[b-plus-tree-index|B+Tree Index Structure]].

## Quiz

**Q1.** Which SQL statement creates an index on the `email` column of the `users` table?

- A) `ALTER TABLE users ADD INDEX email;`
- B) `CREATE INDEX idx_users_email ON users(email);`
- C) `INSERT INDEX ON users(email);`
- D) `UPDATE INDEX users SET email;`

<details>
<summary>Answer</summary>
B. The correct syntax is CREATE INDEX followed by the index name, ON the table, and the column in parentheses.
</details>

---

**Q2.** What does `bisect_left` return when the target is not in the list?

- A) -1
- B) The position where the target would be inserted
- C) None
- D) The length of the list

<details>
<summary>Answer</summary>
B. bisect_left returns the leftmost position where the target could be inserted to keep the list sorted.
</details>
