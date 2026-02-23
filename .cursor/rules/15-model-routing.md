# 15 — Model Routing (Open Claw)

> Extends: `10-project-workflow.md`

---

## Model Inventory

All model references must use these exact labels. No aliases, no abbreviations.

### Thinking-class models
These models perform extended internal reasoning before responding. Use for ambiguous,
high-stakes, multi-step, or architectural tasks where correctness matters more than speed.

- **GPT-5.2 High**
- **GPT-5.2 Extra High**
- **GPT-5.2 Codex High**
- **GPT-5.2 Codex High Fast**
- **GPT-5.2 Codex Fast**

### Non-thinking-class models
These models respond directly without extended reasoning. Use for implementation,
code generation, and execution tasks where the plan is already clear.

- **Sonnet 4.6**
- **Sonnet 4.5**
- **Sonnet 4**
- **Opus 4.6**
- **Opus 4.5**

### Fast utility models
Optimized for speed and low cost. Use for triage, summarization, compression,
and single-turn lookups where reasoning depth is not needed.

- **GPT-5.2 Fast**
- **GPT-5.2 Low**

---

## Mandatory Response Header

Every response in every tab must begin with this header block. No exceptions.

```
MODEL: <exact model label from inventory above>
CLASS: thinking-class | non-thinking-class | fast utility
TAB: PLAN | AGENT | DEBUG | ASK | ARCHIVE
DEFAULT FOR TAB: <default model label for this tab>
OVERRIDE: yes — <reason> | no
```

---

## Tab Defaults

| Tab | Default Model | Class |
|-----|--------------|-------|
| PLAN | GPT-5.2 High | thinking-class |
| AGENT | Sonnet 4.6 | non-thinking-class |
| DEBUG | GPT-5.2 High | thinking-class |
| ASK | GPT-5.2 Fast | fast utility |
| ARCHIVE | GPT-5.2 Low | fast utility |

**Rationale:**
- PLAN and DEBUG require deep reasoning to catch design flaws and root causes before
  any code is written or changed. Thinking-class models catch contradictions and
  edge cases that non-thinking models miss.
- AGENT executes a plan that has already been reasoned through. Non-thinking-class
  models are faster for straightforward implementation work.
- ASK and ARCHIVE handle lightweight single-turn lookups and compression where
  reasoning depth provides no benefit.

---

## Escalation Rules

### Rule A — AGENT Hard Escalation (MUST stop, no exceptions)

If AGENT is asked to perform any of the following:
- Multi-module refactor (touching more than one module boundary)
- Any change touching auth, security, secrets, or credential handling
- Designing new architecture or routing
- Modifying rules or governance files (`.cursor/rules/`, `AGENTS.md`)
- Debugging nondeterministic failures (flaky tests, race conditions, intermittent errors)

AGENT **must stop immediately** and output exactly:

```
SWITCH MODEL TO: GPT-5.2 Codex High (thinking-class)
WHY: <one sentence explaining the trigger>
NEXT PROMPT AFTER SWITCH: <one complete prompt ready to paste>
```

AGENT must not continue the task until the user confirms the model switch was applied.
This is a hard stop — no partial work, no "I'll just do the easy parts first."

### Rule B — PLAN Soft Escalation (recommend, may proceed if declined)

If PLAN is asked to design any of the following:
- Security boundaries or trust model
- Pricing or cost model decisions
- Multi-system integration design

PLAN should output:

```
RECOMMENDED SWITCH: GPT-5.2 Extra High (thinking-class)
WHY: <one sentence>
```

PLAN may proceed with the current model if the user declines the switch.

### Rule C — ASK Unresolved Turn Escalation (must stop at turn 3)

If ASK has not resolved the user's question within 2 turns, ASK must stop and output:

```
SWITCH MODEL TO: GPT-5.2 High (thinking-class)
WHY: <one sentence explaining why deeper reasoning is needed>
NEXT PROMPT AFTER SWITCH: <one complete prompt ready to paste>
```

---

## No Silent Escalation

If an escalation trigger occurs, the assistant must issue the switch request and
**must not continue the task**. Silently proceeding with the wrong model class
is a rule violation regardless of output quality.
