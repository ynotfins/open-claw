# KNOWLEDGE_SOURCES.md

## Purpose

This file catalogs the authoritative sources that Sparky uses to inform governance decisions.
Each source has an assigned trust tier that determines how it interacts with the source priority system in `SOURCE_PRIORITY.md`.

Sources not in this registry are treated as unverified.
Unverified sources may provide context but may not satisfy gate conditions.

## Source Registry

### Internal Doctrine Sources (Trust Tier T3 — Canonical Governance)

| Source | Location | Authority Scope | Update Trigger |
| --- | --- | --- | --- |
| SOUL.md | `employees/Sparky/SOUL.md` | Governing philosophy, first principles, prohibitions | Philosophy or values change |
| OPERATING_RULES.md | `employees/Sparky/OPERATING_RULES.md` | Control loop, decision engine, state machine, protocols | Operational rule change |
| WORKFLOWS.md | `employees/Sparky/WORKFLOWS.md` | Named workflows, scenario procedures | New workflow or scenario update |
| MERGE_POLICY.md | `employees/Sparky/MERGE_POLICY.md` | Merge criteria by risk class | Policy change |
| APPROVAL_GATES.md | `employees/Sparky/APPROVAL_GATES.md` | Gate definitions for each stage | Gate criteria change |
| PR_RULES.md | `employees/Sparky/PR_RULES.md` | PR evaluation sequence, blocking conditions | PR policy change |
| ESCALATION_RULES.md | `employees/Sparky/ESCALATION_RULES.md` | Escalation triggers and process | Escalation process change |
| SECURITY.md | `employees/Sparky/SECURITY.md` | Security handling, secret management | Security posture change |
| LIMITS.md | `employees/Sparky/LIMITS.md` | Hard operational limits | Limit definition change |
| ANTI_PATTERNS.md | `employees/Sparky/ANTI_PATTERNS.md` | Anti-pattern catalog and enforcement | New pattern discovery |
| SOURCE_PRIORITY.md | `employees/Sparky/SOURCE_PRIORITY.md` | Source conflict resolution order | Priority rule change |
| SKILLS.md | `employees/Sparky/SKILLS.md` | Skill capability inventory | Skill update |
| IDENTITY.md | `employees/Sparky/IDENTITY.md` | Role boundaries and communication standards | Identity definition change |
| MISSION.md | `employees/Sparky/MISSION.md` | Mission scope and success conditions | Mission update |

### Runtime State Sources (Trust Tier T8 — Committed Governance Records)

| Source | Location | Authority Scope | Update Trigger |
| --- | --- | --- | --- |
| DECISION_LOG.md | `employees/Sparky/DECISION_LOG.md` | Prior governance decisions and policy changes | Every completed governance cycle |
| live/SESSION_STATE.md | `employees/Sparky/live/SESSION_STATE.md` | Active session governance state | Every governance action |
| live/working-buffer.md | `employees/Sparky/live/working-buffer.md` | In-flight uncommitted governance state | During sessions before commit |

### External Documentation Sources (Trust Tier T4 — Context7 Retrieved)

| Source | Authority Scope | Retrieval Method |
| --- | --- | --- |
| Context7 library documentation | External library and API behavior for any library under evaluation | Context7 MCP tool |
| GitHub API documentation | GitHub PR state, check status, review decisions | Context7 MCP or GitHub MCP tool |
| OpenClaw documentation | OpenClaw delivery environment capabilities and contracts | Context7 MCP when available |
| TypeScript documentation | TypeScript language behavior and type system | Context7 MCP |
| Firebase/Firestore documentation | Firestore behavior for relevant integrations | Context7 MCP |

Context7 sources are retrieved fresh at evaluation time.
Do not rely on cached or session-memory versions of Context7 content for gate decisions.
If Context7 is unavailable, note the unavailability and downgrade evidence quality for library-specific claims.

### Specialist Review Sources (Trust Tier T6/T7 — Signed with Evidence)

| Source Type | Authority Scope | Quality Requirement for T6/T7 |
| --- | --- | --- |
| Security specialist review | Security surface correctness | Cites specific controls verified |
| Architecture specialist review | Structural integrity and interface contracts | Cites specific design constraints evaluated |
| DevOps specialist review | Infrastructure and deployment readiness | Cites specific deployment and rollback assessment |
| Code reviewer sign-off | Code correctness, test coverage, pattern compliance | Cites specific code paths and tests reviewed |
| Data specialist review | Data model integrity and migration safety | Cites specific schema and migration risks assessed |

Specialist reviews without cited evidence are classified T10, not T6/T7.

### Live Runtime Sources (Trust Tier T1 — Highest Authority for Behavior Claims)

| Source Type | Authority Scope | Version Anchor Requirement |
| --- | --- | --- |
| CI/CD system test run results | Behavior correctness for current commit | Commit hash + run timestamp |
| Application logs from current version | Runtime behavior observation | Version identifier + timestamp |
| Performance monitoring results | Performance characteristics | Version identifier + timestamp |
| Error tracking system | Error patterns in production | Version identifier + timestamp |

T1 sources must carry a version anchor to be classified T1.
Without a version anchor, runtime observations are reclassified to T9 (assertion with context).

### Architecture and Design Sources (Trust Tier T5 — Reviewed Design Documents)

| Source | Authority Scope | Staleness Check |
| --- | --- | --- |
| System architecture documents | Component boundaries, interface contracts | Verify against current implementation |
| API specification documents | API contracts for affected endpoints | Verify against current deployed version |
| Database schema documentation | Schema structure and migration history | Verify against current schema |
| Deployment architecture documents | Infrastructure topology and dependency map | Verify against current infrastructure |

T5 sources are only T5 when they match current implementation.
If a T5 source predates a known implementation change, it is stale and reclassified accordingly.

## Source Reliability Notes

### Context7 Availability

Context7 connector validation instability has been observed in prior sessions.
When Context7 is unavailable:
- State the unavailability explicitly
- Do not substitute assumed library behavior
- Issue `REQUIRE_MORE_EVIDENCE` for claims that specifically depend on library documentation
- Continue governance on non-library-specific claims at reduced confidence

### GitHub Tool Reliability

The GitHub MCP tool provides live PR state.
If the tool returns an error or unexpected state:
- Do not assume the PR state
- Fall back to last known state from Session State
- Flag the data gap in the governance trace
- Do not issue `ALLOW` based on assumed PR state

### OpenClaw Integration Status

OpenClaw integration is partially validated.
For OpenClaw-dependent governance decisions:
- Confirm the specific OpenClaw capability being relied upon is in the verified integration list
- Do not assume OpenClaw capabilities that have not been integration-tested
- If an OpenClaw path is unverified: flag it and route to the OpenClaw integration specialist for confirmation

## Source Update Process

When a new authoritative source is identified:
1. Evaluate its trust tier against the tier definitions in `SOURCE_PRIORITY.md`
2. Add it to this registry with: name, location, authority scope, update trigger
3. Update `KNOWLEDGE_MAP.json` with the new source entry
4. Record the addition in `DECISION_LOG.md`
5. Do not rely on the source for gate decisions until it is registered here

When an existing source is deprecated:
1. Mark it as deprecated in this registry with a deprecation date
2. Identify the replacement source
3. Update all governance records that cite the deprecated source
4. Record in `DECISION_LOG.md`
