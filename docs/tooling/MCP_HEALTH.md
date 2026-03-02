# MCP Health Log

## 2026-02-24 — Filesystem MCP Setup Attempts

### Environment
| Tool | Version |
|------|---------|
| node | v22.18.0 |
| npm | 11.7.0 |
| pnpm | 10.24.0 |
| corepack | 0.33.0 |
| WSL distro | Ubuntu |

### Attempt 1 — FAIL (bhushangitfull remote)
- **Config**: `"Filesystem": { "type": "http", "url": "https://file-mcp-smith--bhushangitfull.run.tools" }`
- **Error**: Wrong server entirely — bhushangitfull/file-mcp-smith (Python/Smithery), not the official Node.js server

### Attempt 2 — FAIL (wrong Desktop/Documents paths)
- **Config**: `filesystem` with `C:\Users\ynotf\Desktop`, `C:\Users\ynotf\Documents`
- **Error log**:
  ```
  [error] Error accessing directory C:\Users\ynotf\Desktop: ENOENT: no such file or directory
  ```
- **Root cause**: OneDrive redirects Desktop/Documents to `C:\Users\ynotf\OneDrive\Desktop`

### Attempt 3 — FAIL (forward slashes, %3A encoding)
- **Config**: `filesystem` with `D:/github`, `C:/Users/ynotf/OneDrive/Desktop`, `C:/Users/ynotf/OneDrive/Documents`
- **Error log**:
  ```
  [error] Skipping invalid path or inaccessible: file:///d%3A/github/open--claw
  [error] No valid root directories provided by client
  ```
- **Root cause**: Cursor sends workspace root as `file:///d%3A/...` (URL-encodes `:`). Server rejects it.
  The server connected successfully but then failed the ListRootsRequest step.
  Also: `[warning] No serverName provided for adapter, falling back to stripIdentifierPrefix`

### Attempt 4 — PENDING VERIFICATION (current)
- **Config name**: `filesystem-windows`
- **Command**: `npx -y @modelcontextprotocol/server-filesystem`
- **Args**: `D:\github`, `C:\Users\ynotf\OneDrive\Desktop`, `C:\Users\ynotf\OneDrive\Documents`
- **WSL root**: `\\wsl.localhost\Ubuntu\mnt\d\github` — ACCESS DENIED (WSL_ROOT_MISSING)
- **Smoke test**: PASS — "Secure MCP Filesystem Server running on stdio" (no errors)
- **Cursor registration**: PENDING — requires Reload Window

### WSL Cross-Platform Status
- `Test-Path "D:\github"` → **True**
- `Test-Path "\\wsl.localhost\Ubuntu\mnt\d\github"` → **Access denied** (BLOCKED)
- WSL proof: **BLOCKED** — UNC path access denied from PowerShell

### Fix steps for WSL root (future):
```powershell
# Enable WSL localhost forwarding
# In WSL Ubuntu:
wsl -d Ubuntu -e bash -c 'ls /mnt/d/github'
# If that works, the issue is UNC path permissions on Windows side
# Try: net use \\wsl.localhost\Ubuntu /persistent:no
```

---

### Attempt 5 — PASS (current working config)
- **Config location**: project-level `D:\github\open--claw\.cursor\mcp.json` (gitignored)
- **Server identifier in agent context**: `project-0-open--claw-filesystem-windows`
- **Global `~/.cursor/mcp.json`**: duplicate entry removed (was causing two instances)
- **Key finding**: Global MCP servers show green in UI but are NOT injected into agent `CallMcpTool` context. Only project-level `.cursor/mcp.json` servers are callable by the agent.

## Proof Reads — FINAL RESULTS

| Test | Path | Status | Evidence |
|------|------|--------|----------|
| Windows read 1 | `D:\github\open--claw\README.md` | **PASS** | Full README content returned |
| Windows list | `D:\github\open--claw` | **PASS** | 9 entries listed (.cursor, .git, docs, etc.) |
| Cross-project read | `D:\github\AI-Project-Manager\AGENTS.md` | **PASS** | Full AGENTS.md content returned |
| Cross-project list | `D:\github\AI-Project-Manager` | **PASS** | Directory info + 6 entries returned |
| WSL UNC read | `\\wsl.localhost\Ubuntu\mnt\d\github\...` | **BLOCKED** | UNC access denied from PowerShell |

## Final Status: PASS (Windows), BLOCKED (WSL cross-platform)

---

## 2026-02-25 — OpenMemory MCP Health Check

### A) Global MCP presence

| Check | Result |
|-------|--------|
| `openmemory` key in `~/.cursor/mcp.json` | **PRESENT** |
| Server type | SSE (`url: https://api.openmemory.dev/mcp-stream?client=cursor`) |
| Tools registered (`add_memories` / `search_memory` etc.) | **FAIL — 0 tools** |
| `mcps/user-openmemory/STATUS.md` | `"The MCP server errored"` |
| `mcps/user-openmemory/tools/` directory | **Empty — server never exposed tools** |

### B) Root cause

`Authorization` header in `~/.cursor/mcp.json` is **blank** (`"Authorization": ""`).  
OpenMemory SSE endpoint requires a Bearer token. Server returns an auth error before the handshake completes, so Cursor cannot enumerate tools.

### C) Functional proof

| Operation | Status | Reason |
|-----------|--------|--------|
| `add_memories` | **FAIL** | Tool not found (server errored) |
| `search_memory` | **FAIL** | Tool not found (server errored) |
| `list_memories` | **FAIL** | Tool not found (server errored) |

### D) Fix steps (BLOCKED — requires user action)

1. Go to [https://app.openmemory.ai](https://app.openmemory.ai) → Settings → API Keys.
2. Copy your API key (format: `Bearer <key>`).
3. Open `~/.cursor/mcp.json` and update the openmemory entry:
   ```json
   "openmemory": {
     "headers": {
       "Authorization": "Bearer YOUR_KEY_HERE"
     },
     "url": "https://api.openmemory.dev/mcp-stream?client=cursor"
   }
   ```
4. Cursor → Reload Window.
5. Confirm tools appear: `add_memories`, `search_memory`, `list_memories`, `delete_all_memories`.
6. Rerun this verification mission.

### Status: BLOCKED (missing auth token)
