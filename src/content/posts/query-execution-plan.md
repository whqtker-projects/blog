---
title: "Query Execution and the Optimizer"
series: database-internals
order: 5
status: published
tags:
  - graph/post
---

When you send SQL to a database, the engine does not execute the text directly from left to right. It first turns the query into an execution plan: a concrete sequence of operations such as scanning a table, probing an index, filtering rows, joining two inputs, and sorting results. The optimizer is the part of the database that searches for a good plan and estimates which one will be cheapest.

## What a Query Plan Is

A query plan is the database's step-by-step strategy for answering a SQL statement. For a simple query, the plan might be "scan the users table and keep only rows where `email` matches." For a more complex query, the plan might combine several strategies: use an index to narrow one table, hash-join it to another table, then sort the final rows for output.

This is why performance often changes even when the SQL result stays the same. Two different plans can return identical rows while doing very different amounts of work underneath. A good optimizer exists to choose the cheaper plan before execution begins.

The planner usually starts from a parsed representation of the SQL, rewrites it into an internal relational form, enumerates candidate execution strategies, and assigns each strategy an estimated cost. The cheapest estimate wins, and the executor runs that plan.

## How the Optimizer Estimates Cost

Cost estimation is a prediction, not a guarantee. The optimizer asks questions such as:

- How many rows will each filter probably keep?
- Is an index available on the filtered or joined column?
- How expensive is random I/O compared with sequential I/O?
- Will a join input fit in memory, or will it spill?
- How many rows must be sorted before the final output can be produced?

To answer those questions, the database uses statistics such as row counts, value distribution histograms, distinct counts, and null fractions. If the statistics suggest that a predicate is highly selective, an index scan may look cheap. If the predicate matches a large percentage of the table, the optimizer may decide that a sequential table scan is cheaper because it avoids many random lookups.

This is why stale statistics can cause surprisingly bad plans. The optimizer may choose logically valid steps but base them on row-count estimates that are no longer true.

## From SQL to Physical Steps

Suppose the application asks for one user by email:

```sql
SELECT id, name
FROM users
WHERE email = 'alice@example.com';
```

At a logical level, the query says "filter the `users` relation by `email` and project `id` and `name`." At a physical level, the optimizer might choose one of two broad strategies:

1. **Table scan**: read every row in `users`, test the predicate, and return the matching row.
2. **Index scan**: probe an index on `email`, find the matching row locations, and fetch only the needed rows.

The optimizer does not pick between these based on theory alone. It compares estimated cost. If the table is small or a large fraction of rows match, a table scan can win. If the predicate is selective and the index is well maintained, an index scan usually wins.

For multi-table queries, the same pattern extends to join order and join algorithm choice. The planner may choose nested-loop join, hash join, or merge join depending on estimated row counts and available ordering.

## Why Index Scans Sometimes Beat Table Scans

An index scan is powerful because it can avoid reading most of the table. If the query needs one row out of one million, scanning the full table wastes work. An index on the filtered column lets the executor jump directly to a narrow subset.

That advantage depends on selectivity. If the predicate matches 40% of the table, using the index may require a huge number of random lookups into the base table. In that case, a sequential scan can be cheaper because modern storage and buffer caches are optimized for linear reads.

This is the same tradeoff introduced in [What Is a Database Index?](/posts/what-is-a-database-index). Indexes are not universally faster. They are faster when they sharply reduce the amount of data the executor must touch.

Databases also consider covering behavior. If the needed columns already exist in the index, the engine may avoid visiting the base table at all. That can make an index-only plan even cheaper than an ordinary index scan.

## Example: Two Competing Plans

Imagine the `users` table has 1,000,000 rows and an index on `email`.

If the query searches for one exact email address, the optimizer may prefer:

```text
Index Scan on users_email_idx
  -> fetch matching row pointer
  -> read one table row
```

If the query asks for all users created this year and that condition matches 400,000 rows, the optimizer may prefer:

```text
Seq Scan on users
  -> read table pages in order
  -> filter rows by created_at
```

The first plan wins because the index narrows work from 1,000,000 rows to roughly 1. The second plan can win because reading almost half the table through index probes may cost more than just scanning the table once.

A simplified Python-style sketch of optimizer thinking looks like this:

```python
def choose_access_path(row_count, estimated_matches, has_index):
    table_scan_cost = row_count

    if not has_index:
        return "table_scan"

    index_scan_cost = estimated_matches * 4  # probe + heap fetch approximation
    return "index_scan" if index_scan_cost < table_scan_cost else "table_scan"
```

Real optimizers use far richer cost models than this, but the shape of the decision is the same: estimate work, compare alternatives, choose the cheaper plan.

## Quiz

**Q1.** What is the optimizer trying to choose?

- A) The only SQL syntax that can produce a correct result
- B) The cheapest execution strategy among valid alternatives
- C) The transaction isolation level for the session
- D) The order in which rows are physically stored on disk forever

<details>
<summary>Answer</summary>
B. The optimizer compares valid execution strategies and chooses the one with the lowest estimated cost.
</details>

---

**Q2.** Why can two plans return the same result but have very different performance?

- A) Because one plan changes the table while the other does not
- B) Because query plans are chosen randomly for fairness
- C) Because logically equivalent plans can do different amounts of physical work
- D) Because SQL results depend only on storage engine version

<details>
<summary>Answer</summary>
C. Different plans can be logically equivalent while requiring very different scans, lookups, joins, or sorts underneath.
</details>

---

**Q3.** When is an index scan most likely to beat a table scan?

- A) When the predicate matches a very small fraction of rows
- B) When the table has no statistics
- C) When the query always returns every row
- D) When the index column has only one repeated value

<details>
<summary>Answer</summary>
A. Index scans are strongest when the predicate is selective enough to avoid touching most of the table.
</details>

---

**Q4.** What problem can stale statistics cause?

- A) They can make committed transactions non-durable
- B) They can lead the optimizer to estimate row counts incorrectly and choose a poor plan
- C) They force every query to use a sequential scan
- D) They disable join algorithms other than nested loops

<details>
<summary>Answer</summary>
B. If the optimizer has wrong assumptions about row counts or value distribution, it can choose a plan that is valid but unnecessarily expensive.
</details>

---

**Q5.** Why might a table scan beat an index scan for a low-selectivity predicate?

- A) Because table scans ignore filters entirely
- B) Because index scans cannot use statistics
- C) Because many index probes plus table fetches can cost more than one sequential pass
- D) Because table scans automatically sort the output

<details>
<summary>Answer</summary>
C. When a predicate matches many rows, repeated index lookups can be more expensive than scanning the table once in order.
</details>
