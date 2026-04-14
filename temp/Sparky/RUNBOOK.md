# RUNBOOK.md

## Purpose

This runbook provides step-by-step operating procedures for the most common and highest-risk governance scenarios.
Runbook steps are deterministic: follow them in order, do not skip steps, record each action.

The runbook is the operational implementation of the workflows defined in `WORKFLOWS.md`.
Where WORKFLOWS.md provides the structure, this runbook provides the hands-on procedure.

---

## RUN-01: Standard PR Governance

**Trigger:** A pull request is submitted for Sparky evaluation.

**Procedure:**

**Step 1 — Intake Validation**
- Verify objective is present and scoped
- Verify owner is named
- Verify at least one artifact (diff, spec, or equivalent) is present
- Verify requested action is declared
- If any field is missing: issue `DEFER` with specific missing fields listed. Stop.

**Step 2 — Risk Classification**
- Independently classify the PR: work type, risk class, system surface, change posture
- Compare against submitter's declared risk class
- If Sparky's classification is higher: apply higher requirements; inform submitter
- Record classification in governance trace

**Step 3 — Routing Verification**
- Identify required specialist lanes for the classification
- Verify that each required lane has a completed review or is being requested
- If a required lane is missing: issue `BLOCK` naming the missing lane. Record in trace.

**Step 4 — Evidence Evaluation**
- Retrieve all attached evidence artifacts
- Validate version anchors
- Rate each artifact (strong / sufficient / partial / weak / absent)
- Identify which claims lack adequate evidence

**Step 5 — Drift Assessment**
- Review diff for spec drift, code drift, behavior drift
- Classify each finding by severity
- Record findings in governance trace

**Step 6 — Rollback Assessment** (medium risk and above)
- Check for rollback plan
- Verify rollback plan has action, trigger, owner
- If absent or incomplete: issue `REQUIRE_MORE_EVIDENCE`

**Step 7 — Decision**
- Compile evaluation results
- Assign trust level based on evidence quality
- Issue one of: `ALLOW`, `BLOCK`, `ESCALATE`, `DEFER`, `REQUIRE_MORE_EVIDENCE`
- Format output per the decision format in `PR_RULES.md`

**Step 8 — Record**
- Write governance trace entry before issuing decision
- Update Session State with new work item state
- Update Decision Log with final outcome

**Expected Duration:** Varies by complexity. Do not compress Steps 4–6 to save time.

**Failure Path:** If at any step evidence is contradictory or classification cannot be completed with confidence, escalate before proceeding.

---

## RUN-02: Merge Gate Evaluation

**Trigger:** A PR in `approved` state requests merge authorization.

**Procedure:**

**Step 1 — Re-read the Prior Review Record**
- Retrieve the governance trace for this work item
- Confirm all prior gate steps were completed
- Confirm no new commits have been added since the prior review

**Step 2 — Check for New Commits**
- If new commits exist since approval: re-evaluate from RUN-01 Step 4 (evidence evaluation) for the new commits
- Prior approval does not cover subsequent changes

**Step 3 — Verify Risk Class and Trust Level**
- Confirm current trust level meets minimum for risk class (see `MERGE_POLICY.md`)
- Confirm evidence quality still meets the threshold for the trust level

**Step 4 — Verify All Blocking Conditions Resolved**
- Review all prior blocking conditions
- Confirm each has a resolution record with evidence
- If any blocking condition lacks a resolution: issue `BLOCK` again with that condition listed

**Step 5 — Issue Merge Decision**
- If all conditions are met: issue `ALLOW` with full merge approval format
- Record in Decision Log and Session State

**Step 6 — Post-Merge Record**
- After merge occurs: update work item state to `merged`
- Record merge timestamp, entity, and trace ID

---

## RUN-03: Release Gate Evaluation

**Trigger:** A release candidate is submitted for release authorization.

**Procedure:**

**Step 1 — Release Scope Verification**
- Enumerate all changes included in the release
- Confirm each change has a completed merge gate record
- If any change lacks a merge gate record: issue `BLOCK`

**Step 2 — Rollback Plan Verification**
- Retrieve rollback plan
- Verify: action, trigger, owner
- If rollback plan is "revert the commit": issue `REQUIRE_MORE_EVIDENCE` with expansion requirements

**Step 3 — Blast Radius Assessment**
- Retrieve blast radius documentation
- Verify it enumerates specific affected subsystems and user flows
- If blast radius is asserted without analysis: issue `REQUIRE_MORE_EVIDENCE`

**Step 4 — Observability Verification**
- Confirm monitoring or alerting expectation is declared
- Verify the expectation is specific enough to detect a failure

**Step 5 — Unresolved Risk Review**
- Retrieve list of all known open risks
- Verify each is named, owned, and risk-accepted
- If any critical or high-severity unresolved issue has no owner: issue `BLOCK`

**Step 6 — Issue Release Decision**
- If all conditions met: issue `ALLOW` for release with full release approval format
- Record in Decision Log

**Step 7 — Post-Release Record**
- After release: update work item state to `released`
- Record release timestamp, target environment, and trace ID

---

## RUN-04: Incident Response Coordination

**Trigger:** A production incident is declared or detected.

**Procedure:**

**Step 1 — Declare and Classify**
- Name the incident explicitly (Incident ID)
- Classify severity: SEV-1 (critical, user-affecting, data risk) / SEV-2 (significant degradation) / SEV-3 (minor, contained)
- Document blast radius at time of declaration (this will be updated)

**Step 2 — Assign Incident Commander**
- Verify an incident commander is assigned
- Incident commander owns the incident timeline; Sparky governs evidence standards and change requests during the incident

**Step 3 — Contain**
- Route containment actions to the correct specialist
- Prioritize stopping ongoing damage before diagnosing cause
- Any containment change (config change, rollback, feature flag) still requires minimum evidence:
  - Who is making the change
  - What the change is
  - What the expected effect is
  - What the rollback path is for the containment action itself

**Step 4 — Diagnose**
- Route diagnosis to the correct specialist surface
- Require evidence for root cause claims (not just assertions)
- Log all hypotheses and which ones are ruled out and why

**Step 5 — Remediation Review**
- All code or configuration changes during incident follow accelerated review:
  - One independent reviewer (not author)
  - Behavior claim verified by at least one observation
  - Rollback plan even if compressed
- Issue `ALLOW` for remediation changes that meet accelerated criteria
- Issue `BLOCK` for remediation changes that have zero evidence

**Step 6 — Resolution**
- Confirm the incident is resolved with observable evidence
- Document the blast radius at resolution (compare to declaration)
- Record timeline: detection, declaration, containment, resolution

**Step 7 — Post-Incident Requirements**
- Root cause documentation is required before incident is closed
- Follow-up governance items (preventive changes) enter the normal PR pipeline
- Incident record is committed to Decision Log

**SEV-1 Escalation:** Any SEV-1 that cannot be resolved within defined response time must be escalated to designated authority immediately.

---

## RUN-05: Escalation Handling

**Trigger:** Sparky has issued an escalation on a work item.

**Procedure:**

**Step 1 — Verify Escalation Record Is Complete**
- Confirm the escalation has: ID, trigger, conflict description, missing information, required resolver, resolution criteria
- If any field is missing: complete it before proceeding

**Step 2 — Route to Resolver**
- Send escalation to the named resolver
- Confirm the resolver has received it and has a response timeline

**Step 3 — Hold the Work Item**
- Confirm work item is in `blocked` state
- Confirm no one is attempting to advance it while escalation is open

**Step 4 — Receive and Evaluate Resolution**
- When resolver responds: verify the response addresses the specific conflict
- Verify the response is evidence-based
- If resolution is insufficient: return to ROUTED state with specific request for clarification

**Step 5 — Apply Resolution**
- Add resolution to governance trace as new evidence
- Update trust level based on new evidence
- Return work item to `in_review`
- Re-run evaluation from the affected step

**Step 6 — Close Escalation**
- Record: resolution input, resolver identity, resolution timestamp
- Update escalation state to CLOSED
- Continue governance cycle

---

## RUN-06: Context Reset Recovery

**Trigger:** Session has been reset or context has been compacted; prior state is unavailable.

**Procedure:**

**Step 1 — Read Session State File**
- Read `live/SESSION_STATE.md`
- Identify all active work items and their recorded states

**Step 2 — Read Decision Log**
- Read recent entries in `DECISION_LOG.md`
- Identify any decisions made but not yet acted on

**Step 3 — Read Working Buffer**
- Read `live/working-buffer.md`
- Identify uncommitted entries

**Step 4 — Promote Uncommitted Entries**
- For each working buffer entry not in the Decision Log: promote to Decision Log with an amendment note

**Step 5 — Re-establish Active States**
- List all work items in non-terminal states (pending, in_review, blocked)
- For each: confirm current state against Decision Log and Session State
- If states conflict: Decision Log takes priority over Session State

**Step 6 — Resume**
- For items in `blocked` state: verify blocking conditions are still outstanding
- For items in `in_review` state: determine where they were in the evaluation sequence and resume
- For items in `approved` state: confirm approval record exists; do not re-approve without re-reading the trace

**Do Not:**
- Assume all items are clean
- Assume no blocks exist
- Default to approving items that have no state record
- Issue any ALLOW without retrieving the prior governance state

---

## RUN-07: Drift Correction Cycle

**Trigger:** Drift has been detected at Medium, High, or Critical severity.

**Procedure:**

**Step 1 — Classify the Drift**
- Name the specific drift: spec drift, code drift, behavior drift, governance drift
- Assign severity: Critical / High / Medium
- Document: where the drift is, what the correct state should be, what the current diverged state is

**Step 2 — Assign Owner**
- Identify the specialist responsible for correcting the drift
- Confirm they have accepted ownership

**Step 3 — Block if Required**
- Critical or High drift: block any merge on the affected scope until corrected or exception escalated
- Medium drift: flag; require documentation and owner before merge

**Step 4 — Track Correction**
- Monitor the correction PR separately from the original work item
- Apply full governance to the correction PR

**Step 5 — Verify Resolution**
- Retrieve correction evidence
- Verify the drift has been corrected (spec now matches implementation, or exception is formally documented)
- Update governance trace with resolution

**Step 6 — Unblock**
- After drift correction is merged: lift the drift-related block on the original work item
- Continue governance cycle for the original work item
