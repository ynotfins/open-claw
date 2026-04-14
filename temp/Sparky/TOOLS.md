# TOOLS.md

## Scope

This file defines the tools Sparky can use to enforce governance and interact with real systems.
These tools are executable integration contracts.
They are not conceptual abilities.
Each tool maps to a real backend such as GitHub CLI, GitHub REST endpoints, GitHub Actions workflow runs, Prometheus-compatible metrics APIs, local decision logs, or the internal specialist orchestration layer.

## Execution Rules

- every tool invocation must be traceable to a governed work item
- every tool invocation must declare its target system
- every tool invocation must return machine-usable output
- every tool invocation must surface failure as data, not narrative
- every mutating tool must require an explicit owner and decision basis
- every enforcement tool must fail closed when the target system state is unknown

## Shared Conventions

### Shared Input Fields

The following fields are expected across Sparky tools unless a narrower schema is defined:

```json
{
  "work_item_id": "string",
  "owner": "string",
  "repo": "owner/name",
  "reason": "string",
  "requested_by": "string",
  "trace_id": "string"
}
```

### Shared Output Fields

```json
{
  "ok": true,
  "tool_name": "string",
  "backend": "string",
  "trace_id": "string",
  "timestamp": "string",
  "details": {}
}
```

### Shared Failure Shape

```json
{
  "ok": false,
  "tool_name": "string",
  "backend": "string",
  "trace_id": "string",
  "error_code": "string",
  "message": "string",
  "retryable": false,
  "blocking": true
}
```

## GitHub Integration Tools

### Tool: `github.read_pr`

Purpose:
Read pull request state, metadata, review status, mergeability, head SHA, and linked review signals.

Real backend:

- `gh pr view <number> --json number,title,state,isDraft,mergeable,headRefName,headRefOid,author,reviewDecision,reviews,statusCheckRollup`
- fallback: GitHub REST or GraphQL via `gh api`

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "pr_number": 123,
  "include_reviews": true,
  "include_checks": true,
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "github.read_pr",
  "backend": "gh_pr_view",
  "trace_id": "string",
  "details": {
    "pr_number": 123,
    "title": "string",
    "state": "OPEN|CLOSED|MERGED",
    "is_draft": false,
    "mergeable": "MERGEABLE|CONFLICTING|UNKNOWN",
    "head_sha": "string",
    "review_decision": "APPROVED|CHANGES_REQUESTED|REVIEW_REQUIRED|null",
    "status_checks": [
      {
        "context": "string",
        "state": "SUCCESS|FAILURE|PENDING"
      }
    ]
  }
}
```

Failure modes:

- PR does not exist
- repository access denied
- GitHub CLI not authenticated
- mergeability unknown because GitHub has not computed it yet
- check data unavailable due to API scope limits

### Tool: `github.block_pr`

Purpose:
Place a governance block on a PR by leaving a blocking review and, where configured, setting a failing governance status on the PR head SHA.

Real backend:

- `gh pr review <number> --request-changes -b "<reason>"`
- optional enforcement backend: `gh api repos/{owner}/{repo}/statuses/{sha}` with `state=failure` and `context=sparky/governance`

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "pr_number": 123,
  "head_sha": "string",
  "reason": "string",
  "blocking_conditions": ["string"],
  "set_status_check": true,
  "owner": "string",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "github.block_pr",
  "backend": "gh_pr_review_and_status",
  "trace_id": "string",
  "details": {
    "pr_number": 123,
    "review_submitted": true,
    "status_check_set": true,
    "status_context": "sparky/governance",
    "blocking_conditions": ["string"]
  }
}
```

Failure modes:

- review cannot be submitted because review permissions are missing
- status check cannot be written because token lacks `repo:status`
- PR head SHA mismatch causes stale enforcement
- branch protection ignores review-only blocking and no status backend is configured

### Tool: `github.comment_pr`

Purpose:
Write a governance comment onto a pull request without changing merge state.

Real backend:

- `gh pr comment <number> --body "<comment>"`

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "pr_number": 123,
  "body": "string",
  "comment_type": "notice|warning|evidence_request|status_update",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "github.comment_pr",
  "backend": "gh_pr_comment",
  "trace_id": "string",
  "details": {
    "pr_number": 123,
    "comment_url": "string",
    "comment_type": "string"
  }
}
```

Failure modes:

- PR not found
- comment body rejected or truncated by CLI/API limits
- insufficient repo write permission

### Tool: `github.merge_pr`

Purpose:
Merge a PR only after Sparky has issued an `ALLOW` outcome for merge.

Real backend:

- `gh pr merge <number> --merge|--squash|--rebase`
- optional: `--auto` when merge is allowed but waiting on checks

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "pr_number": 123,
  "merge_method": "merge|squash|rebase",
  "auto": false,
  "decision_basis": "string",
  "owner": "string",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "github.merge_pr",
  "backend": "gh_pr_merge",
  "trace_id": "string",
  "details": {
    "pr_number": 123,
    "merged": true,
    "merge_method": "squash",
    "commit_sha": "string|null"
  }
}
```

Failure modes:

- PR not mergeable
- required checks pending or failing
- branch protection rejects merge
- merge method forbidden by repository settings
- governance decision basis missing or stale

### Tool: `github.fetch_diff`

Purpose:
Retrieve the effective diff for PR review, drift analysis, or merge gating.

Real backend:

- `gh pr diff <number>`
- optional: `gh pr diff <number> --name-only`

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "pr_number": 123,
  "name_only": false,
  "exclude_glob": "string|null",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "github.fetch_diff",
  "backend": "gh_pr_diff",
  "trace_id": "string",
  "details": {
    "pr_number": 123,
    "name_only": false,
    "files": ["string"],
    "diff_text": "string"
  }
}
```

Failure modes:

- PR not found
- diff too large for in-memory transport
- backend returns truncated output
- excluded glob removes required review surface by mistake

## CI/CD Integration Tools

### Tool: `ci.check_build_status`

Purpose:
Inspect the current CI/CD state for a branch, PR head SHA, workflow run, or named pipeline.

Real backend:

- `gh run list`
- `gh run view <run-id> --exit-status`
- optional: `gh run view <run-id> --verbose`

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "branch": "string|null",
  "head_sha": "string|null",
  "run_id": 123456789,
  "workflow_name": "string|null",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "ci.check_build_status",
  "backend": "gh_run_view",
  "trace_id": "string",
  "details": {
    "run_id": 123456789,
    "workflow_name": "string",
    "status": "queued|in_progress|completed",
    "conclusion": "success|failure|cancelled|timed_out|null",
    "jobs": [
      {
        "name": "string",
        "status": "string",
        "conclusion": "string|null"
      }
    ]
  }
}
```

Failure modes:

- no workflow run matches the supplied selectors
- run status stale because run list is cached or outdated
- CLI cannot resolve run due to missing repository context

### Tool: `ci.trigger_pipeline`

Purpose:
Start a CI/CD workflow or redeploy pipeline from a governed decision.

Real backend:

- `gh workflow run <workflow-name-or-id> --ref <branch>`
- optional inputs: `-f key=value`

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "workflow": "string",
  "ref": "string",
  "inputs": {
    "key": "value"
  },
  "reason": "string",
  "owner": "string",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "ci.trigger_pipeline",
  "backend": "gh_workflow_run",
  "trace_id": "string",
  "details": {
    "workflow": "string",
    "ref": "string",
    "dispatch_requested": true
  }
}
```

Failure modes:

- workflow file not found
- workflow_dispatch not enabled for target workflow
- ref invalid
- caller lacks workflow write permissions

### Tool: `ci.fetch_test_results`

Purpose:
Collect machine-usable CI test outcomes, including failed jobs, summaries, and downloaded evidence artifacts.

Real backend:

- `gh run view <run-id> --log-failed`
- `gh run download <run-id> --name <artifact>`

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "run_id": 123456789,
  "artifact_names": ["string"],
  "include_failed_logs": true,
  "download_dir": "string",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "ci.fetch_test_results",
  "backend": "gh_run_view_and_download",
  "trace_id": "string",
  "details": {
    "run_id": 123456789,
    "failed_jobs": ["string"],
    "failed_log_excerpt": "string|null",
    "downloaded_artifacts": ["string"],
    "test_summary": {
      "passed": 0,
      "failed": 0,
      "skipped": 0
    }
  }
}
```

Failure modes:

- requested artifact not present in run
- logs unavailable because run expired or retention passed
- test summary cannot be derived because artifacts are unstructured

## Evidence Collection Tools

### Tool: `evidence.fetch_logs`

Purpose:
Retrieve logs required to validate failures, release degradation, or runtime claims.

Real backend adapters:

- GitHub Actions job logs via `gh run view <run-id> --log` or `gh run view --job <job-id> --log`
- Loki-compatible log API via `GET /loki/api/v1/query_range`

Input schema:

```json
{
  "work_item_id": "string",
  "source_type": "github_actions_run|github_actions_job|loki_http",
  "repo": "owner/name|null",
  "run_id": 123456789,
  "job_id": 987654321,
  "query": "string|null",
  "start": "RFC3339 timestamp|null",
  "end": "RFC3339 timestamp|null",
  "limit": 500,
  "endpoint_url": "string|null",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "evidence.fetch_logs",
  "backend": "gh_run_view|loki_http",
  "trace_id": "string",
  "details": {
    "source_type": "string",
    "log_count": 0,
    "entries": [
      {
        "timestamp": "string",
        "stream": "string",
        "message": "string"
      }
    ]
  }
}
```

Failure modes:

- log retention expired
- endpoint authentication missing
- query window too large and backend truncates
- requested run or job does not exist

### Tool: `evidence.fetch_test_artifacts`

Purpose:
Retrieve durable evidence artifacts such as screenshots, reports, coverage outputs, junit XML, or packaged traces.

Real backend:

- `gh run download <run-id> --name <artifact>`
- fallback: GitHub Actions artifact REST download

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "run_id": 123456789,
  "artifact_names": ["string"],
  "download_dir": "string",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "evidence.fetch_test_artifacts",
  "backend": "gh_run_download",
  "trace_id": "string",
  "details": {
    "run_id": 123456789,
    "artifacts_requested": ["string"],
    "artifacts_downloaded": ["string"],
    "paths": ["string"]
  }
}
```

Failure modes:

- artifact missing
- artifact expired
- download directory not writable
- artifact content corrupt or incomplete

### Tool: `evidence.fetch_runtime_metrics`

Purpose:
Query live or recent runtime metrics to validate behavior, degradation, rollback triggers, or release health.

Real backend adapters:

- Prometheus-compatible HTTP API via `GET /api/v1/query`
- Prometheus range queries via `GET /api/v1/query_range`

Input schema:

```json
{
  "work_item_id": "string",
  "source_type": "prometheus_instant|prometheus_range",
  "endpoint_url": "string",
  "query": "string",
  "time": "RFC3339 timestamp|null",
  "start": "RFC3339 timestamp|null",
  "end": "RFC3339 timestamp|null",
  "step": "string|null",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "evidence.fetch_runtime_metrics",
  "backend": "prometheus_http",
  "trace_id": "string",
  "details": {
    "query": "string",
    "result_type": "vector|matrix|scalar|string",
    "series": [
      {
        "metric": {
          "__name__": "string"
        },
        "values": [["timestamp", "value"]]
      }
    ]
  }
}
```

Failure modes:

- metrics endpoint unavailable
- query invalid
- auth token missing
- result cardinality too high for safe transport
- metric does not exist for requested service

## Routing And Orchestration Tools

### Tool: `orchestration.assign_specialist`

Purpose:
Assign a governed work item to the correct specialist lane and create a dispatchable handoff payload.

Real backend:

- internal route resolver from `employees/Sparky/tools.ts` via `routeSuggestion(payload)`
- dispatch target: subagent invocation or task queue with selected specialist packet

Input schema:

```json
{
  "work_item_id": "string",
  "task_type": "task_routing|pr_governance|merge_gate|release_gate|quality_enforcement|evidence_validation|drift_audit",
  "payload": {
    "type": "string",
    "domain": "string",
    "objective": "string",
    "current_state": "string"
  },
  "context": {},
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "orchestration.assign_specialist",
  "backend": "sparky_route_resolver",
  "trace_id": "string",
  "details": {
    "specialist": "string",
    "dispatch_packet": {
      "objective": "string",
      "evidence": ["string"],
      "blockers": ["string"]
    }
  }
}
```

Failure modes:

- routing payload too weak to classify
- route result generic because no domain signals were provided
- specialist packet missing required evidence fields for target task type

### Tool: `orchestration.request_review`

Purpose:
Request a formal specialist or human review on a PR and bind the request to a governed reason.

Real backend:

- `gh pr edit <number> --add-reviewer <login>`
- fallback: `gh api repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers`

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "pr_number": 123,
  "reviewers": ["string"],
  "reason": "string",
  "required_by": "architecture|qa|security|release|governance",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "orchestration.request_review",
  "backend": "gh_pr_edit_reviewers",
  "trace_id": "string",
  "details": {
    "pr_number": 123,
    "reviewers_requested": ["string"],
    "required_by": "string"
  }
}
```

Failure modes:

- reviewer handle invalid
- reviewer lacks access to the repository
- PR already closed
- request rejected by branch or org policy

### Tool: `orchestration.escalate_issue`

Purpose:
Escalate a blocked or disputed work item to a higher authority or cross-functional resolver with full context and evidence links.

Real backend:

- create or update GitHub issue via `gh issue create` or `gh issue comment`
- internal escalation packet targeting delivery, architecture, release, or incident authority

Input schema:

```json
{
  "work_item_id": "string",
  "repo": "owner/name",
  "title": "string",
  "body": "string",
  "labels": ["escalation"],
  "target_authority": "delivery|architecture|release|security|incident",
  "linked_pr": 123,
  "linked_issue": 456,
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "orchestration.escalate_issue",
  "backend": "gh_issue_create_or_update",
  "trace_id": "string",
  "details": {
    "issue_number": 456,
    "target_authority": "string",
    "escalation_open": true
  }
}
```

Failure modes:

- escalation target unclear
- issue creation permissions missing
- escalation opened without adequate evidence links
- duplicate escalation opened for same unresolved conflict

## Audit And Logging Tools

### Tool: `audit.record_decision`

Purpose:
Persist a governed decision to Sparky’s local decision record and optionally attach the result to the PR or issue context.

Real backend:

- append structured entry to `employees/Sparky/DECISION_LOG.md`
- optional remote echo via `gh pr comment` or `gh issue comment`

Input schema:

```json
{
  "work_item_id": "string",
  "decision": "ALLOW|BLOCK|ESCALATE|DEFER|REQUIRE_MORE_EVIDENCE",
  "reason": "string",
  "trust_level": "T0|T1|T2|T3|T4",
  "state_from": "pending|in_review|blocked|approved|released|rolled_back",
  "state_to": "pending|in_review|blocked|approved|released|rolled_back",
  "evidence_refs": ["string"],
  "owner": "string",
  "write_remote_comment": false,
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "audit.record_decision",
  "backend": "local_decision_log",
  "trace_id": "string",
  "details": {
    "decision_logged": true,
    "log_target": "employees/Sparky/DECISION_LOG.md",
    "remote_comment_written": false
  }
}
```

Failure modes:

- local log not writable
- decision missing required evidence references
- state transition invalid for current workflow stage
- remote comment write fails after local write succeeds

### Tool: `audit.fetch_history`

Purpose:
Retrieve prior decisions for the same work item, PR, branch, or governance surface.

Real backend:

- local decision log scan from `employees/Sparky/DECISION_LOG.md`
- optional GitHub timeline context via `gh pr view --json reviews,comments,commits`

Input schema:

```json
{
  "work_item_id": "string|null",
  "repo": "owner/name|null",
  "pr_number": 123,
  "branch": "string|null",
  "surface": "pr|merge|release|drift|rollback|evidence",
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "audit.fetch_history",
  "backend": "local_log_plus_github",
  "trace_id": "string",
  "details": {
    "matches": [
      {
        "timestamp": "string",
        "decision": "string",
        "reason": "string",
        "owner": "string",
        "evidence_refs": ["string"]
      }
    ]
  }
}
```

Failure modes:

- history fragmented across local and remote systems
- work item lacks stable identifier
- local decision log too sparse to reconstruct prior decisions

### Tool: `audit.compare_previous_decisions`

Purpose:
Compare the current decision candidate against prior governance outcomes to detect inconsistency, drift, or precedent violations.

Real backend:

- local comparison against `DECISION_LOG.md`
- optional GitHub timeline comparison for the same PR or branch

Input schema:

```json
{
  "work_item_id": "string",
  "current_decision": "ALLOW|BLOCK|ESCALATE|DEFER|REQUIRE_MORE_EVIDENCE",
  "current_reason": "string",
  "surface": "pr|merge|release|drift|rollback|evidence",
  "repo": "owner/name|null",
  "pr_number": 123,
  "trace_id": "string"
}
```

Output schema:

```json
{
  "ok": true,
  "tool_name": "audit.compare_previous_decisions",
  "backend": "local_precedent_compare",
  "trace_id": "string",
  "details": {
    "consistent_with_history": true,
    "matches": ["string"],
    "conflicts": ["string"],
    "requires_escalation": false
  }
}
```

Failure modes:

- prior decisions lack enough structure for comparison
- precedent set itself may be low-quality or stale
- current decision surface does not match historical categories cleanly

## Backend Availability Rules

- if `gh` is unavailable or unauthenticated, GitHub and GitHub Actions tools must fail explicitly
- if status-write permissions are missing, `github.block_pr` must still request changes and report degraded enforcement
- if metrics or log endpoints are unreachable, evidence tools must return a blocking failure for workflows that depend on them
- if the local decision log cannot be written, mutating governance actions must be treated as incomplete until traceability is restored

## Tool Selection Rules

- use GitHub tools for repository-state truth, PR state, diff access, reviews, comments, and merges
- use CI/CD tools for workflow state, reruns, and test artifacts
- use evidence tools for logs, artifacts, and runtime metrics
- use orchestration tools for specialist routing, formal review requests, and escalation
- use audit tools whenever Sparky changes a state, blocks a path, approves a path, or compares current action to precedent

## Non-Negotiable Tool Guarantees

- no merge without a successful read of current PR state
- no block without recording blocking conditions
- no release approval without live evidence collection capability or an explicit degraded-mode record
- no escalation without a traceable issue or authority target
- no decision is complete until `audit.record_decision` succeeds
