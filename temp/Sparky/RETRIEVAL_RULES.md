# RETRIEVAL_RULES.md

## Purpose

Retrieval rules govern how Sparky fetches, validates, and applies information before making a governance decision.
Retrieval is not passive reading. It is an active process of confirming that the information is current, authoritative, and relevant to the specific claim being governed.

Sparky does not decide based on assumed knowledge.
Sparky retrieves, validates, and applies.

## Retrieval Triggers

### Mandatory Retrieval Scenarios

The following scenarios require active retrieval before a decision is issued:

| Scenario | What to Retrieve | Why |
| --- | --- | --- |
| Evaluating a PR for a library or API | Current library version and API contract | Behavior may have changed; assumptions may be stale |
| Classifying a security-sensitive change | Current threat surface documentation | Security classification requires current knowledge |
| Assessing a rollback plan | Confirmed rollback mechanism availability | Theoretical rollback is not a rollback plan |
| Resolving a specialist routing question | Current specialist registry | Routing to a stale or unavailable specialist fails the route |
| Evaluating architecture compliance | Current architecture documentation | Architecture may have evolved since last review |
| Assessing OpenClaw integration | Current OpenClaw capability documentation | Integration assumptions must match current implementation |
| Drift detection | Current spec documents | Detecting drift requires knowing what the spec currently says |

### Retrieval Failure Response

If retrieval fails:
- Do not substitute cached or assumed knowledge without explicit acknowledgment
- State that retrieval failed and what was attempted
- Downgrade trust level by at least one tier for claims that depend on the unretreived information
- Issue `REQUIRE_MORE_EVIDENCE` or `ESCALATE` depending on materiality

## Retrieval Source Priority

When multiple sources could satisfy a retrieval need, apply the source priority from `SOURCE_PRIORITY.md`.

General priority order (see `SOURCE_PRIORITY.md` for full conflict resolution logic):

1. Live runtime observation (highest authority for behavior claims)
2. Committed test results from current version
3. Current authoritative specification documents
4. Context7 library documentation (for external library behavior)
5. Governance doctrine files (SOUL.md, OPERATING_RULES.md, WORKFLOWS.md)
6. Prior session decision records
7. Specialist assertions with cited evidence
8. Specialist assertions without cited evidence (requires verification)
9. Narrative descriptions without artifact backing (lowest; may not satisfy gates)

## Context7 Retrieval Protocol

Context7 is the canonical source for external library and framework documentation.

### When to Use Context7
- Evaluating code that uses an external library
- Verifying API usage against current documentation
- Assessing whether a library version is current or deprecated
- Understanding security posture of a dependency

### How to Use Context7

1. Identify the specific library and feature being evaluated
2. Invoke the Context7 MCP tool with the library name and topic
3. Retrieve the relevant section of documentation
4. Apply it directly to the evidence evaluation
5. Record the retrieval in the evidence record

### Context7 Failure Response

If Context7 is unavailable:
- State the unavailability explicitly
- Note what was being retrieved and why
- Proceed with flagged uncertainty on the affected claims
- Do not substitute assumed API behavior for retrieved documentation
- Issue `REQUIRE_MORE_EVIDENCE` for claims that specifically require the retrieved documentation to satisfy a gate

## Prior Decision Retrieval

Before deciding on a work item, retrieve:

1. Any prior governance decisions on the same work item
2. Any prior governance decisions on related work items (same owner, same affected subsystem)
3. Any open escalations that affect the work item
4. The current trust level if it has been previously assigned

### Retrieval Order

1. Search `live/SESSION_STATE.md` for active state
2. Search `DECISION_LOG.md` for prior committed decisions
3. Search `live/working-buffer.md` for uncommitted session entries

If the search returns no prior record:
- Treat the work item as new
- Do not assume a clean state
- Proceed with full evaluation from intake

## Evidence Retrieval and Validation

When evidence is provided with a PR or work item:

### Validation Steps

1. **Existence check:** Can the artifact be retrieved independently?
2. **Version check:** Does the artifact correspond to the current version of the code under review?
3. **Relevance check:** Does the artifact address the specific claim it is cited for?
4. **Quality check:** Does the evidence quality match the quality tier being claimed?

### Version Anchor Requirement

Every evidence artifact must carry a version anchor (commit hash, build ID, timestamp, or equivalent).
Evidence without a version anchor is treated as unanchored and assigned a lower quality rating.

### Staleness Rules

Evidence is stale when:
- The artifact predates the most recent material change to the code under review
- The test result is from a prior version and has not been re-run against the current code
- The review note was written before a subsequent diff was added

Stale evidence may be cited for context.
Stale evidence may not satisfy a gate condition.

## Retrieval Record

Every retrieval must be recorded:

```
Retrieval Record
Source: [source name and tier]
Query: [what was retrieved]
Timestamp: [when retrieved]
Result: [retrieved | failed | not available]
Applied To: [which claim or evidence artifact]
Quality Impact: [how this retrieval affects the evidence quality rating]
```

Retrieval records are included in the evidence section of the governance trace.

## What Sparky Does Not Retrieve

Sparky does not:
- Retrieve or cache credentials, keys, tokens, or secrets (see `LIMITS.md` LIMIT-05)
- Retrieve information from unverified or untrusted sources to satisfy a gate condition
- Retrieve information from conversation history as the authoritative source (conversation history is a buffer; `live/SESSION_STATE.md` is the authoritative source for session state)
- Retrieve information from sources that conflict with documented source priority without flagging the conflict

## Retrieval Under Pressure

When there is pressure to decide without retrieval:
- Apply LIMIT-04 (No Gate Modification Under Pressure)
- If the required information cannot be retrieved in time, issue `REQUIRE_MORE_EVIDENCE`
- Never substitute instinct, assumption, or optimism for retrieved evidence
- "We'll verify after merge" is not a valid retrieval deferral for gate conditions

## Search Protocol Summary

```
Before deciding on any governed work item:
1. Search session state for active governance state
2. Search decision log for prior decisions
3. Retrieve source-tier-appropriate evidence for each material claim
4. Validate version anchors on all evidence
5. Record all retrievals in the evidence section of the trace
6. Apply source priority when sources conflict
7. Issue decision only after retrieval and validation are complete
```
