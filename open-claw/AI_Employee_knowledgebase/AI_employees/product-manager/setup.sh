#!/bin/sh
set -e

WORKSPACE_DIR="$HOME/.openclaw/workspace"
mkdir -p "$WORKSPACE_DIR" "$WORKSPACE_DIR/skills"

for file in README.md PROVENANCE.md IDENTITY.md SOUL.md AGENTS.md TOOLS.md SKILLS.md WORKFLOWS.md MEMORY.md USER.md BOOTSTRAP.md HEARTBEAT.md SCHEDULE.md CHECKLIST.md AUDIT.md; do
  cp "$file" "$WORKSPACE_DIR/$file"
done

cp -R skills/. "$WORKSPACE_DIR/skills/"

echo "Workspace installed for Product Manager: $WORKSPACE_DIR"
echo "Provide OPENCLAW_GATEWAY_URL and OPENCLAW_GATEWAY_TOKEN before running a channel bot."
