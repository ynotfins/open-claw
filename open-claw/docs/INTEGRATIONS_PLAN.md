# OpenClaw — Integrations Plan

## Overview

This document maps the integration targets from `INTEGRATIONS.md` to OpenClaw's
channel adapter and extension architecture, with approach notes for each.

## Channel Integrations

### Gmail / Email

| Aspect | Approach |
|--------|----------|
| Inbound | Gmail push notifications via Pub/Sub → webhook to Gateway |
| Outbound | Gmail API send via service account or OAuth |
| Extension | `extensions/google-antigravity-auth` for OAuth flow |
| Skill | Custom skill for inbox triage, reply drafting |
| Consideration | Pub/Sub requires a publicly-reachable endpoint or Tailscale funnel |

### SMS / Phone

| Aspect | Approach |
|--------|----------|
| Provider | Twilio or similar via custom extension |
| Inbound | Webhook from Twilio → Gateway |
| Outbound | Twilio API call from tool/skill |
| Extension | `extensions/phone-control` exists for device-level phone control |
| Consideration | Per-message costs; rate limiting essential |

### WhatsApp

| Aspect | Approach |
|--------|----------|
| Adapter | Built-in (`src/whatsapp/`), uses Baileys library |
| Auth | QR code pairing (single-device protocol) |
| Config | `channels.whatsapp.dmPolicy`, allowlists, group policies |
| Consideration | One Gateway = one WhatsApp session; Baileys is unofficial API |

### Telegram

| Aspect | Approach |
|--------|----------|
| Adapter | Built-in (`src/telegram/`) |
| Auth | Bot token via `TELEGRAM_BOT_TOKEN` |
| Config | `channels.telegram.enabled`, DM policy |

### Discord

| Aspect | Approach |
|--------|----------|
| Adapter | Built-in (`src/discord/`) + extension (`extensions/discord`) |
| Auth | Bot token via `DISCORD_BOT_TOKEN` |
| Config | `channels.discord`, presence settings |

### Slack

| Aspect | Approach |
|--------|----------|
| Adapter | Built-in via extension (`extensions/slack`) |
| Auth | Bot + App tokens |
| Config | `channels.slack.botToken`, `channels.slack.appToken` |

## Service Integrations

### Calendar (Google Calendar)

| Aspect | Approach |
|--------|----------|
| Method | Google Calendar API via skill or extension |
| Auth | OAuth via `extensions/google-antigravity-auth` |
| Use case | Schedule queries, event creation, meeting prep briefings |
| Cron | Heartbeat skill for daily agenda summary |

### Contacts

| Aspect | Approach |
|--------|----------|
| Method | Google Contacts API or device contacts via mobile node |
| Auth | OAuth or node.invoke on mobile |
| Use case | Contact lookup for messaging, relationship context |

### Banking / Finance

| Aspect | Approach |
|--------|----------|
| Method | Read-only API integration via custom skill |
| Auth | OAuth or API key (never stored in repo) |
| Policy | Strictly read-only; no transaction execution without explicit approval gate |
| Sandbox | Always sandboxed; elevated exec prohibited |
| Consideration | Highest security tier — formal audit trail required |

## Automation Integrations

### Cron / Scheduled Actions

| Aspect | Approach |
|--------|----------|
| Built-in | `src/cron/` — cron expressions trigger agent actions |
| Use case | Morning briefing, inbox check, calendar prep, usage reports |
| Config | `cron` block in `openclaw.json` |

### Webhooks

| Aspect | Approach |
|--------|----------|
| Built-in | Gateway accepts webhook payloads |
| Use case | GitHub events, CI/CD notifications, form submissions |
| Auth | Webhook secrets validated at Gateway level |

## Integration Priority (Phase 1+)

| Priority | Integration | Reason |
|----------|-------------|--------|
| P0 | WhatsApp | Primary messaging channel, built-in adapter |
| P0 | Telegram | Secondary messaging, built-in adapter |
| P1 | Gmail | Communication hub, requires Pub/Sub setup |
| P1 | Calendar | Scheduling awareness, OAuth setup shared with Gmail |
| P2 | Discord / Slack | Team communication channels |
| P2 | Cron / Heartbeat | Proactive assistant capabilities |
| P3 | Banking | High-security, read-only, deferred until security audit |
| P3 | SMS | Per-message costs, Twilio dependency |
