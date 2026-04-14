# MEMORY.md

## Memory System Purpose

Sparky's memory system preserves governance continuity across sessions.
Without continuity, each session restarts blind:
- prior blocking decisions are unknown
- escalation chains are lost
- drift that was flagged is re-flagged without progress
- trust levels assigned in prior cycles are not carried forward

Memory is not for storing personality.
Memory is for storing evidence, decisions, and state that affect the next governance action.

## Memory Tiers

### Tier 1: Session State (Active Working Memory)

**File:** `live/SESSION_STATE.md`
**Update Frequency:** Every message that changes a governance state
**Contents:**
- Active work item IDs and current states
- Open blocking conditions and their owners
- Open escalations and their resolution requirements
- Current trust levels by work item
- Evidence received this session and its quality rating
- Routing decisions made this session

**Rule:** If a governance decision is important enough to affect the next action, write it to Session State before responding.
Do not rely on chat context to retain governance state. Chat context is a buffer, not storage.

### Tier 2: Decision Log (Persistent Cross-Session Record)

**File:** `DECISION_LOG.md`
**Update Frequency:** After every governance cycle that produces a final outcome
**Contents:**
- Work item ID
- Decision outcome
- Evidence basis
- Gate results
- State transition
- Owner
- Any exception or escalation notes

**Rule:** No governance cycle closes without a Decision Log entry.
Decision Log entries survive session resets and are the authoritative record for audit.

### Tier 3: Long-Term Knowledge (Stable Facts)

**Files:** `KNOWLEDGE_SOURCES.md`, `KNOWLEDGE_MAP.json`, `CONTEXT7_LIBRARIES.json`
**Update Frequency:** When new authoritative sources are confirmed or existing ones are revised
**Contents:**
- Authoritative source registry
- Library and tool references
- System architecture facts
- Governance doctrine changes

**Rule:** Long-term knowledge is updated only when a fact has been verified and will persist across future sessions. Do not store speculation or unverified working assumptions here.

## Working Buffer

**File:** `live/working-buffer.md`
**Purpose:** Capture governance details in the danger zone between active session and compaction.

The danger zone is the period where:
- a session is approaching context limits
- critical decisions or evidence have been received but not yet committed to the Decision Log
- a compaction or reset is about to occur

Working buffer entries are temporary.
They must be promoted to Decision Log or Session State before the session closes, or explicitly handed off.

**Format:**
```
[TIMESTAMP] [WORK_ITEM_ID] [ACTION_TYPE]
Summary: what happened
Evidence: what was received and its quality
State: what state the item is in
Required next: what must happen before this item can progress
Owner: who is responsible for the next action
```

## Recovery Protocol After Compaction

When a new session starts and prior context is lost:

1. Read `live/SESSION_STATE.md` — identify all active work items and their states
2. Read `DECISION_LOG.md` recent entries — confirm what was decided and when
3. Read `live/working-buffer.md` — check for uncommitted entries
4. If working buffer has entries not yet in Decision Log: promote them now
5. Re-establish trust levels from evidence records
6. Resume with active work items, not from a blank slate

If Session State is empty or corrupted:
- Do not assume all items are clear
- Do not assume no blocks exist
- Default to `REQUIRE_MORE_EVIDENCE` for any item whose state is unknown
- Escalate if a release or deployment was in progress when context was lost

## What Gets Stored

### Store Immediately
- Any governance decision (allow, block, escalate, defer, require_more_evidence)
- Trust level assigned to a work item
- Evidence received and its quality assessment
- Blocking conditions and their specific resolution requirements
- Escalation routing and required resolution
- State transitions
- Rollback requirements assigned

### Store After Cycle Completion
- Full trace for completed governance cycle
- Final gate evaluation results
- Evidence references with quality ratings
- Decision rationale

### Do Not Store
- Confidence assertions without supporting evidence
- Narrative descriptions of work without artifact references
- Personally identifiable information
- Secrets, credentials, keys, tokens, or connection strings
- Speculative conclusions not yet supported by evidence

## Memory Failure Modes

### Lost State on Reset
**Symptom:** Session State is empty but active work items exist in the system.
**Response:** Read Decision Log for last known state. Default to `REQUIRE_MORE_EVIDENCE` for unknown items.
**Prevention:** Write Session State after every governance action, not at end of session.

### Stale Evidence Reference
**Symptom:** Evidence referenced in a prior decision is no longer retrievable.
**Response:** Downgrade trust level. Require re-verification before the affected decision can be relied upon.
**Prevention:** Store artifact references with enough specificity to retrieve them independently.

### Diverged Decision Log and Session State
**Symptom:** Session State says item is `approved` but Decision Log shows no approval record.
**Response:** Session State is overridden by Decision Log. Do not trust Session State-only entries without Decision Log backing.
**Prevention:** Always commit to Decision Log before closing the governance cycle.

### Working Buffer Not Promoted
**Symptom:** Working buffer has entries from prior session not in Decision Log.
**Response:** Promote working buffer entries immediately. If they cannot be validated, escalate.
**Prevention:** At session close, explicitly promote or hand off all working buffer entries.

## Search Protocol

Before answering any governance question about prior state:
1. Search Session State for active items
2. Search Decision Log for prior outcomes
3. Search working buffer for in-flight entries
4. Do not rely on conversation history as the authoritative source

If search returns no match:
- State explicitly that the prior state is unknown
- Do not assume the work item is clean
- Default to requiring fresh evidence
