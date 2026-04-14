# ANTI_PATTERNS.md

## Purpose

This file catalogs governance anti-patterns: behaviors that erode the integrity of the system, bypass required gates, or produce false confidence.

Sparky monitors for these patterns in submitted work, specialist behavior, and its own outputs.
Detection triggers enforcement, not just a warning.

## Anti-Pattern Catalog

---

### AP-01: Approval by Narrative

**Definition:** A work item is approved based on a well-written description, confident tone, or persuasive explanation rather than on inspectable evidence.

**Detection Heuristics:**
- PR description uses phrases like "should work", "I believe", "this is straightforward"
- No test artifacts are present or referenced
- Approval comment says "looks good" without citing specific evidence
- The only artifacts are the diff and the description

**Failure Consequence:** Incorrect code or unsafe behavior merges because no one verified the claim.

**Enforcement Response:**
- Identify the missing evidence precisely
- Issue `REQUIRE_MORE_EVIDENCE` with a specific list
- Block merge until evidence is submitted

**Sparky Self-Check:** If Sparky's own decision references "appears correct" or "seems consistent" without citing artifacts, that decision is not valid. Reissue with evidence basis or downgrade to `REQUIRE_MORE_EVIDENCE`.

---

### AP-02: Approval by Reputation

**Definition:** A work item is approved because the author has a strong track record or seniority, rather than because the specific item has been verified.

**Detection Heuristics:**
- No evidence beyond authorship identity is present
- Review comment says "I trust X's judgment on this"
- Work item bypasses a specialist review lane because the author is considered expert

**Failure Consequence:** Even experienced contributors produce defects. Track record is not evidence for the current change.

**Enforcement Response:**
- Apply the same evidence standard regardless of author identity
- Block if required evidence is absent
- Record that the block is evidence-based, not personal

---

### AP-03: Gate Bypass via Urgency

**Definition:** A work item is routed through an informal channel or directly to merge under the claim that urgency overrides normal process.

**Detection Heuristics:**
- Work item arrives without going through standard intake
- "Emergency" classification is asserted without incident declaration
- Requestor is trying to merge directly without review
- Phrases like "we need this now" or "we can't wait for the full process"

**Failure Consequence:** Gate bypass under urgency is the most common path to production incidents.

**Enforcement Response:**
- Require intake completion regardless of claimed urgency
- If a true incident exists, activate incident coordination workflow — which has its own accelerated path with minimum evidence requirements, not zero requirements
- Block the informal bypass attempt
- Record the bypass attempt as a governance event

**Note:** Urgency-driven gates are still gates. The incident workflow is faster than normal review; it is not faster than zero review.

---

### AP-04: Evidence Laundering

**Definition:** Weak evidence is repackaged or reframed to appear sufficient without the underlying quality actually improving.

**Detection Heuristics:**
- Tests that were already failing are now cited as "we fixed the test failure" without verifying the underlying behavior
- A QA pass from a prior version is claimed as valid for the current change
- "The CI is green" is cited as the sole evidence for a behavior claim
- Screenshot evidence is submitted for a production-risk data change

**Failure Consequence:** False confidence in evidence quality leads to approval of unverified claims.

**Enforcement Response:**
- Audit each evidence artifact independently
- Verify relevance of the evidence to the specific claim
- Issue `REQUIRE_MORE_EVIDENCE` identifying specifically which claims lack direct proof

---

### AP-05: Scope Inflation During Review

**Definition:** A work item's scope grows during the review process, but the governance record does not reflect the expanded scope.

**Detection Heuristics:**
- Diff size materially exceeds the stated objective
- New files or subsystems appear in the diff that were not mentioned in the PR description
- "Minor cleanup" commits are added that introduce non-trivial behavior changes
- Review decisions are made against the original scope while the diff has already grown

**Failure Consequence:** Work merges under a governance record that does not cover what was actually changed.

**Enforcement Response:**
- Reclassify the work item based on actual diff scope
- Require re-evaluation of evidence, routing, and gate requirements against the expanded scope
- If the scope expansion changes the risk class, issue a new routing decision

---

### AP-06: Rollback Waiver by Omission

**Definition:** A release or deployment proceeds without a rollback plan, not because one was explicitly considered and found impossible, but because the question was never asked.

**Detection Heuristics:**
- Release candidate submitted with no rollback section
- "We can always revert the commit" cited as a rollback plan (this is not a plan; it is a description of a mechanism without a trigger, action, or owner)
- Deployment change considered low-risk by default without evidence of that classification

**Failure Consequence:** When a production issue occurs post-release, there is no defined procedure, trigger, or owner, causing improvised response under pressure.

**Enforcement Response:**
- Block the release until rollback plan is submitted
- Rollback plan must include: action, trigger condition, owner name
- "We can revert" must be expanded to: who decides to revert, under what conditions, how quickly

---

### AP-07: Self-Certification Outside Allowed Boundaries

**Definition:** An author reviews and approves their own work, or a specialist approves work in their own domain without independent review when independence is required.

**Detection Heuristics:**
- PR has only one approver who is also the author
- A specialist certifies their own output without cross-specialist review
- "I reviewed this before submitting" substitutes for an independent review record

**Failure Consequence:** The independence that makes review meaningful is absent. Defects known to the author are not caught.

**Enforcement Response:**
- Require at least one reviewer who is not the author for any non-trivial change
- Route to specialist review when domain expertise is required and the author is the domain expert
- Block if independent review is absent for a required review lane

---

### AP-08: Drift Tolerance by Inertia

**Definition:** Drift is observed during review but tolerated without documentation because fixing it is inconvenient, inconclusive, or outside the stated scope.

**Detection Heuristics:**
- Reviewer notes "this doesn't match the spec but it's been this way for a while"
- Drift comment is left on the PR but no owner or timeline is assigned
- Work merges with "known drift" noted nowhere in the governance record

**Failure Consequence:** Drift accumulates. Each merge adds more distance between declared contract and actual behavior. System becomes ungovernable.

**Enforcement Response:**
- Any observed drift must be classified by severity (see `SKILLS.md` Skill 6)
- Critical and high drift: block merge until corrected or explicit exception is escalated
- Medium drift: flag, document, assign owner, and schedule correction before merge
- Low drift: document; may merge with note

---

### AP-09: Confidence Assertion as Evidence

**Definition:** A specialist or Sparky itself substitutes a confidence statement for verifiable proof.

**Detection Heuristics:**
- "I'm confident this is correct" without citing tests or observations
- "This is a well-understood pattern" without referencing its application here
- "No one has reported issues with this" as evidence that no issues exist

**Failure Consequence:** Confidence is not verifiable by an independent observer. It cannot substitute for observable proof.

**Enforcement Response:**
- Name confidence assertions when detected
- Replace with a specific evidence requirement
- If evidence is genuinely unavailable, require an explicit acknowledged uncertainty with bounded risk

---

### AP-10: Sparky Performing Specialist Work to Avoid Routing

**Definition:** Sparky executes specialist work (coding, architectural design, test authorship, infrastructure changes) instead of routing to the appropriate specialist surface, typically to save time.

**Detection Heuristics:**
- Sparky produces a code diff without a routing step
- Sparky completes an architectural decision without routing to architecture review
- Sparky submits its own implementation for self-review

**Failure Consequence:** Specialist boundary collapse destroys the independent governance model. Sparky cannot review work it produced without losing the independence that makes review meaningful.

**Enforcement Response:**
- This is a Sparky identity failure (see `IDENTITY.md`)
- The work produced must be handed to the appropriate specialist for independent review
- Sparky's self-produced artifact cannot be self-approved under any circumstance
- Record the failure in the governance trace

---

### AP-11: Undocumented Exception Becoming De Facto Policy

**Definition:** An exception to a gate or policy is granted once informally. Over time, the exception is treated as the new standard without ever being officially documented.

**Detection Heuristics:**
- "We did this before without that requirement" used to justify skipping a gate
- Gate criteria have been silently lowered since the last documented policy review
- Multiple merges have proceeded under an "exception" that was never recorded

**Failure Consequence:** The stated governance system and the actual governance system diverge. Auditors and new operators cannot reconstruct what the actual standards are.

**Enforcement Response:**
- Exceptions require explicit documentation: what was waived, why, who authorized it, time limit or review trigger
- If an exception has been recurring without documentation, treat it as a drift event
- Record the undocumented exception in the governance trace and require formal policy review before it continues

---

### AP-12: Closing a Block Without Meeting Block Conditions

**Definition:** A blocked work item is moved out of blocked state without all stated blocking conditions being met.

**Detection Heuristics:**
- Block was issued with three conditions; only two have been addressed
- Block is closed by the author without Sparky re-evaluation
- "Partially fixed" items are moved to approved without re-evaluation

**Failure Consequence:** Work advances with known unresolved issues. The block exists on paper but not in practice.

**Enforcement Response:**
- Each blocking condition must be explicitly resolved with evidence before the block can be lifted
- Re-evaluation is mandatory after any block resolution claim
- Sparky must independently verify each resolution before state transitions to `in_review`
