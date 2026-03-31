# Employee Readiness Audit

## Curated Standard Verdict
- `AI_Employee_knowledgebase/AI_employees/` now contains 15 curated employee packets with identity, rules, tools, skills, workflows, memory, provenance, and portable zip bundles.
- Each curated employee now also has an `AUDIT.md` that explains what it can do now and what is still missing before live-runtime readiness.
- Each curated employee packet now includes generated runtime files plus copied assigned skills, and the generated 15-worker runtime lives in `open-claw/employees/deployed-curated/`.
- Verdict: the curated roster is now runtime-synced and structurally validated, and 13 curated workers now have a defined Telegram bot assignment plan. It is not yet live-proven because only 10 of those assigned workers currently have direct Bitwarden secret IDs wired in repo, 3 assigned workers still need env vars or recorded secret IDs, 2 curated workers still need brand-new Telegram bots, and no generated worker has completed a recorded live smoke test yet.

## Legacy Packet Findings
- Named purchased packets detected: 10
- Generic downloaded packets detected: 5
- Shared bundle present: yes
- Reference library present: yes
- The five generic downloads are template workers, not five distinct specialists.
- Several named purchased packets still look like thin role wrappers rather than deeply specialized autonomous employees.
- Duplicate normalized content group: `api-integration-specialist.zip`, `financial-analyst.zip`, `frontend-developer.zip`, `overnight-coder.zip`, `personal-crm.zip`, `script-builder.zip`, `seo-specialist.zip`, `ux-designer.zip`
- Duplicate normalized content group: `crewclaw-agent-deploy (12).zip`, `crewclaw-agent-deploy (13).zip`, `crewclaw-agent-deploy (14).zip`, `crewclaw-agent-deploy (15).zip`, `crewclaw-agent-deploy (16).zip`

## Recommended Website Clone Squad
- `sparky-chief-product-quality-officer`
- `delivery-director`
- `product-manager`
- `software-architect`
- `frontend-developer`
- `ux-architect`
- `ui-designer`
- `code-reviewer`
- `qa-evidence-collector`
- `reality-checker`
- `devops-automator`
- `seo-ai-discovery-strategist`

## Legacy Name Overlap
- Exact name overlap with the older purchased runtime: `code-reviewer`, `frontend-developer`
- New standardized curated names: `sparky-chief-product-quality-officer`, `delivery-director`, `product-manager`, `software-architect`, `backend-architect`, `ux-architect`, `ui-designer`, `qa-evidence-collector`, `reality-checker`, `devops-automator`, `accessibility-auditor`, `seo-ai-discovery-strategist`, `mcp-integration-engineer`

## Current Telegram Reassignment Plan
- `mcp-integration-engineer` -> `API_ANDY_BOT`
- `code-reviewer` -> `CODE_CARL_BOT`
- `reality-checker` -> `FINANCE_FRANKY_BOT`
- `frontend-developer` -> `FRONTEND_FELIX_BOT`
- `qa-evidence-collector` -> `OVERNIGHT_OLIVER_BOT`
- `ui-designer` -> `PERSONAL_PAMELA_BOT`
- `devops-automator` -> `SCRIPT_SARAH_BOT`
- `seo-ai-discovery-strategist` -> `SEO_SAMANTHA_BOT`
- `software-architect` -> `ENGINEER_ENRIQUE_BOT`
- `ux-architect` -> `UX_URSULA_BOT`
- `sparky-chief-product-quality-officer` -> `SPARKY_CEO_BOT`
- `delivery-director` -> `DELIVERY_DIRECTOR_DAN_BOT`
- `product-manager` -> `PRODUCT_MANAGER_PETE_BOT`
- Still waiting on new Telegram bots: `accessibility-auditor`, `backend-architect`

## What Still Needs To Happen
1. Add direct Bitwarden secret IDs or explicit env vars for the three already-assigned workers that are still env-only in repo: `delivery-director`, `product-manager`, `sparky-chief-product-quality-officer`.
2. Start `open-claw/employees/deployed-curated/start-employees.ps1`, then approve first-run device pairing requests on the real gateway.
3. Create the two remaining Telegram bots for `accessibility-auditor` and `backend-architect`, then wire their tokens.
4. Prove real tool access and permissions for each live worker.
5. Run a first website clone-and-rebrand pilot and capture build, QA, accessibility, and release evidence.
6. Replace or retire thin generic legacy packets once the curated runtime replacements are proven.
