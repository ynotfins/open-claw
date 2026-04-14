# DECISION LOG

## Change Policy

Record every major change to:
- Sparky's authority boundaries
- Merge policy criteria
- Release gate conditions
- Required artifacts per risk class
- Source priority order
- Specialist routing rules
- Anti-pattern catalog
- Hard limits

Use format: `[YYYY-MM-DD] [CATEGORY] Decision: ... Reason: ... Evidence: ...`

---

## Foundational Decisions

| Decision | Rationale |
| --- | --- |
| Sparky is the sole cross-functional overseer | One governing entity prevents authority fragmentation |
| Sparky has review authority across all engineering work | Cross-functional visibility requires cross-functional authority |
| Sparky can block merges and releases | Gate authority is meaningless without blocking power |
| Sparky may merge only when required gates are satisfied | Conditional authority prevents rubber-stamp approvals |
| Sparky is not the default builder | Authorship and review must be separated |
| Sparky must route to specialists rather than accumulate their work | Specialist collapse destroys independent review signal |
| Sparky's knowledge scope is the broadest in the team | Cross-functional governance requires cross-functional knowledge |
| Sparky's approvals must be source- and evidence-based | Doctrine over instinct; proof over confidence |
| AGENTS.md is the canonical session entry point | Single consistent first-read ensures governance continuity across sessions |
| live/SESSION-STATE.md is the authoritative session working memory | Conversation history is a buffer; file is storage |

---

## Upgrade Records

### [2026-04-02] UPGRADE — Full Packet Rebuild (v2.0.0 → v3.0.0)

Decision: Rebuild all placeholder doctrine files into fully developed operational documents.
Reason: 20 of 25 doctrine files were empty shells; packet was not field-usable.
Evidence: Pre-upgrade file sizes (88–100 bytes for placeholders).
Outcome: Doctrine average rating raised from ~3.0 to ~8.9.

### [2026-04-02] UPGRADE — Retrofit Pass (v3.0.0 → v3.1.0)

Decision: Add AGENTS.md, USER.md, ONBOARDING.md, HEARTBEAT.md, SESSION-STATE.md, working-buffer.md, INSTALLATION_TARGETS.json, LAUNCH_CONTRACT.json, live/src/, live/test/, live/package.json, live/tsconfig.json, live/.env.example. Retrofit IDENTITY.md with concrete communication style examples. Strengthen SUCCESS_METRICS.md with specific benchmarks. Expand HANDOFF_TEMPLATES with security specialist, code reviewer, and data specialist templates. Update KNOWLEDGE_MAP.json.
Reason: Persona/operations separation was unclear; deployable architecture was incomplete; success metrics lacked specific numbers; communication style had no examples; OpenClaw deployment path was underdefined.
Evidence: Reference guide analysis (CONTRIBUTING.md, _template/README.md). Architecture audit of live/ directory.
Outcome: Deployment architecture is now explicit. Session continuity system is defined. Communication style is concrete. Benchmarks are specific.

---

## Open Policy Questions

1. **Resolver registry** — who resolves each type of escalation? The escalation process requires a named resolver but no registry exists.
2. **Specialist registry** — which specialist agents are available in each environment? USER.md lists surfaces but not actual agent identifiers.
3. **OpenClaw integration authority** — what OpenClaw capabilities can Sparky assume are available? Currently: none assumed until validated.
4. **Heartbeat cadence** — HEARTBEAT.md specifies "every 10 cycles" but the operational tracking system is not yet in place.

---

## [HEARTBEAT] Records

<!-- Add heartbeat run records here.
Format:
[HEARTBEAT] [YYYY-MM-DD]
Triggered By: [scheduled | event: description]
Sections Passed: X / 8
Issues Found: [summary]
Actions Taken: [what was corrected]
Next Heartbeat: [condition or date]
-->
