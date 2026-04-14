/**
 * Sparky Live Layer — Smoke Tests
 *
 * These tests verify that the live entrypoint is reachable and returns
 * structurally valid outputs for basic input types.
 *
 * These are NOT governance correctness tests.
 * Governance correctness is tested via TEST_CASES.md and the evals/ directory.
 *
 * These tests confirm:
 * - executeSparky returns a valid SparkyDecision structure
 * - healthCheck returns the correct shape
 * - getCapabilities returns the expected task types
 * - Malformed input is handled without throwing
 */

import { executeSparky, getCapabilities, healthCheck } from "../src/index.ts";

const EXPECTED_TASK_TYPES = [
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

// ─── healthCheck ──────────────────────────────────────────────────────────────

function testHealthCheck(): void {
  const result = healthCheck();
  if (result.status !== "ok") throw new Error(`healthCheck: expected status 'ok', got '${result.status}'`);
  if (result.agent !== "Sparky") throw new Error(`healthCheck: expected agent 'Sparky', got '${result.agent}'`);
  if (!result.version) throw new Error("healthCheck: missing version");
  console.log("✓ healthCheck passes");
}

// ─── getCapabilities ──────────────────────────────────────────────────────────

function testGetCapabilities(): void {
  const caps = getCapabilities();
  for (const expected of EXPECTED_TASK_TYPES) {
    if (!caps.includes(expected)) throw new Error(`getCapabilities: missing task type '${expected}'`);
  }
  console.log("✓ getCapabilities passes");
}

// ─── executeSparky — malformed input ─────────────────────────────────────────

async function testMalformedInput(): Promise<void> {
  const result = await executeSparky({
    taskType: "pr_governance",
    payload: {},
  });
  // Should produce DEFER (missing objective and owner) without throwing
  const validOutcomes = ["ALLOW", "BLOCK", "ESCALATE", "DEFER", "REQUIRE_MORE_EVIDENCE"];
  if (!validOutcomes.includes(result.decision)) {
    throw new Error(`executeSparky malformed: unexpected decision '${result.decision}'`);
  }
  if (!result.trace_id) throw new Error("executeSparky malformed: missing trace_id");
  if (!result.requiredEvidence) throw new Error("executeSparky malformed: missing requiredEvidence");
  if (typeof result.blockingClass !== "boolean") throw new Error("executeSparky malformed: blockingClass must be boolean");
  console.log("✓ executeSparky handles malformed input gracefully");
}

// ─── executeSparky — minimal valid task_routing ───────────────────────────────

async function testMinimalRoutingInput(): Promise<void> {
  const result = await executeSparky({
    taskType: "task_routing",
    payload: {
      objective: "Route this architecture change to the correct specialist",
      owner: "test-operator",
      work_item_id: "smoke-test-001",
    },
  });
  const validOutcomes = ["ALLOW", "BLOCK", "ESCALATE", "DEFER", "REQUIRE_MORE_EVIDENCE"];
  if (!validOutcomes.includes(result.decision)) {
    throw new Error(`executeSparky routing: unexpected decision '${result.decision}'`);
  }
  if (!result.trace_id) throw new Error("executeSparky routing: missing trace_id");
  console.log("✓ executeSparky handles minimal routing input");
}

// ─── Run all tests ────────────────────────────────────────────────────────────

async function runAll(): Promise<void> {
  console.log("Running Sparky live layer smoke tests...\n");
  testHealthCheck();
  testGetCapabilities();
  await testMalformedInput();
  await testMinimalRoutingInput();
  console.log("\n✓ All smoke tests passed");
}

runAll().catch((err: Error) => {
  console.error("✗ Smoke test failed:", err.message);
  process.exit(1);
});
