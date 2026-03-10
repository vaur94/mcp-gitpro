# Usage

Turkce surum: [docs/tr/usage.md](../tr/usage.md)

## Start the server from the repository

```bash
export MCP_GITPRO_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
node ./dist/index.js --config ./mcp-gitpro.config.json
```

`src/index.ts` loads config, builds the MCP runtime, creates the tool set, and starts a stdio server.

## CLI entrypoint

The published package exposes `mcp-gitpro` through `bin/cli.js`. The CLI imports `dist/index.js`, forwards CLI arguments, and writes fatal errors to stderr as JSON.

## Configuration sources

Runtime config comes from:

1. built-in defaults
2. `mcp-gitpro.config.json`
3. `MCP_GITPRO_*` environment variables
4. CLI flags handled by `mcpbase`

## Tool surface

The tool registry contains 10 tools across these toolsets:

- `context`
- `repos`
- `search`
- `issues`
- `pull_requests`
- `actions`

Read-only mode removes write-capable tools from the registered list before the server exposes them.

Last updated: 2026-03-10
