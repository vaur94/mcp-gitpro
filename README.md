# mcp-gitpro

🇬🇧 English | [🇹🇷 Turkce](./README.tr.md)

> `mcp-gitpro` is a stdio-first GitHub MCP server for AI agents, built on `@vaur94/mcpbase` with a compact, context-efficient tool surface.

## Why mcp-gitpro

- GitHub cloud workflows only: no local git CLI and no filesystem editing overlap
- Small tool inventory with high-value read/write coverage
- Read-only mode plus toolset and exact-tool allowlists to reduce context waste
- Bilingual docs and IDE integration guides for OpenCode, VS Code, and Antigravity

## Toolsets

- `context`
- `repos`
- `search`
- `issues`
- `pull_requests`
- `actions`

## Tools

- `github_context`
- `repository_read`
- `repository_compare`
- `search_github`
- `issue_read`
- `issue_write`
- `pull_request_read`
- `pull_request_write`
- `actions_read`
- `actions_write`

## Quick Start

```bash
npm install
npm run build
npm test
```

Set `MCP_GITPRO_GITHUB_TOKEN` or place it in `mcp-gitpro.config.json`.

## Project Layout

```text
src/
  config/
  github/
  core/
  shared/
  tools/
tests/
  unit/
  protocol/
docs/
```

## mcpbase Integration

- `mcp-gitpro` depends on `@vaur94/mcpbase` from npm; it does not fork or vendor the base framework.
- Startup is wired manually with `ApplicationRuntime`, `createMcpServer`, and `startStdioServer` for tighter control over GitHub-specific context creation.
- Configuration extends `mcpbase` with `createRuntimeConfigSchema` and `loadConfig`, while per-tool execution context extends `BaseToolExecutionContext` with `GitHubClient`.
- Streamable HTTP, telemetry, and generic filesystem or shell security helpers remain intentionally unused because this product stays stdio-first and GitHub-API focused.

## Documentation

- [English docs index](./docs/README.en.md)
- [Turkce docs index](./docs/README.tr.md)
- [Configuration](./docs/en/configuration.md)
- [Tools](./docs/en/tools.md)
- [OpenCode integration](./docs/en/integration/opencode.md)
- [VS Code integration](./docs/en/integration/vscode.md)
- [Antigravity integration](./docs/en/integration/antigravity.md)

## Non-goals

- local git CLI workflows
- filesystem editing or patch application
- shell execution
- browser automation
- HTTP transport in v1
