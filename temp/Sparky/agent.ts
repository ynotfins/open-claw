import type {
  SparkyClassification,
  SparkyDecision,
  SparkyDecisionOutcome,
  SparkyEvaluation,
  SparkyInput,
  SparkyRiskLevel,
  SparkyRouting,
  SparkyState,
  SparkyTrustLevel,
} from "./schema.ts";
import {
  audit,
  degradedModeReason,
  getRequiredEvidence,
  github,
  isBlockingTaskType,
  missingEvidence,
  orchestration,
  routeSuggestion,
  taskRiskNotes,
} from "./tools.ts";

type ControlLoopStep = "INPUT" | "CLASSIFY" | "ROUTE" | "EVALUATE" | "DECIDE" | "ENFORCE" | "RECORD";

type NormalizedInput = {
  traceId: string;
  workItemId: string;
  taskType: string;
  payload: Record<string, unknown>;
  context: Record<string, unknown>;
  stateFrom: SparkyState;
  objective: string | null;
  owner: string | null;
  repo: string | null;
  prNumber: number | null;
};

type PrReadSnapshot =
  | {
      ok: true;
      pr_number: number;
      title: string;
      state: "OPEN" | "CLOSED" | "MERGED";
      is_draft: boolean;
      mergeable: "MERGEABLE" | "CONFLICTING" | "UNKNOWN";
      head_sha: string;
      review_decision: "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | null;
      status_checks: Array<{ context: string; state: "SUCCESS" | "FAILURE" | "PENDING" }>;
    }
  | {
      ok: false;
      error: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function asPositiveInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(String).map((entry) => entry.trim()).filter(Boolean);
}

function normalizeState(value: unknown): SparkyState {
  if (
    value === "pending" ||
    value === "in_review" ||
    value === "blocked" ||
    value === "approved" ||
    value === "released" ||
    value === "rolled_back"
  ) {
    return value;
  }
  return "pending";
}

function buildTraceId(input: SparkyInput): string {
  const payloadTrace = isRecord(input.payload) && hasText(input.payload.trace_id) ? input.payload.trace_id : null;
  const contextTrace = isRecord(input.context) && hasText(input.context.trace_id) ? input.context.trace_id : null;
  if (payloadTrace) {
    return payloadTrace;
  }
  if (contextTrace) {
    return contextTrace;
  }
  return `sparky-${Date.now()}`;
}

function inferTaskType(taskType: string, payload: Record<string, unknown>): string {
  if (hasText(taskType)) {
    return taskType;
  }

  const requestedAction = String(payload.requested_action ?? "").toLowerCase();
  const kind = `${String(payload.type ?? "")} ${String(payload.domain ?? "")}`.toLowerCase();

  if (requestedAction.includes("merge")) return "merge_gate";
  if (requestedAction.includes("release") || requestedAction.includes("deploy")) return "release_gate";
  if (requestedAction.includes("review") || kind.includes("pr")) return "pr_governance";
  if (kind.includes("drift")) return "drift_audit";
  if (kind.includes("evidence")) return "evidence_validation";
  if (kind.includes("hotfix") || kind.includes("emergency")) return "hotfix_emergency";
  return "task_routing";
}

function normalizeInput(input: SparkyInput): NormalizedInput {
  const payload = isRecord(input.payload) ? input.payload : {};
  const context = isRecord(input.context) ? input.context : {};
  const traceId = buildTraceId(input);

  const workItemId =
    (hasText(payload.work_item_id) && payload.work_item_id) ||
    (hasText(context.work_item_id) && context.work_item_id) ||
    `work-${traceId}`;

  const taskType = inferTaskType(String(input.taskType ?? ""), payload);
  const objective =
    (hasText(payload.objective) && payload.objective) ||
    (hasText(payload.claim) && payload.claim) ||
    (hasText(context.objective) && context.objective) ||
    null;

  const owner =
    (hasText(payload.owner) && payload.owner) ||
    (hasText(context.owner) && context.owner) ||
    null;

  const repo =
    (hasText(payload.repo) && payload.repo) ||
    (hasText(context.repo) && context.repo) ||
    null;

  const prNumber = asPositiveInteger(payload.pr_number) ?? asPositiveInteger(context.pr_number);

  return {
    traceId,
    workItemId,
    taskType,
    payload,
    context,
    stateFrom: normalizeState(context.state),
    objective,
    owner,
    repo,
    prNumber,
  };
}

function determineRiskLevel(taskType: string, payload: Record<string, unknown>): SparkyRiskLevel {
  const securitySensitive = payload.security_sensitive === true;
  const productionSensitive = payload.production_sensitive === true || payload.production_down === true;
  const hotfix = payload.emergency === true || taskType === "hotfix_emergency";
  const multiSurface = payload.multi_surface === true || payload.boundary_change === true;

  if (securitySensitive || (productionSensitive && hotfix)) {
    return "critical";
  }
  if (taskType === "release_gate" || taskType === "merge_gate" || productionSensitive || hotfix || multiSurface) {
    return "high";
  }
  if (taskType === "pr_governance" || taskType === "evidence_validation" || taskType === "drift_audit") {
    return "medium";
  }
  return "low";
}

function classify(input: NormalizedInput): SparkyClassification {
  return {
    taskType: input.taskType,
    riskLevel: determineRiskLevel(input.taskType, input.payload),
    requiredEvidence: getRequiredEvidence(input.taskType),
    blockingClass: isBlockingTaskType(input.taskType),
  };
}

function route(input: NormalizedInput): SparkyRouting {
  const specialist = routeSuggestion(input.payload);
  return {
    specialist,
    routeReason: `Route ${input.taskType} to ${specialist} based on payload type, domain, and governance surface`,
  };
}

async function loadPrSnapshot(input: NormalizedInput): Promise<PrReadSnapshot | null> {
  if (!input.repo || !input.prNumber) {
    return null;
  }
  if (!["pr_governance", "merge_gate", "release_gate"].includes(input.taskType)) {
    return null;
  }

  const pr = await github.read_pr({
    work_item_id: input.workItemId,
    repo: input.repo,
    pr_number: input.prNumber,
    include_reviews: true,
    include_checks: true,
    trace_id: input.traceId,
  });

  if (!pr.ok) {
    return { ok: false, error: pr.message };
  }

  return {
    ok: true,
    pr_number: pr.details.pr_number,
    title: pr.details.title,
    state: pr.details.state,
    is_draft: pr.details.is_draft,
    mergeable: pr.details.mergeable,
    head_sha: pr.details.head_sha,
    review_decision: pr.details.review_decision,
    status_checks: pr.details.status_checks,
  };
}

function collectConflictingSignals(
  input: NormalizedInput,
  prSnapshot: PrReadSnapshot | null,
): string[] {
  const conflicts = asStringArray(input.payload.conflicting_signals);

  if (prSnapshot?.ok && input.taskType === "merge_gate") {
    if (prSnapshot.review_decision === "CHANGES_REQUESTED") {
      conflicts.push("Pull request still has changes requested");
    }
    if (prSnapshot.status_checks.some((check) => check.state === "FAILURE")) {
      conflicts.push("One or more PR status checks are failing");
    }
  }

  if (prSnapshot && !prSnapshot.ok && isBlockingTaskType(input.taskType)) {
    conflicts.push(`PR lookup failed: ${prSnapshot.error}`);
  }

  return Array.from(new Set(conflicts));
}

function determineTrustLevel(args: {
  input: NormalizedInput;
  classification: SparkyClassification;
  missing: string[];
  conflictingSignals: string[];
  prSnapshot: PrReadSnapshot | null;
}): SparkyTrustLevel {
  const { input, classification, missing, conflictingSignals, prSnapshot } = args;
  const missingCoreInput = !input.objective || !input.owner;

  if (missingCoreInput) {
    return "T0";
  }
  if (missing.length > 0 && (missing.includes("diff") || missing.includes("owner") || missing.includes("objective"))) {
    return "T1";
  }
  if (missing.length > 0 || input.payload.degraded_mode === true || conflictingSignals.length > 0) {
    return "T2";
  }
  if (classification.riskLevel === "high" || classification.riskLevel === "critical") {
    if (input.taskType === "release_gate" && !hasText(input.payload.rollback_plan)) {
      return "T2";
    }
    return "T3";
  }
  if (prSnapshot?.ok && prSnapshot.mergeable === "MERGEABLE" && prSnapshot.status_checks.every((check) => check.state !== "FAILURE")) {
    return "T4";
  }
  return "T3";
}

function evaluate(args: {
  input: NormalizedInput;
  classification: SparkyClassification;
  prSnapshot: PrReadSnapshot | null;
}): SparkyEvaluation {
  const missing = missingEvidence(args.classification.taskType, args.input.payload);
  const conflictingSignals = collectConflictingSignals(args.input, args.prSnapshot);
  const trustLevel = determineTrustLevel({
    input: args.input,
    classification: args.classification,
    missing,
    conflictingSignals,
    prSnapshot: args.prSnapshot,
  });

  const reasons: string[] = [];
  if (missing.length > 0) {
    reasons.push(`Missing required evidence: ${missing.join(", ")}`);
  }
  if (args.input.payload.degraded_mode === true) {
    const unavailable = asStringArray(args.input.payload.unavailable_signals);
    reasons.push(degradedModeReason(unavailable.length > 0 ? unavailable : ["unknown signals"]));
  }
  if (conflictingSignals.length > 0) {
    reasons.push(`Conflicting signals detected: ${conflictingSignals.join("; ")}`);
  }
  reasons.push(...taskRiskNotes(args.classification.taskType));

  return {
    missingEvidence: missing,
    conflictingSignals,
    trustLevel,
    evidenceSufficient: missing.length === 0 && conflictingSignals.length === 0,
    reasons,
  };
}

function decide(args: {
  input: NormalizedInput;
  classification: SparkyClassification;
  evaluation: SparkyEvaluation;
  prSnapshot: PrReadSnapshot | null;
}): {
  decision: SparkyDecisionOutcome;
  reasons: string[];
  actions: string[];
  requiresEscalation: boolean;
} {
  const { input, classification, evaluation, prSnapshot } = args;
  const reasons = [...evaluation.reasons];
  const actions: string[] = [];

  const missingCoreInput = !input.objective || !input.owner;
  if (missingCoreInput && !classification.blockingClass) {
    actions.push("Provide objective", "Provide owner");
    return {
      decision: "DEFER",
      reasons: [...reasons, "Input is not governable yet"],
      actions,
      requiresEscalation: false,
    };
  }

  if (!input.owner && ["merge_gate", "release_gate", "hotfix_emergency"].includes(classification.taskType)) {
    actions.push("Assign accountable owner");
    return {
      decision: "BLOCK",
      reasons: [...reasons, "Blocking workflow cannot proceed without owner"],
      actions,
      requiresEscalation: false,
    };
  }

  if (evaluation.conflictingSignals.length > 0) {
    actions.push("Resolve conflicting specialist or system signals");
    return {
      decision: "ESCALATE",
      reasons: [...reasons, "Material contradiction requires escalation"],
      actions,
      requiresEscalation: true,
    };
  }

  if (input.payload.degraded_mode === true && classification.blockingClass) {
    actions.push("Restore missing signals before final approval");
    return {
      decision: "ESCALATE",
      reasons: [...reasons, "Blocking workflow entered degraded mode"],
      actions,
      requiresEscalation: true,
    };
  }

  if (evaluation.missingEvidence.length > 0) {
    const missing = evaluation.missingEvidence;
    actions.push(...missing.map((item) => `Provide ${item}`));

    if (classification.taskType === "release_gate" && missing.includes("rollback_plan")) {
      return {
        decision: "BLOCK",
        reasons: [...reasons, "Release gate missing rollback plan"],
        actions,
        requiresEscalation: false,
      };
    }

    if (classification.taskType === "merge_gate" && (missing.includes("tests") || missing.includes("owner") || missing.includes("diff"))) {
      return {
        decision: "BLOCK",
        reasons: [...reasons, "Merge gate missing hard-required evidence"],
        actions,
        requiresEscalation: false,
      };
    }

    if (missing.includes("diff") || missing.includes("objective")) {
      return {
        decision: "DEFER",
        reasons: [...reasons, "Work item lacks minimum inspectable shape"],
        actions,
        requiresEscalation: false,
      };
    }

    return {
      decision: "REQUIRE_MORE_EVIDENCE",
      reasons: [...reasons, "Evidence is incomplete but the work item remains reviewable"],
      actions,
      requiresEscalation: false,
    };
  }

  if (prSnapshot && !prSnapshot.ok && classification.blockingClass) {
    actions.push("Restore PR access or GitHub signal path");
    return {
      decision: "ESCALATE",
      reasons: [...reasons, "Governance cannot verify current PR state"],
      actions,
      requiresEscalation: true,
    };
  }

  actions.push("Proceed under current governed conditions");
  return {
    decision: "ALLOW",
    reasons: [...reasons, "Required evidence is present for the current decision stage"],
    actions,
    requiresEscalation: false,
  };
}

function mapConfidence(trustLevel: SparkyTrustLevel): number {
  switch (trustLevel) {
    case "T0":
      return 0.15;
    case "T1":
      return 0.35;
    case "T2":
      return 0.55;
    case "T3":
      return 0.78;
    case "T4":
      return 0.92;
    default:
      return 0.5;
  }
}

function determineStateTo(
  decision: SparkyDecisionOutcome,
  taskType: string,
  currentState: SparkyState,
): SparkyState {
  if (decision === "BLOCK") return "blocked";
  if (decision === "DEFER") return "pending";
  if (decision === "ESCALATE" || decision === "REQUIRE_MORE_EVIDENCE") return "in_review";
  if (decision === "ALLOW") {
    if (taskType === "release_gate" && currentState === "approved") {
      return "released";
    }
    return "approved";
  }
  return currentState;
}

function buildEvidenceRefs(classification: SparkyClassification, input: NormalizedInput, prSnapshot: PrReadSnapshot | null): string[] {
  const refs = classification.requiredEvidence
    .filter((key) => input.payload[key] != null && input.payload[key] !== "")
    .map((key) => `payload.${key}`);

  if (prSnapshot?.ok) {
    refs.push(`pr.${prSnapshot.pr_number}`, `pr_head.${prSnapshot.head_sha}`);
  }

  return refs.length > 0 ? refs : [`task_type.${classification.taskType}`];
}

async function enforceDecision(args: {
  input: NormalizedInput;
  classification: SparkyClassification;
  routing: SparkyRouting;
  evaluation: SparkyEvaluation;
  decision: SparkyDecisionOutcome;
  actions: string[];
  reasons: string[];
  prSnapshot: PrReadSnapshot | null;
}): Promise<Record<string, unknown>> {
  const { input, classification, decision, prSnapshot, actions, reasons } = args;

  if (decision === "BLOCK") {
    if (input.repo && input.prNumber && prSnapshot?.ok && hasText(prSnapshot.head_sha)) {
      return await github.block_pr({
        work_item_id: input.workItemId,
        repo: input.repo,
        pr_number: input.prNumber,
        head_sha: prSnapshot.head_sha,
        reason: reasons.join(" | "),
        blocking_conditions: actions,
        set_status_check: true,
        owner: input.owner ?? "unknown",
        trace_id: input.traceId,
      });
    }
    return { ok: false, error_code: "no_pr_target", message: "BLOCK decision has no PR target for enforcement" };
  }

  if (decision === "ALLOW" && classification.taskType === "merge_gate") {
    if (input.repo && input.prNumber) {
      return await github.merge_pr({
        work_item_id: input.workItemId,
        repo: input.repo,
        pr_number: input.prNumber,
        merge_method: "squash",
        auto: false,
        decision_basis: reasons.join(" | "),
        owner: input.owner ?? "unknown",
        trace_id: input.traceId,
      });
    }
    return { ok: false, error_code: "no_pr_target", message: "ALLOW merge decision has no PR target for enforcement" };
  }

  if (decision === "REQUIRE_MORE_EVIDENCE") {
    if (input.repo && input.prNumber) {
      return await github.comment_pr({
        work_item_id: input.workItemId,
        repo: input.repo,
        pr_number: input.prNumber,
        body: `Sparky requires more evidence before progression.\n\nMissing or weak signals:\n- ${actions.join("\n- ")}`,
        comment_type: "evidence_request",
        trace_id: input.traceId,
      });
    }
    return { ok: true, tool_name: "github.comment_pr", skipped: true, reason: "No PR target for evidence comment" };
  }

  if (decision === "ESCALATE") {
    if (input.repo) {
      return await orchestration.escalate_issue({
        work_item_id: input.workItemId,
        repo: input.repo,
        title: `Sparky escalation: ${classification.taskType}`,
        body: `Trace ID: ${input.traceId}\n\nReasons:\n- ${reasons.join("\n- ")}`,
        labels: ["sparky", "governance"],
        target_authority: classification.riskLevel === "critical" ? "security" : classification.taskType === "release_gate" ? "release" : "architecture",
        linked_pr: input.prNumber ?? undefined,
        trace_id: input.traceId,
      });
    }
    return { ok: false, error_code: "no_repo_target", message: "ESCALATE decision has no repository target" };
  }

  return { ok: true, tool_name: "none", skipped: true };
}

function applyEnforcementFailureRules(args: {
  decision: SparkyDecisionOutcome;
  requiresEscalation: boolean;
  reasons: string[];
  actions: string[];
  enforcement: Record<string, unknown>;
}): {
  decision: SparkyDecisionOutcome;
  requiresEscalation: boolean;
  reasons: string[];
  actions: string[];
} {
  const enforcementFailed = isRecord(args.enforcement) && args.enforcement.ok === false;
  if (!enforcementFailed) {
    return args;
  }

  const failureMessage = hasText(args.enforcement.message)
    ? args.enforcement.message
    : "Enforcement tool failed";

  if (args.decision === "ALLOW") {
    return {
      decision: "BLOCK",
      requiresEscalation: true,
      reasons: [...args.reasons, `Enforcement failure converted ALLOW to BLOCK: ${failureMessage}`],
      actions: [...args.actions, "Resolve enforcement failure before allowing progression"],
    };
  }

  if (args.decision === "BLOCK") {
    return {
      decision: "BLOCK",
      requiresEscalation: true,
      reasons: [...args.reasons, `Blocking enforcement failed: ${failureMessage}`],
      actions: [...args.actions, "Escalate because block could not be enforced"],
    };
  }

  return {
    decision: args.decision,
    requiresEscalation: true,
    reasons: [...args.reasons, `Enforcement failure detected: ${failureMessage}`],
    actions: [...args.actions, "Repair enforcement channel"],
  };
}

async function recordDecision(args: {
  input: NormalizedInput;
  classification: SparkyClassification;
  evaluation: SparkyEvaluation;
  decision: SparkyDecisionOutcome;
  reasons: string[];
  stateFrom: SparkyState;
  stateTo: SparkyState;
  evidenceRefs: string[];
}): Promise<Record<string, unknown>> {
  return audit.record_decision({
    work_item_id: args.input.workItemId,
    decision: args.decision,
    reason: args.reasons.join(" | "),
    trust_level: args.evaluation.trustLevel,
    state_from: args.stateFrom,
    state_to: args.stateTo,
    evidence_refs: args.evidenceRefs,
    owner: args.input.owner ?? "unknown",
    write_remote_comment: false,
    trace_id: args.input.traceId,
  });
}

function applyRecordFailureRules(result: SparkyDecision, recordResult: Record<string, unknown>): SparkyDecision {
  const recordFailed = isRecord(recordResult) && recordResult.ok === false;
  if (!recordFailed) {
    return result;
  }

  const failureMessage = hasText(recordResult.message) ? recordResult.message : "Decision record failed";
  return {
    ...result,
    decision: "BLOCK",
    blocked: true,
    requiresEscalation: true,
    state_to: "blocked",
    reasons: [...result.reasons, `Record failure converted decision to BLOCK: ${failureMessage}`],
    actions: [...result.actions, "Restore decision logging before progressing"],
    record: recordResult,
  };
}

export async function runSparky(input: SparkyInput): Promise<SparkyDecision> {
  const controlLoop: ControlLoopStep[] = ["INPUT", "CLASSIFY", "ROUTE", "EVALUATE", "DECIDE", "ENFORCE", "RECORD"];
  const normalized = normalizeInput(input);
  const classification = classify(normalized);
  const routing = route(normalized);
  const prSnapshot = await loadPrSnapshot(normalized);
  const evaluation = evaluate({ input: normalized, classification, prSnapshot });

  const baseDecision = decide({
    input: normalized,
    classification,
    evaluation,
    prSnapshot,
  });

  const enforcementRaw = await enforceDecision({
    input: normalized,
    classification,
    routing,
    evaluation,
    decision: baseDecision.decision,
    actions: baseDecision.actions,
    reasons: baseDecision.reasons,
    prSnapshot,
  });

  const enforcedDecision = applyEnforcementFailureRules({
    decision: baseDecision.decision,
    requiresEscalation: baseDecision.requiresEscalation,
    reasons: baseDecision.reasons,
    actions: baseDecision.actions,
    enforcement: enforcementRaw,
  });

  const stateTo = determineStateTo(enforcedDecision.decision, classification.taskType, normalized.stateFrom);
  const evidenceRefs = buildEvidenceRefs(classification, normalized, prSnapshot);

  const recordResult = await recordDecision({
    input: normalized,
    classification,
    evaluation,
    decision: enforcedDecision.decision,
    reasons: enforcedDecision.reasons,
    stateFrom: normalized.stateFrom,
    stateTo,
    evidenceRefs,
  });

  const result: SparkyDecision = {
    decision: enforcedDecision.decision,
    confidence: mapConfidence(evaluation.trustLevel),
    blocked: enforcedDecision.decision === "BLOCK",
    requiresEscalation: enforcedDecision.requiresEscalation,
    actions: enforcedDecision.actions,
    reasons: enforcedDecision.reasons,
    trace_id: normalized.traceId,
    state_from: normalized.stateFrom,
    state_to: stateTo,
    classification,
    routing,
    evaluation,
    enforcement: enforcementRaw,
    record: recordResult,
    trace: {
      traceId: normalized.traceId,
      controlLoop,
    },
  };

  return applyRecordFailureRules(result, recordResult);
}
