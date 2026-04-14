# MERGE_POLICY.md

## Purpose

This file defines the authoritative merge policy for all work items governed by Sparky.
Merge policy governs when, under what conditions, and by what process a change may transition from approved to merged.

Merge is a one-way state transition with system-wide consequences.
The merge policy is therefore the strongest gate in the pre-release pipeline.

## Merge Authorization Model

### Who Can Authorize Merge

Sparky is the sole authorized merge gate authority for all governed work items.

Specialists may request merge. They may not self-authorize merge.
Humans with deployment authority may merge after Sparky clearance.
No agent may force a merge that has not cleared all merge gate conditions.

### What Merge Authorization Means

A Sparky merge authorization means:
1. All prior stage gates have been evaluated and passed
2. Evidence quality meets the threshold for the risk class
3. Trust level is at the required minimum for the risk class
4. All blocking conditions have been resolved with evidence
5. A governance trace exists and is reconstructable
6. The state transition has been recorded

Merge authorization is stage-specific and risk-class-specific.
Authorizing a merge for a low-risk change does not authorize a subsequent high-risk change on the same branch.

## Merge Criteria by Risk Class

### Low Risk

**Definition:** Changes with isolated impact, no user-visible behavior change, no production data effect, no infrastructure modification.

**Examples:** Documentation updates, internal variable renames, comment corrections, test utilities.

**Requirements:**
- Intake gate passed
- At least one reviewer who is not the author (may be lightweight)
- Relevant tests exist or an explicit test gap statement is provided
- No drift detected or drift is documented at Low severity
- Governance trace exists

**Prohibited:**
- Merging without any review
- Merging while a drift flag is open without documentation

---

### Medium Risk

**Definition:** Changes with localized behavior impact, limited user-visible changes, single-service scope, no critical path modification.

**Examples:** Feature additions to non-critical flows, refactors within defined boundaries, API endpoint additions with backward compatibility.

**Requirements:**
- All Low Risk requirements
- Independent code reviewer sign-off (specialist, not author)
- Behavior-relevant tests passing
- Rollback path described if the change introduces new user-visible state
- No unresolved medium or higher severity issues
- Evidence quality: Sufficient (see `SKILLS.md`)

**Prohibited:**
- Merging with only the author's review
- Merging with "tests will follow" justification
- Merging with unresolved medium or higher findings

---

### High Risk

**Definition:** Changes affecting core system behavior, cross-service interfaces, authentication/authorization, data models, or critical user flows.

**Examples:** Auth system changes, database schema migrations, API contract breaking changes, payment flow modifications.

**Requirements:**
- All Medium Risk requirements
- Two independent reviewer sign-offs
- Security review sign-off if authentication, authorization, or data exposure is involved
- Architecture review sign-off if interface contracts or system design is affected
- Rollback plan required (action, trigger, owner)
- Trust level T4 required
- Evidence quality: Strong
- Blast radius documented
- No unresolved high or critical issues

**Prohibited:**
- Merging with fewer than two independent reviewers
- Merging without security review when security surface is involved
- Merging without architecture review when interface contracts change
- Merging without a rollback plan

---

### Critical Risk

**Definition:** Changes with system-wide impact, production data migration risk, security surface modification, or multi-service breaking changes.

**Examples:** Infrastructure migrations, auth architecture overhauls, encryption changes, multi-tenant isolation changes.

**Requirements:**
- All High Risk requirements
- Two specialist reviewers in each affected domain
- Escalation sign-off from designated authority
- Staged rollout plan or equivalent risk isolation strategy
- Explicit risk acceptance documentation by a named owner
- Rollback plan validated (not just declared)
- Trust level T4 required with explicit escalation clearance
- Post-merge monitoring plan declared

**Prohibited:**
- Merging without escalation sign-off
- Merging without validated rollback
- Merging without a named risk owner
- Merging without a post-merge monitoring plan

---

## Merge Gate Failure Handling

### When Gate Fails

1. Issue `BLOCK` with every failing condition listed precisely
2. State the exact evidence or action that would resolve each condition
3. Assign each blocking condition to an owner
4. Set work item state to `blocked`
5. Record in governance trace

### When Block Is Challenged

If a submitter claims the block conditions are incorrect:
1. Re-evaluate the specific conditions that are challenged
2. If new evidence is provided, re-run evaluation
3. If the challenge is a request to lower standards: apply LIMIT-04 (No Gate Modification Under Pressure)
4. Record the challenge and the response

### When Block Conditions Are Met

1. Require explicit resolution evidence for each condition
2. Re-evaluate the full gate (not just the resolved conditions)
3. Update trust level based on new evidence
4. If gate is now satisfied, issue `ALLOW` for merge
5. Record the resolution path in the governance trace
6. Update state from `blocked` to `approved`

---

## Merge Anti-Patterns (Specific to This Policy)

### Incremental Merge Bypass
Work that was blocked as a whole is split into smaller PRs to pass under lower risk thresholds.
Detection: Same functional scope, same author, submitted shortly after block.
Response: Classify at the original aggregate risk level; apply original gate requirements.

### Review Laundering
Required reviewers are listed as approvers but have not actually reviewed the diff.
Detection: Review approval timestamp precedes diff last-updated timestamp; approval without any review comment.
Response: Invalidate the review; require fresh review from qualified independent reviewer.

### Merge After Drift
Work is merged after drift was detected but before the drift correction was submitted.
Detection: Drift flag exists in governance trace without a resolution entry.
Response: Block the merge retroactively; require drift correction or explicit documentation before any subsequent merge on the same scope.

### Shadow Merge
Work is merged via a method that bypasses Sparky's gate evaluation (direct push, admin override).
Detection: Commit appears in history without a governance trace entry.
Response: Flag as governance defect; require retroactive review; escalate to designated authority; record as policy violation.

---

## State Machine for Merge

```
approved → [merge gate evaluation] → merged (if gate passes)
                                   → blocked (if gate fails)
blocked  → [resolution submitted]  → in_review (if all conditions resolved)
in_review → [re-evaluation]        → approved (if gate passes on re-evaluation)
```

No approved item may merge without a completed merge gate evaluation.
No blocked item may merge without returning to `in_review` first.
`merged` is a terminal state. Corrections after merge require a new governed work item.

---

## Audit Requirements

Every merge event must be associated with:
- Work item ID
- Trace ID
- Governance record with all gate results
- Risk class assigned
- Trust level at time of merge
- All reviewer identities
- All evidence references
- Timestamp of merge authorization
- Name of entity that executed the merge

If any of these are missing, the merge is recorded as a governance defect regardless of whether the code change was correct.
