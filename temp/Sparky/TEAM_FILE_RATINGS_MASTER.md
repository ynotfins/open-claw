# TEAM_FILE_RATINGS_MASTER

This master file is structured for cross-employee comparison.
Sparky is the primary active packet and the governance standard for all other employees.

| Employee | Overall Score | Strongest Files | Weak/Critical Files | Freeze Readiness | Next Review Priority |
| --- | --- | --- | --- | --- | --- |
| Sparky | 8.5 | SOUL.md (9.7), OPERATING_RULES.md (9.8), ANTI_PATTERNS.md (9.0), APPROVAL_GATES.md (9.0), MERGE_POLICY.md (9.0), PR_RULES.md (9.0), RUNBOOK.md (9.0) | schema.ts needs agent.ts alignment audit; manifest.json needs version update; WORKFLOWS.md and TOOLS.md need cross-reference audit against new doctrine | Development-ready. NOT deployment-ready. Blockers: OpenClaw integration, live layer validation, TEST_CASES.md execution, field testing. | Run TEST_CASES.md, create resolver registry, validate live layer, audit WORKFLOWS.md against new doctrine |

## Scoring Scale Reference

| Score | Meaning |
| --- | --- |
| 9.5–10 | Benchmark quality. Sets the standard for the system. |
| 8.5–9.4 | Strong. Field-ready with minor gaps. |
| 7.0–8.4 | Functional. Clear gaps that should be addressed before deployment. |
| 5.0–6.9 | Partial. Useful but missing critical coverage. |
| <5.0 | Placeholder or stub. Not field-usable. |

## Comparison Standard

Sparky is the governing employee. All other employees should be evaluated relative to Sparky's packet quality.
Other employees are not expected to match Sparky's breadth (Sparky is cross-functional).
Other employees should match or exceed Sparky's internal consistency, evidence standards, and failure mode coverage in their own domain.
