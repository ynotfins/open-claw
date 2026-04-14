# PROVENANCE.md

## Purpose

Provenance is the recorded origin of every decision, artifact, and claim that enters Sparky's governance system.
Provenance enables decision reconstruction: the ability of a new operator, an auditor, or Sparky itself after a context reset to trace any decision back to its source evidence without inference or improvisation.

Provenance is not optional.
A decision without provenance is a decision that cannot be trusted, audited, or corrected safely.

## What Provenance Covers

### Decision Provenance

Every governance decision issued by Sparky (ALLOW, BLOCK, ESCALATE, DEFER, REQUIRE_MORE_EVIDENCE) must have:

| Field | Requirement |
| --- | --- |
| Decision ID | Unique identifier tied to the work item and cycle |
| Work item ID | The item being governed |
| Timestamp | ISO format timestamp |
| Decision outcome | ALLOW / BLOCK / ESCALATE / DEFER / REQUIRE_MORE_EVIDENCE |
| Evidence basis | References to each piece of evidence evaluated |
| Trust level | The trust level applied and why |
| Applying rules | Which rules or gate criteria produced the decision |
| Control loop steps completed | Which steps of the control loop ran and produced what |
| Issuer | Sparky, version or session identifier |

### Evidence Provenance

Every piece of evidence referenced in a governance decision must have:

| Field | Requirement |
| --- | --- |
| Evidence ID | Unique identifier |
| Type | test / log / diff / qa / review / runtime / rollback / ownership / spec |
| Source | Where the evidence came from (system, file, agent, tool) |
| Timestamp | When it was produced |
| Relevance | Which claim it supports |
| Supports claim | Explicit claim text or reference |
| Quality rating | strong / sufficient / partial / weak |
| Artifact reference | Path, URL, or identifier for retrieval |

### Source Provenance

Every authoritative source referenced by Sparky must have its trust tier declared.
See `KNOWLEDGE_SOURCES.md` for the full source registry and `SOURCE_PRIORITY.md` for conflict resolution order.

If a source is referenced but not in the registry, it is treated as unverified.
Unverified sources may provide context but may not satisfy a gate condition.

### Artifact Provenance

Every artifact submitted for governance review must record:

| Field | Requirement |
| --- | --- |
| Artifact ID | Unique identifier |
| Type | diff / test result / log / spec / review note / rollback plan / config |
| Submitter | Who submitted it |
| Timestamp | When it was submitted |
| Version reference | Git commit, build ID, or equivalent version anchor |
| Associated work item | The work item this artifact belongs to |

## Provenance Chain

The provenance chain connects a decision back to its root evidence.

**Example provenance chain:**
```
MERGE_ALLOWED (decision)
  → PR #1234 evaluation (control loop cycle)
    → Code review by reviewer-A (evidence, quality: sufficient)
      → diff-abc123 at commit-def456 (artifact)
    → Test run CI-789 (evidence, quality: strong)
      → test suite v2.1 at commit-def456 (artifact)
    → Risk class: medium (classification)
      → Scope analysis: affects user-profile service only (basis)
    → Rollback plan by owner-B (evidence, quality: sufficient)
      → rollback-plan-v2.md at commit-def456 (artifact)
```

An auditor reading the provenance chain should be able to reconstruct the entire decision without asking Sparky.

## Provenance Failure Modes

### Gap in Evidence Chain

**Symptom:** A decision references evidence quality "sufficient" but no evidence artifact is listed.
**Impact:** The decision cannot be independently verified.
**Response:** Downgrade decision status. Require evidence artifact to be submitted and the record amended.

### Stale Evidence Reference

**Symptom:** Evidence artifact is referenced but the version anchor points to a prior commit that does not include the change being governed.
**Impact:** The evidence may not apply to the code being reviewed.
**Response:** Issue `REQUIRE_MORE_EVIDENCE`. Require fresh evidence from the current version.

### Missing Decision ID

**Symptom:** A governance decision exists in a record but has no unique identifier linking it to the trace.
**Impact:** The decision cannot be referenced in future reviews or audit.
**Response:** Assign a retroactive identifier. Note the assignment as an amendment.

### Unverified Source Cited as Gate Evidence

**Symptom:** A governance decision cites a source not in the `KNOWLEDGE_SOURCES.md` registry as satisfying a gate condition.
**Impact:** The evidence tier cannot be confirmed; the gate may be improperly passed.
**Response:** Review the source against the trust tier criteria. If it qualifies, add it to the registry. If it does not, invalidate the gate passage and re-evaluate.

### Orphaned Artifact

**Symptom:** An artifact is in the governance record but no decision references it.
**Impact:** The artifact's governance purpose is unclear.
**Response:** Trace the artifact back to the work item. If relevant, associate it with the appropriate decision. If not relevant, mark as orphaned and do not rely on it for gate evaluation.

## Provenance Storage

### Where Records Live

| Record Type | Location |
| --- | --- |
| Active session decisions | `live/SESSION_STATE.md` |
| Committed decisions | `DECISION_LOG.md` |
| Artifact registry | Referenced in the decision log entry |
| Source registry | `KNOWLEDGE_SOURCES.md` |
| Knowledge structure | `KNOWLEDGE_MAP.json` |

### Retention Rules

- Decision records are permanent. They are not deleted or overwritten.
- Amendments are additive: new dated entries that reference the original.
- Evidence artifacts must remain accessible for the lifetime of the associated decision record.
- If an evidence artifact is no longer accessible, the decision that relies on it must be flagged as having broken provenance.

## Provenance and Audit

An auditor should be able to use the provenance record to:

1. Identify every decision made during a governance cycle
2. Retrieve the evidence used to make each decision
3. Verify that the trust level matches the evidence quality
4. Confirm that the correct gate criteria were applied for the risk class
5. Confirm that blocked items had their blocking conditions explicitly resolved before advancing
6. Verify that no merge or release occurred without a completed trace

If the provenance record fails to enable any of these five steps, it is incomplete and must be corrected before the system can be considered auditable.

## Provenance and Recovery

After a session reset or context compaction, Sparky uses provenance records to reconstruct governance state.
See `MEMORY.md` for the full recovery protocol.

The recovery protocol depends on provenance being complete.
If provenance is incomplete at the time of a reset, the recovery process will produce incomplete state — which will manifest as governance gaps in the resumed session.

This is why provenance is written before decisions are issued, not after.
