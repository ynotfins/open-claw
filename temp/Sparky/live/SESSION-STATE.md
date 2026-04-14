# SESSION-STATE.md — Active Working Memory

This file is Sparky's active working memory for the current session.
It is written to after every governance action that changes state.
It is read at the start of every session and after every context reset.

Chat history is a buffer. This file is storage.
If it matters for the next governance action, it is here.

---

## Active Work Items

<!-- Format per item:
WorkItemID: [ID]
State: pending | in_review | blocked | approved | released | rolled_back
RiskLevel: low | medium | high | critical
TrustLevel: T0 | T1 | T2 | T3 | T4
Owner: [name]
LastAction: [what Sparky last did with this item]
BlockingConditions: [list if blocked; empty if not]
OpenEscalations: [list if any; empty if none]
LastUpdated: [ISO timestamp]
-->

No active work items recorded. (Update this section as items enter governance.)

---

## Open Escalations

<!-- Format per escalation:
EscalationID: [ID]
WorkItemID: [associated item]
Trigger: [trigger name from ESCALATION_RULES.md]
RequiredResolver: [who must resolve]
State: OPEN | ROUTED | RESOLVED | CLOSED | UNRESOLVED
OpenedAt: [ISO timestamp]
-->

No open escalations. (Update this section when escalations are raised.)

---

## Tool Availability Status

| Tool | Status | Last Checked | Degraded Mode Active? |
| --- | --- | --- | --- |
| GitHub MCP | Unknown | — | — |
| Context7 MCP | Unknown | — | — |
| Firestore MCP | Unknown | — | — |
| OpenClaw integration | Unvalidated | — | Yes — treat all OpenClaw paths as unverified |

Update this table when tools are confirmed available or degraded this session.

---

## Session Context

Session started: [ISO timestamp — update at session start]
Operating environment: Formula One AI Factory
Active branch: sparky
Sparky version: 3.1.0
Recovery session: [Yes/No — set to Yes after compaction recovery]
Prior working buffer promoted: [Yes/No]

---

## Working Buffer

Use this section to capture governance details before committing to DECISION_LOG.md.
Entries here are in-flight. They must be promoted to DECISION_LOG.md before session closes.

<!-- Format per buffer entry:
[TIMESTAMP] [WORK_ITEM_ID] [ACTION_TYPE]
Summary: what happened
Evidence: received and quality
State: current item state
Required next: what must happen before this item progresses
Owner: who owns next action
-->

No uncommitted buffer entries. (Add entries here as governance actions occur during this session.)

---

## Notes and Flags

Any session-specific observations, anomalies, or flags that do not yet fit a formal record:

- OpenClaw integration paths are documented but not integration-tested. Do not assume OpenClaw is wired.
- Context7 has shown connector instability. If retrieval fails, note it here and apply degraded-mode evidence quality.
- schema.ts was significantly expanded in v3.0.0. agent.ts alignment audit is pending — new schema fields may not all be consumed.

---

## Promotion Checkpoint

Before ending a session or approaching context limits:

1. [ ] All significant governance decisions are in DECISION_LOG.md
2. [ ] All work item states are current in this file
3. [ ] All open escalations are recorded with their current state
4. [ ] Tool availability status is current
5. [ ] Working buffer has no entries older than this session that haven't been promoted

If any box is unchecked when context limits approach: promote immediately. Do not wait.
