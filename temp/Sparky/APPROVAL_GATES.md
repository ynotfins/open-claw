# APPROVAL_GATES.md

## Purpose

This file defines the specific gate criteria for each stage in the governance pipeline.
Gates are not suggestions. A stage gate is satisfied or it is not.
Partial satisfaction is a failed gate unless the gate definition explicitly allows conditional passage.

Gates are stage-specific. Passing a prior stage gate does not carry over to the next stage unless explicitly stated.

## Gate Architecture

### Stage Sequence

```
INTAKE_GATE → ROUTING_GATE → REVIEW_GATE → MERGE_GATE → RELEASE_GATE
```

Each gate is a checkpoint.
Work cannot advance to the next stage until the current gate is satisfied.
A gate failure produces a specific outcome: `BLOCK`, `DEFER`, or `REQUIRE_MORE_EVIDENCE`.
No gate failure produces `ALLOW` at that stage.

---

## Gate 1: Intake Gate

### Purpose
Verify that the work item is governable before it enters the evaluation pipeline.
Reject malformed, ambiguous, or ownership-absent items before consuming review resources.

### Required Fields

| Field | Requirement | Missing Response |
| --- | --- | --- |
| Objective | Non-empty, specific, scoped | `DEFER` |
| Owner | Named individual or agent | `DEFER` |
| Work type | Declared (code/review/architecture/infrastructure/release/incident/documentation/mixed) | `DEFER` |
| Artifact | At least one inspectable artifact (diff, spec, issue, or equivalent) | `DEFER` |
| Requested action | Declared (review/approve/merge/release/rollback/route) | `DEFER` |

### Gate Failure Response

`DEFER` — item is not ready for governance processing.
Return to submitter with specific missing fields listed.
Do not open review lanes.
Do not open approval paths.

### Gate Bypass Attempt Response

If an item is attempting to bypass intake and proceed directly to merge or release:
- Issue `BLOCK`
- Record the bypass attempt as AP-03 anti-pattern
- Require full intake completion before any further action

---

## Gate 2: Routing Gate

### Purpose
Confirm that the work item has been classified and routed to the correct specialist surfaces.
A mis-routed item may be approved by the wrong reviewer and still fail the system.

### Required Conditions

| Condition | Requirement | Missing Response |
| --- | --- | --- |
| Classification complete | Work type, risk class, system surface, change posture all assigned | `ESCALATE` if ambiguous, recompute if recoverable |
| Required specialists identified | Each surface has a named specialist lane | `BLOCK` if a specialist is missing |
| Routing plan recorded | Routing decision is in the governance trace | Cannot advance without trace entry |
| Self-certification check | Author is not the sole approver unless explicitly allowed by risk class | `BLOCK` |

### Routing Failure Scenarios

**Scenario A: Architecture-sensitive work routed only to code review**
- Action: Reclassify and re-route to architecture review surface
- State: Return to `in_review`
- Evidence: Architecture specialist note required before merge gate

**Scenario B: Security-sensitive work routed through standard code review**
- Action: Block. Route to security review surface.
- State: `blocked`
- Evidence: Security specialist clearance required before any further advancement

**Scenario C: Mixed-surface work treated as single-lane**
- Action: `REQUIRE_MORE_EVIDENCE` for the missing surface
- State: `in_review` for all lanes simultaneously
- Evidence: Each surface must produce independent specialist output

---

## Gate 3: Review Gate

### Purpose
Confirm that specialist review has been completed with adequate evidence for each required lane.
Review gate must be passed before the merge gate can open.

### Required Conditions by Work Type

#### Code Change

| Requirement | Minimum |
| --- | --- |
| Tests | Relevant tests for the changed behavior |
| Code review | At least one independent reviewer who is not the author |
| Behavior claim | Verified by test or runtime observation |
| Diff scope | Matches stated objective |
| Drift check | Completed; findings documented |

#### Architecture Change

| Requirement | Minimum |
| --- | --- |
| Architecture review | Architecture specialist sign-off |
| Interface contracts | Unchanged or explicitly migrated |
| Dependency impact | Assessed and documented |
| Migration risk | Named with owner |

#### Infrastructure Change

| Requirement | Minimum |
| --- | --- |
| DevOps review | DevOps specialist sign-off |
| Rollback plan | Defined with action, trigger, owner |
| Blast radius | Assessed and documented |
| Configuration review | All changed configuration values reviewed |

#### Release Candidate

All of the above, plus:

| Requirement | Minimum |
| --- | --- |
| Release scope | All included changes listed |
| Rollback plan | Covers the full release scope |
| Observability | Monitoring expectation declared |
| Unresolved risk list | All known open risks named and owned |

### Review Gate Failure Response

- Missing test evidence → `REQUIRE_MORE_EVIDENCE` with specific test gap listed
- Missing specialist sign-off → `BLOCK` with required specialist named
- Conflicting specialist conclusions → `ESCALATE`
- Drift detected but undocumented → `BLOCK` if high/critical; `REQUIRE_MORE_EVIDENCE` if medium

---

## Gate 4: Merge Gate

### Purpose
The merge gate is the final evidence check before code enters the main branch.
Merge gate passage certifies that the change has crossed all prior gates with adequate evidence for its risk class.

### Trust Level Requirement

| Risk Class | Minimum Trust Level for Merge |
| --- | --- |
| Low | T3: Governable |
| Medium | T3: Governable |
| High | T4: Fully Trusted |
| Critical | T4: Fully Trusted + Escalation Sign-off |

### Required Conditions

| Condition | Low Risk | Medium Risk | High Risk | Critical |
| --- | --- | --- | --- | --- |
| Intake gate passed | Required | Required | Required | Required |
| Routing gate passed | Required | Required | Required | Required |
| Review gate passed | Required | Required | Required | Required |
| Evidence quality | Sufficient | Sufficient | Strong | Strong |
| Independent reviewer | 1 | 1 | 2 | 2+ escalation sign-off |
| Rollback plan | If release-path | Required | Required | Required |
| Drift cleared | Required | Required | Required | Required |
| Governance trace | Required | Required | Required | Required |
| Open critical issue | None | None | None | None |

### Merge Gate Failure Response

Any failing condition produces `BLOCK`.
The block must list every failing condition precisely.
The block is not lifted until every listed condition is resolved with evidence.
Re-evaluation is mandatory before the merge gate is reopened.

### Merge Gate Override Attempt

There is no valid override path for the merge gate under normal operations.
Incident conditions have their own accelerated path (see `WORKFLOWS.md` Incident Response Workflow).
Even incident-accelerated merges require minimum evidence — they do not have zero requirements.
Any attempt to override merge gate outside declared incident conditions is AP-03 (Gate Bypass via Urgency) and is blocked.

---

## Gate 5: Release Gate

### Purpose
The release gate certifies that a change or set of changes is safe to deploy to production (or its equivalent operational environment).

Release gate is separate from merge gate.
Merge gate passage does not imply release authorization.

### Required Conditions

| Condition | Requirement |
| --- | --- |
| Merge gate | Passed for all included changes |
| Rollback plan | Complete (action + trigger + owner) |
| Blast radius | Documented |
| Observability | Monitoring or alerting expectation declared |
| Unresolved risks | All known open risks named, owned, and risk-accepted |
| Deployment window | Declared or confirmed |
| Production configuration | All configuration changes reviewed |
| Smoke test or equivalent | Required for changes with user-visible behavior impact |

### Release Gate Failure Response

`BLOCK` with specific failing conditions listed.
No partial release for items with open gate failures.
If a subset of the release is safe and a subset is not, split the release to isolate the unsafe portion.

### Release Blocking Scenarios

**Scenario A: Rollback plan says "revert the commit"**
- This is not a complete plan. Require: who decides to revert, under what conditions, how quickly, what the command is.
- Issue: `REQUIRE_MORE_EVIDENCE`

**Scenario B: CI is green but no behavior-specific tests exist**
- CI passing is a build gate, not a behavior gate.
- Require: evidence that the changed behavior was tested in the relevant risk scenario.
- Issue: `REQUIRE_MORE_EVIDENCE`

**Scenario C: Blast radius is "minimal" without supporting analysis**
- "Minimal" is an assertion, not evidence.
- Require: specific affected subsystems and user paths enumerated.
- Issue: `REQUIRE_MORE_EVIDENCE`

**Scenario D: Unresolved high-severity issue with no owner**
- Issue: `BLOCK`
- All high-severity and critical unresolved issues require named owner before release gate can open

---

## Gate Audit Requirements

Every gate evaluation must produce an audit entry that records:
- Gate name and stage
- Work item ID
- Timestamp
- Each condition evaluated (pass / fail / not applicable)
- Evidence references for passed conditions
- Missing evidence for failed conditions
- Decision outcome for the gate

Gate audit entries are immutable after creation.
Amendments require a new dated entry referencing the original.
