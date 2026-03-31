# OpenClaw Workflow Checklist

## Packet Standard
- [x] The curated library has 15 employees.
- [x] Every employee packet includes the required docs.
- [x] Every employee packet now includes the required runtime files.
- [x] Every employee packet includes copied assigned skills under `skills/`.
- [x] Every employee packet zip was regenerated after runtime sync.

## Runtime Shape
- [x] A generated runtime exists at `open-claw/employees/deployed-curated/`.
- [x] The generated runtime includes a 15-service `docker-compose.yml`.
- [x] The generated runtime includes `start-employees.ps1` with env-first plus Bitwarden fallback secret resolution.
- [x] Each worker uses the proven remote-gateway shell pattern: Node 22 + pinned `openclaw@2026.3.13` + entrypoint-generated config.

## Skill Activation
- [x] Assigned skills are present in every employee packet.
- [x] Assigned skills are copied into each packet's runtime payload.
- [x] Employee packets reference only real tracked skill slugs.

## Validation
- [x] Structural validation script available.
- Existing Telegram bot assignments are defined for **13** curated workers.
- Direct Bitwarden worker token IDs are wired for **10** curated workers.
- Assigned workers still needing explicit `*_TOKEN` env vars or Bitwarden secret IDs recorded: `delivery-director`, `product-manager`, `sparky-chief-product-quality-officer`.
- Curated workers still waiting on brand-new Telegram bots: `accessibility-auditor`, `backend-architect`.
- First-run device pairing still must be approved against the real gateway.
- End-to-end live message tests still depend on gateway reachability and real bot credentials.

## Employee Coverage
- [x] `accessibility-auditor` packet generated and runtime-synced
- [x] `backend-architect` packet generated and runtime-synced
- [x] `code-reviewer` packet generated and runtime-synced
- [x] `delivery-director` packet generated and runtime-synced
- [x] `devops-automator` packet generated and runtime-synced
- [x] `frontend-developer` packet generated and runtime-synced
- [x] `mcp-integration-engineer` packet generated and runtime-synced
- [x] `product-manager` packet generated and runtime-synced
- [x] `qa-evidence-collector` packet generated and runtime-synced
- [x] `reality-checker` packet generated and runtime-synced
- [x] `seo-ai-discovery-strategist` packet generated and runtime-synced
- [x] `software-architect` packet generated and runtime-synced
- [x] `sparky-chief-product-quality-officer` packet generated and runtime-synced
- [x] `ui-designer` packet generated and runtime-synced
- [x] `ux-architect` packet generated and runtime-synced
