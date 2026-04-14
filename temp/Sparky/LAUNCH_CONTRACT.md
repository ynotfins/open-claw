# LAUNCH_CONTRACT.md

## Scope

This file defines how Sparky is executed inside OpenClaw.
It is an integration contract for runtime invocation, data exchange, downstream consumption, permissions, and failure handling.
It is not a philosophy document and not a workflow summary.

The current executable surfaces are:

- core engine: `employees/Sparky/agent.ts` via `runSparky(input)`
- OpenClaw-facing entrypoint: `employees/Sparky/live/index.ts` via `executeSparky(input)`
- runtime types: `employees/Sparky/schema.ts`
- execution backends: `employees/Sparky/tools.ts`

## 1. Invocation Contract

### Canonical Entrypoint

OpenClaw must invoke Sparky through:

```ts
executeSparky(input: {
  taskType: string;
  payload: Record<string, unknown>;
  context?: Record<string, unknown>;
})
```

`executeSparky()` is the launch boundary for OpenClaw.
It delegates to `runSparky()` and returns the resulting `SparkyDecision` plus helper metadata:

- `requiredEvidence`
- `blockingClass`

### Core Engine Signature

The execution engine runs at:

```ts
runSparky(input: SparkyInput): Promise<SparkyDecision>
```

### Input Schema

The current canonical runtime input is defined by `SparkyInput` in `employees/Sparky/schema.ts`:

```json
{
  "taskType": "task_routing|pr_governance|merge_gate|release_gate|quality_enforcement|evidence_validation|drift_audit|hotfix_emergency|string",
  "payload": {
    "work_item_id": "string",
    "objective": "string",
    "owner": "string",
    "repo": "owner/name",
    "pr_number": 123,
    "trace_id": "string"
  },
  "context": {
    "trace_id": "string",
    "state": "pending|in_review|blocked|approved|released|rolled_back"
  }
}
```

### Required Fields

OpenClaw must provide:

- `taskType`
- `payload`

At runtime, Sparky treats these as operationally required for full governance:

- `payload.objective`
- `payload.owner`
- `payload.trace_id` or `context.trace_id`

When governance is targeting a GitHub PR path, these are also required:

- `payload.repo`
- `payload.pr_number`

### Optional Fields

OpenClaw may provide:

- `context`
- `context.state`
- `payload.claim`
- `payload.tests`
- `payload.rollback_plan`
- `payload.conflicting_signals`
- `payload.degraded_mode`
- `payload.unavailable_signals`
- `payload.production_sensitive`
- `payload.security_sensitive`
- `payload.boundary_change`
- `payload.requested_action`

Optional fields are not decorative.
They influence classification, trust level, escalation behavior, and enforcement.

### Normalization Rules

Sparky normalizes launch input before governance begins:

- if `payload.trace_id` exists, it becomes the execution trace ID
- else if `context.trace_id` exists, it becomes the execution trace ID
- else Sparky generates `sparky-<timestamp>`
- if `payload.work_item_id` is absent, Sparky synthesizes `work-<trace_id>`
- if `context.state` is absent or invalid, Sparky defaults to `pending`
- if `taskType` is blank, Sparky infers it from `payload.requested_action`, `payload.type`, and `payload.domain`

## 2. Execution Flow

### Trigger Path

OpenClaw triggers Sparky by calling `executeSparky(input)` inside the employee runtime.
`executeSparky()` then:

1. forwards the request into `runSparky()`
2. receives a `SparkyDecision`
3. appends `requiredEvidence` from `getRequiredEvidence(taskType)`
4. appends `blockingClass` from `isBlockingTaskType(taskType)`
5. returns the combined response to the calling OpenClaw runtime

### Internal Engine Flow

`runSparky()` executes the exact control loop implemented in `employees/Sparky/agent.ts`:

1. `INPUT`
2. `CLASSIFY`
3. `ROUTE`
4. `EVALUATE`
5. `DECIDE`
6. `ENFORCE`
7. `RECORD`

This is not descriptive only.
It is the order of execution in the current runtime.

### Input Sources

OpenClaw may launch Sparky from any of the following governed sources:

- pull request events
- merge-gate tasks
- release-approval tasks
- hotfix or emergency tasks
- drift-audit tasks
- evidence-validation tasks
- direct agent-to-agent routing calls

The current implementation is especially concrete for PR-based governance because `tools.ts` already implements live GitHub enforcement functions.

### Practical Trigger Examples

#### PR Event

OpenClaw receives a PR review or merge-gate event and launches:

```json
{
  "taskType": "pr_governance",
  "payload": {
    "work_item_id": "pr-123-review",
    "objective": "Review PR for governance readiness",
    "owner": "sparky",
    "repo": "ynotfins/Formula_One_AI_Factory",
    "pr_number": 123,
    "trace_id": "trace-pr-123"
  },
  "context": {
    "state": "pending"
  }
}
```

#### Merge Task

OpenClaw launches merge gating after review:

```json
{
  "taskType": "merge_gate",
  "payload": {
    "work_item_id": "pr-123-merge",
    "objective": "Authorize merge if governance gates pass",
    "owner": "sparky",
    "repo": "ynotfins/Formula_One_AI_Factory",
    "pr_number": 123,
    "tests": "ci-run-98765",
    "trace_id": "trace-merge-123"
  },
  "context": {
    "state": "approved"
  }
}
```

#### Workflow / Release Task

OpenClaw launches release review from a deployment workflow or release queue:

```json
{
  "taskType": "release_gate",
  "payload": {
    "work_item_id": "release-2026-04-01",
    "objective": "Approve release candidate",
    "owner": "release-operator",
    "repo": "ynotfins/Formula_One_AI_Factory",
    "rollback_plan": "rollback to previous release artifact",
    "tests": "ci-run-99881",
    "trace_id": "trace-release-2026-04-01"
  },
  "context": {
    "state": "approved"
  }
}
```

## 3. Output Contract

### Canonical Output

`runSparky()` returns `Promise<SparkyDecision>`.
`executeSparky()` returns:

```json
{
  "...SparkyDecision": true,
  "requiredEvidence": ["string"],
  "blockingClass": true
}
```

### `SparkyDecision` Structure

The current runtime structure in `employees/Sparky/schema.ts` is:

```json
{
  "decision": "ALLOW|BLOCK|ESCALATE|DEFER|REQUIRE_MORE_EVIDENCE",
  "confidence": 0.78,
  "blocked": false,
  "requiresEscalation": false,
  "actions": ["string"],
  "reasons": ["string"],
  "trace_id": "string",
  "state_from": "pending|in_review|blocked|approved|released|rolled_back",
  "state_to": "pending|in_review|blocked|approved|released|rolled_back",
  "classification": {
    "taskType": "string",
    "riskLevel": "low|medium|high|critical",
    "requiredEvidence": ["string"],
    "blockingClass": true
  },
  "routing": {
    "specialist": "string",
    "routeReason": "string"
  },
  "evaluation": {
    "missingEvidence": ["string"],
    "conflictingSignals": ["string"],
    "trustLevel": "T0|T1|T2|T3|T4",
    "evidenceSufficient": true,
    "reasons": ["string"]
  },
  "enforcement": {},
  "record": {},
  "trace": {
    "traceId": "string",
    "controlLoop": ["INPUT", "CLASSIFY", "ROUTE", "EVALUATE", "DECIDE", "ENFORCE", "RECORD"]
  }
}
```

### Downstream Consumption Rules

OpenClaw and any downstream consumer must treat the response mechanically:

- `decision` drives next-step routing
- `blocked` controls whether work may continue
- `requiresEscalation` controls whether a higher authority path must open
- `classification.requiredEvidence` defines missing-proof requests
- `routing.specialist` identifies the next specialist lane
- `evaluation.trustLevel` determines how much action is admissible
- `enforcement` indicates whether the side effect actually succeeded
- `record` indicates whether traceability was successfully persisted

### Downstream Action Mapping

- `ALLOW`
  - continue governed progression
  - if task is `merge_gate`, merge may already have been attempted by enforcement
  - if task is `release_gate`, downstream release systems may proceed only if state and enforcement are consistent

- `BLOCK`
  - stop progression
  - surface `actions` as unblock conditions

- `ESCALATE`
  - open or continue escalation handling
  - route to the named authority path

- `DEFER`
  - return to intake or queue without approval progression

- `REQUIRE_MORE_EVIDENCE`
  - preserve the item in active review
  - collect the requested evidence before relaunching Sparky

## 4. Integration Points

### GitHub Events

The current runtime integrates concretely with GitHub through `tools.ts`:

- `github.read_pr`
- `github.block_pr`
- `github.comment_pr`
- `github.merge_pr`
- `github.fetch_diff`

These are appropriate for launch from:

- PR opened
- PR synchronized
- review requested
- merge requested
- post-review governance pass

### CI/CD Triggers

OpenClaw may launch Sparky from CI/CD or release workflows when:

- a build completes
- a release candidate is prepared
- test evidence is attached
- a deployment approval gate is reached
- a rollback trigger is raised

Current code does not yet execute CI/CD tools directly from `agent.ts`, but the launch contract must allow those tasks to enter through `taskType` plus evidence-bearing payloads.

### Agent-to-Agent Calls

OpenClaw may launch Sparky from another agent when a specialist cannot decide safely and needs governance.

Current runtime support:

- routing uses `routeSuggestion()`
- escalation uses `orchestration.escalate_issue()`
- decision recording uses `audit.record_decision()`

Expected agent-to-agent use cases:

- specialist requests governance review
- specialist reports conflicting signals
- specialist requests merge or release decision
- specialist requests escalation due to missing owner or missing proof

### OpenClaw Runtime Boundary

OpenClaw should treat `employees/Sparky/live/index.ts` as the stable runtime boundary.
If internal engine code changes, `executeSparky()` remains the integration seam.

## 5. Failure Handling

### Engine Failure

If `runSparky()` cannot complete a governed action safely, the result must fail closed.
In practice:

- missing evidence drives `REQUIRE_MORE_EVIDENCE` or `BLOCK`
- conflicting signals drive `ESCALATE`
- record failure converts the decision to `BLOCK`
- enforcement failure can convert `ALLOW` to `BLOCK`

### Tool Failure

Tool failures are returned as structured objects from `tools.ts`.
They are not thrown raw.
`agent.ts` inspects these failures and changes the decision path accordingly.

### Launch-Time Failure

If OpenClaw provides malformed input:

- non-blocking work may be `DEFER`red
- blocking work is `BLOCK`ed or `REQUIRE_MORE_EVIDENCE`

### Fallback Mechanisms

The current runtime uses these fallbacks:

- `github.read_pr` falls back from `gh pr view` to `gh api`
- `github.block_pr` still submits a blocking review even if status-write is unavailable
- generated trace IDs and work item IDs are synthesized when omitted
- missing context state falls back to `pending`

### Required OpenClaw Fallback Behavior

If Sparky returns a tool failure inside `enforcement` or `record`, OpenClaw must not pretend the governance action succeeded.
OpenClaw must treat the item as blocked or escalated according to the returned `SparkyDecision`.

## 6. Security + Permissions

### Required GitHub Permissions

To execute the currently implemented tools, the runtime must have permissions equivalent to:

- pull requests: read and write
- issues: read and write
- contents: read
- actions: read
- commit statuses: write

If review requests or reviewer assignment are added to the launch path, reviewer-management permissions are also required.

### `gh` Authentication Requirements

`gh` must be authenticated before Sparky is launched for GitHub-governed tasks.
Authentication may be provided by:

- `GH_TOKEN`
- `GITHUB_TOKEN`
- a pre-authenticated `gh auth login` session in the runner

### Restricted Actions

Sparky must not be granted unrestricted admin behavior by default.
Restricted actions include:

- admin merge bypass
- branch protection bypass
- force push
- repository settings mutation
- secret creation or rotation
- arbitrary production mutation outside declared tools

### Launch Restriction Rule

If OpenClaw cannot prove required GitHub permissions for a task that needs enforcement, it must still allow Sparky to evaluate, but it must expect enforcement to fail closed.

## 7. Runtime Requirements

### Node Version

Validated runtime in this environment:

- Node.js `v22.18.0`

OpenClaw should run Sparky on Node 22+ if it expects the current direct `.ts` execution behavior to work consistently in the same way it was validated here.

### GitHub CLI

Required for the currently implemented governance tools:

- `gh` CLI installed
- `gh` available on `PATH`
- `gh` authenticated to the target repository context

### File System Requirements

OpenClaw must run Sparky with access to:

- the checked-out repository
- `employees/Sparky/DECISION_LOG.md` for local decision recording
- `employees/Sparky/*.ts` runtime files

### Environment Variables

The runtime may use:

- `GH_TOKEN` for noninteractive GitHub CLI authentication
- `GITHUB_TOKEN` when running in GitHub Actions or compatible automation

No additional Sparky-specific environment variable is currently required by code for basic launch.

### Launch Preconditions

Before OpenClaw launches Sparky for a GitHub-governed task, it must verify:

- Node runtime is available
- `gh` is installed
- GitHub auth is present
- repo checkout exists
- the launch payload includes objective, owner, and traceable context

## Operational Notes

- `WORKFLOWS.md` is the logic reference for scenario intent
- `OPERATING_RULES.md` is the execution constraint document
- `agent.ts` is the executable control loop
- `tools.ts` is the executable side-effect surface
- `live/index.ts` is the OpenClaw launch boundary

If any of these diverge, OpenClaw must treat the code as authoritative for runtime behavior and log the documentation drift for correction.
