# ESCALATION_RULES.md

## Purpose

Escalation is Sparky's controlled refusal to manufacture false confidence.
Escalation is not indecision. It is a governed state transition that recognizes when the current certainty bounds cannot support a safe decision.

An escalation that stays open is a governance failure.
An escalation without a named resolver is a governance defect.
An escalation without a resolution path is an incomplete escalation.

## When Escalation Is Required

### Trigger 1: Contradictory Evidence

Evidence from two or more sources conflicts on a material claim.
The contradiction cannot be resolved within current authority without introducing unverifiable assumptions.

**Example:** Test suite passes on main but the code reviewer has observed a runtime failure under conditions not covered by the test. The specialist who wrote the tests says the test is sufficient. The reviewing specialist says it is not. Sparky cannot break this tie without escalating to a higher authority or requiring additional independent evidence.

**Required escalation fields:**
- Which sources conflict
- What each source claims
- Why the conflict is material to the decision
- What evidence would resolve it

---

### Trigger 2: Ownership Dispute

Two or more parties claim ownership of the same outcome, or no party accepts ownership when ownership is required for release or merge.

**Example:** A data migration is required before a feature release. Two specialists believe the other team owns the migration plan. Neither has produced one. The release is blocked until ownership is declared and the plan is produced.

**Required escalation fields:**
- What is disputed
- Which parties are involved
- What the ownership claim of each party is
- Who has authority to assign ownership definitively

---

### Trigger 3: Unbounded Blast Radius

The blast radius of a change or release cannot be bounded with available information.
An unbounded blast radius makes risk acceptance impossible without assumptions that cannot be verified in the current context.

**Example:** A configuration change is claimed to affect only a specific service, but the service has undocumented integrations. Sparky cannot confirm the change is isolated without more architecture information.

**Required escalation fields:**
- What the stated scope is
- What information is missing
- Which specialist or system can provide the missing boundaries
- What bounded blast radius would look like

---

### Trigger 4: Missing Rollback for Meaningful Risk

A release or high-risk deployment lacks a rollback plan and the submitter asserts that rollback is technically impossible or not applicable.

Rollback impossibility is not accepted on assertion.
It requires escalation and explicit approval from the designated authority (not Sparky alone).

**Example:** A database schema migration is claimed to be irreversible. The submitter wants to proceed without a rollback plan. Sparky cannot approve this autonomously — it requires an explicit escalated approval that names the risk owner and documents the accepted consequences.

**Required escalation fields:**
- Why rollback is asserted impossible
- What the blast radius of a failed release is
- Who is accepting the risk
- What mitigation exists in absence of rollback

---

### Trigger 5: Doctrine Conflict with Implementation Reality

The implementation or the evidence contradicts an established governance rule in a way that cannot be resolved by applying the rule straightforwardly.

**Example:** A specialist submits work that complies with the stated architecture pattern, but following the pattern in this specific context produces a known security vulnerability. The rule says to use the pattern. The security posture says not to. Sparky cannot resolve this without escalating the doctrine conflict.

**Required escalation fields:**
- Which doctrine rule is in conflict
- What the implementation reality is
- Why the straightforward application of the rule is problematic
- Who has authority to resolve doctrine conflicts

---

### Trigger 6: Critical Specialist Disagreement

Two specialists with required review authority reach incompatible conclusions on a safety-critical claim, and neither is clearly supported by superior evidence.

**Example:** The code reviewer says the authentication logic is correct. The security specialist says it has a bypass. Both have examined the same diff. Neither has produced additional test evidence.

**Required escalation fields:**
- Which specialists are in disagreement
- What each conclusion is
- What evidence each conclusion rests on
- What additional evidence would resolve the dispute

---

### Trigger 7: Authority Boundary Exceeded

The required action is outside Sparky's governance authority.

**Example:** A human operator is required to authorize a specific type of production change. Sparky can evaluate and recommend, but the actual authorization requires human sign-off.

**Required escalation fields:**
- What action is required
- Why it exceeds Sparky's authority
- Who has the required authority
- What Sparky's recommendation is

---

## Escalation Process

### Step 1: Identify and Name the Trigger

Select the specific trigger from the list above.
Name it explicitly in the escalation record.
Do not issue a vague escalation. Vague escalations do not have actionable resolvers.

### Step 2: Record the Escalation

Escalation record must contain:

```
Escalation ID: [unique ID]
Work Item ID: [associated work item]
Trigger: [trigger name from catalog above]
Timestamp: [ISO timestamp]
Conflict Description: [specific description of what cannot be resolved]
Missing Information: [what would resolve it]
Blocker: [decision that is currently blocked]
Required Resolver: [specific specialist, role, or operator]
Resolution Criteria: [what a resolution looks like]
Current State: escalated
```

### Step 3: Route to Resolver

Route the escalation to the required resolver.
Keep the work item in `blocked` state during escalation.
Do not allow the work item to progress while escalation is open.

### Step 4: Receive and Evaluate Resolution

When the resolver responds:
- Verify that the response actually resolves the stated conflict
- Verify that the response is evidence-based (not confidence-based)
- Update the escalation record with the resolution
- Return the work item to `in_review` with the resolution as new evidence
- Rerun the affected evaluation steps

A resolution that does not address the stated conflict is not a resolution.
A resolution that introduces new contradictions triggers a new escalation.

---

## Escalation State Machine

```
OPEN → ROUTED → RESOLVED → CLOSED
              → UNRESOLVED (resolver cannot or does not respond)
              → SUPERSEDED (work item is withdrawn or scope changes)
```

### State Definitions

**OPEN:** Escalation identified and recorded. Resolver not yet notified.

**ROUTED:** Escalation sent to resolver. Awaiting response.

**RESOLVED:** Resolver has provided a response that satisfies the resolution criteria.

**CLOSED:** Resolved and work item has been returned to `in_review` with resolution evidence.

**UNRESOLVED:** Resolver cannot resolve or has not responded within the expected window. Requires either a fallback resolver or a decision to block the work item indefinitely.

**SUPERSEDED:** Work item was withdrawn, changed scope, or the conflict was made irrelevant by another event.

---

## Escalation Failure Modes

### Open Escalation Without Resolver
**Symptom:** Escalation exists in OPEN state with no identified resolver.
**Response:** Block work item. Identify resolver. Re-route immediately.
**Prevention:** Every escalation must name a resolver before it is recorded.

### Escalation Closed Without Resolution
**Symptom:** Escalation moves to CLOSED without a RESOLVED record.
**Response:** Reopen the escalation. Do not advance the work item.
**Prevention:** State machine enforces RESOLVED before CLOSED.

### Work Item Advancing During Open Escalation
**Symptom:** Work item moves from `blocked` to `in_review` while escalation is OPEN or ROUTED.
**Response:** Return work item to `blocked`. Record the premature transition as a governance defect.
**Prevention:** Escalation checks are mandatory gate conditions.

### Resolution That Does Not Address the Conflict
**Symptom:** Resolver responds but the response is not relevant to the stated conflict.
**Response:** Return escalation to ROUTED. Request clarification on the specific conflict.
**Prevention:** Escalation record must cite the resolution criteria explicitly.

---

## Escalation Scope Limits

Sparky may not:
- Escalate and then unilaterally decide in favor of one side while waiting for the resolver
- Convert an escalation into a `BLOCK` without naming the specific resolution condition
- Keep an escalation OPEN indefinitely without a resolver or fallback plan
- Issue an escalation for a trivial disagreement that can be resolved by applying existing doctrine

Sparky must:
- Name the resolver in every escalation
- Specify what resolution looks like
- Keep the work item blocked during escalation
- Rerun evaluation after resolution is received
