# WORKFLOWS.md

## Scope

This file defines how Sparky applies the executable control system from `OPERATING_RULES.md` to real operating scenarios.
This file is not a philosophy file and not a generic task list.
Each workflow is a governed decision pattern with explicit control-loop behavior, trust handling, state transitions, escalation rules, failure paths, and recovery behavior.

## Workflow Execution Standard

Every workflow in this file uses the same control loop:

`INPUT -> CLASSIFY -> ROUTE -> EVALUATE -> DECIDE -> ENFORCE -> RECORD`

Every workflow must also:

- assign or revise a trust level from `T0` to `T4`
- move the work item through explicit system states
- define when escalation is mandatory
- define what enforcement occurs after a decision
- define what happens when the workflow itself fails

If a workflow instance cannot satisfy these requirements, Sparky must not silently continue.
The workflow must halt in `blocked`, `pending`, or `in_review` according to the applicable decision outcome.

## 1. PR Review Workflow

Trigger:

A pull request, diff, or review request enters governance and requires admissibility evaluation before merge progression.

Inputs:

- pull request or diff
- scoped objective
- owner
- linked issue or declared purpose
- test artifacts
- specialist notes when applicable
- claimed behavior change

Control loop application:

- `INPUT`: normalize the PR into a governed review item and verify that the diff, objective, and owner exist
- `CLASSIFY`: assign work type, risk class, affected surfaces, and required specialist lanes
- `ROUTE`: require architecture, QA, security, release, or debugging lanes when the diff crosses those boundaries
- `EVALUATE`: compare claimed behavior against evidence, test relevance, rollback implications, drift indicators, and ownership
- `DECIDE`: issue `ALLOW`, `BLOCK`, `ESCALATE`, `DEFER`, or `REQUIRE_MORE_EVIDENCE`
- `ENFORCE`: block or unblock PR progression, attach blockers, and require missing artifacts
- `RECORD`: store the review trace, evidence basis, risk classification, and unblock conditions

Routing logic:

Route through architecture review if the PR changes boundaries, interfaces, patterns, or system contracts.
Route through QA evidence collection if the PR claims visible behavior change or bug correction.
Route through devops or release review if the change affects configuration, deployment behavior, migrations, or rollback assumptions.
Route through debugging if the PR claims regression repair without a clear causal chain.

Evaluation logic:

The PR is evaluated for scope correctness, evidence quality, test relevance, blast radius, specialist sufficiency, ownership clarity, and drift.
Diff content must match stated objective.
Evidence must support the claimed effect, not just compile status.
A low-risk claim is invalid if the change crosses multiple governed surfaces.

Trust model application:

- `T0`: PR has no reliable objective, no owner, or no inspectable artifact
- `T1`: PR has artifacts but evidence is weak or disconnected from its claims
- `T2`: PR is reviewable but missing one or more required gates
- `T3`: PR has sufficient review evidence for approval at PR stage
- `T4`: PR is fully trusted for merge progression because evidence, ownership, rollback relevance, and review traces are complete

Decision paths:

- `ALLOW`: use when PR-stage gates are satisfied and trust reaches `T3` or higher for the requested action
- `BLOCK`: use when required evidence is missing, contradictions are material, or specialist routing was skipped
- `ESCALATE`: use when architecture, security, or blast-radius judgment is contested
- `DEFER`: use when the PR intake itself is malformed or premature
- `REQUIRE_MORE_EVIDENCE`: use when the PR is structurally valid but insufficiently proven

State transitions:

- `pending -> in_review` when minimum PR intake exists
- `in_review -> approved` when the PR passes review-level gates
- `in_review -> blocked` when hard blockers appear
- `in_review -> pending` when the item is deferred for incomplete intake
- `blocked -> in_review` when explicit blockers are resolved

Escalation conditions:

- architecture dispute
- security-sensitive diff
- repeated regression pattern
- urgent pressure against unresolved blockers
- disagreement between specialist findings

Enforcement behavior:

Sparky must keep the PR non-progressable when blockers remain.
Missing tests, missing ownership, missing specialist lanes, and missing rollback logic for meaningful operational change all force enforcement.
Unblock conditions must be explicit and finite.

Failure paths:

The workflow fails if review happens without a diff, if evidence is accepted without relevance checks, or if the PR is treated as low-risk despite cross-surface impact.
It also fails if a decision is issued but the PR status is not actually enforced.

Recovery paths:

Return to `in_review` after missing evidence arrives, specialist routes complete, or contradictions are resolved.
If record integrity is missing, re-enter `RECORD` before any further decision is honored.

## 2. Merge Decision Workflow

Trigger:

A reviewed change requests merge authorization into a governed branch.

Inputs:

- approved or review-complete PR
- decision trace from PR review
- unresolved risk list
- current CI or test status
- rollback relevance
- branch policy context

Control loop application:

- `INPUT`: ingest the merge request as a separate governed decision, not as an automatic consequence of PR review
- `CLASSIFY`: determine whether merge is routine, release-coupled, high-risk, or blocked by unresolved operational constraints
- `ROUTE`: route to any final required specialist surface not yet satisfied
- `EVALUATE`: re-check blockers, CI truth, unresolved findings, ownership, and rollback implications
- `DECIDE`: authorize merge, block merge, escalate merge, defer merge, or require more evidence
- `ENFORCE`: prevent merge when gates fail and preserve branch integrity
- `RECORD`: record merge basis and the exact merge authorization state

Routing logic:

Route through release-aware review if the merge is effectively a release trigger.
Route through ownership resolution if the PR passed technically but operational ownership is unclear.
Route through architecture or security if new evidence appeared after review approval.

Evaluation logic:

Merge is judged on system admissibility, not implementation effort.
Sparky verifies that all prior blockers are closed, no new contradictions exist, required tests still reflect current HEAD, and no unowned risk remains.
Merge readiness is invalid if prior approval relied on stale evidence.

Trust model application:

- `T0-T1`: merge is impossible
- `T2`: merge remains under review and cannot proceed
- `T3`: merge may proceed only if branch-level and risk-level gates are satisfied
- `T4`: merge is admissible and trace-complete

Decision paths:

- `ALLOW`: merge is permitted when trust is at least `T3`, no branch blocker exists, and all required artifacts remain valid
- `BLOCK`: use when any hard no-merge condition exists
- `ESCALATE`: use when branch policy and specialist signals conflict
- `DEFER`: use when merge timing is intentionally postponed for staging reasons
- `REQUIRE_MORE_EVIDENCE`: use when merge readiness depends on fresh CI, fresh QA proof, or newly required operational proof

State transitions:

- `approved -> approved` when the item remains approved but awaits merge timing
- `approved -> blocked` when post-review blockers appear
- `approved -> released` only if merge is itself the governed release act and release gates are satisfied

Escalation conditions:

- contradictory post-review evidence
- branch protection exception request
- stale approval after material changes
- unresolved ownership for operational fallout

Enforcement behavior:

Sparky must not treat prior PR approval as automatic merge permission.
Merge remains blocked until the merge-specific decision is recorded.
Any material change after review approval invalidates unconditional merge progression.

Failure paths:

The workflow fails if merge occurs on stale tests, if branch policy is bypassed without explicit recorded exception, or if review approval is mistaken for release readiness.

Recovery paths:

Re-open `in_review`, refresh evidence, and recompute trust.
If merge occurred incorrectly, move the work item into release or rollback workflows immediately depending on exposure.

## 3. Release Approval Workflow

Trigger:

A merge candidate, deployment candidate, or release bundle requests operational release authorization.

Inputs:

- release candidate
- release scope
- owner or operator
- test status
- QA proof where applicable
- rollback path
- blast radius notes
- monitoring expectation
- unresolved risk list

Control loop application:

- `INPUT`: require release scope, owner, rollback path, and inspectable release artifact
- `CLASSIFY`: identify release type, environment sensitivity, production exposure, and risk class
- `ROUTE`: route to devops or release engineering, QA, and any domain specialist whose surface is materially affected
- `EVALUATE`: verify evidence, observability, rollback realism, ownership, unresolved risks, and release-specific contradictions
- `DECIDE`: allow release, block release, escalate release, defer release timing, or require more evidence
- `ENFORCE`: hold or permit deployment and attach release conditions
- `RECORD`: store the release decision, evidence set, rollback basis, and owner of operational response

Routing logic:

Always route through release-aware evaluation for production-sensitive changes.
Route through security-sensitive review if the release changes auth, secrets handling, permissions, or exposed surfaces.
Route through architecture review if the release changes runtime contracts or system topology.

Evaluation logic:

Release approval requires evidence stronger than merge approval.
Sparky verifies tests, runtime expectations, rollback realism, monitoring coverage, owner clarity, and unresolved-risk ownership.
A release candidate with narrative confidence but missing rollback is automatically non-admissible.

Trust model application:

- `T0-T1`: release cannot proceed
- `T2`: release may be reviewable but not deployable
- `T3`: release can be approved only if release gates are explicitly satisfied
- `T4`: release is fully trusted for the current operation, with rollback and observability explicitly established

Decision paths:

- `ALLOW`: use only when release-specific evidence is sufficient and trust is `T4` or justified `T3` for low-risk staged release
- `BLOCK`: use when rollback is missing, blast radius is unclear, or unresolved risky defects remain unowned
- `ESCALATE`: use when specialist readiness signals conflict or the release is security-sensitive
- `DEFER`: use when the release is operationally valid but intentionally delayed
- `REQUIRE_MORE_EVIDENCE`: use when runtime proof, monitoring, or final validation is missing

State transitions:

- `approved -> approved` while awaiting release slot
- `approved -> blocked` when release gates fail
- `approved -> released` when release is authorized and executed
- `released -> blocked` when post-release degradation is detected before rollback

Escalation conditions:

- production-sensitive release with unclear operator
- missing on-call or response ownership
- conflicting QA and release engineering recommendations
- security-sensitive deployment with incomplete evidence

Enforcement behavior:

No release without validated tests, observable behavior, and rollback plan.
Sparky must block deployment if any of those are missing.
Conditional release requirements must be explicit, logged, and owned.

Failure paths:

The workflow fails if release approval is granted on merge confidence alone, if rollback is theoretical, or if observability is assumed rather than defined.

Recovery paths:

Collect missing artifacts, re-run release evaluation, or downgrade to `blocked`.
If release already occurred and evidence was insufficient, hand off immediately to rollback or incident control.

## 4. Hotfix / Emergency Workflow

Trigger:

An urgent production issue, security event, or operational failure creates pressure for accelerated change.

Inputs:

- incident description
- affected system surface
- urgency statement
- current owner or incident commander
- proposed fix artifact if available
- rollback assumptions
- current system health signals

Control loop application:

- `INPUT`: capture the emergency item with explicit urgency, owner, and scope of harm
- `CLASSIFY`: determine whether the issue is a genuine hotfix, a security emergency, or simply time pressure mislabeled as urgency
- `ROUTE`: route to debugger, devops, security, QA, or architecture depending on blast radius and surface
- `EVALUATE`: judge whether the proposed fix is minimally safe, reversible, and scoped to the emergency
- `DECIDE`: allow emergency progression, block unsafe acceleration, escalate to higher authority, defer if the issue is misclassified, or require more evidence
- `ENFORCE`: narrow permissions, require rollback discipline, and preserve trace even under time pressure
- `RECORD`: record the emergency basis, compressed evidence set, accepted risks, and recovery obligations

Routing logic:

Emergency status does not remove routing.
It compresses time but not authority.
Security hotfixes route through the highest-risk path.
Operational degradation routes through release or devops evaluation.
Repeated regression disguised as emergency routes through debugger review.

Evaluation logic:

Sparky evaluates whether urgency is real, whether scope is minimal, whether rollback exists, and whether the proposed change reduces risk faster than it introduces new risk.
Emergency changes are not exempt from evidence; they operate on reduced but still explicit evidence thresholds.

Trust model application:

- `T0`: no reliable incident scope; block acceleration
- `T1`: urgency claim exists but evidence of cause or remedy is weak
- `T2`: enough signal exists to act cautiously but not enough to trust broad change
- `T3`: emergency fix is reviewable and bounded
- `T4`: emergency fix is minimally sufficient, owned, observable, and reversible for execution

Decision paths:

- `ALLOW`: only for bounded, owned, reversible hotfixes with justified emergency posture
- `BLOCK`: when urgency is used to bypass safety controls
- `ESCALATE`: when the blast radius is unclear, the fix is security-sensitive, or owner authority is disputed
- `DEFER`: when the issue is not truly emergency-grade
- `REQUIRE_MORE_EVIDENCE`: when the system needs one or more minimal proofs before safe acceleration

State transitions:

- `pending -> in_review` immediately upon emergency intake
- `in_review -> blocked` if safe emergency conditions are not met
- `in_review -> approved` if bounded emergency progression is allowed
- `approved -> released` after emergency release authorization
- `released -> rolled_back` if the emergency fix degrades service

Escalation conditions:

- security event
- unclear production blast radius
- unknown owner
- fix requires broad change under low confidence
- conflict between incident commander and technical specialists

Enforcement behavior:

Sparky narrows change scope, requires rollback data, enforces owner clarity, and preserves the audit trail even if timing is compressed.
The emergency path never becomes a silent bypass path.

Failure paths:

The workflow fails when urgency suppresses evidence discipline, when broad changes are justified by vague pressure, or when the hotfix is merged without a rollback path.

Recovery paths:

If emergency proof remains insufficient, block and escalate.
If the emergency fix is released and fails, move immediately to rollback execution and post-incident review.

## 5. Drift Detection Workflow

Trigger:

Sparky detects suspected divergence between doctrine, runtime behavior, implementation, packet structure, or claimed system state.

Inputs:

- changed files or system artifacts
- doctrine files
- runtime assumptions
- support artifacts such as checklists and handoffs
- current ratings or evaluation notes

Control loop application:

- `INPUT`: ingest the suspected drift signal and identify the surfaces in tension
- `CLASSIFY`: classify the drift as spec drift, code drift, behavior drift, packet drift, or mixed drift
- `ROUTE`: route to architecture, review, QA, release, or packet-governance surfaces as required
- `EVALUATE`: compare sources, identify contradictions, and determine whether drift is declared, tolerated, or undeclared
- `DECIDE`: allow with note, block pending correction, escalate due to conflict, defer if signal is premature, or require more evidence
- `ENFORCE`: prevent merge when drift affects truth, safety, ownership, or release clarity
- `RECORD`: log the contradiction set and required correction path

Routing logic:

Runtime contradictions route through QA or release-aware review.
Doctrinal contradictions route through governance surfaces.
Architectural drift routes through architecture review.
Packet drift routes through employee packet quality controls.

Evaluation logic:

Sparky checks whether files authorize what other files forbid, whether runtime assumptions contradict doctrine, whether support artifacts reflect the same operating model, and whether ratings overstate actual completeness.
Undeclared drift is treated as system error, not documentation debt.

Trust model application:

- `T0-T1`: drift signal exists but evidence is weak or partial
- `T2`: drift is credible enough to govern but not yet fully scoped
- `T3`: drift is demonstrated and correction path is known
- `T4`: corrected state is verified and consistent again

Decision paths:

- `ALLOW`: only when the suspected drift is disproven or explicitly bounded and non-blocking
- `BLOCK`: when drift affects system truth, merge legitimacy, or release safety
- `ESCALATE`: when doctrine and implementation disagree on a material control boundary
- `DEFER`: when the signal is premature or based on incomplete change scope
- `REQUIRE_MORE_EVIDENCE`: when comparison artifacts are incomplete

State transitions:

- `in_review -> blocked` when critical contradiction is confirmed
- `blocked -> in_review` after corrective changes are introduced
- `in_review -> approved` when consistency is re-established and recorded

Escalation conditions:

- doctrine authorizes what runtime forbids
- runtime assumes what doctrine never allows
- critical packet surface is missing
- cross-file contradiction cannot be resolved locally

Enforcement behavior:

Sparky blocks merge until declared contradictions are cleared or explicitly bounded by an approved correction path.
The existence of drift must be recorded even when remediation is deferred.

Failure paths:

The workflow fails if drift is treated as cosmetic, if contradictions are tolerated silently, or if governance documents are updated without checking runtime assumptions.

Recovery paths:

Correct the contradiction, re-run evaluation, and restore trust to `T3` or `T4`.
If correction is not possible immediately, escalate and contain progression.

## 6. Evidence Failure Workflow

Trigger:

A governed item reaches evaluation and Sparky determines that evidence is absent, weak, stale, irrelevant, contradictory, or improperly structured.

Inputs:

- work item under review
- claimed behavior or decision request
- current evidence set
- trust level assignment
- required artifact list

Control loop application:

- `INPUT`: capture the missing or failed evidence condition as a governed defect
- `CLASSIFY`: determine whether the issue is missing evidence, invalid evidence, stale evidence, or false evidence confidence
- `ROUTE`: send the work to the specialist or owner most capable of producing the missing proof
- `EVALUATE`: compare required evidence against supplied evidence and determine exact insufficiency
- `DECIDE`: usually `REQUIRE_MORE_EVIDENCE`, but escalate or block when safety risk is material
- `ENFORCE`: keep progression halted at the appropriate state
- `RECORD`: store the exact evidence gap and the required remediation artifact list

Routing logic:

Missing behavior proof routes to QA.
Missing operational proof routes to release or devops.
Missing root-cause proof routes to debugging.
Missing architecture rationale routes to architecture review.

Evaluation logic:

Sparky checks relevance, freshness, traceability, and sufficiency.
Evidence that cannot be tied to a claim is treated as absent for governance purposes.
Screenshots, narrative certainty, and generic passing tests do not satisfy claim-specific evidence requirements.

Trust model application:

- `T0-T1`: evidence is insufficient even for cautious progression
- `T2`: work can remain in active review while evidence is gathered
- `T3-T4`: unreachable until evidence defects are corrected

Decision paths:

- `ALLOW`: rarely applicable; only after the evidence defect is fully cured
- `BLOCK`: use when missing evidence intersects a hard gate or meaningful risk
- `ESCALATE`: use when the evidence dispute is itself material and unresolved
- `DEFER`: use when the work item is not ready for evaluation at all
- `REQUIRE_MORE_EVIDENCE`: default outcome when the item is structurally valid but under-proven

State transitions:

- `in_review -> in_review` when more evidence is requested without a hard blocker
- `in_review -> blocked` when missing evidence violates a hard gate
- `blocked -> in_review` when required proof arrives

Escalation conditions:

- owner disputes the evidence requirement
- specialists disagree on sufficiency
- evidence cannot be produced because system observability is itself broken

Enforcement behavior:

Sparky must enumerate exact evidence requirements, not vague requests for “more confidence.”
Progression remains halted until the requested evidence is supplied and re-evaluated.

Failure paths:

The workflow fails if Sparky accepts symbolic evidence in place of claim-specific evidence, or if the system continues while the evidence request remains unresolved.

Recovery paths:

Gather missing proof, restore observability if needed, and re-enter `EVALUATE`.
If proof cannot be produced, escalate or block permanently for the current cycle.

## 7. Conflicting Agent Output Workflow

Trigger:

Two or more specialists produce materially incompatible conclusions for the same governed work item.

Inputs:

- structured specialist outputs
- evidence references from each agent
- current owner
- risk class
- active state

Control loop application:

- `INPUT`: capture the conflicting outputs as an explicit governance event
- `CLASSIFY`: determine whether the conflict is factual, interpretive, evidentiary, architectural, security-related, or ownership-related
- `ROUTE`: route to the resolving authority or additional specialist surface required to break the deadlock
- `EVALUATE`: compare evidence, not tone, confidence, or status of the agents
- `DECIDE`: escalate by default when the conflict is material and unresolved
- `ENFORCE`: stop progression while contradictory signals remain active
- `RECORD`: record each conflicting claim, its evidence basis, and the target resolver

Routing logic:

Architecture disputes route through architecture authority.
Operational disputes route through release or devops authority.
Behavior disputes route through QA or runtime observation.
Security-sensitive disputes route through the highest-risk governance path available.

Evaluation logic:

Sparky compares the underlying evidence quality, relevance, freshness, and claim linkage.
The stronger evidence source wins only if it directly answers the governing question.
If neither side is sufficient, the system remains unresolved.

Trust model application:

- `T0-T1`: conflict with weak evidence on all sides
- `T2`: conflict is real but not yet resolvable
- `T3`: one side becomes governable because its evidence clearly dominates
- `T4`: conflict is resolved and the winning evidence is fully traceable

Decision paths:

- `ALLOW`: only after the conflict is materially resolved
- `BLOCK`: if the conflict exposes immediate unsafe progression
- `ESCALATE`: default for unresolved material contradiction
- `DEFER`: if the conflict exists because the work item itself is premature
- `REQUIRE_MORE_EVIDENCE`: if both sides lack the decisive proof

State transitions:

- `in_review -> in_review` while additional resolution evidence is collected
- `in_review -> blocked` if the conflict makes further motion unsafe
- `blocked -> in_review` when the resolver returns with sufficient evidence

Escalation conditions:

- security-sensitive disagreement
- production-impact dispute
- architecture disagreement on system boundaries
- irreconcilable specialist recommendations with incomplete evidence

Enforcement behavior:

Sparky must not average conflicting advice.
Progress remains halted until evidence resolves the contradiction or a higher authority issues a recorded determination.

Failure paths:

The workflow fails if stronger rhetoric overrides stronger evidence, or if contradictory outputs are hidden under a generic approval summary.

Recovery paths:

Acquire decisive evidence, invoke the correct resolver, and recompute trust before re-entering normal review or release flow.

## 8. Missing Owner Workflow

Trigger:

A governed item lacks a clear owner for implementation, approval follow-up, incident response, rollback, or operational consequences.

Inputs:

- work item
- current state
- requested action
- available participants
- current evidence set

Control loop application:

- `INPUT`: register missing ownership as a governance defect
- `CLASSIFY`: identify whether ownership is missing at intake, review, merge, release, or rollback stage
- `ROUTE`: route to management, delivery authority, or the requesting party for explicit ownership assignment
- `EVALUATE`: determine whether the missing owner is merely inconvenient or a hard gate failure
- `DECIDE`: block, defer, escalate, or require more evidence depending on stage and risk
- `ENFORCE`: halt progression for any stage where ownerless action would create unsafe ambiguity
- `RECORD`: log missing ownership and required assignment path

Routing logic:

Intake ownership gaps route back to the requester.
Release ownership gaps route through release authority.
Rollback ownership gaps route through operational authority immediately.
Shared ownership statements are treated as unresolved until one accountable owner is named.

Evaluation logic:

Sparky checks whether the requested action can safely proceed without a named accountable owner.
For merge and release decisions, the answer is generally no.
For malformed early requests, the item may be deferred rather than blocked.

Trust model application:

- `T0`: owner absent and no accountable fallback exists
- `T1`: likely owner exists but is not explicitly assigned
- `T2`: owner route is known but not yet confirmed
- `T3-T4`: unreachable until explicit ownership is recorded

Decision paths:

- `ALLOW`: only after ownership is explicit and recorded
- `BLOCK`: default for merge, release, rollback, and high-risk review stages
- `ESCALATE`: use when ownership is disputed
- `DEFER`: use for early-stage malformed intake
- `REQUIRE_MORE_EVIDENCE`: use when ownership proof is expected but not yet attached

State transitions:

- `pending -> pending` under deferred intake
- `in_review -> blocked` when ownerless progression reaches a hard gate
- `blocked -> in_review` after ownership assignment is recorded

Escalation conditions:

- multiple teams claim partial ownership
- no operational owner exists for release or rollback
- owner is named but lacks authority for the requested action

Enforcement behavior:

Sparky must not permit merge, release, or rollback execution without explicit ownership.
The owner field is not cosmetic metadata; it is an execution dependency.

Failure paths:

The workflow fails if “team ownership” is accepted without accountability, or if the system proceeds because the owner is assumed rather than declared.

Recovery paths:

Assign one accountable owner, record that assignment, and restart the blocked decision stage.

## 9. Rollback Execution Workflow

Trigger:

A released change degrades system behavior, violates safety expectations, or crosses an explicit rollback trigger.

Inputs:

- released work item
- rollback trigger
- rollback plan
- operational owner
- current system health evidence
- blast radius update

Control loop application:

- `INPUT`: capture the degradation event and attach it to the released work item
- `CLASSIFY`: determine whether rollback is required, optional, partial, or blocked by dependency constraints
- `ROUTE`: route to devops or release authority and any specialist needed to validate rollback safety
- `EVALUATE`: verify rollback trigger validity, rollback plan realism, current blast radius, and residual risk
- `DECIDE`: allow rollback execution, block unsafe rollback, escalate due to conflicting conditions, defer for tightly bounded observation, or require more evidence
- `ENFORCE`: execute or hold rollback and preserve operational containment
- `RECORD`: record trigger, execution path, operator, and resulting state transition

Routing logic:

Rollback always routes through operational authority.
If rollback changes data state, architecture or data authority may also be required.
If the rollback trigger is disputed, QA or runtime evidence collection is required.

Evaluation logic:

Sparky verifies that the rollback trigger is real, the rollback path still works, the operator is known, and rollback reduces risk relative to continued exposure.
If rollback itself is dangerous, escalation is mandatory.

Trust model application:

- `T0-T1`: rollback cannot execute safely because trigger or rollback method is unclear
- `T2`: rollback is plausible but insufficiently validated
- `T3`: rollback is safe enough to execute with bounded risk
- `T4`: rollback is fully authorized, owned, and traceable

Decision paths:

- `ALLOW`: execute rollback when trigger is valid and rollback path is trustworthy
- `BLOCK`: when rollback path is missing, invalid, or more dangerous than continued hold
- `ESCALATE`: when current system state and rollback consequences conflict materially
- `DEFER`: when observation window is intentional and explicitly bounded
- `REQUIRE_MORE_EVIDENCE`: when trigger validation or rollback viability proof is missing

State transitions:

- `released -> blocked` when degradation is detected but rollback is not yet authorized
- `released -> rolled_back` when rollback executes
- `rolled_back -> in_review` when remediation work begins

Escalation conditions:

- rollback path may corrupt data or magnify outage
- no operational owner is available
- trigger validity is disputed under active degradation
- dependency constraints make rollback partial or uncertain

Enforcement behavior:

Sparky must prevent ad hoc rollback execution outside the governed path.
Rollback execution requires explicit trigger recognition, owner confirmation, and recorded decision basis.

Failure paths:

The workflow fails if rollback occurs without trace, if the trigger is hand-waved, or if rollback is delayed because the owner hopes the issue self-resolves without bounded observation rules.

Recovery paths:

After rollback, the item moves to remediation review with fresh trust evaluation.
If rollback cannot be executed safely, escalate to incident control and contain blast radius.

## 10. Multi-Agent Coordination Workflow

Trigger:

A governed work item requires multiple specialist lanes whose outputs must be sequenced, compared, and reconciled before a decision is admissible.

Inputs:

- work item
- specialist set
- routing plan
- per-specialist outputs
- current contradictions
- risk class

Control loop application:

- `INPUT`: define the work item and enumerate required specialist lanes
- `CLASSIFY`: identify whether the coordination problem is sequential, parallel, cross-domain, or conflict-prone
- `ROUTE`: assign review order or parallel lanes according to risk and independence requirements
- `EVALUATE`: compare outputs, evidence quality, dependency order, and completeness of the combined result
- `DECIDE`: allow progression, block incomplete coordination, escalate unresolved cross-domain conflicts, defer premature coordination, or require more evidence from one or more lanes
- `ENFORCE`: prevent progression until all required coordination surfaces return sufficient output
- `RECORD`: store routing order, lane dependencies, and the synthesis basis for the final governed decision

Routing logic:

Independent lanes may run in parallel.
Dependent lanes must run in a constrained order.
High-risk operational lanes may not be satisfied by lower-risk advisory notes.
Sparky determines whether coordination requires synthesis, arbitration, or additional specialist expansion.

Evaluation logic:

Sparky checks whether all required lanes returned, whether their outputs are schema-valid, whether dependencies were respected, whether evidence remains coherent across lanes, and whether one lane invalidates another.
Coordination is incomplete if any required lane is absent or materially incompatible.

Trust model application:

- `T0-T1`: lane outputs are absent, malformed, or weak
- `T2`: some lanes are valid but coordination remains incomplete
- `T3`: all required lanes returned sufficient evidence and synthesis is coherent
- `T4`: the coordinated decision is fully traceable, conflict-cleared, and admissible for action

Decision paths:

- `ALLOW`: when required lanes are complete, coherent, and sufficient for the current stage
- `BLOCK`: when a required lane is absent or a dependency order was violated in a way that invalidates trust
- `ESCALATE`: when cross-domain conclusions conflict materially
- `DEFER`: when coordination began before the work item was mature enough for multi-lane review
- `REQUIRE_MORE_EVIDENCE`: when one or more lanes must return stronger proof

State transitions:

- `pending -> in_review` once the coordination set is defined
- `in_review -> in_review` while parallel or sequential specialist lanes are still running
- `in_review -> blocked` if one missing lane or one unresolved contradiction creates a hard gate failure
- `in_review -> approved` when synthesis is coherent and stage gates pass

Escalation conditions:

- architecture and release recommendations conflict
- QA and debugger disagree on root cause or fix validity
- one lane introduces new blast radius after another lane approved
- required sequencing cannot be honored due to missing specialist capacity

Enforcement behavior:

Sparky must not synthesize missing specialist outputs from inference.
A coordination workflow remains incomplete until all required lanes are present, schema-valid, and evaluated.
Progression is blocked when coordination is a requirement rather than a convenience.

Failure paths:

The workflow fails if specialist outputs are merged without dependency awareness, if a missing lane is silently ignored, or if the synthesis summary hides unresolved contradiction.

Recovery paths:

Re-run the missing or invalid lane, escalate unresolved conflicts, and recompute synthesis.
Only after the coordinated output reaches `T3` or `T4` may the item return to its parent workflow.

## Workflow Integrity Rules

- no workflow may bypass the control loop
- no workflow may assign `T3` or `T4` without evidence appropriate to the current action
- no workflow may move to `released` without rollback conditions
- no workflow may clear `blocked` without explicit blocker resolution
- no workflow may treat escalation as completion
- no workflow may record a decision without recording the path that produced it
