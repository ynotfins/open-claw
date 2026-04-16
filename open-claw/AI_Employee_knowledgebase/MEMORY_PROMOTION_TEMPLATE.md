# Memory Promotion Template

## Purpose
Use this template when a worker packet has produced a validated result that should survive beyond the current chat or runtime session.

## Rules
- Do not promote speculative reasoning.
- Do not promote raw logs when a short validated summary exists.
- Do not store secrets, env values, token IDs, or quarantined content.
- Sparky or the responsible gate role must validate the packet before promotion.
- Assume the live OpenMemory surface is flat; future retrieval should not depend on hidden metadata filters.
- Include the canonical source doc path in the final memory text.

## Compact Packet

### Role
- Worker:
- Manager / gate:

### Task
- One-line task summary:
- Scope:

### Stable Result
- What is now true:
- Why it matters later:

### Evidence
- Canonical source doc path:
- Proof source:
- What was verified:
- What remains unverified:

### Promotion Target
- Namespace label (human hint only, not a runtime filter):
- Memory type label (human hint only, not a runtime filter):

Recommended namespaces:
- `openclaw/briefs`
- `openclaw/decisions`
- `openclaw/patterns`
- `openclaw/debug`
- `openclaw/reviews`
- `openclaw/evidence`
- `openclaw/releases`

### Final Memory Text
Write one compact paragraph that future sessions can retrieve without reloading the whole packet.
The paragraph itself must carry the stable identity:
- self-identifying prefix
- canonical source doc path
- the validated stable result

Recommended prefix:
- `[repo=openclaw][kind=decision][stability=durable][source=<canonical doc>] ...`
- `[repo=openclaw][kind=pattern][scope=worker-memory][source=<canonical doc>] ...`
- `[repo=openclaw][kind=evidence][source=<canonical doc>] ...`

Do not mention unsupported filter fields as if the runtime enforces them.

## Example
- Worker: `code-reviewer`
- Manager / gate: `sparky-chief-product-quality-officer`
- Task: review modular refactor for dashboard tiles
- Stable result: review found no correctness regressions; the main durable lesson is that tile state and contrast logic must stay centralized instead of living in activities
- Evidence: lint clean, targeted smoke test passed, no unresolved review findings
- Canonical source doc path: `open-claw/AI_Employee_knowledgebase/MEMORY_PROMOTION_TEMPLATE.md`
- Promotion target: `openclaw/patterns` (label only)
- Final memory text: "[repo=openclaw][kind=pattern][source=open-claw/AI_Employee_knowledgebase/MEMORY_PROMOTION_TEMPLATE.md] OpenClaw UI work should keep tile styling and status evaluation centralized in shared domain/UI helpers instead of scattering logic through activities; this reduced review churn and made contrast fixes safer to verify."
