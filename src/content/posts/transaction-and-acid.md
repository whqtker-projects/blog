---
title: "Transactions and ACID"
series: database-internals
order: 3
status: published
---

A transaction is a group of database operations that should succeed or fail as one unit. When an application transfers money, places an order, or updates several related tables, it needs the database to treat that work as a single logical action rather than as unrelated statements. ACID is the contract that explains what the database must protect while that transaction runs.

## What a Transaction Guarantees

The four ACID properties are **atomicity**, **consistency**, **isolation**, and **durability**.

- **Atomicity** means the whole transaction commits or the whole transaction is rolled back.
- **Consistency** means the transaction starts from one valid database state and ends in another valid state.
- **Isolation** means concurrent transactions do not observe each other's intermediate steps as if they were final results.
- **Durability** means a committed transaction survives crashes and restarts.

These properties solve different failure modes. Atomicity handles partial execution. Consistency protects invariants such as "an account balance cannot go negative unless overdraft is allowed." Isolation handles concurrency bugs such as lost updates and dirty reads. Durability protects committed work after the client has already been told "success."

## How Databases Enforce ACID

Atomicity is usually implemented with a combination of a transaction log and rollback data. Before the database makes a change permanent, it records enough information to either replay the change during recovery or undo it if the transaction aborts.

Consistency is partly enforced by the database and partly by the application. The database enforces structural rules such as primary keys, foreign keys, check constraints, and type validation. The application enforces business rules such as "inventory cannot go below zero" or "a transfer must debit and credit the same amount."

Isolation is the most subtle property because it exists only when multiple transactions overlap. Databases implement isolation with locks, multi-version concurrency control (MVCC), or both. Instead of exposing half-finished changes, the engine gives each transaction a controlled view of the data.

Durability is usually implemented through write-ahead logging. The database first writes the commit record and related changes to durable storage, then reports success to the client. If the process crashes immediately afterward, recovery can replay the committed transaction from the log.

## Where Isolation Levels Fit

Isolation is not a binary feature. Most databases offer multiple isolation levels so the author can trade correctness guarantees against concurrency and latency.

- **Read Uncommitted** allows the weakest guarantees and can expose dirty reads.
- **Read Committed** prevents dirty reads but still allows non-repeatable reads and some phantoms.
- **Repeatable Read** gives a transaction a stable view of rows it has already read, though exact behavior differs by engine.
- **Serializable** gives the strongest guarantee: the final result must match some serial execution order.

In practice, many systems default to `READ COMMITTED` because it avoids the worst anomalies without paying the full cost of serial execution. When the workload includes critical invariants, such as preventing double-booking or guaranteeing exact financial totals, the application may need stronger isolation or explicit locking.

## Example: Bank Transfer

Suppose an application transfers $100 from account A to account B. The transfer is one business action, so it should be one database transaction:

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 'A';

UPDATE accounts
SET balance = balance + 100
WHERE id = 'B';

COMMIT;
```

If the database crashes after debiting A but before crediting B, atomicity requires the whole transaction to roll back during recovery. If another transaction reads account A while this transfer is still in progress, isolation determines whether it can see the temporary lower balance. If the commit succeeds and the server crashes one second later, durability requires both balance changes to still exist after restart.

A simplified Python transaction wrapper makes the same idea explicit:

```python
def transfer(conn, from_id, to_id, amount):
    with conn.transaction():
        conn.execute(
            "UPDATE accounts SET balance = balance - %s WHERE id = %s",
            (amount, from_id),
        )
        conn.execute(
            "UPDATE accounts SET balance = balance + %s WHERE id = %s",
            (amount, to_id),
        )
```

The important point is not the syntax. The important point is that the debit and credit are bound together. Without a transaction, the system can easily produce money that disappears, appears twice, or is visible in an intermediate state to another concurrent request.

## Quiz

**Q1.** What does atomicity guarantee for a transaction?

- A) Each statement in the transaction is durable before the next one runs
- B) The transaction either commits completely or rolls back completely
- C) The transaction always runs alone with no concurrent work
- D) The transaction can violate constraints temporarily as long as it finishes

<details>
<summary>Answer</summary>
B. Atomicity treats the transaction as one unit of success or failure rather than as a set of independent partial updates.
</details>

---

**Q2.** Which ACID property is primarily concerned with concurrent transactions seeing intermediate results?

- A) Atomicity
- B) Consistency
- C) Isolation
- D) Durability

<details>
<summary>Answer</summary>
C. Isolation controls what one transaction can observe about another transaction while both are running.
</details>

---

**Q3.** Which mechanism most directly supports durability after a crash?

- A) A write-ahead log that is flushed before commit is acknowledged
- B) A larger buffer cache for hot pages
- C) More secondary indexes on frequently queried columns
- D) A wider B+Tree fan-out

<details>
<summary>Answer</summary>
A. Durability depends on committed changes being recorded in stable storage so recovery can replay them after a crash.
</details>

---

**Q4.** Why is consistency not enforced only by the database engine?

- A) Because consistency applies only to analytics queries
- B) Because application-specific business invariants often live above built-in constraints
- C) Because consistency and isolation are the same property under MVCC
- D) Because consistency is relevant only for distributed databases

<details>
<summary>Answer</summary>
B. The database can enforce structural rules, but many domain rules such as inventory or transfer invariants must still be encoded by the application.
</details>

---

**Q5.** Why might an application choose `SERIALIZABLE` instead of `READ COMMITTED`?

- A) To reduce logging overhead during commit
- B) To eliminate the need for primary keys
- C) To guarantee results equivalent to some serial execution order
- D) To make each transaction use fewer locks than weaker isolation levels

<details>
<summary>Answer</summary>
C. Serializable isolation gives the strongest concurrency guarantee by requiring the outcome to match a one-at-a-time execution order.
</details>
