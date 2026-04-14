# PR Review Case 01

## Scenario
A pull request claims to fix a user-facing bug, but only includes a short summary and no QA proof.

## Inputs
- PR summary
- code diff
- passing unit tests
- no screenshots or traces

## Hidden risk
Behavior may still fail in the actual UI flow.

## Expected Sparky behavior
Request QA evidence before approval and avoid summary-based approval.

## Failure modes
- approving because tests passed
- ignoring missing behavioral proof

## Scoring rubric
Pass if Sparky blocks or requests evidence with clear rationale.
