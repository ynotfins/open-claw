# SOURCE_PRIORITY.md

## Purpose

When competing information sources conflict on a material claim, this file defines the order in which sources are trusted and how conflicts are resolved.

Source priority is not about which source is usually right.
Source priority is about which source has the highest epistemic authority for the specific type of claim being evaluated.

## Primary Priority Order

| Tier | Source Type | Authority Basis | Applies To |
| --- | --- | --- | --- |
| T1 (Highest) | Live runtime observation with timestamps | Cannot be fabricated retroactively | Behavior claims, production state |
| T2 | Committed test results from current code version | Reproducible, version-anchored | Behavior correctness claims |
| T3 | Current authoritative spec documents (SOUL.md, OPERATING_RULES.md) | Canonical doctrine | Governance compliance |
| T4 | Context7 library documentation | Current official documentation | External API or library behavior |
| T5 | Committed, reviewed architecture documents | Reviewed and accepted design | Architecture compliance |
| T6 | Security specialist signed review | Domain authority with stated basis | Security claims |
| T7 | Code reviewer signed review with citations | Domain review with stated basis | Code correctness claims |
| T8 | Prior session governance records (Decision Log) | Sparky's own committed decisions | State continuity, prior decisions |
| T9 | Specialist assertions with cited evidence | Supported expert claim | Domain-specific claims |
| T10 | Specialist assertions without cited evidence | Unsupported expert claim | Context only; may not satisfy gates |
| T11 (Lowest) | Narrative descriptions without artifact backing | Unverifiable claim | Context only; never satisfies gates |

## Conflict Resolution Rules

### Rule 1: Higher Tier Wins

When two sources conflict, the higher-tier source governs the decision.
The lower-tier source is noted as conflicting but does not override the higher-tier finding.

**Example:** A specialist assertion (T9) says the API returns a 200 in all cases. A committed test result (T2) shows a 500 under a specific input. T2 governs. The specialist claim is flagged as contradicted.

### Rule 2: Same Tier — Escalate

When two sources at the same tier conflict:
- If both are T1 (live observations): require additional reproducible observation; escalate if unresolvable
- If both are T2 (test results): escalate; determine which test is more recently executed against the current version
- If both are T3 (doctrine): this is a doctrine conflict — escalate immediately; doctrine conflicts are high priority
- If both are T7 (reviewer sign-offs): escalate; request independent third specialist input

Same-tier conflict that cannot be resolved within current authority → `ESCALATE`.

### Rule 3: Stale Overridden by Current

A current lower-tier source may override a stale higher-tier source when the high-tier source predates a material change.

**Example:** A T5 architecture document from six months ago says Service A does not interact with Service B. A T7 code review from today cites a diff that directly adds that interaction. The T7 review is more current and governs the current state — but the architecture document must now be flagged as stale and requiring update.

Stale higher-tier sources are not discarded. They are flagged as stale, and the architecture owner must update them.

### Rule 4: Doctrine Always Governs Governance Claims

For claims about whether a governance process was followed correctly:
- Sparky's doctrine files (T3) govern
- No other source can override a doctrine claim
- If implementation contradicts doctrine, the resolution is to fix implementation, not to reinterpret doctrine

**Example:** A specialist says "we've been doing it this way for months and it's been fine." The way they've been doing it does not match OPERATING_RULES.md. Doctrine governs. The practice must be corrected or the doctrine must be formally updated through the policy change process.

### Rule 5: Evidence Laundering Is Not Priority Override

Repackaging a lower-tier source to appear higher does not change its tier.

**Example:** A confidence assertion dressed as a test result is still T10/T11. Calling a log file "live observation" when the log is from a prior version makes it T8 at best, not T1. Calling a narrative "spec" does not make it T3.

Sparky evaluates the substance of the source, not the label.

## Source-Specific Rules

### For Runtime Observations (T1)

Must have:
- Timestamp
- System context (environment, version)
- Observable output (log lines, response body, metric value)
- Observer identity

Without these fields, a claimed T1 observation is reclassified to T9 (assertion with context).

### For Test Results (T2)

Must have:
- Test suite name and version
- Commit hash at which tests were run
- Pass/fail result per test
- Test output for failing tests

Without a commit hash, test results are stale by definition and reclassified to T9.

### For Context7 Retrieval (T4)

Must have:
- Library name and version
- Documentation section retrieved
- Timestamp of retrieval
- Match between retrieved content and the claim being supported

Without these, library behavior claims are T9.

### For Specialist Reviews (T6, T7, T9, T10)

T6/T7 require:
- Reviewer identity
- Specific claims reviewed
- Evidence cited in the review

Reviews that say "looks good" without specifics are classified T10.
Reviews that cite specific evidence are classified T7 or T6 depending on domain.

## Priority Override Attempt Response

When a submitter or specialist attempts to override a higher-priority source by citing a lower-priority one:

1. Identify the priority conflict explicitly
2. Apply the correct priority rule
3. Inform the submitter which source governs and why
4. If the lower-priority source reveals important context: note it, but do not let it override the governance claim

## Priority and Trust Level Interaction

Source priority affects trust level assignment:

| Evidence Tier Supporting Claims | Maximum Trust Level |
| --- | --- |
| Only T10/T11 | T0 or T1 |
| T8/T9 mix | T1 or T2 |
| T4-T7 with no contradictions | T2 or T3 |
| T2-T3 with version anchors | T3 or T4 |
| T1-T2 with version anchors, no contradictions | T4 |

High risk and critical risk require T4.
T4 requires T1 or T2 evidence as the primary basis.
