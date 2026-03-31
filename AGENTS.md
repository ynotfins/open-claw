# AGENTS.md — Open Claw

This repo uses a five-tab Cursor workflow: PLAN / AGENT / DEBUG / ASK / ARCHIVE.

## Authority Hierarchy (enforce this before anything else)

`open--claw` is the **strict enforcement center** of the tri-workspace. The product charter lives here.

| Priority | Document | Status |
| --- | --- | --- |
| 1 | `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md` | **Supreme product charter** — no agent, rule, doc, or prompt in any repo overrides it |
| 2 | Tony's explicit permission to change that file | Only way to amend the charter |
| 3 | `AUTHORITATIVE_STANDARD.md` and `TEAM_ROSTER.md` | Subordinate translations of the charter |
| 4 | Repo-local rules and workflow docs (this file, `.cursor/rules/*`) | Valid only when they do not conflict with the above |
| 5 | `docs/ai/STATE.md`, `docs/ai/HANDOFF.md` | **Operational evidence only** — never product law |

**Layer model:**

- `AI-Project-Manager` — workflow and process layer: tab contracts, execution discipline, state tracking, tool policy. It does not issue product law.
- `open--claw` — **strict enforcement center**: product charter, AI employee knowledgebase, Sparky's mandate, quality standards.
- `droidrun` — actuator layer: phone automation, MCP phone tools, Portal/APK runtime bridge.

## Authoritative rules

- `.cursor/rules/00-global-core.md` — non-negotiable behaviors
- `.cursor/rules/05-global-mcp-usage.md` — MCP tool usage policy
- `.cursor/rules/10-project-workflow.md` — tab contracts (Open Claw specific)
- `.cursor/rules/20-project-quality.md` — engineering standards (Open Claw specific)
- `docs/ai/CURSOR_WORKFLOW.md` — human-readable workflow overview

## State tracking

- `docs/ai/STATE.md` — **operational evidence log** (not product law); PLAN reads this first to understand current state, blockers, fallbacks, and cross-repo effects. AGENT updates it after every execution block using the enforced template in `10-project-workflow.md`.
- `docs/ai/PLAN.md` — active plan with phases and exit criteria
- `docs/ai/context/` — non-canonical artifact storage: session transcripts, bulk dumps, and ephemeral context files. Informative only; never authoritative.
- `docs/ai/archive/` — superseded docs. **Never consulted** by PLAN. Historical reference only.

## Context source priority (read in this order)

PLAN must reconstruct current system state from repo-tracked sources before consulting artifacts or chat history. If repo sources and chat context disagree, repo sources win unless current execution evidence proves otherwise.

1. `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md` — supreme product charter
2. `docs/ai/STATE.md` — operational evidence
3. `docs/ai/memory/DECISIONS.md` — key decisions with rationale
4. `docs/ai/memory/PATTERNS.md` — reusable patterns
5. `docs/ai/HANDOFF.md` — session handoff context (operational evidence only)
6. `docs/ai/context/` — transcript-derived artifacts and session dumps
7. Chat history / `@Past Chats` — **last resort only**; use only if the above sources are insufficient

## MCP policy

MCP tool usage is enforced via `.cursor/rules/05-global-mcp-usage.md`.
Tools are used for: code navigation, documentation lookup, reasoning, browser automation, web extraction, repo operations, and persistent memory.
Configuration lives outside the repo. Rules enforce behavior, not plumbing.

## Agent contract

AGENT must:

- Follow PLAN prompts exactly
- Update `docs/ai/STATE.md` after each execution block using the enforced template in `10-project-workflow.md`
- Provide PASS/FAIL evidence for every tool call and command
- Use MCP tools before falling back to manual approaches

## Project docs

- `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md` — **supreme product charter**
- `open-claw/AI_Employee_knowledgebase/AUTHORITATIVE_STANDARD.md` — curated house standard
- `open-claw/AI_Employee_knowledgebase/TEAM_ROSTER.md` — AI employee team structure
- `open-claw/docs/VISION.md` — project vision
- `open-claw/docs/REQUIREMENTS.md` — initial requirements
- `open-claw/docs/MODULES.md` — module boundaries
- `open-claw/docs/INTEGRATIONS.md` — target integrations
