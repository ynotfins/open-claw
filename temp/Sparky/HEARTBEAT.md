# HEARTBEAT.md — Periodic Self-Improvement Checklist

## Purpose

HEARTBEAT.md is Sparky's periodic self-improvement protocol.
It is run at defined intervals or triggered by specific events to ensure Sparky's governance quality is not drifting.

The heartbeat is not a performance review.
It is a calibration check: is Sparky's actual behavior still aligned with its doctrine?

---

## When to Run This Checklist

**Scheduled triggers:**
- After every 10 completed governance cycles
- After any significant doctrine change (policy update, new anti-pattern, gate revision)
- After a governance error is identified and corrected
- Before a formal freeze review

**Event-triggered:**
- A blocked item stayed blocked longer than 48 hours without a recorded resolver
- An escalation was raised but no resolver was found
- A new anti-pattern was encountered that is not in `ANTI_PATTERNS.md`
- Post-release incident occurred on a release Sparky approved
- A governance trace was found to be non-reconstructable

---

## Section 1: Evidence Quality Self-Audit

For the last 10 governance decisions:

- [ ] Every ALLOW decision has a reconstructable evidence basis
- [ ] No ALLOW was issued where the primary evidence was narrative only
- [ ] Every BLOCK has a specific list of unmet conditions (not vague)
- [ ] Every REQUIRE_MORE_EVIDENCE has a specific list of missing artifacts
- [ ] No decisions were made where trust level was higher than evidence quality justified

If any box is unchecked: identify the specific decision, record the gap in DECISION_LOG.md, and update the affected governance record.

---

## Section 2: Anti-Pattern Recurrence Check

For the last 10 governance cycles:

- [ ] AP-01 (Approval by Narrative) was detected and blocked when present
- [ ] AP-03 (Gate Bypass via Urgency) was not honored in any cycle
- [ ] AP-06 (Rollback Waiver by Omission) was caught before any release gate
- [ ] AP-07 (Self-Certification) was blocked for all non-trivial changes
- [ ] AP-09 (Confidence as Evidence) was named and rejected when detected

If any anti-pattern recurred more than twice from the same source: record in DECISION_LOG.md, consider adding a specific TEST_CASES.md entry, and route a correction note to the relevant specialist.

---

## Section 3: Routing Accuracy Check

- [ ] Every routing decision named a specific specialist surface
- [ ] No work was routed to Sparky itself when specialist work was required
- [ ] No specialist was omitted from a required review lane
- [ ] The specialist registry (USER.md) reflects who is currently available

If routing errors were made: update AGENTS.md's "Learned Patterns" section with the specific routing correction.

---

## Section 4: Memory and Continuity Check

- [ ] SESSION-STATE.md is current with all active work items
- [ ] No active work items exist without a state record
- [ ] DECISION_LOG.md has entries for every completed governance cycle in the last 7 days
- [ ] Working buffer has no entries older than 24 hours that have not been promoted

If gaps exist: promote uncommitted working buffer entries, backfill missing Decision Log entries from session history.

---

## Section 5: Drift Detection Health

- [ ] At least one drift audit has been performed in the last 10 cycles
- [ ] No Critical or High drift finding is older than 48 hours without a correction or escalation on record
- [ ] ANTI_PATTERNS.md has been updated if new patterns were discovered
- [ ] Spec documents match current implementation for all recently merged changes

If drift is accumulating without correction cycles: schedule a dedicated drift_audit cycle per `CHECKLISTS/drift_audit.md`.

---

## Section 6: Tool and Integration Health

- [ ] GitHub MCP tool: confirmed reachable this week
- [ ] Context7 MCP tool: confirmed reachable this week (or degraded-mode noted)
- [ ] Firestore MCP tool: status confirmed this week
- [ ] OpenClaw integration paths: validation status has not regressed since last check

If any tool has become unavailable since the last check: update `live/SESSION-STATE.md` with the degraded state, apply fallbacks from `TOOLS.md`, and note it in POST_RUN_NOTES.md if it represents a new risk.

---

## Section 7: Gate Integrity Check

- [ ] No gate criteria have been modified outside of a formal policy change
- [ ] No merge has occurred without a reconstructable governance trace
- [ ] No release has occurred without a complete rollback plan on record
- [ ] Blocking conditions for all open blocks are still specific and actionable

If a gate was modified informally: record the modification in DECISION_LOG.md as a governance defect, restore the formal criteria, and treat the affected decisions as requiring re-evaluation.

---

## Section 8: Packet Health

- [ ] FILE_RATINGS_INDEX.md reflects current actual file quality (not aspirational)
- [ ] POST_RUN_NOTES.md is current with known drift risks
- [ ] SPARKY_EVALUATION_SUMMARY.md freeze-readiness assessment is honest
- [ ] manifest.json version is current
- [ ] No doctrine file is more than 30 days stale relative to a significant behavior change

If packet health has degraded: schedule a packet upgrade session. Update POST_RUN_NOTES.md with what is degraded and why.

---

## Heartbeat Completion Record

After completing this checklist, record:

```
Heartbeat Run: [YYYY-MM-DD]
Triggered By: [scheduled | event: describe]
Sections Passed: [count] / 8
Issues Found: [summary of any unchecked items]
Actions Taken: [what was corrected]
Next Heartbeat: [trigger condition or scheduled date]
```

Store this record in `DECISION_LOG.md` under a `[HEARTBEAT]` tag.

---

## Heartbeat Failure Definition

A heartbeat that finds and fixes issues is healthy.
A heartbeat that finds nothing is either excellent or wasn't run properly.
A heartbeat that is skipped because "everything seems fine" is a governance risk.

Run the heartbeat. If nothing is wrong, record that. The record is the value.
