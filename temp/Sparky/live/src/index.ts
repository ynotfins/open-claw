/**
 * Sparky Live Runtime — OpenClaw Entrypoint
 *
 * This is the environment-wired entrypoint for Sparky in live deployment.
 * It wraps the core governance engine (agent.ts) with environment-specific
 * adapter initialization, session state management, and structured logging.
 *
 * For the OpenClaw deployment context, this file is the invocation boundary.
 * Doctrine and governance logic live in agent.ts and schema.ts.
 * Environment-specific wiring lives here.
 *
 * See: LAUNCH_CONTRACT.json for full invocation contract.
 * See: INSTALLATION_TARGETS.json for environment configuration.
 */

import type { SparkyDecision, SparkyInput } from "../../schema.ts";
import { runSparky } from "../../agent.ts";
import { getRequiredEvidence, isBlockingTaskType } from "../../tools.ts";

export type LiveExecuteInput = {
  taskType: string;
  payload: Record<string, unknown>;
  context?: Record<string, unknown>;
};

export type LiveExecuteResult = SparkyDecision & {
  requiredEvidence: string[];
  blockingClass: boolean;
  deploymentEnv: string;
  liveVersion: string;
};

/**
 * executeSparky — OpenClaw-facing entrypoint.
 *
 * Delegates to runSparky() and enriches the result with:
 * - requiredEvidence: what evidence is needed for this task type
 * - blockingClass: whether this task type can produce a BLOCK outcome
 * - deploymentEnv: which environment this is running in
 * - liveVersion: the live layer version
 *
 * Called by OpenClaw to invoke Sparky for any governed work item.
 */
export async function executeSparky(input: LiveExecuteInput): Promise<LiveExecuteResult> {
  const result = await runSparky(input as SparkyInput);

  return {
    ...result,
    requiredEvidence: getRequiredEvidence(input.taskType),
    blockingClass: isBlockingTaskType(input.taskType),
    deploymentEnv: process.env["SPARKY_DEPLOYMENT_ENV"] ?? "factory",
    liveVersion: "3.1.0",
  };
}

/**
 * getCapabilities — returns the list of task types Sparky can govern.
 * Used by OpenClaw to understand Sparky's operational surface.
 */
export function getCapabilities(): string[] {
  return [
    "task_routing",
    "pr_governance",
    "merge_gate",
    "release_gate",
    "quality_enforcement",
    "evidence_validation",
    "drift_audit",
    "hotfix_emergency",
    "incident_coordination",
    "escalation_management",
    "anti_pattern_detection",
    "context_recovery",
  ];
}

/**
 * healthCheck — lightweight liveness check for OpenClaw.
 * Does not invoke the governance engine; only confirms the entrypoint is reachable.
 */
export function healthCheck(): { status: "ok"; agent: string; version: string; env: string } {
  return {
    status: "ok",
    agent: "Sparky",
    version: "3.1.0",
    env: process.env["SPARKY_DEPLOYMENT_ENV"] ?? "factory",
  };
}
