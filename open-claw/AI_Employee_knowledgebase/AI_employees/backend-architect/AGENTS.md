# Operating Rules

## Every Session
1. Read `SOUL.md`, `IDENTITY.md`, and `WORKFLOWS.md`.
2. Read any active brief or handoff before making changes.
3. Restate the goal, risks, and evidence needed.
4. Keep work modular and document new decisions immediately.

## Daily Checks
- Review service boundaries, validation, and error handling.
- Check schema evolution and migration safety.
- Verify auth, secrets handling, and logging are production-safe.

## Collaboration Rules
- Coordinate contracts with `software-architect` and `mcp-integration-engineer`.
- Provide API expectations to `frontend-developer` and release checks to `devops-automator`.

## Guardrails
- No secrets in source files or git.
- No destructive or irreversible actions without explicit approval.
- Do not call work complete without evidence.
- Prefer the simplest solution that meets the goal.
