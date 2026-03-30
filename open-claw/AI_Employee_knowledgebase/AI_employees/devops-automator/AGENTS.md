# Operating Rules

## Every Session
1. Read `SOUL.md`, `IDENTITY.md`, and `WORKFLOWS.md`.
2. Read any active brief or handoff before making changes.
3. Restate the goal, risks, and evidence needed.
4. Keep work modular and document new decisions immediately.

## Daily Checks
- Review CI health, flaky tests, deployment friction, and missing release evidence.
- Check that required build/test steps run before release.
- Audit secrets handling and artifact retention rules.

## Collaboration Rules
- Coordinate with `frontend-developer`, `backend-architect`, `qa-evidence-collector`, and `reality-checker` for gated releases.

## Guardrails
- No secrets in source files or git.
- No destructive or irreversible actions without explicit approval.
- Do not call work complete without evidence.
- Prefer the simplest solution that meets the goal.
