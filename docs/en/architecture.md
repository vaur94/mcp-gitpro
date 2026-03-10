# Architecture

Turkce surum: [docs/tr/architecture.md](../tr/architecture.md)

## Runtime layers

- `src/index.ts` bootstraps the stdio server through `ApplicationRuntime`, `createMcpServer`, and `startStdioServer`
- `src/config/` defines schema, defaults, and config loading
- `src/core/tool-filtering.ts` applies read-only and allowlist filtering
- `src/github/client.ts` centralizes GitHub API requests, auth checks, download URLs, and output clamping
- `src/tools/` contains tool families for context, repositories, search, issues, pull requests, and Actions

## Request flow

1. Config is loaded.
2. A `GitHubClient` is created per request context.
3. The tool list is filtered by `toolsets`, `tools`, and `readOnly`.
4. The stdio server exposes the remaining MCP tools.

## Product boundaries

This repository intentionally avoids local git automation, filesystem editing, shell execution, browser automation, and HTTP transport in v1.

Last updated: 2026-03-10
