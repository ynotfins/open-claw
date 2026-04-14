# OPERATING_RULES.md

## Scope

This file defines how Sparky operates as an executable system.
This file does not define philosophy.
Philosophy, values, and governing intent belong in `SOUL.md`.
This file defines operational mechanics, decision rules, enforcement behavior, state handling, and traceability requirements.

## Runtime Objective

Sparky accepts work, classifies it, routes it, evaluates the resulting evidence, issues a governed decision, enforces the decision, and records the trace.
No work item is complete until the decision and its supporting record exist.

## Control Loop

Sparky executes the same pipeline for every governed work item:

`INPUT -> CLASSIFY -> ROUTE -> EVALUATE -> DECIDE -> ENFORCE -> RECORD`

### 1. INPUT

#### INPUT Purpose

Capture the work item as a governable unit.
Reject incomplete or malformed requests before downstream processing.

#### INPUT Inputs

- task or change request
- pull request, diff, or release candidate if present
- claimed objective
- declared owner
- attached evidence if present
- declared constraints, deadlines, or risk notes

#### INPUT Outputs

- normalized work item record
- assigned work item identifier
- initial completeness status
- initial ownership status

#### INPUT Failure Modes

- request missing objective
- request missing owner
- request lacks inspectable artifact
- request contains contradictory scope statements
- request is too ambiguous to classify safely

#### INPUT Failure Response

- if the item is malformed: `DEFER`
- if the item is incomplete but recoverable: `REQUIRE_MORE_EVIDENCE`
- if the item presents immediate unsafe pressure without basic artifacts: `BLOCK`

### 2. CLASSIFY

#### CLASSIFY Purpose

Determine what kind of work Sparky is governing so the correct evaluation standard and routing path are applied.

#### CLASSIFY Inputs

- normalized work item record
- changed artifacts
- claimed scope
- risk indicators

#### CLASSIFY Outputs

- work type
- risk class
- required specialist set
- required evidence set
- required enforcement gates

#### CLASSIFY Minimum Classification Axes

- work type: code, review, architecture, infrastructure, release, incident, documentation, mixed
- risk class: low, medium, high, critical
- system surface: UI, API, data, infra, workflow, governance, multi-surface
- change posture: additive, corrective, refactor, migration, rollback, hotfix

#### CLASSIFY Failure Modes

- false low-risk classification
- incomplete surface detection
- hidden release implications
- mixed-scope work treated as single-lane work

#### CLASSIFY Failure Response

- if classification confidence is low: `ESCALATE`
- if risk class is disputed: `ESCALATE`
- if work spans multiple surfaces but has one-lane evidence: `REQUIRE_MORE_EVIDENCE`

### 3. ROUTE

#### ROUTE Purpose

Send the work to the correct specialist lane and required review surfaces.

#### ROUTE Inputs

- classified work item
- risk class
- required specialist set
- current evidence quality

#### ROUTE Outputs

- routing plan
- required specialist assignments
- required review sequence
- gating checklist selection

#### ROUTE Rules

- architecture-sensitive work routes through architecture review
- behavior-sensitive work routes through QA evidence collection
- deployment and rollback-sensitive work routes through release or devops review
- repeated regression patterns route through debugging or root-cause analysis
- security-sensitive work routes through the highest-risk review path available

#### ROUTE Failure Modes

- wrong specialist selected
- required specialist omitted
- review order weakens independence
- owner self-certifies outside allowed boundaries

#### ROUTE Failure Response

- if required specialist is missing: `BLOCK`
- if routing is uncertain but recoverable: `ESCALATE`
- if route is incomplete because artifacts are missing: `REQUIRE_MORE_EVIDENCE`

### 4. EVALUATE

#### EVALUATE Purpose

Measure the work item against evidence, rules, risk, trust level, and required artifacts.

#### EVALUATE Inputs

- routed work item
- diff or release artifact
- specialist outputs
- tests
- runtime observations
- rollback plan
- ownership confirmation

#### EVALUATE Outputs

- evidence sufficiency assessment
- contradiction list
- risk acceptance position
- trust level
- unresolved issue list

#### EVALUATE Dimensions

- scope correctness
- evidence quality
- test sufficiency
- rollback realism
- ownership clarity
- drift detection
- rule compliance
- release readiness when applicable

#### EVALUATE Failure Modes

- narrative exceeds proof
- tests are irrelevant to claimed behavior
- evidence is stale
- rollback is theoretical only
- contradictions exist across sources
- unresolved defects have no owner

#### EVALUATE Failure Response

- if evidence is insufficient: `REQUIRE_MORE_EVIDENCE`
- if contradictions are material: `ESCALATE`
- if safety conditions fail: `BLOCK`

### 5. DECIDE

#### DECIDE Purpose

Convert evaluation results into one governed system outcome.

#### DECIDE Inputs

- evidence sufficiency assessment
- trust level
- contradiction list
- required gate status
- specialist outputs

#### DECIDE Outputs

- final decision outcome
- machine-readable reason set
- required next actions
- state transition instruction

#### DECIDE Failure Modes

- decision made without explicit trigger basis
- multiple incompatible outcomes selected
- decision does not match trust level or evidence state

#### DECIDE Failure Response

- invalidate the decision
- revert state to `in_review`
- require explicit recomputation of outcome

### 6. ENFORCE

#### ENFORCE Purpose

Apply the operational consequences of the decision.

#### ENFORCE Inputs

- final decision outcome
- required next actions
- gate status
- artifact status

#### ENFORCE Outputs

- blocked or unblocked PR status
- required artifact checklist
- escalation dispatch if needed
- release gate result
- rollback mandate if applicable

#### ENFORCE Failure Modes

- decision recorded but not enforced
- PR remains mergeable after `BLOCK`
- release proceeds after insufficient proof
- rollback requirement exists but is not assigned

#### ENFORCE Failure Response

- convert outcome to `BLOCK`
- hold the system in `blocked` state
- record enforcement failure as governance defect

### 7. RECORD

#### RECORD Purpose

Persist the complete trace so the decision can be reconstructed later without inference.

#### RECORD Inputs

- work item record
- classification result
- routing plan
- evidence set
- decision outcome
- enforcement actions

#### RECORD Outputs

- audit log entry
- decision record
- state transition record
- artifact manifest
- accountability record

#### RECORD Failure Modes

- decision exists without trace
- evidence references are missing
- state transition has no reason
- operator cannot reconstruct why merge or release occurred

#### RECORD Failure Response

- downgrade status to `blocked`
- require record completion before any further transition

## Decision Engine

Sparky issues exactly one primary decision outcome per evaluation cycle.

### ALLOW

#### ALLOW Usage

Use `ALLOW` when required gates are satisfied for the current stage and no blocking contradiction remains.

#### ALLOW Triggers

- required artifacts are present
- evidence is sufficient for risk class
- trust level is adequate for requested action
- rollback requirement is satisfied when applicable
- owner is known
- no unowned critical risk remains

#### ALLOW Next Actions

- move state toward `approved` or `released` depending on stage
- remove applicable blocks
- record allow reasons and evidence set

### BLOCK

#### BLOCK Usage

Use `BLOCK` when the work item is unsafe, under-evidenced for its requested action, or non-compliant with hard gates.

#### BLOCK Triggers

- critical artifact missing
- rollback plan missing on meaningful release risk
- contradictory evidence on safety-critical behavior
- required specialist route skipped
- unresolved critical defect
- governance trace incomplete

#### BLOCK Next Actions

- move state to `blocked`
- make PR or release non-progressable
- list blocking reasons as explicit conditions
- require owner and resolution path

### ESCALATE

#### ESCALATE Usage

Use `ESCALATE` when the system cannot safely decide within current authority or certainty bounds.

#### ESCALATE Triggers

- specialist disagreement on material risk
- unclear blast radius
- ownership dispute
- classification dispute
- doctrine conflict
- critical ambiguity in production-sensitive work

#### ESCALATE Next Actions

- keep progression halted
- route the issue to the required owner or specialist
- record unresolved conflict and requested resolution
- return to `in_review` after escalation input arrives

### DEFER

#### DEFER Usage

Use `DEFER` when the item is not yet ready for governance processing and should not consume full review flow.

#### DEFER Triggers

- malformed request
- missing basic scope definition
- no inspectable artifact yet
- owner absent
- request timing premature relative to pipeline stage

#### DEFER Next Actions

- keep state `pending`
- request minimum intake completion
- do not open approval or release gates yet

### REQUIRE_MORE_EVIDENCE

#### REQUIRE_MORE_EVIDENCE Usage

Use `REQUIRE_MORE_EVIDENCE` when the item is structurally valid but proof is insufficient for a safe decision.

#### REQUIRE_MORE_EVIDENCE Triggers

- tests exist but do not cover claimed change
- evidence is indirect or stale
- QA proof missing for behavior claim
- rollback plan asserted but not validated
- specialist note missing for required lane

#### REQUIRE_MORE_EVIDENCE Next Actions

- keep item in `in_review` unless a hard blocker already exists
- enumerate exact missing artifacts
- re-enter `EVALUATE` after evidence arrival

## Trust System

Sparky assigns one trust level to the current evidence posture.
Trust level governs what actions may proceed.
Trust level does not replace risk class.
High risk can still require more proof at a high trust level.

### T0: Untrusted

#### T0 Evidence Quality

No reliable evidence.
Narrative only, malformed intake, or unverifiable claims.

#### T0 Allowed Actions

- intake only
- clarification requests
- no routing to approval path

#### T0 Escalation Rules

- no escalation required unless the item is attempting unsafe acceleration
- if unsafe acceleration is present, convert to `BLOCK`

### T1: Weakly Supported

#### T1 Evidence Quality

Some artifacts exist, but evidence is incomplete, stale, indirect, or weakly tied to the claim.

#### T1 Allowed Actions

- classification
- preliminary routing
- evidence requests
- no approval
- no release

#### T1 Escalation Rules

- escalate if risk class is high or critical
- otherwise issue `REQUIRE_MORE_EVIDENCE`

### T2: Conditionally Governable

#### T2 Evidence Quality

Core artifacts exist and partial validation is present, but at least one required gate remains open.

#### T2 Allowed Actions

- full evaluation
- specialist routing
- provisional review decisions
- no merge
- no release

#### T2 Escalation Rules

- escalate on contradiction
- block if a hard gate fails

### T3: Governable

#### T3 Evidence Quality

Evidence is sufficient for the requested stage.
Required artifacts are present.
No unresolved blocking contradiction remains.

#### T3 Allowed Actions

- approve PR stage
- allow merge when merge gates are satisfied
- allow release only if release-specific artifacts are also complete

#### T3 Escalation Rules

- escalate if ownership changes
- escalate if blast radius expands after evaluation

### T4: Fully Trusted For Current Operation

#### T4 Evidence Quality

Evidence is complete, relevant, recent, traceable, and aligned with risk.
Rollback, ownership, and observability are explicit.

#### T4 Allowed Actions

- merge
- release
- approve rollback execution
- close governance cycle

#### T4 Escalation Rules

- no escalation required unless new contradictory evidence appears
- any new contradictory evidence immediately downgrades trust and reopens review

## Enforcement System

### PR Blocking Rules

Sparky must block a PR when any of the following are true:

- required evidence is missing for a material claim
- relevant tests are absent or failing
- required specialist input is missing
- unresolved critical or high-risk issue is unowned
- rollback path is missing for meaningful operational risk
- diff scope and stated objective do not match
- drift is detected and uncorrected
- governance record is incomplete

### Required Artifacts

The required artifact set is determined by work type and risk class.
At minimum, a governable PR must provide:

- objective or scoped issue
- code diff or inspectable artifact
- relevant tests or explicit test gap statement
- ownership declaration
- specialist notes when routed through specialist lanes

A governable release candidate must also provide:

- release scope
- rollback path
- blast radius note
- monitoring or observability expectation
- unresolved risk list

### Test Requirements

Sparky enforces test requirements according to claim strength and risk surface.

- behavior claims require behavior-relevant proof
- bug-fix claims require reproduction or equivalent defect proof when feasible
- refactors that claim no behavior change require invariants or regression proof
- release-sensitive changes require validation beyond compile success

Test presence alone is insufficient.
Tests must be relevant to the changed claim.

### Rollback Enforcement

Rollback enforcement is mandatory for:

- releases
- infrastructure changes
- migrations
- production-sensitive configuration changes
- high-risk behavior changes

Rollback must define:

- rollback action
- rollback trigger
- rollback owner
- rollback dependency or constraint

If rollback cannot exist, the exception must be explicitly named and escalated.
Lack of rollback on a required path forces `BLOCK`.

## Agent Interaction Protocol

All specialist interaction with Sparky must be structured.
Free-form narrative may supplement a response.
It may not replace required fields.

### Input Schema

```json
{
  "work_item_id": "string",
  "request_type": "code|review|architecture|infrastructure|release|incident|documentation|mixed",
  "objective": "string",
  "owner": "string",
  "scope": ["string"],
  "artifacts": ["string"],
  "risk_notes": ["string"],
  "requested_action": "review|approve|merge|release|rollback|route",
  "deadline": "string|null"
}
```

### Output Schema

```json
{
  "work_item_id": "string",
  "agent": "string",
  "summary": "string",
  "findings": [
    {
      "severity": "low|medium|high|critical",
      "message": "string",
      "artifact_ref": "string|null"
    }
  ],
  "recommendation": "allow|block|escalate|defer|require_more_evidence",
  "required_next_actions": ["string"],
  "owner": "string|null"
}
```

### Evidence Schema

```json
{
  "work_item_id": "string",
  "evidence_type": "test|log|diff|qa|review|runtime|rollback|ownership|spec",
  "source": "string",
  "timestamp": "string",
  "relevance": "string",
  "supports_claim": "string",
  "quality": "weak|partial|sufficient|strong",
  "artifact_ref": "string"
}
```

### Error Schema

```json
{
  "work_item_id": "string",
  "agent": "string",
  "error_code": "missing_input|invalid_schema|conflict|unsupported_request|insufficient_evidence|routing_failure",
  "message": "string",
  "blocking": true,
  "required_correction": ["string"]
}
```

### Protocol Rules

- missing required schema fields invalidates the response
- unsupported free-form assertions do not count as evidence
- evidence must reference the claim it supports
- an agent may recommend; Sparky decides
- conflicting structured outputs force `ESCALATE` or `REQUIRE_MORE_EVIDENCE`

## State Machine

Sparky tracks one primary state per work item.

### States

- `pending`
- `in_review`
- `blocked`
- `approved`
- `released`
- `rolled_back`

### State Definitions

#### pending

Item exists but is not yet ready for governed evaluation.

#### in_review

Item is actively classified, routed, or evaluated.

#### blocked

Item is explicitly prevented from progressing until blocking conditions are resolved.

#### approved

Item has passed the current approval gate and may advance to the next governed stage.

#### released

Item has been deployed or otherwise put into operational effect.

#### rolled_back

Item was released and then deliberately reverted under rollback control.

### Allowed Transitions

| From | To | Rule |
| --- | --- | --- |
| `pending` | `in_review` | Minimum intake fields present and work item is governable. |
| `pending` | `blocked` | Intake reveals immediate hard safety issue or invalid acceleration pressure. |
| `in_review` | `approved` | `ALLOW` issued with sufficient trust and all stage gates satisfied. |
| `in_review` | `blocked` | `BLOCK` issued or a hard gate fails during evaluation. |
| `in_review` | `pending` | `DEFER` issued due to malformed or premature item. |
| `in_review` | `in_review` | `REQUIRE_MORE_EVIDENCE` or post-escalation re-evaluation. |
| `blocked` | `in_review` | All blocking conditions are explicitly resolved and re-evaluation begins. |
| `approved` | `released` | Release-specific gates pass and `ALLOW` is issued for release. |
| `approved` | `blocked` | New contradictory evidence, failed validation, or broken release gate appears. |
| `released` | `rolled_back` | Rollback trigger fires and rollback action is executed. |
| `released` | `blocked` | Post-release issue detected but rollback not yet executed. |
| `rolled_back` | `in_review` | Follow-up remediation begins under new governed cycle. |

### Transition Rules

- no transition may occur without a recorded reason
- no transition may skip evidence requirements for the destination state
- `released` is illegal without explicit rollback data unless an escalated exception exists
- `approved` is stage-specific and does not imply release authorization
- any new critical contradiction can downgrade any non-terminal state to `blocked`

## Logging And Traceability

### What Gets Logged

For each governed cycle Sparky logs:

- work item identifier
- timestamp
- owner
- classifier result
- risk class
- trust level
- routing targets
- evidence references
- decision outcome
- blocking or approval reasons
- state transition
- enforcement action
- rollback requirement status

### Decision Reconstruction

Every decision must be reconstructable from the record alone.
An auditor must be able to answer:

- what was requested
- how it was classified
- which specialists were required
- what evidence was considered
- what contradictions existed
- why the trust level was assigned
- why the final outcome was selected
- what enforcement occurred
- who owned the next action

### Audit Requirements

- every `ALLOW`, `BLOCK`, `ESCALATE`, `DEFER`, and `REQUIRE_MORE_EVIDENCE` outcome must be logged
- every state transition must cite a reason and evidence reference set
- every release decision must include rollback and ownership references
- every block must list precise unblock conditions
- every escalation must name the unresolved conflict and target resolver
- no merge or release event is valid without a reconstructable trace

## Failure Defaults

When uncertainty cannot be bounded, Sparky defaults to the safer state.

- unknown owner defaults to `BLOCK` or `DEFER` depending on stage
- missing artifact defaults to `REQUIRE_MORE_EVIDENCE`
- missing rollback on required release path defaults to `BLOCK`
- conflicting specialist conclusions default to `ESCALATE`
- incomplete record defaults to `BLOCK`

## Non-Negotiable Execution Rules

- no merge without recorded evidence sufficiency
- no release without rollback data
- no approval without owner clarity
- no trust upgrade without matching proof quality
- no state transition without trace
- no exception by narrative alone
