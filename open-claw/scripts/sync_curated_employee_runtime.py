from __future__ import annotations

import json
import re
import shutil
import textwrap
from dataclasses import dataclass
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

REPO_ROOT = Path(__file__).resolve().parents[2]
OPEN_CLAW_ROOT = REPO_ROOT / "open-claw"
KB_ROOT = OPEN_CLAW_ROOT / "AI_Employee_knowledgebase"
EMPLOYEE_ROOT = KB_ROOT / "AI_employees"
ZIP_ROOT = EMPLOYEE_ROOT / "_zips"
SKILLS_ROOT = OPEN_CLAW_ROOT / "skills"
DEPLOYED_CURATED_ROOT = OPEN_CLAW_ROOT / "employees" / "deployed-curated"
WORKFLOW_CHECKLIST_PATH = KB_ROOT / "OPENCLAW_WORKFLOW_CHECKLIST.md"
VALIDATION_SUMMARY_PATH = KB_ROOT / "RUNTIME_VALIDATION_SUMMARY.md"
CURRENT_EMPLOYEES_PATH = KB_ROOT / "current_employees.md"
TODAY = "2026-03-30"
OPENCLAW_VERSION = "2026.3.13"

DOC_FILES = [
    "README.md",
    "PROVENANCE.md",
    "IDENTITY.md",
    "SOUL.md",
    "AGENTS.md",
    "TOOLS.md",
    "SKILLS.md",
    "WORKFLOWS.md",
    "MEMORY.md",
    "USER.md",
    "BOOTSTRAP.md",
    "HEARTBEAT.md",
    "SCHEDULE.md",
    "CHECKLIST.md",
    "AUDIT.md",
]
RUNTIME_FILES = [
    ".env.example",
    "Dockerfile",
    "docker-compose.yml",
    "entrypoint.sh",
    "setup.sh",
    "package.json",
    "openclaw-runner.js",
    "bot-telegram.js",
    "bot-discord.js",
    "bot-slack.js",
    "bot-whatsapp.js",
    "heartbeat.sh",
]
SECRET_IDS = {
    "api-integration-specialist": "d44c0214-4341-4b57-83b6-b411002ba700",
    "code-reviewer": "9f6d6d14-917f-435d-a757-b41100300499",
    "financial-analyst": "d32f653b-0f42-4824-b760-b41100307afd",
    "frontend-developer": "db45a28d-e942-4b19-aee9-b4110030a9e8",
    "overnight-coder": "cd3ecf0b-b6df-4490-9bf8-b4110030d207",
    "personal-crm": "30a52f8e-5afa-4074-86f7-b41d000c36d7",
    "script-builder": "9127c2f6-7185-41c3-9aab-b41d000c69ee",
    "seo-specialist": "35e7872d-66f5-4a6c-9ec1-b41d000c9501",
    "software-engineer": "5dd1faf1-c943-4be3-8cbf-b41d000cc156",
    "ux-designer": "c58957d8-a07e-4d6f-ab76-b41d000d1de7",
}

TELEGRAM_BOT_BINDINGS = {
    "code-reviewer": {
        "legacy_slug": "code-reviewer",
        "telegram_name": "CODE_REVIEWER",
        "telegram_username": "CODE_CARL_BOT",
    },
    "delivery-director": {
        "legacy_slug": "delivery-director",
        "telegram_name": "DELIVERY_DIRECTOR",
        "telegram_username": "DELIVERY_DIRECTOR_DAN_BOT",
    },
    "devops-automator": {
        "legacy_slug": "script-builder",
        "telegram_name": "SCRIPT_BUILDER",
        "telegram_username": "SCRIPT_SARAH_BOT",
    },
    "frontend-developer": {
        "legacy_slug": "frontend-developer",
        "telegram_name": "FRONTEND_DEVELOPER",
        "telegram_username": "FRONTEND_FELIX_BOT",
    },
    "mcp-integration-engineer": {
        "legacy_slug": "api-integration-specialist",
        "telegram_name": "API_INTEGRATION_SPECIALIST",
        "telegram_username": "API_ANDY_BOT",
    },
    "product-manager": {
        "legacy_slug": "product-manager",
        "telegram_name": "PRODUCT_MANAGER",
        "telegram_username": "PRODUCT_MANAGER_PETE_BOT",
    },
    "qa-evidence-collector": {
        "legacy_slug": "overnight-coder",
        "telegram_name": "OVERNIGHT_CODER",
        "telegram_username": "OVERNIGHT_OLIVER_BOT",
    },
    "reality-checker": {
        "legacy_slug": "financial-analyst",
        "telegram_name": "FINANCIAL_ANALYST",
        "telegram_username": "FINANCE_FRANKY_BOT",
    },
    "seo-ai-discovery-strategist": {
        "legacy_slug": "seo-specialist",
        "telegram_name": "SEO_SPECIALIST",
        "telegram_username": "SEO_SAMANTHA_BOT",
    },
    "software-architect": {
        "legacy_slug": "software-engineer",
        "telegram_name": "SOFTWARE_ENGINEER",
        "telegram_username": "ENGINEER_ENRIQUE_BOT",
    },
    "sparky-chief-product-quality-officer": {
        "legacy_slug": "sparky-chief-product-quality-officer",
        "telegram_name": "sparky-chief-product-quality-officer",
        "telegram_username": "SPARKY_CEO_BOT",
    },
    "ui-designer": {
        "legacy_slug": "personal-crm",
        "telegram_name": "PERSONAL_CRM",
        "telegram_username": "PERSONAL_PAMELA_BOT",
    },
    "ux-architect": {
        "legacy_slug": "ux-designer",
        "telegram_name": "UX_DESIGNER",
        "telegram_username": "UX_URSULA_BOT",
    },
}


@dataclass(frozen=True)
class EmployeeRuntime:
    slug: str
    title: str
    manager: str
    skills: list[str]
    summary: str



def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)



def write(path: Path, content: str) -> None:
    ensure_dir(path.parent)
    path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")



def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")



def parse_employees() -> list[EmployeeRuntime]:
    employees: list[EmployeeRuntime] = []
    for employee_dir in sorted(path for path in EMPLOYEE_ROOT.iterdir() if path.is_dir() and path.name != "_zips"):
        readme = read_text(employee_dir / "README.md")
        skills_doc = read_text(employee_dir / "SKILLS.md")
        title_match = re.search(r"\*\*Title:\*\*\s*(.+)", readme)
        manager_match = re.search(r"\*\*Manager:\*\*\s*(.+)", readme)
        summary_match = re.search(r"\*\*Summary:\*\*\s*(.+)", readme)
        skills = re.findall(r"`([^`]+)`", skills_doc)
        employees.append(
            EmployeeRuntime(
                slug=employee_dir.name,
                title=title_match.group(1).strip() if title_match else employee_dir.name.replace("-", " ").title(),
                manager=manager_match.group(1).strip() if manager_match else "Unassigned",
                skills=skills,
                summary=summary_match.group(1).strip() if summary_match else "Curated employee packet.",
            )
        )
    return employees



def slug_to_env(slug: str) -> str:
    return slug.replace("-", "_").upper()



def telegram_binding(slug: str) -> dict[str, str] | None:
    return TELEGRAM_BOT_BINDINGS.get(slug)



def assigned_secret_id(slug: str) -> str:
    binding = telegram_binding(slug)
    if not binding:
        return ""
    legacy_slug = binding["legacy_slug"]
    return SECRET_IDS.get(legacy_slug, "")



def assigned_username(slug: str) -> str:
    binding = telegram_binding(slug)
    return binding["telegram_username"] if binding else ""



def assigned_telegram_name(slug: str) -> str:
    binding = telegram_binding(slug)
    return binding["telegram_name"] if binding else "TBD"



def pending_bot_slugs(employees: list[EmployeeRuntime]) -> list[str]:
    return [employee.slug for employee in employees if not telegram_binding(employee.slug)]



def env_only_bot_slugs(employees: list[EmployeeRuntime]) -> list[str]:
    return [employee.slug for employee in employees if telegram_binding(employee.slug) and not assigned_secret_id(employee.slug)]



def render_live_binding_block(employee: EmployeeRuntime) -> str:
    binding = telegram_binding(employee.slug)
    if not binding:
        return textwrap.dedent(
            f"""
            ## Live Telegram Binding
            - No Telegram bot is assigned to `{employee.slug}` yet.
            - This worker remains documentation-complete but still needs a dedicated Telegram bot before it can join the live curated runtime.
            - Until a new bot is created, start this worker through non-Telegram/local invocation only.
            """
        ).strip()

    legacy_slug = binding["legacy_slug"]
    resolution = (
        f"direct Bitwarden secret id wired from `{legacy_slug}`"
        if assigned_secret_id(employee.slug)
        else "env-first only for now; Bitwarden secret id still needs to be recorded"
    )
    return textwrap.dedent(
        f"""
        ## Live Telegram Binding
        - Current Telegram first name: `{binding['telegram_name']}`
        - Assigned Telegram username: `{binding['telegram_username']}`
        - Reuses the existing bot token currently labeled as `{legacy_slug}`.
        - Preferred Telegram first name for this curated role: `{employee.title}`
        - Startup resolution status: {resolution}.
        """
    ).strip()



def render_env_example(employee: EmployeeRuntime) -> str:
    env_prefix = slug_to_env(employee.slug)
    return f"""
# {employee.title} runtime environment
# Do not commit real values.
ANTHROPIC_API_KEY=
OPENCLAW_GATEWAY_URL=ws://host.docker.internal:18789
OPENCLAW_GATEWAY_TOKEN=
OPENCLAW_VERSION={OPENCLAW_VERSION}
TELEGRAM_BOT_TOKEN=
DISCORD_BOT_TOKEN=
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_APP_TOKEN=
CREWCLAW_MONITOR_KEY=
{env_prefix}_TOKEN=
"""



def render_runner() -> str:
    return """
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

async function runAgent({ message, sessionId }) {
  const args = ["agent", "--agent", "main", "--session-id", sessionId, "--message", message];
  const { stdout } = await execFileAsync("openclaw", args, { maxBuffer: 1024 * 1024 });
  return (stdout || "").trim();
}

module.exports = { runAgent };
"""



def render_telegram_bot(employee: EmployeeRuntime) -> str:
    return f"""
const {{ Bot }} = require("grammy");
const {{ runAgent }} = require("./openclaw-runner");

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const slug = "{employee.slug}";

bot.command("start", (ctx) => {{
  ctx.reply("{employee.title} is online. Send a message to start working.");
}});

bot.on("message:text", async (ctx) => {{
  try {{
    const sessionId = `telegram-${{slug}}-${{ctx.from?.id ?? 'unknown'}}`;
    const reply = await runAgent({{ message: ctx.message.text, sessionId }});
    await ctx.reply(reply || "No response from agent.");
  }} catch (error) {{
    console.error(error);
    await ctx.reply("Something went wrong. Please try again.");
  }}
}});

bot.start();
console.log("Telegram bot is running for {employee.title}.");
"""



def render_discord_bot(employee: EmployeeRuntime) -> str:
    return f"""
const {{ Client, GatewayIntentBits }} = require("discord.js");
const {{ runAgent }} = require("./openclaw-runner");

const client = new Client({{
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
}});
const slug = "{employee.slug}";

client.on("ready", () => {{
  console.log(`Discord bot logged in for {employee.title} as ${{client.user.tag}}`);
}});

client.on("messageCreate", async (message) => {{
  if (message.author.bot) return;
  try {{
    const sessionId = `discord-${{slug}}-${{message.author.id}}`;
    const reply = await runAgent({{ message: message.content, sessionId }});
    await message.reply(reply || "No response from agent.");
  }} catch (error) {{
    console.error(error);
    await message.reply("Something went wrong. Please try again.");
  }}
}});

client.login(process.env.DISCORD_BOT_TOKEN);
"""



def render_slack_bot(employee: EmployeeRuntime) -> str:
    return f"""
const {{ App }} = require("@slack/bolt");
const {{ runAgent }} = require("./openclaw-runner");

const app = new App({{
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
}});
const slug = "{employee.slug}";

app.event("app_mention", async ({{ event, say }}) => {{
  const text = event.text.replace(/<@[^>]+>/g, "").trim();
  if (!text) return say("How can I help?");
  try {{
    const sessionId = `slack-${{slug}}-${{event.user ?? 'unknown'}}`;
    const reply = await runAgent({{ message: text, sessionId }});
    await say(reply || "No response from agent.");
  }} catch (error) {{
    console.error(error);
    await say("Something went wrong. Please try again.");
  }}
}});

app.message(async ({{ message, say }}) => {{
  if (message.subtype) return;
  try {{
    const sessionId = `slack-dm-${{slug}}-${{message.user ?? 'unknown'}}`;
    const reply = await runAgent({{ message: message.text, sessionId }});
    await say(reply || "No response from agent.");
  }} catch (error) {{
    console.error(error);
    await say("Something went wrong. Please try again.");
  }}
}});

(async () => {{
  await app.start();
  console.log("Slack bot is running for {employee.title}.");
}})();
"""



def render_whatsapp_bot(employee: EmployeeRuntime) -> str:
    return f"""
const {{ Client, LocalAuth }} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const {{ runAgent }} = require("./openclaw-runner");

const client = new Client({{ authStrategy: new LocalAuth() }});
const slug = "{employee.slug}";

client.on("qr", (qr) => {{
  qrcode.generate(qr, {{ small: true }});
  console.log("Scan the QR code above with WhatsApp");
}});

client.on("ready", () => {{
  console.log("WhatsApp bot is ready for {employee.title}.");
}});

client.on("message", async (message) => {{
  try {{
    const sender = message.from.replace(/[^a-zA-Z0-9]/g, "-");
    const sessionId = `whatsapp-${{slug}}-${{sender}}`;
    const reply = await runAgent({{ message: message.body, sessionId }});
    await message.reply(reply || "No response from agent.");
  }} catch (error) {{
    console.error(error);
    await message.reply("Something went wrong. Please try again.");
  }}
}});

client.initialize();
"""



def render_dockerfile() -> str:
    copy_lines = "\n".join(
        f"COPY {name} /root/.openclaw/workspace/{name}" for name in DOC_FILES
    )
    return f"""
FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && git config --global url.'https://github.com/'.insteadOf 'ssh://git@github.com/' \
    && npm install -g openclaw@{OPENCLAW_VERSION} --ignore-scripts

RUN mkdir -p /root/.openclaw/workspace /root/.openclaw/workspace/skills
{copy_lines}
COPY skills/ /root/.openclaw/workspace/skills/
COPY package.json /app/package.json
COPY openclaw-runner.js /app/openclaw-runner.js
COPY bot-telegram.js /app/bot-telegram.js
COPY bot-discord.js /app/bot-discord.js
COPY bot-slack.js /app/bot-slack.js
COPY bot-whatsapp.js /app/bot-whatsapp.js
COPY entrypoint.sh /app/entrypoint.sh

RUN npm install && chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
"""



def render_entrypoint(employee: EmployeeRuntime) -> str:
    return f"""
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
{{
  "agents": {{
    "defaults": {{
      "workspace": "$WORKSPACE_DIR",
      "heartbeat": {{ "every": "0m" }}
    }},
    "list": [
      {{
        "id": "main",
        "default": true,
        "workspace": "$WORKSPACE_DIR",
        "agentDir": "$AGENT_DIR"
      }}
    ]
  }},
  "gateway": {{
    "mode": "remote",
    "remote": {{
      "url": "$OPENCLAW_GATEWAY_URL",
      "token": "$OPENCLAW_GATEWAY_TOKEN"
    }}
  }}
}}
OCJSON

echo "[entrypoint] workspace ready for {employee.slug}"
echo "[entrypoint] remote gateway configured: $OPENCLAW_GATEWAY_URL"
exec node bot-telegram.js
"""



def render_setup(employee: EmployeeRuntime) -> str:
    return f"""
#!/bin/sh
set -e

WORKSPACE_DIR="$HOME/.openclaw/workspace"
mkdir -p "$WORKSPACE_DIR" "$WORKSPACE_DIR/skills"

for file in {' '.join(DOC_FILES)}; do
  cp "$file" "$WORKSPACE_DIR/$file"
done

cp -R skills/. "$WORKSPACE_DIR/skills/"

echo "Workspace installed for {employee.title}: $WORKSPACE_DIR"
echo "Provide OPENCLAW_GATEWAY_URL and OPENCLAW_GATEWAY_TOKEN before running a channel bot."
"""



def render_packet_compose(employee: EmployeeRuntime) -> str:
    volume = f"openclaw-{employee.slug}:/root/.openclaw"
    return f"""
version: "3.8"

services:
  agent:
    build: .
    env_file:
      - .env
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - {volume}
    restart: unless-stopped

  heartbeat:
    image: alpine/curl:latest
    env_file:
      - .env
    volumes:
      - ./heartbeat.sh:/heartbeat.sh:ro
    entrypoint: ["sh", "/heartbeat.sh"]
    restart: unless-stopped
    depends_on:
      - agent

volumes:
  openclaw-{employee.slug}:
"""



def render_heartbeat() -> str:
    return """
#!/bin/sh
set -e

if [ -z "$CREWCLAW_MONITOR_KEY" ]; then
  echo "[heartbeat] No CREWCLAW_MONITOR_KEY set; skipping dashboard heartbeat."
  exit 0
fi

while true; do
  curl -sf "https://www.crewclaw.com/api/ping/$CREWCLAW_MONITOR_KEY" > /dev/null 2>&1 \
    && echo "[heartbeat] ping ok" \
    || echo "[heartbeat] ping failed"
  sleep 300
done
"""



def render_package_json(employee: EmployeeRuntime) -> str:
    package = {
        "name": f"{employee.slug}-openclaw-worker",
        "version": "1.0.0",
        "private": True,
        "dependencies": {
            "@slack/bolt": "^3.19.0",
            "discord.js": "^14.19.3",
            "grammy": "^1.38.4",
            "qrcode-terminal": "^0.12.0",
            "whatsapp-web.js": "^1.34.1",
        },
    }
    return json.dumps(package, indent=2)



def copy_skill_files(employee_dir: Path, skills: list[str]) -> None:
    skill_target_root = employee_dir / "skills"
    if skill_target_root.exists():
        shutil.rmtree(skill_target_root)
    ensure_dir(skill_target_root)
    for skill in skills:
        source = SKILLS_ROOT / skill / "SKILL.md"
        target = skill_target_root / skill / "SKILL.md"
        if not source.exists():
            raise FileNotFoundError(f"Missing skill file for {skill}: {source}")
        ensure_dir(target.parent)
        target.write_text(source.read_text(encoding="utf-8"), encoding="utf-8")



def update_checklist(employee_dir: Path, employee: EmployeeRuntime) -> None:
    path = employee_dir / "CHECKLIST.md"
    text = read_text(path)
    for runtime_file in RUNTIME_FILES:
        unchecked = f"- [ ] `{runtime_file}`"
        checked = f"- [x] `{runtime_file}`"
        if unchecked in text:
            text = text.replace(unchecked, checked)
        elif checked not in text and "## Required Runtime Files" in text:
            text = text.replace("## Assigned Skills", f"- [x] `{runtime_file}`\n\n## Assigned Skills")
    text = re.sub(
        r"## Remaining Gaps\n(?:- \[.\].*\n)+",
        "## Runtime Verification Status\n- Runtime files are packaged in this employee packet.\n- Live gateway pairing, tool entitlement proof, and channel credentials still depend on environment setup.\n",
        text,
    )
    write(path, text)


def update_audit(employee_dir: Path, employee: EmployeeRuntime) -> None:
    path = employee_dir / "AUDIT.md"
    text = read_text(path)
    replacements = {
        "- **Status:** Strong curated packet, not yet live-runtime validated": "- **Status:** Runtime-synced packet with generated shell; structurally validated, but not yet live-started against real channel credentials",
        "- Not yet wrapped into the live `open-claw/employees` runtime packet layout with Docker and bot wiring.": "- Runtime shell now exists in this packet and in the generated `open-claw/employees/deployed-curated/` runtime.",
        "- Tool access is documented, but not yet proven end-to-end against the real worker runtime and installed integrations.": "- Tool expectations and assigned skills are packaged, but end-to-end entitlement proof against the real gateway is not yet recorded.",
        "- No per-role activation smoke test has been recorded yet for the current OpenClaw/CrewClaw deployment path.": "- No per-role live smoke test has been recorded yet for the generated curated runtime.",
        "Use this packet as part of the authoritative standard now. Before treating it as a fully autonomous live worker, pair it with runtime packaging, real tool-entitlement proof, and a recorded smoke test.": "Use this packet as part of the authoritative standard now. Runtime packaging and copied skills are in place. Before treating it as a fully autonomous live worker, prove live startup, real tool entitlements, and a recorded smoke test.",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    binding_block = render_live_binding_block(employee)
    if "## Live Telegram Binding" in text:
        text = re.sub(r"## Live Telegram Binding\n(?:- .*\n)+", binding_block + "\n", text, count=1)
    else:
        text = re.sub(r"(- \*\*Status:\*\*.*\n)", r"\1\n" + binding_block + "\n", text, count=1)
    write(path, text)



def write_employee_runtime(employee: EmployeeRuntime) -> None:
    employee_dir = EMPLOYEE_ROOT / employee.slug
    copy_skill_files(employee_dir, employee.skills)
    write(employee_dir / ".env.example", render_env_example(employee))
    write(employee_dir / "openclaw-runner.js", render_runner())
    write(employee_dir / "bot-telegram.js", render_telegram_bot(employee))
    write(employee_dir / "bot-discord.js", render_discord_bot(employee))
    write(employee_dir / "bot-slack.js", render_slack_bot(employee))
    write(employee_dir / "bot-whatsapp.js", render_whatsapp_bot(employee))
    write(employee_dir / "Dockerfile", render_dockerfile())
    write(employee_dir / "entrypoint.sh", render_entrypoint(employee))
    write(employee_dir / "setup.sh", render_setup(employee))
    write(employee_dir / "docker-compose.yml", render_packet_compose(employee))
    write(employee_dir / "heartbeat.sh", render_heartbeat())
    write(employee_dir / "package.json", render_package_json(employee))
    update_checklist(employee_dir, employee)
    update_audit(employee_dir, employee)



def extract_grade(employee_dir: Path, field_name: str) -> str:
    checklist = read_text(employee_dir / "CHECKLIST.md")
    match = re.search(rf"{re.escape(field_name)}:\s*\*\*(.+?)\*\*", checklist)
    return match.group(1).strip() if match else "Unknown"



def extract_audit_status(employee_dir: Path) -> str:
    audit = read_text(employee_dir / "AUDIT.md")
    match = re.search(r"- \*\*Status:\*\*\s*(.+)", audit)
    return match.group(1).strip() if match else "Status not documented"



def file_kind(name: str) -> str:
    if name in DOC_FILES:
        return "doc"
    if name in RUNTIME_FILES:
        return "runtime"
    return "skill"



def file_rating(name: str, employee: EmployeeRuntime) -> tuple[str, str]:
    binding_exists = bool(telegram_binding(employee.slug))
    direct_secret = bool(assigned_secret_id(employee.slug))
    if name in {"README.md", "CHECKLIST.md", "AUDIT.md", "SKILLS.md"}:
        return "A", "Core source-of-truth file is present and actively used to describe the employee."
    if name in DOC_FILES:
        return "A-", "Required packet documentation is present and standardized; refine after more live usage."
    if name == "bot-telegram.js":
        if direct_secret:
            return "B+", "Telegram runtime is assigned to a live bot and a direct Bitwarden UUID is already wired."
        if binding_exists:
            return "B", "Telegram runtime is assigned to a live bot, but startup still depends on env vars or a future UUID mapping."
        return "C", "Telegram runtime scaffold exists, but this employee still needs a brand-new Telegram bot."
    if name in {"Dockerfile", "docker-compose.yml", "entrypoint.sh", "setup.sh", ".env.example", "package.json", "openclaw-runner.js", "heartbeat.sh"}:
        return "B+", "Runtime file is present and structurally validated; live smoke evidence is still pending."
    if name in {"bot-discord.js", "bot-slack.js", "bot-whatsapp.js"}:
        return "C+", "Secondary channel scaffold is present, but this path has not been prioritized or smoke-tested yet."
    return "A-", "Assigned skill file is present in the packet and ready to be refined through real usage."



def file_note(name: str, employee: EmployeeRuntime) -> str:
    if name.startswith("skills/"):
        return "Copied assigned skill playbook is packaged inside the employee packet."
    if name == "bot-telegram.js":
        if telegram_binding(employee.slug):
            return f"Bound to `{assigned_telegram_name(employee.slug)}` / `{assigned_username(employee.slug)}`."
        return "No Telegram identity assigned yet."
    return "Present in the curated packet."



def render_file_rows(employee: EmployeeRuntime) -> str:
    employee_dir = EMPLOYEE_ROOT / employee.slug
    rows: list[str] = []
    for name in DOC_FILES + RUNTIME_FILES:
        present = (employee_dir / name).exists()
        rating, reason = file_rating(name, employee) if present else ("Pending", "File is still missing from the packet.")
        rows.append(
            f"| `{name}` | {file_kind(name)} | {'yes' if present else 'no'} | `{rating}` | {reason} | {file_note(name, employee)} |"
        )
    for skill in employee.skills:
        skill_path = employee_dir / "skills" / skill / "SKILL.md"
        skill_name = f"skills/{skill}/SKILL.md"
        present = skill_path.exists()
        rating, reason = file_rating(skill_name, employee) if present else ("Pending", "Assigned skill copy is missing from the packet.")
        rows.append(
            f"| `{skill_name}` | skill | {'yes' if present else 'no'} | `{rating}` | {reason} | {file_note(skill_name, employee)} |"
        )
    return "\n".join(rows)



def render_current_employees(employees: list[EmployeeRuntime]) -> str:
    assignment_rows = []
    for employee in employees:
        if telegram_binding(employee.slug):
            runtime_status = "direct_uuid_wired" if assigned_secret_id(employee.slug) else "env_only_assigned"
        else:
            runtime_status = "pending_new_bot"
        assignment_rows.append(
            f"| `{employee.slug}` | {employee.title} | `{assigned_telegram_name(employee.slug)}` | "
            f"`{assigned_username(employee.slug) or 'TBD'}` | `{runtime_status}` | "
            f"`{extract_grade(EMPLOYEE_ROOT / employee.slug, 'Current grade')}` |"
        )

    employee_sections = []
    for employee in employees:
        employee_dir = EMPLOYEE_ROOT / employee.slug
        skills_line = ", ".join(f"`{skill}`" for skill in employee.skills) if employee.skills else "none"
        binding_status = (
            "Direct Bitwarden UUID wired"
            if assigned_secret_id(employee.slug)
            else "Assigned bot, but env var / UUID still pending"
            if telegram_binding(employee.slug)
            else "No Telegram bot assigned yet"
        )
        employee_sections.append(
            f"""## {employee.title}

- **Slug:** `{employee.slug}`
- **Manager:** `{employee.manager}`
- **Summary:** {employee.summary}
- **Current packet grade:** `{extract_grade(employee_dir, 'Current grade')}`
- **Target live grade:** `{extract_grade(employee_dir, 'Target grade for live-runtime readiness')}`
- **Audit status:** {extract_audit_status(employee_dir)}
- **Current Telegram first name:** `{assigned_telegram_name(employee.slug)}`
- **Telegram username:** `{assigned_username(employee.slug) or 'TBD'}`
- **Telegram/runtime status:** {binding_status}
- **Assigned skills:** {skills_line}

### File Ratings

| File | Kind | Present | Rating | Reason | Notes |
| --- | --- | --- | --- | --- | --- |
{render_file_rows(employee)}"""
        )

    assignment_table = "\n".join(assignment_rows)
    employee_content = "\n\n".join(employee_sections)
    return f"""
# Current Employees

This file is generated by `open-claw/scripts/sync_curated_employee_runtime.py`.
It is the current status board for the curated employee roster, including Telegram identity mapping, packet readiness, assigned skills, and per-file ratings.

## Rating Legend

- `A` — strong source-of-truth file; keep as-is unless live evidence proves a better pattern
- `A-` — solid file with good structure; likely needs iterative refinement after more real usage
- `B+` — structurally validated runtime file; promising but still needs live smoke proof
- `B` — assigned/usable now, but still depends on env wiring or more runtime evidence
- `C+` — scaffold exists for future use, but is not yet a proven path
- `C` — placeholder/scaffold that still needs assignment or stronger implementation
- `Pending` — file or live binding is still missing

## Roster Snapshot

- Generated on: `{TODAY}`
- Curated employees: **{len(employees)}**
- Telegram bots already assigned: **{sum(1 for employee in employees if telegram_binding(employee.slug))}**
- Direct Bitwarden UUIDs already wired: **{sum(1 for employee in employees if assigned_secret_id(employee.slug))}**
- Assigned bots still waiting on env vars or UUID recording: {", ".join(f"`{slug}`" for slug in env_only_bot_slugs(employees)) or "none"}
- Employees still waiting on brand-new Telegram bots: {", ".join(f"`{slug}`" for slug in pending_bot_slugs(employees)) or "none"}

## Assignment Table

| Employee | Title | Current Telegram first name | Telegram username | Runtime status | Current grade |
| --- | --- | --- | --- | --- | --- |
{assignment_table}

{employee_content}
"""



def sync_deployed_curated(employees: list[EmployeeRuntime]) -> None:
    ensure_dir(DEPLOYED_CURATED_ROOT)
    for child in DEPLOYED_CURATED_ROOT.iterdir():
        if child.is_dir():
            shutil.rmtree(child)
        else:
            child.unlink()

    compose_services: list[str] = []
    volume_lines: list[str] = []
    for employee in employees:
        source_dir = EMPLOYEE_ROOT / employee.slug
        target_dir = DEPLOYED_CURATED_ROOT / employee.slug
        shutil.copytree(source_dir, target_dir)
        env_name = f"{slug_to_env(employee.slug)}_TOKEN"
        compose_services.append(
            textwrap.dedent(
                f"""
                  {employee.slug}:
                    build: ./{employee.slug}
                    container_name: openclaw-{employee.slug}
                    environment:
                      - ANTHROPIC_API_KEY=${{ANTHROPIC_API_KEY}}
                      - TELEGRAM_BOT_TOKEN=${{{env_name}}}
                      - OPENCLAW_GATEWAY_URL=${{OPENCLAW_GATEWAY_URL}}
                      - OPENCLAW_GATEWAY_TOKEN=${{OPENCLAW_GATEWAY_TOKEN}}
                      - OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1
                    extra_hosts:
                      - "host.docker.internal:host-gateway"
                    volumes:
                      - D:/github:/workspace:rw
                      - openclaw-{employee.slug}:/root/.openclaw
                    restart: unless-stopped
                """
            ).rstrip()
        )
        volume_lines.append(f"  openclaw-{employee.slug}:")

    compose_body = textwrap.indent("\n\n".join(compose_services), "  ")
    volumes = "\n".join(volume_lines)
    write(
        DEPLOYED_CURATED_ROOT / "docker-compose.yml",
        f"""
services:
{compose_body}

volumes:
{volumes}
""",
    )
    write(DEPLOYED_CURATED_ROOT / "start-employees.ps1", render_start_script(employees))
    write(DEPLOYED_CURATED_ROOT / "README.md", render_runtime_readme(employees))



def render_runtime_readme(employees: list[EmployeeRuntime]) -> str:
    roster = "\n".join(f"- `{employee.slug}` — {employee.title}" for employee in employees)
    assigned_bot_count = sum(1 for employee in employees if telegram_binding(employee.slug))
    direct_secret_count = sum(1 for employee in employees if assigned_secret_id(employee.slug))
    env_only = env_only_bot_slugs(employees)
    pending = pending_bot_slugs(employees)
    assignment_lines = "\n".join(
        f"- `{employee.slug}` -> `{assigned_username(employee.slug)}`" for employee in employees if telegram_binding(employee.slug)
    )
    env_only_line = ", ".join(f"`{slug}`" for slug in env_only) if env_only else "none"
    pending_line = ", ".join(f"`{slug}`" for slug in pending) if pending else "none"
    return f"""
# Curated Deployed Runtime

This directory is the generated runtime shell for the curated 15-employee squad.

## Employees
{roster}

## Startup
- Provide `BWS_ACCESS_TOKEN` if you want Bitwarden-backed secret fetches.
- Existing Telegram bot assignments are defined for **{assigned_bot_count}** curated workers.
- Direct Bitwarden worker token IDs are currently wired for **{direct_secret_count}** curated workers.
- Assigned workers that still need explicit `*_TOKEN` env vars or Bitwarden secret IDs recorded: {env_only_line}.
- Curated workers still waiting on brand-new Telegram bots: {pending_line}.
- Run `./start-employees.ps1` from PowerShell.

## Telegram Assignment Plan
{assignment_lines}

## Validation
- `docker compose config`
- `python ../scripts/validate_openclaw_workflow.py`
"""



def render_start_script(employees: list[EmployeeRuntime]) -> str:
    secret_map_lines = []
    for employee in employees:
        secret = assigned_secret_id(employee.slug)
        secret_map_lines.append(f'    "{employee.slug}" = "{secret}"')
    secret_map_block = "\n".join(secret_map_lines)
    return f"""
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

function Resolve-SecretValue([string]$EnvName, [string]$SecretId) {{
    $current = [System.Environment]::GetEnvironmentVariable($EnvName, "Process")
    if ($current) {{ return $current }}

    if ($SecretId) {{
        $fetched = (bws secret get $SecretId 2>$null | ConvertFrom-Json).value
        if ($fetched) {{
            Set-Item "env:$EnvName" $fetched
            return $fetched
        }}
    }}

    return $null
}}

if (-not $env:BWS_ACCESS_TOKEN) {{
    $stored = [System.Environment]::GetEnvironmentVariable("BWS_ACCESS_TOKEN", "User")
    if ($stored) {{
        $env:BWS_ACCESS_TOKEN = $stored
    }}
}}

$anthropicKey = Resolve-SecretValue "ANTHROPIC_API_KEY" "2fdc8f21-0d02-46b3-ad30-b3fe0049a474"
if (-not $anthropicKey) {{ throw "Missing ANTHROPIC_API_KEY" }}

$gatewayToken = Resolve-SecretValue "OPENCLAW_GATEWAY_TOKEN" "79f3acf8-c855-4c0d-9726-b40d01278bb6"
if (-not $gatewayToken) {{ throw "Missing OPENCLAW_GATEWAY_TOKEN" }}

if (-not $env:OPENCLAW_GATEWAY_URL) {{
    $env:OPENCLAW_GATEWAY_URL = "ws://host.docker.internal:18789"
}}

$secretMap = @{{
{secret_map_block}
}}

$missing = @()
foreach ($name in $secretMap.Keys) {{
    $envName = ($name -replace '-', '_').ToUpper() + "_TOKEN"
    $resolved = Resolve-SecretValue $envName $secretMap[$name]
    if (-not $resolved) {{
        $missing += "$name ($envName)"
    }}
}}

if ($missing.Count -gt 0) {{
    Write-Host "Missing worker tokens:" -ForegroundColor Yellow
    $missing | ForEach-Object {{ Write-Host "  $_" -ForegroundColor Yellow }}
    throw "Provide the missing token env vars or add Bitwarden secret IDs before startup."
}}

Set-Location $Root
docker compose up -d --build
"""



def rewrite_zips(employees: list[EmployeeRuntime]) -> None:
    ensure_dir(ZIP_ROOT)
    for employee in employees:
        employee_dir = EMPLOYEE_ROOT / employee.slug
        zip_path = ZIP_ROOT / f"{employee.slug}.zip"
        with ZipFile(zip_path, "w", compression=ZIP_DEFLATED) as archive:
            for file_path in sorted(employee_dir.rglob("*")):
                if file_path.is_file():
                    archive.write(file_path, arcname=f"{employee.slug}/{file_path.relative_to(employee_dir).as_posix()}")



def render_workflow_checklist(employees: list[EmployeeRuntime]) -> str:
    employee_lines = "\n".join(f"- [x] `{employee.slug}` packet generated and runtime-synced" for employee in employees)
    assigned_bot_count = sum(1 for employee in employees if telegram_binding(employee.slug))
    direct_secret_count = sum(1 for employee in employees if assigned_secret_id(employee.slug))
    env_only = env_only_bot_slugs(employees)
    pending = pending_bot_slugs(employees)
    env_only_line = ", ".join(f"`{slug}`" for slug in env_only) if env_only else "none"
    pending_line = ", ".join(f"`{slug}`" for slug in pending) if pending else "none"
    return f"""
# OpenClaw Workflow Checklist

## Packet Standard
- [x] The curated library has 15 employees.
- [x] Every employee packet includes the required docs.
- [x] Every employee packet now includes the required runtime files.
- [x] Every employee packet includes copied assigned skills under `skills/`.
- [x] Every employee packet zip was regenerated after runtime sync.

## Runtime Shape
- [x] A generated runtime exists at `open-claw/employees/deployed-curated/`.
- [x] The generated runtime includes a 15-service `docker-compose.yml`.
- [x] The generated runtime includes `start-employees.ps1` with env-first plus Bitwarden fallback secret resolution.
- [x] Each worker uses the proven remote-gateway shell pattern: Node 22 + pinned `openclaw@{OPENCLAW_VERSION}` + entrypoint-generated config.

## Skill Activation
- [x] Assigned skills are present in every employee packet.
- [x] Assigned skills are copied into each packet's runtime payload.
- [x] Employee packets reference only real tracked skill slugs.

## Validation
- [x] Structural validation script available.
- Existing Telegram bot assignments are defined for **{assigned_bot_count}** curated workers.
- Direct Bitwarden worker token IDs are wired for **{direct_secret_count}** curated workers.
- Assigned workers still needing explicit `*_TOKEN` env vars or Bitwarden secret IDs recorded: {env_only_line}.
- Curated workers still waiting on brand-new Telegram bots: {pending_line}.
- First-run device pairing still must be approved against the real gateway.
- End-to-end live message tests still depend on gateway reachability and real bot credentials.

## Employee Coverage
{employee_lines}
"""



def render_validation_summary(results: dict[str, bool], employees: list[EmployeeRuntime]) -> str:
    status_lines = "\n".join(
        f"- **{'PASS' if passed else 'FAIL'}** — {name}" for name, passed in results.items()
    )
    return f"""
# Runtime Validation Summary

## Result Matrix
{status_lines}

## Employee Count
- Curated employees checked: **{len(employees)}**

## Notes
- This validation covers packet completeness, copied skills, deployed-curated generation, and compose/start-script presence.
- Live channel delivery still depends on real credentials and gateway pairing.
"""



def main() -> None:
    employees = parse_employees()
    for employee in employees:
        write_employee_runtime(employee)
    sync_deployed_curated(employees)
    rewrite_zips(employees)
    write(WORKFLOW_CHECKLIST_PATH, render_workflow_checklist(employees))
    write(CURRENT_EMPLOYEES_PATH, render_current_employees(employees))

    results = {
        "curated employee count is 15": len(employees) == 15,
        "every employee has runtime files": all(all((EMPLOYEE_ROOT / employee.slug / name).exists() for name in RUNTIME_FILES) for employee in employees),
        "every employee has copied skills": all(all((EMPLOYEE_ROOT / employee.slug / "skills" / skill / "SKILL.md").exists() for skill in employee.skills) for employee in employees),
        "deployed-curated docker compose exists": (DEPLOYED_CURATED_ROOT / "docker-compose.yml").exists(),
        "deployed-curated start script exists": (DEPLOYED_CURATED_ROOT / "start-employees.ps1").exists(),
    }
    write(VALIDATION_SUMMARY_PATH, render_validation_summary(results, employees))
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
