# Agent Handoff — Open Claw

This file is a transient operator handoff note, not a canonical source of truth.

The historical 2026-02-23 handoff snapshot has been relocated to:

- `docs/ai/context/handoff-2026-02-23-phase1.md`

Use these files instead for current truth:

- `docs/ai/PLAN.md` for active phase status
- `docs/ai/STATE.md` for execution evidence
- `open-claw/docs/SETUP_NOTES.md` for local wrapper runtime/setup guidance
- `open-claw/docs/BLOCKED_ITEMS.md` for current unblock steps
- `vendor/openclaw/README.md` and `vendor/openclaw/docs/*` for upstream OpenClaw behavior

Current runtime command shape to follow:

- `openclaw onboard --install-daemon`
- `openclaw gateway status`
- `openclaw health`
- `openclaw dashboard`
- direct source fallback: `node openclaw.mjs ...`
- source checkout helper: `pnpm openclaw ...`

Do not treat older handoff snapshots as authoritative for runtime commands, environment loading, or supported upstream behavior.
