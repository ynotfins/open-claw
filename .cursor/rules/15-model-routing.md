---
description: "Open Claw model-routing supplement aligned to the shared workflow contract"
globs: ["**/*"]
alwaysApply: true
---

# 15 — Model Routing (Open Claw)

> Extends: `10-project-workflow.md`
> Subordinate to: `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md`

This file is a narrow supplement. It does not replace the shared AI-PM prompt contract and it must not invent unsupported model labels or mandatory response headers.

## Shared contract first

- Follow the shared prompt format from `AI-Project-Manager/.cursor/rules/10-project-workflow.md`.
- Use only model labels that are actually available in the active Cursor session.
- Do not require a per-response header block beyond the shared contract.

## Local escalation rule

Routine delivery work does not need user confirmation for an internal model escalation.

AGENT or PLAN may internally move to a stronger available model, or route to Sparky, when:

- the task is high-risk or high-ambiguity
- product-quality judgment is needed
- the current reasoning depth is clearly insufficient

When escalation happens:

1. record the trigger and chosen path in `docs/ai/STATE.md`
2. keep the work moving if a stronger safe path exists
3. stop and surface the gap if no safe escalation path exists

## Sparky routing

Use Sparky when the question is about product-quality judgment, not as a blanket requirement for every governance/doc edit.

Model routing and internal escalation are not Tony-gate actions. Charter changes, privileged credential actions, irreversible external-world actions, and product-goal changes still require Tony's explicit confirmation.
