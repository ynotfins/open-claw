#!/bin/sh
set -e

CONFIG_DIR="/root/.openclaw"
CONFIG_FILE="$CONFIG_DIR/openclaw.json"
WORKSPACE_DIR="$CONFIG_DIR/workspace"
AGENT_DIR="$CONFIG_DIR/agents/main/agent"

if [ -z "$OPENCLAW_GATEWAY_URL" ] || [ -z "$OPENCLAW_GATEWAY_TOKEN" ]; then
  echo "[entrypoint] ERROR: OPENCLAW_GATEWAY_URL and OPENCLAW_GATEWAY_TOKEN must be set."
  exit 1
fi

mkdir -p "$CONFIG_DIR" "$WORKSPACE_DIR" "$AGENT_DIR"

cat > "$CONFIG_FILE" <<OCJSON
{
  "agents": {
    "defaults": {
      "workspace": "$WORKSPACE_DIR",
      "heartbeat": { "every": "0m" }
    },
    "list": [
      {
        "id": "main",
        "default": true,
        "workspace": "$WORKSPACE_DIR",
        "agentDir": "$AGENT_DIR"
      }
    ]
  },
  "gateway": {
    "mode": "remote",
    "remote": {
      "url": "$OPENCLAW_GATEWAY_URL",
      "token": "$OPENCLAW_GATEWAY_TOKEN"
    }
  }
}
OCJSON

echo "[entrypoint] workspace ready for backend-architect"
echo "[entrypoint] remote gateway configured: $OPENCLAW_GATEWAY_URL"
exec node bot-telegram.js
