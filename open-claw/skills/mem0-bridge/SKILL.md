---
name: mem0-bridge
description: Compatibility-named bridge that maps OpenClaw packet promotion to Cursor OpenMemory using retrieve-before-plan and store-after-gate routines.
---

# mem0 Bridge Skill

## Status: READY (requires Cursor `openmemory` MCP)

## Compatibility Note
The skill name stays `mem0-bridge` for continuity, but the live seam targets the
flat Cursor `openmemory` surface:

- `search-memories(query)`
- `add-memory(content)`
- `list-memories()`

Do not assume a mem0 HTTP API, hidden metadata fields, `project_id`,
`namespace`, or filter support.

## Purpose
Use this skill when an OpenClaw worker or Sparky needs durable cross-session recall
without treating memory as canonical. Repo docs and validated packets remain the
source of truth.

## Retrieve-Before-Plan
1. Read the charter and repo authority docs first.
2. Run `openmemory.search-memories` with a targeted query that includes repo,
   role, and task.
3. Treat returned memories as recall support only.
4. Discard any result that conflicts with repo docs or surfaces quarantined
   content/path terms.

Suggested query shapes:
- `openclaw sparky <task> decision pattern proof`
- `openclaw <worker> <feature> bridge recovery`

## Store-After-Gate
1. Validate the result through Sparky or the responsible gate role.
2. Fill `open-claw/AI_Employee_knowledgebase/MEMORY_PROMOTION_TEMPLATE.md`.
3. Reduce the packet to one compact self-identifying paragraph.
4. Run `openmemory.add-memory`.
5. Immediately run `openmemory.search-memories` with a targeted verification
   query.
6. If retrieval fails, record the gap in repo docs/recovery state and do not
   claim durable promotion is proven.

## Promotion Rules
- Promote only validated stable summaries, not raw transcripts or logs.
- Keep the memory compact and self-identifying.
- Include the canonical source doc path in the final text.
- Never store secrets, credentials, personal data, or quarantined content.
- Repo docs win over stored memories in conflicts.
- Do not rely on unsupported filters or hidden namespaces.

Recommended final text prefixes:
- `[repo=openclaw][kind=decision][source=<canonical doc>] ...`
- `[repo=openclaw][kind=pattern][source=<canonical doc>] ...`
- `[repo=openclaw][kind=evidence][source=<canonical doc>] ...`

## Minimal Proof Loop
1. `openmemory.search-memories` before planning or execution.
2. Validate the packet in repo docs.
3. `openmemory.add-memory` with the compact final text.
4. `openmemory.search-memories` again to prove discoverability.
5. Refresh recovery/state evidence in the paired repos.

## Configuration
```json5
{
  skills: {
    entries: {
      "mem0-bridge": {
        enabled: true,
      },
    },
  },
}
```

## Stop Conditions
1. Stop if `openmemory` is unavailable and the task requires durable promotion.
2. Stop if the result depends on quarantined content.
3. Stop if the bridge would require files outside the allowed change set.
