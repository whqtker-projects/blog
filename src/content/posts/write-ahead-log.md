---
title: "Write-Ahead Log and Durability"
series: database-internals
order: 4
status: published
---

A write-ahead log, usually shortened to WAL, is the mechanism a database uses to make committed changes survive crashes. The core idea is simple: before the database writes a changed data page back to its main table files, it first records the change in a sequential log. That ordering rule lets the engine recover committed transactions even if the process stops halfway through writing ordinary pages.

## What WAL Guarantees

Durability means that once the database tells the client "commit succeeded," that transaction must still exist after a crash and restart. WAL supports that promise by separating two questions:

- When is a transaction considered committed?
- When do the modified table or index pages get written to their permanent locations?

Without WAL, those two events would need to happen at the same time, which is slow and fragile. With WAL, the database can treat the log as the source of truth for recent committed changes and flush slower page writes later in the background.

This is why durability is usually explained together with [Transactions and ACID](/posts/transaction-and-acid). ACID says committed work must survive failure. WAL is one of the main mechanisms that makes that statement true in practice.

## Log Before Page Write

The "write-ahead" rule is precise: the log record describing a change must reach durable storage before the corresponding data page is allowed to reach durable storage.

Suppose a transaction updates a row in the `accounts` table. Internally, the database usually does not rewrite the table file immediately. It first:

1. Creates one or more log records describing the modification.
2. Appends those records to the WAL buffer.
3. Flushes the relevant WAL records to disk before acknowledging commit.
4. Leaves the changed data page in memory for later background flushing.

That ordering matters because crashes often happen between steps. If the process dies after the WAL flush but before the data page flush, recovery can replay the committed change from the log. If the data page reached disk before its WAL record, recovery could not prove what happened and might leave the database in an inconsistent state.

## Crash Recovery Flow

When the database restarts after a crash, recovery reads the WAL and uses it to rebuild a correct state. The exact algorithm differs across engines, but the flow is usually:

1. Start from the most recent checkpoint.
2. Scan forward through WAL records after that checkpoint.
3. Redo committed changes that might not yet have reached data pages.
4. Undo or discard incomplete work that never committed.

This is why sequential logging is so valuable. Recovery can reason about the history of changes in time order instead of guessing from partially written table pages.

In many systems, recovery also relies on log sequence numbers (LSNs). Each WAL record gets an increasing position in the log, and data pages track the newest LSN whose change they already contain. If recovery sees a WAL record newer than the page's LSN, it knows that record still needs to be applied.

## What Checkpoints Do

If recovery had to scan the full history of the database every time, restart would become slower and slower. Checkpoints prevent that.

A checkpoint records a recovery starting point that says, in effect, "everything before here has been organized enough that recovery can start from this position instead of from the beginning of time." The engine still uses WAL after the checkpoint, but it no longer needs to replay the entire log archive on every restart.

Checkpointing does not replace WAL. It works with WAL:

- WAL preserves the ordered history of changes.
- Checkpoints limit how much of that history recovery must scan.
- Background page flushing gradually moves dirty pages from memory to table files.

This is also why checkpoints can create I/O pressure. If too many dirty pages must be flushed in a short interval, latency spikes can appear even though the logical model remains correct.

## Example: Commit Path

Imagine a transaction transfers $100 from account A to account B:

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

The important durability sequence is not "write both table pages immediately." It is closer to this:

```text
1. Create WAL record: debit A
2. Create WAL record: credit B
3. Flush WAL records to durable storage
4. Mark transaction committed
5. Flush changed table pages later
```

If the server crashes between steps 4 and 5, the transfer is still durable because recovery can replay the committed WAL records. If it crashes before step 3 finishes, the commit cannot be considered durable yet, so recovery will not treat the transaction as fully committed.

A simplified recovery-oriented sketch in Python looks like this:

```python
def commit_transaction(wal, buffer_pool, changes):
    for change in changes:
        wal.append(change)

    wal.flush()  # durability point

    for page_id, change in changes:
        buffer_pool.apply_in_memory(page_id, change)

    return "committed"
```

Real engines are more complex than this sketch, but the ordering is the key idea: durable log first, ordinary page write later.

## Quiz

**Q1.** What is the defining rule of write-ahead logging?

- A) Table pages must be written before any index pages
- B) Log records describing a change must be durable before the changed data page is durable
- C) Checkpoints must happen before every transaction commit
- D) Recovery must always replay the entire log from the beginning

<details>
<summary>Answer</summary>
B. WAL requires the log record for a change to reach durable storage before the corresponding data page is allowed to become durable.
</details>

---

**Q2.** Why can a database acknowledge commit before flushing all changed table pages?

- A) Because committed changes can be replayed later from WAL
- B) Because indexes do not need durability guarantees
- C) Because committed rows are stored only in memory until checkpoint
- D) Because checkpoints immediately rewrite all dirty pages

<details>
<summary>Answer</summary>
A. Once the relevant WAL records are durable, recovery can replay committed changes even if ordinary data pages were not yet flushed.
</details>

---

**Q3.** What is the main purpose of a checkpoint?

- A) To eliminate the need for WAL during crash recovery
- B) To reduce how far recovery must scan through WAL after restart
- C) To guarantee serializable isolation for all transactions
- D) To prevent all dirty pages from ever being written twice

<details>
<summary>Answer</summary>
B. A checkpoint gives recovery a later starting point so restart does not need to scan the full history every time.
</details>

---

**Q4.** What happens if a server crashes after WAL is flushed but before dirty pages are flushed?

- A) The committed transaction is lost because the table files were not updated
- B) Recovery can replay the committed change from WAL
- C) Recovery must ignore the WAL because page files are authoritative
- D) The database can restart only if a new checkpoint exists

<details>
<summary>Answer</summary>
B. That is the main benefit of WAL: the log preserves committed changes even when data-page writes happen later.
</details>

---

**Q5.** Why are log sequence numbers (LSNs) useful during recovery?

- A) They tell the optimizer whether an index scan is cheaper than a table scan
- B) They decide which SQL syntax can be parsed after restart
- C) They help recovery determine whether a page already contains a given WAL change
- D) They replace foreign-key checks during commit

<details>
<summary>Answer</summary>
C. LSNs let the engine compare WAL progress with page state and decide whether a log record still needs to be applied.
</details>
