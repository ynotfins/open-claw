# 10 — Project Workflow (Open Claw)

> Extends: `00-global-core.md` (tab separation, evidence, state discipline)
> Extends: `05-global-mcp-usage.md` (tool-first behavior)

## Project notes

Open Claw is a modular AI assistant platform. Development spans multiple domains
(orchestrator, memory, dev tools, comms, web). Phases should be scoped to one
module or integration at a time to keep diffs reviewable.

## PLAN output contract

PLAN must produce:
- Phases with explicit exit criteria
- Risks and unknowns
- A single AGENT prompt for the next phase
- If the phase has >5 connected steps, use a reasoning MCP tool before finalizing

## AGENT execution contract

AGENT must:
- Follow the PLAN prompt exactly — no freelancing
- Use MCP tools per `05-global-mcp-usage.md`
- Run tests and commands required by the phase
- Update `docs/ai/STATE.md` after each execution block
- Produce PASS/FAIL evidence for every tool call and command
- Stop immediately if assumptions break or requirements conflict

## DEBUG output contract

DEBUG must produce:
- Ranked likely causes (most to least probable)
- Minimal fix plan (smallest diff)
- Reproduction steps with evidence
- One AGENT prompt to implement and verify the fix

## Context attachment discipline

- Attach files with intent, not habit.
- Attach the minimum set needed for the current tab's job.
- Prefer referencing paths and targeted excerpts over pasting entire files.
- If a file is attached, assume it is read fully.
