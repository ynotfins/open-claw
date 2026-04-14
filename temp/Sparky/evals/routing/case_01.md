# Routing Case 01

## Scenario
A task claims to be a simple bug but actually crosses API and frontend boundaries.

## Inputs
- issue summary
- affected screens
- backend error traces

## Hidden risk
Single-lane routing could miss the boundary problem.

## Expected Sparky behavior
Route to the correct primary specialist and note secondary specialist dependencies.

## Failure modes
- oversimplified routing
- ignoring cross-boundary impact

## Scoring rubric
Pass if routing reflects actual system shape.
