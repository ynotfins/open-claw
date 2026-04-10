# Execution State — Open Claw
<!-- markdownlint-disable MD024 MD040 MD046 MD052 MD037 MD034 -->

`docs/ai/STATE.md` is the **operational evidence log** for PLAN in the open--claw repo.
PLAN reads this before reasoning about blockers, fallbacks, next actions, and cross-repo effects.

> **Authority note**: This file is operational evidence only. It is not product law. The supreme governing charter is `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md` — it lives in this repo and governs the entire tri-workspace. If this file conflicts with the charter, the charter wins unconditionally.

---

## Current State Summary

> Last updated: 2026-04-09
> Archive pass: 2026-04-01 — 1,170 → 175 lines (archive/compaction pass, this session)
> Previous archive: `docs/ai/archive/state-log-full-history-2026-02-18-to-2026-03-21.md`

### Authority Reality

- **Supreme charter**: `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md` — immutable without Tony's permission
- **Enforcement kernel**: `.cursor/rules/01-charter-enforcement.md` — active, hard-stop on charter violations
- **Forbidden platforms**: macOS, iOS, Swift, Xcode, CocoaPods — violations stop execution immediately and route to Sparky
- **Sparky** (`sparky-chief-product-quality-officer`) is the exclusive ACCEPT/REFACTOR/REJECT authority for all file changes and release decisions
- **Quarantine system**: installed at 5 enforcement layers; `candidate_employees/**` (163 files) is permanently non-routable until promoted via `NON_ROUTABLE_QUARANTINE.md`

### Active Prompt Sequence Status

| Prompt | Description | Status |
|---|---|---|
| Prompt 7 | Tri-Workspace Governance Normalization | COMPLETE |
| Prompt 8 | Non-Routable Quarantine System | COMPLETE |
| Archive pass | STATE.md compaction (this task) | COMPLETE |
| Prompt 6 (next) | TBD — see PLAN | READY TO PROCEED |

### Phase Status

| Phase | Status | Closed |
|---|---|---|
| Phase 1 — Gateway Boot + First Agent Chat | COMPLETE | 2026-03-08 |
| Phase 2 — First Live Integration | COMPLETE | 2026-03-14 |
| Phase 1A — CrewClaw Worker Stabilization | COMPLETE (runtime fixes applied) | 2026-03-29 |
| Phase 1B — Employee Readiness Audit + Standard | COMPLETE | 2026-03-30 |
| Phase 1C — Curated Runtime Sync + Validation | COMPLETE | 2026-03-30 |
| Phase 1D — Docs Cross-Reference Alignment | COMPLETE | 2026-03-30 |
| Phase 1E — FINAL_OUTPUT_PRODUCT Charter | COMPLETE | 2026-03-30 |
| Phase 1F — Telegram Bot Assignment Mapping | COMPLETE | 2026-03-30 |
| Phase 1G — Employee Status Board | COMPLETE | 2026-03-30 |
| Autonomy Model Rewrite | COMPLETE | 2026-03-31 |
| Sparky Enforcement Gate + Delegation Chain | COMPLETE | 2026-03-31 |
| Charter Enforcement Kernel Install | COMPLETE | 2026-03-31 |
| Governance Normalization (Prompt 7) | COMPLETE | 2026-03-31 |
| Non-Routable Quarantine (Prompt 8) | COMPLETE | 2026-04-01 |
| **Memory Bridge (OpenClaw ↔ OpenMemory)** | **NOT STARTED** | — |

### Runtime Snapshot (as of 2026-03-29; last verified)

- OpenClaw runtime: v2026.3.13 via `~/openclaw-build` (CLI `pnpm openclaw` + systemd)
- Gateway: `0.0.0.0:18789` (bind=lan), API health `127.0.0.1:18792`
- Telegram: healthy, running, `@Sparky4bot`, polling mode
- WhatsApp: linked/stopped — **401 Unauthorized** — needs QR re-scan
- Windows node: Windows Desktop — connected (verified 2026-03-29)
- Curated runtime: generated and structurally validated at `open-claw/employees/deployed-curated/`; NOT yet live-started with real tokens

### Active Blockers

| Blocker | Severity | Status |
|---|---|---|
| WhatsApp 401 — session expired | MEDIUM | PENDING USER ACTION: `pnpm openclaw channels login --channel whatsapp` + QR scan |
| 3 curated worker Bitwarden UUIDs unresolved | MEDIUM | `delivery-director`, `product-manager`, `sparky-chief-product-quality-officer` — need explicit `*_TOKEN` env vars or new Bitwarden secret IDs |
| 2 curated worker Telegram usernames still unrecorded | LOW | `accessibility-auditor`, `backend-architect` — tokens exist; final usernames still need to be recorded cleanly in docs |
| Curated runtime not live-proven | HIGH | Run `open-claw/employees/deployed-curated/start-employees.ps1`, approve device pairings, run smoke tests |
| Memory bridge not built | HIGH | Phase 1B design (deferred) — OpenClaw ↔ OpenMemory bridge not yet built |
| `docs/ai/context/AGENT_EXECUTION_LEDGER.md` does not exist | LOW | Create when first open--claw AGENT block appends a ledger entry |

### Cross-Repo Dependencies Still Active

- `AI-Project-Manager/docs/ai/context/AGENT_EXECUTION_LEDGER.md` — ledger updated with archive pass entry (this task)
- `droidrun`: `02-non-routable-exclusions.md` mirrors the open--claw quarantine rule; iOS files bannered as non-routable
- `AI-Project-Manager`: `02-non-routable-exclusions.md` mirrors; `openmemory.mdc` updated; `TRI_WORKSPACE_CONTEXT_BRIEF.md` updated

### What Remains Unverified

- PowerShell bulk banner count (2,608) not independently spot-checked post-run
- `openmemory.mdc` exclusions require a live memory search test to confirm `candidate_employees/**` paths are excluded
- TAB_BOOTSTRAP_PROMPTS.md quarantine blocks not tested in a live Cursor session
- Sparky routing plumbing requires live multi-agent session validation
- Governance overlay (Phase 6B) still blocked on ANTHROPIC_API_KEY

### Archived Entries

Historical log (2026-02-18 through 2026-03-21):
`docs/ai/archive/state-log-full-history-2026-02-18-to-2026-03-21.md`

Phase 1A through Governance Normalization (2026-03-21 through 2026-03-31):
`docs/ai/archive/state-log-phase1a-governance-normalization-2026-03-21-to-2026-03-31.md`

---

## State Log

<!-- AGENT appends entries below this line after each execution block. -->

---

## 2026-04-01 — STATE.md Archive/Compaction Pass (Archive Prompt)

### Goal

Perform a dedicated archive/compaction pass for `open--claw/docs/ai/STATE.md` to bring it back into policy compliance, preserve all operationally relevant context, and promote decisions/patterns that existed only in STATE entries to the durable docs before archiving.

### Scope

- `open--claw/docs/ai/STATE.md` (this file) — primary target
- `open--claw/docs/ai/archive/state-log-phase1a-governance-normalization-2026-03-21-to-2026-03-31.md` — new archive file created
- `open--claw/docs/ai/memory/DECISIONS.md` — populated (was empty)
- `open--claw/docs/ai/memory/PATTERNS.md` — populated (was empty)
- `open--claw/docs/ai/HANDOFF.md` — updated to reflect Prompt 8 completion and archive pass
- `AI-Project-Manager/docs/ai/context/AGENT_EXECUTION_LEDGER.md` — archive pass entry appended

### Commands / Tool Calls

- Read: `open--claw/docs/ai/STATE.md` (1,170 lines) — PASS
- Read: `open--claw/docs/ai/HANDOFF.md` — PASS
- Read: `open--claw/docs/ai/memory/DECISIONS.md` (empty) — PASS
- Read: `open--claw/docs/ai/memory/PATTERNS.md` (empty) — PASS
- Read: `open-claw/AI_Employee_knowledgebase/FINAL_OUTPUT_PRODUCT.md` — PASS
- Read: `open--claw/AGENTS.md`, all `.cursor/rules/*.md`, `AI-Project-Manager/AGENTS.md`, `AI-Project-Manager/.cursor/rules/10-project-workflow.md` — PASS
- Read: `AI-Project-Manager/docs/ai/context/AGENT_EXECUTION_LEDGER.md` — PASS
- Write: `docs/ai/memory/DECISIONS.md` — promoted 10 key decisions — PASS
- Write: `docs/ai/memory/PATTERNS.md` — promoted 4 key patterns — PASS
- Write: `docs/ai/archive/state-log-phase1a-governance-normalization-2026-03-21-to-2026-03-31.md` — verbatim move of 16 historical STATE entries — PASS
- Write: `docs/ai/STATE.md` — compacted from 1,170 → ~175 lines — PASS
- Write: `docs/ai/HANDOFF.md` — updated phase status and added archive pass note — PASS
- Write: `AI-Project-Manager/docs/ai/context/AGENT_EXECUTION_LEDGER.md` — archive pass entry appended — PASS

### Changes

- **DECISIONS.md**: Populated from empty — 10 decisions promoted (worker agent identity, Docker volume pattern, OpenClaw install recipe, Sparky authority, handoff chain, reality checker role, forbidden platforms, KB archive policy, quarantine model, quarantine source of truth)
- **PATTERNS.md**: Populated from empty — 4 patterns promoted (OpenClaw Docker worker install, named Docker volume for device identity, curated employee packet structure, quarantine banner)
- **Archive file created**: `docs/ai/archive/state-log-phase1a-governance-normalization-2026-03-21-to-2026-03-31.md` — 16 historical STATE entries moved verbatim (2026-03-21 through 2026-03-31)
- **STATE.md**: Compacted from 1,170 lines → ~175 lines. New Current State Summary written at top. Prompt 8 entry (2026-04-01 quarantine) kept active. Old 2026-03-29 Current State Summary archived (outdated). Archive pass entry (this entry) appended.
- **HANDOFF.md**: Updated date to 2026-04-01, updated phase status table, added Prompt 8 quarantine and archive pass as completed items, blockers unchanged.

### Evidence

- PASS: `DECISIONS.md` populated — 10 durable decisions from archived STATE entries captured before archiving
- PASS: `PATTERNS.md` populated — 4 reusable patterns captured before archiving
- PASS: Archive file created with all 16 historical entries verbatim (no summarization)
- PASS: Active STATE.md reduced from 1,170 lines to ~175 lines — well below 800-line soft warning
- PASS: `FINAL_OUTPUT_PRODUCT.md` not modified
- PASS: No decisions/patterns lost — cross-checked DECISIONS.md, PATTERNS.md, HANDOFF.md before archiving
- PASS: Current State Summary is sufficient for PLAN to regain situational awareness
- PASS: Archive policy followed exactly (verbatim move, no summarization, archive file in `docs/ai/archive/`)

### Verdict

READY — STATE.md is now policy-compliant at ~175 lines (well below the 800-line soft warning zone and 1,000-line hard ceiling). Archive file created verbatim. DECISIONS.md and PATTERNS.md populated. Current State Summary captures authority reality, phase status, active blockers, unverified items, and cross-repo dependencies. Repo is clean to proceed to Prompt 6.

### Blockers

None for the archive pass itself. Active project blockers are captured in the Current State Summary above.

### Fallbacks Used

None.

### Cross-Repo Impact

- `AI-Project-Manager/docs/ai/context/AGENT_EXECUTION_LEDGER.md` — archive pass entry appended (required by AGENT contract)
- `open--claw/docs/ai/HANDOFF.md` — updated to reflect post-Prompt 8 and archive pass state

### Decisions Captured

None new. All promoted decisions were extracted from existing STATE entries and moved to `DECISIONS.md`.

### Pending Actions

- HANDOFF.md: updated in this pass — reflects current truth.
- DECISIONS.md: populated — no further action needed.
- PATTERNS.md: populated — no further action needed.
- `docs/ai/context/AGENT_EXECUTION_LEDGER.md` for open--claw still does not exist — create when first open--claw AGENT block runs a real execution task.

### What Remains Unverified

Same as Current State Summary above — the unverified items that were in STATE before the archive pass remain unverified (live quarantine exclusion test, live tab bootstrap test, Sparky routing, ANTHROPIC_API_KEY for governance overlay).

### What's Next

Proceed to Prompt 6. All governance and compaction prerequisites are now satisfied.

---

## 2026-04-01 — Non-Routable Quarantine System Installed (Prompt 8)

### Goal

Implement a path-based quarantine system that prevents out-of-scope material from entering routing, search, memory, or embeddings flows across the entire tri-workspace. This entry records the full open--claw-specific and cross-repo changes.

### Scope

- `open-claw/AI_Employee_knowledgebase/NON_ROUTABLE_QUARANTINE.md` — canonical registry (new)
- `open--claw/.cursor/rules/02-non-routable-exclusions.md` — enforcement rule (new)
- `AI-Project-Manager/.cursor/rules/02-non-routable-exclusions.md` — mirror enforcement rule (new)
- `droidrun/.cursor/rules/02-non-routable-exclusions.md` — mirror enforcement rule (new)
- `open-claw/AI_Employee_knowledgebase/README.md` — quarantine notice added
- `open-claw/AI_Employee_knowledgebase/SOURCE_LIBRARY_CATALOG.md` — quarantine status table added
- `open-claw/AI_Employee_knowledgebase/EMPLOYEE_READINESS_AUDIT.md` — quarantine notice added
- `AI-Project-Manager/.cursor/rules/openmemory.mdc` — memory exclusions added
- `droidrun/.cursor/rules/openmemory.mdc` — memory exclusions added
- `AI-Project-Manager/docs/ai/context/TRI_WORKSPACE_CONTEXT_BRIEF.md` — quarantine table added
- `open--claw/docs/ai/tabs/TAB_BOOTSTRAP_PROMPTS.md` — quarantine block added to PLAN and AGENT tabs
- `droidrun/docs/ai/tabs/TAB_BOOTSTRAP_PROMPTS.md` — quarantine block added to PLAN and AGENT tabs
- All 2,608 files in `candidate_employees/**` — `<!-- NON-ROUTABLE — OUT OF SCOPE -->` banner prepended
- `droidrun/src/droidrun/tools/driver/ios.py` — `# NON-ROUTABLE — OUT OF SCOPE` banner prepended
- `droidrun/src/droidrun/tools/ui/ios_provider.py` — `# NON-ROUTABLE — OUT OF SCOPE` banner prepended
- `droidrun/src/droidrun/tools/ios/__init__.py` — `# NON-ROUTABLE — OUT OF SCOPE` banner prepended

### Commands / Tool Calls

- PowerShell: bulk prepend `<!-- NON-ROUTABLE — OUT OF SCOPE -->` to 2,608 candidate_employees files — PASS
- StrReplace: bannered 3 droidrun iOS files with `# NON-ROUTABLE — OUT OF SCOPE` — PASS
- Write: Created `NON_ROUTABLE_QUARANTINE.md` with canonical registry, exclusion definitions, promotion gate, and audit trail — PASS
- Write: Created 3 x `02-non-routable-exclusions.md` rule files (alwaysApply: true; search, memory, embeddings, routing exclusions) — PASS
- StrReplace: Updated `README.md`, `SOURCE_LIBRARY_CATALOG.md`, `EMPLOYEE_READINESS_AUDIT.md` — PASS
- StrReplace: Updated `openmemory.mdc` in AI-Project-Manager and droidrun — PASS
- StrReplace: Updated `TRI_WORKSPACE_CONTEXT_BRIEF.md` with quarantine table — PASS
- StrReplace: Updated both `TAB_BOOTSTRAP_PROMPTS.md` files with quarantine blocks in PLAN and AGENT tabs — PASS
- Write: Updated `STATE.md` in all 3 repos — PASS

### Changes

- Created `NON_ROUTABLE_QUARANTINE.md`: canonical quarantine registry with exclusion path list, definition of "non-routable", promotion gate, and audit trail
- Created `02-non-routable-exclusions.md` in open--claw, AI-Project-Manager, and droidrun: alwaysApply: true rule excluding candidate_employees/** from search, memory, embeddings, routing
- Updated `README.md`: quarantine notice section added at top
- Updated `SOURCE_LIBRARY_CATALOG.md`: quarantine status column added to source table
- Updated `EMPLOYEE_READINESS_AUDIT.md`: quarantine notice section added
- Prepended `<!-- NON-ROUTABLE — OUT OF SCOPE -->` to all 2,608 candidate_employees/** markdown files
- Prepended `# NON-ROUTABLE — OUT OF SCOPE` to 3 droidrun iOS Python files

### Evidence

- PASS: `NON_ROUTABLE_QUARANTINE.md` created with all required sections (canonical registry, exclusion list, promotion gate, audit trail)
- PASS: 3 x `02-non-routable-exclusions.md` files created with alwaysApply: true
- PASS: 2,608 candidate_employees files bannered via PowerShell bulk prepend
- PASS: 3 droidrun iOS files bannered via StrReplace
- PASS: openmemory.mdc updated in both AI-Project-Manager and droidrun
- PASS: TAB_BOOTSTRAP_PROMPTS.md updated in open--claw and droidrun (PLAN and AGENT tabs)
- PASS: TRI_WORKSPACE_CONTEXT_BRIEF.md updated
- PASS: STATE.md updated in all 3 repos
- PASS: No files deleted — quarantine-only pass
- PASS: FINAL_OUTPUT_PRODUCT.md not modified

### Verdict

READY — Quarantine system installed at 5 enforcement layers: (1) file banners, (2) `.cursor/rules/` enforcement rules, (3) `openmemory.mdc` memory exclusions, (4) bootstrap prompt blocks, (5) canonical registry with promotion gate. No quarantined files deleted. Canonical source of truth: `NON_ROUTABLE_QUARANTINE.md`.

### Blockers

None.

### Fallbacks Used

None.

### Cross-Repo Impact

AI-Project-Manager: `02-non-routable-exclusions.md` created; `openmemory.mdc` updated; `TRI_WORKSPACE_CONTEXT_BRIEF.md` updated.
droidrun: `02-non-routable-exclusions.md` created; iOS files bannered; `openmemory.mdc` updated; `TAB_BOOTSTRAP_PROMPTS.md` updated.

### Decisions Captured

- Quarantine is path-based and enforced at 5 layers simultaneously.
- candidate_employees/** is permanently non-routable until explicit promotion via `NON_ROUTABLE_QUARANTINE.md` promotion gate.
- Quarantine is a banner-only pass — no files deleted under any circumstance.
- Canonical source of truth for all quarantine status decisions: `open-claw/AI_Employee_knowledgebase/NON_ROUTABLE_QUARANTINE.md`.

### Pending Actions

- open--claw `docs/ai/context/AGENT_EXECUTION_LEDGER.md` does not yet exist — create when the first open--claw AGENT block appends a ledger entry.
- open--claw STATE.md required a dedicated archive pass before the next non-trivial prompt block — **COMPLETED in this session**.

### What Remains Unverified

- PowerShell bulk prepend banner count: 2,608 reported but not independently spot-checked post-run.
- openmemory.mdc exclusions require a live memory search test to confirm candidate_employees paths are excluded.
- TAB_BOOTSTRAP_PROMPTS.md quarantine blocks: not tested in a live Cursor session to confirm they surface correctly on session start.

### What's Next

STATE.md archive pass complete. Proceed to Prompt 6.
---

## 2026-04-06 23:25 — Serena Project Normalization

### Goal

Add the repo-local Serena project for OpenClaw runtime work and mirror only the minimum local guidance needed so this repo uses the correct exact-path project without letting repo-root governance/docs masquerade as the main Serena code project.

### Scope

- `open--claw/.gitignore`
- `open--claw/open-claw/.serena/project.yml`
- `open--claw/AGENTS.md`
- `open--claw/docs/ai/tabs/TAB_BOOTSTRAP_PROMPTS.md`
- `open--claw/docs/ai/HANDOFF.md`

### Commands / Tool Calls

- Tools: `ReadFile`, `ApplyPatch`
- Cross-repo verification tools used from AI-Project-Manager: `Glob`, `rg`

### Changes

- Updated `.gitignore` so `open-claw/.serena/project.yml` is commit-tracked while other Serena-local artifacts stay ignored.
- Created `open-claw/.serena/project.yml` with the runtime-specific Serena scope and ignored-path list.
- Added minimal repo-local guidance to `AGENTS.md`, `TAB_BOOTSTRAP_PROMPTS.md`, and `HANDOFF.md` telling sessions to activate `D:/github/open--claw/open-claw` by exact path for code work.

### Evidence

- PASS: `open-claw/.serena/project.yml` exists and is readable.
- PASS: `.gitignore` now unignores only `open-claw/.serena/project.yml`.
- PASS: `AGENTS.md`, tab bootstrap prompts, and handoff all state that repo-root docs/governance are not the default Serena code project.

### Verdict

READY — OpenClaw runtime now has the intended repo-local Serena project and the local guidance stays scoped to runtime code.

### Blockers

None.

### Fallbacks Used

None.

### Cross-Repo Impact

- Matches the AI-PM Serena project map and fallback policy.
- Keeps OpenClaw aligned with the DroidRun and AI-PM path-based activation model.

### Decisions Captured

- OpenClaw runtime Serena scope is `D:/github/open--claw/open-claw`, not repo root.
- Repo-root governance/docs work uses targeted read/search fallback unless a separate Serena project is explicitly activated.

### Pending Actions

- Live-test a fresh OpenClaw session to confirm the exact-path activation works as documented.

### What Remains Unverified

- Fresh-session Serena activation for `D:/github/open--claw/open-claw` has not yet been manually exercised after this normalization.

### What's Next

Use `D:/github/open--claw/open-claw` as the first Serena activation path on the next OpenClaw runtime code task.
---

## 2026-04-07 00:12 — MCP Tool Governance Alignment

### Goal

Mirror the updated tri-workspace tool policy so OpenClaw runtime work uses repo-first docs, requires the right high-value tools only when relevant, and stops to notify the user if a required tool is unavailable.

### Scope

- `open--claw/.cursor/rules/05-global-mcp-usage.md`
- Local config: `open--claw/.cursor/mcp.json`

### Commands / Tool Calls

- Tools: `ReadFile`, `ApplyPatch`
- Cross-repo verification from AI-Project-Manager: `WebSearch`, `ReadLints`

### Changes

- Rewrote the active MCP rule to align with the new repo-first docs and stop-notify tool policy.
- Added local `.cursor/mcp.json` so `serena`, `Exa Search`, `playwright`, `firecrawl-mcp`, and `Magic MCP` can be project-scoped in this workspace.
- Removed `sequential-thinking`, `shell-mcp`, and GitKraken MCP from the supported toolchain in the active rule surface.

### Evidence

- PASS: `.cursor/rules/05-global-mcp-usage.md` now requires repo docs first and external-doc query discipline.
- PASS: `.cursor/mcp.json` exists for this repo with the intended project-local servers.

### Verdict

READY — OpenClaw runtime now mirrors the cleaned high-value tool policy and has a project-local MCP config for heavier servers.

### Blockers

None.

### Fallbacks Used

None.

### Cross-Repo Impact

- Matches the canonical tool policy in AI-Project-Manager.

### Decisions Captured

- OpenClaw runtime keeps `playwright`, `firecrawl-mcp`, and `Magic MCP` local to this workspace rather than global.

### Pending Actions

- Reload Cursor to apply the new local MCP config.

### What Remains Unverified

- The new local MCP tool set has not yet been live-smoke-tested after reload.

### What's Next

Reload Cursor and verify the OpenClaw workspace exposes the expected project-local tools.

---

## 2026-04-08 00:15 — Serena Root Project + Workflow Parity

### Goal

Normalize the open--claw repo-root Serena project and mirror the latest workflow/tool-discipline updates from AI-Project-Manager.

### Scope

`.serena/project.yml`, `.cursor/rules/05-global-mcp-usage.md`, `.cursor/rules/10-project-workflow.md`, `docs/ai/tabs/TAB_BOOTSTRAP_PROMPTS.md`.

### Commands / Tool Calls

- Serena `activate_project`
- direct file edits from AI-Project-Manager governance pass

### Changes

- Updated repo-root Serena config so `open--claw` is a governance/docs Serena project.
- Clarified that `open--claw` repo root and `open-claw-runtime` are separate Serena projects.
- Added `Required Tools` prompt contract and launch-integrity rule parity.
- Updated Serena activation guidance to include `D:/github/open--claw` and `D:/github/droidrun`.

### Evidence

- PASS: `D:/github/open--claw` activates in Serena.
- PASS: repo-root `.serena/project.yml` now contains governance/docs-specific initial prompt and ignored runtime paths.

### Verdict

PASS — repo-root Serena behavior is now explicitly modeled instead of implicitly assumed.

### Blockers

- Current session activation still showed stale/empty language metadata for repo root; requires post-restart confirmation.

### Fallbacks Used

- Used exact-path activation and repo docs while cached Serena state remained stale.

### Cross-Repo Impact

- Mirrors AI-Project-Manager governance updates.

### Decisions Captured

- `open--claw` must keep two Serena projects: repo-root governance/docs and runtime subproject.

### Pending Actions

- Re-check repo-root Serena metadata after Cursor restart.

### What Remains Unverified

- Post-restart repo-root Serena metadata freshness.

### What's Next

- Verify both `open--claw` and `open-claw-runtime` appear healthy after restart.

---

## 2026-04-09 01:20 — Team Readiness Hardening + OpenMemory Drift Cleanup

### Goal

Realign OpenClaw handoff/rule surfaces with the repaired OpenMemory transport and add an operating model for Sparky plus the curated 15-employee squad.

### Scope

- `.cursor/rules/05-global-mcp-usage.md`
- `docs/ai/HANDOFF.md`
- `open-claw/AI_Employee_knowledgebase/README.md`
- `open-claw/AI_Employee_knowledgebase/TEAM_OPERATING_SYSTEM.md`

### Commands / Tool Calls

- Read current handoff, workflow checklist, readiness board, roster, and runtime validation docs
- Read post-restart OpenMemory verification outputs from AI-PM
- File edits only

### Changes

- Fixed the stale literal `` `r`n `` formatting bug in the OpenClaw MCP rule so the Serena activation map is readable again
- Updated OpenClaw `HANDOFF.md` to reflect repaired OpenMemory transport and current team-readiness priorities
- Added `TEAM_OPERATING_SYSTEM.md` to define pods, handoff chain, readiness states, and activation order for the curated squad
- Added the new operating-system doc to the knowledgebase README map

### Evidence

- PASS: curated roster already defines the 15 named employees and reporting chain
- PASS: readiness docs already track the real runtime blockers: 2 missing new bots, 3 unresolved direct token mappings, and first-run gateway pairing
- PASS: AI-PM OpenMemory verification remains green after restart (`VERIFY_OPENMEMORY_OK`)
- PASS: the operating model now exists as a single knowledgebase reference instead of being implied across multiple files

### Verdict

PASS — OpenClaw now has a clearer route from curated packets to an actual managed delivery team led by Sparky.

### Pending Actions

- Make the curated runtime `live_ready` by closing the 2 bot gaps and 3 direct secret-wiring gaps
- Exercise the delivery chain on a small internal packet before the first large external clone project
- Build the worker-facing memory-promotion path for Phase 1B

### What's Next

- Continue moving the curated squad from `packet_ready`/`runtime_ready` toward `smoke_ready` and `live_ready`.

---

## 2026-04-09 02:05 — Curated Squad Readiness Automation

### Goal

Make the curated 15-worker runtime measurable and partially startable so unresolved workers no longer block the whole squad.

### Scope

- `open-claw/scripts/sync_curated_employee_runtime.py`
- generated runtime artifacts
- knowledgebase readiness docs

### Commands / Tool Calls

- Regenerated runtime with `python open-claw/scripts/sync_curated_employee_runtime.py`
- Ran `open-claw/employees/deployed-curated/start-employees.ps1 -CheckOnly`
- Updated runtime and knowledgebase docs

### Changes

- Added `CURATED_TEAM_STATUS.json` as the generated machine-readable readiness source of truth
- Added deployed runtime `team-status.json`
- Upgraded generated `start-employees.ps1` to support `-CheckOnly`, partial startup, and `-Strict`
- Added `MEMORY_PROMOTION_TEMPLATE.md` and linked it from the team operating system
- Updated handoff/runtime docs to reflect the new check-only proof path

### Evidence

- PASS: generator completed with all validation checks green
- PASS: `-CheckOnly` shows 10 currently startable curated workers
- PASS: `-CheckOnly` shows the exact 5 blocked workers and why
- PASS: blocked workers match the known remaining gaps, not hidden runtime surprises

### Verdict

PASS — curated runtime startup is now evidence-driven and no longer all-or-nothing.

### Pending Actions

- Resolve direct mapping for `delivery-director`, `product-manager`, and `sparky-chief-product-quality-officer`
- Create new Telegram bots for `accessibility-auditor` and `backend-architect`
- Run the first curated-worker live smoke start after gateway pairing approval

### What's Next

- Use the readiness manifest and partial-start flow to move the curated squad toward `smoke_ready`.

---

## 2026-04-09 05:45 — Sparky Super-Coder Upgrade + Voice Front Desk Scaffold

### Goal

Strengthen the curated employee skill layer, turn Sparky into the broadest technical gate in the squad, and add the first real phone/voice runtime surface for live-human answering.

### Scope

- curated employee skill assignments under `open-claw/AI_Employee_knowledgebase/AI_employees/`
- new skill definitions under `open-claw/skills/`
- standalone phone/voice runtime under `open-claw/services/voice-front-desk-agent/`
- knowledgebase and handoff docs

### Commands / Tool Calls

- Audited current curated skill assignments and runtime generator requirements
- Queried current docs for Twilio Voice and ElevenLabs via Context7
- Added new skill files and updated curated employee packets
- Ran `python open-claw/scripts/sync_curated_employee_runtime.py`
- Ran `npm install express twilio ws zod dotenv @elevenlabs/elevenlabs-js`
- Ran `npm run check` in `open-claw/services/voice-front-desk-agent`
- Started the voice service locally and checked `http://127.0.0.1:8788/health`

### Changes

- Added three new tracked skills:
  - `twilio-voice-intake`
  - `elevenlabs-voice-clone`
  - `phone-support-intake`
- Expanded Sparky into a broader super-coder/final-gate packet with cross-domain skills for engineering, QA, communications, and phone/voice integration
- Added targeted skill upgrades for key specialists:
  - `delivery-director`
  - `product-manager`
  - `backend-architect`
  - `software-architect`
  - `accessibility-auditor`
  - `ux-architect`
- Added `VOICE_FRONT_DESK_STACK.md` so phone/voice work has a documented home without breaking the curated 15-worker invariant
- Added a modular standalone service at `open-claw/services/voice-front-desk-agent/` with:
  - env parsing
  - TwiML generation for inbound calls
  - Twilio voice webhook routes
  - websocket intake path
  - Dockerfile and runtime README

### Evidence

- PASS: `sync_curated_employee_runtime.py` reports all 15 curated employees still structurally valid
- PASS: copied skill folders now include the new Twilio and ElevenLabs skills inside Sparky's packet
- PASS: regenerated `CURATED_TEAM_STATUS.json` reflects Sparky's expanded skill bundle
- PASS: `npm run check` succeeds for `open-claw/services/voice-front-desk-agent`
- PASS: local health probe returns:
  - `{"ok":true,"voiceMode":"media-stream","publicBaseUrlConfigured":false,"websocketUrlConfigured":false,"elevenLabsConfigured":false}`

### Verdict

PASS WITH EXTERNAL SETUP REMAINING — the employee/skill layer is stronger, Sparky is upgraded, and the first real phone/voice runtime surface now exists in-repo. The voice stack is not yet live because external telephony credentials, cloned-voice credentials, and public webhook hosting are still missing.

### Pending Actions

- Resolve direct mapping for `delivery-director`, `product-manager`, and `sparky-chief-product-quality-officer`, or provide stable `*_TOKEN` env vars
- Create new Telegram bots for `accessibility-auditor` and `backend-architect`
- Add Twilio Voice credentials and a phone number
- Add ElevenLabs API key plus `voice_id` or `agent_id`
- Expose the voice service on public HTTPS/WSS and run a real smoke call

### What's Next

- Use the stronger Sparky packet plus upgraded specialist skills to push the curated squad toward `smoke_ready`
- Turn the voice-front-desk scaffold into a live call flow after Twilio and ElevenLabs provisioning is in place

---

## 2026-04-09 06:35 — Nerve Install + Secret Inventory Sync + Sparky Replacement Audit

### Goal

Install the Nerve web UI without disturbing the existing OpenClaw runtime, sync the latest Bitwarden worker-token inventory, and audit `temp/Sparky` as a possible full replacement for the curated Sparky packet.

### Scope

- `temp/openclaw-nerve/`
- `open-claw/scripts/start-openclaw-nerve.ps1`
- `open-claw/scripts/sync_curated_employee_runtime.py`
- `open-claw/AI_Employee_knowledgebase/*`
- `docs/ai/HANDOFF.md`

### Commands / Tool Calls

- Read Nerve quick-start and repo docs
- Cloned `https://github.com/daggerhashimoto/openclaw-nerve.git` into `temp/openclaw-nerve`
- Ran `npm install` and `npm run build` for Nerve
- Launched Nerve locally and verified HTTP `200` on `http://127.0.0.1:3080`
- Read latest Bitwarden screenshots and patched missing worker-token inventory entries
- Updated runtime generator and regenerated curated artifacts
- Audited `temp/Sparky` and documented the replacement verdict

### Changes

- Installed Nerve in an isolated temp path so it sits in front of the gateway instead of replacing any existing runtime
- Added `open-claw/scripts/start-openclaw-nerve.ps1` as a no-secrets launcher that uses env-backed gateway auth
- Added the missing worker-token inventory entries for:
  - `ACCESSIBILITY_AUDITOR`
  - `BACKEND_ARCHITECT`
- Updated the curated runtime generator so those two workers are now token-backed with temporary `TBD` usernames until the final bot handles are recorded
- Regenerated `current_employees.md`, `CURATED_TEAM_STATUS.json`, and deployed-curated artifacts
- Added:
  - `SOURCE_REPOS_INDEX.md`
  - `SPARKY_REPLACEMENT_AUDIT.md`

### Evidence

- PASS: Nerve build completed successfully
- PASS: local Nerve probe returned HTTP `200` on `http://127.0.0.1:3080`
- PASS: regenerated roster now shows `accessibility-auditor` and `backend-architect` as `direct_uuid_wired`
- PASS: structural runtime regeneration still reports all 15 curated packets valid
- PASS: `temp/Sparky` audit concludes merge/salvage, not full replacement

### Verdict

PASS WITH FOLLOW-UP — Nerve is installed safely, the two missing worker tokens are now captured in repo docs and generator logic, and the temp Sparky packet is now documented as a governance/playbook source rather than a drop-in replacement.

### Pending Actions

- Record the final Telegram usernames for `accessibility-auditor` and `backend-architect`
- Resolve direct secret mapping or env injection for `delivery-director`, `product-manager`, and `sparky-chief-product-quality-officer`
- Decide whether Nerve remains an optional local cockpit or becomes part of the standard OpenClaw operator workflow
- If a deeper upstream import wave is needed, perform a full per-file index of local `source_repos` mirrors

### What's Next

- Use the updated 15-token roster to push the curated team closer to a real smoke start
- Keep salvaging doctrine from `temp/Sparky` without replacing the curated Sparky packet wholesale

## 2026-04-09 00:45 — Bootstrap And Workflow Mirror Alignment

### Goal

Align the open--claw bootstrap prompts and mirrored workflow docs with the current tri-workspace policy so PLAN, AGENT, DEBUG, and ARCHIVE stop using stale recovery assumptions.

### Scope

Touched `docs/ai/tabs/TAB_BOOTSTRAP_PROMPTS.md`, `.cursor/rules/10-project-workflow.md`, `docs/ai/CURSOR_WORKFLOW.md`, `AGENTS.md`, `docs/ai/HANDOFF.md`, and `docs/ai/STATE.md`.

### Commands / Tool Calls

`ReadFile`, `rg`, `ApplyPatch`, `ReadLints`.

### Changes

- Updated tab bootstraps to require exactly one AGENT block from PLAN, include ledger gating, and use OpenMemory-first recovery with `STATE.md` / `DECISIONS.md` / `PATTERNS.md` / `HANDOFF.md`.
- Updated mirrored workflow docs/rules to match current tool, ledger, and source-priority policy.
- Rolled forward stale handoff/state wording so the summary surfaces reflect the latest worker-readiness reality instead of the older "new bots needed" wording.

### Evidence

- PASS: open--claw bootstrap prompt file updated and lint-clean
- PASS: mirrored workflow docs (`CURSOR_WORKFLOW.md`, `AGENTS.md`, `HANDOFF.md`) updated and lint-clean
- PASS: `ReadLints` returned no errors for touched open--claw files

### Verdict

READY — open--claw now mirrors the current policy on bootstrap sequencing, ledger use, and current curated-worker blocker wording.

### Blockers

None.

### Fallbacks Used

- Used targeted doc reads instead of Serena because this was a docs/rules audit, not a code-navigation task.

### Cross-Repo Impact

- Mirrors AI-Project-Manager governance updates so cross-repo tab behavior stays consistent.

### Decisions Captured

- Open--claw should keep using the execution ledger as a gated fallback only, never as default bootstrap context.
- Curated-worker status wording must track token-vs-username reality precisely to avoid misleading PLAN.

### Pending Actions

- Create the first open--claw local `docs/ai/context/AGENT_EXECUTION_LEDGER.md` entry when the next real open--claw AGENT execution block runs.

### What Remains Unverified

- Fresh-session behavior of the updated open--claw tab prompts inside Cursor.

### What's Next

- Resume curated-worker runtime hardening using the corrected bootstrap and blocker surfaces.

## 2026-04-10 01:20 — Reasoning Policy Mirror + Low-Bloat Bootstrap Tightening

### Goal

Mirror the new reasoning/tool policy into open--claw and reduce default bootstrap preload so PLAN relies on memory plus `STATE.md` first.

### Scope

Touched `.cursor/rules/05-global-mcp-usage.md`, `.cursor/rules/10-project-workflow.md`, and `docs/ai/tabs/TAB_BOOTSTRAP_PROMPTS.md`.

### Commands / Tool Calls

`ReadFile`, `rg`, `ApplyPatch`, `ReadLints`.

### Changes

- Promoted `thinking-patterns` over the old Clear Thought naming in active workflow/rule surfaces.
- Added conditional guidance for `context-matic`, `obsidian-vault`, and `filesystem`.
- Tightened PLAN bootstrap so `STATE.md` is the first repo file after OpenMemory and other docs stay on-demand.

### Evidence

- PASS: open--claw mirrored rule and tab files updated successfully
- PASS: no linter errors in touched open--claw files

### Verdict

READY — open--claw bootstrap behavior now matches the lower-bloat recovery model and new reasoning MCP policy.

### Blockers

None.

### Fallbacks Used

- None.

### Cross-Repo Impact

- Mirrors the AI-Project-Manager canonical workflow/rule migration.

### Decisions Captured

- open--claw PLAN recovery should default to memory plus `STATE.md`, not broad multi-doc preload.

### Pending Actions

- Run the next real open--claw planning cycle through the updated bootstrap and confirm it stays context-light in practice.

### What Remains Unverified

- Live-session behavior of the updated open--claw bootstrap prompt under real task load.

### What's Next

- Continue curated runtime work with the leaner recovery path now in place.

## 2026-04-10 10:35 — Sparky Thinking-Patterns Alignment

### Goal

Align Sparky's packet with the newly promoted thinking-patterns MCP policy so his default tool usage matches the global reasoning rules.

### Scope

Touched `open-claw/AI_Employee_knowledgebase/AI_employees/sparky-chief-product-quality-officer/TOOLS.md`.

### Commands / Tool Calls

`ReadFile`, `ApplyPatch`.

### Changes

- Added `thinking-patterns reasoning` to Sparky's primary tools.
- Added explicit usage expectations covering `sequential_thinking`, `problem_decomposition`, `mental_model`, `decision_framework`, `debugging_approach`, and `critical_thinking`.

### Evidence

- PASS: Sparky packet now names `thinking-patterns` directly in his primary tool surface
- PASS: Sparky packet now instructs near-default use on non-trivial prompts

### Verdict

READY — Sparky's worker packet now reflects the active global reasoning policy instead of relying on implicit cross-repo inheritance alone.

### Cross-Repo Impact

- Mirrors the global `MCP-AGENT_RULES.mdc` rollout from the governance layer.

### What's Next

- Apply the same compact tool-expectation pattern to any other high-autonomy worker packets that should explicitly inherit the thinking-patterns discipline.

## 2026-04-10 12:05 — Sparky Video-Recovery Upgrade + Skill Runtime Validation Pass

### Goal

Strengthen Sparky for damaged-video recovery work, fix the recorded Telegram usernames for the two remaining curated workers, and re-prove the OpenClaw skill/runtime packaging path with actual validation commands.

### Scope

Touched Sparky packet files, added two new house skills under `open-claw/skills/`, hardened the employee-runtime sync and validation scripts, refreshed generated roster artifacts, and updated the skills audit surface.

### Commands / Tool Calls

`ReadFile`, `Shell`, `ApplyPatch`, `Context7`, `ReadLints`, plus read-only exploration subagents for the skill system and factory temp assets.

### Changes

- Added new skills:
  - `open-claw/skills/video-repair-forensics/SKILL.md`
  - `open-claw/skills/media-recovery-validation/SKILL.md`
- Expanded Sparky packet:
  - added `approval-gate`, `video-repair-forensics`, and `media-recovery-validation` to `SKILLS.md`
  - added media-recovery tool expectations to `TOOLS.md`
  - added a damaged-video recovery workflow to `WORKFLOWS.md`
  - updated Sparky `CHECKLIST.md` and `AUDIT.md` to reflect the new assignments
- Updated `sync_curated_employee_runtime.py` so:
  - `accessibility-auditor` now records `ACCESS_AUDITOR_ALLISON_BOT`
  - `backend-architect` now records `BACKEND_BRUCE_BOT`
  - skill parsing only reads actual bullet-list skill assignments instead of every backticked token in `SKILLS.md`
- Updated `validate_openclaw_workflow.py` to use the same safer skill parsing logic.
- Updated `AI_Employee_knowledgebase/SKILLS_AUDIT.md` with the two new media-recovery skills and the latest validation status.

### Evidence

- PASS: `python .\\open-claw\\scripts\\sync_curated_employee_runtime.py`
- PASS: `python .\\open-claw\\scripts\\validate_openclaw_workflow.py`
- PASS: regenerated `current_employees.md` now records:
  - `accessibility-auditor` → `ACCESS_AUDITOR_ALLISON_BOT`
  - `backend-architect` → `BACKEND_BRUCE_BOT`
- PASS: runtime validation summary shows all structural checks green, including copied assigned skills and generated bot/runtime artifacts
- PASS: Context7 FFmpeg docs were consulted for copy-first recovery guidance (`ffprobe`/`ffmpeg`, remux, timestamp regeneration, stream copy, faststart)

### Verdict

READY FOR STRUCTURAL USE — the open--claw employee skill system is now structurally consistent again, Sparky has dedicated damaged-video recovery skills, and the curated runtime validation suite is green.

### Blockers

- Live end-to-end worker startup with real gateway credentials is still not proven for all workers.
- Sparky's actual damaged AxCrypt-decrypted video files still need a real recovery run and evidence log.
- `delivery-director`, `product-manager`, and `sparky-chief-product-quality-officer` still need direct secret mapping or stable env-backed runtime injection to be fully runtime-ready.

### Findings From Factory Assets

- The proactive-agent v3.1.0 pack is useful as doctrine and operating-pattern input, especially around WAL / working-buffer / compaction-recovery behavior.
- The Formula One AI Factory zip is richer as a development environment for employee-building doctrine, but it should remain an upstream build source, not a blind replacement for the curated OpenClaw packet standard.

### What's Next

- Run Sparky on the actual damaged video set using the new recovery workflow and capture evidence per attempt.
- Decide whether to import more factory-style live-state doctrine (`SESSION-STATE`, working-buffer, WAL discipline) into the curated employee standard in a controlled way instead of ad hoc packet drift.

---

## 2026-04-10 18:53 — Obsidian + Sparky Rule Hardening Implementation (Cross-Repo Pass)

### Goal

Align open--claw memory/rule systems to match the tri-workspace Obsidian/OpenMemory policy and strengthen Sparky rule indexing at repo level.

### Scope

- `open--claw\.cursor\rules\05-global-mcp-usage.md` — obsidian-vault policy aligned
- `open--claw\AGENTS.md` — sparky-mandatory-tool-usage.md indexed
- `open--claw\open-claw\AI_Employee_knowledgebase\AI_employees\sparky-chief-product-quality-officer\ACCESS.md` — role preamble added
- `open--claw\open-claw\AI_Employee_knowledgebase\AI_employees\sparky-chief-product-quality-officer\TOOLS.md` — role preamble added
- `open--claw\open-claw\AI_Employee_knowledgebase\AI_employees\sparky-chief-product-quality-officer\COMPLETE_TOOL_REFERENCE.md` — role preamble added
- `open--claw\docs\ai\STATE.md` — this entry

### Commands / Tool Calls

- StrReplace: 5 file updates in open--claw
- Grep: verified rule surfaces and cross-references

### Changes

**Obsidian/OpenMemory Policy Alignment:**
- Updated `05-global-mcp-usage.md` to align with AI-PM policy
- Both AI-PM and open--claw now state: OpenMemory = **primary durable structured memory backbone**; Obsidian = **fast-access scoped note memory sidecar**
- Explicit relationship and anti-patterns now documented consistently

**Sparky Access Docs Deduplication:**
- Added role preambles to all three Sparky access docs:
  - `ACCESS.md`: persistent access config + recovery
  - `TOOLS.md`: canonical exec routing + usage
  - `COMPLETE_TOOL_REFERENCE.md`: inventory/reference only (NOT enforcement)
- Cross-references added between files for clarity

**Sparky Rule Indexing:**
- Added `sparky-mandatory-tool-usage.md` to `AGENTS.md` Authoritative rules list
- Sparky enforcement rule now repo-level indexed alongside other mandatory rules

### Evidence

- PASS: open--claw `05-global-mcp-usage.md` aligned with AI-PM policy
- PASS: All three Sparky access docs have distinct role preambles
- PASS: `AGENTS.md` now indexes sparky-mandatory-tool-usage.md
- PASS: Cross-references between ACCESS.md, TOOLS.md, COMPLETE_TOOL_REFERENCE.md working
- PASS: Changes compact and focused per plan requirements

### Verdict

READY — open--claw memory/tool policy now matches tri-workspace standard. Sparky rule hierarchy clarified and indexed.

### Blockers

None.

### Fallbacks Used

None.

### Cross-Repo Impact

- AI-PM: MCP rule and tooling docs updated in parallel
- Both repos now have consistent Obsidian/OpenMemory relationship
- Sparky rule hierarchy documented uniformly

### Decisions Captured

Same as AI-PM entry — OpenMemory = primary backbone, Obsidian = fast-access sidecar, Sparky rule hierarchy clarified.

### Pending Actions

None - all planned changes completed.

### What Remains Unverified

- Live Sparky session using updated rule surfaces
- Whether ACCESS/TOOLS/COMPLETE_TOOL_REFERENCE role separation improves operational clarity

### What's Next

Plan complete. System ready with clarified memory/tool hierarchy.
