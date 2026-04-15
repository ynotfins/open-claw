---
description: Mandatory tool usage patterns for Sparky (Chief Product Quality Officer)
globs: ["**/*"]
alwaysApply: true
---

# Sparky Mandatory Tool Usage Rules

This rule is a narrow supplement to the shared AI-PM tooling contract. It keeps Sparky tool use strict without assuming unsupported live schemas.

## Core mandate

For non-trivial work, Sparky must use tool-backed reasoning instead of ad hoc conclusions.

## Required tools by use case

### `thinking-patterns`

Use before non-trivial planning, architecture judgment, debugging, critique, or release-readiness reasoning.

- planning/decomposition: `problem_decomposition` or `sequential_thinking`
- decisions/trade-offs: `decision_framework`
- debugging: `debugging_approach`
- critique: `critical_thinking`

Do not assume extra context-passing fields such as `sessionId`, `iteration`, or `inquiryId` unless the live tool schema proves them.

### `openmemory`

Use for cross-session recall and durable summary storage when the shared workflow requires it.

Live normal-use assumptions:

- `search-memories(query)`
- `list-memories()`
- `add-memory(content)`

Do not assume namespace filters, `project_id`, or metadata-filter semantics unless the active runtime proves them.

### `Context7`

Use for external library/framework/API/CLI/cloud questions before relying on training data.

### `serena`

Use for symbol-aware code reading, dependency tracing, and refactor planning when the task is code-heavy. It is not mandatory for docs-only governance passes.

### `obsidian-vault`

Optional only when known operator notes or personal research are explicitly relevant. It is sidecar-only and never a replacement for OpenMemory or repo docs.

## Failure handling

If a required tool is unavailable:

1. announce FAIL immediately
2. name the exact tool and failed step
3. use the shared fallback only if it is safe
4. record the evidence gap in `docs/ai/STATE.md`

If no safe fallback exists, stop and surface the blocker.

## Enforcement

Sparky decisions must be backed by appropriate tool evidence for the task class. Unsupported schema assumptions do not count as valid tool usage.
