# Agent Handoff — Open Claw

**Date**: 2026-03-30
**Status**: Current handoff (Phase 1F — 13 curated Telegram assignments mapped, but live startup still blocked by unresolved token wiring and 2 new bots)
**Primary source of truth**: `docs/ai/STATE.md` (mirrors governance state)

Previous handoff snapshot remains at `docs/ai/archive/handoff-2026-03-08.md`.

---

## 1. Project Role

`open--claw` is the **strict enforcement center** of the tri-workspace. The supreme product charter — `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md` — lives here. No agent, prompt, rule, or doc in any repo may override it.

**Workspace layer model (durable operating truth):**

- `AI-Project-Manager` — workflow/process layer: tab contracts, state tracking, execution discipline, tool policy. Does not issue product law.
- `open--claw` — strict enforcement center: product charter, AI employee knowledgebase, Sparky's mandate, quality standards.
- `droidrun` — actuator layer: phone automation, MCP phone tools, Portal/APK runtime bridge.

`docs/ai/STATE.md` and `docs/ai/HANDOFF.md` (this file) are **operational evidence only**. They record what happened and what is blocked. They are not product law and cannot override the charter.

---

## 2. Current Runtime Truth (2026-03-30)

- OpenClaw runtime: **v2026.3.13** via `~/openclaw-build` (CLI `pnpm openclaw` + systemd `dist/index.js`)
- Gateway: healthy on `0.0.0.0:18789` (bind=lan), API health on `127.0.0.1:18792`
- Channels:
  - **Telegram**: healthy, running, `@Sparky4bot`, polling mode
  - **WhatsApp**: linked/stopped — **401 Unauthorized** — needs QR re-scan (`pnpm openclaw channels login --channel whatsapp`)
- Windows node: **Windows Desktop — connected** (verified 2026-03-29 preflight)
- Execution mode: direct host path active (sandbox mode off by design)
- Context engine: lossless-claw active for long-session resilience
- Canonical gateway restart: see `AI-Project-Manager/docs/ai/operations/openclaw-gateway-restart.md`

### Legacy CrewClaw Workers

10 legacy purchased workers are still running in Docker:

- `api-integration-specialist`
- `code-reviewer`
- `financial-analyst`
- `frontend-developer`
- `overnight-coder`
- `personal-crm`
- `script-builder`
- `seo-specialist`
- `software-engineer`
- `ux-designer`

### Curated Generated Runtime

The curated 15-employee squad now has a generated runtime at `open-claw/employees/deployed-curated/`.

- 15 employee packets are runtime-synced under `open-claw/AI_Employee_knowledgebase/AI_employees/`
- each packet now includes required docs, required runtime files, and copied assigned skills
- generated runtime passes:
  - `docker compose config`
  - `node --check` on generated bot files
  - PowerShell parse on `start-employees.ps1`
- current live-start blocker:
  - Telegram bot assignments are now defined for **13** curated workers
  - direct Bitwarden secret IDs are wired for **10** curated workers
  - the remaining already-assigned workers still need explicit `*_TOKEN` env vars or recorded Bitwarden secret IDs: `delivery-director`, `product-manager`, `sparky-chief-product-quality-officer`
  - two curated workers still need brand-new Telegram bots: `accessibility-auditor`, `backend-architect`
- first live start will still require gateway pairing approval:
  - `openclaw devices list`
  - `openclaw devices approve <id>`

---

## 3. Phase Status

- Phase 0 — Project Kickoff: COMPLETE
- Phase 1 — Gateway Boot + Integration Scaffold: COMPLETE (2026-03-08)
- Phase 2 — First Live Integration: COMPLETE (2026-03-14)
- Phase 1A — CrewClaw Worker Stabilization: COMPLETE enough for legacy runtime truth capture
- Phase 1C — Curated runtime sync and workflow validation: COMPLETE
- Phase 1D — Docs cross-reference alignment: COMPLETE
- Phase 1E — FINAL_OUTPUT_PRODUCT single-source-of-truth charter: COMPLETE
- **Phase 1F — Curated Telegram bot assignment mapping**: COMPLETE
- Phase 1B — Memory Bridge (OpenClaw ↔ OpenMemory): NOT STARTED (deferred)

---

## 4. Active Blockers

| Blocker | Action Required |
|---|---|
| WhatsApp 401 — session expired | User runs `pnpm openclaw channels login --channel whatsapp` and scans QR |
| 3 assigned curated worker token mappings still unresolved | Provide explicit `*_TOKEN` env vars or add direct Bitwarden secret IDs for `delivery-director`, `product-manager`, and `sparky-chief-product-quality-officer` |
| 2 new curated Telegram bots still need to be created | Create and wire bots for `accessibility-auditor` and `backend-architect` |
| Curated runtime not yet live-proven | Run `open-claw/employees/deployed-curated/start-employees.ps1`, then approve device pairings and perform smoke tests |
| Memory bridge not built | Phase 1B design (deferred) |

---

## 5. Read Order For Sessions

1. `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md` — supreme product charter (read this first, always)
2. `AGENTS.md`
3. `docs/ai/STATE.md` — operational evidence
4. `open-claw/AI_Employee_knowledgebase/OPENCLAW_WORKFLOW_CHECKLIST.md`
5. `open-claw/AI_Employee_knowledgebase/RUNTIME_VALIDATION_SUMMARY.md`
6. `open-claw/AI_Employee_knowledgebase/EMPLOYEE_READINESS_AUDIT.md`
7. `open-claw/AI_Employee_knowledgebase/SKILLS_AUDIT.md`
8. `open-claw/docs/SETUP_NOTES.md`

Use archive docs and `docs/ai/HANDOFF.md` as historical/operational evidence only, not product law.
