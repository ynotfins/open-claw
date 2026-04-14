declare const require: any;
declare const __dirname: string;
declare const Buffer: {
  byteLength(input: string, encoding?: string): number;
};

const { execFile } = require("child_process");
const { appendFile } = require("fs/promises");
const path = require("path");

function execFileAsync(command: string, args: string[], options: Record<string, unknown>) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    execFile(command, args, options, (error: unknown, stdout: string, stderr: string) => {
      if (error) {
        reject(Object.assign(error as object, { stdout, stderr }));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}
const GOVERNANCE_STATUS_CONTEXT = "sparky/governance";
const MAX_DIFF_BYTES = 1024 * 1024;

export const BLOCKING_TASKS = new Set([
  "merge_gate",
  "release_gate",
  "quality_enforcement",
  "evidence_validation",
  "drift_audit",
]);

export const REQUIRED_EVIDENCE_BY_TASK: Record<string, string[]> = {
  task_routing: ["objective", "current_state"],
  pr_governance: ["diff", "objective", "tests_or_reason_not_available"],
  merge_gate: ["diff", "tests", "owner"],
  release_gate: ["tests", "rollback_plan", "owner", "scope"],
  quality_enforcement: ["claim", "supporting_evidence"],
  evidence_validation: ["claim", "evidence"],
  drift_audit: ["packet_files", "ratings_or_quality_signals"],
};

type ToolFailure = {
  ok: false;
  tool_name: string;
  backend: string;
  trace_id: string;
  error_code: string;
  message: string;
  retryable: boolean;
  blocking: boolean;
  details?: Record<string, unknown>;
};

type StatusCheck = {
  context: string;
  state: "SUCCESS" | "FAILURE" | "PENDING";
};

type ReadPrSuccess = {
  ok: true;
  tool_name: "github.read_pr";
  backend: "gh_pr_view";
  trace_id: string;
  details: {
    pr_number: number;
    title: string;
    state: "OPEN" | "CLOSED" | "MERGED";
    is_draft: boolean;
    mergeable: "MERGEABLE" | "CONFLICTING" | "UNKNOWN";
    head_sha: string;
    review_decision: "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | null;
    status_checks: StatusCheck[];
  };
};

type BlockPrSuccess = {
  ok: true;
  tool_name: "github.block_pr";
  backend: "gh_pr_review_and_status";
  trace_id: string;
  details: {
    pr_number: number;
    review_submitted: boolean;
    status_check_set: boolean;
    status_context: string;
    blocking_conditions: string[];
  };
};

type CommentPrSuccess = {
  ok: true;
  tool_name: "github.comment_pr";
  backend: "gh_pr_comment";
  trace_id: string;
  details: {
    pr_number: number;
    comment_url: string;
    comment_type: string;
  };
};

type MergePrSuccess = {
  ok: true;
  tool_name: "github.merge_pr";
  backend: "gh_pr_merge";
  trace_id: string;
  details: {
    pr_number: number;
    merged: boolean;
    merge_method: "merge" | "squash" | "rebase";
    commit_sha: string | null;
  };
};

type FetchDiffSuccess = {
  ok: true;
  tool_name: "github.fetch_diff";
  backend: "gh_pr_diff";
  trace_id: string;
  details: {
    pr_number: number;
    name_only: boolean;
    files: string[];
    diff_text: string;
  };
};

type EscalateIssueSuccess = {
  ok: true;
  tool_name: "orchestration.escalate_issue";
  backend: "gh_issue_create_or_update";
  trace_id: string;
  details: {
    issue_number: number;
    target_authority: string;
    escalation_open: true;
  };
};

type RecordDecisionSuccess = {
  ok: true;
  tool_name: "audit.record_decision";
  backend: "local_decision_log";
  trace_id: string;
  details: {
    decision_logged: true;
    log_target: string;
    remote_comment_written: false;
  };
};

export type GitHubToolResult =
  | ReadPrSuccess
  | BlockPrSuccess
  | CommentPrSuccess
  | MergePrSuccess
  | FetchDiffSuccess
  | ToolFailure;

export type OrchestrationToolResult = EscalateIssueSuccess | ToolFailure;
export type AuditToolResult = RecordDecisionSuccess | ToolFailure;

export type ReadPrInput = {
  work_item_id: string;
  repo: string;
  pr_number: number;
  include_reviews?: boolean;
  include_checks?: boolean;
  trace_id: string;
};

export type BlockPrInput = {
  work_item_id: string;
  repo: string;
  pr_number: number;
  head_sha: string;
  reason: string;
  blocking_conditions: string[];
  set_status_check?: boolean;
  owner: string;
  trace_id: string;
};

export type CommentPrInput = {
  work_item_id: string;
  repo: string;
  pr_number: number;
  body: string;
  comment_type: "notice" | "warning" | "evidence_request" | "status_update";
  trace_id: string;
};

export type MergePrInput = {
  work_item_id: string;
  repo: string;
  pr_number: number;
  merge_method: "merge" | "squash" | "rebase";
  auto?: boolean;
  decision_basis: string;
  owner: string;
  trace_id: string;
};

export type FetchDiffInput = {
  work_item_id: string;
  repo: string;
  pr_number: number;
  name_only?: boolean;
  exclude_glob?: string | null;
  trace_id: string;
};

export type EscalateIssueInput = {
  work_item_id: string;
  repo: string;
  title: string;
  body: string;
  labels: string[];
  target_authority: "delivery" | "architecture" | "release" | "security" | "incident";
  linked_pr?: number;
  linked_issue?: number;
  trace_id: string;
};

export type RecordDecisionInput = {
  work_item_id: string;
  decision: "ALLOW" | "BLOCK" | "ESCALATE" | "DEFER" | "REQUIRE_MORE_EVIDENCE";
  reason: string;
  trust_level: "T0" | "T1" | "T2" | "T3" | "T4";
  state_from: "pending" | "in_review" | "blocked" | "approved" | "released" | "rolled_back";
  state_to: "pending" | "in_review" | "blocked" | "approved" | "released" | "rolled_back";
  evidence_refs: string[];
  owner: string;
  write_remote_comment?: false;
  trace_id: string;
};

type GhCommandResult = {
  ok: true;
  stdout: string;
  stderr: string;
};

type GhCommandFailure = {
  ok: false;
  stdout: string;
  stderr: string;
  message: string;
};

type ReviewState = "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | null;
type MergeabilityState = "MERGEABLE" | "CONFLICTING" | "UNKNOWN";

type GhPrViewResponse = {
  number: number;
  title?: string;
  state?: string;
  isDraft?: boolean;
  mergeable?: string | null;
  headRefOid?: string;
  reviewDecision?: string | null;
  statusCheckRollup?: unknown[];
};

type GhApiPullResponse = {
  number?: number;
  title?: string;
  state?: string;
  draft?: boolean;
  merged?: boolean;
  mergeable?: boolean | null;
  head?: {
    sha?: string;
  };
  merge_commit_sha?: string | null;
};

type GhCommitStatusResponse = {
  statuses?: Array<{
    context?: string;
    state?: string;
  }>;
  state?: string;
};

type GhIssueCommentResponse = {
  html_url?: string;
};

type GhMergeApiResponse = {
  sha?: string;
  merged?: boolean;
  message?: string;
};

type GhIssueResponse = {
  number?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => hasText(entry));
}

function parseRepo(repo: string): { owner: string; name: string } | null {
  const parts = repo.split("/");
  if (parts.length !== 2 || !hasText(parts[0]) || !hasText(parts[1])) {
    return null;
  }
  return { owner: parts[0], name: parts[1] };
}

function toValidationFailure(
  toolName: string,
  backend: string,
  traceId: string,
  issues: string[],
): ToolFailure {
  return {
    ok: false,
    tool_name: toolName,
    backend,
    trace_id: traceId,
    error_code: "invalid_input",
    message: issues.join("; "),
    retryable: false,
    blocking: true,
    details: { validation_issues: issues },
  };
}

function toToolFailure(args: {
  toolName: string;
  backend: string;
  traceId: string;
  errorCode: string;
  message: string;
  retryable?: boolean;
  blocking?: boolean;
  details?: Record<string, unknown>;
}): ToolFailure {
  return {
    ok: false,
    tool_name: args.toolName,
    backend: args.backend,
    trace_id: args.traceId,
    error_code: args.errorCode,
    message: args.message,
    retryable: args.retryable ?? false,
    blocking: args.blocking ?? true,
    details: args.details,
  };
}

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeMergeable(value: string | null | undefined): MergeabilityState {
  const normalized = String(value ?? "").toUpperCase();
  if (normalized === "MERGEABLE") {
    return "MERGEABLE";
  }
  if (normalized === "CONFLICTING") {
    return "CONFLICTING";
  }
  return "UNKNOWN";
}

function normalizeReviewDecision(value: string | null | undefined): ReviewState {
  const normalized = String(value ?? "").toUpperCase();
  if (normalized === "APPROVED") {
    return "APPROVED";
  }
  if (normalized === "CHANGES_REQUESTED") {
    return "CHANGES_REQUESTED";
  }
  if (normalized === "REVIEW_REQUIRED") {
    return "REVIEW_REQUIRED";
  }
  return null;
}

function normalizeState(value: string | undefined, merged: boolean): "OPEN" | "CLOSED" | "MERGED" {
  if (merged) {
    return "MERGED";
  }
  return String(value ?? "").toUpperCase() === "CLOSED" ? "CLOSED" : "OPEN";
}

function normalizeCheckState(value: unknown): "SUCCESS" | "FAILURE" | "PENDING" {
  const normalized = String(value ?? "").toUpperCase();
  if (normalized === "SUCCESS" || normalized === "COMPLETED") {
    return "SUCCESS";
  }
  if (normalized === "FAILURE" || normalized === "FAILED" || normalized === "ERROR") {
    return "FAILURE";
  }
  return "PENDING";
}

function extractStatusChecks(statusCheckRollup: unknown): StatusCheck[] {
  if (!Array.isArray(statusCheckRollup)) {
    return [];
  }

  const checks: StatusCheck[] = [];
  for (const item of statusCheckRollup) {
    if (!isRecord(item)) {
      continue;
    }
    const context =
      (hasText(item.context) && item.context) ||
      (hasText(item.name) && item.name) ||
      (hasText(item.title) && item.title);

    if (!context) {
      continue;
    }

    const stateSource =
      item.conclusion ??
      item.status ??
      item.state ??
      (isRecord(item.statusContext) ? item.statusContext.state : undefined);

    checks.push({
      context,
      state: normalizeCheckState(stateSource),
    });
  }

  return checks;
}

function extractStatusChecksFromCommitStatus(payload: GhCommitStatusResponse | null): StatusCheck[] {
  if (!payload?.statuses || !Array.isArray(payload.statuses)) {
    return [];
  }

  return payload.statuses
    .filter((entry) => hasText(entry.context))
    .map((entry) => ({
      context: entry.context!,
      state: normalizeCheckState(entry.state),
    }));
}

function parseGhError(message: string): { errorCode: string; retryable: boolean } {
  const normalized = message.toLowerCase();
  if (normalized.includes("not found")) {
    return { errorCode: "not_found", retryable: false };
  }
  if (normalized.includes("authentication") || normalized.includes("not logged in")) {
    return { errorCode: "auth_required", retryable: false };
  }
  if (normalized.includes("forbidden") || normalized.includes("permission")) {
    return { errorCode: "permission_denied", retryable: false };
  }
  if (normalized.includes("timed out") || normalized.includes("temporary")) {
    return { errorCode: "backend_timeout", retryable: true };
  }
  if (normalized.includes("merge conflict") || normalized.includes("conflict")) {
    return { errorCode: "conflict", retryable: false };
  }
  return { errorCode: "backend_error", retryable: true };
}

async function runGh(args: string[]): Promise<GhCommandResult | GhCommandFailure> {
  try {
    const { stdout, stderr } = await execFileAsync("gh", args, {
      encoding: "utf8",
      maxBuffer: MAX_DIFF_BYTES * 4,
    });
    return { ok: true, stdout, stderr };
  } catch (error) {
    const stdout = isRecord(error) && typeof error.stdout === "string" ? error.stdout : "";
    const stderr = isRecord(error) && typeof error.stderr === "string" ? error.stderr : "";
    const message =
      (isRecord(error) && typeof error.message === "string" ? error.message : "Unknown gh command failure") ||
      "Unknown gh command failure";
    return { ok: false, stdout, stderr, message };
  }
}

async function runGhJson<T>(args: string[]): Promise<{ ok: true; data: T } | GhCommandFailure> {
  const result = await runGh(args);
  if (!result.ok) {
    return result;
  }

  const parsed = safeJsonParse<T>(result.stdout);
  if (parsed === null) {
    return {
      ok: false,
      stdout: result.stdout,
      stderr: result.stderr,
      message: "GitHub CLI returned non-JSON output",
    };
  }

  return { ok: true, data: parsed };
}

function validateReadPrInput(input: ReadPrInput): string[] {
  const issues: string[] = [];
  if (!hasText(input.work_item_id)) issues.push("work_item_id is required");
  if (!hasText(input.trace_id)) issues.push("trace_id is required");
  if (!hasText(input.repo) || !parseRepo(input.repo)) issues.push("repo must be in owner/name format");
  if (!isPositiveInteger(input.pr_number)) issues.push("pr_number must be a positive integer");
  return issues;
}

function validateBlockPrInput(input: BlockPrInput): string[] {
  const issues = validateReadPrInput(input);
  if (!hasText(input.head_sha)) issues.push("head_sha is required");
  if (!hasText(input.reason)) issues.push("reason is required");
  if (!hasText(input.owner)) issues.push("owner is required");
  if (!isStringArray(input.blocking_conditions)) issues.push("blocking_conditions must be a non-empty string array");
  return issues;
}

function validateCommentPrInput(input: CommentPrInput): string[] {
  const issues = validateReadPrInput(input);
  if (!hasText(input.body)) issues.push("body is required");
  if (!["notice", "warning", "evidence_request", "status_update"].includes(input.comment_type)) {
    issues.push("comment_type must be one of notice, warning, evidence_request, status_update");
  }
  return issues;
}

function validateMergePrInput(input: MergePrInput): string[] {
  const issues = validateReadPrInput(input);
  if (!["merge", "squash", "rebase"].includes(input.merge_method)) {
    issues.push("merge_method must be one of merge, squash, rebase");
  }
  if (!hasText(input.decision_basis)) issues.push("decision_basis is required");
  if (!hasText(input.owner)) issues.push("owner is required");
  return issues;
}

function validateFetchDiffInput(input: FetchDiffInput): string[] {
  const issues = validateReadPrInput(input);
  if (input.exclude_glob !== undefined && input.exclude_glob !== null && !hasText(input.exclude_glob)) {
    issues.push("exclude_glob must be a non-empty string or null");
  }
  return issues;
}

function validateEscalateIssueInput(input: EscalateIssueInput): string[] {
  const issues: string[] = [];
  if (!hasText(input.work_item_id)) issues.push("work_item_id is required");
  if (!hasText(input.trace_id)) issues.push("trace_id is required");
  if (!hasText(input.repo) || !parseRepo(input.repo)) issues.push("repo must be in owner/name format");
  if (!hasText(input.title)) issues.push("title is required");
  if (!hasText(input.body)) issues.push("body is required");
  if (!isStringArray(input.labels)) issues.push("labels must be a non-empty string array");
  if (!["delivery", "architecture", "release", "security", "incident"].includes(input.target_authority)) {
    issues.push("target_authority must be one of delivery, architecture, release, security, incident");
  }
  if (input.linked_pr !== undefined && !isPositiveInteger(input.linked_pr)) {
    issues.push("linked_pr must be a positive integer when provided");
  }
  if (input.linked_issue !== undefined && !isPositiveInteger(input.linked_issue)) {
    issues.push("linked_issue must be a positive integer when provided");
  }
  return issues;
}

function validateRecordDecisionInput(input: RecordDecisionInput): string[] {
  const issues: string[] = [];
  if (!hasText(input.work_item_id)) issues.push("work_item_id is required");
  if (!hasText(input.trace_id)) issues.push("trace_id is required");
  if (!["ALLOW", "BLOCK", "ESCALATE", "DEFER", "REQUIRE_MORE_EVIDENCE"].includes(input.decision)) {
    issues.push("decision must be a valid Sparky decision outcome");
  }
  if (!hasText(input.reason)) issues.push("reason is required");
  if (!["T0", "T1", "T2", "T3", "T4"].includes(input.trust_level)) {
    issues.push("trust_level must be one of T0, T1, T2, T3, T4");
  }
  if (!["pending", "in_review", "blocked", "approved", "released", "rolled_back"].includes(input.state_from)) {
    issues.push("state_from must be a valid Sparky state");
  }
  if (!["pending", "in_review", "blocked", "approved", "released", "rolled_back"].includes(input.state_to)) {
    issues.push("state_to must be a valid Sparky state");
  }
  if (!isStringArray(input.evidence_refs)) issues.push("evidence_refs must be a non-empty string array");
  if (!hasText(input.owner)) issues.push("owner is required");
  return issues;
}

async function readPrCore(input: ReadPrInput): Promise<ReadPrSuccess | ToolFailure> {
  const viewArgs = [
    "pr",
    "view",
    String(input.pr_number),
    "-R",
    input.repo,
    "--json",
    "number,title,state,isDraft,mergeable,headRefOid,reviewDecision,statusCheckRollup",
  ];

  const primary = await runGhJson<GhPrViewResponse>(viewArgs);
  if (primary.ok) {
    const checks = input.include_checks === false ? [] : extractStatusChecks(primary.data.statusCheckRollup);
    return {
      ok: true,
      tool_name: "github.read_pr",
      backend: "gh_pr_view",
      trace_id: input.trace_id,
      details: {
        pr_number: primary.data.number,
        title: String(primary.data.title ?? ""),
        state: normalizeState(primary.data.state, false),
        is_draft: Boolean(primary.data.isDraft),
        mergeable: normalizeMergeable(primary.data.mergeable),
        head_sha: String(primary.data.headRefOid ?? ""),
        review_decision: normalizeReviewDecision(primary.data.reviewDecision),
        status_checks: checks,
      },
    };
  }

  const repoParts = parseRepo(input.repo)!;
  const fallbackPull = await runGhJson<GhApiPullResponse>([
    "api",
    `repos/${repoParts.owner}/${repoParts.name}/pulls/${input.pr_number}`,
  ]);

  if (!fallbackPull.ok) {
    const parsedError = parseGhError(`${primary.message}\n${fallbackPull.message}\n${fallbackPull.stderr}`);
    return toToolFailure({
      toolName: "github.read_pr",
      backend: "gh_pr_view",
      traceId: input.trace_id,
      errorCode: parsedError.errorCode,
      retryable: parsedError.retryable,
      message: "Unable to read pull request via gh pr view or gh api",
      details: {
        primary_error: primary.message,
        fallback_error: fallbackPull.message,
      },
    });
  }

  const headSha = String(fallbackPull.data.head?.sha ?? "");
  let checks: StatusCheck[] = [];
  if (input.include_checks !== false && hasText(headSha)) {
    const statusResponse = await runGhJson<GhCommitStatusResponse>([
      "api",
      `repos/${repoParts.owner}/${repoParts.name}/commits/${headSha}/status`,
    ]);
    checks = statusResponse.ok ? extractStatusChecksFromCommitStatus(statusResponse.data) : [];
  }

  return {
    ok: true,
    tool_name: "github.read_pr",
    backend: "gh_pr_view",
    trace_id: input.trace_id,
    details: {
      pr_number: Number(fallbackPull.data.number ?? input.pr_number),
      title: String(fallbackPull.data.title ?? ""),
      state: normalizeState(fallbackPull.data.state, Boolean(fallbackPull.data.merged)),
      is_draft: Boolean(fallbackPull.data.draft),
      mergeable:
        fallbackPull.data.mergeable === true
          ? "MERGEABLE"
          : fallbackPull.data.mergeable === false
            ? "CONFLICTING"
            : "UNKNOWN",
      head_sha: headSha,
      review_decision: null,
      status_checks: checks,
    },
  };
}

export async function githubReadPr(input: ReadPrInput): Promise<ReadPrSuccess | ToolFailure> {
  const issues = validateReadPrInput(input);
  if (issues.length > 0) {
    return toValidationFailure("github.read_pr", "gh_pr_view", input.trace_id ?? "", issues);
  }
  return readPrCore(input);
}

export async function githubBlockPr(input: BlockPrInput): Promise<BlockPrSuccess | ToolFailure> {
  const issues = validateBlockPrInput(input);
  if (issues.length > 0) {
    return toValidationFailure("github.block_pr", "gh_pr_review_and_status", input.trace_id ?? "", issues);
  }

  const currentPr = await readPrCore({
    work_item_id: input.work_item_id,
    repo: input.repo,
    pr_number: input.pr_number,
    include_reviews: false,
    include_checks: false,
    trace_id: input.trace_id,
  });

  if (!currentPr.ok) {
    return toToolFailure({
      toolName: "github.block_pr",
      backend: "gh_pr_review_and_status",
      traceId: input.trace_id,
      errorCode: "pr_lookup_failed",
      message: "Unable to verify PR head SHA before blocking",
      details: { cause: currentPr.message },
    });
  }

  if (currentPr.details.head_sha !== input.head_sha) {
    return toToolFailure({
      toolName: "github.block_pr",
      backend: "gh_pr_review_and_status",
      traceId: input.trace_id,
      errorCode: "pr_head_sha_mismatch",
      message: "Provided head_sha does not match current PR head",
      retryable: false,
      blocking: true,
      details: {
        expected_head_sha: currentPr.details.head_sha,
        provided_head_sha: input.head_sha,
      },
    });
  }

  const review = await runGh([
    "pr",
    "review",
    String(input.pr_number),
    "-R",
    input.repo,
    "--request-changes",
    "--body",
    input.reason,
  ]);

  if (!review.ok) {
    const parsedError = parseGhError(`${review.message}\n${review.stderr}`);
    return toToolFailure({
      toolName: "github.block_pr",
      backend: "gh_pr_review_and_status",
      traceId: input.trace_id,
      errorCode: parsedError.errorCode,
      retryable: parsedError.retryable,
      message: "Failed to submit blocking review on PR",
      details: {
        stderr: review.stderr,
        stdout: review.stdout,
      },
    });
  }

  let statusCheckSet = false;
  if (input.set_status_check !== false) {
    const repoParts = parseRepo(input.repo)!;
    const status = await runGh([
      "api",
      "--method",
      "POST",
      `repos/${repoParts.owner}/${repoParts.name}/statuses/${input.head_sha}`,
      "-f",
      "state=failure",
      "-f",
      `context=${GOVERNANCE_STATUS_CONTEXT}`,
      "-f",
      `description=${input.blocking_conditions.join("; ").slice(0, 140)}`,
      "-f",
      `target_url=https://github.com/${input.repo}/pull/${input.pr_number}`,
    ]);

    if (!status.ok) {
      const parsedError = parseGhError(`${status.message}\n${status.stderr}`);
      return toToolFailure({
        toolName: "github.block_pr",
        backend: "gh_pr_review_and_status",
        traceId: input.trace_id,
        errorCode: parsedError.errorCode === "permission_denied" ? "status_write_denied" : parsedError.errorCode,
        retryable: parsedError.retryable,
        message: "Blocking review submitted, but failing governance status could not be set",
        details: {
          review_submitted: true,
          status_check_set: false,
          stderr: status.stderr,
        },
      });
    }
    statusCheckSet = true;
  }

  return {
    ok: true,
    tool_name: "github.block_pr",
    backend: "gh_pr_review_and_status",
    trace_id: input.trace_id,
    details: {
      pr_number: input.pr_number,
      review_submitted: true,
      status_check_set: statusCheckSet,
      status_context: GOVERNANCE_STATUS_CONTEXT,
      blocking_conditions: input.blocking_conditions,
    },
  };
}

export async function githubCommentPr(input: CommentPrInput): Promise<CommentPrSuccess | ToolFailure> {
  const issues = validateCommentPrInput(input);
  if (issues.length > 0) {
    return toValidationFailure("github.comment_pr", "gh_pr_comment", input.trace_id ?? "", issues);
  }

  const repoParts = parseRepo(input.repo)!;
  const result = await runGhJson<GhIssueCommentResponse>([
    "api",
    "--method",
    "POST",
    `repos/${repoParts.owner}/${repoParts.name}/issues/${input.pr_number}/comments`,
    "-f",
    `body=${input.body}`,
  ]);

  if (!result.ok) {
    const parsedError = parseGhError(`${result.message}\n${result.stderr}`);
    return toToolFailure({
      toolName: "github.comment_pr",
      backend: "gh_pr_comment",
      traceId: input.trace_id,
      errorCode: parsedError.errorCode,
      retryable: parsedError.retryable,
      message: "Failed to comment on pull request",
      details: {
        stderr: result.stderr,
        stdout: result.stdout,
      },
    });
  }

  return {
    ok: true,
    tool_name: "github.comment_pr",
    backend: "gh_pr_comment",
    trace_id: input.trace_id,
    details: {
      pr_number: input.pr_number,
      comment_url: String(result.data.html_url ?? ""),
      comment_type: input.comment_type,
    },
  };
}

export async function githubMergePr(input: MergePrInput): Promise<MergePrSuccess | ToolFailure> {
  const issues = validateMergePrInput(input);
  if (issues.length > 0) {
    return toValidationFailure("github.merge_pr", "gh_pr_merge", input.trace_id ?? "", issues);
  }

  const readResult = await readPrCore({
    work_item_id: input.work_item_id,
    repo: input.repo,
    pr_number: input.pr_number,
    include_reviews: false,
    include_checks: true,
    trace_id: input.trace_id,
  });

  if (!readResult.ok) {
    return toToolFailure({
      toolName: "github.merge_pr",
      backend: "gh_pr_merge",
      traceId: input.trace_id,
      errorCode: "pr_lookup_failed",
      message: "Unable to verify PR state before merge",
      details: { cause: readResult.message },
    });
  }

  const strategyFlag =
    input.merge_method === "merge" ? "--merge" : input.merge_method === "squash" ? "--squash" : "--rebase";

  const args = [
    "pr",
    "merge",
    String(input.pr_number),
    "-R",
    input.repo,
    strategyFlag,
  ];

  if (input.auto) {
    args.push("--auto");
  }
  if (hasText(readResult.details.head_sha)) {
    args.push("--match-head-commit", readResult.details.head_sha);
  }

  const merged = await runGh(args);
  if (!merged.ok) {
    const parsedError = parseGhError(`${merged.message}\n${merged.stderr}`);
    return toToolFailure({
      toolName: "github.merge_pr",
      backend: "gh_pr_merge",
      traceId: input.trace_id,
      errorCode: parsedError.errorCode,
      retryable: parsedError.retryable,
      message: "Failed to merge pull request",
      details: {
        stderr: merged.stderr,
        stdout: merged.stdout,
        decision_basis: input.decision_basis,
      },
    });
  }

  const repoParts = parseRepo(input.repo)!;
  const mergeInfo = await runGhJson<GhApiPullResponse>([
    "api",
    `repos/${repoParts.owner}/${repoParts.name}/pulls/${input.pr_number}`,
  ]);

  const mergeCommitSha = mergeInfo.ok ? String(mergeInfo.data.merge_commit_sha ?? "") || null : null;
  const mergedNow = mergeInfo.ok ? Boolean(mergeInfo.data.merged) : !input.auto;

  return {
    ok: true,
    tool_name: "github.merge_pr",
    backend: "gh_pr_merge",
    trace_id: input.trace_id,
    details: {
      pr_number: input.pr_number,
      merged: mergedNow,
      merge_method: input.merge_method,
      commit_sha: mergeCommitSha,
    },
  };
}

export async function githubFetchDiff(input: FetchDiffInput): Promise<FetchDiffSuccess | ToolFailure> {
  const issues = validateFetchDiffInput(input);
  if (issues.length > 0) {
    return toValidationFailure("github.fetch_diff", "gh_pr_diff", input.trace_id ?? "", issues);
  }

  const args = [
    "pr",
    "diff",
    String(input.pr_number),
    "-R",
    input.repo,
  ];

  if (input.name_only) {
    args.push("--name-only");
  }
  if (hasText(input.exclude_glob)) {
    args.push("--exclude", input.exclude_glob);
  }

  const diffResult = await runGh(args);
  if (!diffResult.ok) {
    const parsedError = parseGhError(`${diffResult.message}\n${diffResult.stderr}`);
    return toToolFailure({
      toolName: "github.fetch_diff",
      backend: "gh_pr_diff",
      traceId: input.trace_id,
      errorCode: parsedError.errorCode,
      retryable: parsedError.retryable,
      message: "Failed to fetch pull request diff",
      details: {
        stderr: diffResult.stderr,
        stdout: diffResult.stdout,
      },
    });
  }

  if (Buffer.byteLength(diffResult.stdout, "utf8") > MAX_DIFF_BYTES) {
    return toToolFailure({
      toolName: "github.fetch_diff",
      backend: "gh_pr_diff",
      traceId: input.trace_id,
      errorCode: "diff_too_large",
      message: "Pull request diff exceeds in-memory transport limit",
      retryable: false,
      blocking: true,
      details: {
        size_bytes: Buffer.byteLength(diffResult.stdout, "utf8"),
      },
    });
  }

  const files = input.name_only
    ? diffResult.stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : diffResult.stdout
        .split(/\r?\n/)
        .filter((line) => line.startsWith("diff --git "))
        .map((line) => line.replace("diff --git a/", ""))
        .map((line) => line.split(" b/")[0])
        .filter(Boolean);

  return {
    ok: true,
    tool_name: "github.fetch_diff",
    backend: "gh_pr_diff",
    trace_id: input.trace_id,
    details: {
      pr_number: input.pr_number,
      name_only: Boolean(input.name_only),
      files,
      diff_text: diffResult.stdout,
    },
  };
}

export async function orchestrationEscalateIssue(
  input: EscalateIssueInput,
): Promise<EscalateIssueSuccess | ToolFailure> {
  const issues = validateEscalateIssueInput(input);
  if (issues.length > 0) {
    return toValidationFailure("orchestration.escalate_issue", "gh_issue_create_or_update", input.trace_id ?? "", issues);
  }

  const repoParts = parseRepo(input.repo)!;
  const labels = Array.from(new Set([...input.labels, "escalation"]));

  if (input.linked_issue) {
    const comment = await runGh([
      "issue",
      "comment",
      String(input.linked_issue),
      "-R",
      input.repo,
      "--body",
      input.body,
    ]);

    if (!comment.ok) {
      const parsedError = parseGhError(`${comment.message}\n${comment.stderr}`);
      return toToolFailure({
        toolName: "orchestration.escalate_issue",
        backend: "gh_issue_create_or_update",
        traceId: input.trace_id,
        errorCode: parsedError.errorCode,
        retryable: parsedError.retryable,
        message: "Failed to append escalation comment to existing issue",
        details: {
          linked_issue: input.linked_issue,
          stderr: comment.stderr,
        },
      });
    }

    return {
      ok: true,
      tool_name: "orchestration.escalate_issue",
      backend: "gh_issue_create_or_update",
      trace_id: input.trace_id,
      details: {
        issue_number: input.linked_issue,
        target_authority: input.target_authority,
        escalation_open: true,
      },
    };
  }

  const issueBody = input.linked_pr ? `${input.body}\n\nLinked PR: #${input.linked_pr}` : input.body;
  const args = [
    "api",
    "--method",
    "POST",
    `repos/${repoParts.owner}/${repoParts.name}/issues`,
    "-f",
    `title=${input.title}`,
    "-f",
    `body=${issueBody}`,
  ];

  for (const label of labels) {
    args.push("-f", `labels[]=${label}`);
  }

  const created = await runGhJson<GhIssueResponse>(args);
  if (!created.ok) {
    const parsedError = parseGhError(`${created.message}\n${created.stderr}`);
    return toToolFailure({
      toolName: "orchestration.escalate_issue",
      backend: "gh_issue_create_or_update",
      traceId: input.trace_id,
      errorCode: parsedError.errorCode,
      retryable: parsedError.retryable,
      message: "Failed to open escalation issue",
      details: {
        stderr: created.stderr,
        stdout: created.stdout,
      },
    });
  }

  return {
    ok: true,
    tool_name: "orchestration.escalate_issue",
    backend: "gh_issue_create_or_update",
    trace_id: input.trace_id,
    details: {
      issue_number: Number(created.data.number ?? 0),
      target_authority: input.target_authority,
      escalation_open: true,
    },
  };
}

export async function auditRecordDecision(input: RecordDecisionInput): Promise<RecordDecisionSuccess | ToolFailure> {
  const issues = validateRecordDecisionInput(input);
  if (issues.length > 0) {
    return toValidationFailure("audit.record_decision", "local_decision_log", input.trace_id ?? "", issues);
  }

  const logTarget = path.join(__dirname, "DECISION_LOG.md");
  const entry = [
    "",
    "## Decision Entry",
    `- Trace ID: ${input.trace_id}`,
    `- Work Item ID: ${input.work_item_id}`,
    `- Decision: ${input.decision}`,
    `- Reason: ${input.reason}`,
    `- Trust Level: ${input.trust_level}`,
    `- State Transition: ${input.state_from} -> ${input.state_to}`,
    `- Owner: ${input.owner}`,
    `- Evidence Refs: ${input.evidence_refs.join(", ")}`,
  ].join("\n");

  try {
    await appendFile(logTarget, `${entry}\n`, "utf8");
  } catch (error) {
    const message =
      isRecord(error) && typeof error.message === "string" ? error.message : "Unable to append decision log";
    return toToolFailure({
      toolName: "audit.record_decision",
      backend: "local_decision_log",
      traceId: input.trace_id,
      errorCode: "log_write_failed",
      retryable: false,
      message,
      details: { log_target: logTarget },
    });
  }

  return {
    ok: true,
    tool_name: "audit.record_decision",
    backend: "local_decision_log",
    trace_id: input.trace_id,
    details: {
      decision_logged: true,
      log_target: logTarget,
      remote_comment_written: false,
    },
  };
}

export const github = {
  read_pr: githubReadPr,
  block_pr: githubBlockPr,
  comment_pr: githubCommentPr,
  merge_pr: githubMergePr,
  fetch_diff: githubFetchDiff,
};

export const orchestration = {
  escalate_issue: orchestrationEscalateIssue,
};

export const audit = {
  record_decision: auditRecordDecision,
};

export function isBlockingTaskType(taskType: string): boolean {
  return BLOCKING_TASKS.has(taskType);
}

export function getRequiredEvidence(taskType: string): string[] {
  return REQUIRED_EVIDENCE_BY_TASK[taskType] || ["objective", "supporting_evidence"];
}

export function missingEvidence(taskType: string, payload: Record<string, unknown>): string[] {
  const required = getRequiredEvidence(taskType);
  return required.filter((k) => !(k in payload) || payload[k] == null || payload[k] === "");
}

export function routeSuggestion(payload: Record<string, unknown>): string {
  const type = String(payload.type || payload.domain || "").toLowerCase();
  if (type.includes("debug") || type.includes("bug")) return "Debugger";
  if (type.includes("api") || type.includes("integration")) return "API & Integration Engineer";
  if (type.includes("front") || type.includes("ui") || type.includes("ux")) return "Frontend Engineer";
  if (type.includes("arch")) return "Software Architect";
  if (type.includes("release") || type.includes("deploy") || type.includes("ops")) return "DevOps / Release Engineer";
  if (type.includes("qa") || type.includes("evidence")) return "QA Evidence Collector";
  return "Product Manager";
}

export function degradedModeReason(unavailableSignals: string[]): string {
  return `Degraded mode: missing signals -> ${unavailableSignals.join(", ")}`;
}

export function taskRiskNotes(taskType: string): string[] {
  if (taskType === "release_gate") return ["release safety", "rollback", "blast radius", "monitoring"];
  if (taskType === "merge_gate") return ["correctness", "tests", "ownership", "boundary risk"];
  if (taskType === "evidence_validation") return ["proof quality", "contradiction handling"];
  return ["clarity", "evidence quality", "ownership"];
}
