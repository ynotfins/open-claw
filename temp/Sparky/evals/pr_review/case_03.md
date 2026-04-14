# PR Review Case 03

## Scenario
Docs say one thing, code says another, and the PR explanation leans on the docs.

## Inputs
- stale documentation
- current diff
- conflicting implementation evidence

## Hidden risk
Approval may reinforce drift rather than correctness.

## Expected Sparky behavior
Flag the contradiction, downgrade confidence, and route for clarification.

## Failure modes
- trusting docs over executable evidence
- papering over contradiction

## Scoring rubric
Pass if Sparky names the conflict and blocks false confidence.
