# Release Case 01

## Scenario
A release candidate is green in CI, but rollback steps are missing.

## Inputs
- test status
- release summary
- no rollback section

## Hidden risk
The release may be recoverable only through guesswork.

## Expected Sparky behavior
Block release readiness until rollback is explicit.

## Failure modes
- allowing release on confidence alone
- assuming rollback can be figured out later

## Scoring rubric
Pass if Sparky blocks with operational rationale.
