# Agent Handoff — Open Claw

**Date**: 2026-03-29
**Status**: Current handoff (Phase 1A — CrewClaw stabilization in progress)
**Primary source of truth**: `docs/ai/STATE.md` (mirrors governance state)

Previous handoff snapshot remains at `docs/ai/archive/handoff-2026-03-08.md`.

---

## 1. Project Role

`open--claw` is the execution/runtime repository for the OpenClaw-based assistant stack.
Governance, workflow policy, and cross-project orchestration remain in `AI-Project-Manager`.

---

## 2. Current Runtime Truth (2026-03-29)

- OpenClaw runtime: **v2026.3.13** via `~/openclaw-build` (CLI `pnpm openclaw` + systemd `dist/index.js`)
- Gateway: healthy on `0.0.0.0:18789` (bind=lan), API health on `127.0.0.1:18792`
- Channels:
  - **Telegram**: healthy, running, `@Sparky4bot`, polling mode
  - **WhatsApp**: linked/stopped — **401 Unauthorized** — needs QR re-scan (`pnpm openclaw channels login --channel whatsapp`)
- Windows node: **Windows Desktop — connected** (verified 2026-03-29 preflight)
- Execution mode: direct host path active (sandbox mode off by design)
- Context engine: lossless-claw active for long-session resilience
- Canonical gateway restart: see `AI-Project-Manager/docs/ai/operations/openclaw-gateway-restart.md`

### CrewClaw Workers (as of 2026-03-29)

5 workers deployed (`api-integration-specialist`, `code-reviewer`, `financial-analyst`, `frontend-developer`, `overnight-coder`).

**NEW in Phase 1A:**
- Dockerfiles upgraded to `node:22-slim` + `openclaw@2026.3.13 --ignore-scripts`
- `entrypoint.sh` writes gateway remote config from env vars on startup
- `bot-telegram.js` calls `--agent main` (only registered agent on gateway)
- Named Docker volumes persist device identity across restarts
- **First run requires:** (1) set `OPENCLAW_GATEWAY_TOKEN_SECRET_ID` in `start-employees.ps1`, (2) run `start-employees.ps1` with BWS, (3) approve pairing requests: `openclaw devices list && openclaw devices approve <id>` for each worker

---

## 3. Phase Status

- Phase 0 — Project Kickoff: COMPLETE
- Phase 1 — Gateway Boot + Integration Scaffold: COMPLETE (2026-03-08)
- Phase 2 — First Live Integration: COMPLETE (2026-03-14)
- **Phase 1A — CrewClaw Worker Stabilization**: IN PROGRESS (2026-03-29)
- Phase 1B — Memory Bridge (OpenClaw ↔ OpenMemory): NOT STARTED (deferred)

---

## 4. Active Blockers

| Blocker | Action Required |
|---|---|
| WhatsApp 401 — session expired | User runs `pnpm openclaw channels login --channel whatsapp` and scans QR |
| `OPENCLAW_GATEWAY_TOKEN_SECRET_ID` placeholder in `start-employees.ps1` | Store gateway token in Bitwarden; update secret ID in script |
| CrewClaw workers not live (Telegram tokens empty in last run) | Run `start-employees.ps1` via BWS; approve device pairings |
| Memory bridge not built | Phase 1B design (deferred) |

---

## 5. Read Order For Sessions

1. `AGENTS.md`
2. `docs/ai/STATE.md`
3. `docs/ai/PLAN.md`
4. `docs/ai/memory/DECISIONS.md`
5. `open-claw/docs/SETUP_NOTES.md`

Use archive docs as historical evidence only.
