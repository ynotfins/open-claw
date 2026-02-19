# Open Claw — Requirements

## Core capabilities

- **Code assistance**: Navigate, search, edit, and refactor code using MCP tools
- **App development support**: Scaffold, build, test, and deploy projects
- **Communication**: Interact with messaging and notification systems
- **MCP tool leverage**: Maximize installed MCP tools for all operations
- **Persistent memory**: Store and recall decisions, patterns, and context across sessions

## Functional requirements

- Orchestrator accepts natural-language instructions and routes to appropriate module
- Memory module persists facts, decisions, and patterns per the memory contract
- Dev module interfaces with code-intelligence and repo tools
- Comms module interfaces with messaging and notification services
- Web module interfaces with browser automation and extraction tools

## Non-functional requirements

- Modular: each module can be developed and tested independently
- Transparent: all actions logged with PASS/FAIL evidence
- Secure: no secrets in code or docs; credentials managed externally
- Extensible: new modules and integrations can be added without modifying core

## Out of scope (for now)

- Autonomous long-running agents (all actions are human-triggered)
- Multi-user collaboration (single-user assistant)
- Hosting or deployment infrastructure
