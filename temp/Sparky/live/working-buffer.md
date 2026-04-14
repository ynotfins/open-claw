# working-buffer.md — In-Flight Governance Entries

This file captures governance actions that have occurred this session but have not yet been committed to DECISION_LOG.md.

Working buffer entries are temporary by definition.
They must be promoted to DECISION_LOG.md before the session closes, or explicitly handed off.

If a session resets without promotion: the next session reads this file first, promotes all entries, then begins normal operations.

---

## Buffer Entries

<!-- Add entries here as they occur during the session.

Format:
---
[TIMESTAMP] [WORK_ITEM_ID] [ACTION_TYPE: CLASSIFY | ROUTE | EVALUATE | DECIDE | ENFORCE | RECORD]
Summary: [what happened in one sentence]
Evidence: [what evidence was received and at what quality level]
State: [current state of the work item after this action]
Required next: [what must happen before this item can progress further]
Owner: [who is responsible for the next action]
Promoted: [No — change to Yes after promoting to DECISION_LOG.md]
---

-->

No buffer entries. This buffer is clean.

---

## Promotion Protocol

When promoting an entry to DECISION_LOG.md:
1. Copy the full entry
2. Add it to DECISION_LOG.md with a timestamp and the note "Promoted from working buffer"
3. Mark it as `Promoted: Yes` here
4. At session end, all promoted entries can be cleared from this file

---

## Staleness Alert

Any buffer entry older than 24 hours that has not been promoted is stale.
Stale entries must be promoted on the next session start, before any new governance actions begin.
