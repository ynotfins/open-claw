# FILE_RATINGS_INDEX.md

## Rating System

| Dimension | Scale | Description |
| --- | --- | --- |
| Build Quality | 1–10 | How well-written, internally coherent, and complete the file is |
| Field Readiness | 1–10 | How useful the file is for actual operational use without additional work |
| Template Compliance | 1–10 | How well the file meets the requirements of the packet standard and templates |
| Reference Depth | 1–10 | How well the file references other files, standards, and authoritative sources |
| Cross-File Consistency | 1–10 | How well the file aligns with other files in the packet |
| Runtime Usefulness | 1–10 | How much the file contributes to runtime decision-making and governance quality |
| Drift Risk | Low / Medium / High | Risk that this file will drift out of alignment with actual behavior over time |
| Confidence | Low / Medium / High | Confidence in the current ratings given available information |

---

## Doctrine File Ratings

### SOUL.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 10 | Exceptional. Every section is substantive, precise, and non-redundant. |
| Field Readiness | 10 | Directly usable. Governs decisions, defines prohibitions, establishes the quality bar. |
| Template Compliance | 10 | Exceeds template requirements. Contains philosophy, scenarios, failure modes, enforcement logic. |
| Reference Depth | 9 | Strong internal references. Could add explicit cross-refs to OPERATING_RULES.md sections. |
| Cross-File Consistency | 10 | OPERATING_RULES.md, WORKFLOWS.md, and all other files built on this foundation. |
| Runtime Usefulness | 9 | Governs the decision-making standard. Not directly executable but foundational for all execution. |
| **Composite** | **9.7** | Benchmark file for the packet. |
| Drift Risk | Low | Philosophy files change rarely; high stability. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### OPERATING_RULES.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 10 | Full control loop, decision engine, trust system, state machine, protocol schemas. |
| Field Readiness | 10 | Directly executable. Contains schemas, state transitions, enforcement rules. |
| Template Compliance | 10 | Exceeds template. Includes input/output schemas, error handling, failure defaults. |
| Reference Depth | 9 | Good internal references. Could explicitly link to APPROVAL_GATES.md for gate details. |
| Cross-File Consistency | 10 | All runtime files (agent.ts, schema.ts) are derived from this. |
| Runtime Usefulness | 10 | The executable specification for agent.ts. |
| **Composite** | **9.8** | Strongest operational file in the packet. |
| Drift Risk | Medium | As operational rules evolve, must be kept in sync with agent.ts. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### WORKFLOWS.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Large, well-structured. Contains multiple complete workflows. |
| Field Readiness | 9 | Directly usable for scenario-driven governance. |
| Template Compliance | 9 | Meets template requirements. Workflows include triggers, evaluation, enforcement. |
| Reference Depth | 8 | References other files but could be more explicit about gate criteria references. |
| Cross-File Consistency | 8 | Needs verification against upgraded doctrine files post-upgrade. |
| Runtime Usefulness | 9 | Critical for scenario-specific governance. |
| **Composite** | **8.7** | Strong. Needs cross-reference audit against new doctrine files. |
| Drift Risk | Medium | Workflows must align with updated gate criteria and escalation rules. |
| Confidence | Medium | Not re-read in detail post-upgrade; audit needed. |
| Last Reviewed | Prior to 2026-04-02 | Needs re-read against new doctrine. |
| Remediation | Audit against APPROVAL_GATES.md and ESCALATION_RULES.md for alignment. |

---

### TOOLS.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Large, detailed. Contains tool catalog with usage contracts. |
| Field Readiness | 8 | Usable. May have some entries that need verification against current tool availability. |
| Template Compliance | 8 | Meets template. Could add failure mode notes per tool. |
| Reference Depth | 7 | Could reference KNOWLEDGE_SOURCES.md for source integration notes. |
| Cross-File Consistency | 8 | Needs verification post-upgrade. |
| Runtime Usefulness | 9 | Directly used by agent.ts and tools.ts. |
| **Composite** | **8.2** | Strong. Spot-check tool entries against current availability. |
| Drift Risk | High | Tools change frequently; highest drift risk in doctrine files. |
| Confidence | Medium | Not re-read in detail post-upgrade. |
| Last Reviewed | Prior to 2026-04-02 | |
| Remediation | Spot-check tool availability. Add failure mode per tool. |

---

### IDENTITY.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Well-written. Defines boundaries, distinguishes Sparky from specialists, addresses pressure scenarios. |
| Field Readiness | 9 | Useful for calibrating Sparky's behavior and explaining its role. |
| Template Compliance | 9 | Contains scenarios, failure conditions, enforcement logic. |
| Reference Depth | 8 | References SOUL.md and specialist roles. Could reference LIMITS.md for limit scenarios. |
| Cross-File Consistency | 9 | Consistent with SOUL.md and MISSION.md. |
| Runtime Usefulness | 7 | Reference file; governs meta-behavior rather than specific decisions. |
| **Composite** | **8.5** | Newly written. Strong. |
| Drift Risk | Low | Identity definition changes rarely. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### MISSION.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Clear mission statement, in/out-of-scope table, success/failure conditions, constraints. |
| Field Readiness | 8 | Useful for evaluating whether an action is in scope. |
| Template Compliance | 9 | Well-structured with scenarios and failure definitions. |
| Reference Depth | 8 | References SOUL.md, OPERATING_RULES.md, and OpenClaw. |
| Cross-File Consistency | 9 | Consistent with SOUL.md and IDENTITY.md. |
| Runtime Usefulness | 7 | Reference file for scope disputes. |
| **Composite** | **8.3** | Newly written. Strong. |
| Drift Risk | Low | Mission changes rarely and requires formal process. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### SKILLS.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 10 skills cataloged with routing triggers, failure modes, enforcement responses. |
| Field Readiness | 8 | Directly applicable to routing and evaluation decisions. |
| Template Compliance | 9 | Exceeds template. Failure modes per skill, routing tables. |
| Reference Depth | 8 | References ANTI_PATTERNS.md and SOUL.md. Could reference APPROVAL_GATES.md. |
| Cross-File Consistency | 9 | Consistent with OPERATING_RULES.md control loop. |
| Runtime Usefulness | 9 | Directly governs how skills are applied in the control loop. |
| **Composite** | **8.7** | Newly written. Strong. |
| Drift Risk | Medium | Skills expand as new governance scenarios are encountered. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### ANTI_PATTERNS.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 12 anti-patterns with detection heuristics, failure consequences, enforcement responses, and Sparky self-checks. |
| Field Readiness | 9 | Directly applicable during review and evaluation. |
| Template Compliance | 10 | Scenarios, failure conditions, enforcement logic all present for each anti-pattern. |
| Reference Depth | 8 | References IDENTITY.md and SOUL.md. |
| Cross-File Consistency | 9 | Consistent with LIMITS.md and OPERATING_RULES.md. |
| Runtime Usefulness | 9 | Pattern detection is part of the EVALUATE step. |
| **Composite** | **9.0** | Newly written. Strong. |
| Drift Risk | Medium | New anti-patterns should be added as they are encountered in operation. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### APPROVAL_GATES.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 5 gates defined with per-stage requirements, failure scenarios, audit requirements. |
| Field Readiness | 9 | Gate criteria are specific enough to evaluate against. |
| Template Compliance | 9 | Strong. Per-gate failure scenarios and enforcement responses. |
| Reference Depth | 8 | References MERGE_POLICY.md and WORKFLOWS.md. |
| Cross-File Consistency | 9 | Consistent with MERGE_POLICY.md and OPERATING_RULES.md. |
| Runtime Usefulness | 10 | The most direct operational reference for gate evaluation. |
| **Composite** | **9.0** | Newly written. Strong. |
| Drift Risk | Medium | Gate criteria must stay in sync with actual risk standards. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### ESCALATION_RULES.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 7 triggers, full escalation process, state machine, failure modes. |
| Field Readiness | 8 | Good. Needs resolver registry to be fully operational (gap noted in POST_RUN_NOTES.md). |
| Template Compliance | 9 | Strong. Triggers, process, failure modes, scope limits. |
| Reference Depth | 7 | Could reference RUNBOOK.md RUN-05 for procedure. |
| Cross-File Consistency | 9 | Consistent with OPERATING_RULES.md ESCALATE decision. |
| Runtime Usefulness | 9 | Critical for handling ambiguous or conflicted decisions. |
| **Composite** | **8.5** | Newly written. Strong. Resolver registry is the main gap. |
| Drift Risk | Medium | Resolver identity may change; escalation process is stable. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |
| Remediation | Create resolver registry to define who resolves each escalation type. |

---

### LIMITS.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 8 hard limits with pressure scenario responses and extreme condition handling. |
| Field Readiness | 9 | Direct reference during any pressure scenario. |
| Template Compliance | 9 | Scenarios, failure conditions, enforcement per limit. |
| Reference Depth | 8 | References SOUL.md prohibitions. Could reference SECURITY.md for LIMIT-05. |
| Cross-File Consistency | 9 | Consistent with SOUL.md prohibitions and ANTI_PATTERNS.md. |
| Runtime Usefulness | 9 | Critical for maintaining governance integrity under pressure. |
| **Composite** | **8.8** | Newly written. Strong. |
| Drift Risk | Low | Hard limits should not change without formal policy review. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### MERGE_POLICY.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Risk-class-by-risk-class requirements, anti-patterns, state machine, audit requirements. |
| Field Readiness | 9 | Directly applicable to merge decisions. |
| Template Compliance | 9 | Strong. Risk tiers, scenarios, failure paths. |
| Reference Depth | 8 | References APPROVAL_GATES.md and MERGE_POLICY.md concepts. |
| Cross-File Consistency | 9 | Consistent with APPROVAL_GATES.md and OPERATING_RULES.md. |
| Runtime Usefulness | 10 | Primary reference for merge gate evaluation. |
| **Composite** | **9.0** | Newly written. Strong. |
| Drift Risk | Medium | Risk class criteria must stay calibrated to actual system risk. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### PR_RULES.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Evaluation sequence, blocking conditions, block/approval formats, prohibited patterns. |
| Field Readiness | 9 | Operational reference for every PR evaluation. |
| Template Compliance | 9 | Strong. Scenarios, failure modes, enforcement logic. |
| Reference Depth | 8 | References MERGE_POLICY.md and SKILLS.md. |
| Cross-File Consistency | 9 | Consistent with MERGE_POLICY.md and APPROVAL_GATES.md. |
| Runtime Usefulness | 10 | Direct operational reference. |
| **Composite** | **9.0** | Newly written. Strong. |
| Drift Risk | Medium | PR format rules evolve with tooling. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### SECURITY.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Covers Sparky's own security boundaries, classification table, review requirements, incident handling, tool security. |
| Field Readiness | 9 | Directly applicable to security-classified PRs. |
| Template Compliance | 9 | Scenarios, failure conditions, enforcement. |
| Reference Depth | 8 | References LIMITS.md and SKILLS.md. |
| Cross-File Consistency | 9 | Consistent with LIMITS.md LIMIT-05 and ANTI_PATTERNS.md. |
| Runtime Usefulness | 9 | Critical for any security-classified work. |
| **Composite** | **8.8** | Newly written. Strong. |
| Drift Risk | Medium-High | Threat surface and security patterns change with technology. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |
| Remediation | Needs external QA review for edge-case security coverage depth. |

---

### PROVENANCE.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Covers decision, evidence, source, and artifact provenance. Failure modes. Storage rules. |
| Field Readiness | 8 | Comprehensive. Full operational value depends on Session State being functional. |
| Template Compliance | 9 | Strong. Failure modes, chain examples, audit requirements. |
| Reference Depth | 8 | References DECISION_LOG.md, KNOWLEDGE_SOURCES.md. |
| Cross-File Consistency | 9 | Consistent with OPERATING_RULES.md RECORD step and MEMORY.md. |
| Runtime Usefulness | 8 | Governs what gets recorded and how. Critical for audit. |
| **Composite** | **8.5** | Newly written. Strong. |
| Drift Risk | Low | Provenance structure is stable. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### RETRIEVAL_RULES.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Retrieval triggers, source priority application, Context7 protocol, validation steps. |
| Field Readiness | 8 | Directly applicable but depends on Context7 availability. |
| Template Compliance | 9 | Strong. Protocol, failure responses, pressure handling. |
| Reference Depth | 8 | References SOURCE_PRIORITY.md and KNOWLEDGE_SOURCES.md. |
| Cross-File Consistency | 9 | Consistent with KNOWLEDGE_SOURCES.md and SOURCE_PRIORITY.md. |
| Runtime Usefulness | 8 | Governs the pre-decision retrieval behavior. |
| **Composite** | **8.5** | Newly written. Strong. |
| Drift Risk | Medium | Retrieval tools change; rules must track tool availability. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### RUNBOOK.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 7 runbooks covering standard PR, merge, release, incident, escalation, context reset, drift correction. |
| Field Readiness | 9 | Step-by-step procedures. Directly usable. |
| Template Compliance | 9 | Strong. Triggers, procedures, expected duration, failure paths. |
| Reference Depth | 8 | References WORKFLOWS.md and specific procedure steps. |
| Cross-File Consistency | 9 | Consistent with OPERATING_RULES.md and APPROVAL_GATES.md. |
| Runtime Usefulness | 10 | Highest runtime utility of any new file. |
| **Composite** | **9.0** | Newly written. Strong. |
| Drift Risk | Medium | Runbooks must evolve with gate criteria and tooling. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### MEMORY.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Three-tier memory, working buffer, recovery protocol, failure modes, search protocol. |
| Field Readiness | 8 | Functional but depends on live/ directory being operational. |
| Template Compliance | 9 | Strong. Failure modes, recovery steps, storage rules. |
| Reference Depth | 8 | References DECISION_LOG.md and SESSION_STATE.md. |
| Cross-File Consistency | 9 | Consistent with PROVENANCE.md and OPERATING_RULES.md RECORD step. |
| Runtime Usefulness | 8 | Critical for session continuity. |
| **Composite** | **8.5** | Newly written. Strong. |
| Drift Risk | Medium | Live layer validation pending (see POST_RUN_NOTES.md). |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### SUCCESS_METRICS.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 10 primary metrics with targets, measurement methods, failure conditions. |
| Field Readiness | 7 | Metrics are well-defined but cannot be measured without operational data. |
| Template Compliance | 9 | Strong. Measurement cadence, secondary indicators, failure definitions. |
| Reference Depth | 7 | Could reference specific decision log fields for measurement. |
| Cross-File Consistency | 9 | Consistent with SOUL.md, OPERATING_RULES.md, and ANTI_PATTERNS.md. |
| Runtime Usefulness | 7 | Reference for evaluating governance quality over time. |
| **Composite** | **8.0** | Newly written. Strong. Value increases with operational data. |
| Drift Risk | Low | Metrics are stable; targets may need calibration after field use. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### TEST_CASES.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 20 test cases with input, expected outcome, reasons, anti-pattern if wrong, pass criteria. |
| Field Readiness | 8 | Ready to execute but not yet run against agent.ts. |
| Template Compliance | 9 | Strong. Full test structure per case. |
| Reference Depth | 8 | References ANTI_PATTERNS.md and OPERATING_RULES.md for expected behaviors. |
| Cross-File Consistency | 9 | Test cases cover core decisions from OPERATING_RULES.md. |
| Runtime Usefulness | 8 | Becomes 10 once executed and results are tracked. |
| **Composite** | **8.5** | Newly written. Strong. Execution is the remaining gap. |
| Drift Risk | Medium | Tests must evolve with doctrine changes. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |
| Remediation | Execute against agent.ts. Document pass/fail. Fix failures. |

---

### KNOWLEDGE_SOURCES.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Full registry with trust tiers, authority scope, update triggers, reliability notes. |
| Field Readiness | 8 | Usable but some sources (OpenClaw integration) are flagged as unvalidated. |
| Template Compliance | 9 | Strong. Source types, tiers, update process, deprecation process. |
| Reference Depth | 9 | References SOURCE_PRIORITY.md, KNOWLEDGE_MAP.json. |
| Cross-File Consistency | 9 | Consistent with SOURCE_PRIORITY.md and RETRIEVAL_RULES.md. |
| Runtime Usefulness | 8 | Required before retrieval decisions. |
| **Composite** | **8.7** | Newly written. Strong. |
| Drift Risk | High | Source registry must be kept current as tools and integrations change. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

### SOURCE_PRIORITY.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Priority tier table, conflict resolution rules, source-specific rules, trust level interaction. |
| Field Readiness | 9 | Directly applicable to any source conflict. |
| Template Compliance | 9 | Strong. Rules, scenarios, enforcement. |
| Reference Depth | 8 | References KNOWLEDGE_SOURCES.md and OPERATING_RULES.md trust levels. |
| Cross-File Consistency | 9 | Consistent with KNOWLEDGE_SOURCES.md and RETRIEVAL_RULES.md. |
| Runtime Usefulness | 9 | Applied whenever sources conflict. |
| **Composite** | **8.8** | Newly written. Strong. |
| Drift Risk | Low | Priority order is structural; changes rarely. |
| Confidence | High | Written fresh 2026-04-02. |
| Last Reviewed | 2026-04-02 | |

---

## Runtime File Ratings

### agent.ts

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Modular, typed, implements full control loop, degraded mode handling. |
| Field Readiness | 7 | Functional but written against prior thin schema. Needs audit against expanded schema.ts. |
| Template Compliance | 8 | Implements the control loop from OPERATING_RULES.md. |
| Reference Depth | 8 | Imports from schema.ts and tools.ts correctly. |
| Cross-File Consistency | 7 | May not fully consume new schema.ts fields. Audit pending. |
| Runtime Usefulness | 10 | The executing decision engine. |
| **Composite** | **8.2** | Strong base. Needs schema alignment audit. |
| Drift Risk | High | Runtime code changes frequently; must track doctrine changes. |
| Confidence | Medium | agent.ts not re-read in full post schema expansion. |
| Last Reviewed | Pre-upgrade | |
| Remediation | Audit against expanded schema.ts. Verify new evidence and gate fields are consumed. |

---

### tools.ts

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Large, modular, real tool implementations with adapter interfaces. |
| Field Readiness | 7 | Functional but some integrations flagged as pre-deployment. |
| Template Compliance | 8 | Implements tool capability contracts. |
| Reference Depth | 7 | Tool implementations reference external APIs. |
| Cross-File Consistency | 8 | Consistent with TOOLS.md catalog. |
| Runtime Usefulness | 10 | The tool execution layer. |
| **Composite** | **8.2** | Strong. Integration validation pending. |
| Drift Risk | High | External API changes can break tool implementations. |
| Confidence | Medium | Not re-read in detail post-upgrade. |
| Last Reviewed | Pre-upgrade | |

---

### schema.ts

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 8 | Expanded significantly from 64 lines. Evidence objects, gate status, provenance, severity, confidence. |
| Field Readiness | 7 | Schema is richer but agent.ts may not yet consume all new fields. |
| Template Compliance | 8 | Implements structured types for all major governance concepts. |
| Reference Depth | 7 | Type definitions; cross-references are implicit through imports. |
| Cross-File Consistency | 8 | Consistent with OPERATING_RULES.md schemas. |
| Runtime Usefulness | 9 | Foundation for type safety in all runtime files. |
| **Composite** | **7.8** | Upgraded. Needs agent.ts alignment verification. |
| Drift Risk | Medium | Schema changes require synchronized updates to agent.ts and tools.ts. |
| Confidence | Medium | Expanded 2026-04-02; agent.ts alignment not yet verified. |
| Last Reviewed | 2026-04-02 | |
| Remediation | Audit agent.ts consumption of new evidence, gate, and provenance types. |

---

### manifest.json

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 8 | Updated to v3.1.0 with full file inventory, deployment blockers, scores. |
| Field Readiness | 8 | Machine-readable; reflects current packet state. |
| Template Compliance | 8 | Includes file categorization, notes, and deployment blockers. |
| Reference Depth | 7 | References doctrine and runtime files. |
| Cross-File Consistency | 8 | Version bumped to 3.1.0 to match retrofit pass. |
| Runtime Usefulness | 7 | Used for machine-readable packet identification and install targeting. |
| **Composite** | **7.7** | Improved in v3.1.0 retrofit. |
| Drift Risk | Medium | Version must be bumped with each significant change. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

## New Files Ratings (v3.1.0 Retrofit)

### AGENTS.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Master session entry point. Persona brief, operations map, file map, session startup protocol, critical rules, anti-drift watchlist, OpenClaw context. |
| Field Readiness | 10 | Designed to be read first every session. Directly operational. |
| Template Compliance | 9 | Exceeds template. Structured persona + operations layers explicitly. |
| Reference Depth | 9 | Comprehensive file map. References all major doctrine, governance, and runtime files. |
| Cross-File Consistency | 9 | Synthesizes information from SOUL.md, OPERATING_RULES.md, LIMITS.md, ANTI_PATTERNS.md. |
| Runtime Usefulness | 10 | The north star document for every session. |
| **Composite** | **9.3** | Strongest new file in the retrofit. |
| Drift Risk | Medium | Must be kept in sync as new files are added or doctrine changes. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### USER.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 8 | Factory context, principal registry, operating environment assumptions, operator expectations. |
| Field Readiness | 8 | Useful for establishing who Sparky serves and what the environment is. |
| Template Compliance | 8 | Covers identity context, environment assumptions, feedback loop. |
| Reference Depth | 7 | References INSTALLATION_TARGETS.json and HANDOFF_TEMPLATES. |
| Cross-File Consistency | 8 | Consistent with INSTALLATION_TARGETS.json and AGENTS.md. |
| Runtime Usefulness | 7 | Context file; does not drive specific decisions but informs routing. |
| **Composite** | **7.7** | Newly written. Strong. |
| Drift Risk | Medium | Specialist registry and OpenClaw status must be updated as the environment evolves. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### ONBOARDING.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 8 | First-run checklist, operator prompts, completion confirmation, re-onboarding triggers. |
| Field Readiness | 8 | Directly usable for first session or environment change. |
| Template Compliance | 8 | Complete setup tracking with specific checkable items. |
| Reference Depth | 7 | References SOUL.md, OPERATING_RULES.md, TOOLS.md, INSTALLATION_TARGETS.json. |
| Cross-File Consistency | 8 | Consistent with AGENTS.md session startup protocol. |
| Runtime Usefulness | 7 | One-time use per environment; becomes reference after first run. |
| **Composite** | **7.7** | Newly written. Solid. |
| Drift Risk | Low | Structure is stable; content updates only when environment changes. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### HEARTBEAT.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | 8 sections covering evidence quality, anti-patterns, routing, memory, drift, tools, gates, packet health. |
| Field Readiness | 8 | Runnable checklist. Useful for periodic calibration. |
| Template Compliance | 9 | Trigger conditions, per-section checks, completion record format, failure definition. |
| Reference Depth | 8 | References ANTI_PATTERNS.md, DECISION_LOG.md, MEMORY.md, POST_RUN_NOTES.md. |
| Cross-File Consistency | 9 | Consistent with MEMORY.md recovery protocol and DECISION_LOG.md format. |
| Runtime Usefulness | 8 | Periodic calibration tool; high value over time. |
| **Composite** | **8.5** | Newly written. Strong. |
| Drift Risk | Low | Structure is stable; new sections only when new governance areas emerge. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### live/SESSION-STATE.md

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 8 | Active work items, open escalations, tool availability, working buffer, promotion checklist. |
| Field Readiness | 8 | Usable as active memory file. Depends on discipline in writing to it. |
| Template Compliance | 8 | Structured with all required sections for session continuity. |
| Reference Depth | 7 | References DECISION_LOG.md and MEMORY.md. |
| Cross-File Consistency | 8 | Consistent with MEMORY.md tier 1 definition and AGENTS.md session startup. |
| Runtime Usefulness | 9 | Critical for session continuity. Value increases with each governance cycle. |
| **Composite** | **8.0** | Newly written. Solid. |
| Drift Risk | High | Must be written to after every governance action or it becomes stale. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### INSTALLATION_TARGETS.json

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Two targets defined (factory, openclaw) with portability model, validation status, deployment blockers. |
| Field Readiness | 8 | Machine-readable. Directly useful for deployment planning and validation tracking. |
| Template Compliance | 9 | Covers what transfers, what must be wired, what cannot be assumed per target. |
| Reference Depth | 8 | References LAUNCH_CONTRACT.json and .env.example. |
| Cross-File Consistency | 9 | Consistent with LAUNCH_CONTRACT.md and LAUNCH_CONTRACT.json. |
| Runtime Usefulness | 8 | Install targeting; high value during deployment. |
| **Composite** | **8.5** | Newly written. Strong. |
| Drift Risk | Medium | Must be updated when new environments are added or validation status changes. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### LAUNCH_CONTRACT.json

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 9 | Machine-readable launch contract with entrypoints, input/output schema, tool dependencies, failure handling, governance defaults. |
| Field Readiness | 8 | Directly parseable by deployment tools and OpenClaw. |
| Template Compliance | 9 | Covers invocation contract, environment requirements, validation contract. |
| Reference Depth | 8 | References schema.ts, LAUNCH_CONTRACT.md, INSTALLATION_TARGETS.json. |
| Cross-File Consistency | 9 | Consistent with LAUNCH_CONTRACT.md and schema.ts. |
| Runtime Usefulness | 9 | The machine-readable deployment contract. High value for OpenClaw integration. |
| **Composite** | **8.7** | Newly written. Strong. |
| Drift Risk | Medium | Must be updated when schema.ts or entrypoints change. |
| Confidence | High | |
| Last Reviewed | 2026-04-02 | |

---

### live/ Infrastructure (package.json, tsconfig.json, .env.example, src/index.ts, test/smoke.test.ts)

| Dimension | Rating | Notes |
| --- | --- | --- |
| Build Quality | 8 | Package.json, tsconfig, .env.example, typed src/index.ts entrypoint, smoke test suite. |
| Field Readiness | 6 | Structure is correct but not yet buildable/runnable (depends on agent.ts import resolution). |
| Template Compliance | 7 | Follows TypeScript project conventions. |
| Reference Depth | 7 | src/index.ts references agent.ts, tools.ts, schema.ts. |
| Cross-File Consistency | 7 | src/index.ts wraps agent.ts correctly; schema types are referenced. |
| Runtime Usefulness | 7 | Will be high when build is validated. |
| **Composite** | **7.0** | Newly written. Solid structure. Build validation is the remaining gap. |
| Drift Risk | High | Import paths and dependencies must be maintained as the runtime evolves. |
| Confidence | Medium | Structure is correct; runtime build not validated. |
| Last Reviewed | 2026-04-02 | |
| Remediation | Validate that `npm run build` succeeds. Run smoke.test.ts. Confirm import paths resolve. |

---

## Overall Packet Score (v3.1.0)

| Category | Score | Change from v3.0.0 |
| --- | --- | --- |
| Doctrine files (average, all doctrine + new files) | 8.9 | → 9.0 (AGENTS.md raises the average) |
| Runtime files (agent.ts, tools.ts, schema.ts, live/) | 7.8 | → 7.9 |
| New architecture files (AGENTS.md, USER.md, ONBOARDING.md, etc.) | — | 8.3 (new category) |
| **Overall packet** | **8.5** | **→ 8.7** |

**Previous estimate (v3.0.0):** 8.5
**Current estimate (v3.1.0):** 8.7
**Target for deployment:** 9.0+ overall with all blockers from POST_RUN_NOTES.md resolved
**Current readiness:** Development-ready. Not yet deployment-ready (same blockers, new gaps added from retrofit).

