# EMPLOYEE PACKET STANDARD

This file defines the minimum acceptance standard for a complete OpenClaw employee packet.

## Acceptance Philosophy
Minimum line count is a floor, not proof of quality.
A file passes only when it satisfies:
- minimum depth
- required sections
- scenario coverage
- internal consistency
- operational usefulness
- honest file rating

## Required Quality Gates
Every employee packet must pass:
1. minimum line count
2. required sections per file
3. scenario coverage
4. file rating review
5. cross-file consistency review
6. packet-level acceptance review

## Minimum Line Count Guidance

### Core Identity
- README.md: 40+
- SOUL.md: 60+
- IDENTITY.md: 80+
- MISSION.md: 50+

### Doctrine
- OPERATING_RULES.md: 120+
- WORKFLOWS.md: 150+
- SKILLS.md: 120+
- TOOLS.md: 80+
- ESCALATION_RULES.md: 80+
- ANTI_PATTERNS.md: 80+
- LIMITS.md: 60+
- SECURITY.md: 80+

### Knowledge
- KNOWLEDGE_SOURCES.md: 100+
- RETRIEVAL_RULES.md: 120+
- SOURCE_PRIORITY.md: 60+
- MEMORY.md: 80+
- PROVENANCE.md: 50+

### Governance
- PR_RULES.md: 100+
- MERGE_POLICY.md: 80+
- APPROVAL_GATES.md: 100+
- SUCCESS_METRICS.md: 60+
- TEST_CASES.md: 120+

### Runtime
- schema.ts: 50+
- tools.ts: 40+
- agent.ts: 100+

### Support Artifacts
- each checklist: 25+
- each handoff template: 20+
- evals/README.md: 60+
- each eval case: 30+

## Required Scenario Coverage
Each employee must explicitly handle:
- happy path
- ambiguous request
- missing evidence
- conflicting specialist opinions
- unclear ownership
- urgent hotfix pressure
- risky release
- partial test coverage
- stale docs vs current code conflict
- framework/library uncertainty
- handoff failure
- repeated regression

## Required Sections by File

### README.md
- role overview
- authority
- non-goals
- packet contents
- usage conditions

### SOUL.md
- instincts
- values
- failure definition
- excellence definition

### IDENTITY.md
- title
- archetype
- mandate
- authority
- prohibitions

### OPERATING_RULES.md
- first principles
- decision rules
- communication rules
- evidence rules
- failure defaults

### WORKFLOWS.md
- minimum 5 workflows
- triggers
- required steps
- decision points
- escalation conditions

### RETRIEVAL_RULES.md
- retrieval order
- role-specific retrieval branches
- escalation retrieval
- external-doc usage rules

### PR_RULES.md
- review criteria
- severity model
- review output structure
- blocking conditions

### MERGE_POLICY.md
- merge permissions
- hard no-merge conditions
- evidence requirements

### APPROVAL_GATES.md
- standard gates
- UI gates
- data/infra gates
- release gates

## File Rating System
Each file must have:
- Build Rating (1-10)
- Field Rating (1-15 after real use)
- Confidence
- Status
- Impact Weight
- Notes

## Packet DoD
A packet is complete only when:
- no critical file is below Build Rating 7
- no critical file is structurally incomplete
- packet passes cross-file consistency review
- packet includes FILE_RATINGS_INDEX.md
- packet includes POST_RUN_NOTES.md
- packet is zip-ready
