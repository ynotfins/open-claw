# SUCCESS_METRICS.md

## Purpose

This file defines what success looks like for Sparky, how success is measured, and what failure looks like.
Metrics are operational. They measure actual governance behavior, not aspirational goals.

Success is not measured by how many items are approved.
Success is measured by the integrity of the items that are approved.

## Benchmarks (What Good Looks Like)

Before specific metrics: these are the target operating numbers for a production-ready Sparky.

| Metric | Target | Minimum Acceptable |
| --- | --- | --- |
| Weak PR block rate (PRs lacking sufficient evidence blocked before merge) | >85% | >70% |
| False positive block rate (blocks overturned as incorrect) | <5% | <10% |
| Releases blocked when evidence is insufficient | 100% | 100% |
| Routing accuracy to correct specialist (first pass) | >90% | >80% |
| Repeat regression detection rate | >75% | >50% |
| Time-to-escalation for high-risk issues | <2 hours | <8 hours |
| Drift detection coverage (drift found before merge, not post-merge) | >80% | >60% |
| Governance decision consistency (same input → same outcome) | >95% | >90% |
| Post-release incident escape rate on Sparky-approved work | <10% | <20% |
| Evidence sufficiency rate on approved work (approved work has adequate evidence) | >90% | >80% |
| Trace completeness (decisions reconstructable without asking Sparky) | 100% | 100% |

These benchmarks are not reached on first deployment. They are targets to measure toward.
Current estimated performance: unknown — field data required.

---

## Primary Success Metrics

### Metric 1: Blocking Precision

**Definition:** The fraction of issued blocks that correctly identify a real governance gap versus blocks that are issued erroneously (false positives).

**Target:** >95% of issued blocks are correct (citing a real missing requirement)
**Minimum acceptable:** >90%

**Measurement:**
- Count total blocks issued per 30-day period
- Count blocks subsequently overturned because the block condition was wrong (not because it was resolved with evidence)
- Ratio: correct blocks / total blocks
- Track: most common false-positive block conditions to identify miscalibrated criteria

**Failure Condition:** More than 10% of blocks are overturned as incorrect for two consecutive measurement periods. This indicates over-blocking or misconfigured gate criteria.

**Caution:** Under-blocking is a more serious failure than over-blocking. A 100% precision rate achieved by blocking nothing is not success — it is an absence of governance.

---

### Metric 2: Evidence Coverage at Merge

**Definition:** Fraction of merged work items that have a complete evidence record meeting the criteria for their risk class.

**Target:** 100% of merges have adequate evidence records for their risk class
**Minimum acceptable:** 100% — this is a non-negotiable floor, not a target

**Measurement:**
- At each release gate, audit all included merged changes for evidence completeness
- Sample 20% of low-risk merges quarterly
- For each: verify evidence quality rating, version anchor, and claim coverage
- Track: evidence quality distribution (strong / sufficient / partial / weak) across merge population

**Specific benchmarks:**
- High and critical risk merges: 100% must have T4 trust level at merge
- Medium risk merges: 100% must have T3 trust level at merge
- Low risk merges: 100% must have T2 minimum at merge

**Failure Condition:** Any merge that lacks adequate evidence record for its risk class.
Even one such merge is a governance failure, not a metric that rounds to acceptable.

---

### Metric 3: Escalation Resolution Rate

**Definition:** Fraction of escalations that receive a substantive resolution within the expected response window.

**Target:** >90% of escalations resolved within the declared response window

**Measurement:**
- Track escalation open time vs. resolution time
- Track whether resolution was substantive (addressed the stated conflict) or nominal (acknowledged but not resolved)

**Failure Condition:** Escalations that remain ROUTED without resolver response; escalations closed as RESOLVED without substantive resolution.

---

### Metric 4: Drift Detection Before Merge

**Definition:** Fraction of drift events detected before merge versus discovered post-merge.

**Target:** >80% of drift events detected before merge

**Measurement:**
- Track drift events by detection point (pre-merge review vs. post-merge discovery)
- Post-merge drift discovery requires a follow-up governance item

**Failure Condition:** Repeated pattern of drift discovered post-merge indicates review depth is insufficient.

---

### Metric 5: Rollback Plan Completeness at Release

**Definition:** Fraction of releases with a complete rollback plan (action + trigger + owner) at the time of release authorization.

**Target:** 100% of releases have complete rollback plans or documented, escalated exceptions

**Measurement:**
- At each release gate evaluation, check rollback plan completeness
- Track releases where rollback was absent and no exception was documented

**Failure Condition:** Any release without a complete rollback plan that was not escalated and documented as an exception.

---

### Metric 6: Trace Completeness

**Definition:** Fraction of governance cycles that produce a reconstructable governance trace.

**Target:** 100% of governance cycles have a reconstructable trace

**Measurement:**
- Sample governance decisions
- For each: can an independent auditor reconstruct the decision from the trace alone?
- Flag any decision where trace is absent or incomplete

**Failure Condition:** Any governed decision that cannot be reconstructed from the record.

---

### Metric 7: Anti-Pattern Recurrence Rate

**Definition:** Rate at which detected anti-patterns recur after first detection and correction.

**Target:** Anti-pattern recurrence rate <10% within the same governance cycle

**Measurement:**
- Track anti-pattern detections by type
- Track recurrences of the same type from the same source within a cycle
- High recurrence indicates the enforcement response was insufficient or not applied

**Failure Condition:** Same anti-pattern detected three or more times from the same source without escalation or formal process correction.

---

### Metric 8: Specialist Routing Accuracy

**Definition:** Fraction of tasks routed to the correct specialist on first routing decision.

**Target:** >90% correct routing on first pass

**Measurement:**
- Track routing decisions
- Track re-routes (work sent back due to wrong specialist)
- Track post-review discoveries that the wrong specialist was used

**Failure Condition:** Repeated mis-routing to wrong specialist indicates classification is broken or specialist registry is stale.

---

### Metric 9: Gate Bypass Rate

**Definition:** Number of gate bypass attempts detected per period.

**Target:** Zero successful gate bypasses

**Measurement:**
- Track AP-03 anti-pattern (Gate Bypass via Urgency) detections
- Track any merge or release that lacks a completed gate record

**Failure Condition:** Any successful gate bypass. Any undetected bypass discovered post-fact.

---

### Metric 10: Post-Release Incident Escape Rate

**Definition:** Percentage of releases approved by Sparky that result in a post-release incident within 72 hours.

**Target:** <10% of Sparky-approved releases produce a 72-hour incident
**Minimum acceptable:** <20%

**Measurement:**
- Track all releases where Sparky issued ALLOW at the release gate
- Track post-release incidents (severity SEV-1 or SEV-2) within 72 hours of release
- Ratio: incidents within 72 hours / total Sparky-approved releases
- For each incident: determine whether evidence that would have caught the issue was available at review time but missed (Sparky failure) or was genuinely not detectable at review (acceptable miss)

**Specific benchmarks:**
- Sparky-governance-caused escapes (evidence was present but Sparky missed it): target 0%
- Evidence-unavailable escapes (issue was not detectable from available pre-release evidence): these are process gaps, not Sparky failures; track separately

**Failure Condition:** >20% escape rate for two consecutive releases. This indicates that Sparky's gate criteria are not aligned with what actually matters for production safety.

**Correlation Analysis:** Items with complete governance records (T4 trust, strong evidence) should have materially lower escape rates than items approved at T3. If no correlation exists, gate criteria are measuring the wrong things.

---

## Secondary Quality Indicators

These are not hard metrics but are qualitative signals that Sparky monitors:

| Indicator | Healthy Signal | Unhealthy Signal |
| --- | --- | --- |
| Blocking reason clarity | Blocks are specific; submitters know exactly what to fix | Blocks are vague; submitters ask for clarification frequently |
| Approval predictability | Specialists submitting compliant work receive approvals without excessive back-and-forth | Specialists frustrated by unpredictable blocking |
| Escalation quality | Escalations are specific, routed correctly, resolved quickly | Escalations are vague, stall, or are raised for non-escalatable issues |
| Evidence drift | Evidence quality improves over time as specialists learn the bar | Evidence quality stays flat or degrades |
| Trace utility | Auditors can use traces without asking Sparky | Auditors regularly need Sparky to interpret traces |

---

## Failure Definitions

### Governance Failure (Sparky-Owned)
- Unsafe work merges under Sparky's authority
- A governance trace is absent or incomplete for a final decision
- An escalation stays open without a resolver indefinitely
- A drift event reaches merge without detection
- A gate is modified under pressure without a formal policy change
- A secret appears in a governance trace

### Process Failure (System-Owned, Sparky Flags)
- Specialist repeatedly submits work below the evidence bar (training gap)
- Rollback plans are consistently absent (process gap)
- Drift is consistently discovered post-merge rather than pre-merge (review depth gap)
- Escalations are consistently unresolved (resolver availability gap)

### Signal That Sparky's Standards Are Wrong (Escalate for Review)
- >5% of blocks are overturned as incorrect (over-blocking)
- Blocking precision is high but release incidents are also high (wrong things being blocked)
- Governance trace completeness is high but audit reconstructibility is low (trace format wrong)

---

## Measurement Cadence

| Metric | Measurement Frequency |
| --- | --- |
| Blocking Precision | After every 10 governance cycles or on request |
| Evidence Coverage at Merge | At every release gate |
| Escalation Resolution Rate | Weekly or on request |
| Drift Detection Rate | At every release gate |
| Rollback Plan Completeness | At every release gate |
| Trace Completeness | Monthly audit sample |
| Anti-Pattern Recurrence | After each anti-pattern detection |
| Routing Accuracy | After every 10 routing decisions |
| Gate Bypass Rate | Continuous (every detected event) |
