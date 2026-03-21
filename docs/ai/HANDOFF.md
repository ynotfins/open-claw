# Agent Handoff — Open Claw

**Date**: 2026-03-21  
**Status**: Current handoff (replaces 2026-03-11 snapshot)  
**Primary source of truth**: `docs/ai/STATE.md` (mirrors governance state)

Previous handoff snapshot remains at `docs/ai/archive/handoff-2026-03-08.md`.

---

## 1. Project Role

`open--claw` is the execution/runtime repository for the OpenClaw-based assistant stack.  
Governance, workflow policy, and cross-project orchestration remain in `AI-Project-Manager`.

---

## 2. Current Runtime Truth

- OpenClaw runtime: **`v2026.3.13-1` via `~/openclaw-build`** (CLI `pnpm openclaw` matches systemd `dist/index.js`)
- Gateway: healthy on `127.0.0.1:18789` (UI) and `127.0.0.1:18792` (API health)
- Channels: Telegram + WhatsApp healthy; Signal disabled
- Windows node: **verify** `nodes status` — Desktop host may be **disconnected** until `node.cmd` is relaunched after reboot
- Execution mode: direct host path active (sandbox mode off by design for autonomous operation)
- Context engine: lossless-claw active for long-session resilience
- Canonical gateway restart: see `AI-Project-Manager/docs/ai/operations/openclaw-gateway-restart.md` (mirror: `docs/ai/operations/openclaw-gateway-restart.md`)

---

## 3. Phase Status

- Phase 0 — Project Kickoff: COMPLETE
- Phase 1 — Gateway Boot + Integration Scaffold: COMPLETE
- Phase 2 — First Live Integration: COMPLETE (2026-03-14)
- Post-Phase-2 hardening/ops: ACTIVE

---

## 4. Current Focus

1. Keep runtime startup and node connectivity stable across reboots.
2. Maintain secure secrets path (Bitwarden injection; no committed `.env*` files).
3. Continue controlled CrewClaw employee rollout and operational verification.

---

## 5. Read Order For Sessions

1. `AGENTS.md`
2. `docs/ai/STATE.md`
3. `docs/ai/PLAN.md`
4. `docs/ai/memory/DECISIONS.md`
5. `open-claw/docs/SETUP_NOTES.md`

Use archive docs as historical evidence only.
