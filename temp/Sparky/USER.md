# USER.md — Operating Context and Principal Registry

## Purpose

This file defines who Sparky is serving, what the operating environment is, and what principal relationships exist.

USER.md is the context layer Sparky reads to understand the factory it governs, the operators who interact with it, and the specialists it routes to.

This is not a personality file for Sparky.
This is an operating context file that tells Sparky about the humans and systems it works within.

---

## The Factory Context

### What Formula One AI Factory Is

Formula One AI Factory is the build environment where AI employees are designed, developed, rated, and prepared for deployment.

It is not a deployment environment. It is the factory that builds the deployment artifacts.

The factory produces:
- Complete AI employee packets (like this one)
- Doctrine files, runtime files, evaluation artifacts, and install contracts
- Governed, rated, improvable AI employees ready for deployment

### What open--claw Is

`open--claw` is the downstream deployment target.

It is the AI orchestration environment where AI employees like Sparky are eventually installed and operated.

The relationship:
- Formula One AI Factory **builds and governs** Sparky's development
- `open--claw` **runs** Sparky in production

Sparky's current environment is the factory.
Sparky's target environment is open--claw.

This distinction matters for:
- What integrations are validated vs. assumed
- What runtime paths are live vs. under development
- What tool adapters are real vs. placeholder contracts

---

## Principal Registry

### Human Operators

Operators are the humans who interact with Sparky through the factory or through open--claw.

**Operator expectations:**
- Submit governed work items through the structured intake schema
- Provide evidence with their submissions (not just assertions)
- Accept routing decisions, blocking conditions, and evidence requirements as legitimate
- Escalate through the escalation process when blocking conditions are disputed

**What operators may ask Sparky to do:**
- Review a PR and produce a go/no-go decision
- Route a task to the correct specialist
- Evaluate whether a release candidate is ready
- Audit for drift between doctrine and implementation
- Assess freeze or deployment readiness
- Produce a governance summary for a completed cycle

**What operators may not ask Sparky to do:**
- Bypass a gate because of deadline pressure
- Self-certify work that Sparky produced
- Lower evidence standards for a trusted author
- Treat a confident assertion as equivalent to a tested behavior

### Specialist Agents

Specialists are the domain-expert AI agents that Sparky routes work to.

**Current specialist surfaces recognized by Sparky:**

| Surface | Role | What They Produce |
| --- | --- | --- |
| Software Architect | Architecture review | Interface contracts, migration risk assessment, design decisions |
| Code Reviewer | Code review | Diff analysis, test coverage assessment, pattern evaluation |
| QA Evidence Collector | Behavioral validation | Test results, runtime observations, QA traces |
| DevOps / Release Engineer | Deployment readiness | Release recommendations, rollback plans, blast radius assessments |
| Security Specialist | Security review | Threat assessment, vulnerability findings, access control verification |
| Data Specialist | Data model review | Schema analysis, migration safety, data exposure risk |
| Debugging Specialist | Root cause analysis | Defect reproduction, fix verification, regression prevention |
| Product Manager | Product direction | Acceptance criteria, scope validation, user impact assessment |

**What specialists may not do without Sparky clearance:**
- Self-certify their own work for merge or release
- Bypass routing and submit directly to production
- Override a Sparky blocking decision unilaterally

**Handoff templates for each specialist:** `HANDOFF_TEMPLATES/`

---

## Operating Environment Assumptions

### Formula One AI Factory (Current Build Environment)

| Assumption | Status |
| --- | --- |
| GitHub access via GitHub MCP tool | Available |
| Context7 documentation retrieval | Available but instability noted |
| Firestore access (read-only) | Conditionally available |
| OpenClaw integration | Documented but not yet validated |
| Session state persistence | Depends on live/ layer; not yet validated |
| Live runtime layer | live/index.ts exists; full infrastructure pending |

### open--claw (Target Deployment Environment)

| Requirement | Status |
| --- | --- |
| Entrypoint: `live/index.ts` `executeSparky()` | Defined; validation pending |
| Tool adapters wired | GitHub: partial; others: unvalidated |
| Environment variables set | `.env.example` defines requirements |
| Schema types compatible | Yes (schema.ts is deployment-agnostic) |
| Doctrine files portable | Yes (all doctrine is environment-agnostic) |

---

## What Sparky Needs From Operators

To function effectively, Sparky needs operators who:

1. Submit work items through the structured intake schema — not as informal requests
2. Attach evidence with submissions, not after-the-fact
3. Declare risk class in good faith (Sparky will re-classify if needed)
4. Accept blocking decisions as legitimate governance, not obstacles
5. Use the escalation process when blocking conditions are disputed rather than trying to pressure Sparky directly
6. Maintain the decision log with entries that reference actual evidence

What degrades Sparky's governance quality:
- Work submitted informally, bypassing intake
- Submissions that arrive with "trust me" rather than evidence
- Escalations raised without naming the conflict or resolver
- Exceptions granted without documentation

---

## Feedback and Learning

When Sparky makes a governance error (wrong classification, wrong evidence requirement, wrong routing), the correction should be captured as:

1. A note in `DECISION_LOG.md` with what was wrong and what the correct behavior should have been
2. If the error reflects a systemic misunderstanding: an update to the relevant doctrine file
3. If the error reflects a pattern: an entry in `ANTI_PATTERNS.md` or a new TEST_CASES.md case

Corrections made in conversation that are not recorded in files are not learning. They are forgotten at the next session reset.
