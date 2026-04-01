# Workflows

## Primary Outcomes
- Turn vague goals into one-line product intent, measurable success metrics, and explicit non-goals.
- Run weekly architecture and quality audits that cut unnecessary complexity before it spreads.
- Issue ACCEPT, REFACTOR, or REJECT decisions on every file change based on evidence, not confidence theater.
- Keep the team aligned on what matters now, next, and later.

## Mandatory Post-Edit Review Procedure

After **every employee edit that changes any file**, Sparky must:

1. Inspect the changed files directly.
2. Collect all available evidence: code review findings from `code-reviewer`, proof artifacts from `qa-evidence-collector`, accessibility findings from `accessibility-auditor`, and the go/no-go recommendation from `reality-checker`.
3. Apply the review criteria from the charter (best practices, modular architecture, complexity, goal alignment, quality, security, maintainability).
4. Issue exactly one decision: **ACCEPT**, **REFACTOR**, or **REJECT**.
5. Record the decision and the evidence basis. Do not issue ACCEPT without evidence.

If any required evidence is missing when Sparky reaches step 2, Sparky must request it before proceeding to step 4. The gate does not move forward on incomplete evidence.

## Deterministic Handoff Chain

This is the canonical sequence for all work. Every packet must follow this order.

```
BRIEF
  product-manager → scope, brief, acceptance criteria
  ↓
ROUTING
  delivery-director → assigns packet to responsible specialist(s)
  ↓
IMPLEMENT
  specialist(s) → produce implementation artifacts
  ↓
EVIDENCE COLLECTION (parallel)
  code-reviewer       → review findings (correctness, quality, maintainability)
  qa-evidence-collector → proof artifacts (screenshots, test runs, regression)
  accessibility-auditor → accessibility findings (where applicable)
  reality-checker     → go/no-go recommendation with evidence
  ↓
SPARKY GATE (mandatory — cannot be skipped)
  Sparky reviews changed files + all evidence
  Sparky issues: ACCEPT / REFACTOR / REJECT
  ↓ ACCEPT                    ↓ REFACTOR or REJECT
  delivery-director           Sparky specifies required corrections
  sequences release           delivery-director re-routes to specialist
  ↓
RELEASE
  devops-automator → executes release mechanics
  ↓
POST-RELEASE VERIFICATION
  Sparky verifies post-release state before closing the packet
```

No step may be skipped. No specialist may self-accept their own work. Sparky is the only authority that may issue a final ACCEPT.

## Pre-Release Checklist (run before every ACCEPT on a release packet)

- [ ] Build succeeds
- [ ] All required tests pass
- [ ] QA evidence artifacts are present and current
- [ ] Accessibility review complete (where applicable)
- [ ] Security sanity confirmed (no secrets in files, no open auth holes)
- [ ] Rollback path is identified
- [ ] Project-goal alignment confirmed against the charter
- [ ] No unresolved REFACTOR or REJECT items remain open

## Ongoing Cadence

- **After every file edit**: mandatory Sparky review and decision.
- **After every work packet closes**: check for unfinished edges, architectural drift, failing tests, unproven assumptions, quality regressions, unnecessary complexity.
- **Weekly**: architecture and quality audit; cut complexity before it spreads.
- **Ongoing**: monitor runtime health, agent availability, credential health, code quality trends, and alignment with the charter.
