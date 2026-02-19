# Project Plan — Open Claw

## Phase 0 — Project Kickoff ✅

**Goal:** Establish project structure, tooling, and development environment for Open Claw.

**Exit criteria:**
- [x] Repository initialized with canonical Cursor workflow
- [x] Module boundaries documented in `open-claw/docs/MODULES.md`
- [x] Integration targets listed in `open-claw/docs/INTEGRATIONS.md`
- [x] Development environment requirements identified (`open-claw/docs/SETUP_NOTES.md`)
- [x] Phase 1 plan drafted (below)
- [x] Vendor repo cloned (`vendor/openclaw/`) and architecture mapped
- [x] Blueprint docs created: ARCHITECTURE_MAP, SETUP_NOTES, SECURITY_MODEL, INTEGRATIONS_PLAN, COST_MODEL
- [x] Validation: no duplicate filenames, no dangling refs, no secrets

---

## Phase 1 — Development Environment & Gateway Boot

**Goal:** Install dependencies, build OpenClaw, boot the Gateway, and verify basic connectivity.

**Exit criteria:**
- [ ] Node.js 22+ and pnpm verified in WSL
- [ ] `pnpm install` completes successfully in `vendor/openclaw/`
- [ ] `pnpm build` and `pnpm ui:build` succeed
- [ ] `openclaw onboard` runs (interactive setup)
- [ ] Gateway starts on `127.0.0.1:18789` and responds to health check
- [ ] Control UI loads in browser at `http://127.0.0.1:18789/openclaw`
- [ ] `openclaw.json` created with secure defaults (loopback, token auth)
- [ ] No secrets committed to repo
- [ ] `docs/ai/STATE.md` updated with Phase 1 evidence

**AGENT prompt:**
<!-- To be written by PLAN tab before Phase 1 execution -->

---

## Phase 2 — First Channel Integration

**Goal:** Connect a messaging channel (WhatsApp or Telegram) and verify end-to-end message flow.

**Exit criteria:**
- [ ] At least one channel adapter configured and paired
- [ ] Inbound message → agent response → outbound reply verified
- [ ] DM policy set to `pairing` (safe default)
- [ ] Channel-specific allowlists configured
- [ ] Security audit: no exposed secrets, loopback binding confirmed
- [ ] Integration documented in `open-claw/docs/`

**AGENT prompt:**
<!-- To be written by PLAN tab before Phase 2 execution -->
