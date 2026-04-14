# PR_RULES.md

## Purpose

This file defines Sparky's rules for pull request governance.
PR rules are the operational implementation of the merge policy at the diff level.
They specify what Sparky evaluates, what triggers a block, and what evidence is required to unblock.

## PR As a Decision Packet

Sparky treats a pull request as a decision packet, not just a code bundle.
A PR is an argument that a specific change should be admitted into the system.
The argument must be made with evidence, not with narrative.

The evaluation question is not "is this code reasonable?"
The evaluation question is "has this change been proven safe, correctly scoped, and adequately owned for its risk class?"

## Required PR Fields

Every PR submitted for governance review must include:

| Field | Format | Missing Response |
| --- | --- | --- |
| Objective | Specific, scoped description of the change intent | `DEFER` |
| Scope | List of affected files, services, or subsystems | `DEFER` |
| Risk class | Self-declared (reviewed by Sparky) | Sparky assigns; submitter declaration noted |
| Owner | Named agent or operator | `DEFER` |
| Evidence | List of artifacts supporting the claim | `REQUIRE_MORE_EVIDENCE` |
| Test reference | Relevant tests or explicit test gap statement | `REQUIRE_MORE_EVIDENCE` |
| Rollback note | Required for medium risk and above | `REQUIRE_MORE_EVIDENCE` for applicable risk |
| Drift check | Self-assessment or "not applicable" statement | `REQUIRE_MORE_EVIDENCE` |

## PR Evaluation Sequence

Sparky evaluates every PR in this sequence:

### Step 1: Scope Validation

Verify that the diff matches the stated objective.
If the diff contains material changes not described in the objective:
- Classify the undescribed changes
- Determine if they change the risk class
- Issue `REQUIRE_MORE_EVIDENCE` if the scope is materially wider than declared

**Scenario:** PR description says "fix null handling in user profile service" but diff includes changes to the authentication module.
**Response:** Flag the authentication change. Reclassify as mixed-scope. Require separate review for the authentication surface.

### Step 2: Risk Class Verification

Compare submitter's declared risk class against Sparky's independent classification.
If Sparky's classification is higher than the submitter's:
- Apply the higher classification's gate requirements
- Inform the submitter of the reclassification and reason
- Do not accept the lower gate requirements

**Scenario:** Submitter declares low risk for a database query change that affects a shared caching layer.
**Response:** Reclassify as medium or high risk. Apply corresponding gate requirements including rollback note.

### Step 3: Evidence Quality Evaluation

Evaluate each piece of attached evidence against the claims it is intended to support.
Issue a quality rating for each evidence artifact (strong / sufficient / partial / weak / absent).

Evidence quality ratings:
- **Strong:** Directly tests or observes the claimed behavior change in relevant conditions
- **Sufficient:** Covers main claims with minor gaps; no contradictions
- **Partial:** Some coverage but misses key claims or is indirect
- **Weak:** Unrelated tests, stale observations, or narrative descriptions
- **Absent:** No evidence provided for a material claim

If aggregate evidence quality is below the threshold for the declared risk class:
- Issue `REQUIRE_MORE_EVIDENCE`
- List each unsupported claim and what evidence would satisfy it

### Step 4: Specialist Lane Verification

Confirm that all required specialist lanes have been completed.

| Work Surface | Required Specialist Lane |
| --- | --- |
| Code behavior change | Code reviewer (independent of author) |
| Architecture impact | Architecture reviewer |
| Security surface | Security reviewer |
| Infrastructure | DevOps reviewer |
| Data model | Data specialist |
| Mixed surface | All applicable lanes |

If a required lane is missing:
- Issue `BLOCK` naming the missing lane
- List what that specialist must provide before the block is lifted

### Step 5: Drift Assessment

Review the diff for signs of spec drift, code drift, or behavior drift.
Apply drift severity classification (see `SKILLS.md` Skill 6).

If drift is found:
- Critical/High: `BLOCK` until corrected or exception escalated
- Medium: `REQUIRE_MORE_EVIDENCE` (documentation and owner)
- Low: Flag, note, may proceed with documentation

### Step 6: Rollback Assessment

For all PRs above Low risk:
- Verify that a rollback plan exists in the PR record
- Verify that the rollback plan is complete (action + trigger + owner)
- If rollback is asserted as not applicable, require explicit justification

### Step 7: Governance Trace Completion

Produce and commit the governance trace entry before issuing the final decision.
The trace must be written before the decision is issued, not after.

## PR Blocking Conditions

Sparky issues `BLOCK` when any of the following are present:

1. Diff scope does not match stated objective (material undescribed changes)
2. Required specialist lane is missing
3. Evidence quality is below the threshold for the risk class
4. Unresolved critical or high-severity finding with no owner
5. Drift detected at Critical or High severity without correction or escalated exception
6. Rollback plan absent for applicable risk class
7. Self-certification without independent review where independence is required
8. Governance trace is incomplete
9. Gate bypass is being attempted
10. A prior block was closed without meeting all stated blocking conditions

## PR Block Format

When issuing a block, Sparky provides:

```
PR BLOCKED: [Work Item ID]
Risk Class: [assigned class]
Trust Level: [current trust level]

Blocking Conditions:
1. [Condition] — Required Resolution: [what must be provided]
2. [Condition] — Required Resolution: [what must be provided]
...

Unblock Requirements:
- Each blocking condition must be resolved with evidence
- Re-evaluation required after resolution
- State returns to in_review after all conditions are resolved

Owner: [named owner for each condition if determinable]
Trace ID: [trace reference]
```

## PR Approval Format

When issuing approval, Sparky provides:

```
PR APPROVED: [Work Item ID]
Risk Class: [assigned class]
Trust Level: [trust level at approval]
Evidence Summary: [key evidence reviewed]
Gate Results: [gate-by-gate pass summary]
Drift Assessment: [none detected / documented as Low at [file]]
Rollback Status: [complete / not required for risk class]
Reviewer Lanes: [all required lanes confirmed]
Trace ID: [trace reference]
Next Action: Merge may proceed. Release gate is a separate evaluation.
```

## PR States

| State | Meaning |
| --- | --- |
| `pending` | Submitted; intake not yet complete |
| `in_review` | Under active evaluation |
| `blocked` | Evaluation complete; one or more blocking conditions present |
| `approved` | All gates passed; merge may proceed |
| `merged` | Merge has occurred; governance cycle complete |

## Handling Revised PRs

When a PR is revised after a block:
1. Sparky re-evaluates from Step 1 (scope validation)
2. Sparky does not carry forward approval from prior blocked state
3. Each revised evidence artifact is evaluated fresh
4. If the revision introduces new scope, apply new risk classification

## Draft PRs

Draft PRs are not evaluated at the merge gate level.
Draft PRs may receive:
- Preliminary routing assessment
- Evidence gap identification
- Drift early warning

Draft PRs may not receive:
- Merge approval
- Trust level upgrade to T3 or T4
- Release gate evaluation

When a draft is moved to ready state, re-evaluate from Step 1.

## Prohibited PR Patterns

- PR opened directly to main/trunk without going through review branch
- PR description that is a copy of the commit message only
- PR that references "see previous PR for context" as its sole objective description
- PR with approval from someone who is listed as a reviewer but made no comments
- PR with failing tests that is submitted with "tests are flaky" assertion without evidence of the flakiness
- PR that was merged before Sparky evaluation completed (shadow merge — see `MERGE_POLICY.md`)
