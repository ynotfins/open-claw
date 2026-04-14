# ONBOARDING.md — First-Run Setup and Context Collection

## Purpose

This file is read on Sparky's first session in a new environment, or when context is missing that would prevent effective governance.

ONBOARDING.md tracks setup progress and prompts for missing context.
When fully complete, this file should not block Sparky from operating — it should confirm that Sparky is fully contextualized.

Mark each item as complete [x] as it is resolved.

---

## Environment Context Checklist

### Factory Context

- [ ] Factory repository is identified: `d:\github\Formula_One_AI_Factory` or equivalent
- [ ] Operating branch is confirmed: expected `sparky` (current: see `manifest.json`)
- [ ] Sparky's version is confirmed: see `manifest.json`
- [ ] SOUL.md has been read this session
- [ ] OPERATING_RULES.md has been read this session
- [ ] AGENTS.md has been read this session

### Tool Availability

- [ ] GitHub MCP tool: reachable? Test: `github.getPullRequest` on any PR
- [ ] Context7 MCP tool: reachable? Test: `context7.searchLibrary` on any known library
- [ ] Firestore MCP tool: reachable? Test: `firestore.listCollections`
- [ ] Shell/filesystem access: reachable? Test: list `employees/Sparky/`

For each tool that is unavailable: note the unavailability in `live/SESSION-STATE.md` and apply the degraded-mode fallback from `TOOLS.md`.

### Session State

- [ ] `live/SESSION-STATE.md` has been read
- [ ] `DECISION_LOG.md` recent entries have been reviewed
- [ ] `live/working-buffer.md` has been checked for uncommitted entries
- [ ] Any prior open blocks or escalations have been identified

### Integration Context

- [ ] OpenClaw integration status confirmed: validated or unvalidated (see `INSTALLATION_TARGETS.json`)
- [ ] Live layer status confirmed: `live/index.ts` accessible? (`executeSparky` callable?)
- [ ] Environment variables confirmed: all required vars from `.env.example` are set

---

## Operator Context Prompts

These prompts collect context that helps Sparky serve the factory effectively.
They are answered once and stored in `USER.md` under "Operating Environment."
If USER.md already has answers, skip these.

**Prompt 1:** What is the current primary active work stream?
(Example: "Building Sparky's live deployment layer." "QA'ing the governance pipeline." "Onboarding a new specialist.")

Answer: _____

**Prompt 2:** Are there any active incidents or P0 issues in the factory?

Answer: _____

**Prompt 3:** Are there any governance exceptions currently in force that Sparky should know about?
(Any gates temporarily modified, any waivers in effect?)

Answer: _____

**Prompt 4:** Which specialist agents are currently available and reachable?

Answer: _____

**Prompt 5:** Which open--claw integration paths are confirmed validated vs. theoretical?

Answer: _____

---

## Onboarding Completion Confirmation

When all checklist items are marked complete and prompts have been answered:

Sparky is contextualized for this environment.
Normal governance operations may begin.
No further prompting is required.

If any checklist item cannot be completed:
- Document the gap in `live/SESSION-STATE.md`
- Apply the appropriate degraded-mode behavior from `TOOLS.md` or `RETRIEVAL_RULES.md`
- Begin operations with flagged limitations noted

---

## Re-Onboarding Triggers

Re-read this file when:
- A session resets after a long gap (>48 hours since last activity)
- The operating environment changes (new repo, new branch, new deployment target)
- A new operator joins the session and needs context
- A significant governance policy change has been made

---

## Version Note

This file tracks onboarding progress per environment, not per session.
Once an environment is fully onboarded, this file becomes a reference document, not an active checklist.
Only re-activate the checklist when a re-onboarding trigger fires.
