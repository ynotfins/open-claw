# Tools

## Primary Tools
- repo search
- git review
- web research
- Context7 docs
- artifact review
- exec (shell — Linux gateway and Windows node)

## Tooling Expectations
- Use Context7 when framework or library behavior matters.
- Use browser and screenshot tooling when UX claims need proof.
- Use git and diff review for every meaningful code change.
- Use tests and build outputs as evidence, not decoration.

## Exec Routing

Two exec hosts are available. The default is the Linux gateway (WSL Ubuntu).

### Linux gateway (default) — `host=gateway`
Runs on the WSL Ubuntu machine where the OpenClaw gateway lives.
Use for: `openclaw` CLI, bash/sh, Linux tools, file ops in the Linux filesystem.

```
exec openclaw security audit --deep
exec openclaw doctor
exec bash -c "cat /etc/os-release"
```

### Windows Desktop node — `host=node`
Routes to the paired Windows Desktop node via `system.run`.
Use for: PowerShell, Windows CLI tools, WSL2 commands from Windows, Windows file ops.

```
exec --host node pwsh -NoProfile -Command "Get-Process | Select-Object -First 10"
exec --host node pwsh -NoProfile -File "D:\github\AI-Project-Manager\scripts\restart-openclaw-gateway.ps1"
exec --host node wsl -d Ubuntu -- openclaw security audit --deep
exec --host node wsl -d Ubuntu -- bash -c "systemctl status openclaw"
exec --host node cmd /c dir "D:\github"
```

### Elevated Windows execution — `host=node` with elevated node-host
For admin-level Windows operations, the Windows node-host must be running as Administrator.
To start the node-host elevated: right-click `node.cmd` → Run as administrator.
When node-host is elevated, all `exec --host node` commands inherit that elevation.

```
exec --host node pwsh -NoProfile -Command "Get-WindowsCapability -Online | Where State -eq Installed"
exec --host node pwsh -NoProfile -Command "netsh interface show interface"
```

### Elevated Linux execution — `/elevated` directive
Send `/elevated` to switch Sparky into elevated mode (Tony's Telegram only).
In elevated mode, exec commands can use `sudo` on the Linux gateway.

```
exec sudo systemctl restart openclaw
exec sudo journalctl -u openclaw -n 50
```

## Exec Security Policy
- `security: full` on both gateway and node — all commands run without allowlist gates.
- `ask: off` — no human approval prompt required for exec.
- `elevated.allowed: true` on both sides — elevated execution is permitted.
- No secrets in exec commands; inject via environment or Bitwarden-backed env.
