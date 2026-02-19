# OpenClaw — Setup Notes

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| OS | Windows 10/11 with WSL2 | Ubuntu 24.04 recommended |
| Node.js | 22+ | Required by Gateway (`module.enableCompileCache`) |
| pnpm | Latest | Monorepo workspace manager |
| Git | 2.x | Shallow clone for vendor |

## WSL2 Setup (Windows)

```powershell
# Install WSL2 (PowerShell, admin)
wsl --install -d Ubuntu-24.04
```

```bash
# Inside WSL — install Node 22 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22

# Install pnpm
corepack enable
corepack prepare pnpm@latest --activate
```

## Path Mapping

| Context | Path |
|---------|------|
| Windows | `D:\github\open--claw\` |
| WSL | `/mnt/d/github/open--claw/` |
| Vendor repo | `vendor/openclaw/` (gitignored, shallow clone) |
| OpenClaw state | `~/.openclaw/` (inside WSL home) |
| OpenClaw config | `~/.openclaw/openclaw.json` |

## Development Loop (when ready)

```bash
cd /mnt/d/github/open--claw/vendor/openclaw

# Install dependencies (NOT done in Phase 0)
pnpm install

# Build
pnpm build
pnpm ui:build

# Onboard (interactive setup)
openclaw onboard

# Start gateway
openclaw start
# or: node openclaw.mjs start
```

## Key Dev Commands

| Command | Purpose |
|---------|---------|
| `openclaw start` | Start the Gateway daemon |
| `openclaw config set <key> <value>` | Update config |
| `openclaw doctor` | Diagnostics + token generation |
| `openclaw sandbox explain` | Debug sandbox/tool policy |
| `pnpm test` | Run test suite (vitest) |
| `pnpm build` | TypeScript build |

## Environment Variables

Source of truth: `.env` or `~/.openclaw/.env` (never committed).
See `vendor/openclaw/.env.example` for all keys.

Critical keys:
- `OPENCLAW_GATEWAY_TOKEN` — required if binding beyond loopback
- Model API keys: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`
- Channel tokens: `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN`, `SLACK_BOT_TOKEN`

## What NOT to Do

- Do NOT run `pnpm install` until Phase 1 approves it
- Do NOT start the Gateway until channel config is reviewed
- Do NOT put any `.env` or API keys in the repo
- Do NOT use `vendor/openclaw/.git/` for our commits (it's a separate repo)
